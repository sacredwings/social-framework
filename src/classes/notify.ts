// @ts-nocheck
import { DB } from "./db"
import { Store } from "../store"
import {CVideo} from "./video";
import {CComment} from "./comment";

let type = [
    'follow',
    'friend',

    'video',
    'img',
    'doc',
    'audio',
    'post',
    'article',
    'topic',

    'like_video',
    'like_img',
    'like_doc',
    'like_audio',
    'like_post',
    'like_article',
    'like_topic',

    'comment_video',
    'comment_img',
    'comment_doc',
    'comment_audio',
    'comment_post',
    'comment_article',
    'comment_topic',

    'like_comment_video',
    'like_comment_img',
    'like_comment_doc',
    'like_comment_audio',
    'like_comment_post',
    'like_comment_article',
    'like_comment_topic',

    'reply_comment_video',
    'reply_comment_img',
    'reply_comment_doc',
    'reply_comment_audio',
    'reply_comment_post',
    'reply_comment_article',
    'reply_comment_topic'
]

export class CNotify {

    //новый комментарий
    static async Add(fields) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collectionNotify = mongoClient.collection('notify')

            if (fields.from_id)
                fields.from_id = new DB().ObjectID(fields.from_id)
            if (fields.to_id)
                fields.to_id = new DB().ObjectID(fields.to_id)

            if (fields.object_id)
                fields.object_id = new DB().ObjectID(fields.object_id)
            if (fields.child_id)
                fields.child_id = new DB().ObjectID(fields.child_id)

            fields.create_date = new Date()

            //установленно мной
            let arFields = {
                from_id: fields.from_id,
                to_id: fields.to_id,

                type: fields.type,

                video_id: null,
                img_id: null,
                doc_id: null,
                audio_id: null,
                post_id: null,
                article_id: null,
                topic_id: null,

                like_video_id: null,
                like_img_id: null,
                like_doc_id: null,
                like_audio_id: null,
                like_post_id: null,
                like_article_id: null,
                like_topic_id: null,

                comment_video_id: null,
                comment_img_id: null,
                comment_doc_id: null,
                comment_audio_id: null,
                comment_post_id: null,
                comment_article_id: null,
                comment_topic_id: null,

                like_comment_video_id: null,
                like_comment_img_id: null,
                like_comment_doc_id: null,
                like_comment_audio_id: null,
                like_comment_post_id: null,
                like_comment_article_id: null,
                like_comment_topic_id: null,

                reply_comment_video_id: null,
                reply_comment_img_id: null,
                reply_comment_doc_id: null,
                reply_comment_audio_id: null,
                reply_comment_post_id: null,
                reply_comment_article_id: null,
                reply_comment_topic_id: null,

                viewed: null,
                create_date: fields.create_date
            }

            let collection
            let arResult

            switch (fields.type) {
                case 'like_comment_video':
                    collection = mongoClient.collection(`comment_video`)

                    //запрос за лайком
                    arFields.like_comment_video_id = fields.child_id

                    //запрос за комментом
                    arFields.comment_video_id = fields.object_id

                    //запрос за видео
                    arResult = await collection.findOne({_id: fields.object_id})
                    arFields.video_id = arResult.object_id
                    break;
                case 'like_comment_img':
                    collection = mongoClient.collection(`comment_img`)

                    //запрос за лайком
                    arFields.like_comment_img_id = fields.child_id

                    //запрос за комментом
                    arFields.comment_img_id = fields.object_id

                    //запрос за видео
                    arResult = await collection.findOne({_id: fields.object_id})
                    arFields.img_id = arResult.object_id
                    break;
                case 'like_comment_doc':
                    collection = mongoClient.collection(`comment_doc`)

                    //запрос за лайком
                    arFields.like_comment_doc_id = fields.child_id

                    //запрос за комментом
                    arFields.comment_doc_id = fields.object_id

                    //запрос за видео
                    arResult = await collection.findOne({_id: fields.object_id})
                    arFields.doc_id = arResult.object_id
                    break;
                case 'like_comment_audio':
                    collection = mongoClient.collection(`comment_audio`)

                    //запрос за лайком
                    arFields.like_comment_audio_id = fields.child_id

                    //запрос за комментом
                    arFields.comment_audio_id = fields.object_id

                    //запрос за видео
                    arResult = await collection.findOne({_id: fields.object_id})
                    arFields.audio_id = arResult.object_id
                    break;
                case 'like_comment_post':
                    collection = mongoClient.collection(`comment_post`)

                    //запрос за лайком
                    arFields.like_comment_post_id = fields.child_id

                    //запрос за комментом
                    arFields.comment_post_id = fields.object_id

                    //запрос за видео
                    arResult = await collection.findOne({_id: fields.object_id})
                    arFields.post_id = arResult.object_id
                    break;
                case 'like_comment_article':
                    collection = mongoClient.collection(`comment_article`)

                    //запрос за лайком
                    arFields.like_comment_article_id = fields.child_id

                    //запрос за комментом
                    arFields.comment_article_id = fields.object_id

                    //запрос за видео
                    arResult = await collection.findOne({_id: fields.object_id})
                    arFields.article_id = arResult.object_id
                    break;
                case 'like_comment_topic':
                    collection = mongoClient.collection(`comment_topic`)

                    //запрос за лайком
                    arFields.like_comment_topic_id = fields.child_id

                    //запрос за комментом
                    arFields.comment_topic_id = fields.object_id

                    //запрос за видео
                    arResult = await collection.findOne({_id: fields.object_id})
                    arFields.topic_id = arResult.object_id
                    break;
                case 'reply_comment_video':
                    collection = mongoClient.collection(`comment_topic`)

                    //запрос за комментом
                    arFields.comment_video_id = fields.child_id

                    //запрос за комментом
                    arResult = await collection.findOne({_id: fields.child_id})
                    arFields.reply_comment_video_id = arResult.repeat_id

                    //запрос за видео
                    arFields.video_id = fields.object_id
                    break;
                case 'reply_comment_img':
                    collection = mongoClient.collection(`comment_img`)

                    //запрос за комментом
                    arFields.comment_img_id = fields.child_id

                    //запрос за комментом
                    arResult = await collection.findOne({_id: fields.child_id})
                    arFields.reply_comment_img_id = arResult.repeat_id

                    //запрос за видео
                    arFields.img_id = fields.object_id
                    break;
                case 'reply_comment_doc':
                    collection = mongoClient.collection(`comment_doc`)

                    //запрос за комментом
                    arFields.comment_doc_id = fields.child_id

                    //запрос за комментом
                    arResult = await collection.findOne({_id: fields.child_id})
                    arFields.reply_comment_doc_id = arResult.repeat_id

                    //запрос за видео
                    arFields.doc_id = fields.object_id
                    break;
                case 'reply_comment_audio':
                    collection = mongoClient.collection(`comment_audio`)

                    //запрос за комментом
                    arFields.comment_audio_id = fields.child_id

                    //запрос за комментом
                    arResult = await collection.findOne({_id: fields.child_id})
                    arFields.reply_comment_audio_id = arResult.repeat_id

                    //запрос за видео
                    arFields.audio_id = fields.object_id
                    break;
                case 'reply_comment_post':
                    collection = mongoClient.collection(`comment_post`)

                    //запрос за комментом
                    arFields.comment_post_id = fields.child_id

                    //запрос за комментом
                    arResult = await collection.findOne({_id: fields.child_id})
                    arFields.reply_comment_post_id = arResult.repeat_id

                    //запрос за видео
                    arFields.post_id = fields.object_id
                    break;
                case 'reply_comment_article':
                    collection = mongoClient.collection(`comment_article`)

                    //запрос за комментом
                    arFields.comment_article_id = fields.child_id

                    //запрос за комментом
                    arResult = await collection.findOne({_id: fields.child_id})
                    arFields.reply_comment_article_id = arResult.repeat_id

                    //запрос за видео
                    arFields.article_id = fields.object_id
                    break;
                case 'reply_comment_topic':
                    collection = mongoClient.collection(`comment_topic`)

                    //запрос за комментом
                    arFields.comment_topic_id = fields.child_id

                    //запрос за комментом
                    arResult = await collection.findOne({_id: fields.child_id})
                    arFields.reply_comment_topic_id = arResult.repeat_id

                    //запрос за видео
                    arFields.topic_id = fields.object_id
                    break;
                case 'comment_video':
                    //запрос за комментом
                    arFields.comment_video_id = fields.child_id

                    //запрос за видео
                    arFields.video_id = fields.object_id
                    break;
                case 'comment_img':
                    //запрос за комментом
                    arFields.comment_img_id = fields.child_id

                    //запрос за видео
                    arFields.img_id = fields.object_id
                    break;
                case 'comment_doc':
                    //запрос за комментом
                    arFields.comment_doc_id = fields.child_id

                    //запрос за видео
                    arFields.doc_id = fields.object_id
                    break;
                case 'comment_audio':
                    //запрос за комментом
                    arFields.comment_audio_id = fields.child_id

                    //запрос за видео
                    arFields.audio_id = fields.object_id
                    break;
                case 'comment_post':
                    //запрос за комментом
                    arFields.comment_post_id = fields.child_id

                    //запрос за видео
                    arFields.post_id = fields.object_id
                    break;
                case 'comment_article':
                    //запрос за комментом
                    arFields.comment_article_id = fields.child_id

                    //запрос за видео
                    arFields.article_id = fields.object_id
                    break;
                case 'comment_topic':
                    //запрос за комментом
                    arFields.comment_topic_id = fields.child_id

                    //запрос за видео
                    arFields.topic_id = fields.object_id
                    break;

                case 'like_video':
                    //запрос за комментом
                    arFields.like_video_id = fields.child_id

                    //запрос за видео
                    arFields.video_id = fields.object_id
                    break;
                case 'like_img':
                    //запрос за комментом
                    arFields.like_img_id = fields.child_id

                    //запрос за видео
                    arFields.img_id = fields.object_id
                    break;
                case 'like_doc':
                    //запрос за комментом
                    arFields.like_doc_id = fields.child_id

                    //запрос за видео
                    arFields.doc_id = fields.object_id
                    break;
                case 'like_audio':
                    //запрос за комментом
                    arFields.like_audio_id = fields.child_id

                    //запрос за видео
                    arFields.audio_id = fields.object_id
                    break;
                case 'like_post':
                    //запрос за комментом
                    arFields.like_post_id = fields.child_id

                    //запрос за видео
                    arFields.post_id = fields.object_id
                    break;
                case 'like_article':
                    //запрос за комментом
                    arFields.like_article_id = fields.child_id

                    //запрос за видео
                    arFields.article_id = fields.object_id
                    break;
                case 'like_topic':
                    //запрос за комментом
                    arFields.like_topic_id = fields.child_id

                    //запрос за видео
                    arFields.topic_id = fields.object_id
                    break;

                case 'video':
                    //запрос за видео
                    arFields.video_id = fields.object_id
                    break;
                case 'img':
                    //запрос за видео
                    arFields.img_id = fields.object_id
                    break;
                case 'doc':
                    //запрос за видео
                    arFields.doc_id = fields.object_id
                    break;
                case 'audio':
                    //запрос за видео
                    arFields.audio_id = fields.object_id
                    break;
                case 'post':
                    //запрос за видео
                    arFields.post_id = fields.object_id
                    break;
                case 'article':
                    //запрос за видео
                    arFields.article_id = fields.object_id
                    break;
                case 'topic':
                    //запрос за видео
                    arFields.topic_id = fields.object_id
                    break;
                default:
                    console.log('нет')
            }

            let result = await collectionNotify.insertOne(arFields)
            return arFields

        } catch (err) {
            console.log(err)
            throw ({code: 2001000, msg: 'CNotify Add'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.to_id = new DB().ObjectID(fields.to_id)
            let collection = mongoClient.collection('notify')

            const Join = (collectionName, field) => {
                return {
                    $lookup: {
                        from: `${collectionName}`,
                        localField: `${field}`,
                        foreignField: '_id',
                        as: `_${field}`,
                    }
                }
            }

            const JoinNoAr = (field) => {
                return {
                    $unwind:
                        {
                            path: `$_${field}`,
                            preserveNullAndEmptyArrays: true
                        }
                }
            }

            let arAggregate = []
            arAggregate.push({
                $match: {
                    to_id: fields.to_id
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
                                from: 'file_image',
                                localField: 'photo_id',
                                foreignField: '_id',
                                as: '_photo_id'
                            }
                        },{
                            $unwind: {
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
                    localField: 'to_id',
                    foreignField: '_id',
                    as: '_to_id',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'file_image',
                                localField: 'photo_id',
                                foreignField: '_id',
                                as: '_photo_id'
                            }
                        },{
                            $unwind: {
                                path: '$_photo_id',
                                preserveNullAndEmptyArrays: true
                            }
                        }
                    ]
                }
            })
            //объекты
            arAggregate.push(Join('video', 'video_id'))
            arAggregate.push(Join('img', 'img_id'))
            arAggregate.push(Join('doc', 'doc_id'))
            arAggregate.push(Join('audio', 'audio_id'))
            arAggregate.push(Join('post', 'post_id'))
            arAggregate.push(Join('article', 'article_id'))
            arAggregate.push(Join('topic', 'topic_id'))

            arAggregate.push(Join('like_video', 'like_video_id'))
            arAggregate.push(Join('like_img', 'like_img_id'))
            arAggregate.push(Join('like_doc', 'like_doc_id'))
            arAggregate.push(Join('like_audio', 'like_audio_id'))
            arAggregate.push(Join('like_post', 'like_post_id'))
            arAggregate.push(Join('like_article', 'like_article_id'))
            arAggregate.push(Join('like_topic', 'like_topic_id'))

            arAggregate.push(Join('comment_video', 'comment_video_id'))
            arAggregate.push(Join('comment_img', 'comment_img_id'))
            arAggregate.push(Join('comment_doc', 'comment_doc_id'))
            arAggregate.push(Join('comment_audio', 'comment_audio_id'))
            arAggregate.push(Join('comment_post', 'comment_post_id'))
            arAggregate.push(Join('comment_article', 'comment_article_id'))
            arAggregate.push(Join('comment_topic', 'comment_topic_id'))

            arAggregate.push(Join('like_comment_video', 'like_comment_video_id'))
            arAggregate.push(Join('like_comment_img', 'like_comment_img_id'))
            arAggregate.push(Join('like_comment_doc', 'like_comment_doc_id'))
            arAggregate.push(Join('like_comment_audio', 'like_comment_audio_id'))
            arAggregate.push(Join('like_comment_post', 'like_comment_post_id'))
            arAggregate.push(Join('like_comment_article', 'like_comment_article_id'))
            arAggregate.push(Join('like_comment_topic', 'like_comment_topic_id'))

            arAggregate.push(Join('comment_video', 'reply_comment_video_id'))
            arAggregate.push(Join('comment_img', 'reply_comment_img_id'))
            arAggregate.push(Join('comment_doc', 'reply_comment_doc_id'))
            arAggregate.push(Join('comment_audio', 'reply_comment_audio_id'))
            arAggregate.push(Join('comment_post', 'reply_comment_post_id'))
            arAggregate.push(Join('comment_article', 'reply_comment_article_id'))
            arAggregate.push(Join('comment_topic', 'reply_comment_topic_id'))

            arAggregate.push(JoinNoAr('video_id'))
            arAggregate.push(JoinNoAr('img_id'))
            arAggregate.push(JoinNoAr('doc_id'))
            arAggregate.push(JoinNoAr('audio_id'))
            arAggregate.push(JoinNoAr('post_id'))
            arAggregate.push(JoinNoAr('article_id'))
            arAggregate.push(JoinNoAr('topic_id'))

            arAggregate.push(JoinNoAr('like_video_id'))
            arAggregate.push(JoinNoAr('like_img_id'))
            arAggregate.push(JoinNoAr('like_doc_id'))
            arAggregate.push(JoinNoAr('like_audio_id'))
            arAggregate.push(JoinNoAr('like_post_id'))
            arAggregate.push(JoinNoAr('like_article_id'))
            arAggregate.push(JoinNoAr('like_topic_id'))

            arAggregate.push(JoinNoAr('comment_video_id'))
            arAggregate.push(JoinNoAr('comment_img_id'))
            arAggregate.push(JoinNoAr('comment_doc_id'))
            arAggregate.push(JoinNoAr('comment_audio_id'))
            arAggregate.push(JoinNoAr('comment_post_id'))
            arAggregate.push(JoinNoAr('comment_article_id'))
            arAggregate.push(JoinNoAr('comment_topic_id'))

            arAggregate.push(JoinNoAr('like_comment_video_id'))
            arAggregate.push(JoinNoAr('like_comment_img_id'))
            arAggregate.push(JoinNoAr('like_comment_doc_id'))
            arAggregate.push(JoinNoAr('like_comment_audio_id'))
            arAggregate.push(JoinNoAr('like_comment_post_id'))
            arAggregate.push(JoinNoAr('like_comment_article_id'))
            arAggregate.push(JoinNoAr('like_comment_topic_id'))

            arAggregate.push(JoinNoAr('reply_comment_video_id'))
            arAggregate.push(JoinNoAr('reply_comment_img_id'))
            arAggregate.push(JoinNoAr('reply_comment_doc_id'))
            arAggregate.push(JoinNoAr('reply_comment_audio_id'))
            arAggregate.push(JoinNoAr('reply_comment_post_id'))
            arAggregate.push(JoinNoAr('reply_comment_article_id'))
            arAggregate.push(JoinNoAr('reply_comment_topic_id'))

            arAggregate.push(JoinNoAr('from_id'))
            arAggregate.push(JoinNoAr('to_id'))

            arAggregate.push({
                $sort: {
                    _id: -1,
                }
            })

            let result = await collection.aggregate(arAggregate).skip(fields.offset).limit(fields.count).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CArticle Get'})
        }
    }

    //загрузка
    static async GetCount ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.to_id = new DB().ObjectID(fields.to_id)
            let collection = mongoClient.collection('notify')

            let arAggregate = []
            arAggregate.push({
                $match: {
                    to_id: fields.to_id
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
            const mongoClient = Store.GetMongoClient()
            fields.to_id = new DB().ObjectID(fields.to_id)
            let collection = mongoClient.collection('notify')

            let arAggregate = []
            arAggregate.push({
                $match: {
                    to_id: fields.to_id,
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
