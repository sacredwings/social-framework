import { DB } from "./db";

export class CAdmin {

    //Индексация базы
    static async DdIndex() {
        try {
            let collection = DB.Client.collection('user');
            let indexUser = await collection.createIndex({
                "first_name":"text",
                "last_name":"text",
                "second_name":"text",
            })
            console.log(indexUser)

            collection = DB.Client.collection('video');
            indexUser = await collection.createIndex({
                "title":"text",
                "text":"text",
            })
            console.log(indexUser)

            collection = DB.Client.collection('article');
            indexUser = await collection.createIndex({
                "title":"text",
                "text":"text",
            })
            console.log(indexUser)

            collection = DB.Client.collection('topic');
            indexUser = await collection.createIndex({
                "post":"text",
            })
            console.log(indexUser)

            collection = DB.Client.collection('album_video_link');
            indexUser = await collection.createIndex( { album_id: 1, object_id: 1 }, { unique: true } )
            console.log(indexUser)

            collection = DB.Client.collection('album_article_link');
            indexUser = await collection.createIndex( { album_id: 1, object_id: 1 }, { unique: true } )
            console.log(indexUser)

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CAdmin DdIndex'})
        }
    }
}