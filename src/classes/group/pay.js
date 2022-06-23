import { DB } from "../db"

export class CGroupPay {

    static async GetUserList (fields) {
        try {
            if (fields.q)
                fields.q = fields.q.replace(/ +/g, ' ').trim()

            fields.group_id = new DB().ObjectID(fields.group_id)
            let collection = DB.Client.collection('user')
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
                        from: 'file',
                        localField: 'photo',
                        foreignField: '_id',
                        as: '_photo'
                    },
            })
            aggregate.push({ $unwind:
                    {
                        path: '$_photo',
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
            if (fields.q)
                fields.q = fields.q.replace(/ +/g, ' ').trim()

            fields.group_id = new DB().ObjectID(fields.group_id)
            let collection = DB.Client.collection('user')
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
}