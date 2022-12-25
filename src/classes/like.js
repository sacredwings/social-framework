import { DB } from "./db";

export class CLike {

    //новый комментарий
    static async Add ( fields ) {
        try {
            let collection = DB.Client.collection(`like_${fields.module}`)

            let dislike = null //лайк
            if (fields.dislike)
                dislike = true //дизлайк

            //обработка полей
            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.from_id = new DB().ObjectID(fields.from_id)
            let date = new Date()

            //установленно мной
            let arFields = {
                module: fields.module,
                object_id: fields.object_id,
                from_id: fields.from_id,
            }
            let rsLike = await this.GetByUser(arFields)

            if (!rsLike) {
                //записи нет /создаем
                arFields = {
                    object_id: fields.object_id,
                    from_id: fields.from_id,
                    dislike: dislike,
                    create_date: date,
                }
                await collection.insertOne(arFields)

                //СЧЕТЧИКИ
                arFields = {
                    module: fields.module,
                    object_id: fields.object_id,
                }
                let LikeCount = await this.Count ( arFields )
                arFields.dislike = true
                let DisLikeCount = await this.Count ( arFields )

                console.log(LikeCount)
                console.log(DisLikeCount)

                //выбираем коллекцию с объектом
                collection = DB.Client.collection(fields.module)
                //обновляем поля в объекте
                await collection.updateOne({_id: fields.object_id}, {$set: {dislike: DisLikeCount, like: LikeCount}})

                return true
            }

            collection = DB.Client.collection(`like_${fields.module}`)

            //есть запись
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

            //СЧЕТЧИКИ
            arFields = {
                module: fields.module,
                object_id: fields.object_id,
            }
            let LikeCount = await this.Count ( arFields )
            arFields.dislike = true
            let DisLikeCount = await this.Count ( arFields )

            //выбираем коллекцию с объектом
            collection = DB.Client.collection(fields.module)
            //обновляем поля в объекте
            await collection.updateOne({_id: fields.object_id}, {$set: {dislike: DisLikeCount, like: LikeCount}})

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

            let collection = DB.Client.collection(`like_${fields.module}`)
            let arFields = {
                object_id: fields.object_id,
                dislike: dislike,
            }

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