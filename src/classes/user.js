import bcrypt from "bcryptjs"
import { DB } from "./db"
import { Store } from "../store"

export class CUser {

    //добавить пользователя
    static async Add(fields) {
        try {
            if (fields.photo_id)
                fields.photo_id = new DB().ObjectID(fields.photo_id)
            if (fields.cover_img_id)
                fields.cover_img_id = new DB().ObjectID(fields.cover_img_id)
            if (fields.cover_video_id)
                fields.cover_video_id = new DB().ObjectID(fields.cover_video_id)

            if (fields.email)
                fields.email = fields.email.toLowerCase()

            if (fields.login)
                fields.login = fields.login.toLowerCase()

            if (fields.password) {
                //создаем hash пароль
                const saltRounds = 10
                let passwordSalt = await bcrypt.genSalt(saltRounds)
                fields.password = await bcrypt.hash(fields.password, passwordSalt)
            }

            let arSearchUser = false
            if (fields.email)
                arSearchUser = await this.GetByField({email: fields.email})
            if (arSearchUser)
                throw ({code: 30020001, msg: 'Такой email уже зарегистрирован'})

            if (fields.login)
                arSearchUser = await this.GetByField({login: fields.login})
            if (arSearchUser)
                throw ({code: 30020001, msg: 'Такой login уже зарегистрирован'})

            if (fields.phone)
                arSearchUser = await this.GetByField({phone: fields.phone})
            if (arSearchUser)
                throw ({code: 30020001, msg: 'Такой телефон уже зарегистрирован'})

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('user')

            let arFields = {...fields, reg_date: new Date()}
            await collection.insertOne(arFields)

            return arFields
        } catch (err) {
            console.log(err)
            throw ({...{code: 7001000, msg: 'CUser Add'}, ...err})
        }
    }

    //поиск по id
    static async GetById ( ids ) {
        try {
            const mongoClient = Store.GetMongoClient()
            ids = new DB().arObjectID(ids)

            let collection = mongoClient.collection('user');
            let result = await collection.aggregate([
                { $match:
                        {
                            _id: {$in: ids}
                        }
                }, {
                    $lookup: {
                        from: 'file_img',
                        localField: 'photo_id',
                        foreignField: '_id',
                        as: '_photo_id',
                    },
                }, {
                    $lookup: {
                        from: 'file_img',
                        localField: 'cover_img_id',
                        foreignField: '_id',
                        as: '_cover_img_id',
                    },
                }, {
                    $lookup: {
                        from: 'file_video',
                        localField: 'cover_video_id',
                        foreignField: '_id',
                        as: '_cover_video_id',
                    },
                }, {
                    $unwind: {
                        path: '$_photo_id',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $unwind: {
                        path: '$_cover_img_id',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $unwind: {
                        path: '$_cover_video_id',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]).toArray()

            return result

        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CUser GetById'})
        }
    }

    //Поиск по полю
    static async GetByField(value) {
        try {
            const mongoClient = Store.GetMongoClient()

            //в нижний регистр
            if (value._id) value._id = new DB().ObjectID(value._id)
            if (value.email) value.email = value.email.toLowerCase()
            if (value.login) value.login = value.login.toLowerCase()

            let collection = mongoClient.collection('user')

            let result = await collection.aggregate([
                {
                    $match: value
                }, {
                    $lookup: {
                        from: 'file_img',
                        localField: 'photo_id',
                        foreignField: '_id',
                        as: '_photo_id',
                    },
                }, {
                    $lookup: {
                        from: 'file_img',
                        localField: 'cover_img_id',
                        foreignField: '_id',
                        as: '_cover_img_id',
                    },
                }, {
                    $lookup: {
                        from: 'file_video',
                        localField: 'cover_video_id',
                        foreignField: '_id',
                        as: '_cover_video_id',
                    },
                }, {
                    $unwind: {
                        path: '$_photo_id',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $unwind: {
                        path: '$_cover_img_id',
                        preserveNullAndEmptyArrays: true
                    }
                }, {
                    $unwind: {
                        path: '$_cover_video_id',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ]).toArray()

            if (!result.length) return false
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CUser GetByField'})
        }
    }

    static async Edit(id, fields) {
        try {
            id = new DB().ObjectID(id)

            if (fields.photo_id)
                fields.photo_id = new DB().ObjectID(fields.photo_id)
            if (fields.cover_img_id)
                fields.cover_img_id = new DB().ObjectID(fields.cover_img_id)
            if (fields.cover_video_id)
                fields.cover_video_id = new DB().ObjectID(fields.cover_video_id)
            if (fields.email)
                fields.email = fields.email.toLowerCase()
            if (fields.login)
                fields.login = fields.login.toLowerCase()

            if (fields.password) {
                //создаем hash пароль
                const saltRounds = 10
                let passwordSalt = await bcrypt.genSalt(saltRounds)
                fields.password = await bcrypt.hash(fields.password, passwordSalt)
            }

            let arSearchUser = false
            if (fields.email)
                arSearchUser = await this.GetByField({email: fields.email})
            if (arSearchUser)
                throw ({code: 30020001, msg: 'Такой email уже зарегистрирован'})

            if (fields.login)
                arSearchUser = await this.GetByField({login: fields.login})
            if (arSearchUser)
                throw ({code: 30020001, msg: 'Такой login уже зарегистрирован'})

            if (fields.phone)
                arSearchUser = await this.GetByField({phone: fields.phone})
            if (arSearchUser)
                throw ({code: 30020001, msg: 'Такой телефон уже зарегистрирован'})

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('user');
            let result = collection.updateOne({_id: id}, {$set: fields}, {upsert: true})

            return fields
        } catch (err) {
            console.log(err)
            throw ({code: 7002000, msg: 'CUser Edit'})
        }
    }

    //поиск по пользователям
    static async Get(fields) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('user');

            let arAggregate = []

            if (fields.q) arAggregate.push({
                    $match: {
                        $text: {
                            $search: fields.q
                        }
                    },
                }
            )

            arAggregate.push({
                $lookup: {
                    from: 'file_img',
                    localField: 'photo_id',
                    foreignField: '_id',
                    as: '_photo_id',
                },
            }, {
                $lookup: {
                    from: 'file_img',
                    localField: 'cover_img_id',
                    foreignField: '_id',
                    as: '_cover_img_id',
                },
            }, {
                $lookup: {
                    from: 'file_video',
                    localField: 'cover_video_id',
                    foreignField: '_id',
                    as: '_cover_video_id',
                },
            }, {
                $unwind: {
                    path: '$_photo_id',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $unwind: {
                    path: '$_cover_img_id',
                    preserveNullAndEmptyArrays: true
                }
            }, {
                $unwind: {
                    path: '$_cover_video_id',
                    preserveNullAndEmptyArrays: true
                }
            })

            arAggregate.push({
                $sort: {
                    action_date_last: -1,
                }
            })

            let result = await collection.aggregate(arAggregate).limit(fields.count + fields.offset).skip(fields.offset).toArray()
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CUser Get'})
        }
    }

    //количество / поиск по пользователям
    static async GetCount(fields) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('user');

            let arSearch = {}
            if (fields.q) arSearch = {$text: {$search: fields.q}}

            let result = await collection.count(arSearch)
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CUser GetCount'})
        }
    }

    static async Count(fields) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('user');

            let result = await collection.count()
            return result

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CUser Count'})
        }
    }
}