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

            let sql = `SELECT *
FROM ${DB.Init.TablePrefix}message
WHERE ((from_id=$1 AND to_id=$2) OR (from_id=$2 AND to_id=$1)) AND delete_from IS NOT true ORDER BY id DESC`
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
                    messages.in = false
                } else {
                    messages.user_id = Number (result[i].from_id)
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

            result = await Promise.all(arMessages.map(async (item, i) => {

                /* загрузка инфы о файле */
                if (item.file_ids) {
                    item.file_ids = await CFile.GetById(item.file_ids);

                    if (item.file_ids.file_id)
                        item.file_ids.file_id = await CFile.GetById(item.file_ids.file_id);
                }

                return item;
            }));

            return result
        } catch (err) {
            console.log(err)
            throw ({err: 5002000, msg: 'CMessage GetByUserId'})
        }
    }

    static async CountGetByUserId ( fields ) {
        try {
            let count = `SELECT COUNT(*)
FROM ${DB.Init.TablePrefix}message
WHERE (from_id=$1 AND to_id=$2) OR (from_id=$2 AND to_id=$1) AND delete_from IS NOT true`

            count = await DB.Init.Query(count, [fields.from_id, fields.to_id])

            return Number (count[0].count)
        } catch (err) {
            console.log(err)
            throw ({err: 5003000, msg: 'CMessage CountGetByUserId'})
        }
    }

    static async Get ( fields ) {
        try {

            let sql = `
            SELECT *
            FROM
            sf_message
            WHERE (from_id, to_id, create_date) in

            (SELECT from_id, to_id, max(create_date)
            FROM sf_message
            WHERE (from_id=$1 OR to_id=$1) AND delete_from IS NOT true 
            GROUP BY to_id, from_id) ORDER BY create_date DESC`

            sql += ` LIMIT $2 OFFSET $3 `

            //запрос
            let result = await DB.Init.Query(sql, [fields.from_id, fields.count, fields.offset])

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
                    messages.in = false
                } else {
                    messages.user_id = Number (result[i].from_id)
                    messages.in = true
                }

                //удаление не актуальных полей
                delete result[i].id
                delete result[i].from_id
                delete result[i].to_id
                delete result[i].delete_from
                delete result[i].delete_to
                delete result[i].important

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

    static async Count ( fields ) {
        try {
            //let count = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}message WHERE from_id=$1 OR to_id=$1 GROUP BY from_id`

            let count = `SELECT COUNT(*)
            FROM sf_message
            WHERE (from_id=$1 OR to_id=$1) AND delete_from IS NOT true
            GROUP BY to_id, from_id`

            count = await DB.Init.Query(count, [fields.from_id])

            return count.length;

            //let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}message WHERE (from_id=$1 AND to_id=$2) OR (from_id=$2 AND to_id=$1)`

        } catch (err) {
            console.log(err)
            throw ({err: 5003000, msg: 'CMessage Count'})
        }
    }

    //пользователи
    static async GetUsers ( items, all ) {
        try {

            //нет массива для обработки
            if ((!items) || (!items.length))
                return []

            let arUsersIdAll = [];

            /* выгрузка индентификаторов из объектов / пользователей */
            let arUsersId = items.map((item, i) => {
                arUsersIdAll.push(item.from_id)
                arUsersIdAll.push(item.to_id)
                return item.user_id
            })

            let arUsers = [];
            //удаление одинаковых id из массива
            if (all) {
                arUsers = Array.from(new Set(arUsersIdAll))
            } else {
                arUsers = Array.from(new Set(arUsersId))
            }


            let sql = `SELECT id,login,first_name,create_date,birthday,photo FROM ${DB.Init.TablePrefix}user WHERE id in (${arUsers})`
            arUsers = await DB.Init.Query(sql)

            arUsers = await Promise.all(arUsers.map(async (user, i)=>{
                if (user.photo) {
                    user.photo = await CFile.GetById([user.photo]);
                    user.photo = user.photo[0]
                }
                return user
            }))

            return arUsers

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CMessage GetUsers'})
        }
    }

    //прочитать все сообщения с пользователем
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

    //прочитать выбранные сообщения
    static async MarkAsRead( fields ) {
        try {
            let sql = `UPDATE ${DB.Init.TablePrefix}message SET read = true WHERE from_id=${fields.from_id} AND id in (${fields.message_ids})`
            let result = await DB.Init.Query(sql)

        } catch (err) {
            console.log(err)
            throw ({err: 5005000, msg: 'CMessage Add'})
        }
    }

    //удалить все сообщения с пользователем
    static async DeleteAll( fields ) {
        try {
            let sql = `UPDATE ${DB.Init.TablePrefix}message SET delete_from = true WHERE (from_id=${fields.from_id} AND to_id=${fields.to_id}) OR (to_id=${fields.from_id} AND from_id=${fields.to_id})`
            let result = await DB.Init.Query(sql)

        } catch (err) {
            console.log(err)
            throw ({err: 5005000, msg: 'CMessage DeleteAll'})
        }
    }

    //удалить выбранные сообщения
    static async Delete( fields ) {
        try {
            fields.ids = fields.ids.join(',');
            let sql = `UPDATE ${DB.Init.TablePrefix}message SET delete_from = true WHERE (from_id=${fields.from_id} OR to_id=${fields.from_id}) AND id in (${fields.ids})`
            let result = await DB.Init.Query(sql)

        } catch (err) {
            console.log(err)
            throw ({err: 5005000, msg: 'CMessage Add'})
        }
    }
}