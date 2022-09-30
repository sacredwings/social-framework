import { DB } from "./db"
import { CUser } from "./user"

export class CAdmin {

    //Индексация базы
    static async DdIndex() {
        try {
            try {
                console.log('user')
                let collection = DB.Client.collection('user')
                let arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                let indexUser = await collection.createIndex({
                    "first_name":"text",
                    "last_name":"text",
                    "second_name":"text",
                })
                console.log(arIndexes)

                console.log('group')
                collection = DB.Client.collection('group')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                    "title":"text",
                    "text":"text",
                })
                console.log(arIndexes)

                console.log('file')
                collection = DB.Client.collection('file')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                        "title":"text",
                        "text":"text",
                    }, {"default_language" : "none"}
                )
                console.log(arIndexes)

                console.log('article')
                collection = DB.Client.collection('article')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                    "title":"text",
                    "json.text":"text",
                })
                console.log(arIndexes)

                console.log('album')
                collection = DB.Client.collection('album')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                    "title":"text",
                    "text":"text",
                })
                console.log(arIndexes)

                console.log('post')
                collection = DB.Client.collection('post')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                    "title":"text",
                    "json.text":"text",
                })
                console.log(arIndexes)

            } catch (e) {
                console.log(e)
            }


        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CAdmin DdIndex'})
        }
    }
}