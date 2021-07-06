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

            //запись
            let result = await DB.Init.Insert(`${DB.Init.TablePrefix}user_no_reg`, fields, `ID`)
            return result[0]
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

            //запись
            let result = await DB.Init.Insert(`${DB.Init.TablePrefix}user`, fields, `ID`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CUser AddUser'})
        }
    }

    //поиск по id
    static async GetById ( ids ) {
        try {
            ids = ids.join(',');
            let result = await DB.Init.Query(`SELECT * FROM ${DB.Init.TablePrefix}user WHERE id in (${ids})`)

            result = await Promise.all(result.map(async (item, i) => {
                /* загрузка инфы о файле */
                if (item.photo) {
                    item.photo = await CFile.GetById([item.photo]);
                    item.photo = item.photo[0]
                }

                return item;
            }));

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

            let result = await DB.Init.Query(`SELECT * FROM ${DB.Init.TablePrefix}user WHERE email=$1`, [email])
            if (!result.length) return false
            result = result[0]

            //удаление пароля
            //delete result.password

            /* загрузка инфы о файле */
            if (result.photo) {
                result.photo = await CFile.GetById([result.photo]);
                result.photo = result.photo[0]
            }

            return result

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

            let result = await DB.Init.Query(`SELECT * FROM ${DB.Init.TablePrefix}user WHERE login=$1`, [login])
            if (!result.length) return false
            result = result[0]

            //удаление пароля
            //delete result.password

            /* загрузка инфы о файле */
            if (result.photo) {
                result.photo = await CFile.GetById([result.photo]);
                result.photo = result.photo[0]
            }

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CUser GetByLogin'})
        }
    }

    static async Update ( id, fields ) {
        try {
            if (fields.password) {
                const salt = await bcrypt.genSalt();
                fields.password = await bcrypt.hash(fields.password, salt);
            }
            console.log(fields)

            let result = await DB.Init.Update (`${DB.Init.TablePrefix}user`, fields, {id: id},`id`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 7002000, msg: 'CUser Update'})
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
            let noRegUser = await DB.Init.Query(`SELECT * FROM ${DB.Init.TablePrefix}user_no_reg WHERE code=$1`, [code])
            if (!noRegUser.length)
                throw ({err: 30030001, msg: 'Заявки не существует'});

            //упрощаем
            noRegUser = noRegUser[0]

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
            let there = []

            if (fields.q)
                there.push(` to_tsvector(first_name) @@ websearch_to_tsquery('${fields.q.toLowerCase()}') `) //в нижний регистр

            //запрос
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}user `

            //объединеие параметров запроса
            if (there.length)
                sql += `WHERE ` + there.join(' AND ')

            sql += ` LIMIT $1 OFFSET $2`

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])
            console.log(sql)

            result = await Promise.all(result.map(async (item, i) => {
                /* загрузка инфы о файле */
                if (item.photo) {
                    item.photo = await CFile.GetById([item.photo]);
                    item.photo = item.photo[0]
                }

                return item;
            }));

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CUser Search'})
        }
    }

    //количество / поиск по пользователям
    static async SearchCount ( fields ) {
        try {
            let there = []

            if (fields.q)
                there.push(` to_tsvector(first_name) @@ websearch_to_tsquery('${fields.q.toLowerCase()}') `) //в нижний регистр

            //запрос
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}user `

            //объединеие параметров запроса
            if (there.length)
                sql += `WHERE ` + there.join(' AND ')

            console.log(sql)
            let result = await DB.Init.Query(sql)

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CUser SearchCount'})
        }
    }

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
