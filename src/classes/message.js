import {DB} from "./db";
import CFile from "./file";


export default class {

    //добавить новое видео
    static async Add( fields ) {
        try {
            let result = await DB.Init.Insert(`${DB.Init.TablePrefix}message`, fields, `ID`)
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({err: 5001000, msg: 'CMessage Add'})
        }
    }

    //загрузка
    static async GetByUserId ( fields ) {
        try {

            let sql = `SELECT ${DB.Init.TablePrefix}message.*,

from_user.login as from_user_login,
from_user.photo as from_user_photo,
from_user.gender as from_user_gender,
from_user.first_name as from_user_first_name,

to_user.login as to_user_login,
to_user.photo as to_user_photo,
to_user.gender as to_user_gender,
to_user.first_name as to_user_first_name

FROM ${DB.Init.TablePrefix}message
LEFT JOIN ${DB.Init.TablePrefix}user AS from_user ON ${DB.Init.TablePrefix}message.from_id=from_user.id 
LEFT JOIN ${DB.Init.TablePrefix}user AS to_user ON ${DB.Init.TablePrefix}message.to_id=to_user.id 
WHERE (from_id=$1 AND to_id=$2) OR (from_id=$2 AND to_id=$1)`
            sql += ` LIMIT $3 OFFSET $4 `

            let result = await DB.Init.Query(sql, [fields.from_id, fields.to_id, fields.count, fields.offset])

            let arMessages = [] //массив сообщений уникальных пользователей

            //уникальность массива
            for (let i=0; i < result.length; i++) {

                //добавление новых полей к массиву
                let messages = {}

                //добавление новых полей
                if (Number (result[i].from_id) === fields.from_id) {
                    messages.user_id = Number (result[i].to_id)
                    messages.user_first_name = result[i].to_user_first_name
                    messages.in = false
                } else {
                    messages.user_id = Number (result[i].from_id)
                    messages.user_first_name = result[i].from_user_first_name
                    messages.in = true
                }

                messages.from_id = Number(result[i].from_id)
                messages.to_id = Number(result[i].to_id)

                //удаление не актуальных полей
                //delete result[i].id
                //delete result[i].from_id
                //delete result[i].to_id

                arMessages.push({...result[i], ...messages})

            }

            return arMessages
        } catch (err) {
            console.log(err)
            throw ({err: 5002000, msg: 'CMessage GetUserId'})
        }
    }

    static async Get ( fields ) {
        try {

            //ИСХОДЯЩИЕ
            let sql = `SELECT ${DB.Init.TablePrefix}message.*,

from_user.login as from_user_login,
from_user.photo as from_user_photo,
from_user.gender as from_user_gender,
from_user.first_name as from_user_first_name,

to_user.login as to_user_login,
to_user.photo as to_user_photo,
to_user.gender as to_user_gender,
to_user.first_name as to_user_first_name

FROM ${DB.Init.TablePrefix}message
LEFT JOIN ${DB.Init.TablePrefix}user AS from_user ON ${DB.Init.TablePrefix}message.from_id=from_user.id 
LEFT JOIN ${DB.Init.TablePrefix}user AS to_user ON ${DB.Init.TablePrefix}message.to_id=to_user.id 

WHERE ${DB.Init.TablePrefix}message.from_id=$1 AND (${DB.Init.TablePrefix}message.to_id, ${DB.Init.TablePrefix}message.create_date) in (
SELECT to_id, max(create_date)
FROM ${DB.Init.TablePrefix}message 
WHERE from_id=$1
GROUP BY to_id)`
            sql += ` LIMIT $2 OFFSET $3 `

            let outMes = await DB.Init.Query(sql, [fields.from_id, fields.count, fields.offset])

            //ВХОДЯЩИЕ
            sql = `SELECT ${DB.Init.TablePrefix}message.*,

from_user.login as from_user_login,
from_user.photo as from_user_photo,
from_user.gender as from_user_gender,
from_user.first_name as from_user_first_name,

to_user.login as to_user_login,
to_user.photo as to_user_photo,
to_user.gender as to_user_gender,
to_user.first_name as to_user_first_name

FROM ${DB.Init.TablePrefix}message
LEFT JOIN ${DB.Init.TablePrefix}user AS from_user ON ${DB.Init.TablePrefix}message.from_id=from_user.id 
LEFT JOIN ${DB.Init.TablePrefix}user AS to_user ON ${DB.Init.TablePrefix}message.to_id=to_user.id 

WHERE ${DB.Init.TablePrefix}message.to_id=$1 AND (${DB.Init.TablePrefix}message.from_id, ${DB.Init.TablePrefix}message.create_date) in (
SELECT from_id, max(create_date)
FROM ${DB.Init.TablePrefix}message 
WHERE to_id=$1
GROUP BY from_id)`
            sql += ` LIMIT $2 OFFSET $3 `

            let inMes = await DB.Init.Query(sql, [fields.from_id, fields.count, fields.offset])

            //объединение входящих и исходящих сообщений
            let result = outMes.concat(inMes);

            //ОБЪЕДИНЕНИЕ ВХОДЯЩИХ и ИСХОДЯЩИХ сообщений
            let arMessages = [] //массив сообщений уникальных пользователей
            let CheckContinue = false; //выйти из цикла до сохранения элемента массива

            //уникальность массива
            for (let i=0; i < result.length; i++) {
                CheckContinue = false; //сброс чека / выход из цикла

                //добавление новых полей к массиву
                let messages = {}

                //добавление новых полей
                if (Number (result[i].from_id) === fields.from_id) {
                    messages.user_id = Number (result[i].to_id)
                    messages.user_first_name = result[i].to_user_first_name
                    messages.user_photo = result[i].to_user_photo
                    messages.user_gender = result[i].to_user_gender
                    messages.in = false
                } else {
                    messages.user_id = Number (result[i].from_id)
                    messages.user_first_name = result[i].from_user_first_name
                    messages.user_photo = result[i].from_user_photo
                    messages.user_gender = result[i].from_user_gender
                    messages.in = true
                }

                //удаление не актуальных полей
                delete result[i].id
                delete result[i].from_id
                delete result[i].from_user_login
                delete result[i].from_user_first_name
                delete result[i].from_user_photo
                delete result[i].from_user_gender

                delete result[i].to_id
                delete result[i].to_user_login
                delete result[i].to_user_first_name
                delete result[i].to_user_photo
                delete result[i].to_user_gender

                //проходим по массиву еще раз и ищем такой же
                for (let j=0; j < arMessages.length; j++) {
                    if (messages.user_id === arMessages[j].user_id) {
                        CheckContinue = true
                        break
                    }
                }

                //выходим на следующий круг цикла
                if (CheckContinue)
                    continue

                arMessages.push({...result[i], ...messages})

            }

            return arMessages

        } catch (err) {
            console.log(err)
            throw ({err: 5003000, msg: 'CMessage Get'})
        }
    }

    //добавить новое видео
    static async MarkAsReadAll( fields ) {
        try {
            let sql = `UPDATE ${DB.Init.TablePrefix}message SET read = true WHERE from_id=${fields.from_id} AND to_id=${fields.to_id} AND id < ${fields.start_message_id}`
            console.log(sql)
            let result = await DB.Init.Query(sql)

        } catch (err) {
            console.log(err)
            throw ({err: 5004000, msg: 'CMessage MarkAsReadAll'})
        }
    }

    //добавить новое видео
    static async MarkAsRead( fields ) {
        try {
            let sql = `UPDATE ${DB.Init.TablePrefix}message SET read = true WHERE from_id=${fields.from_id} AND id in (${fields.message_ids})`
            let result = await DB.Init.Query(sql)

        } catch (err) {
            console.log(err)
            throw ({err: 5005000, msg: 'CMessage Add'})
        }
    }
}