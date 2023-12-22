import { DB } from "./db"
import { Store } from "../store"


export class CMessage {

    //добавить новое видео
    static async Add( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            //обработка полей
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.to_id = new DB().ObjectID(fields.to_id)

            fields.video_ids = new DB().ObjectID(fields.video_ids)
            fields.img_ids = new DB().ObjectID(fields.img_ids)
            fields.doc_ids = new DB().ObjectID(fields.doc_ids)
            fields.audio_ids = new DB().ObjectID(fields.audio_ids)
            fields.date = new Date()

            //сначало само сообщение
            let collection = mongoClient.collection('message')
            let arFieldsMessage = {
                from_id: fields.from_id,
                to_id: fields.to_id,

                text: fields.text,
                video_ids: fields.video_ids,
                img_ids: fields.img_ids,
                doc_ids: fields.doc_ids,
                audio_ids: fields.audio_ids,

                read: null,
                delete_from: null,
                delete_to: null,
                create_date: fields.date,
                change_date: fields.date
            }
            await collection.insertOne(arFieldsMessage)

            //чат
            collection = mongoClient.collection('chat')

            //поиск чата с этим пользователем
            let arFields = {
                user_ids:
                    {
                        $all:
                            [
                                fields.to_id,
                                fields.from_id,
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
            throw ({code: 5001000, msg: 'CMessage Add'})
        }
    }

    static async Get ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.to_id = new DB().ObjectID(fields.to_id)
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = mongoClient.collection('message')

            let arAggregate = [
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
                    $lookup: {
                        from: 'user',
                        localField: 'from_id',
                        foreignField: '_id',
                        as: '_from_id',
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
                },{ $lookup:
                        {
                            from: 'file_video',
                            localField: 'video_ids',
                            foreignField: '_id',
                            as: '_video_ids',
                        },
                },{ $lookup:
                        {
                            from: 'file_image',
                            localField: 'img_ids',
                            foreignField: '_id',
                            as: '_img_ids'
                        },
                },{ $lookup:
                        {
                            from: 'file_doc',
                            localField: 'doc_ids',
                            foreignField: '_id',
                            as: '_doc_ids'
                        },
                },{ $lookup:
                        {
                            from: 'file_audio',
                            localField: 'audio_ids',
                            foreignField: '_id',
                            as: '_audio_ids'
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

            let result = await collection.aggregate(arAggregate).skip(fields.offset).limit(fields.count).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 5003000, msg: 'CMessage GetChatUser'})
        }
    }

    static async GetCount ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.to_id = new DB().ObjectID(fields.to_id)
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = mongoClient.collection('message')

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
            throw ({code: 5003000, msg: 'CMessage GetChatUser'})
        }
    }

    static async CountNoRead ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.from_id = new DB().ObjectID(fields.from_id)
            fields.to_id = new DB().ObjectID(fields.to_id)

            let collection = mongoClient.collection('message')

            let Aggregate = []
            if (!fields.from_id)
                Aggregate.push({
                    $match: {
                        to_id: fields.to_id,
                        read: null
                    }
                })
            else
                Aggregate.push({
                    $match: {
                        from_id: fields.from_id,
                        to_id: fields.to_id,
                        read: null
                    }
                })

            Aggregate.push({
                $count: 'count'
            })

            /*
            let Aggregate = [
                {
                    $match: {
                        to_id: fields.to_id,
                        read: null
                    }
                },{
                    $count: 'count'
                }
            ]*/

            let result = await collection.aggregate(Aggregate).toArray();
            if (!result.length) return 0
            return result[0].count

        } catch (err) {
            console.log(err)
            throw ({code: 5003000, msg: 'CMessage CountNoRead'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            const mongoClient = Store.GetMongoClient()
            ids = new DB().ObjectID(ids)

            let collection = mongoClient.collection('message')

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
                    $lookup: {
                        from: 'user',
                        localField: 'from_id',
                        foreignField: '_id',
                        as: '_from_id',
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
                },{ $lookup:
                        {
                            from: 'file_video',
                            localField: 'video_ids',
                            foreignField: '_id',
                            as: '_video_ids',
                        },
                },{ $lookup:
                        {
                            from: 'file_image',
                            localField: 'img_ids',
                            foreignField: '_id',
                            as: '_img_ids'
                        },
                },{ $lookup:
                        {
                            from: 'file_doc',
                            localField: 'doc_ids',
                            foreignField: '_id',
                            as: '_doc_ids'
                        },
                },{ $lookup:
                        {
                            from: 'file_audio',
                            localField: 'audio_ids',
                            foreignField: '_id',
                            as: '_audio_ids'
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
            throw ({code: 6002000, msg: 'CMessage GetById'})
        }
    }

    static async Delete ( id, myUserId ) {
        try {
            const mongoClient = Store.GetMongoClient()
            id = new DB().ObjectID(id)

            let arResult = await this.GetById([id])
            if (!arResult.length)
                return false

            arResult = arResult[0]

            let collection = mongoClient.collection('message')

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
            throw ({code: 7001000, msg: 'CMessage Delete'})
        }
    }

    //прочитать все сообщения с пользователем
    static async ReadAll( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.to_id = new DB().ObjectID(fields.to_id)
            fields.from_id = new DB().ObjectID(fields.from_id)

            let collection = mongoClient.collection('message')

            let arQuery = {
                to_id: fields.from_id,
                from_id: fields.to_id
            }

            let arFields = {
                read: true
            }

            let result = collection.updateMany(arQuery, {$set: arFields})
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 5004000, msg: 'CMessage MarkAsReadAll'})
        }
    }

    static async Edit(id, fields) {
        try {
            const mongoClient = Store.GetMongoClient()
            id = new DB().ObjectID(id)
            fields.video_ids = new DB().ObjectID(fields.video_ids)
            fields.img_ids = new DB().ObjectID(fields.img_ids)
            fields.doc_ids = new DB().ObjectID(fields.doc_ids)
            fields.audio_ids = new DB().ObjectID(fields.audio_ids)
            fields.change_date = new Date()

            let collection = mongoClient.collection('message');
            let arFields = {
                _id: id
            }

            let result = collection.updateOne(arFields, {$set: fields})

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CMessage Edit'})
        }
    }
}