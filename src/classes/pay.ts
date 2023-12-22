import { DB } from "./db"
import { Store } from "../store"
import { CGroup } from "./group"

export class CPay {
/*
    static async GetUserList (fields) {
        try {
            const mongoClient = Store.GetMongoClient()
            if (fields.q)
                fields.q = fields.q.replace(/ +/g, ' ').trim()

            fields.group_id = new DB().ObjectID(fields.group_id)
            let collection = mongoClient.collection('user')
            let date = new Date()

            let aggregate = []

            if (fields.q)
                aggregate.push({
                    $match:
                        {
                            $text: {
                                $search: `\"${fields.q}\"`
                            }
                        }
                })

            aggregate.push({
                $lookup:
                    {
                        from: 'pay_group',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: '_pay'
                    },
            })
            aggregate.push({
                $lookup:
                    {
                        from: 'file_image',
                        localField: 'photo_id',
                        foreignField: '_id',
                        as: '_photo_id'
                    },
            })
            aggregate.push({ $unwind:
                    {
                        path: '$_photo_id',
                        preserveNullAndEmptyArrays: true
                    }
            })
            aggregate.push({ $match: {'_pay.date_pay': { $gte: date }} })

            let result = await collection.aggregate(aggregate).toArray()
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CGroupPay GetUserList'})
        }
    }
    static async GetUserListCount (fields) {
        try {
            const mongoClient = Store.GetMongoClient()
            if (fields.q)
                fields.q = fields.q.replace(/ +/g, ' ').trim()

            fields.group_id = new DB().ObjectID(fields.group_id)
            let collection = mongoClient.collection('user')
            let date = new Date()

            let aggregate = []

            if (fields.q)
                aggregate.push({
                    $match:
                        {
                            $text: {
                                $search: `\"${fields.q}\"`
                            }
                        }
                })
            aggregate.push({
                $lookup:
                    {
                        from: 'pay_group',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: '_pay'
                    },
            })
            aggregate.push({ $match: {'_pay.date_pay': { $gte: date }} })

            aggregate.push({
                $count: 'count'
            })

            let result = await collection.aggregate(aggregate).toArray()
            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CGroupPay GetUserList'})
        }
    }
*/
    //ТРАНЗАКЦИИ ПЛАТЕЖНОЙ СИСТЕМЫ YANDEX
    //добавить новую группу
    static async TransactionAdd ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.user_id = new DB().ObjectID(fields.user_id)
            fields.group_id = new DB().ObjectID(fields.group_id)

            let arFields = {
                user_id: fields.user_id,
                group_id: fields.group_id,
                pay_id: fields.pay_id,
                status: fields.status,
                price: fields.price,
                url: fields.url,
                date_create: new Date()
            }

            let collection = mongoClient.collection('pay_transaction_group');

            let result = await collection.insertOne(arFields)
            return fields
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CPay TransactionAdd'})
        }
    }

    //добавить новую группу
    static async TransactionGet ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('pay_transaction_group');

            let result = await collection.findOne(fields)
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CPay TransactionGet'})
        }
    }
    static async TransactionUpdate ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('pay_transaction_group');

            let result = collection.updateOne({pay_id: fields.pay_id}, {$set: {status: fields.status}}, {upsert: true})
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CPay TransactionAdd'})
        }
    }

    //ОПЛАТА ГРУППЫ ПОЛЬЗОВАТЕЛЕМ
    //добавить новую группу
    static async Add ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.user_id = new DB().ObjectID(fields.user_id)
            fields.group_id = new DB().ObjectID(fields.group_id)
            fields.transaction_id = new DB().ObjectID(fields.transaction_id)

            let collection = mongoClient.collection('pay_group');

            let arFields = {
                user_id: fields.user_id,
                group_id: fields.group_id
            }
            let getResult = await this.Get (arFields)

            arFields.actual = true
            let getResultActual = await this.Get (arFields)

            //сколько дней оплаты
            let dateDay = new Date()
            let newDateDay = Day(fields.day)

            let arSearch = {
                user_id: fields.user_id,
                group_id: fields.group_id
            }

            //еще действует оплата
            if (getResultActual) {
                arFields = {
                    date_pay: Day(fields.day, getResultActual.date_pay),
                    transaction_id: fields.transaction_id,
                    price: fields.price,
                    change_date: new Date()
                    //date_create: new Date()
                }
                let result = collection.updateOne(arSearch, {$set: arFields}, {upsert: true})

                return true
            }

            //оплата устарела
            if (getResult) {
                arFields = {
                    date_pay: Day(fields.day, dateDay),
                    transaction_id: fields.transaction_id,
                    price: fields.price,
                    change_date: new Date()
                }
                let result = collection.updateOne(arSearch, {$set: arFields}, {upsert: true})

                return true
            }

            //новая оплата
            arFields = {
                date_pay: newDateDay,
                transaction_id: fields.transaction_id,
                price: fields.price,
                change_date: new Date(),
                date_create: new Date()
            }
            let result = collection.updateOne(arSearch, {$set: arFields}, {upsert: true})
            return true
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CPay Add'})
        }
    }

    //добавить новую группу
    static async Get ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.user_id = new DB().ObjectID(fields.user_id)
            fields.group_id = new DB().ObjectID(fields.group_id)

            let collection = mongoClient.collection('pay_group');
            let arFields = {
                user_id: fields.user_id,
                group_id: fields.group_id,
            }

            let result = await collection.findOne(arFields)
            if (!result)
                return false

            if (!fields.actual)
                return result

            if ((fields.actual) && (result.date_pay < new Date()))
                return false

            return result

        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CPay Get'})
        }
    }

    //СТАТУС ГРУППЫ
    //добавить новую группу
    static async Status ( fields ) {
        try {
            fields.user_id = new DB().ObjectID(fields.user_id)
            fields.group_id = new DB().ObjectID(fields.group_id)

            let group = await CGroup.GetById ( [fields.group_id] );
            if (group.length)
                group = group[0]

            if (!group) return {
                status: false
            }

            //группа бесплатная
            if (!group.price) return {
                status: true
            }

            //группа платная, а пользователя нет
            if (!fields.user_id) return {
                status: false
            }

            //получаем запись об оплате
            let result = await this.Get(fields)

            //платы нет
            if (!result) return {
                status: false
            }

            //оплата закончилась
            let dateSystem = new Date();
            let datePay = new Date(result.pay_date);
            if (dateSystem > datePay) return ({
                status: false,
                ...result
            })

            return ({
                status: true,
                ...result
            })
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CPay Status'})
        }
    }
}

function Day(day, startDate=new Date()) {
    let date = new Date(startDate); // Now
    date.setDate(date.getDate() + day); // Set now + 30 days as the new date

    return date
}