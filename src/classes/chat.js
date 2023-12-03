import { DB } from "./db"
import { Store } from "../store"

export class CChat {

    static async Get ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = mongoClient.collection('chat')

            let Aggregate = [
                {
                    $match: {
                        user_ids: fields.from_id
                    }
                },{
                    $lookup: {
                        from: 'message',
                        localField: 'message_id',
                        foreignField: '_id',
                        as: '_message_id'
                    },
                },{
                    $lookup: {
                        from: 'user',
                        localField: 'user_ids',
                        foreignField: '_id',
                        as: '_user_ids',
                        pipeline: [
                            { $lookup:
                                    {
                                        from: 'file_image',
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
                    },
                },{
                    $unwind: {
                        path: '$_message_id',
                        preserveNullAndEmptyArrays: true
                    }
                },{
                    $sort: {
                        change_date: -1
                    }
                }
            ]

            let result = await collection.aggregate(Aggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 5003000, msg: 'CMessage Get'})
        }
    }

    static async GetCount ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = mongoClient.collection('chat')

            let Aggregate = [
                {
                    $match: {
                        user_ids: fields.from_id
                    }
                },{
                    $count: 'count'
                }
            ]

            let result = await collection.aggregate(Aggregate).toArray();
            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 5003000, msg: 'CMessage Count'})
        }
    }

}