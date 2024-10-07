// @ts-nocheck
import { DB } from "./db"
import { CVideo } from "./video"
import { CPost } from "./post"
import { CArticle } from "./article"
import { CComment } from "./comment"
import {CNotify} from "./notify";
import { Store } from "../store"
import {CUser} from "./user";
import {CGroup} from "./group";


export class CLike {

    //новый комментарий
    static async Add ( fields ) {
        try {
            //if (fields.dislike === false) fields.dislike = null

            const mongoClient = Store.GetMongoClient()
            let collectionLike = mongoClient.collection(`like_${fields.module}`)
            let collectionObject = mongoClient.collection(fields.module)

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

                /*
                await count({
                    from_id: fields.from_id,
                    to_user_id: object.to_user_id,
                    to_group_id: object.to_group_id,
                    collectionName: fields.module,
                    dislike: fields.dislike,
                })*/

                //объект не пренадлежит мне
                if (fields.from_id.toString() !== object.from_id.toString()) {
                    arFields = {
                        from_id: fields.from_id,
                        to_id: object.from_id, //из объекта
                        type: `like_${fields.module}`,
                        object_id: fields.object_id,
                        child_id: arFields._id,
                    }
                    let notify = await CNotify.Add ( arFields )
                }

            } else {

                //есть запись /меняем
                if (rsLike.dislike) { //стоит дизлайк

                    if (fields.dislike) //нужен дизлайк
                        await collectionLike.deleteOne({_id: rsLike._id}) //удаляем дизлайк
                    else
                        await collectionLike.updateOne({_id: rsLike._id}, {$set: {dislike: false}}) //изменили на лайк

                } else { //стоит лайк

                    if (fields.dislike) //нужен дизлайк
                        await collectionLike.updateOne({_id: rsLike._id}, {$set: {dislike: true}}) //изменили на лайк
                    else
                        await collectionLike.deleteOne({_id: rsLike._id}) //удаляем лайк

                }
            }

            //----------------------------------------------------------------------------------------------------------
            //ОБНОВЛЕНИЕ СЧЕТЧИКОВ

            //ОБЪЕКТ
            arFields = {
                module: fields.module,
                object_id: fields.object_id,
                dislike: false
            }
            let LikeCount = await this.Count ( arFields )
            arFields.dislike = true
            let DisLikeCount = await this.Count ( arFields )

            //обновляем поля в объекте
            await collectionObject.updateOne({_id: fields.object_id}, {$set: {"count.dislike": DisLikeCount, "count.like": LikeCount}})

            //ПОЛЬЗОВАТЕЛЬ / ГРУППА
            await count({
                from_id: fields.from_id,
                to_user_id: object.to_user_id ? object.to_user_id : object.from_id,
                to_group_id: object.to_group_id,
                collectionName: fields.module,
                dislike: fields.dislike,
            })

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

            let arAggregate = []
            arAggregate.push({
                $match: {
                    dislike: fields.dislike
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
                    from: 'user',
                    localField: 'whom_id',
                    foreignField: '_id',
                    as: '_whom_id',
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
                    from: fields.module,
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

            //if (fields.dislike) arAggregate[0].$match.dislike = fields.dislike

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
                $match: {
                    dislike: fields.dislike
                }
            })

            if (fields.from_id) arAggregate[0].$match.from_id = fields.from_id
            if (fields.to_user_id) arAggregate[0].$match.to_user_id = fields.to_user_id
            if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id
            if (fields.whom_id) arAggregate[0].$match.whom_id = fields.whom_id

            //if (fields.dislike) arAggregate[0].$match.dislike = fields.dislike

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

async function count ({from_id, to_user_id, to_group_id, collectionName, dislike}) {
    let mongoClient = Store.GetMongoClient()
    let collection = mongoClient.collection(`like_${collectionName}`)

    if (from_id) {
        let countLike = await collection.count({from_id: from_id, dislike: false})
        let countDisLike = await collection.count({from_id: from_id, dislike: true})
        let fields = {}
        fields[`count.like_${collectionName}_out`] = Number(countLike)
        fields[`count.dislike_${collectionName}_out`] = Number(countDisLike)
        await CUser.Edit(from_id, fields)
    }
    if (to_user_id) {
        let countLike = await collection.count({to_user_id: to_user_id, dislike: false})
        let countDisLike = await collection.count({to_user_id: to_user_id, dislike: true})
        let fields = {}
        fields[`count.like_${collectionName}_in`] = Number(countLike)
        fields[`count.dislike_${collectionName}_in`] = Number(countDisLike)
        await CUser.Edit(to_user_id, fields)
    }
    if (to_group_id) {
        let countLike = await collection.count({to_group_id: to_group_id, dislike: false})
        let countDisLike = await collection.count({to_group_id: to_group_id, dislike: true})
        let fields = {}
        fields[`count.like_${collectionName}_in`] = Number(countLike)
        fields[`count.dislike_${collectionName}_in`] = Number(countDisLike)
        await CGroup.Edit(to_group_id, fields)

        countLike = await collection.count({ $or: [ {to_user_id: to_user_id},  {to_user_id: null, whom_id: to_user_id}], dislike: false})
        countDisLike = await collection.count({ $or: [ {to_user_id: to_user_id},  {to_user_id: null, whom_id: to_user_id}], dislike: true})
        fields = {}
        fields[`count.like_${collectionName}_in`] = Number(countLike)
        fields[`count.dislike_${collectionName}_in`] = Number(countDisLike)
        await CUser.Edit(to_user_id, fields)
    }
}
