import { DB } from "./db"
import { Store } from "../store"

export class CTopic {

    //новая тема для обсуждений
    static async Add ( fields ) {
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
            let collection = mongoClient.collection('topic')

            let newDate = new Date()

            let arFields = {
                image_id: fields.image_id,
                title: fields.title,

                from_id: fields.from_id,
                to_group_id: fields.to_group_id,
                to_user_id: fields.to_user_id,

                change_user_id: fields.from_id,
                change_date: newDate,
                create_date: newDate,

                count_view: 0,
                count_comment: 0,
                count_like: 0,
                count_dislike: 0,
                count_repeat: 0
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
            ids = new DB().ObjectID(ids)

            let collection = mongoClient.collection('topic');
            let result = await collection.aggregate([
                {
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
                },{
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
                },{
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
                },{
                    $lookup: {
                        from: 'user',
                        localField: 'change_user_id',
                        foreignField: '_id',
                        as: '_change_user_id',
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
                },{
                    $lookup: {
                        from: 'file_img',
                        localField: 'image_id',
                        foreignField: '_id',
                        as: '_image_id'
                    }
                },{
                    $lookup: {
                        from: 'album_topic',
                        localField: 'album_ids',
                        foreignField: '_id',
                        as: '_album_ids'
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
                        path: '$_to_user_id',
                        preserveNullAndEmptyArrays: true
                    }
                },{
                    $unwind: {
                        path: '$_to_group_id',
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

    static async Edit(id, fields) {
        try {
            //ПОДГОТОВКА
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
            let collection = mongoClient.collection('topic')

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

    //загрузка
    static async Get ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
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
                    from: 'user',
                    localField: 'change_user_id',
                    foreignField: '_id',
                    as: '_change_user_id',
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
                    from: 'album_topic',
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
                $unwind: {
                    path: '$_change_user_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $sort: {
                    _id: -1
                }
            })

            if (fields.q) arAggregate[0].$match.$text = {}
            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            /*
            if ((fields.to_user_id) && (!fields.to_group_id)) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
             */
            if (fields.from_id) arAggregate[0].$match.from_id = fields.from_id
            if (fields.to_user_id) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
            if (fields.album_id) arAggregate[0].$match.album_id = fields.album_id

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

            let collection = mongoClient.collection('topic')
            let result = await collection.aggregate(arAggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray()
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

            let arAggregate = [{
                $match: {},
            }]

            if (fields.q) arAggregate[0].$match.$text = {}
            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            if (fields.from_id) arAggregate[0].$match.from_id = fields.from_id
            if (fields.to_user_id) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
            if (fields.album_id) arAggregate[0].$match.album_id = fields.album_id

            arAggregate.push({
                $count: 'count'
            })

            let collection = mongoClient.collection('topic')
            let result = await collection.aggregate(arAggregate).toArray();

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
}