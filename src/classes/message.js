import { DB } from "./db";
import { CFile } from "./file";

export class CMessage {

    //добавить новое видео
    static async Add( fields ) {
        try {
            //обработка полей
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.to_id = new DB().ObjectID(fields.to_id)
            fields.file_ids = new DB().arObjectID(fields.file_ids)
            fields.date = new Date()

            //сначало само сообщение
            let collection = DB.Client.collection('message')
            let arFieldsMessage = {
                from_id: fields.from_id,
                to_id: fields.to_id,
                message: fields.message,
                type: 'P',
                file_ids: fields.file_ids,
                read: null,
                delete_from: null,
                delete_to: null,
                create_date: fields.date,
                change_date: fields.date
            }
            await collection.insertOne(arFieldsMessage)

            //чат
            collection = DB.Client.collection('chat')

            //поиск чата с этим пользователем
            let arFields = {
                user_ids:
                    {
                        $in:
                            [
                                fields.from_id,
                                fields.to_id
                            ]
                    }
            }
            let rsSearch = await collection.findOne(arFields)

            //чат существует / обновляем сообщение и дату
            if (rsSearch) {
                let arQuery = {
                    _id: rsSearch._id
                }
                let arFields = {
                    message_id: arFieldsMessage._id,
                    change_date: fields.date
                }
                let result = collection.updateOne(arQuery, {$set: arFields})
                return arFieldsMessage
            }

            //чат нужно создать
            arFields = {
                user_ids: [
                    fields.from_id,
                    fields.to_id
                ],
                message_id: arFieldsMessage._id, //id последнего сообщения
                create_date: fields.date,
                change_date: fields.date
            }
            await collection.insertOne(arFields)

            //последнее сообщение
            return arFieldsMessage

        } catch (err) {
            console.log(err)
            throw ({err: 5001000, msg: 'CMessage Add'})
        }
    }

    static async GetChat ( fields ) {
        try {
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = DB.Client.collection('chat')

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
                                        from: 'file',
                                        localField: 'photo',
                                        foreignField: '_id',
                                        as: '_photo'
                                    }
                            },
                            {
                                $unwind:
                                    {
                                        path: '$_photo',
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
            throw ({err: 5003000, msg: 'CMessage Get'})
        }
    }

    static async GetChatCount ( fields ) {
        try {
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = DB.Client.collection('chat')

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
            throw ({err: 5003000, msg: 'CMessage Count'})
        }
    }

    static async GetByUser ( fields ) {
        try {
            fields.to_id = new DB().ObjectID(fields.to_id)
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = DB.Client.collection('message')

            let Aggregate = [
                {
                    $match: {
                        $or: [{
                            to_id: fields.to_id,
                            from_id: fields.from_id,
                            delete_from: null
                        },{
                            to_id: fields.from_id,
                            from_id: fields.to_id,
                            delete_to: null
                        }],
                    }
                },{
                    $lookup: {
                        from: 'user',
                        localField: 'to_id',
                        foreignField: '_id',
                        as: '_to_id',
                        pipeline: [
                            { $lookup:
                                    {
                                        from: 'file',
                                        localField: 'photo',
                                        foreignField: '_id',
                                        as: '_photo'
                                    }
                            },
                            {
                                $unwind:
                                    {
                                        path: '$_photo',
                                        preserveNullAndEmptyArrays: true
                                    }
                            }
                        ]
                    },
                },{
                    $lookup: {
                        from: 'user',
                        localField: 'from_id',
                        foreignField: '_id',
                        as: '_from_id',
                        pipeline: [
                            { $lookup:
                                    {
                                        from: 'file',
                                        localField: 'photo',
                                        foreignField: '_id',
                                        as: '_photo'
                                    }
                            },
                            {
                                $unwind:
                                    {
                                        path: '$_photo',
                                        preserveNullAndEmptyArrays: true
                                    }
                            }
                        ]
                    },
                },{ $lookup:
                        {
                            from: 'file',
                            localField: 'file_ids',
                            foreignField: '_id',
                            as: '_file_ids',
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
                },{
                    $unwind: {
                        path: '$_from_id',
                        preserveNullAndEmptyArrays: true
                    }
                },{
                    $unwind: {
                        path: '$_to_id',
                        preserveNullAndEmptyArrays: true
                    }
                },{
                    $sort: {
                        _id: -1
                    }
                }
            ]

            let result = await collection.aggregate(Aggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 5003000, msg: 'CMessage GetChatUser'})
        }
    }

    static async GetByUserCount ( fields ) {
        try {
            fields.to_id = new DB().ObjectID(fields.to_id)
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = DB.Client.collection('message')

            let Aggregate = [
                {
                    $match: {
                        $or: [{
                            to_id: fields.to_id,
                            from_id: fields.from_id,
                            delete_from: null
                        },{
                            to_id: fields.from_id,
                            from_id: fields.to_id,
                            delete_to: null
                        }],
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
            throw ({err: 5003000, msg: 'CMessage GetChatUser'})
        }
    }

    static async CountNoRead ( fields ) {
        try {
            fields.user_id = new DB().ObjectID(fields.user_id)

            let collection = DB.Client.collection('message')

            let Aggregate = [
                {
                    $match: {
                        to_id: fields.user_id,
                        read: null
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
            throw ({err: 5003000, msg: 'CMessage CountNoRead'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = new DB().arObjectID(ids)

            let collection = DB.Client.collection('message')

            let Aggregate = [
                {
                    $match: {
                        _id: {$in: ids}
                    }
                },{
                    $lookup: {
                        from: 'user',
                        localField: 'to_id',
                        foreignField: '_id',
                        as: '_to_id',
                        pipeline: [
                            { $lookup:
                                    {
                                        from: 'file',
                                        localField: 'photo',
                                        foreignField: '_id',
                                        as: '_photo'
                                    }
                            },
                            {
                                $unwind:
                                    {
                                        path: '$_photo',
                                        preserveNullAndEmptyArrays: true
                                    }
                            }
                        ]
                    },
                },{
                    $lookup: {
                        from: 'user',
                        localField: 'from_id',
                        foreignField: '_id',
                        as: '_from_id',
                        pipeline: [
                            { $lookup:
                                    {
                                        from: 'file',
                                        localField: 'photo',
                                        foreignField: '_id',
                                        as: '_photo'
                                    }
                            },
                            {
                                $unwind:
                                    {
                                        path: '$_photo',
                                        preserveNullAndEmptyArrays: true
                                    }
                            }
                        ]
                    },
                },{
                    $unwind: {
                        path: '$_from_id',
                        preserveNullAndEmptyArrays: true
                    }
                },{
                    $unwind: {
                        path: '$_to_id',
                        preserveNullAndEmptyArrays: true
                    }
                },{
                    $sort: {
                        _id: -1
                    }
                }
            ]

            let result = await collection.aggregate(Aggregate).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 6002000, msg: 'CMessage GetById'})
        }
    }

    static async Delete ( id, myUserId ) {
        try {
            id = new DB().ObjectID(id)

            let arResult = await this.GetById([id])
            if (!arResult.length)
                return false

            arResult = arResult[0]

            let collection = DB.Client.collection('message')

            let arQuery = {
                _id: id
            }
            let arFields = {}

            if (arResult.from_id.toString() === myUserId.toString())
                arFields.delete_from = true
            else
                arFields.delete_to = true

            let result = collection.updateOne(arQuery, {$set: arFields})

            return result
        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CMessage Delete'})
        }
    }

    //прочитать все сообщения с пользователем
    static async ReadAll( fields ) {
        try {
            fields.to_id = new DB().ObjectID(fields.to_id)
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = DB.Client.collection('message')

            let arQuery = {
                to_id: fields.from_id,
                from_id: fields.to_id
            }
            /*
            let arQuery = {
                to_id: fields.to_id,
                from_id: fields.from_id
            }*/
            let arFields = {
                read: true
            }

            let result = collection.update(arQuery, {$set: arFields})
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 5004000, msg: 'CMessage MarkAsReadAll'})
        }
    }

    static async Edit(id, fields) {
        try {
            id = new DB().ObjectID(id)

            let collection = DB.Client.collection('message');
            let arFields = {
                _id: id
            }

            let result = collection.updateOne(arFields, {$set: fields})

            return result
        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CMessage Edit'})
        }
    }
    /*
    //прочитать выбранные сообщения
    static async MarkAsRead( fields ) {
        try {
            let sql = `UPDATE ${DB.Init.TablePrefix}message SET read = true WHERE (from_id=${fields.from_id} OR to_id=${fields.from_id}) AND id in (${fields.ids})`
            let result = await DB.Init.Query(sql)

        } catch (err) {
            console.log(err)
            throw ({err: 5005000, msg: 'CMessage Add'})
        }
    }

    //удалить все сообщения с пользователем
    static async DeleteAll( fields ) {
        try {
            let sql = `UPDATE ${DB.Init.TablePrefix}message SET delete_from = true WHERE (from_id=${fields.from_id} AND to_id=${fields.to_id}) OR (to_id=${fields.from_id} AND from_id=${fields.to_id})`
            let result = await DB.Init.Query(sql)

        } catch (err) {
            console.log(err)
            throw ({err: 5005000, msg: 'CMessage DeleteAll'})
        }
    }
*/
    /*
    //удалить выбранные сообщения
    static async Delete( fields ) {
        try {
            fields.ids = fields.ids.join(',');
            let sql = `UPDATE ${DB.Init.TablePrefix}message SET delete_from = true WHERE (from_id=${fields.from_id} OR to_id=${fields.from_id}) AND id in (${fields.ids})`
            let result = await DB.Init.Query(sql)

        } catch (err) {
            console.log(err)
            throw ({err: 5005000, msg: 'CMessage Add'})
        }
    }*/
}