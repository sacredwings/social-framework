import {DB} from "./db"
import {CNotify} from "./notify"
import {CVideo} from "./video"
import {CPost} from "./post"
import {CArticle} from "./article"
import {CForumTopic} from "./forum/topic"
import { Store } from "../store"


export class CComment {

    //новый комментарий
    static async Add ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection(`comment_${fields.module}`)

            //ОПРЕДЕЛЕНИЕ ПЕРЕМЕННЫХ

            //обработка полей
            fields.object_id = new DB().ObjectID(fields.object_id) //чему адресован комментарий
            fields.from_id = new DB().ObjectID(fields.from_id)

            fields.republish_id = new DB().ObjectID(fields.republish_id)

            fields.video_ids = new DB().arObjectID(fields.video_ids)
            fields.img_ids = new DB().arObjectID(fields.img_ids)
            fields.doc_ids = new DB().arObjectID(fields.doc_ids)
            fields.audio_ids = new DB().arObjectID(fields.audio_ids)
            let date = new Date()

            //узнаем создателя объекта
            let object = null
            if (fields.module === 'video') object = await CVideo.GetById ( [fields.object_id] )
            if (fields.module === 'post') object = await CPost.GetById ( [fields.object_id] )
            if (fields.module === 'article') object = await CArticle.GetById ( [fields.object_id] )
            if (fields.module === 'topic') object = await CForumTopic.GetById ( [fields.object_id] )

            //узнаем создателя репоста
            let objectRepublish = null
            if (fields.republish_id) {
                objectRepublish = await CComment.GetById ( [fields.republish_id], fields.module )

                if (!objectRepublish.length) return false
                objectRepublish = objectRepublish[0]
            }


            if (!object.length) return false
            object = object[0]

            //ДОБАВЛЕНИЕ КОММЕНТАРИЯ
            let arFieldsMessage = {
                object_id: fields.object_id,
                from_id: fields.from_id,

                republish_id: fields.republish_id,
                republish_user_id: objectRepublish ? objectRepublish.from_id : null,

                to_user_id: object.from_id,
                to_group_id: object.to_group_id,



                text: fields.text,
                video_ids: fields.video_ids,
                img_ids: fields.img_ids,
                doc_ids: fields.doc_ids,
                audio_ids: fields.audio_ids,

                create_date: date,
            }
            await collection.insertOne(arFieldsMessage)

            //ОБНОВЛЕНИЕ СЧЕТЧИКОВ

            //ОБЪЕКТ

            //КОЛИЧЕСТВО КОММЕНТАРИЙ
            //получаем количество комментарий
            let arFields = {
                module: fields.module,
                object_id: fields.object_id,
            }
            let objectCountComment = await this.Count ( arFields )

            //выбираем коллекцию с объектом
            collection = mongoClient.collection(fields.module)
            //обновляем поле в объекте
            await collection.updateOne({_id: fields.object_id}, {
                $set: {
                    comment: objectCountComment,
                    change_user_id: fields.from_id, //обновление последнего комментатора
                    change_date: date,
                }
            })

            //КОЛИЧЕСТВО ОТВЕТОВ
            let republish = null
            //ОБНОВЛЕНИЕ СЧЕТЧИКА ОТВЕТОВ
            //подсчет у объекта на который отвечаем
            if (fields.republish_id) {
                collection = mongoClient.collection(`comment_${fields.module}`)
                let republishCount = await collection.countDocuments({republish_id: fields.republish_id})
                await collection.updateOne({_id: fields.republish_id}, {
                    $set: {
                        republish: republishCount,
                    }
                })

                //получаем объект которому отвечаем
                republish = await this.GetById ( [fields.republish_id], fields.module )
            }

            //ПОЛЬЗОВАТЕЛЬ
            let arUser = [{}, {}, {}]
            let fieldsDefault = {
                all: 0,
                video: 0,
                post: 0,
                article: 0,
                topic: 0
            }

            arUser[0].count_comment_in = {}
            arUser[1].count_comment_out = {}
            arUser[2].count_comment_in = {}

            for (let key in fieldsDefault)
                arUser[0].count_comment_in[key] = fieldsDefault[key]

            for (let key in fieldsDefault)
                arUser[1].count_comment_out[key] = fieldsDefault[key]

            for (let key in fieldsDefault)
                arUser[2].count_comment_in[key] = fieldsDefault[key]

            /*
            //кому оставили коммент / создатель объекта
            arUser[0].count_comment_in = 0
            arUser[0].count_comment_video_in = 0
            arUser[0].count_comment_post_in = 0
            arUser[0].count_comment_article_in = 0
            arUser[0].count_comment_topic_in = 0

            //кто оставил коммент
            arUser[1].count_comment_out = 0
            arUser[1].count_comment_video_out = 0
            arUser[1].count_comment_post_out = 0
            arUser[1].count_comment_article_out = 0
            arUser[1].count_comment_topic_out = 0

            //кому оставили коммент / создатель объекта
            arUser[2].count_comment_in = 0
            arUser[2].count_comment_video_in = 0
            arUser[2].count_comment_post_in = 0
            arUser[2].count_comment_article_in = 0
            arUser[2].count_comment_topic_in = 0*/

            let arModules = ['video', 'post', 'article', 'topic']

            //кому оставили коммент
            for (let item of arModules) {
                arFields = {
                    module: item,
                    to_user_id: object.from_id
                }
                arUser[0].count_comment_in[item] = await this.Count ( arFields ) //по каждому модулю
                arUser[0].count_comment_in.all += arUser[0].count_comment_in[item] //общие входящие

                //кто оставил коммент
                arFields = {
                    module: item,
                    from_id: fields.from_id
                }
                arUser[1].count_comment_out[item] = await this.Count ( arFields ) //по каждому модулю
                arUser[1].count_comment_out.all += arUser[1].count_comment_out[item] //общие входящие

                if (fields.republish_id) {
                    arFields = {
                        module: item,
                        republish_user_id: objectRepublish.from_id
                    }
                    arUser[2].count_comment_in[item] = await this.Count ( arFields ) //по каждому модулю
                    arUser[2].count_comment_in.all += arUser[2].count_comment_in[item] //общие входящие
                }
            }

            /*
            for (let item of arModules) {
                arFields = {
                    module: item,
                    from_id: fields.from_id
                }
                arUser[1][`count_comment_${item}_out`] = await this.Count ( arFields ) //по каждому модулю
                arUser[1].count_comment_out += arUser[1][`count_comment_${item}_out`] //общие входящие
            }

            if (fields.republish_id)
                for (let item of arModules) {
                    arFields = {
                        module: item,
                        republish_user_id: objectRepublish.from_id
                    }
                    arUser[2][`count_comment_${item}_in`] = await this.Count ( arFields ) //по каждому модулю
                    arUser[2].count_comment_in += arUser[2][`count_comment_${item}_in`] //общие входящие
                }*/

            //обновление полей у пользователя
            collection = mongoClient.collection('user')

            await collection.updateOne({_id: object.from_id}, {$set: {
                    count_comment_in: arUser[0].count_comment_in
                }})
            await collection.updateOne({_id: fields.from_id}, {$set: {
                    count_comment_out: arUser[1].count_comment_out
                }})

            if (fields.republish_id)
                await collection.updateOne({_id: objectRepublish.from_id}, {$set: {
                        count_comment_in: arUser[2].count_comment_in
                    }})

            //СОЗДАНИЕ УВЕДОМЛЕНИЯ ПОЛЬЗОВАТЕЛЮ

            //уведомление создателю темы форума
            arFields = {
                from_id: fields.from_id,
                to_id: object.from_id,
                module: fields.module,
                action: 'comment',
                object_id: fields.object_id,
            }
            let notify = await CNotify.Add ( arFields )

            //если это ответ
            //не повторять если владелиц комментария и форума один человек
            if ((republish) && (object.from_id !== republish[0].from_id)) {
                //уведомление комментария на который отвечает пользователь
                arFields.to_id = object.from_id
                notify = await CNotify.Add ( arFields )
            }

        } catch (err) {
            console.log(err)
            throw ({code: 2001000, msg: 'CComment Add'})
        }
    }
    //загрузка по id
    static async GetById ( ids, module ) {
        try {
            const mongoClient = Store.GetMongoClient()
            ids = new DB().arObjectID(ids)

            let collection = mongoClient.collection(`comment_${module}`);
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
            const mongoClient = Store.GetMongoClient()
            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.comment_id = new DB().ObjectID(fields.comment_id)

            let collection = mongoClient.collection(`comment_${fields.module}`)

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
            const mongoClient = Store.GetMongoClient()
            fields.object_id = new DB().ObjectID(fields.object_id)

            let collection = mongoClient.collection(`comment_${fields.module}`)

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
            const mongoClient = Store.GetMongoClient()
            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)

            let collection = mongoClient.collection(`comment_${fields.module}`)

            let arFields = {}
            if (fields.object_id) arFields.object_id = fields.object_id
            if (fields.to_user_id) arFields.to_user_id = fields.to_user_id
            if (fields.to_group_id) arFields.to_group_id = fields.to_group_id
            if (fields.from_id) arFields.from_id = fields.from_id

            let result = await collection.count(arFields)
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 5003000, msg: 'CComment Count'})
        }
    }
    static async Edit(id, fields) {
        try {
            const mongoClient = Store.GetMongoClient()
            id = new DB().ObjectID(id)
            fields.video_ids = new DB().arObjectID(fields.video_ids)
            fields.img_ids = new DB().arObjectID(fields.img_ids)
            fields.doc_ids = new DB().arObjectID(fields.doc_ids)
            fields.audio_ids = new DB().arObjectID(fields.audio_ids)
            fields.change_date = new Date()

            let collection = mongoClient.collection(`comment_${fields.module}`);
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
            const mongoClient = Store.GetMongoClient()
            id = new DB().ObjectID(id)

            let collection = mongoClient.collection('comment');

            let result = collection.deleteOne({_id: id})

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CComment Delete'})
        }
    }

}