import { DB } from "./db";
import { CFile } from "./file";

export class CPost {

    //новая тема для обсуждений
    static async Add ( fields ) {
        try {
            fields.file_ids = new DB().arObjectID(fields.file_ids)
            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            if (fields.to_group_id)
                delete fields.to_user_id

            let collection = DB.Client.collection('post');

            let result = await collection.insertOne(fields)
            return fields

        } catch (err) {
            console.log(err)
            throw ({err: 6001000, msg: 'CPost Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = new DB().arObjectID(ids)

            let collection = DB.Client.collection('post');
            let result = await collection.aggregate([
                { $match:
                        {
                            _id: {$in: ids}
                        }
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'file_ids',
                            foreignField: '_id',
                            as: '_file_ids',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
                                        }
                                },
                                {
                                    $unwind:
                                        {
                                            path: '$_file_id',
                                            preserveNullAndEmptyArrays: true
                                        }
                                }
                            ]
                        },
                },
                {
                    $unwind:
                        {
                            path: '$_file_ids',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]).toArray();

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 6002000, msg: 'CPost GetById'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {

            let collection = DB.Client.collection('post')

            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)

            let arAggregate = [{
                $match: {},
            },{
                $lookup:
                    {
                        from: 'file',
                        localField: 'file_ids',
                        foreignField: '_id',
                        as: '_file_ids',
                        pipeline: [
                            { $lookup:
                                    {
                                        from: 'file',
                                        localField: 'file_id',
                                        foreignField: '_id',
                                        as: '_file_id'
                                    }
                            },{
                                $unwind:
                                    {
                                        path: '$_file_id',
                                        preserveNullAndEmptyArrays: true
                                    }
                            }
                        ]
                    },
            },{
                $lookup:
                    {
                        from: 'user',
                        localField: 'from_id',
                        foreignField: '_id',
                        as: '_from_id',
                        pipeline: [
                            { $lookup:
                                    {
                                        from: 'file',
                                        localField: 'photo',
                                        foreignField: '_id',
                                        as: '_photo'
                                    }
                            },{
                                $unwind:
                                    {
                                        path: '$_photo',
                                        preserveNullAndEmptyArrays: true
                                    }
                            }
                        ]
                    },
            },{
                $unwind:
                    {
                        path: '$_from_id',
                        preserveNullAndEmptyArrays: true
                    }
            },{
                $sort: {
                    _id: -1
                }

            }]

            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            if ((fields.to_user_id) && (!fields.to_group_id)) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id

            let result = await collection.aggregate(arAggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray();
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 6003000, msg: 'CPost Get'})
        }
    }

    //количество
    static async GetCount ( fields ) {
        try {
            let collection = DB.Client.collection('post')

            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)

            let arAggregate = [{
                $match: {},
            }]

            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            if ((fields.to_user_id) && (!fields.to_group_id)) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id

            arAggregate.push({
                $count: 'count'
            })

            let result = await collection.aggregate(arAggregate).toArray();
            return result
        } catch (err) {
            console.log(err)
            throw ({err: 6004000, msg: 'CPost GetCount'})
        }
    }

    //количество всех видео
    static async Count ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}post`

            let result = await DB.Init.Query(sql)
            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CPost Count'})
        }
    }

    //пользователи
    static async GetUsers ( items ) {
        try {
            //нет массива для обработки
            if ((!items) || (!items.length))
                return []

            /* выгрузка индентификаторов из объектов / пользователей */
            let arUsersId = items.map((item, i) => {
                return item.from_id
            })

            //удаление одинаковых id из массива
            arUsersId = Array.from(new Set(arUsersId))

            let sql = `SELECT id,login,first_name,create_date,birthday,photo FROM ${DB.Init.TablePrefix}user WHERE id in (${arUsersId})`
            let users = await DB.Init.Query(sql)

            users = await Promise.all(users.map(async (user, i)=>{
                if (user.photo) {
                    user.photo = await CFile.GetById([user.photo]);
                    user.photo = user.photo[0]
                }
                return user
            }))

            return users

        } catch (err) {
            console.log(err)
            throw ({err: 6005000, msg: 'CPost GetUsers'})
        }
    }

    //поиск по обсуждениям
    static async Search ( fields ) {
        try {
            let there = []

            if (fields.q)
                there.push(` to_tsvector(title) @@ websearch_to_tsquery('${fields.q.toLowerCase()}') `) //в нижний регистр

            //запрос
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}post `

            //объединеие параметров запроса
            if (there.length)
                sql += `WHERE ` + there.join(' AND ')

            sql += ` LIMIT $1 OFFSET $2`

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])
            console.log(sql)

            result = await Promise.all(result.map(async (item, i) => {
                if (item.from_id)
                    item.from_id = Number (item.from_id);

                if (item.owner_id)
                    item.owner_id = Number (item.owner_id);

                if (item.create_id)
                    item.create_id = Number (item.create_id);

                /* загрузка инфы о файле */
                if (item.file_ids)
                    item.file_ids = await CFile.GetById(item.file_ids);

                return item;
            }));

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CPost Search'})
        }
    }

    //количество / поиск по обсуждениям
    static async SearchCount ( fields ) {
        try {
            let there = []

            if (fields.q)
                there.push(` to_tsvector(title) @@ websearch_to_tsquery('${fields.q.toLowerCase()}') `) //в нижний регистр

            //запрос
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}post `

            //объединеие параметров запроса
            if (there.length)
                sql += `WHERE ` + there.join(' AND ')

            console.log(sql)
            let result = await DB.Init.Query(sql)

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CPost SearchCount'})
        }
    }

    //количество / поиск по обсуждениям
    static async Delete ( id ) {
        try {
            //запись
            let result = await DB.Init.Query(`DELETE FROM sf_post WHERE id = ${id}`)
            return true

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CPost Delete'})
        }
    }
}