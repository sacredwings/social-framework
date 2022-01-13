import { DB } from "./db";
import { CFile } from "./file";

export class CArticle {

    //новая тема для обсуждений
    static async Add ( fields ) {
        try {
            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            if (fields.to_group_id)
                delete fields.to_user_id

            let collection = DB.Client.collection('article');

            let result = await collection.insertOne(fields)
            return fields

        } catch (err) {
            console.log(err)
            throw ({err: 6001000, msg: 'CArticle Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = new DB().arObjectID(ids)

            let collection = DB.Client.collection('article');
            let result = await collection.aggregate([
                { $match:
                        {
                            _id: {$in: ids}
                        }
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'image_id',
                            foreignField: '_id',
                            as: '_image_id',
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
                            path: '$_image_id',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]).toArray();
            //let result = await DB.Init.Query(`SELECT * FROM ${DB.Init.TablePrefix}article WHERE id in (${ids})`)

            /*
            result = await Promise.all(result.map(async (item, i) => {
                // загрузка инфы о файле

                if (item.file_ids)
                    item.file_ids = await CFile.GetById(item.file_ids);

                return item;
            }));
            */
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CArticle GetById'})
        }
    }

    static async Edit(id, fields) {
        try {
            id = new DB().ObjectID(id)

            let collection = DB.Client.collection('article');
            let arFields = {
                _id: id
            }

            let result = collection.updateOne(arFields, {$set: fields})

            return result
        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CArticle Edit'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {
            if (fields.to_group_id)
                delete fields.to_user_id

            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            fields.album_id = new DB().ObjectID(fields.album_id)

            let collection = DB.Client.collection('article');

            let arAggregate = [{
                $match: {},
            },{
                $lookup:
                    {
                        from: 'file',
                        localField: 'image_id',
                        foreignField: '_id',
                        as: '_image_id',
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
                $unwind:
                    {
                        path: '$_image_id',
                        preserveNullAndEmptyArrays: true
                    }
            }]

            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            if ((fields.to_user_id) && (!fields.to_group_id)) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id

            if (fields.album_id) {
                arAggregate.push({
                    $lookup:
                        {
                            from: 'album_article_link',
                            localField: '_id',
                            foreignField: 'object_id',
                            as: '_album_article_link',
                            pipeline: [
                                { $match: {} },
                            ]
                        }
                })
                arAggregate.push({
                    $unwind:
                        {
                            path: '$_album_article_link',
                            preserveNullAndEmptyArrays: false
                        }
                })

                //сдвиг /может не быть $match
                arAggregate[arAggregate.length-2].$lookup.pipeline[0].$match.album_id = fields.album_id
            }

            let result = await collection.aggregate(arAggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray();
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CArticle Get'})
        }
    }


    //количество
    static async GetCount ( fields ) {
        try {
            if (fields.to_group_id)
                delete fields.to_user_id

            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            fields.album_id = new DB().ObjectID(fields.album_id)

            let collection = DB.Client.collection('article');

            let arAggregate = [{
                $match: {},
            }]
            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            if ((fields.to_user_id) && (!fields.to_group_id)) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id

            if (fields.album_id) {
                arAggregate.push({
                    $lookup:
                        {
                            from: 'album_article_link',
                            localField: '_id',
                            foreignField: 'object_id',
                            as: '_album_article_link',
                            pipeline: [
                                { $match: {} },
                            ]
                        }
                })
                arAggregate.push({
                    $unwind:
                        {
                            path: '$_album_article_link',
                            preserveNullAndEmptyArrays: false
                        }
                })
                arAggregate[1].$lookup.pipeline[0].$match.album_id = fields.album_id
            }

            arAggregate.push({
                $count: 'count'
            })

            //return arAggregate
            let result = await collection.aggregate(arAggregate).toArray();

            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CArticle GetCount'})
        }
    }

    //количество всех видео
    static async Count ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}article`

            let result = await DB.Init.Query(sql)
            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CArticle Count'})
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
            throw ({err: 8001000, msg: 'CArticle GetUsers'})
        }
    }

    //поиск
    static async Search ( fields ) {
        try {
            let there = []

            if (fields.q)
                there.push(` to_tsvector(title) @@ websearch_to_tsquery('${fields.q.toLowerCase()}') `) //в нижний регистр

            //запрос
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}article `

            //объединеие параметров запроса
            if (there.length)
                sql += `WHERE ` + there.join(' AND ')

            sql += ` LIMIT $1 OFFSET $2`

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])
            console.log(sql)

            result = await Promise.all(result.map(async (item, i) => {

                /*
                if (item.type)
                    item.type = Number (item.type);

                if (item.photo)
                    item.photo = Number (item.photo);

                if (item.create_id)
                    item.create_id = Number (item.create_id);

                /* загрузка инфы о файле */
                /*
                if (item.photo) {
                    item.photo = await CFile.GetById([item.photo]);
                    item.photo = item.photo[0]
                }*/

                return item;
            }));

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CArticle Search'})
        }
    }

    //количество / поиск
    static async SearchCount ( fields ) {
        try {
            let there = []

            if (fields.q)
                there.push(` to_tsvector(title) @@ websearch_to_tsquery('${fields.q.toLowerCase()}') `) //в нижний регистр

            //запрос
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}article `

            //объединеие параметров запроса
            if (there.length)
                sql += `WHERE ` + there.join(' AND ')

            console.log(sql)
            let result = await DB.Init.Query(sql)

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CArticle SearchCount'})
        }
    }


}