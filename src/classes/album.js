import { DB } from "./db"
import { Store } from "../store"


export class CAlbum {

//добавить новый видео альбом
    static async Add (fields) {
        try {

            //ПОДГОТОВКА
            if (fields.image_id)
                fields.image_id = new DB().ObjectID(fields.image_id)
            if (fields.album_ids)
                fields.album_ids = new DB().ObjectID(fields.album_ids)

            if (fields.from_id)
                fields.from_id = new DB().ObjectID(fields.from_id)
            if (fields.to_user_id)
                fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            if (fields.to_group_id)
                fields.to_group_id = new DB().ObjectID(fields.to_group_id)

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection(`album_${fields.module}`)

            let result = await collection.insertOne(fields)
            return fields

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CAlbum Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids, module ) {
        try {
            ids = new DB().ObjectID(ids)

            let arAggregate = []
            arAggregate.push({
                $match: {
                    _id: {$in: ids}
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'user',
                    localField: 'from_id',
                    foreignField: '_id',
                    as: '_from_id',
                    pipeline: [
                        { $lookup:
                                {
                                    from: 'file_img',
                                    localField: 'photo_id',
                                    foreignField: '_id',
                                    as: '_photo_id'
                                }
                        },
                        {
                            $unwind:
                                {
                                    path: '$_photo_id',
                                    preserveNullAndEmptyArrays: true
                                }
                        }
                    ]
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'user',
                    localField: 'to_user_id',
                    foreignField: '_id',
                    as: '_to_user_id',
                    pipeline: [
                        { $lookup:
                                {
                                    from: 'file_img',
                                    localField: 'to_user_id',
                                    foreignField: '_id',
                                    as: '_to_user_id'
                                }
                        },
                        {
                            $unwind:
                                {
                                    path: '$_to_user_id',
                                    preserveNullAndEmptyArrays: true
                                }
                        }
                    ]
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'group',
                    localField: 'to_group_id',
                    foreignField: '_id',
                    as: '_to_group_id',
                    pipeline: [
                        { $lookup:
                                {
                                    from: 'file_img',
                                    localField: 'photo_id',
                                    foreignField: '_id',
                                    as: '_photo_id'
                                }
                        },
                        {
                            $unwind:
                                {
                                    path: '$_photo_id',
                                    preserveNullAndEmptyArrays: true
                                }
                        }
                    ]
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'file_img',
                    localField: 'image_id',
                    foreignField: '_id',
                    as: '_image_id'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'album_article',
                    localField: 'album_ids',
                    foreignField: '_id',
                    as: '_album_ids'
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_image_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_from_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_to_user_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_to_group_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $sort: {
                    _id: 1
                }
            })

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection(`album_${module}`)
            let result = await collection.aggregate(arAggregate).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CAlbum GetById'})
        }
    }

    static async Edit(id, fields) {
        try {
            id = new DB().ObjectID(id)

            if (fields.image_id)
                fields.image_id = new DB().ObjectID(fields.image_id)
            if (fields.album_ids)
                fields.album_ids = new DB().ObjectID(fields.album_ids)

            if (fields.from_id)
                fields.from_id = new DB().ObjectID(fields.from_id)
            if (fields.to_user_id)
                fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            if (fields.to_group_id)
                fields.to_group_id = new DB().ObjectID(fields.to_group_id)

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection(`album_${fields.module}`)
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
            if (fields.q) {
                fields.q = fields.q.replace(/ +/g, ' ').trim();
                fields.q = fields.q.replace("[^\\da-zA-Zа-яёА-ЯЁ ]", ' ').trim();
            }

            if (fields.from_id)
                fields.from_id = new DB().ObjectID(fields.from_id)
            if (fields.to_user_id)
                fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            if (fields.to_group_id)
                fields.to_group_id = new DB().ObjectID(fields.to_group_id)

            if (fields.album_ids)
                fields.album_ids = new DB().ObjectID(fields.album_ids)

            let arAggregate = []
            arAggregate.push({
                $match: {}
            })
            arAggregate.push({
                $lookup: {
                    from: 'user',
                    localField: 'from_id',
                    foreignField: '_id',
                    as: '_from_id',
                    pipeline: [
                        { $lookup:
                                {
                                    from: 'file_img',
                                    localField: 'photo_id',
                                    foreignField: '_id',
                                    as: '_photo_id'
                                }
                        },
                        {
                            $unwind:
                                {
                                    path: '$_photo_id',
                                    preserveNullAndEmptyArrays: true
                                }
                        }
                    ]
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'user',
                    localField: 'to_user_id',
                    foreignField: '_id',
                    as: '_to_user_id',
                    pipeline: [
                        { $lookup:
                                {
                                    from: 'file_img',
                                    localField: 'to_user_id',
                                    foreignField: '_id',
                                    as: '_to_user_id'
                                }
                        },
                        {
                            $unwind:
                                {
                                    path: '$_to_user_id',
                                    preserveNullAndEmptyArrays: true
                                }
                        }
                    ]
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'group',
                    localField: 'to_group_id',
                    foreignField: '_id',
                    as: '_to_group_id',
                    pipeline: [
                        { $lookup:
                                {
                                    from: 'file_img',
                                    localField: 'photo_id',
                                    foreignField: '_id',
                                    as: '_photo_id'
                                }
                        },
                        {
                            $unwind:
                                {
                                    path: '$_photo_id',
                                    preserveNullAndEmptyArrays: true
                                }
                        }
                    ]
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'file_img',
                    localField: 'image_id',
                    foreignField: '_id',
                    as: '_image_id'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'album_article',
                    localField: 'album_ids',
                    foreignField: '_id',
                    as: '_album_ids'
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_image_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_from_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_to_user_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_to_group_id',
                    preserveNullAndEmptyArrays: true
                }
            })

            if (fields.q) arAggregate[0].$match.$text = {}
            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            if (fields.from_id) arAggregate[0].$match.from_id = fields.from_id
            if (fields.to_user_id) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
            if (fields.album_id) arAggregate[0].$match.album_ids = fields.album_id

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
                    }
                })

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection(`album_${fields.module}`)
            let result = await collection.aggregate(arAggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray();
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CAlbum Get'})
        }
    }

//количество
    static async GetCount(fields) {
        try {
            if (fields.q) {
                fields.q = fields.q.replace(/ +/g, ' ').trim();
                fields.q = fields.q.replace("[^\\da-zA-Zа-яёА-ЯЁ ]", ' ').trim();
            }

            if (fields.from_id)
                fields.from_id = new DB().ObjectID(fields.from_id)
            if (fields.to_user_id)
                fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            if (fields.to_group_id)
                fields.to_group_id = new DB().ObjectID(fields.to_group_id)

            if (fields.album_ids)
                fields.album_ids = new DB().ObjectID(fields.album_ids)

            let arAggregate = []
            arAggregate.push({
                $match: {
                    $match: {},
                }
            })

            if (fields.q) arAggregate[0].$match.$text = {}
            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            if (fields.from_id) arAggregate[0].$match.from_id = fields.from_id
            if (fields.to_user_id) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
            if (fields.album_ids) arAggregate[0].$match.album_ids = fields.album_ids

            arAggregate.push({
                $count: 'count'
            })

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection(`album_${fields.module}`)
            let result = await collection.aggregate(arAggregate).toArray();

            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CAlbum GetCount'})
        }
    }

    static async Count (module) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection(`album_${module}`)

            let result = await collection.count()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CArticle Count'})
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