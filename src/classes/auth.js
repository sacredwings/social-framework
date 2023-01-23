import bcrypt from "bcrypt"
import * as crypto from "crypto"
import { DB } from "./db"
import { CUser } from './user'
import axios from "axios"

export class CAuth {

    static async Login ( fields ) {
        try {
            //поиск пользователя по логину
            let user = await CUser.GetByLogin(fields.login);
            if (!user)
                throw ({code: 1001001, msg: 'Неверный логин'});

            //сравнение паролей
            let match = await bcrypt.compare(fields.password, user.password);
            if (!match)
                throw ({code: 1001002, msg: 'Неверный пароль'});

            let token = await this.AddToken(user._id, fields.ip, fields.browser);
            if (!token)
                throw ({code: 1001003, msg: 'Токен не создан'});

            return {tid: token._id, token: token.token, _id: user._id, login: user.login}

        } catch (err) {
            throw ({...{code: 1001000, msg: 'CAuth Login'}, ...err});
        }
    }

    static async GetById ( ids ) {
        try {
            ids = new DB().arObjectID(ids)

            let collection = DB.Client.collection('auth');
            let result = await collection.find({_id: { $in: ids}}).toArray()

            if (result)
                return result

            return false
        } catch (err) {
            console.log(err)
            throw ({code: 1003000, msg: 'CAuth GetById'})
        }
    }

    static async AddToken ( userId, ip, browser ) {
        try {
            let collection = DB.Client.collection('auth')

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

            let result = await collection.insertOne(arFields)

            return arFields
            //console.log(result)
            //console.log(arFields)

            //запись
            //let result = await DB.Init.Insert(`${DB.Init.TablePrefix}token`, arFields, `id, token`)
            //return result[0]

        } catch (err) {
            console.log(err)
            throw ({code: 1004000, msg: 'CAuth AddToken'})
        }
    }

    static async Auth ( fields ) {
        try {
            //существование id и токена авторизации
            if ((!fields) || ((!fields.tid) || (!fields.token)))
                return null

            //поиск ключа
            let user = await this.GetById([fields.tid])
            if (!user.length)
                return null

            user = user[0] //из массива берем первый

            if (fields.token !== user.token)
                return null

            return user.user_id
        } catch (err) {
            console.log(err)
            throw ({code: 1004000, msg: 'CAuth Access'})
        }
    }

    static async AuthVK ({client_id, client_secret, redirect_uri, code, browser}) {
        try {
            let profile;
            let url = `https://oauth.vk.com/access_token?client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&code=${code}`;

            console.log(url)
            let infoVk;
            try {
                infoVk = await axios({
                    method: 'get',
                    url: url,
                    headers: {'User-Agent': browser}
                });
            } catch (err) {
                throw ({...{err: 30080001, msg: 'VK возвращает ошибку'}});
            }

            console.log(infoVk);

            if ((!infoVk.data) || (!infoVk.data.user_id) || (!infoVk.data.email) || (!infoVk.data.access_token))
                throw ({err: 30080002, msg: 'Не полный ответ от VK'});

            //почта ВК в нижний регистр
            infoVk.data.email = infoVk.data.email.toLowerCase();

            //поиск профиля в боте
            let arProfile = await CUser.GetUserByVk({
                vk_id: infoVk.data.user_id,
                email: infoVk.data.email
            }, );

            //профиля нет /нужно создать
            if (!arProfile) {
                console.log('профиля нет /нужно создать');

                //генерация пароля
                let password = getRandomInt(10000000, 99999999);
                const saltRounds = 10;
                let passwordSalt = await bcrypt.genSalt(saltRounds);
                password = await bcrypt.hash(`${password}`, passwordSalt);

                let vkUser;
                try {
                    let url = `https://api.vk.com/method/users.get?user_id=${infoVk.data.user_id}`;
                    url += `&access_token=${infoVk.data.access_token}&v=5.131`;
                    vkUser = await axios({
                        method: 'get',
                        url: url,
                        headers: {'User-Agent': browser}
                    });
                } catch (err) {
                    throw ({err: 30080004, msg: 'ВК: ошибка в методе users.get'});
                }

                if ((!vkUser.data.response.length) || (!vkUser.data.response[0].first_name) && (!vkUser.data.response[0].last_name))
                    throw ({err: 30080005, msg: 'ВК: ошибка в методе users.get'});

                //profile = await modelsProfile.addUser(infoVk.data.email, password, vkUser.data.response[0].first_name, vkUser.data.response[0].last_name, null, value.ref, infoVk.data.user_id);

                //список
                let arFields = {
                    email: infoVk.data.email,
                    login: infoVk.data.user_id,
                    password: password,
                    first_name: vkUser.data.response[0].first_name,
                    last_name: vkUser.data.response[0].last_name
                }
                profile = await CUser.Add ( arFields )
            }

            //профиль не привязан /нужно привязать по почте
            if ((arProfile) && (!arProfile.vk_id) && (arProfile.email)) {
                console.log('профиль есть /нужно привязать id')

                await CUser.Edit(arProfile._id, {vk_id: infoVk.data.user_id})
            }

            if (!profile) profile = arProfile

            //профиль привязан /нужна авторизация
            /*if ((arProfile) && (arProfile.vk_id)) {
                console.log('профиль есть /авторизирую');

            }*/

            /*
            let token = await modelsAuth.authorization(profile.id, value.ip, value.browser);
            if (!token)
                throw ({err: 30080006, msg: 'Токен не создан'});

            return {...token, ...{login: infoVk.data.email}};*/

            return profile

        } catch (err) {
            throw ({...{err: 30080000, msg: 'Создание запроса на регистрацию нового пользователя'}, ...err});
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}