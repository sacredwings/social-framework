//добавить новый видео альбом
import {DB} from "./db";
import CFile from "./file";

export default class {

//добавить новый видео альбом
    static async Add (fields) {
        try {
            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)

            let collection = DB.Client.collection('album');

            let result = await collection.insertOne(fields)
            return fields

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CAlbum Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = new DB().arObjectID(ids)

            let collection = DB.Client.collection('album');
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
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CArticle GetById'})
        }
    }

    static async Edit(id, fields) {
        try {
            id = new DB().ObjectID(id)

            let collection = DB.Client.collection('album');
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
    static async Get(fields) {
        try {
            if (fields.to_group_id)
                delete fields.to_user_id

            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            fields.album_id = new DB().ObjectID(fields.album_id)

            let collection = DB.Client.collection('album');

            let xxx = new DB().ObjectID('61a9fdb494f73f29366ecdde')

            await collection.updateMany({}, { $set: { to_group_id: xxx }})

            let arAggregate = [
                { $match: {
                        module: fields.module
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
                },
            ]

            if (fields.to_user_id) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
            if (fields.album_id) arAggregate[0].$match.album_id = fields.album_id

            let result = await collection.aggregate(arAggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray();
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CAlbum Get'})
        }
    }

//количество
    static async Count(fields) {
        try {
            if (fields.to_group_id)
                delete fields.to_user_id

            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            fields.album_id = new DB().ObjectID(fields.album_id)

            let collection = DB.Client.collection('album');

            let count = {
                module: fields.module
            }

            if (fields.to_user_id) count.to_user_id = fields.to_user_id
            if (fields.to_group_id) count.to_group_id = fields.to_group_id
            if (fields.album_id) count.album_id = fields.album_id

            let result = await collection.count(count)
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CAlbum Count'})
        }
    }

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
            throw ({err: 8001000, msg: 'CArticle InAlbum'})
        }
    }
}