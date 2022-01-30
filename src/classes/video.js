import { DB } from "./db";
import { CFile } from "./file";

export class CVideo {

    //добавить новое видео
    static async Edit ( id, fields ) {
        try {
            // сделать проверку, что файл и альбом твои
/*
            let arFields = {
                file_id: fields.file_id,
                title: fields.title,
                text: fields.text
            }
*/

            id = new DB().ObjectID(id)

            let collection = DB.Client.collection('file');
            let arFields = {
                _id: id
            }

            let result = collection.updateOne(arFields, {$set: fields})

            return result
        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CVideo Edit'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = new DB().arObjectID(ids)

            let collection = DB.Client.collection('file');
            //let result = await collection.find({_id: { $in: ids}}).toArray()
            let result = await collection.aggregate([
                { $match:
                        {
                            _id: {$in: ids}
                        }
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'file_id',
                            foreignField: '_id',
                            as: '_file_id',
                        },

                },
                {
                    $unwind:
                        {
                            path: '$_file_id',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]).toArray();

            result = await Promise.all(result.map(async (item, i) => {
                if (item.text === null) item.text = ''

                return item;
            }));

            return result
        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CVideo GetById'})
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

            let collection = DB.Client.collection('file');

            let arAggregate = [{
                $match: {
                    $or: [
                        {type: 'video/mp4'},
                        {type: 'video/avi'},
                    ]
                },
            },{ $lookup:
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
            }]

            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            if ((fields.to_user_id) && (!fields.to_group_id)) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id

            if (fields.album_id) {
                arAggregate.push({
                    $lookup:
                        {
                            from: 'album_video_link',
                            localField: '_id',
                            foreignField: 'object_id',
                            as: '_album_video_link',
                            pipeline: [
                                { $match: {} },
                            ]
                        }
                })
                arAggregate.push({
                    $unwind:
                        {
                            path: '$_album_video_link',
                            preserveNullAndEmptyArrays: false
                        }
                })
                arAggregate[arAggregate.length-2].$lookup.pipeline[0].$match.album_id = fields.album_id
            }

            arAggregate.push({
                $sort: {
                    _id: -1
                }
            })

            let result = await collection.aggregate(arAggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray();
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CVideo Get'})
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

            let collection = DB.Client.collection('file');

            console.log(fields)
            let arAggregate = [{
                $match: {
                    $or: [
                        {type: 'video/mp4'},
                        {type: 'video/avi'},
                    ]
                },
            }]

            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            if ((fields.to_user_id) && (!fields.to_group_id)) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id

            if (fields.album_id) {
                arAggregate.push({
                    $lookup:
                        {
                            from: 'album_video_link',
                            localField: '_id',
                            foreignField: 'object_id',
                            as: '_album_video_link',
                            pipeline: [
                                { $match: {} },
                            ]
                        }
                })
                arAggregate.push({
                    $unwind:
                        {
                            path: '$_album_video_link',
                            preserveNullAndEmptyArrays: false
                        }
                })
                arAggregate[1].$lookup.pipeline[0].$match.album_id = fields.album_id
            }

            arAggregate.push({
                $count: 'count'
            })

            let result = await collection.aggregate(arAggregate).toArray()

            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CVideo GetCount'})
        }
    }

    //количество всех видео
    static async Count ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}file WHERE (type='video/mp4') OR (type='video/avi')`

            let result = await DB.Init.Query(sql)
            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CVideo Count'})
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
            throw ({err: 8001000, msg: 'CVideo GetUsers'})
        }
    }



    //поиск по обсуждениям
    static async Search ( fields ) {
        try {
            let there = [` ((type='video/mp4') OR (type='video/avi')) `]

            if (fields.q)
                there.push(` to_tsvector(title) @@ websearch_to_tsquery('${fields.q.toLowerCase()}') `) //в нижний регистр

            //запрос
            //let sql = `SELECT * FROM ${DB.Init.TablePrefix}video `
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}file `

            //объединеие параметров запроса
            if (there.length)
                sql += `WHERE ` + there.join(' AND ')

            sql += ` LIMIT $1 OFFSET $2`

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])
            console.log(sql)

            result = await Promise.all(result.map(async (item, i) => {
                /*
                if (item.from_id)
                    item.from_id = Number (item.from_id);

                if (item.owner_id)
                    item.owner_id = Number (item.owner_id);

                if (item.create_id)
                    item.create_id = Number (item.create_id);
*/
                /* загрузка инфы о файле */
                if (item.file_id) {
                    item.file_id = await CFile.GetById([item.file_id]);
                    item.file_id = item.file_id[0]
                }

                return item;
            }));

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CVideo Search'})
        }
    }

    //количество / поиск
    static async SearchCount ( fields ) {
        try {
            let there = [` ((type='video/mp4') OR (type='video/avi')) `]

            if (fields.q)
                there.push(` to_tsvector(title) @@ websearch_to_tsquery('${fields.q.toLowerCase()}') `) //в нижний регистр

            //запрос
            //let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}video `
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}file `

            //объединеие параметров запроса
            if (there.length)
                sql += `WHERE ` + there.join(' AND ')

            console.log(sql)
            let result = await DB.Init.Query(sql)

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CVideo SearchCount'})
        }
    }
}