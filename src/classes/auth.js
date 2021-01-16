import bcrypt from "bcrypt";
import crypto from "crypto";
import {DB} from "./db";
import CUser from './user'

export default class {

    static async Login ( fields ) {
        try {

            //поиск пользователя по логину
            let user = await CUser.GetByLogin(fields.login);
            if (!user)
                throw ({err: 1001001, msg: 'Неверный логин'});

            //сравнение паролей
            let match = await bcrypt.compare(fields.password, user.password);
            if (!match)
                throw ({err: 1001002, msg: 'Неверный пароль'});

            let token = await this.AddToken(user.id, fields.ip, fields.browser);
            if (!token)
                throw ({err: 1001003, msg: 'Токен не создан'});

            return {tid: token.id, token: token.token, id: user.id, login: user.login}

        } catch (err) {
            throw ({...{err: 1001000, msg: 'CAuth Login'}, ...err});
        }
    }

    static async GetById ( id ) {
        try {
            let result = await DB.Init.Query(`SELECT * FROM ${DB.Init.TablePrefix}token WHERE id=$1`, [id])
            if (result.length)
                return result[0]

            return false
        } catch (err) {
            console.log(err)
            throw ({err: 1003000, msg: 'CAuth GetById'})
        }
    }

    static async AddToken ( userId, ip, browser ) {
        try {

            //создаем hash /нужно поменять на дату
            let hash = new Date().toString()
            hash = crypto.createHash('md5').update(hash).digest("hex")

            //подготовка полей
            let arFields = {
                token: hash,
                user_id: userId,
                ip: ip,
                browser: browser
            };

            //запись
            let result = await DB.Init.Insert(`${DB.Init.TablePrefix}token`, arFields, `id, token`)
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({err: 1004000, msg: 'CAuth AddToken'})
        }
    }
}