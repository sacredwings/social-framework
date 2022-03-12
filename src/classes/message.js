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
                user_ids: [
                    fields.from_id,
                    fields.to_id
                ]
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
            //let count = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}message WHERE from_id=$1 OR to_id=$1 GROUP BY from_id`

            let count = `SELECT COUNT(*)
            FROM sf_message
            WHERE (from_id=$1 OR to_id=$1) AND delete_from IS NOT true
            GROUP BY to_id, from_id`

            count = await DB.Init.Query(count, [fields.from_id])

            return count.length;

            //let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}message WHERE (from_id=$1 AND to_id=$2) OR (from_id=$2 AND to_id=$1)`

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

/*
    let collection = DB.Client.collection('post');
    let arFields = {
        _id: id
    }

    let result = collection.updateOne(arFields, {$set: fields})
    */
    /*
    //загрузка
    static async GetById ( fields ) {
        try {

            let sql = `SELECT *
FROM ${DB.Init.TablePrefix}message
WHERE id=$1 AND (from_id=$2 OR to_id=$2) AND delete_from IS NOT true`

            let result = await DB.Init.Query(sql, [fields.id, fields.from_id])

            let arMessages = [] //массив сообщений уникальных пользователей

            //уникальность массива
            for (let i=0; i < result.length; i++) {

                //добавление новых полей к массиву
                let messages = {}

                //добавление новых полей
                if (Number (result[i].from_id) === fields.from_id) {
                    messages.user_id = Number (result[i].to_id)
                    messages.in = false
                } else {
                    messages.user_id = Number (result[i].from_id)
                    messages.in = true
                }

                messages.from_id = Number(result[i].from_id)
                messages.to_id = Number(result[i].to_id)

                //удаление не актуальных полей
                //delete result[i].id
                //delete result[i].from_id
                //delete result[i].to_id

                arMessages.push({...result[i], ...messages})

            }

            result = await Promise.all(arMessages.map(async (item, i) => {


                if (item.file_ids) {
                    item.file_ids = await CFile.GetById(item.file_ids);

                    if (item.file_ids.file_id)
                        item.file_ids.file_id = await CFile.GetById(item.file_ids.file_id);
                }

                return item;
            }));

            return result
        } catch (err) {
            console.log(err)
            throw ({err: 5002000, msg: 'CMessage GetById'})
        }
    }*/
    //загрузка
    static async GetByUserId ( fields ) {
        try {

            let sql = `SELECT *
FROM ${DB.Init.TablePrefix}message
WHERE ((from_id=$1 AND to_id=$2) OR (from_id=$2 AND to_id=$1)) AND delete_from IS NOT true ORDER BY id DESC`
            sql += ` LIMIT $3 OFFSET $4 `

            let result = await DB.Init.Query(sql, [fields.from_id, fields.to_id, fields.count, fields.offset])

            let arMessages = [] //массив сообщений уникальных пользователей

            //уникальность массива
            for (let i=0; i < result.length; i++) {

                //добавление новых полей к массиву
                let messages = {}

                //добавление новых полей
                if (Number (result[i].from_id) === fields.from_id) {
                    messages.user_id = Number (result[i].to_id)
                    messages.in = false
                } else {
                    messages.user_id = Number (result[i].from_id)
                    messages.in = true
                }

                messages.from_id = Number(result[i].from_id)
                messages.to_id = Number(result[i].to_id)

                //удаление не актуальных полей
                //delete result[i].id
                //delete result[i].from_id
                //delete result[i].to_id

                arMessages.push({...result[i], ...messages})

            }

            result = await Promise.all(arMessages.map(async (item, i) => {

                /* загрузка инфы о файле */
                if (item.file_ids) {
                    item.file_ids = await CFile.GetById(item.file_ids);

                    if (item.file_ids.file_id)
                        item.file_ids.file_id = await CFile.GetById(item.file_ids.file_id);
                }

                return item;
            }));

            return result
        } catch (err) {
            console.log(err)
            throw ({err: 5002000, msg: 'CMessage GetByUserId'})
        }
    }

    static async CountGetByUserId ( fields ) {
        try {
            let count = `SELECT COUNT(*)
FROM ${DB.Init.TablePrefix}message
WHERE (from_id=$1 AND to_id=$2) OR (from_id=$2 AND to_id=$1) AND delete_from IS NOT true`

            count = await DB.Init.Query(count, [fields.from_id, fields.to_id])

            return Number (count[0].count)
        } catch (err) {
            console.log(err)
            throw ({err: 5003000, msg: 'CMessage CountGetByUserId'})
        }
    }



    /*
    //пользователи
    static async GetUsers ( items, all ) {
        try {

            //нет массива для обработки
            if ((!items) || (!items.length))
                return []

            let arUsersIdAll = [];


            let arUsersId = items.map((item, i) => {
                arUsersIdAll.push(item.from_id)
                arUsersIdAll.push(item.to_id)
                return item.user_id
            })

            let arUsers = [];
            //удаление одинаковых id из массива
            if (all) {
                arUsers = Array.from(new Set(arUsersIdAll))
            } else {
                arUsers = Array.from(new Set(arUsersId))
            }


            let sql = `SELECT id,login,first_name,create_date,birthday,photo FROM ${DB.Init.TablePrefix}user WHERE id in (${arUsers})`
            arUsers = await DB.Init.Query(sql)

            arUsers = await Promise.all(arUsers.map(async (user, i)=>{
                if (user.photo) {
                    user.photo = await CFile.GetById([user.photo]);
                    user.photo = user.photo[0]
                }
                return user
            }))

            return arUsers

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CMessage GetUsers'})
        }
    }
*/
    //прочитать все сообщения с пользователем
    static async MarkAsReadAll( fields ) {
        try {
            let sql = `UPDATE ${DB.Init.TablePrefix}message SET read = true WHERE from_id=${fields.from_id} AND to_id=${fields.to_id} AND id < ${fields.start_id}`
            console.log(sql)
            let result = await DB.Init.Query(sql)

        } catch (err) {
            console.log(err)
            throw ({err: 5004000, msg: 'CMessage MarkAsReadAll'})
        }
    }

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