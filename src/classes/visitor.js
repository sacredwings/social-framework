import { DB } from "./db"
import { Store } from "../store"


export class CVisitor {

    static async Add ({from_id, to_id, minutes=60}) {
        try {
            const mongoClient = Store.GetMongoClient()
            from_id = new DB().ObjectID(from_id)
            to_id = new DB().ObjectID(to_id)
            let collection = mongoClient.collection('visitor')

            //зашел на свою страницу
            if (from_id.toString() === to_id.toString()) return false

            //есть ли уже визит
            let arFields = {
                from_id: from_id,
                to_id: to_id,
                minutes: minutes
            }
            let selectVisitor = await this.GetByUser(arFields)

            //выходим / уже есть визит в течении этого времени
            if (selectVisitor) return false

            arFields = {
                from_id: from_id,
                to_id: to_id,
                viewed: null,
                create_date: new Date()
            }
            await collection.insertOne(arFields)

            return true
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CVisitor Add'})
        }
    }

    static async GetByUser ({from_id, to_id, minutes=60}) {
        try {
            const mongoClient = Store.GetMongoClient()
            from_id = new DB().ObjectID(from_id)
            to_id = new DB().ObjectID(to_id)
            let collection = mongoClient.collection('visitor')

            let date = new Date() - new Date(minutes*60*1000)

            let Aggregate = [{
                $match: {
                    from_id: from_id,
                    to_id: to_id,
                    create_date: {$gt: new Date(date)}
                }
            }]

            let result = await collection.aggregate(Aggregate).toArray()
            if (result.length)
                return result[0]

            return false
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CVisitor GetByUser'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.user_id = new DB().ObjectID(fields.user_id)
            let collection = mongoClient.collection('user')

            let arAggregate = [{
                $lookup: {
                    from: 'visitor',
                    localField: '_id',
                    foreignField: 'from_id',
                    as: '_visitor',
                    pipeline: [{
                        $match: {
                            to_id: fields.user_id
                        }
                    },{
                        $project: {
                            _id: 1,
                            viewed: 1,
                            create_date: 1
                        }
                    },{
                        $limit: 6
                    }]
                }
            },{
                $lookup: {
                    from: 'file',
                    localField: 'photo',
                    foreignField: '_id',
                    as: '_photo'
                }
            },{
                $unwind: '$_visitor'
            },{
                $unwind: {
                    path: '$_photo',
                    preserveNullAndEmptyArrays: true
                }
            },{
                $group: {
                    _id : "$_id",
                    first_name: {
                        $last: "$first_name"
                    },
                    last_name: {
                        $last: "$last_name"
                    },
                    photo: {
                        $last: "$photo"
                    },
                    _photo: {
                        $last: "$_photo"
                    },
                    _visitor: {
                        $addToSet: '$_visitor'
                    }
                }
            },{
                $sort: {
                    "_visitor.create_date": -1
                }
            }]

            let result = await collection.aggregate(arAggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray()

            //делаем прочитаными после загрузки
            collection = mongoClient.collection('visitor')
            collection.update({to_id: fields.user_id}, {$set: {viewed: true}})

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 6003000, msg: 'CVisitor Get'})
        }
    }

    //количество
    static async GetCount ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('visitor')
            fields.user_id = new DB().ObjectID(fields.user_id)

            let arAggregate = [{
                $match: {
                    to_id: fields.user_id
                }
            },{
                $group: {
                    _id : "$from_id",
                }
            },{
                $count: 'count'
            }]

            if (fields.no_viewed) arAggregate[0].$match.viewed = null

            let result = await collection.aggregate(arAggregate).toArray();
            if (!result.length) return 0
            return result[0].count
        } catch (err) {
            console.log(err)
            throw ({code: 6004000, msg: 'CVisitor GetCount'})
        }
    }
}