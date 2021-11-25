import {DB} from "./db";

export default class {

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
        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CAdmin DdIndex'})
        }
    }
}