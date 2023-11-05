import { DB } from "../db"
import { Store } from "../../store"

export class CGroup {

    //добавить новую группу
    static async Add ( fields ) {
        try {
            //ПОДГОТОВКА
            //ссылки
            if (fields.photo_id)
                fields.photo_id = new DB().ObjectID(fields.photo_id)
            if (fields.cover_id)
                fields.cover_id = new DB().ObjectID(fields.cover_id)
            if (fields.cover_video_id)
                fields.cover_video_id = new DB().ObjectID(fields.cover_video_id)
            if (fields.from_id)
                fields.from_id = new DB().ObjectID(fields.from_id)

            let newFields = {
                create_date: new Date(),
                count_view: 0,
                count_comment: 0,
                count_like: 0,
                count_dislike: 0,
                count_repeat: 0
            }

            //ДЕЙСТВИЕ
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('group')

            let arFields = {...fields, ...newFields}
            await collection.insertOne(arFields)

            return arFields
        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CGroup Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = new DB().ObjectID(ids)

            let arAggregate = []
            arAggregate.push({
                $match: {
                    _id: {$in: ids}
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'user',
                    localField: 'from_id',
                    foreignField: '_id',
                    as: '_from_id',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'file_img',
                                localField: 'photo_id',
                                foreignField: '_id',
                                as: '_photo_id'
                            }
                        },{
                            $unwind: {
                                path: '$_photo_id',
                                preserveNullAndEmptyArrays: true
                            }
                        }
                    ]
                },
            })
            arAggregate.push({
                $lookup: {
                    from: 'file_img',
                    localField: 'photo_id',
                    foreignField: '_id',
                    as: '_photo_id',
                },
            })
            arAggregate.push({
                $lookup: {
                    from: 'file_img',
                    localField: 'cover_id',
                    foreignField: '_id',
                    as: '_cover_id',
                },
            })
            arAggregate.push({
                $lookup: {
                    from: 'file_video',
                    localField: 'cover_video_id',
                    foreignField: '_id',
                    as: '_cover_video_id',
                },
            })
            arAggregate.push({
                $unwind: {
                    path: '$_from_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_photo_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_cover_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_cover_video_id',
                    preserveNullAndEmptyArrays: true
                }
            })

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('group')
            let result = await collection.aggregate(arAggregate).toArray()
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 4002000, msg: 'CGroup GetById'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {
            if (fields.q) {
                fields.q = fields.q.replace(/ +/g, ' ').trim();
                fields.q = fields.q.replace("[^\\da-zA-Zа-яёА-ЯЁ ]", ' ').trim();
            }
            fields.user_id = new DB().ObjectID(fields.user_id)

            let arAggregate = []
            arAggregate.push({
                $match:
                    {}
            })
            arAggregate.push(
                { $lookup:
                        {
                            from: 'file_image',
                            localField: 'photo_id',
                            foreignField: '_id',
                            as: '_photo_id',
                        },
                })
            arAggregate.push(
                { $lookup:
                        {
                            from: 'file_image',
                            localField: 'cover_id',
                            foreignField: '_id',
                            as: '_cover_image_id',
                        },
                })
            arAggregate.push(
                { $lookup:
                        {
                            from: 'file_video',
                            localField: 'cover_id',
                            foreignField: '_id',
                            as: '_cover_video_id',
                        },
                })
            arAggregate.push(
                {
                    $unwind:
                        {
                            path: '$_photo_id',
                            preserveNullAndEmptyArrays: true
                        }
                })
            arAggregate.push(
                {
                    $unwind:
                        {
                            path: '$_cover_image_id',
                            preserveNullAndEmptyArrays: true
                        }
                })
            arAggregate.push(
                {
                    $unwind:
                        {
                            path: '$_cover_video_id',
                            preserveNullAndEmptyArrays: true
                        }
                })

            if (fields.from_id)
                arAggregate[0].$match.from_id = fields.from_id

            if (fields.q) {
                arAggregate[0].$match.$text = {}
                arAggregate[0].$match.$text.$search = fields.q
            }

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('group');
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
            fields.from_id = new DB().ObjectID(fields.from_id)

            let arFields = {}
            if (fields.from_id)
                arFields.create_id = fields.from_id
            if (fields.q) {
                arFields.$text = {}
                arFields.$text.$search = fields.q
            }

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('group')
            return await collection.count(arFields)
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

    static async Edit ( id, fields ) {
        try {
            //ПОДГОТОВКА
            //ссылки
            id = new DB().ObjectID(id)

            if (fields.photo_id)
                fields.photo_id = new DB().ObjectID(fields.photo_id)
            if (fields.cover_id)
                fields.cover_id = new DB().ObjectID(fields.cover_id)
            if (fields.cover_video_id)
                fields.cover_video_id = new DB().ObjectID(fields.cover_video_id)
            if (fields.from_id)
                fields.from_id = new DB().ObjectID(fields.from_id)

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('group')

            let result = collection.updateOne({_id: id}, {$set: fields}, {upsert: true})
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 4006000, msg: 'CGroup Edit'})
        }
    }

    //удаление группы
    static async Delete ( id, user_id ) {
        try {
            id = new DB().ObjectID(id)
            user_id = new DB().ObjectID(user_id)

            let arFields = {
                delete: true,
                delete_date: new Date(),
                delete_user: user_id
            }

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('group')
            let result = collection.updateOne({_id: id}, {$set: arFields}, {upsert: true})
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 4007000, msg: 'CGroup Delete'})
        }
    }

    //Права доступа / сначала созданеля, после права
    static async StatusAccess ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()

            if (!fields.user_id)
                throw ({code: 30020001, msg: 'Нет user_id, не у кого проверять'})
            if (!fields.group_id)
                throw ({code: 30020001, msg: 'Нет group_id, не где проверять'})

            fields.user_id = new DB().ObjectID(fields.user_id)
            fields.group_id = new DB().ObjectID(fields.group_id)

            let collection = mongoClient.collection('group');
            let arFields = {
                _id: fields.group_id,
                from_id: fields.user_id,
            }

            let result = await collection.findOne(arFields)
            if (result) return true

            return false

        } catch (err) {
            console.log(err)
            throw ({code: 4001000, msg: 'CGroup Access'})
        }
    }
}

function Day(day, startDate=new Date()) {
    let date = new Date(startDate); // Now
    date.setDate(date.getDate() + day); // Set now + 30 days as the new date

    return date
}