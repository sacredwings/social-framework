import { DB } from "./db"
import { Store } from "../store"


export class CCustom {
    static async GetById ( {module, ids} ) {
        try {
            const mongoClient = Store.GetMongoClient()
            ids = new DB().arObjectID(ids)

            let collection = mongoClient.collection(module);
            //let result = await collection.find({_id: { $in: ids}}).toArray()
            let result = await collection.aggregate([
                { $match:
                        {
                            _id: {$in: ids}
                        }
                }
            ]).toArray()

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CCustom GetById'})
        }
    }
}