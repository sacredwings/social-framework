import { DB } from "./db";

export class CView {

    //новый комментарий
    static async Add ( fields ) {
        try {
            if (!fields.from_id) return false

            let collection = DB.Client.collection('view')

            //обработка полей
            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.create_date = new Date()

            let arFields = {
                object_id: fields.object_id,
                from_id: fields.from_id,
            }

            let rsView = await this.GetByUser(arFields)
            if (rsView) return false

            //записи нет /создаем
            arFields = {
                object_id: fields.object_id,
                module: fields.module,
                from_id: fields.from_id,

                create_date: fields.create_date,
            }
            await collection.insertOne(arFields)

            //ПРОСМОТРЫ
            arFields = {
                object_id: fields.object_id,
            }
            //количество просмотров
            let viewCount = await CView.Count ( arFields )

            //выбираем коллекцию с объектом
            collection = DB.Client.collection(fields.module)
            //обновляем поля в объекте
            await collection.updateOne({_id: fields.object_id}, {$set: {view: viewCount}})

            return true
        } catch (err) {
            console.log(err)
            throw ({code: 2001000, msg: 'CView Add'})
        }
    }

    static async GetByUser ( fields ) {
        try {
            if (!fields.from_id) return false

            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = DB.Client.collection('view')
            let arFields = {
                from_id: fields.from_id,
                object_id: fields.object_id,
            }
            let result = await collection.findOne(arFields)
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 4003000, msg: 'CView GetByUser'})
        }
    }

    static async Count ( fields ) {
        try {
            fields.object_id = new DB().ObjectID(fields.object_id)

            let collection = DB.Client.collection('view')
            let arFields = {
                object_id: fields.object_id,
            }
            let result = await collection.count(arFields)
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 4003000, msg: 'CView Get'})
        }
    }

}