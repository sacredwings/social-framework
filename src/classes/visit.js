import { DB } from "./db";

export class CVisit {

    static async Add ({from_id, to_id, minutes=60}) {
        try {
            from_id = new DB().ObjectID(from_id)
            to_id = new DB().ObjectID(to_id)
            let collection = DB.Client.collection('visit')

            //есть ли уже визит
            let arFields = {
                from_id: from_id,
                to_id: to_id,
                minutes: minutes
            }
            let selectVisit = await this.GetByUser(arFields)

            //выходим / уже есть визит в течении этого времени
            if (selectVisit) return false

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
            throw ({code: 4001000, msg: 'CVisit Add'})
        }
    }

    static async GetByUser ({from_id, to_id, minutes=60}) {
        try {
            from_id = new DB().ObjectID(from_id)
            to_id = new DB().ObjectID(to_id)
            let collection = DB.Client.collection('visit')

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
            throw ({code: 4001000, msg: 'CVisit GetByUser'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {
            let collection = DB.Client.collection('visit')
            fields.user_id = new DB().ObjectID(fields.user_id)

            let arAggregate = [{
                $match: {
                    to_id: fields.user_id,
                }
            },{
                $lookup: {
                    from: 'user',
                    localField: 'from_id',
                    foreignField: '_id',
                    as: '_from_id',
                    pipeline: [{
                        $lookup: {
                            from: 'file',
                            localField: 'photo',
                            foreignField: '_id',
                            as: '_photo'
                        }
                    },{
                        $unwind: {
                            path: '$_photo',
                            preserveNullAndEmptyArrays: true
                        }
                    }]
                },
            },{
                $unwind: {
                    path: '$_from_id',
                    preserveNullAndEmptyArrays: true
                }
            },{
                $sort: {
                    _id: -1
                }
            }]
            let result = await collection.aggregate(arAggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray();
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 6003000, msg: 'CVisit Get'})
        }
    }

    //количество
    static async GetCount ( fields ) {
        try {
            let collection = DB.Client.collection('visit')
            fields.user_id = new DB().ObjectID(fields.user_id)

            let Aggregate = [
                {
                    $match: {
                        to_id: fields.user_id,
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
            throw ({code: 6004000, msg: 'CVisit GetCount'})
        }
    }
}