import bcrypt from "bcrypt";
import crypto from "crypto";
import {DB} from "./db";
import CFile from './file'

export default class {

    //добавить незарегистрированного пользователя
    static async AddNoReg ( fields ) {
        try {
            if (fields.email)
                fields.email = fields.email.toLowerCase()

            if (fields.login)
                fields.login = fields.login.toLowerCase()

            let collection = DB.Client.collection('user_no_reg');

            let result = await collection.insertOne(fields)

            return fields

            //запись
            //let result = await DB.Init.Insert(`${DB.Init.TablePrefix}user_no_reg`, fields, `ID`)
            //return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CUser AddNoReg'})
        }
    }

    //добавить пользователя
    static async Add ( fields ) {
        try {
            if (fields.email)
                fields.email = fields.email.toLowerCase()

            if (fields.login)
                fields.login = fields.login.toLowerCase()


            let collection = DB.Client.collection('user');

            let result = await collection.insertOne(fields)

            return fields

            //запись
            //let result = await DB.Init.Insert(`${DB.Init.TablePrefix}user`, fields, `ID`)
            //return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CUser AddUser'})
        }
    }

    //поиск по id
    static async GetById ( ids ) {
        try {
            ids = new DB().arObjectID(ids)

            let collection = DB.Client.collection('user');
            //let result = await collection.find({_id: { $in: ids}}).toArray()
            let result = await collection.aggregate([
                { $match:
                        {
                            _id: {$in: ids}
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
                                }
                            ]
                        },
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'photo_big',
                            foreignField: '_id',
                            as: '_photo_big',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
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
                },
                {
                    $unwind:
                        {
                            path: '$_photo_big',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]).toArray();

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CUser GetById'})
        }
    }

    //поиск по email
    static async GetByEmail ( email ) {
        try {
            //в нижний регистр
            email = email.toLowerCase()

            let collection = DB.Client.collection('user');
            //let result = await collection.findOne({login})

            let result = await collection.aggregate([
                { $match:
                        {
                            email: email
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
                                }
                            ]
                        },
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'photo_big',
                            foreignField: '_id',
                            as: '_photo_big',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
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
                },
                {
                    $unwind:
                        {
                            path: '$_photo_big',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]).toArray();

            if (!result.length) return false
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CUser GetByEmail'})
        }
    }

    //поиск по login
    static async GetByLogin ( login ) {
        try {
            //в нижний регистр
            login = login.toLowerCase()

            let collection = DB.Client.collection('user');
            //let result = await collection.findOne({login})

            let result = await collection.aggregate([
                { $match:
                        {
                            login: login
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
                                }
                            ]
                        },
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'photo_big',
                            foreignField: '_id',
                            as: '_photo_big',
                            pipeline: [
                                { $lookup:
                                        {
                                            from: 'file',
                                            localField: 'file_id',
                                            foreignField: '_id',
                                            as: '_file_id'
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
                },
                {
                    $unwind:
                        {
                            path: '$_photo_big',
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
            throw ({err: 7001000, msg: 'CUser GetByLogin'})
        }
    }

    static async Edit ( id, fields ) {
        try {
            if (fields.password) {
                const salt = await bcrypt.genSalt();
                fields.password = await bcrypt.hash(fields.password, salt);
            }

            let collection = DB.Client.collection('user');
            let result = collection.updateOne({_id: id}, {$set: fields}, {upsert: true})

            //let result = await DB.Init.Update (`${DB.Init.TablePrefix}user`, fields, {id: id},`id`)
            return fields
        } catch (err) {
            console.log(err)
            throw ({err: 7002000, msg: 'CUser Edit'})
        }
    }

    static async Reg ( fields ) {
        try {
            //создаем hash код
            let hash = new Date().toString();
            hash = crypto.createHash('md5').update(hash).digest("hex");

            //создаем hash пароль
            const saltRounds = 10;
            let passwordSalt = await bcrypt.genSalt(saltRounds);
            fields.password = await bcrypt.hash(fields.password, passwordSalt);

            //почту в нижний регистр
            fields.email = fields.email.toLowerCase();

            let arUsers = await this.GetByEmail(fields.email);
            if (arUsers)
                throw ({err: 30020001, msg: 'Такой email уже зарегистрирован'});

            arUsers = await this.GetByLogin(fields.login);
            if (arUsers)
                throw ({err: 30020001, msg: 'Такой login уже зарегистрирован'});

            let arFields = {
                login: fields.login,
                email: fields.email,
                password: fields.password,
                gender: fields.gender,
                first_name: fields.first_name,
                code: hash
            }
            await this.AddNoReg(arFields);

            //выводим код для почты
            return hash

        } catch (err) {
            console.log(err)
            throw ({err: 7002000, msg: 'CUser Reg'})
        }
    }

    static async RegActivate ( code ) {
        try {
            let collection = DB.Client.collection('user_no_reg');
            let noRegUser = await collection.findOne({code: code})
            if (!noRegUser)
                throw ({err: 30030001, msg: 'Заявки не существует'});

            //let noRegUser = await DB.Init.Query(`SELECT * FROM ${DB.Init.TablePrefix}user_no_reg WHERE code=$1`, [code])
            //if (!noRegUser.length)
                //throw ({err: 30030001, msg: 'Заявки не существует'});

            //упрощаем
            //noRegUser = noRegUser[0]

            let arUsers = await this.GetByEmail(noRegUser.email);

            if (arUsers)
                throw ({err: 30020001, msg: 'Такой email уже зарегистрирован'});

            arUsers = await this.GetByLogin(noRegUser.login);
            if (arUsers)
                throw ({err: 30020001, msg: 'Такой login уже зарегистрирован'});

            //список
            let arFields = {
                login: noRegUser.login,
                email: noRegUser.email,
                password: noRegUser.password,
                first_name: noRegUser.first_name,
                gender: noRegUser.gender
            }
            let items = await this.Add ( arFields );

            //здесь создание пользователя
            return true;

        } catch (err) {
            throw ({...{err: 30030000, msg: 'Создание запроса на регистрацию нового пользователя'}, ...err});
        }
    }

    //поиск по пользователям
    static async Search ( fields ) {
        try {
            let collection = DB.Client.collection('user');

            let arAggregate = []

            if (fields.q) arAggregate.push(
                {
                    $match:
                        {
                            $text: {
                                $search: fields.q
                            }
                        },
                }
            )

            arAggregate.push(
                {
                    $lookup:
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
                },
            )

            let result = await collection.aggregate(arAggregate).limit(fields.count).skip(fields.offset).toArray()
            return result
        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CUser Search'})
        }
    }

    //количество / поиск по пользователям
    static async SearchCount ( fields ) {
        try {
            let collection = DB.Client.collection('user');

            let arSearch = {}
            if (fields.q) arSearch = {$text: {$search: fields.q}}

            let result = await collection.count(arSearch)
            return result
        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CUser SearchCount'})
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
            throw ({err: 8001000, msg: 'CVideo Count'})
        }
    }*/

    //пользователи
    static async GetByField ( items, fieldName ) {
        try {
            //нет массива для обработки
            if ((!items) || (!items.length))
                return []

            let arUsersId = []

            /* выгрузка индентификаторов из объектов / пользователей */
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
            throw ({err: 6005000, msg: 'CUser GetByField'})
        }
    }
/*
static async reset (value) {
    try {
        //создаем hash /нужно поменять на дату
        let hash = new Date().toString();
        hash = crypto.createHash('md5').update(hash).digest("hex");

        let arUsers = await modelsProfile.getUserByEmail(value.email);
        console.log(arUsers)
        if (!arUsers.length)
            throw ({err: 30040001, msg: 'Такой email не зарегистрирован'});

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
        throw ({...{err: 30040000, msg: 'Отправка кода на e-mail'}, ...err});
    }
}
static async resetActivate (value) {
    try {
        let code = await modelsProfile.getByCode(1, value.code);
        if (!code.length)
            throw ({err: 30050001, msg: 'Такого кода не существует, попробуйте востановить пароль еще раз'});

        //создание хеш пароля
        const saltRounds = 10;
        let passwordSalt = await bcrypt.genSalt(saltRounds);
        value.password = await bcrypt.hash(value.password, passwordSalt);

        await modelsProfile.setPassword(code[0].user_id, value.password);

        return true;

    } catch (err) {
        throw ({...{err: 30050000, msg: 'Отправка кода на e-mail'}, ...err});
    }*/
}
