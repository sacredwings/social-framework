import {DB} from "./db"
import {CNotify} from "./notify"
import {CVideo} from "./video"
import {CPost} from "./post"
import {CArticle} from "./article"
import {CTopic} from "./topic"
import { Store } from "../store"


export class CComment {

    //новый комментарий
    static async Add ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collectionObject = mongoClient.collection(fields.module)
            if ((fields.module === 'video') ||
                (fields.module === 'audio') ||
                (fields.module === 'img') ||
                (fields.module === 'doc')) collectionObject = mongoClient.collection(`file_${fields.module}`)
            let collectionComment = mongoClient.collection(`comment_${fields.module}`)

            if (fields.object_id)
                fields.object_id = new DB().ObjectID(fields.object_id)
            if (fields.republish_id)
                fields.republish_id = new DB().ObjectID(fields.republish_id)

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
            /*
            if (fields.to_user_id)
                fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            if (fields.to_group_id)
                fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            */
            let date = new Date()

            console.log(fields)
            console.log(`file_${fields.module}`)
            //ПОЛУЧАЕМ ОБЪЕКТ / узнаем создателя объекта

            let object = await collectionObject.findOne({
                _id: fields.object_id
            })
            if (!object) throw ({code: 6001000, msg: 'CComment Add Нет объекта'})

            //ПОЛУЧАЕМ РЕПОСТ КОММЕНТА / узнаем создателя репоста
            let objectRepublish = null
            if (fields.republish_id) {
                objectRepublish = await this.GetById ( [fields.republish_id], fields.module )

                if (!objectRepublish.length) throw ({code: 6001000, msg: 'CComment Add Нет комментария репоста'})
                objectRepublish = objectRepublish[0]
            }

            //ДОБАВЛЕНИЕ КОММЕНТАРИЯ
            let arFieldsMessage = {
                object_id: fields.object_id,

                republish_id: fields.republish_id,
                republish_user_id: objectRepublish ? objectRepublish.from_id : null,

                from_id: fields.from_id,
                to_user_id: object.to_user_id,
                to_group_id: object.to_group_id,

                text: fields.text,
                video_ids: fields.video_ids,
                img_ids: fields.img_ids,
                doc_ids: fields.doc_ids,
                audio_ids: fields.audio_ids,

                create_date: date,
            }
            await collectionComment.insertOne(arFieldsMessage)

            //ОБНОВЛЕНИЕ СЧЕТЧИКОВ

            //ОБЪЕКТ

            //СЧЕТЧИК КОММЕНТАРИЙ у объекта
            //получаем количество комментарий
            let arFields = {
                object_id: fields.object_id
            }
            //let objectCountComment = await this.Count ( arFields )

            //выбираем коллекцию с объектом
            //collection = mongoClient.collection(fields.module)
            let objectCountComment = await collectionComment.countDocuments(arFields)

            //обновляем поле в объекте
            await collectionObject.updateOne({_id: fields.object_id}, {
                $set: {
                    count_comment: objectCountComment,
                    change_user_id: fields.from_id, //обновление последнего комментатора
                    change_date: date,
                }
            })

            //СЧЕТЧИК КОММЕНТАРИЙ у ответа
            //let republish = null
            //ОБНОВЛЕНИЕ СЧЕТЧИКА ОТВЕТОВ
            //подсчет у объекта на который отвечаем
            if (fields.republish_id) {
                let republishCountComment = await collectionComment.countDocuments({republish_id: fields.republish_id})
                await collectionComment.updateOne({_id: fields.republish_id}, {
                    $set: {
                        count_comment: republishCountComment,
                    }
                })

                //получаем объект которому отвечаем
                //republish = await this.GetById ( [fields.republish_id], fields.module )
            }

            /*
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


            //кому оставили коммент / создатель объекта
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
*/

        } catch (err) {
            console.log(err)
            throw ({...{code: 2001000, msg: 'CComment Add'}, ...err})
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
                    from: `comment_${module}`,
                    localField: 'republish_id',
                    foreignField: '_id',
                    as: '_republish_id',
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'user',
                    localField: 'republish_user_id',
                    foreignField: '_id',
                    as: '_republish_user_id',
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
                    from: 'file_video',
                    localField: 'video_ids',
                    foreignField: '_id',
                    as: '_video_ids'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'file_img',
                    localField: 'img_ids',
                    foreignField: '_id',
                    as: '_img_ids'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'file_doc',
                    localField: 'doc_ids',
                    foreignField: '_id',
                    as: '_doc_ids'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'file_audio',
                    localField: 'audio_ids',
                    foreignField: '_id',
                    as: '_audio_ids'
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_republish_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_republish_user_id',
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
                    _id: -1
                }
            })

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection(`comment_${module}`)
            let result = await collection.aggregate(arAggregate).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 6002000, msg: 'CComment GetById'})
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

            const mongoClient = Store.GetMongoClient()
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

    static async Get ( fields ) {
        try {
            if (fields.q) {
                fields.q = fields.q.replace(/ +/g, ' ').trim();
                fields.q = fields.q.replace("[^\\da-zA-Zа-яёА-ЯЁ ]", ' ').trim();
            }

            if (fields.object_id)
                fields.object_id = new DB().ObjectID(fields.object_id)
            if (fields.comment_id)
                fields.comment_id = new DB().ObjectID(fields.comment_id)

            let arAggregate = []
            arAggregate.push({
                $match: {
                    object_id: fields.object_id
                }
            })
            arAggregate.push({
                $lookup: {
                    from: `comment_${module}`,
                    localField: 'republish_id',
                    foreignField: '_id',
                    as: '_republish_id',
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'user',
                    localField: 'republish_user_id',
                    foreignField: '_id',
                    as: '_republish_user_id',
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
                    from: 'file_video',
                    localField: 'video_ids',
                    foreignField: '_id',
                    as: '_video_ids'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'file_video',
                    localField: 'video_ids',
                    foreignField: '_id',
                    as: '_video_ids'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'file_img',
                    localField: 'img_ids',
                    foreignField: '_id',
                    as: '_img_ids'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'file_doc',
                    localField: 'doc_ids',
                    foreignField: '_id',
                    as: '_doc_ids'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'file_audio',
                    localField: 'audio_ids',
                    foreignField: '_id',
                    as: '_audio_ids'
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_republish_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_republish_user_id',
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

            if (fields.comment_id) arAggregate[0].$match.comment_id = fields.comment_id

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
            let collection = mongoClient.collection(`comment_${fields.module}`)
            let result = await collection.aggregate(arAggregate).skip(fields.offset).limit(fields.count).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 5003000, msg: 'CComment Get'})
        }
    }

    static async GetCount ( fields ) {
        try {
            if (fields.q) {
                fields.q = fields.q.replace(/ +/g, ' ').trim();
                fields.q = fields.q.replace("[^\\da-zA-Zа-яёА-ЯЁ ]", ' ').trim();
            }

            if (fields.object_id)
                fields.object_id = new DB().ObjectID(fields.object_id)

            let arAggregate = []
            arAggregate.push({
                $match: {}
            })

            if (fields.q) arAggregate[0].$match.$text = {}
            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            if (fields.object_id) arAggregate[0].$match.object_id = fields.object_id

            arAggregate.push({
                $count: 'count'
            })

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection(`comment_${fields.module}`)
            let result = await collection.aggregate(arAggregate).toArray()

            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 5003000, msg: 'CComment GetCount'})
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