import { DB } from "./db";

export class CNotify {

    //новый комментарий
    static async Add(fields) {
        try {
            let collection = DB.Client.collection('notify')
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.to_id = new DB().ObjectID(fields.to_id)
            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.create_date = new Date()

            if (fields.from_id.toString() === fields.to_id.toString())
                return false

            //установленно мной
            let arFields = {
                from_id: fields.from_id,
                to_id: fields.to_id,
                action: fields.action,
                viewed: null,
                create_date: fields.create_date
            }

            if (fields.module === 'video')
                arFields.video_id = fields.object_id

            if (fields.module === 'post')
                arFields.post_id = fields.object_id

            if (fields.module === 'article')
                arFields.article_id = fields.object_id

            if (fields.module === 'topic')
                arFields.topic_id = fields.object_id

            if (fields.module === 'comment_video')
                arFields.comment_video_id = fields.object_id
            if (fields.module === 'comment_post')
                arFields.comment_post_id = fields.object_id
            if (fields.module === 'comment_article')
                arFields.comment_article_id = fields.object_id
            if (fields.module === 'comment_topic')
                arFields.comment_topic_id = fields.object_id

            let result = await collection.insertOne(arFields)
            return arFields

        } catch (err) {
            console.log(err)
            throw ({code: 2001000, msg: 'CNotify Add'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {
            fields.user_id = new DB().ObjectID(fields.user_id)
            let collection = DB.Client.collection('notify')

            let arAggregate = []
            arAggregate.push({
                $match: {
                    to_id: fields.user_id
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'user',
                    localField: 'from_id',
                    foreignField: '_id',
                    as: '_from_id',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'file',
                                localField: 'photo',
                                foreignField: '_id',
                                as: '_photo'
                            }
                        },{
                            $unwind: {
                                path: '$_photo',
                                preserveNullAndEmptyArrays: true
                            }
                        }
                    ]
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'user',
                    localField: 'to_id',
                    foreignField: '_id',
                    as: '_to_id',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'file',
                                localField: 'photo',
                                foreignField: '_id',
                                as: '_photo'
                            }
                        },{
                            $unwind: {
                                path: '$_photo',
                                preserveNullAndEmptyArrays: true
                            }
                        }
                    ]
                }
            })
            //объекты
            arAggregate.push({
                $lookup: {
                    from: 'video',
                    localField: 'video_id',
                    foreignField: '_id',
                    as: '_video_id',
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'post',
                    localField: 'post_id',
                    foreignField: '_id',
                    as: '_post_id',
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'article',
                    localField: 'article_id',
                    foreignField: '_id',
                    as: '_article_id',
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'topic',
                    localField: 'topic_id',
                    foreignField: '_id',
                    as: '_topic_id',
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'comment_video',
                    localField: 'comment_video_id',
                    foreignField: '_id',
                    as: '_comment_video_id',
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'comment_post',
                    localField: 'comment_post_id',
                    foreignField: '_id',
                    as: '_comment_post_id',
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'comment_article',
                    localField: 'comment_article_id',
                    foreignField: '_id',
                    as: '_comment_article_id',
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'comment_topic',
                    localField: 'comment_topic_id',
                    foreignField: '_id',
                    as: '_comment_topic_id',
                }
            })
            arAggregate.push({
                $unwind:
                    {
                        path: '$_from_id',
                        preserveNullAndEmptyArrays: true
                    }
            })
            arAggregate.push({
                $unwind:
                    {
                        path: '$_to_id',
                        preserveNullAndEmptyArrays: true
                    }
            })
            //объекты
            arAggregate.push({
                $unwind:
                    {
                        path: '$_video_id',
                        preserveNullAndEmptyArrays: true
                    }
            })
            arAggregate.push({
                $unwind:
                    {
                        path: '$_post_id',
                        preserveNullAndEmptyArrays: true
                    }
            })
            arAggregate.push({
                $unwind:
                    {
                        path: '$_article_id',
                        preserveNullAndEmptyArrays: true
                    }
            })
            arAggregate.push({
                $unwind:
                    {
                        path: '$_topic_id',
                        preserveNullAndEmptyArrays: true
                    }
            })
            arAggregate.push({
                $unwind:
                    {
                        path: '$_comment_video_id',
                        preserveNullAndEmptyArrays: true
                    }
            })
            arAggregate.push({
                $unwind:
                    {
                        path: '$_comment_post_id',
                        preserveNullAndEmptyArrays: true
                    }
            })
            arAggregate.push({
                $unwind:
                    {
                        path: '$_comment_article_id',
                        preserveNullAndEmptyArrays: true
                    }
            })
            arAggregate.push({
                $unwind:
                    {
                        path: '$_comment_topic_id',
                        preserveNullAndEmptyArrays: true
                    }
            })

            arAggregate.push({
                $sort: {
                    _id: -1,
                }
            })

            let result = await collection.aggregate(arAggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray();
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CArticle Get'})
        }
    }

    //загрузка
    static async GetCount ( fields ) {
        try {
            fields.user_id = new DB().ObjectID(fields.user_id)
            let collection = DB.Client.collection('notify')

            let arAggregate = []
            arAggregate.push({
                $match: {
                    to_id: fields.user_id
                }
            })

            arAggregate.push({
                $count: 'count'
            })

            let result = await collection.aggregate(arAggregate).toArray();

            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CArticle GetCount'})
        }
    }

    static async NoViewedCount ( fields ) {
        try {
            fields.user_id = new DB().ObjectID(fields.user_id)
            let collection = DB.Client.collection('notify')

            let arAggregate = []
            arAggregate.push({
                $match: {
                    to_id: fields.user_id,
                    viewed: null
                }
            })

            arAggregate.push({
                $count: 'count'
            })

            let result = await collection.aggregate(arAggregate).toArray();

            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CArticle NoViewedCount'})
        }
    }
}