import bcrypt from "bcryptjs";
import crypto from "crypto";
import { DB } from "./db"
import { Store } from "../store"
import { CFile } from "../classes/file"



export class CUser {

    //добавить пользователя
    static async Add ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            if (fields.email)
                fields.email = fields.email.toLowerCase()

            if (fields.login)
                fields.login = fields.login.toLowerCase()

            //создаем hash код
            let hash = new Date().toString();
            hash = crypto.createHash('md5').update(hash).digest("hex");

            //создаем hash пароль
            const saltRounds = 10;
            let passwordSalt = await bcrypt.genSalt(saltRounds);
            fields.password = await bcrypt.hash(fields.password, passwordSalt);

            let arUsers = await this.GetByEmail(fields.email);
            if (arUsers)
                throw ({code: 30020001, msg: 'Такой email уже зарегистрирован'});

            arUsers = await this.GetByLogin(fields.login);
            if (arUsers)
                throw ({code: 30020001, msg: 'Такой login уже зарегистрирован'});

            let collection = mongoClient.collection('user');

            //список
            let arFields = {
                login: fields.login,
                email: fields.email,
                password: fields.password,
                first_name: fields.first_name,
                last_name: fields.last_name,
                date_reg: new Date(),
            }

            let result = await collection.insertOne(arFields)

            return arFields
        } catch (err) {
            console.log(err)
            throw ({...{code: 7001000, msg: 'CUser AddUser'}, ...err})
        }
    }

    //поиск по id
    static async GetById ( ids ) {
        try {
            const mongoClient = Store.GetMongoClient()
            ids = new DB().arObjectID(ids)

            let collection = mongoClient.collection('user');
            //let result = await collection.find({_id: { $in: ids}}).toArray()
            let result = await collection.aggregate([
                { $match:
                        {
                            _id: {$in: ids}
                        }
                },{ $lookup:
                        {
                            from: 'file_image',
                            localField: 'photo_id',
                            foreignField: '_id',
                            as: '_photo_id',
                        },
                },{ $lookup:
                        {
                            from: 'file_image',
                            localField: 'cover_id',
                            foreignField: '_id',
                            as: '_cover_image_id',
                        },
                },{ $lookup:
                        {
                            from: 'file_video',
                            localField: 'cover_id',
                            foreignField: '_id',
                            as: '_cover_video_id',
                        },
                },{ $unwind:
                        {
                            path: '$_photo_id',
                            preserveNullAndEmptyArrays: true
                        }
                },{ $unwind:
                        {
                            path: '$_cover_image_id',
                            preserveNullAndEmptyArrays: true
                        }
                },{ $unwind:
                        {
                            path: '$_cover_video_id',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]).toArray();

            return result

        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CUser GetById'})
        }
    }

    //поиск по email
    static async GetByEmail ( email ) {
        try {
            const mongoClient = Store.GetMongoClient()
            //в нижний регистр
            email = email.toLowerCase()

            let collection = mongoClient.collection('user');
            //let result = await collection.findOne({login})

            let result = await collection.aggregate([
                { $match:
                        {
                            email: email
                        }
                },{ $lookup:
                        {
                            from: 'file_image',
                            localField: 'photo_id',
                            foreignField: '_id',
                            as: '_photo_id',
                        },
                },{ $lookup:
                        {
                            from: 'file_image',
                            localField: 'cover_id',
                            foreignField: '_id',
                            as: '_cover_image_id',
                        },
                },{ $lookup:
                        {
                            from: 'file_video',
                            localField: 'cover_id',
                            foreignField: '_id',
                            as: '_cover_video_id',
                        },
                },{ $unwind:
                        {
                            path: '$_photo_id',
                            preserveNullAndEmptyArrays: true
                        }
                },{ $unwind:
                        {
                            path: '$_cover_image_id',
                            preserveNullAndEmptyArrays: true
                        }
                },{ $unwind:
                        {
                            path: '$_cover_video_id',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]).toArray();

            if (!result.length) return false
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CUser GetByEmail'})
        }
    }

    //поиск по login
    static async GetByLogin ( login ) {
        try {
            const mongoClient = Store.GetMongoClient()
            //в нижний регистр
            login = login.toLowerCase()

            let collection = mongoClient.collection('user');
            //let result = await collection.findOne({login})

            let result = await collection.aggregate([
                { $match:
                        {
                            login: login
                        }
                },{ $lookup:
                        {
                            from: 'file_image',
                            localField: 'photo_id',
                            foreignField: '_id',
                            as: '_photo_id',
                        },
                },{ $lookup:
                        {
                            from: 'file_image',
                            localField: 'cover_id',
                            foreignField: '_id',
                            as: '_cover_image_id',
                        },
                },{ $lookup:
                        {
                            from: 'file_video',
                            localField: 'cover_id',
                            foreignField: '_id',
                            as: '_cover_video_id',
                        },
                },{ $unwind:
                        {
                            path: '$_photo_id',
                            preserveNullAndEmptyArrays: true
                        }
                },{ $unwind:
                        {
                            path: '$_cover_image_id',
                            preserveNullAndEmptyArrays: true
                        }
                },{ $unwind:
                        {
                            path: '$_cover_video_id',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]).toArray();

            if (!result.length) return false
            return result[0]

            //console.log(result)
            //console.log(result[0].photo)
            /*
            let result = await DB.Init.Query(`SELECT * FROM ${DB.Init.TablePrefix}user WHERE login=$1`, [login])
            if (!result.length) return false
            result = result[0]

            //удаление пароля
            //delete result.password


            if (result.photo) {
                result.photo = await CFile.GetById([result.photo]);
                result.photo = result.photo[0]
            }*/

            //return result

        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CUser GetByLogin'})
        }
    }

    //поиск по login
    static async GetUserByVk ( {vk_id, email } ) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('user');

            let result = await collection.aggregate([{
                $match: {
                    $or: [{
                        vk_id: vk_id
                    },{
                        email: email
                    }]
                }
            }
            ]).toArray();

            if (!result.length) return false
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CUser GetByLogin'})
        }
    }


    static async Edit ( id, fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            id = new DB().ObjectID(id)

            if (fields.password) {
                const salt = await bcrypt.genSalt();
                fields.password = await bcrypt.hash(fields.password, salt);
            }

            if (fields.cover_id) {
                fields.cover_id = new DB().ObjectID(fields.cover_id)

                if (
                    (!await CFile.GetById([fields.cover_id], 'file_video')) &&
                    (!await CFile.GetById([fields.cover_id], 'file_image'))
                ) fields.cover_id = null
            }

            if (fields.photo_id) fields.photo_id = new DB().ObjectID(fields.photo_id)

            let collection = mongoClient.collection('user');
            let result = collection.updateOne({_id: id}, {$set: fields}, {upsert: true})

            //let result = await DB.Init.Update (`${DB.Init.TablePrefix}user`, fields, {id: id},`id`)
            return fields
        } catch (err) {
            console.log(err)
            throw ({code: 7002000, msg: 'CUser Edit'})
        }
    }

    //поиск по пользователям
    static async Get ( fields ) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('user');

            let arAggregate = []

            if (fields.q) arAggregate.push(
                { $match:
                        {
                            $text: {
                                $search: fields.q
                            }
                        },
                }
            )

            arAggregate.push(
                { $lookup:
                        {
                            from: 'file_image',
                            localField: 'photo_id',
                            foreignField: '_id',
                            as: '_photo_id',
                        },
                },{ $lookup:
                        {
                            from: 'file_image',
                            localField: 'cover_id',
                            foreignField: '_id',
                            as: '_cover_image_id',
                        },
                },{ $lookup:
                        {
                            from: 'file_video',
                            localField: 'cover_id',
                            foreignField: '_id',
                            as: '_cover_video_id',
                        },
                },{ $unwind:
                        {
                            path: '$_photo_id',
                            preserveNullAndEmptyArrays: true
                        }
                },{ $unwind:
                        {
                            path: '$_cover_image_id',
                            preserveNullAndEmptyArrays: true
                        }
                },{ $unwind:
                        {
                            path: '$_cover_video_id',
                            preserveNullAndEmptyArrays: true
                        }
                }
            )

            arAggregate.push({
                $sort: {
                    last_action_date: -1,
                }
            })

            let result = await collection.aggregate(arAggregate).limit(fields.count+fields.offset).skip(fields.offset).toArray()
            return result
        } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CUser Get'})
        }
    }

    //количество / поиск по пользователям
    static async GetCount ( fields ) {
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

    static async Count ( fields ) {
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
    /*
    //количество всех видео
    static async Count ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}user`

            let result = await DB.Init.Query(sql)
            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CVideo Count'})
        }
    }*/
/*
    //пользователи
    static async GetByField ( items, fieldName ) {
        try {
            //нет массива для обработки
            if ((!items) || (!items.length))
                return []

            let arUsersId = []

            items.forEach((item, i) => {
                if (item[fieldName] > 0)
                    arUsersId.push(item[fieldName])
            })

            if (!arUsersId.length) return []

            //удаление одинаковых id из массива
            arUsersId = Array.from(new Set(arUsersId))

            let collection = DB.Client.collection('user');
            let result = await collection.aggregate([
                { $match:
                        {
                            _id: {$in: arUsersId}
                        }
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'photo',
                            foreignField: '_id',
                            as: '_photo',
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
                            path: '$_photo',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]).toArray();

            return result

        } catch (err) {
            console.log(err)
            throw ({code: 6005000, msg: 'CUser GetByField'})
        }
    }*/
/*
static async reset (value) {
    try {
        //создаем hash /нужно поменять на дату
        let hash = new Date().toString();
        hash = crypto.createHash('md5').update(hash).digest("hex");

        let arUsers = await modelsProfile.getUserByEmail(value.email);
        console.log(arUsers)
        if (!arUsers.length)
            throw ({code: 30040001, msg: 'Такой email не зарегистрирован'});

        await modelsProfile.setByCode(arUsers[0].id, 1, hash);

        const accountMail = {
            host: 'smtp.yandex.ru', //smtp.mail.ru
            port: 465, //465
            secure: true, // use SSL
            auth: {
                user: 'reg@zayebot.ru',
                pass: 'zayebot1247'
            }
        };
        //коннект
        const transporter = createTransport(accountMail);

        //отправка
        transporter.sendMail({
            from: accountMail.auth.user,
            to: value.email,
            subject: 'ZayeBot - Код для востановления доступа к аккаунту',
            html: `Для востановления доступа к аккаунту, перейдите по ссылке - <a href="https://zayebot.ru/reset-active/${hash}">https://zayebot.ru/reset-active/${hash}</a>`
        });

        return true;

    } catch (err) {
        throw ({...{code: 30040000, msg: 'Отправка кода на e-mail'}, ...err});
    }
}
static async resetActivate (value) {
    try {
        let code = await modelsProfile.getByCode(1, value.code);
        if (!code.length)
            throw ({code: 30050001, msg: 'Такого кода не существует, попробуйте востановить пароль еще раз'});

        //создание хеш пароля
        const saltRounds = 10;
        let passwordSalt = await bcrypt.genSalt(saltRounds);
        value.password = await bcrypt.hash(value.password, passwordSalt);

        await modelsProfile.setPassword(code[0].user_id, value.password);

        return true;

    } catch (err) {
        throw ({...{code: 30050000, msg: 'Отправка кода на e-mail'}, ...err});
    }*/
}
