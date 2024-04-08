// @ts-nocheck
import { DB } from "./db"
import { CVideo } from "./video"
import { CPost } from "./post"
import { CArticle } from "./article"
import { CComment } from "./comment"
import {CNotify} from "./notify";
import { Store } from "../store"


export class CLike {

    //новый комментарий
    static async Add ( fields ) {
        try {
            if (fields.dislike === false) fields.dislike = null

            const mongoClient = Store.GetMongoClient()

            let module = null
            if (fields.module === 'video') module = `file_video`
            if (fields.module === 'topic') module = `topic`
            if (fields.module === 'post') module = `post`
            if (fields.module === 'article') module = `article`
            if (fields.module === 'comment_video') module = `comment_video`
            if (fields.module === 'comment_post') module = `comment_post`
            if (fields.module === 'comment_article') module = `comment_article`
            if (fields.module === 'comment_topic') module = `comment_topic`

            let collectionLike = mongoClient.collection(`like_${fields.module}`)
            let collectionObject = mongoClient.collection(module)

            //ОПРЕДЕЛЕНИЕ ПЕРЕМЕННЫХ

            //где
            fields.object_id = new DB().ObjectID(fields.object_id)

            //кто
            fields.from_id = new DB().ObjectID(fields.from_id)
            let date = new Date()

            //ПОЛУЧАЕМ ОБЪЕКТ / узнаем создателя объекта
            let object = await collectionObject.findOne({
                _id: fields.object_id
            })
            if (!object) return false

            //ПОИСК
            //установленн уже мной
            let arFields = {
                module: fields.module,
                object_id: fields.object_id,
                from_id: fields.from_id,
            }
            let rsLike = await this.GetByUser(arFields)

            if (!rsLike) {

                //нет записи о лайке /создаем
                arFields = {
                    object_id: fields.object_id,
                    from_id: fields.from_id,
                    to_user_id: object.to_user_id, //для посчета количества лайков \ кто выложил
                    to_group_id: object.to_group_id, //для посчета количества лайков \ куда выложено
                    whom_id: object.from_id,
                    dislike: fields.dislike,
                    create_date: date,
                }
                await collectionLike.insertOne(arFields)

                arFields = {
                    from_id: fields.from_id,
                    to_id: object.from_id, //из объекта
                    type: `like_${fields.module}`,
                    object_id: fields.object_id,
                    child_id: arFields._id,
                }
                let notify = await CNotify.Add ( arFields )

            } else {

                //есть запись /меняем
                if (rsLike.dislike) { //стоит дизлайк

                    if (fields.dislike) //нужен дизлайк
                        await collectionLike.deleteOne({_id: rsLike._id}) //удаляем дизлайк
                    else
                        await collectionLike.updateOne({_id: rsLike._id}, {$set: {dislike: null}}) //изменили на лайк

                } else { //стоит лайк

                    if (fields.dislike) //нужен дизлайк
                        await collectionLike.updateOne({_id: rsLike._id}, {$set: {dislike: true}}) //изменили на лайк
                    else
                        await collectionLike.deleteOne({_id: rsLike._id}) //удаляем лайк

                }
            }

            //ОБНОВЛЕНИЕ СЧЕТЧИКОВ

            //ОБЪЕКТ
            arFields = {
                module: fields.module,
                object_id: fields.object_id,
                dislike: null
            }
            let LikeCount = await this.Count ( arFields )
            arFields.dislike = true
            let DisLikeCount = await this.Count ( arFields )

            //обновляем поля в объекте
            await collectionObject.updateOne({_id: fields.object_id}, {$set: {count_dislike: DisLikeCount, count_like: LikeCount}})

            /*
            //для уведомлений пользователю
            let newLike = null //по умолчанию,  лайк не установлен

            //для установки лайка
            let dislike = null //лайк
            if (fields.dislike)
                dislike = true //дизлайк

            //ПОИСК
            //установленн уже мной
            let arFields = {
                module: fields.module,
                object_id: fields.object_id,
                from_id: fields.from_id,
            }
            let rsLike = await this.GetByUser(arFields)

            if (!rsLike) {

                //нет записи о лайке /создаем
                arFields = {
                    object_id: fields.object_id,
                    from_id: fields.from_id,
                    to_user_id: object.from_id, //для посчета количества лайков \ кто выложил
                    to_group_id: object.to_group_id, //для посчета количества лайков \ куда выложено
                    dislike: dislike,
                    create_date: date,
                }
                await collection.insertOne(arFields)

                newLike = true //лайк установлен

            } else {

                //есть запись /меняем
                if (rsLike.dislike) { //стоит дизлайк

                    if (fields.dislike) //нужен дизлайк
                        await collection.deleteOne({_id: rsLike._id}) //удаляем дизлайк
                    else
                        await collection.updateOne({_id: rsLike._id}, {$set: {dislike: null}}) //изменили на лайк

                } else { //стоит лайк

                    if (fields.dislike) //нужен дизлайк
                        await collection.updateOne({_id: rsLike._id}, {$set: {dislike: true}}) //изменили на лайк
                    else
                        await collection.deleteOne({_id: rsLike._id}) //удаляем лайк

                }
            }

            //ОБНОВЛЕНИЕ СЧЕТЧИКОВ

            //ОБЪЕКТ
            arFields = {
                module: fields.module,
                object_id: fields.object_id,
            }
            let LikeCount = await this.Count ( arFields )
            arFields.dislike = true
            let DisLikeCount = await this.Count ( arFields )

            //выбираем коллекцию с объектом
            collection = mongoClient.collection(fields.module)
            //обновляем поля в объекте
            await collection.updateOne({_id: fields.object_id}, {$set: {dislike: DisLikeCount, like: LikeCount}})

            //ПОЛЬЗОВАТЕЛЬ
            let arUser = [{}, {}]
            let fieldsDefault = {
                all: 0,
                video: 0,
                post: 0,
                article: 0,
                //topic: 0
                comment_video: 0,
                comment_post: 0,
                comment_article: 0,
                comment_topic: 0
            }

            arUser[0].count_like_in = {}
            arUser[0].count_dislike_in = {}
            arUser[1].count_like_out = {}
            arUser[1].count_dislike_out = {}

            for (let key in fieldsDefault)
                arUser[0].count_like_in[key] = fieldsDefault[key]

            for (let key in fieldsDefault)
                arUser[0].count_dislike_in[key] = fieldsDefault[key]

            for (let key in fieldsDefault)
                arUser[1].count_like_out[key] = fieldsDefault[key]

            for (let key in fieldsDefault)
                arUser[1].count_dislike_out[key] = fieldsDefault[key]

            //кого лайкнули / создатель объекта
            //arUser[0].count_like_in = fieldsDefault
            //arUser[0].count_dislike_in = fieldsDefault

            //кто лайкнул
            //arUser[1].count_like_out = fieldsDefault
            //arUser[1].count_dislike_out = fieldsDefault
            //console.log(arUser)
            //let userLikeCount = 0 //при старте
            //let userDisLikeCount = 0 //при старте
            let arModules = ['video', 'post', 'article', 'comment_video', 'comment_post', 'comment_article', 'comment_topic']

            for (let item of arModules) {

                //кого лайкнули / создатель объекта
                arFields = {
                    module: item,
                    to_user_id: object.from_id,
                }

                arUser[0].count_like_in[item] = await this.Count ( arFields )
                arUser[0].count_like_in.all += arUser[0].count_like_in[item]

                arFields.dislike = true
                arUser[0].count_dislike_in[item] = await this.Count ( arFields )
                arUser[0].count_dislike_in.all += arUser[0].count_dislike_in[item]

                //кто лайкнул
                arFields = {
                    module: item,
                    from_id: fields.from_id
                }
                arUser[1].count_like_out[item] = await this.Count ( arFields )
                arUser[1].count_like_out.all += arUser[1].count_like_out[item]

                arFields.dislike = true
                arUser[1].count_dislike_out[item] = await this.Count ( arFields )
                arUser[1].count_dislike_out.all += arUser[1].count_dislike_out[item]

            }

            //выбираем коллекцию с объектом
            collection = mongoClient.collection('user')

            await collection.updateOne({_id: object.from_id}, {$set: {
                    count_like_in: arUser[0].count_like_in,
                    count_dislike_in: arUser[0].count_dislike_in,
                }})

            await collection.updateOne({_id: fields.from_id}, {$set: {
                    count_like_out: arUser[1].count_like_out,
                    count_dislike_out: arUser[1].count_dislike_out,
                }})

            //УВЕДОМЛЕНИЯ
            //если лайк будет установлен с нуля
            if (newLike) {
                arFields = {
                    from_id: fields.from_id,
                    to_id: object.from_id, //из объекта
                    module: fields.module,
                    action: fields.dislike ? 'dislike' : 'like',
                    object_id: fields.object_id,
                }
                let notify = await CNotify.Add ( arFields )
            }*/

            return true
        } catch (err) {
            console.log(err)
            throw ({code: 2001000, msg: 'CLike Add'})
        }
    }

    /*
    static async Get ( fields ) {
        try {
            fields.object_id = new DB().ObjectID(fields.object_id)
            //fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = DB.Client.collection('like')
            let arFields = {
                object_id: fields.object_id
            }
            let result = await collection.findOne(arFields)
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 4003000, msg: 'CLike Get'})
        }
    }
    */

    static async Count ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()

            let arFields = {
                dislike: fields.dislike,
            }

            if (fields.object_id) arFields.object_id = new DB().ObjectID(fields.object_id)
            if (fields.to_user_id) arFields.to_user_id = new DB().ObjectID(fields.to_user_id)
            if (fields.to_group_id) arFields.to_group_id = new DB().ObjectID(fields.to_group_id)
            if (fields.from_id) arFields.from_id = new DB().ObjectID(fields.from_id)

            let collectionLike = mongoClient.collection(`like_${fields.module}`)
            let result = await collectionLike.count(arFields)
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 4003000, msg: 'CLike Count'})
        }
    }

    static async GetByUser ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()

            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collectionLike = mongoClient.collection(`like_${fields.module}`)
            let arFields = {
                from_id: fields.from_id,
                object_id: fields.object_id,
            }
            let result = await collectionLike.findOne(arFields)
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 4003000, msg: 'CLike GetByUser'})
        }
    }


    //загрузка
    static async Get ( fields ) {
        try {
            if (fields.from_id)
                fields.from_id = new DB().ObjectID(fields.from_id)
            if (fields.to_user_id)
                fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            if (fields.to_group_id)
                fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            if (fields.whom_id)
                fields.whom_id = new DB().ObjectID(fields.whom_id)

            let module = null
            if (fields.module === 'video') module = `file_video`
            if (fields.module === 'topic') module = `topic`
            if (fields.module === 'post') module = `post`
            if (fields.module === 'article') module = `article`
            if (fields.module === 'comment_video') module = `comment_video`
            if (fields.module === 'comment_post') module = `comment_post`
            if (fields.module === 'comment_article') module = `comment_article`
            if (fields.module === 'comment_topic') module = `comment_topic`

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
                    from: 'user',
                    localField: 'whom_id',
                    foreignField: '_id',
                    as: '_whom_id',
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
                    from: module,
                    localField: 'object_id',
                    foreignField: '_id',
                    as: '_object_id'
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
                    path: '$_whom_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_object_id',
                    preserveNullAndEmptyArrays: true
                }
            })

            if (fields.from_id) arAggregate[0].$match.from_id = fields.from_id
            if (fields.to_user_id) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
            if (fields.whom_id) arAggregate[0].$match.whom_id = fields.whom_id

            arAggregate.push({
                $sort: {
                    _id: -1,
                }
            })

            const mongoClient = Store.GetMongoClient()
            let collectionLike = mongoClient.collection(`like_${fields.module}`)
            let result = await collectionLike.aggregate(arAggregate).skip(fields.offset).limit(fields.count).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CLike Get'})
        }
    }

    //количество
    static async GetCount ( fields ) {
        try {

            if (fields.from_id)
                fields.from_id = new DB().ObjectID(fields.from_id)
            if (fields.to_user_id)
                fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            if (fields.to_group_id)
                fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            if (fields.whom_id)
                fields.whom_id = new DB().ObjectID(fields.whom_id)

            let arAggregate = []
            arAggregate.push({
                $match: {}
            })

            if (fields.from_id) arAggregate[0].$match.from_id = fields.from_id
            if (fields.to_user_id) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
            if (fields.whom_id) arAggregate[0].$match.whom_id = fields.whom_id

            arAggregate.push({
                $count: 'count'
            })

            const mongoClient = Store.GetMongoClient()
            let collectionLike = mongoClient.collection(`like_${fields.module}`)
            let result = await collectionLike.aggregate(arAggregate).toArray()

            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CLike GetCount'})
        }
    }
}
