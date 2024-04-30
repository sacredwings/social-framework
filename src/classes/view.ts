// @ts-nocheck
import { DB } from "./db"
import { Store } from "../store"


export class CView {

    //новый комментарий
    static async Add ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collectionView = mongoClient.collection(`view_${fields.module}`)
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
                object_id: fields.object_id,
                from_id: fields.from_id,
                module: fields.module
            }
            let rsView = await this.GetByUser(arFields)
            if (rsView) return rsView

            //ДОБАВЛЯЕМ
            arFields = {
                object_id: fields.object_id,
                from_id: fields.from_id,
                to_user_id: object.to_user_id, //для посчета количества \ кто выложил
                to_group_id: object.to_group_id, //для посчета количества \ куда выложено
                whom_id: object.from_id,
                create_date: date,
            }
            await collectionView.insertOne(arFields)

            //ОБНОВЛЕНИЕ СЧЕТЧИКОВ

            arFields = {
                object_id: fields.object_id,
            }
            //количество просмотров
            let viewCount = await CView.Count ( arFields )

            //обновляем поля в объекте
            await collectionObject.updateOne({_id: fields.object_id}, {$set: {count_view: viewCount+1}})

            return true
        } catch (err) {
            console.log(err)
            throw ({code: 2001000, msg: 'CView Add'})
        }
    }

    static async Count ( {module, ...fields} ) {
        try {
            const mongoClient = Store.GetMongoClient()
            let arFields = {
                object_id: fields.object_id,
            }
            if (fields.to_user_id) arFields.to_user_id = new DB().ObjectID(fields.to_user_id)
            if (fields.to_group_id) arFields.to_group_id = new DB().ObjectID(fields.to_group_id)
            if (fields.from_id) arFields.from_id = new DB().ObjectID(fields.from_id)

            let collection = mongoClient.collection(`view_${fields.module}`)

            let result = await collection.count(arFields)
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 4003000, msg: 'CView Count'})
        }
    }

    static async GetByUser ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = mongoClient.collection(`view_${fields.module}`)
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


}
