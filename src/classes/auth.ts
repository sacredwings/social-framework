// @ts-nocheck
import bcrypt from "bcryptjs"
import * as crypto from "crypto"
import { DB } from "./db"
import { CUser } from './user'
import { CFile } from './file'
import axios from "axios"
import { Store } from "../store"

export class CAuth {

    //авторизация по полю и паролю
    //* password
    //* ip
    //* device
    static async LoginByField ({password, ip, device, ...value}) {
        try {
            //поиск пользователя
            let user = await CUser.GetByField(value)
            if (!user)
                throw ({code: 1001001, msg: 'Пользователь не найден'})

            if (!user.password)
                throw ({code: 1001001, msg: 'Пользователь не доступен для входа'})

            //сравнение паролей
            let match = await bcrypt.compare(password, user.password)
            if (!match)
                throw ({code: 1001002, msg: 'Неверный пароль'})

            //новый токен
            let token = await this.TokenAdd({
                user_id: user._id,
                ip: ip,
                device: device
            })
            if (!token)
                throw ({code: 1001003, msg: 'Токен не создан'})

            return {tid: token._id, tkey: token.key, _id: user._id, login: user.login}

        } catch (err) {
            console.log(err)
            throw ({...{code: 1001000, msg: 'CAuth Login'}, ...err})
        }
    }

    //Добавление токена
    //* password
    //* ip
    //* device
    static async TokenAdd ({user_id, ip, device}) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection('auth')

            //создаем hash
            let hash = new Date().toString() //ключ
            hash = crypto.createHash('md5').update(hash).digest("hex")

            //подготовка полей
            let arFields = {
                user_id: user_id,
                key: hash,

                ip: (ip) ? ip : null,
                device: (device) ? device : null,
            };
            await collection.insertOne(arFields)
            return arFields
        } catch (err) {
            console.log(err)
            throw ({code: 1004000, msg: 'CAuth TokenAdd'})
        }
    }

    //Проверяет авторизован ли посетитель
    //* tid
    //* tkey
    static async TokenGetByIdKey ({tid, tkey}) {
        try {
            const mongoClient = Store.GetMongoClient()
            tid = new DB().ObjectID(tid)

            //поиск ключа
            let collection = mongoClient.collection('auth');
            let token = await collection.findOne({_id: tid, key: tkey})

            if (!token) return false
            return token.user_id
        } catch (err) {
            console.log(err)
            throw ({code: 1004000, msg: 'CAuth IsAuthorized'})
        }
    }

    //Авторизация ВК
    static async AuthVK ({user_id, client_id, client_secret, redirect_uri, code, device, bucket_name}) {
        try {
            //АВТОРИЗОВАН - поиск пользователя по ID / нужны все поля для дальнейших проверок
            let arUser = false
            if (user_id) {
                arUser = await CUser.GetById([user_id])
                arUser = arUser[0]
            }

            //авторизован и есть id vk - ошибка
            if ((arUser) && (arUser.vk_id))
                throw ({code: 30080002, msg: 'ВК уже привязан'})

            //основной запрос в вк
            let vkInfo = null
            try {
                let urlParam = {
                    client_id: client_id,
                    client_secret: client_secret,
                    redirect_uri: redirect_uri,
                    code: code
                }
                let url = `https://oauth.vk.com/access_token?${new URLSearchParams(urlParam).toString()}`
                console.log(url)
                vkInfo = await axios({
                    method: 'get',
                    url: url,
                    headers: {'User-Agent': device}
                })
                vkInfo = vkInfo.data
            } catch (err) {
                throw ({...{code: 30080001, msg: 'ВК: ошибка в oauth.vk.com'}});
            }
            console.log(vkInfo)

            //запрос информации о пользователе
            let vkUser;
            try {
                let urlParam = {
                    user_id: vkInfo.user_id,
                    fields: 'bdate,photo_max_orig,sex',
                    access_token: vkInfo.access_token,
                    v: '5.131'
                }
                let url = `https://api.vk.com/method/users.get?${new URLSearchParams(urlParam).toString()}`
                vkUser = await axios({
                    method: 'get',
                    url: url,
                    headers: {'User-Agent': device}
                });
                vkUser = vkUser.data.response[0]
            } catch (err) {
                throw ({code: 30080004, msg: 'ВК: ошибка в методе users.get'});
            }
            console.log(vkUser)

            let userAuth = false
            //Прежде чем, чтото делать, ищем пользователя с совпадениями
            let arSearchUsers = {
                id: false,
                email: false,
                phone: false
            }

            if (vkInfo.user_id)
                arSearchUsers.id = await CUser.GetByField({
                    vk_id: vkInfo.user_id
                })
            if (vkInfo.email)
                arSearchUsers.email = await CUser.GetByField({
                    email: vkInfo.email
                })
            if (vkInfo.phone_number)
                arSearchUsers.phone = await CUser.GetByField({
                    phone: vkInfo.phone_number
                })

            //авторизован
            if (arUser) {
                //если поля у пользователей не найдены - можно привязать к текущему
                if ((!arSearchUsers.id) && (!arSearchUsers.email) && (!arSearchUsers.phone)) {
                    let arFields = {
                        vk_id: vkInfo.user_id
                    }
                    if (!arUser.email) arFields.email = vkInfo.email
                    if (!arUser.phone) arFields.phone = vkInfo.phone_number
                    await CUser.Edit(arUser._id, arFields)
                    userAuth = arUser
                }

                if ((arSearchUsers.id) || (arSearchUsers.email) || (arSearchUsers.phone)) {
                    throw ({code: 30080004, msg: 'ВК уже был привязан'})
                }

            }

            //не авторизован
            if (!arUser) {
                //если поля у пользователей не найдены - создаем пользователя
                if ((!arSearchUsers.id) && (!arSearchUsers.email) && (!arSearchUsers.phone)) {
                    let arFields = {
                        login: `vk_${vkInfo.user_id}`,
                        vk_id: vkInfo.user_id,
                    }
                    if (vkInfo.email) arFields.email = vkInfo.email
                    if (vkInfo.phone_number) arFields.phone = vkInfo.phone_number

                    if (vkUser.first_name) arFields.first_name = vkUser.first_name
                    if (vkUser.last_name) arFields.last_name = vkUser.last_name

                    userAuth = await CUser.Add(arFields)
                }
                if ((arSearchUsers.email) || (arSearchUsers.phone)) {
                    let searchUser = false
                    if (arSearchUsers.phone) searchUser = arSearchUsers.phone
                    if (arSearchUsers.email) searchUser = arSearchUsers.email

                    let arFields = {
                        vk_id: vkInfo.user_id
                    }
                    if (!searchUser.email) arFields.email = vkInfo.email
                    if ((!searchUser.phone) && (vkInfo.phone_number)) arFields.phone = vkInfo.phone_number
                    await CUser.Edit(searchUser._id, arFields)
                    userAuth = searchUser
                }
                if (arSearchUsers.id) userAuth = arSearchUsers.id
            }

            //авторизация
            let token = await CAuth.TokenAdd({
                user_id: userAuth._id
            })

            return {tid: token._id, tkey: token.key, _id: userAuth._id, login: userAuth.login}

        } catch (err) {
            throw ({...{err: 30080000, msg: 'Создание запроса на регистрацию нового пользователя'}, ...err});
        }
    }

    static async Telegram ({user_id, telegram_token, telegram, bucket_name}) {
        try {
            const mongoClient = Store.GetMongoClient()
            let collectionUser = mongoClient.collection('user')

            //проверка хеша авторизации
            if (!await checkTgAuth(telegram_token, telegram)) throw ({code: 999, msg: 'Не верная авторизация'})

            //АВТОРИЗОВАН - поиск пользователя по ID / нужны все поля для дальнейших проверок
            let arUser = false
            if (user_id) {
                arUser = await CUser.GetById([user_id])
                arUser = arUser[0]
            }

            //поиск среди пользователей
            let arSearchUser = await CUser.GetByField({
                tg_id: telegram.id
            })

            let userAuth = false
            //авторизован
            if (arUser) {
                //если поля у пользователей не найдены - можно привязать к текущему
                if (!arSearchUser) {
                    let arFields = {
                        tg_id: telegram.id,
                    }

                    //у пользователя фото нет, а в телеграме есть
                    if ((!arUser.photo_id) && (telegram.photo_url)) {
                        let rsFile = await CFile.Upload({
                            module: 'user',
                            file_url: telegram.photo_url,
                            from_id: user_id,
                            bucket_name: bucket_name
                        })
                        arFields.photo_id = rsFile._id
                    }

                    await CUser.Edit(arUser._id, arFields)
                    userAuth = arUser
                } else {
                    throw ({code: 30080004, msg: 'TG уже привязан'})
                }
            }

            //не авторизован
            if (!arUser) {
                //если поля у пользователей не найдены - создаем пользователя
                if (!arSearchUser) {
                    let arFields = {
                        login: 'tg_' + telegram.id,
                        tg_id: telegram.id,
                        first_name: telegram.first_name,
                    }

                    userAuth = await CUser.Add(arFields)

                    //загрузка фото если оно есть
                    if (telegram.photo_url) {
                        let rsFile = await CFile.Upload({
                            module: 'user',
                            file_url: telegram.photo_url,
                            from_id: userAuth._id,
                            bucket_name: bucket_name
                        })

                        await CUser.Edit(userAuth._id, {photo_id: rsFile._id})
                    }
                }

                if (arSearchUser) userAuth = arSearchUser
            }

            //авторизация
            let token = await CAuth.TokenAdd({
                user_id: userAuth._id
            })

            return {tid: token._id, tkey: token.key, _id: userAuth._id, login: userAuth.login}

        } catch (err) {
            throw ({...{err: 30080000, msg: 'Создание запроса на регистрацию нового пользователя'}, ...err});
        }
    }
}

/*
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}*/

async function checkTgAuth(token, { hash, ...userData }) {
    let newUserData = {}
    for (const [key, value] of Object.entries(userData)) {
        if (value) newUserData[key] = value
    }

    const secretKey = crypto.createHash('sha256')
        .update(token)
        .digest();
    const dataCheckString = Object.keys(newUserData)
        .sort()
        .map(key => (`${key}=${newUserData[key]}`))
        .join('\n');
    const hmac = crypto.createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    return hmac === hash;
}
