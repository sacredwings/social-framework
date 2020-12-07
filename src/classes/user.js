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
            let result = await DB.Init.Insert(`users_no_reg`, fields, `ID`)
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
            let result = await DB.Init.Insert(`users`, fields, `ID`)
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
            let result = await DB.Init.Query(`SELECT * FROM users WHERE id in (${ids})`)

            result = await Promise.all(result.map(async (item, i) => {
                /* загрузка инфы о файле */
                if (item.personal_photo) {
                    item.personal_photo = await CFile.GetById([item.personal_photo]);
                    item.personal_photo = item.personal_photo[0]
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

            let result = await DB.Init.Query(`SELECT * FROM users WHERE email=$1`, [email])

            result = await Promise.all(result.map(async (item, i) => {
                /* загрузка инфы о файле */
                if (item.personal_photo) {
                    item.personal_photo = await CFile.GetById([item.personal_photo]);
                    item.personal_photo = item.personal_photo[0]
                }

                return item;
            }));

            if (result.length) return result[0]
            return false

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

            let result = await DB.Init.Query(`SELECT * FROM users WHERE login=$1`, [login])

            result = await Promise.all(result.map(async (item, i) => {
                /* загрузка инфы о файле */
                if (item.personal_photo) {
                    item.personal_photo = await CFile.GetById([item.personal_photo]);
                    item.personal_photo = item.personal_photo[0]
                }

                return item;
            }));

            if (result.length) return result[0]
            return false

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

            let result = await DB.Init.Update (`users`, fields, {id: id},`id`)
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
                name: fields.name,
                code: hash
            }
            console.log(arFields)
            await this.AddNoReg(arFields);

        } catch (err) {
            console.log(err)
            throw ({err: 7002000, msg: 'CUser Reg'})
        }
    }

    static async RegActivate ( code ) {
        try {
            let noRegUser = await DB.Init.Query(`SELECT * FROM users_no_reg WHERE code=$1`, [code])
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
                name: noRegUser.name,
                personal_gender: noRegUser.gender
            }
            let items = await this.Add ( arFields );

            //здесь создание пользователя
            return true;

        } catch (err) {
            throw ({...{err: 30030000, msg: 'Создание запроса на регистрацию нового пользователя'}, ...err});
        }
    }

/*
static async reg (value) {
    try {
        //создаем код из hash
        let hash = new Date().toString();
        hash = crypto.createHash('md5').update(hash).digest("hex");

        //создание хеш пароля
        const saltRounds = 10;
        let passwordSalt = await bcrypt.genSalt(saltRounds);
        value.password = await bcrypt.hash(value.password, passwordSalt);

        //почту в нижний регистр
        value.email = value.email.toLowerCase();

        let arUsers = await modelsProfile.getUserByEmail(value.email);
        if (arUsers.length)
            throw ({err: 30020001, msg: 'Такой email уже зарегистрирован'});

        let arAccounts = await modelsProfile.reg(value.email, value.password, value.first_name, hash);

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
        return transporter.sendMail({
            from: accountMail.auth.user,
            to: value.email,
            subject: 'ZayeBot - Код активации нового пользователя',
            html: `Для активации пользователя, перейдите по ссылке - <a href="https://zayebot.ru/reg-active/${hash}">https://zayebot.ru/reg-active/${hash}</a>`
        });

        return arAccounts;

    } catch (err) {
        throw ({...{err: 30020000, msg: 'Создание запроса на регистрацию нового пользователя'}, ...err});
    }
}

static async regActivate (value) {
    try {
        let arUsersCode = await modelsProfile.getUserNoActiveByCode(value.code);
        if (!arUsersCode.length)
            throw ({err: 30030001, msg: 'Заявки не существует'});

        let arUsers = await modelsProfile.getUserByEmailOrPhone(arUsersCode[0].email, value.phone);
        if (arUsers.length)
            throw ({err: 30030002, msg: 'Пользователь уже активирован'});

        let profile = await modelsProfile.addUser(arUsersCode[0].email, arUsersCode[0].password, arUsersCode[0].first_name, null, value.phone, value.ref);

        // создать кошелек
        await modelsPay.addWallet(profile.id);

        //здесь создание пользователя
        return true;

    } catch (err) {
        throw ({...{err: 30030000, msg: 'Создание запроса на регистрацию нового пользователя'}, ...err});
    }
}
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
