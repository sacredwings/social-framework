// @ts-nocheck
import { DB } from "./db"
import { CUser } from "./user"
import { Store } from "../store"

export class CAdmin {

    //Индексация базы
    static async DdIndex() {
        try {
            try {
                const mongoClient = Store.GetMongoClient()

                console.log('user')
                let collection = mongoClient.collection('user')
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
                collection = mongoClient.collection('group')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                    "title":"text",
                    //"text":"text",
                })
                console.log(arIndexes)

                console.log('image')
                collection = mongoClient.collection('img')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                        "title":"text",
                        //"text":"text",
                    }, {"default_language" : "russian"}
                )
                console.log(arIndexes)

                console.log('video')
                collection = mongoClient.collection('video')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                        "title":"text",
                        //"text":"text",
                    }, {"default_language" : "russian"}
                )
                console.log(arIndexes)

                console.log('doc')
                collection = mongoClient.collection('doc')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                        "title":"text",
                        //"text":"text",
                    }, {"default_language" : "russian"}
                )
                console.log(arIndexes)

                console.log('article')
                collection = mongoClient.collection('article')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                    "title":"text",
                    //"json.text":"text",
                })
                console.log(arIndexes)

                console.log('topic')
                collection = mongoClient.collection('topic')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                    "title":"text",
                    //"json.text":"text",
                })
                console.log(arIndexes)

                //-----------------------------------------------------------------------
                console.log('album_article')
                collection = mongoClient.collection('album_article')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                    "title":"text",
                    //"text":"text",
                })
                console.log(arIndexes)

                console.log('album_topic')
                collection = mongoClient.collection('album_topic')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                    "title":"text",
                    //"text":"text",
                })
                console.log(arIndexes)

                console.log('album_video')
                collection = mongoClient.collection('album_video')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                    "title":"text",
                    //"text":"text",
                })
                console.log(arIndexes)

                //-----------------------------------------------------------------------
                console.log('post')
                collection = mongoClient.collection('post')
                arIndexes = await collection.indexes()
                arIndexes.forEach((item)=>{
                    if (item.name !== '_id_')
                        collection.dropIndex(item.name)
                })
                indexUser = await collection.createIndex({
                    "text":"text",
                    //"json.text":"text",
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
