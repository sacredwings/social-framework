import { DB } from "./db"
import { CVideo } from "./video"
import { CPost } from "./post"
import { CArticle } from "./article"
import { CComment } from "./comment"
import {CNotify} from "./notify";

export class CLike {

    //новый комментарий
    static async Add ( fields ) {
        try {
            let collection = DB.Client.collection(`like_${fields.module}`)

            //ОПРЕДЕЛЕНИЕ ПЕРЕМЕННЫХ

            //обработка полей
            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.from_id = new DB().ObjectID(fields.from_id)
            let date = new Date()

            //узнаем создателя объекта
            let object = null
            if (fields.module === 'video') object = await CVideo.GetById([fields.object_id])
            if (fields.module === 'post') object = await CPost.GetById([fields.object_id])
            if (fields.module === 'article') object = await CArticle.GetById([fields.object_id])
            if (fields.module === 'comment_video') object = await CComment.GetById([fields.object_id], 'video')
            if (fields.module === 'comment_post') object = await CComment.GetById([fields.object_id], 'post')
            if (fields.module === 'comment_article') object = await CComment.GetById([fields.object_id], 'article')
            if (fields.module === 'comment_topic') object = await CComment.GetById([fields.object_id], 'topic')

            if (!object.length) return false
            object = object[0]

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
                to_user_id: object.from_id,
            }
            let LikeCount = await this.Count ( arFields )
            arFields.dislike = true
            let DisLikeCount = await this.Count ( arFields )

            //выбираем коллекцию с объектом
            collection = DB.Client.collection(fields.module)
            //обновляем поля в объекте
            await collection.updateOne({_id: fields.object_id}, {$set: {dislike: DisLikeCount, like: LikeCount}})

            //ПОЛЬЗОВАТЕЛЬ
            let userLikeCount = 0 //при старте
            let userDisLikeCount = 0 //при старте
            let arModules = ['video', 'post', 'article', 'comment_video', 'comment_post', 'comment_article', 'comment_topic']
            for (let item of arModules) {
                arFields = {
                    module: item,
                    to_user_id: object.from_id,
                }

                userLikeCount += await this.Count ( arFields )
                arFields.dislike = true
                userDisLikeCount += await this.Count ( arFields )
            }

            //выбираем коллекцию с объектом
            collection = DB.Client.collection('user')
            //обновляем поля в объекте
            await collection.updateOne({_id: fields.from_id}, {$set: {dislike: userDisLikeCount, like: userLikeCount}})

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
            }

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
            let dislike = null
            if (fields.dislike)
                dislike = true

            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = DB.Client.collection(`like_${fields.module}`)
            let arFields = {
                dislike: dislike,
            }
            if (fields.object_id) arFields.object_id = fields.object_id
            if (fields.to_user_id) arFields.to_user_id = fields.to_user_id
            if (fields.to_group_id) arFields.to_group_id = fields.to_group_id
            if (fields.from_id) arFields.from_id = fields.from_id

            let result = await collection.count(arFields)
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 4003000, msg: 'CLike Count'})
        }
    }

    static async GetByUser ( fields ) {
        try {
            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = DB.Client.collection(`like_${fields.module}`)
            let arFields = {
                from_id: fields.from_id,
                object_id: fields.object_id,
            }
            let result = await collection.findOne(arFields)
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 4003000, msg: 'CLike GetByUser'})
        }
    }

    /*
    static async GetByUserLike ( fields ) {
        try {
            let dislike = null
            if (fields.dislike)
                dislike = true
            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = DB.Client.collection('like')
            let arFields = {
                from_id: fields.from_id,
                object_id: fields.object_id,
                dislike: dislike,
            }
            let result = await collection.findOne(arFields)
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 4003000, msg: 'CLike GetByUserLike'})
        }
    }*/
}