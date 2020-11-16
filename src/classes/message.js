import {DB} from "./db";
import CFile from "./file";


export default class {

    //добавить новое видео
    static async Add( fields ) {
        try {

            let result = await DB.Init.Insert(`messages`, fields, `ID`)
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CMessage Add'})
        }
    }

    //загрузка
    static async GetByUserId ( fields ) {
        try {

            let sql = `SELECT messages.*,

from_user.login as from_user_login,
from_user.personal_photo as from_user_personal_photo,
from_user.personal_gender as from_user_personal_gender,
from_user.name as from_user_name,

to_user.login as to_user_login,
to_user.personal_photo as to_user_personal_photo,
to_user.personal_gender as to_user_personal_gender,
to_user.name as to_user_name

FROM messages 
LEFT JOIN users AS from_user ON messages.from_user_id=from_user.id 
LEFT JOIN users AS to_user ON messages.to_user_id=to_user.id 
WHERE (from_user_id=$1 AND to_user_id=$2) OR (from_user_id=$2 AND to_user_id=$1)`
            sql += ` LIMIT $3 OFFSET $4 `

            let result = await DB.Init.Query(sql, [fields.owner_id, fields.user_id, fields.count, fields.offset])

            let arMessages = [] //массив сообщений уникальных пользователей

            //уникальность массива
            for (let i=0; i < result.length; i++) {

                //добавление новых полей к массиву
                let messages = {}

                //добавление новых полей
                if (Number (result[i].from_user_id) === fields.owner_id) {
                    messages.user_id = Number (result[i].to_user_id)
                    messages.user_name = result[i].to_user_name
                    messages.in = false
                } else {
                    messages.user_id = Number (result[i].from_user_id)
                    messages.user_name = result[i].from_user_name
                    messages.in = true
                }

                //удаление не актуальных полей
                delete result[i].id
                delete result[i].from_user_id
                delete result[i].to_user_id

                arMessages.push({...result[i], ...messages})

            }

            return arMessages
        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CMessage GetUserId'})
        }
    }

    static async Get ( fields ) {
        try {

            //ИСХОДЯЩИЕ
            let sql = `SELECT messages.*,

from_user.login as from_user_login,
from_user.personal_photo as from_user_personal_photo,
from_user.personal_gender as from_user_personal_gender,
from_user.name as from_user_name,

to_user.login as to_user_login,
to_user.personal_photo as to_user_personal_photo,
to_user.personal_gender as to_user_personal_gender,
to_user.name as to_user_name

FROM messages 
LEFT JOIN users AS from_user ON messages.from_user_id=from_user.id 
LEFT JOIN users AS to_user ON messages.to_user_id=to_user.id 

WHERE messages.from_user_id=$1 AND (messages.to_user_id, messages.date_create) in (
SELECT to_user_id, max(date_create)
FROM messages 
WHERE from_user_id=$1
GROUP BY to_user_id)`
            sql += ` LIMIT $2 OFFSET $3 `

            let outMes = await DB.Init.Query(sql, [fields.owner_id, fields.count, fields.offset])

            //ВХОДЯЩИЕ
            sql = `SELECT messages.*,

from_user.login as from_user_login,
from_user.personal_photo as from_user_personal_photo,
from_user.personal_gender as from_user_personal_gender,
from_user.name as from_user_name,

to_user.login as to_user_login,
to_user.personal_photo as to_user_personal_photo,
to_user.personal_gender as to_user_personal_gender,
to_user.name as to_user_name

FROM messages 
LEFT JOIN users AS from_user ON messages.from_user_id=from_user.id 
LEFT JOIN users AS to_user ON messages.to_user_id=to_user.id 

WHERE messages.to_user_id=$1 AND (messages.from_user_id, messages.date_create) in (
SELECT from_user_id, max(date_create)
FROM messages 
WHERE to_user_id=$1
GROUP BY from_user_id)`
            sql += ` LIMIT $2 OFFSET $3 `

            let inMes = await DB.Init.Query(sql, [fields.owner_id, fields.count, fields.offset])

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
                if (Number (result[i].from_user_id) === fields.owner_id) {
                    messages.user_id = Number (result[i].to_user_id)
                    messages.user_name = result[i].to_user_name
                    messages.in = false
                } else {
                    messages.user_id = Number (result[i].from_user_id)
                    messages.user_name = result[i].from_user_name
                    messages.in = true
                }

                //удаление не актуальных полей
                delete result[i].id
                delete result[i].from_user_id
                delete result[i].to_user_id

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
            throw ({err: 2001000, msg: 'CMessage Get'})
        }
    }
}