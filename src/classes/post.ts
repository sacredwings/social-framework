// @ts-nocheck
import { DB } from "./db"
import { Store } from "../store"


export class CPost {

    //новая тема для обсуждений
    static async Add ( fields ) {
        try {
            if (fields.video_ids)
                fields.video_ids = new DB().ObjectID(fields.video_ids)
            if (fields.img_ids)
                fields.img_ids = new DB().ObjectID(fields.img_ids)
            if (fields.doc_ids)
                fields.doc_ids = new DB().ObjectID(fields.doc_ids)
            if (fields.audio_ids)
                fields.audio_ids = new DB().ObjectID(fields.audio_ids)

            if (fields.from_id)
                fields.from_id = new DB().ObjectID(fields.from_id)
            if (fields.to_user_id)
                fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            if (fields.to_group_id)
                fields.to_group_id = new DB().ObjectID(fields.to_group_id)

            fields.create_date = new Date()

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('post')

            let result = await collection.insertOne(fields)
            return fields

        } catch (err) {
            console.log(err)
            throw ({code: 6001000, msg: 'CPost Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = new DB().ObjectID(ids)

            let arAggregate = []
            arAggregate.push({
                $match: {
                    _id: {$in: ids},
                    delete: {$ne: true}
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
                                    from: 'img',
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
                                    from: 'img',
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
                                    from: 'img',
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
                    from: 'video',
                    localField: 'video_ids',
                    foreignField: '_id',
                    as: '_video_ids'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'img',
                    localField: 'img_ids',
                    foreignField: '_id',
                    as: '_img_ids'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'doc',
                    localField: 'doc_ids',
                    foreignField: '_id',
                    as: '_doc_ids'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'audio',
                    localField: 'audio_ids',
                    foreignField: '_id',
                    as: '_audio_ids'
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
            let collection = mongoClient.collection(`post`)
            let result = await collection.aggregate(arAggregate).toArray()
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 6002000, msg: 'CPost GetById'})
        }
    }

    //загрузка
    static async Get ( fields ) {
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

            let arAggregate = []
            arAggregate.push({
                $match: {
                    delete: {$ne: true}
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
                                    from: 'img',
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
                                    from: 'img',
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
                                    from: 'img',
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
                    from: 'video',
                    localField: 'video_ids',
                    foreignField: '_id',
                    as: '_video_ids'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'img',
                    localField: 'img_ids',
                    foreignField: '_id',
                    as: '_img_ids'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'doc',
                    localField: 'doc_ids',
                    foreignField: '_id',
                    as: '_doc_ids'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'audio',
                    localField: 'audio_ids',
                    foreignField: '_id',
                    as: '_audio_ids'
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
            if (fields.album_ids) arAggregate[0].$match.album_ids = fields.album_ids

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
                        _id: -1
                    }
                })

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('post')
            let result = await collection.aggregate(arAggregate).skip(fields.offset).limit(fields.count).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 6003000, msg: 'CPost Get'})
        }
    }

    //количество
    static async GetCount ( fields ) {
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

            let arAggregate = []
            arAggregate.push({
                $match: {
                    delete: {$ne: true}
                }
            })

            if (fields.q) arAggregate[0].$match.$text = {}
            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            if (fields.from_id) arAggregate[0].$match.from_id = fields.from_id
            if (fields.to_user_id) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
            if (fields.album_id) arAggregate[0].$match.album_ids = fields.album_id

            arAggregate.push({
                $count: 'count'
            })

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('post')
            let result = await collection.aggregate(arAggregate).toArray()

            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 6004000, msg: 'CPost GetCount'})
        }
    }

    static async Count ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('post');

            let result = await collection.count()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CPost Count'})
        }
    }

    static async Edit(id, fields) {
        try {
            id = new DB().ObjectID(id)

            if (fields.video_ids)
                fields.video_ids = new DB().ObjectID(fields.video_ids)
            if (fields.img_ids)
                fields.img_ids = new DB().ObjectID(fields.img_ids)
            if (fields.doc_ids)
                fields.doc_ids = new DB().ObjectID(fields.doc_ids)
            if (fields.audio_ids)
                fields.audio_ids = new DB().ObjectID(fields.audio_ids)

            if (fields.from_id)
                fields.from_id = new DB().ObjectID(fields.from_id)
            if (fields.to_user_id)
                fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            if (fields.to_group_id)
                fields.to_group_id = new DB().ObjectID(fields.to_group_id)

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('post');
            let arFields = {
                _id: id
            }

            let result = collection.updateOne(arFields, {$set: fields})

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CPost Edit'})
        }
    }

    static async Delete ( id, user_id ) {
        try {
            id = new DB().ObjectID(id)
            user_id = new DB().ObjectID(user_id)

            let arFields = {
                delete: true,
                delete_user: user_id,
                delete_date: new Date(),
            }

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('post')
            let result = collection.updateOne({_id: id}, {$set: arFields}, {upsert: true})
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CPost Delete'})
        }
    }
}
