import { DB } from "./db"
import { Store } from "../store"


export class CVideo {

    //добавить новое видео
    static async Edit ( id, fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            // сделать проверку, что файл и альбом твои
/*
            let arFields = {
                file_id: fields.file_id,
                title: fields.title,
                text: fields.text
            }
*/

            id = new DB().ObjectID(id)
            if (fields.album_ids)
                fields.album_ids = new DB().arObjectID(fields.album_ids)

            let collection = mongoClient.collection('file_video');
            let arFields = {
                _id: id
            }

            let result = collection.updateOne(arFields, {$set: fields})

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CVideo Edit'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            const mongoClient = Store.GetMongoClient()
            ids = new DB().arObjectID(ids)

            let collection = mongoClient.collection('file_video');
            //let result = await collection.find({_id: { $in: ids}}).toArray()
            let result = await collection.aggregate([
                { $match:
                        {
                            _id: {$in: ids}
                        }
                },{ $lookup:
                        {
                            from: 'album',
                            localField: 'album_ids',
                            foreignField: '_id',
                            as: '_album_ids'
                        }
                }
            ]).toArray()

            result = await Promise.all(result.map(async (item, i) => {
                if (item.text === null) item.text = ''

                return item;
            }));

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CVideo GetById'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            if (fields.q) {
                fields.q = fields.q.replace(/ +/g, ' ').trim();
                fields.q = fields.q.replace("[^\\da-zA-Zа-яёА-ЯЁ ]", ' ').trim();
            }

            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            fields.album_id = new DB().ObjectID(fields.album_id)

            let collection = mongoClient.collection('file_video');

            let arAggregate = []
            arAggregate.push({
                $match: {}
            })
            arAggregate.push({
                $lookup:
                    {
                        from: 'album',
                        localField: 'album_ids',
                        foreignField: '_id',
                        as: '_album_ids'
                    }
            })

            /* Доступ к каналу открываем
            //нет группы, ищем только в бесплатных группах
            if ((!fields.to_group_id) && (!fields.from_id)) {
                arAggregate.push({
                    $lookup:
                        {
                            from: 'group',
                            localField: 'to_group_id',
                            foreignField: '_id',
                            as: '_to_group_id'
                        }
                })
                arAggregate.push({
                    $match:
                        {
                            $or: [
                                {'_to_group_id.price': null},
                                {'_to_group_id.price': 0},
                            ]
                        }
                })
            }
            */

            if (fields.q) arAggregate[0].$match.$text = {}
            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            if ((fields.from_id) && (!fields.to_group_id)) {
                arAggregate[0].$match.from_id = fields.from_id
                arAggregate[0].$match.to_group_id = null
            }
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
            if (fields.album_id) arAggregate[0].$match.album_ids = fields.album_id
            /*
            if (fields.album_id)
                arAggregate[0].$match.album_ids = fields.album_id
            else
                if ((!fields.q) && (!fields.view)) arAggregate[0].$match.album_ids = null //если не выбран альбом и мы не ищем
            */

            //сортировка, если поиска нет
            if (fields.q)
                arAggregate.push({
                    $sort: {
                        $score: {$meta:"textScore"}
                    }
                })
            else
                arAggregate.push({
                    $sort: {
                        _id: -1,
                        comment: -1,
                        like: -1,
                        view: -1,
                    }
                })

            let result = await collection.aggregate(arAggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray();
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CVideo Get'})
        }
    }

    //количество
    static async GetCount ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            if (fields.q) {
                fields.q = fields.q.replace(/ +/g, ' ').trim();
                fields.q = fields.q.replace("[^\\da-zA-Zа-яёА-ЯЁ ]", ' ').trim();
            }

            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            fields.album_id = new DB().ObjectID(fields.album_id)

            let collection = mongoClient.collection('file_video');

            let arAggregate = []
            arAggregate.push({
                $match: {}
            })

            /* Доступ к каналу открываем
            //нет группы, ищем только в бесплатных группах
            if ((!fields.to_group_id) && (!fields.from_id)) {
                arAggregate.push({
                    $lookup:
                        {
                            from: 'group',
                            localField: 'to_group_id',
                            foreignField: '_id',
                            as: '_to_group_id'
                        }
                })
                arAggregate.push({
                    $match:
                        {
                            $or: [
                                {'_to_group_id.price': null},
                                {'_to_group_id.price': 0},
                            ]
                        }
                })
            }

             */

            if (fields.q) arAggregate[0].$match.$text = {}
            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            if ((fields.to_user_id) && (!fields.to_group_id)) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
            if (fields.album_id) arAggregate[0].$match.album_ids = fields.album_id

            /*
            if ((fields.from_id) && (!fields.to_group_id)) {
                arAggregate[0].$match.from_id = fields.from_id
                arAggregate[0].$match.to_group_id = null
            }
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
            if (fields.album_id) arAggregate[0].$match.album_ids = fields.album_id*/
            /*
            if (fields.album_id)
                arAggregate[0].$match.album_ids = fields.album_id
            else
                if ((!fields.q) && (!fields.view)) arAggregate[0].$match.album_ids = null //если не выбран альбом и мы не ищем
            */

            arAggregate.push({
                $count: 'count'
            })

            let result = await collection.aggregate(arAggregate).toArray()

            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CVideo GetCount'})
        }
    }

    static async Count () {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('file_video');

            let arAggregate = []
            arAggregate.push({
                $count: 'count'
            })
            let result = await collection.aggregate(arAggregate).toArray()
            if (!result.length) return 0
            return result[0].count

            //let result = await collection.count()
            //return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CVideo Count'})
        }
    }

    static async Delete ( id ) {
        try {
            const mongoClient = Store.GetMongoClient()
            id = new DB().ObjectID(id)

            let collection = mongoClient.collection('file');

            let result = collection.deleteOne({_id: id})

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CVideo Delete'})
        }
    }
/*
    //пользователи
    static async GetUsers ( items ) {
        try {

            //нет массива для обработки
            if ((!items) || (!items.length))
                return []

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
            throw ({code: 8001000, msg: 'CVideo GetUsers'})
        }
    }
*/

/*
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

                if (item.from_id)
                    item.from_id = Number (item.from_id);

                if (item.owner_id)
                    item.owner_id = Number (item.owner_id);

                if (item.create_id)
                    item.create_id = Number (item.create_id);

                if (item.file_id) {
                    item.file_id = await CFile.GetById([item.file_id]);
                    item.file_id = item.file_id[0]
                }

                return item;
            }));

            return result

        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CVideo Search'})
        }
    }
*/
    /*
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
            throw ({code: 7001000, msg: 'CVideo SearchCount'})
        }
    }*/
}