// @ts-nocheck
import bcrypt from "bcryptjs"
import { DB } from "./db"
import { Store } from "../store"

export class CUser {

    //добавить пользователя
    static async Add(fields) {
        try {
            //ПОДГОТОВКА
            //ссылки
            if (fields.photo_id)
                fields.photo_id = new DB().ObjectID(fields.photo_id)
            if (fields.cover_id)
                fields.cover_id = new DB().ObjectID(fields.cover_id)
            if (fields.cover_video_id)
                fields.cover_video_id = new DB().ObjectID(fields.cover_video_id)

            //обязательно нижний регистр
            if (fields.email)
                fields.email = fields.email.toLowerCase()
            if (fields.login)
                fields.login = fields.login.toLowerCase()

            //создание пароля
            if (fields.password) {
                //создаем hash пароль
                const saltRounds = 10
                let passwordSalt = await bcrypt.genSalt(saltRounds)
                fields.password = await bcrypt.hash(fields.password, passwordSalt)
            }

            //ПРОВЕРКА
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

            //ДЕЙСТВИЕ
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('user')

            let arFields = {...fields, create_date: new Date()}
            await collection.insertOne(arFields)

            return arFields
        } catch (err) {
            console.log(err)
            throw ({...{code: 7001000, msg: 'CUser Add'}, ...err})
        }
    }

    static async AddGenerate () {
        try {
            //создание пароля

            let password = randomNumber(11111111, 99999999)

            const saltRounds = 10
            let passwordSalt = await bcrypt.genSalt(saltRounds)
            let hashPassword = await bcrypt.hash(password, passwordSalt)

            let arFields = {
                login: hashPassword,
                password: hashPassword,
                first_name: hashPassword,

                create_date: new Date()
            }

            //ДЕЙСТВИЕ
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('user')

            //создание чистой записи
            await collection.insertOne(arFields)

            let arFieldsEdit = {
                login: arFields._id,
                first_name: arFields._id
            }

            let result = collection.updateOne({_id: arFields._id}, {$set: arFieldsEdit}, {upsert: true})
            return {
                _id: arFields._id,
                login: arFields._id,
                first_name: arFields._id,
                password: password
            }

        } catch (err) {
            console.log(err)
            throw ({...{code: 7001000, msg: 'CUser Add'}, ...err})
        }
    }

    //поиск по id
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
                    from: 'img',
                    localField: 'photo_id',
                    foreignField: '_id',
                    as: '_photo_id'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'img',
                    localField: 'cover_id',
                    foreignField: '_id',
                    as: '_cover_id',
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'video',
                    localField: 'cover_video_id',
                    foreignField: '_id',
                    as: '_cover_video_id',
                },
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
            let collection = mongoClient.collection(`user`)
            let result = await collection.aggregate(arAggregate).toArray()
            return result

        } catch (err) {
            console.log(err)
            throw ({...{code: 7001000, msg: 'CUser GetById'}, ...err})
        }
    }

    //Поиск по полю
    static async GetByField(fields) {
        try {
            //в нижний регистр
            if (fields._id) fields._id = new DB().ObjectID(fields._id)
            if (fields.email) fields.email = fields.email.toLowerCase()
            if (fields.login) fields.login = fields.login.toLowerCase()

            let arAggregate = []
            arAggregate.push({
                $match: fields
            })
            arAggregate.push({
                $lookup: {
                    from: 'img',
                    localField: 'photo_id',
                    foreignField: '_id',
                    as: '_photo_id'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'img',
                    localField: 'cover_id',
                    foreignField: '_id',
                    as: '_cover_id',
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'video',
                    localField: 'cover_video_id',
                    foreignField: '_id',
                    as: '_cover_video_id',
                },
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

            if (fields._id)
                arAggregate[0].$match._id = fields._id
            if (fields.email)
                arAggregate[0].$match.email = fields.email
            if (fields.login)
                arAggregate[0].$match.login = fields.login

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection(`user`)
            let result = await collection.aggregate(arAggregate).toArray()
            if (!result.length) return false
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({...{code: 7001000, msg: 'CUser GetByField'}, ...err})
        }
    }

    static async Edit(id, fields) {
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

            //обязательно нижний регистр
            if (fields.email)
                fields.email = fields.email.toLowerCase()
            if (fields.login)
                fields.login = fields.login.toLowerCase()

            //создание пароля
            if (fields.password) {
                //создаем hash пароль
                const saltRounds = 10
                let passwordSalt = await bcrypt.genSalt(saltRounds)
                fields.password = await bcrypt.hash(fields.password, passwordSalt)
            }

            //ПРОВЕРКА
            let arSearchUser = false
            if (fields.email)
                arSearchUser = await this.GetByField({email: fields.email, _id: { $ne: id }})
            if (arSearchUser)
                throw ({code: 30020001, msg: 'Такой email уже зарегистрирован'})

            if (fields.login)
                arSearchUser = await this.GetByField({login: fields.login, _id: { $ne: id }})
            if (arSearchUser)
                throw ({code: 30020001, msg: 'Такой login уже зарегистрирован'})

            if (fields.phone)
                arSearchUser = await this.GetByField({phone: fields.phone, _id: { $ne: id }})
            if (arSearchUser)
                throw ({code: 30020001, msg: 'Такой телефон уже зарегистрирован'})

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('user');

            let result = collection.updateOne({_id: id}, {$set: fields}, {upsert: true})
            return fields
        } catch (err) {
            console.log(err)
            throw ({...{code: 7002000, msg: 'CUser Edit'}, ...err})
        }
    }

    //поиск по пользователям
    static async Get(fields) {
        try {
            let arAggregate = []
            arAggregate.push({
                $match:
                    {}
            })
            arAggregate.push({
                $lookup: {
                    from: 'img',
                    localField: 'photo_id',
                    foreignField: '_id',
                    as: '_photo_id'
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'img',
                    localField: 'cover_id',
                    foreignField: '_id',
                    as: '_cover_id',
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'video',
                    localField: 'cover_video_id',
                    foreignField: '_id',
                    as: '_cover_video_id',
                },
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

            arAggregate.push({
                $sort: {
                    action_date_last: -1,
                }
            })

            if (fields.q) arAggregate[0].$match.$text = {}
            if (fields.q) arAggregate[0].$match.$text.$search = fields.q

            //сортировка, если поиска нет
            if (fields.q)
                arAggregate.push({
                    $sort: {
                        $score: {$meta:"textScore"}
                    }
                })
            else
                arAggregate.push({
                    $sort: {
                        _id: -1,
                    }
                })

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('user')
            let result = await collection.aggregate(arAggregate).skip(fields.offset).limit(fields.count).toArray()
            return result
        } catch (err) {
            console.log(err)
            throw ({...{code: 7001000, msg: 'CUser Get'}, ...err})
        }
    }

    //количество / поиск по пользователям
    static async GetCount(fields) {
        try {
            let arFields = {}
            if (fields.q) arFields = {$text: {$search: fields.q}}

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('user')
            let result = await collection.count(arFields)
            return result
        } catch (err) {
            console.log(err)
            throw ({...{code: 7001000, msg: 'CUser GetCount'}, ...err})
        }
    }

    static async Count(fields) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('user')

            let result = await collection.count()
            return result

        } catch (err) {
            console.log(err)
            throw ({...{code: 8001000, msg: 'CUser Count'}, ...err})
        }
    }

    static async Passport({user_id}) {
        try {
            user_id = new DB().ObjectID(user_id)

            const mongoClient = Store.GetMongoClient()
            let collectionVideo = mongoClient.collection('video')
            let collectionArticle = mongoClient.collection('article')
            let collectionBlank = mongoClient.collection('blank')
            let collectionTopic = mongoClient.collection('topic')
            let collectionPost = mongoClient.collection('post')

            let arAggregate = []
            arAggregate.push({
                $match: {
                    from_id: user_id
                }
            })
            arAggregate.push({
                $group: {
                    _id: {
                        to_user_id: "$to_user_id",
                        to_group_id: "$to_group_id"
                    },
                    // Другие поля для агрегации (например, сумма, среднее и т.д.)
                    count: { $sum: 1 }
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'user',  // Имя коллекции, к которой присоединяемся
                    localField: '_id.to_user_id',  // Поле из текущей коллекции (после $group)
                    foreignField: '_id', // Поле из коллекции 'user', которое нужно сопоставить с localField
                    as: '_to_user_id' // Имя поля, в котором будет содержаться результат JOIN
                }
            })
            arAggregate.push({
                $lookup: {
                    from: 'group',  // Имя коллекции, к которой присоединяемся
                    localField: '_id.to_group_id',  // Поле из текущей коллекции (после $group)
                    foreignField: '_id', // Поле из коллекции 'user', которое нужно сопоставить с localField
                    as: '_to_group_id' // Имя поля, в котором будет содержаться результат JOIN
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_to_user_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $unwind: {
                    path: '$_to_group_id',
                    preserveNullAndEmptyArrays: true
                }
            })
            arAggregate.push({
                $sort: {
                    count: -1 // -1 для сортировки по убыванию, 1 для сортировки по возрастанию
                }
            })
            arAggregate.push({
                $limit: 5
            })

            let video = await collectionVideo.aggregate(arAggregate).toArray()
            let article = await collectionArticle.aggregate(arAggregate).toArray()
            let blank = await collectionBlank.aggregate(arAggregate).toArray()
            let topic = await collectionTopic.aggregate(arAggregate).toArray()
            let post = await collectionPost.aggregate(arAggregate).toArray()

            return {
                video,
                article,
                blank,
                topic,
                post
            }

        } catch (err) {
            console.log(err)
            throw ({...{code: 8001000, msg: 'CUser Passport'}, ...err})
        }
    }
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
