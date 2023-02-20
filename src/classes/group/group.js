import { DB } from "../db"
import { Store } from "../../store"

export class CGroup {

    //добавить новую группу
    static async Add ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.create_id = new DB().ObjectID(fields.create_id)
            fields.forum = false
            fields.create_date = new Date()

            let collection = mongoClient.collection('group')

            let result = await collection.insertOne(fields)
            return fields
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CGroup Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            const mongoClient = Store.GetMongoClient()
            ids = new DB().arObjectID(ids)

            let collection = mongoClient.collection('group')
            //let result = await collection.find({_id: { $in: ids}}).toArray()
            let aggregate = [
                { $match:
                        {
                            _id: {$in: ids}
                        }
                },{ $lookup:
                        {
                            from: 'user',
                            localField: 'create_id',
                            foreignField: '_id',
                            as: '_create_id',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'photo',
                                            foreignField: '_id',
                                            as: '_photo'
                                        }
                                },{
                                    $unwind:
                                        {
                                            path: '$_photo',
                                            preserveNullAndEmptyArrays: true
                                        }
                                }
                            ]

                        },

                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'photo',
                            foreignField: '_id',
                            as: '_photo',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
                                        }
                                },{
                                    $unwind:
                                        {
                                            path: '$_file_id',
                                            preserveNullAndEmptyArrays: true
                                        }
                                }
                            ]
                        },
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'photo_big',
                            foreignField: '_id',
                            as: '_photo_big',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
                                        }
                                },{
                                    $unwind:
                                        {
                                            path: '$_file_id',
                                            preserveNullAndEmptyArrays: true
                                        }
                                }
                            ]
                        },
                },
                {
                    $unwind:
                        {
                            path: '$_create_id',
                            preserveNullAndEmptyArrays: true
                        }
                },
                {
                    $unwind:
                        {
                            path: '$_photo',
                            preserveNullAndEmptyArrays: true
                        }
                },
                {
                    $unwind:
                        {
                            path: '$_photo_big',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]
            let result = await collection.aggregate(aggregate).toArray()

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 4002000, msg: 'CGroup GetById'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.user_id = new DB().ObjectID(fields.user_id)

            let collection = mongoClient.collection('group');

            let arAggregate = []
            arAggregate.push({
                $match:
                    {}
            })
            arAggregate.push(
                { $lookup:
                        {
                            from: 'file',
                            localField: 'photo',
                            foreignField: '_id',
                            as: '_photo',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
                                        }
                                },
                                {
                                    $unwind:
                                        {
                                            path: '$_file_id',
                                            preserveNullAndEmptyArrays: true
                                        }
                                }
                            ]
                        },
                })
            arAggregate.push(
                { $lookup:
                        {
                            from: 'file',
                            localField: 'photo_big',
                            foreignField: '_id',
                            as: '_photo_big',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
                                        }
                                },
                                {
                                    $unwind:
                                        {
                                            path: '$_file_id',
                                            preserveNullAndEmptyArrays: true
                                        }
                                }
                            ]
                        },
                })
            arAggregate.push(
                {
                    $unwind:
                        {
                            path: '$_photo',
                            preserveNullAndEmptyArrays: true
                        }
                })
            arAggregate.push(
                {
                    $unwind:
                        {
                            path: '$_photo_big',
                            preserveNullAndEmptyArrays: true
                        }
                })

            if (fields.user_id)
                arAggregate[0].$match.create_id = fields.user_id

            if (fields.q) {
                arAggregate[0].$match.$text = {}
                arAggregate[0].$match.$text.$search = fields.q
            }

            //return arAggregate
            //let result = await collection.find({_id: { $in: ids}}).toArray()
            let result = await collection.aggregate(arAggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray();

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 4003000, msg: 'CGroup Get'})
        }
    }

    //количество
    static async GetCount ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.user_id = new DB().ObjectID(fields.user_id)
            let collection = mongoClient.collection('group');

            let arFields = {}
            if (fields.user_id)
                arFields.create_id = fields.user_id
            if (fields.q) {
                arFields.$text = {}
                arFields.$text.$search = fields.q
            }


            return await collection.count(arFields)

            /*
            let arAggregate = []

            if (fields.user_id || fields.q)
                arAggregate.push({ $match: {}})

            if (fields.user_id)
                arAggregate[0].$match.create_id = fields.user_id
            if (fields.q) {
                arAggregate[0].$match.$text = {}
                arAggregate[0].$match.$text.$search = fields.q
            }

            arAggregate.push({
                $count: 'count'
            })*/

            /*
            let result = await collection.aggregate(arAggregate).toArray();
            if (!result.length) return 0
            return result[0].count*/

        } catch (err) {
            console.log(err)
            throw ({code: 4004000, msg: 'CGroup GetCount'})
        }
    }

    static async Count ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('group');

            let result = await collection.count()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CGroup Count'})
        }
    }
/*
    //пользователи
    static async GetUsers ( items ) {
        try {
            //нет массива для обработки
            if ((!items) || (!items.length))
                return []


            let arUsersId = items.map((item, i) => {
                return item.create_id
            })

            //удаление одинаковых id из массива
            arUsersId = Array.from(new Set(arUsersId))

            let collection = DB.Client.collection('user');
            let result = await collection.aggregate([
                { $match:
                        {
                            _id: {$in: arUsersId}
                        }
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'photo',
                            foreignField: '_id',
                            as: '_photo',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
                                        }
                                },
                                {
                                    $unwind:
                                        {
                                            path: '$_file_id',
                                            preserveNullAndEmptyArrays: true
                                        }
                                }
                            ]
                        },
                },
                {
                    $unwind:
                        {
                            path: '$_photo',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]).toArray();

            /*
            let sql = `SELECT id,login,first_name,create_date,birthday,photo FROM ${DB.Init.TablePrefix}user WHERE id in (${arUsersId})`
            let users = await DB.Init.Query(sql)

            users = await Promise.all(users.map(async (user, i)=>{
                if (user.photo) {
                    user.photo = await CFile.GetById([user.photo]);
                    user.photo = user.photo[0]
                }
                return user
            }))

            return result

        } catch (err) {
            console.log(err)
            throw ({code: 4005000, msg: 'CGroup GetUsers'})
        }
    }
*/
    static async Update ( id, fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            id = new DB().ObjectID(id)

            let collection = mongoClient.collection('group');
            let result = collection.updateOne({_id: id}, {$set: fields}, {upsert: true})
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 4006000, msg: 'CGroup Update'})
        }
    }

    //удаление группы
    static async Delete ( id ) {
        try {
            const mongoClient = Store.GetMongoClient()
            id = new DB().ObjectID(id)

            let collection = mongoClient.collection('group');
            let result = collection.updateOne({_id: id}, {$set: {delete: true}}, {upsert: true})
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 4007000, msg: 'CGroup Delete'})
        }
    }

    //Права доступа / сначало созданеля, после права
    static async StatusAccess ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            //параметров нет, доступа
            if ((!fields.user_id) || (!fields.group_id)) return false
            //группы нет, проверять нечего
            if (!fields.group_id) return true

            fields.user_id = new DB().ObjectID(fields.user_id)
            fields.group_id = new DB().ObjectID(fields.group_id)

            let collection = mongoClient.collection('group');
            let arFields = {
                _id: fields.group_id,
                create_id: fields.user_id,
            }

            let result = await collection.findOne(arFields)
            if (result) return true

            return false

        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CGroup Access'})
        }
    }
/*
    static async GetByField ( items, fieldName ) {
        try {
            //нет массива для обработки
            if ((!items) || (!items.length))
                return []

            let arGroupId = []

            items.forEach((item, i) => {
                if (item[fieldName] < 0)
                    arGroupId.push(-item[fieldName])
            })

            if (!arGroupId.length) return []

            //удаление одинаковых id из массива
            arGroupId = Array.from(new Set(arGroupId))

            let sql = `SELECT id,title FROM ${DB.Init.TablePrefix}group WHERE id in (${arGroupId})`
            let users = await DB.Init.Query(sql)

            users = await Promise.all(users.map(async (user, i)=>{
                if (user.photo) {
                    user.photo = await CFile.GetById([user.photo]);
                    user.photo = user.photo[0]
                }
                return user
            }))

            return users

        } catch (err) {
            console.log(err)
            throw ({code: 6005000, msg: 'CGroup GetByField'})
        }
    }*/
}

function Day(day, startDate=new Date()) {
    let date = new Date(startDate); // Now
    date.setDate(date.getDate() + day); // Set now + 30 days as the new date

    return date
}