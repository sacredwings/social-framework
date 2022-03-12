import {DB} from "./db";
import { CFile } from "./file";

export class CComment {

    //новый комментарий
    static async Add ( fields ) {
        try {
            //обработка полей
            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.file_ids = new DB().arObjectID(fields.file_ids)
            fields.create_date = new Date()
            fields.change_date = new Date()

            //сначало само сообщение
            let collection = DB.Client.collection('comment')
            let arFieldsMessage = {
                module: fields.module,
                object_id: fields.object_id,
                from_id: fields.from_id,
                text: fields.text,
                file_ids: fields.file_ids,
                comment_id: fields.comment_id,
                create_date: fields.create_date,
                change_date: fields.change_date
            }
            await collection.insertOne(arFieldsMessage)

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CComment Add'})
        }
    }

    static async Get ( fields ) {
        try {
            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.comment_id = new DB().ObjectID(fields.comment_id)

            let collection = DB.Client.collection('comment')

            let Aggregate = [
                {
                    $match: {
                        module: fields.module,
                        object_id: fields.object_id,
                        from_id: fields.from_id
                    }
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
                    $lookup: {
                        from: 'file',
                        localField: 'file_ids',
                        foreignField: '_id',
                        as: '_file_ids',
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
                }
            ]

            let result = await collection.aggregate(Aggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 5003000, msg: 'CMessage GetChatUser'})
        }
    }

    //количество
    static async Count ( fields ) {
        try {

            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}comment WHERE module=$1 AND object_id=$2`
            let result = await DB.Init.Query(sql, [fields.module, fields.object_id])

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 2003000, msg: 'CComment Count'})
        }
    }

    //пользователи
    static async GetUsers ( items ) {
        try {

            //нет массива для обработки
            if ((!items) || (!items.length))
                return []

            /* выгрузка индентификаторов из объектов / пользователей */
            let arUsersId = items.map((item, i) => {
                return item.from_id
            })

            //удаление одинаковых id из массива
            arUsersId = Array.from(new Set(arUsersId))

            let sql = `SELECT id,login,first_name,create_date,birthday,photo FROM ${DB.Init.TablePrefix}user WHERE id in (${arUsersId})`
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
            throw ({err: 2004000, msg: 'CComment GetUsers'})
        }
    }
}