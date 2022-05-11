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

            //КОММЕНТЫ
            //количество
            let arFields = {
                module: fields.module,
                object_id: fields.object_id,
            }
            let commentCount = await this.Count ( arFields )

            //выбираем коллекцию с объектом
            collection = DB.Client.collection(fields.module)
            //обновляем поля в объекте
            await collection.updateOne({_id: fields.object_id}, {$set: {comment: commentCount}})

        } catch (err) {
            console.log(err)
            throw ({code: 2001000, msg: 'CComment Add'})
        }
    }
    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = new DB().arObjectID(ids)

            let collection = DB.Client.collection('comment');
            let result = await collection.aggregate([
                { $match:
                        {
                            _id: {$in: ids}
                        }
                },
                { $lookup:
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
                },
                {
                    $unwind:
                        {
                            path: '$_file_ids',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]).toArray();

            return result

        } catch (err) {
            console.log(err)
            throw ({code: 6002000, msg: 'CComment GetById'})
        }
    }
    static async Get ( fields ) {
        try {
            fields.object_id = new DB().ObjectID(fields.object_id)
            fields.comment_id = new DB().ObjectID(fields.comment_id)

            let collection = DB.Client.collection('comment')

            let Aggregate = [
                {
                    $match: {
                        module: fields.module,
                        object_id: fields.object_id
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
            throw ({code: 5003000, msg: 'CComment GetChatUser'})
        }
    }

    static async Count ( fields ) {
        try {
            fields.object_id = new DB().ObjectID(fields.object_id)

            let collection = DB.Client.collection('comment')

            let Aggregate = [
                {
                    $match: {
                        //module: fields.module,
                        object_id: fields.object_id
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
            throw ({code: 5003000, msg: 'CComment Count'})
        }
    }
    static async Edit(id, fields) {
        try {
            id = new DB().ObjectID(id)

            let collection = DB.Client.collection('comment');
            let arFields = {
                _id: id
            }

            let result = collection.updateOne(arFields, {$set: fields})

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CComment Edit'})
        }
    }
    static async Delete ( id ) {
        try {
            id = new DB().ObjectID(id)

            let collection = DB.Client.collection('comment');

            let result = collection.deleteOne({_id: id})

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CComment Delete'})
        }
    }

}