// @ts-nocheck
import { DB } from "./db"
import { Store } from "../store"
import {CUser} from "./user";
import {CGroup} from "./group";


export class CArticle {

    //новая тема для обсуждений
    static async Add ( fields ) {
        try {
            //ПОДГОТОВКА
            if (fields.image_id)
                fields.image_id = new DB().ObjectID(fields.image_id)
            if (fields.album_ids)
                fields.album_ids = new DB().ObjectID(fields.album_ids)

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
            let collection = mongoClient.collection('article')
            let result = await collection.insertOne(fields)

            await count({
                from_id: fields.from_id,
                to_user_id: fields.to_user_id,
                to_group_id: fields.to_group_id,
                collectionName: 'article'
            })

            return fields

        } catch (err) {
            console.log(err)
            throw ({code: 6001000, msg: 'CArticle Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
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
                $lookup: {
                    from: 'img',
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
            let collection = mongoClient.collection(`article`)
            let result = await collection.aggregate(arAggregate).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CArticle GetById'})
        }
    }

    static async Edit(id, fields) {
        try {
            id = new DB().ObjectID(id)

            if (fields.image_id)
                fields.image_id = new DB().ObjectID(fields.image_id)
            if (fields.album_ids)
                fields.album_ids = new DB().ObjectID(fields.album_ids)

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
            let collection = mongoClient.collection('article')
            let arFields = {
                _id: id
            }

            let result = collection.updateOne(arFields, {$set: fields})
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CArticle Edit'})
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

            if (fields.album_id)
                fields.album_id = new DB().ObjectID(fields.album_id)

            let arAggregate = []
            arAggregate.push({
                $match:
                    {}
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
                    from: 'img',
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
            let collection = mongoClient.collection('article')
            let result = await collection.aggregate(arAggregate).skip(fields.offset).limit(fields.count).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CArticle Get'})
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

            if (fields.album_id)
                fields.album_id = new DB().ObjectID(fields.album_id)

            let arAggregate = []
            arAggregate.push({
                $match: {}
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
            let collection = mongoClient.collection('article')
            let result = await collection.aggregate(arAggregate).toArray()

            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CArticle GetCount'})
        }
    }

    static async Count () {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('article')

            let result = await collection.count()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CArticle Count'})
        }
    }
}

async function count ({from_id, to_user_id, to_group_id, collectionName}) {
    let mongoClient = Store.GetMongoClient()

    let collectionUser = mongoClient.collection('user')
    let collectionGroup = mongoClient.collection('group')
    let collection = mongoClient.collection(collectionName)

    if (from_id) {
        //let countFile = await CVideo.GetCount({from_id: from_id})
        let countFile = await collection.count({from_id: from_id})
        /*await CUser.Edit(from_id, {count: {
                video_out: countFile
            }})*/
        let fields = {}
        fields[`count.${collectionName}_out`] = Number(countFile)
        await CUser.Edit(from_id, fields)
    }
    if (to_user_id) {
        //let countFile = await CVideo.GetCount({from_id: to_user_id})
        let countFile = await collection.count({from_id: to_user_id})
        /*await CUser.Edit(to_user_id, {count: {
                video_in: countFile
            }})*/
        let fields = {}
        fields[`count.${collectionName}_in`] = Number(countFile)
        await CUser.Edit(to_user_id, fields)
    }
    if (to_group_id) {
        //let countFile = await CVideo.GetCount({to_group_id: to_group_id})
        let countFile = await collection.count({to_group_id: to_group_id})
        /*await CGroup.Edit(to_group_id, {count: {
                video_in: countFile
            }})*/
        let fields = {}
        fields[`count.${collectionName}_in`] = Number(countFile)
        await CGroup.Edit(to_group_id, fields)
    }
}
