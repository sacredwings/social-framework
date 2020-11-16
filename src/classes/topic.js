import {DB} from "./db";
import CFile from "./file";

export default class {

    //новая тема для обсуждений
    static async Add ( fields ) {
        try {
            console.log('fields')
            console.log(fields)
            if (fields.files.length)
                fields.files = JSON.stringify(fields.files);
            else
                fields.files = null

            console.log(fields)

            //запись
            let result = await DB.Init.Insert(`topic`, fields, `ID`)
            return result[0]

            //let result = await CFile.SaveFile(arFields, `${global.__basedir}/`)

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CTopic Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = ids.join(',');
            let arTopic = await DB.Init.Query(`SELECT * FROM topic WHERE id in (${ids})`)

            arTopic = await Promise.all(arTopic.map(async (topic, i) => {

                if (topic.files) {
                    topic.files = await CFile.GetById(topic.files);
                }

                return topic;
            }));

            return arTopic

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CTopic GetById'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {

            let sql = `SELECT * FROM topic WHERE ${(fields.user_id) ? `user_id=${fields.user_id}` : `group_id=${fields.group_id}`}`
            sql += ` LIMIT $1 OFFSET $2 `
            console.log(sql)

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])

            result = await Promise.all(result.map(async (item, i) => {
                if (item.files) {
                    item.files = await CFile.GetById(item.files);
                }

                return item;
            }));

            return result
        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CTopic Get'})
        }
    }

    //количество
    static async Count ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM topic WHERE ${(fields.owner_id > 0) ? `user_id=${fields.owner_id}` : `group_id=${fields.owner_id}`}`
            console.log(sql)

            let result = await DB.Init.Query(sql)
            console.log(result)

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CTopic Count'})
        }
    }

    //пользователи
    static async GetUsers ( items ) {
        try {

            //нет массива для обработки
            if ((!items) || (!items.length))
                return []

            let arUsersId = items.map((comment, i) => {
                return comment.user_id
            })

            //удаление одинаковых id из массива
            arUsersId = Array.from(new Set(arUsersId))

            let sql = `SELECT id,login,name,date_create,personal_birthday FROM users WHERE id in (${arUsersId})`
            console.log(sql)

            let users = await DB.Init.Query(sql)
            return users

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CTopic GetUsers'})
        }
    }
}