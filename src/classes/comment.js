import {DB} from "./db"
import {CNotify} from "./notify"
import {CVideo} from "./video"
import {CPost} from "./post"
import {CArticle} from "./article"
import {CForumTopic} from "./forum/topic"

export class CComment {

    //новый комментарий
    static async Add ( fields ) {
        try {
            //СОЗДАНИЕ КОММЕНТАРИЯ
            //обработка полей
            fields.object_id = new DB().ObjectID(fields.object_id) //чему адресован комментарий

            fields.from_id = new DB().ObjectID(fields.from_id)

            fields.republish_id = new DB().ObjectID(fields.republish_id)

            fields.video_ids = new DB().arObjectID(fields.video_ids)
            fields.img_ids = new DB().arObjectID(fields.img_ids)
            fields.doc_ids = new DB().arObjectID(fields.doc_ids)
            fields.audio_ids = new DB().arObjectID(fields.audio_ids)

            let date = new Date()

            //комментарий
            let collection = DB.Client.collection(`comment_${fields.module}`)
            let arFieldsMessage = {
                object_id: fields.object_id,
                from_id: fields.from_id,
                republish_id: fields.republish_id,

                text: fields.text,
                video_ids: fields.video_ids,
                img_ids: fields.img_ids,
                doc_ids: fields.doc_ids,
                audio_ids: fields.audio_ids,

                create_date: date,
            }
            await collection.insertOne(arFieldsMessage)

            //ОБНОВЛЕНИЕ СЧЕТЧИКА КОММЕНТОВ У ОБЪЕКТА
            //получаем количество комментарий
            let arFields = {
                module: fields.module,
                object_id: fields.object_id,
            }
            let commentCount = await this.Count ( arFields )

            //выбираем коллекцию с объектом
            collection = DB.Client.collection(fields.module)
            //обновляем поле в объекте
            await collection.updateOne({_id: fields.object_id}, {
                $set: {
                    comment: commentCount,
                    //change_user_id: fields.from_id,
                    //change_date: date,
                }
            })

            //ОБНОВЛЕНИЕ СЧЕТЧИКА ОТВЕТОВ
            if (fields.republish_id) {
                collection = DB.Client.collection(`comment_${fields.module}`)
                let republishCount = await collection.countDocuments({republish_id: fields.republish_id})
                await collection.updateOne({_id: fields.republish_id}, {
                    $set: {
                        republish: republishCount,
                    }
                })
            }

            //СОЗДАНИЕ УВЕДОМЛЕНИЯ ПОЛЬЗОВАТЕЛЮ
            collection = DB.Client.collection(fields.module)
            let getObject = null
            //ОПОВЕЩЕНИЯ
            if (fields.module === 'video')
                getObject = await CVideo.GetById ( [fields.object_id] )

            if (fields.module === 'post')
                getObject = await CPost.GetById ( [fields.object_id] )

            if (fields.module === 'article')
                getObject = await CArticle.GetById ( [fields.object_id] )

            if (fields.module === 'topic')
                getObject = await CForumTopic.GetById ( [fields.object_id] )

            arFields = {
                from_id: fields.from_id,
                to_id: getObject[0].from_id,
                module: fields.module,
                action: 'comment',
                object_id: fields.object_id,
            }
            let notify = await CNotify.Add ( arFields )

        } catch (err) {
            console.log(err)
            throw ({code: 2001000, msg: 'CComment Add'})
        }
    }
    //загрузка по id
    static async GetById ( ids, module ) {
        try {
            ids = new DB().arObjectID(ids)

            let collection = DB.Client.collection(`comment_${module}`);
            let result = await collection.aggregate([
                { $match:
                        {
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
                                        from: 'file',
                                        localField: 'photo',
                                        foreignField: '_id',
                                        as: '_photo'
                                    }
                            },
                            {
                                $unwind:
                                    {
                                        path: '$_photo',
                                        preserveNullAndEmptyArrays: true
                                    }
                            }
                        ]
                    },
                },{
                    $lookup:
                        {
                            from: 'file',
                            localField: 'video_ids',
                            foreignField: '_id',
                            as: '_video_ids',
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
                },{ $lookup:
                        {
                            from: 'file',
                            localField: 'img_ids',
                            foreignField: '_id',
                            as: '_img_ids'
                        },
                },{ $lookup:
                        {
                            from: 'file',
                            localField: 'doc_ids',
                            foreignField: '_id',
                            as: '_doc_ids'
                        },
                },{ $lookup:
                        {
                            from: 'file',
                            localField: 'audio_ids',
                            foreignField: '_id',
                            as: '_audio_ids'
                        },
                },{
                    $unwind: {
                        path: '$_from_id',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]).toArray();

            return result

        } catch (err) {
            console.log(err)
            throw ({code: 6002000, msg: 'CComment GetById'})
        }
    }
    static async Get ( fields ) {
        try {
            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.comment_id = new DB().ObjectID(fields.comment_id)

            let collection = DB.Client.collection(`comment_${fields.module}`)

            let Aggregate = [
                {
                    $match: {
                        //module: fields.module,
                        object_id: fields.object_id
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
                                        from: 'file',
                                        localField: 'photo',
                                        foreignField: '_id',
                                        as: '_photo'
                                    }
                            },
                            {
                                $unwind:
                                    {
                                        path: '$_photo',
                                        preserveNullAndEmptyArrays: true
                                    }
                            }
                        ]
                    },
                },{
                $lookup:
                        {
                            from: 'file',
                            localField: 'video_ids',
                            foreignField: '_id',
                            as: '_video_ids',
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
                },{ $lookup:
                        {
                            from: 'file',
                            localField: 'img_ids',
                            foreignField: '_id',
                            as: '_img_ids'
                        },
                },{ $lookup:
                        {
                            from: 'file',
                            localField: 'doc_ids',
                            foreignField: '_id',
                            as: '_doc_ids'
                        },
                },{ $lookup:
                        {
                            from: 'file',
                            localField: 'audio_ids',
                            foreignField: '_id',
                            as: '_audio_ids'
                        },
                },{
                    $unwind: {
                        path: '$_from_id',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]

            let result = await collection.aggregate(Aggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 5003000, msg: 'CComment GetChatUser'})
        }
    }

    static async GetCount ( fields ) {
        try {
            fields.object_id = new DB().ObjectID(fields.object_id)

            let collection = DB.Client.collection(`comment_${fields.module}`)

            let Aggregate = [
                {
                    $match: {
                        object_id: fields.object_id
                    }
                },{
                    $count: 'count'
                }
            ]

            let result = await collection.aggregate(Aggregate).toArray();
            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 5003000, msg: 'CComment Count'})
        }
    }

    static async Count ( fields ) {
        try {
            fields.object_id = new DB().ObjectID(fields.object_id)

            let collection = DB.Client.collection(`comment_${fields.module}`)

            let Aggregate = [{
                $match: {
                    object_id: fields.object_id
                }
            },{
                $count: 'count'
            }]

            let result = await collection.aggregate(Aggregate).toArray();

            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 5003000, msg: 'CComment Count'})
        }
    }
    static async Edit(id, fields) {
        try {
            id = new DB().ObjectID(id)
            fields.video_ids = new DB().arObjectID(fields.video_ids)
            fields.img_ids = new DB().arObjectID(fields.img_ids)
            fields.doc_ids = new DB().arObjectID(fields.doc_ids)
            fields.audio_ids = new DB().arObjectID(fields.audio_ids)
            fields.change_date = new Date()

            let collection = DB.Client.collection(`comment_${fields.module}`);
            let arFields = {
                _id: id
            }

            delete fields.module

            let result = collection.updateOne(arFields, {$set: fields})

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CComment Edit'})
        }
    }
    static async Delete ( id ) {
        try {
            id = new DB().ObjectID(id)

            let collection = DB.Client.collection('comment');

            let result = collection.deleteOne({_id: id})

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CComment Delete'})
        }
    }

}