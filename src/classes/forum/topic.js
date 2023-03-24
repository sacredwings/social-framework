import { DB } from "../db"
import { Store } from "../../store"

export class CForumTopic {

    //новая тема для обсуждений
    static async Add ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.group_id = new DB().ObjectID(fields.group_id)
            fields.image_id = new DB().ObjectID(fields.image_id)

            let date = new Date()

            let collection = mongoClient.collection('topic');

            let arFields = {
                from_id: fields.from_id,
                group_id: fields.group_id,

                image_id: fields.image_id,
                title: fields.title,

                comment: 0,
                change_user_id: fields.from_id,
                change_date: date,
                create_date: date,
                delete: null
            }

            let result = await collection.insertOne(arFields)
            return arFields

        } catch (err) {
            console.log(err)
            throw ({code: 6001000, msg: 'CTopic Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            const mongoClient = Store.GetMongoClient()
            ids = new DB().arObjectID(ids)

            let collection = mongoClient.collection('topic');
            let result = await collection.aggregate([{
                $match: {
                    _id: {$in: ids}
                }
            },{
                $lookup: {
                    from: 'user',
                    localField: 'from_id',
                    foreignField: '_id',
                    as: '_from_id',
                    pipeline: [
                        { $lookup:
                                {
                                    from: 'file_image',
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
            },{
                $lookup: {
                    from: 'group',
                    localField: 'group_id',
                    foreignField: '_id',
                    as: '_group_id',
                    pipeline: [
                        { $lookup:
                                {
                                    from: 'file_image',
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
            },{
                $lookup: {
                    from: 'user',
                    localField: 'change_user_id',
                    foreignField: '_id',
                    as: '_change_user_id',
                    pipeline: [
                        { $lookup:
                                {
                                    from: 'file_image',
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
            },{
                $lookup: {
                    from: 'file_image',
                    localField: 'image_id',
                    foreignField: '_id',
                    as: '_image_id'
                }
            },{
                $unwind: {
                    path: '$_image_id',
                    preserveNullAndEmptyArrays: true
                }
            },{
                $unwind: {
                    path: '$_from_id',
                    preserveNullAndEmptyArrays: true
                }
            },{
                $unwind: {
                    path: '$_group_id',
                    preserveNullAndEmptyArrays: true
                }
            },{
                $unwind: {
                    path: '$_change_user_id',
                    preserveNullAndEmptyArrays: true
                }
            },{
                $sort: {
                    _id: 1
                }
            }
            ]).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CTopic GetById'})
        }
    }

    /*
    static async Edit(id, fields) {
        try {
            id = new DB().ObjectID(id)
            fields.video_ids = new DB().arObjectID(fields.video_ids)
            fields.img_ids = new DB().arObjectID(fields.img_ids)
            fields.doc_ids = new DB().arObjectID(fields.doc_ids)
            fields.audio_ids = new DB().arObjectID(fields.audio_ids)
            fields.change_date = new Date()

            let collection = DB.Client.collection('topic');
            let arFields = {
                _id: id
            }

            let result = collection.updateOne(arFields, {$set: fields})

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CTopic Edit'})
        }
    }*/

    //загрузка
    static async Get ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.group_id = new DB().ObjectID(fields.group_id)

            let collection = mongoClient.collection('topic')

            let match = {}
            if (fields.user_id) match.user_id = fields.user_id //темы созданные пользователем
            if (fields.group_id) match.group_id = fields.group_id //темы форума

            let Aggregate = [
                {
                    $match: match
                },{
                    $lookup: {
                        from: 'user',
                        localField: 'from_id',
                        foreignField: '_id',
                        as: '_from_id',
                        pipeline: [
                            { $lookup:
                                    {
                                        from: 'file_image',
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
                    },
                },{
                    $lookup: {
                        from: 'user',
                        localField: 'change_user_id',
                        foreignField: '_id',
                        as: '_change_user_id',
                        pipeline: [
                            { $lookup:
                                    {
                                        from: 'file_image',
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
                },{
                    $lookup: {
                        from: 'file_image',
                        localField: 'image_id',
                        foreignField: '_id',
                        as: '_image_id'
                    }
                },{
                    $unwind: {
                        path: '$_image_id',
                        preserveNullAndEmptyArrays: true
                    }
                },{
                    $unwind: {
                        path: '$_from_id',
                        preserveNullAndEmptyArrays: true
                    }
                },{
                    $unwind: {
                        path: '$_group_id',
                        preserveNullAndEmptyArrays: true
                    }
                },{
                    $unwind: {
                        path: '$_change_user_id',
                        preserveNullAndEmptyArrays: true
                    }
                },{
                    $sort: {
                        _id: -1
                    }
                }
            ]

            let result = await collection.aggregate(Aggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CTopic Get'})
        }
    }


    //количество
    static async GetCount ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.group_id = new DB().ObjectID(fields.group_id)

            let collection = mongoClient.collection('topic')

            let match = {}
            if (fields.from_id) match.from_id = fields.from_id //темы созданные пользователем
            if (fields.group_id) match.group_id = fields.group_id //темы форума

            let Aggregate = [{
                $match: match
            },{
                $count: 'count'
            }
            ]

            let result = await collection.aggregate(Aggregate).toArray();
            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CTopic GetCount'})
        }
    }

    static async Count () {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('topic');

            let result = await collection.count()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CTopic Count'})
        }
    }

    static async Edit(id, fields) {
        try {
            const mongoClient = Store.GetMongoClient()
            id = new DB().ObjectID(id)
            fields.image_id = new DB().ObjectID(fields.image_id)

            let collection = mongoClient.collection('topic');
            let arFields = {
                _id: id
            }
            let result = collection.updateOne(arFields, {$set: fields})

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CTopic Edit'})
        }
    }
}