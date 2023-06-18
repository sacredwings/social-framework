import { DB } from "./db"
import { Store } from "../store"


export class CAlbum {

//добавить новый видео альбом
    static async Add (fields) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            fields.file_id = new DB().ObjectID(fields.file_id)
            fields.album_id = new DB().ObjectID(fields.album_id)
            if (fields.to_group_id)
                delete fields.to_user_id

            let collection = mongoClient.collection('album');

            let result = await collection.insertOne(fields)
            return fields

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CAlbum Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            const mongoClient = Store.GetMongoClient()
            ids = new DB().arObjectID(ids)

            let collection = mongoClient.collection('album');
            let result = await collection.aggregate([
                { $match:
                        {
                            _id: {$in: ids}
                        }
                },{ $lookup:
                        {
                            from: 'album',
                            localField: '_id',
                            foreignField: 'album_id',
                            as: '_album_id'
                        }
                },{ $lookup:
                        {
                            from: 'file_image',
                            localField: 'file_id',
                            foreignField: '_id',
                            as: '_file_image_id',
                        },
                },{ $lookup:
                        {
                            from: 'file_video',
                            localField: 'file_id',
                            foreignField: '_id',
                            as: '_file_video_id',
                        },
                },{ $unwind:
                        {
                            path: '$_file_image_id',
                            preserveNullAndEmptyArrays: true
                        }
                },{ $unwind:
                        {
                            path: '$_file_video_id',
                            preserveNullAndEmptyArrays: true
                        }
                },
            ]).toArray();
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CAlbum GetById'})
        }
    }

    static async Edit(id, fields) {
        try {
            const mongoClient = Store.GetMongoClient()
            id = new DB().ObjectID(id)
            fields.file_id = new DB().ObjectID(fields.file_id)

            let collection = mongoClient.collection('album');
            let arFields = {
                _id: id
            }
            let result = collection.updateOne(arFields, {$set: fields})

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CAlbum Edit'})
        }
    }

//загрузка
    static async Get(fields) {
        try {
            const mongoClient = Store.GetMongoClient()
            if (fields.q)
                fields.q = fields.q.replace(/ +/g, ' ').trim();

            if (fields.to_group_id)
                delete fields.to_user_id

            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            fields.album_id = new DB().ObjectID(fields.album_id)

            let collection = mongoClient.collection('album');

            let arAggregate = [
                { $match:
                        {
                            module: fields.module,
                            album_id: fields.album_id //2 уровень при null не отображать
                        }
                },{ $lookup:
                        {
                            from: 'album',
                            localField: '_id',
                            foreignField: 'album_id',
                            as: '_album_id'
                        }
                },{ $lookup:
                        {
                            from: 'file_image',
                            localField: 'file_id',
                            foreignField: '_id',
                            as: '_file_image_id',
                        },
                },{ $lookup:
                        {
                            from: 'file_video',
                            localField: 'file_id',
                            foreignField: '_id',
                            as: '_file_video_id',
                        },
                },{ $unwind:
                        {
                            path: '$_file_image_id',
                            preserveNullAndEmptyArrays: true
                        }
                },{ $unwind:
                        {
                            path: '$_file_video_id',
                            preserveNullAndEmptyArrays: true
                        }
                },
            ]

            if (fields.q) arAggregate[0].$match.$text = {}
            if (fields.q) arAggregate[0].$match.$text.$search = `\"${fields.q}\"`

            if (fields.to_user_id) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
            //if (fields.album_id) arAggregate[0].$match.album_id = fields.album_id

            arAggregate.push({
                $sort: {
                    _id: -1
                }
            })

            let result = await collection.aggregate(arAggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray();
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CAlbum Get'})
        }
    }

//количество
    static async Count(fields) {
        try {
            const mongoClient = Store.GetMongoClient()
            if (fields.q)
                fields.q = fields.q.replace(/ +/g, ' ').trim();

            if (fields.to_group_id)
                delete fields.to_user_id

            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            fields.album_id = new DB().ObjectID(fields.album_id)

            let collection = mongoClient.collection('album');

            let arAggregate = [{
                $match: {
                    module: fields.module,
                    album_id: fields.album_id //2 уровень при null не отображать
                },
            }]

            if (fields.q) arAggregate[0].$match.$text = {}
            if (fields.q) arAggregate[0].$match.$text.$search = `\"${fields.q}\"`

            if (fields.to_user_id) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
            //if (fields.album_id) count.album_id = fields.album_id

            arAggregate.push({
                $count: 'count'
            })

            let result = await collection.aggregate(arAggregate).toArray();
            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CAlbum Count'})
        }
    }

    /*
    //добавить новое в альбом
    static async InAlbum ( fields ) {
        try {
            // сделать проверку, что файл и альбом твои

            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.create_id = new DB().ObjectID(fields.create_id)

            //раскидываем файл по альбомам
            fields.album_ids.map(async (item, i)=>{

                item = new DB().ObjectID(item)

                let arFields = {
                    album_id: item,
                    object_id: fields.object_id,

                    create_id: fields.create_id
                }


                let collection = DB.Client.collection('album_video_link');
                if (fields.module === 'article')
                    collection = DB.Client.collection('album_article_link');

                let result = await collection.insertOne(arFields)
            })

            return true

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CAlbum InAlbum'})
        }
    }*/
}