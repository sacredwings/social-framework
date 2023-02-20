import { DB } from "./db"
import { Store } from "../store"


export class CFriend {

    static async Add ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.to_id = new DB().ObjectID(fields.to_id)
            let collection = mongoClient.collection('friend')

            let arFields = {
                from_id: fields.from_id,
                to_id: fields.to_id
            }
            let selectFriend = await this.GetByUser(arFields)
            //нет, создаем
            if (!selectFriend) {
                //обработка полей
                fields.create_date = new Date()

                arFields = {
                    from_id: fields.from_id,
                    to_id: fields.to_id,
                    viewed: null,
                    allowed: null,
                    create_date: new Date()
                }
                await collection.insertOne(arFields)

                return true
            }

            //заявка входящая
            if (selectFriend.to_id.toString() === fields.from_id.toString()) {
                //просматриваем и принимаем
                let newField = {
                    viewed: true,
                    allowed: true
                }

                await collection.updateOne({_id: selectFriend._id}, {$set: newField})

                return true
            }

            return false
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CFriend Add'})
        }
    }

    static async Delete ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.to_id = new DB().ObjectID(fields.to_id)
            let collection = mongoClient.collection('friend')

            let arFields = {
                from_id: fields.from_id,
                to_id: fields.to_id
            }
            let selectFriend = await this.GetByUser(arFields)

            //нечего удалять
            if (!selectFriend) return false

            //заявка входящая
            if (selectFriend.to_id.toString() === fields.from_id.toString()) {
                //просматриваем и принимаем
                let newField = {
                    viewed: true,
                    allowed: null
                }

                await collection.updateOne({_id: selectFriend._id}, {$set: newField})

                return true
            }

            collection.deleteOne({_id: selectFriend._id})
            return true
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CFriend Delete'})
        }
    }

    static async GetByUser ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.to_id = new DB().ObjectID(fields.to_id)
            let collection = mongoClient.collection('friend')

            let Aggregate = [{
                $match: {
                    $or: [{
                        from_id: fields.from_id,
                        to_id: fields.to_id,
                    },{
                        from_id: fields.to_id,
                        to_id: fields.from_id,
                    }],
                }
            }]

            let result = await collection.aggregate(Aggregate).toArray()
            if (result.length)
                return result[0]

            return false
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CFriend GetByUser'})
        }
    }

    static async StatusByUser ( fields ) {
        try {
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.to_id = new DB().ObjectID(fields.to_id)
            let selectFriend = await this.GetByUser(fields)

            //нет заявки
            if (!selectFriend)
                return 'none'

            //друг
            if (selectFriend.allowed === true)
                return 'friend'

            selectFriend.from_id = selectFriend.from_id.toString()
            selectFriend.to_id = selectFriend.to_id.toString()

            //заявка входящая
            if ((selectFriend.to_id.toString() === fields.from_id.toString()) && (selectFriend.viewed === true))
                return 'viewed'

            //заявка входящая
            if (selectFriend.to_id.toString() === fields.from_id.toString())
                return 'in'

            //заявка исходящая
            if (selectFriend.from_id.toString() === fields.from_id.toString())
                return 'out'

            return false
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CFriend Status'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('friend')
            fields.user_id = new DB().ObjectID(fields.user_id)
            let match = {
                $or: [{
                    from_id: fields.user_id,
                    allowed: true,
                },{
                    to_id: fields.user_id,
                    allowed: true,
                }],
            }
            if (fields.status === 'in')
                match = {
                    to_id: fields.user_id,
                    allowed: null,
                }
            if (fields.status === 'out')
                match = {
                    from_id: fields.user_id,
                    allowed: null,
                }
            if (fields.status === 'not')
                match = {
                    to_id: fields.user_id,
                    allowed: null,
                    viewed: null
                }

            let arAggregate = [{
                $match: match
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
                $lookup: {
                    from: 'user',
                    localField: 'to_id',
                    foreignField: '_id',
                    as: '_to_id',
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
                }
            },{
                $unwind: {
                    path: '$_to_id',
                    preserveNullAndEmptyArrays: true
                }
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
            throw ({code: 6003000, msg: 'CFriend Get'})
        }
    }

    //количество
    static async GetCount ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.user_id = new DB().ObjectID(fields.user_id)

            let collection = mongoClient.collection('friend')
            let match = {
                $or: [{
                    from_id: fields.user_id,
                    allowed: true,
                },{
                    to_id: fields.user_id,
                    allowed: true,
                }],
            }
            if (fields.status === 'in')
                match = {
                    to_id: fields.user_id,
                    allowed: null,
                }
            if (fields.status === 'out')
                match = {
                    from_id: fields.user_id,
                    allowed: null,
                }
            if (fields.status === 'not')
                match = {
                    to_id: fields.user_id,
                    allowed: null,
                    viewed: null
                }

            let Aggregate = [{
                    $match: match
                },{
                    $count: 'count'
                }
            ]

            let result = await collection.aggregate(Aggregate).toArray();
            if (!result.length) return 0
            return result[0].count
        } catch (err) {
            console.log(err)
            throw ({code: 6004000, msg: 'CFriend GetCount'})
        }
    }

    //количество
    static async CountNotViewed ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.user_id = new DB().ObjectID(fields.user_id)

            let collection = mongoClient.collection('friend')

            let Aggregate = [
                {
                    $match: {
                        to_id: fields.user_id,
                        viewed: null,
                    },
                },{
                    $count: 'count'
                }
            ]

            let result = await collection.aggregate(Aggregate).toArray();
            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 6004000, msg: 'CFriend CountNotViewed'})
        }
    }

    /*
    static async Accept ( fields, where ) {
        try {
            //просмотренно
            fields.viewed = true
            fields.allowed = true

            //запись
            let result = await DB.Init.Update(`${DB.Init.TablePrefix}friend`, fields, where,`ID`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CFriend Accept'})
        }
    }*/
}