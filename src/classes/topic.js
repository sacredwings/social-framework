import {DB} from "./db";
import CFile from "./file";

export default class {

    //новая тема для обсуждений
    static async Add ( fields ) {
        try {
            //если владелец не указан
            if (!fields.owner_id) fields.owner_id = fields.from_id

            //запись
            let result = await DB.Init.Insert(`topic`, fields, `ID`)
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({err: 6001000, msg: 'CTopic Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = ids.join(',');
            let result = await DB.Init.Query(`SELECT * FROM topic WHERE id in (${ids})`)

            result = await Promise.all(result.map(async (item, i) => {
                /* загрузка инфы о файле */
                if (item.files)
                    item.files = await CFile.GetById(item.files);

                return item;
            }));

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 6002000, msg: 'CTopic GetById'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {

            let sql = `SELECT * FROM topic WHERE owner_id=${fields.owner_id}`
            sql += ` LIMIT $1 OFFSET $2 `

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])

            result = await Promise.all(result.map(async (item, i) => {
                if (item.from_id)
                    item.from_id = Number (item.from_id);

                if (item.owner_id)
                    item.owner_id = Number (item.owner_id);

                if (item.create_id)
                    item.create_id = Number (item.create_id);

                /* загрузка инфы о файле */
                if (item.files)
                    item.files = await CFile.GetById(item.files);

                return item;
            }));

            return result
        } catch (err) {
            console.log(err)
            throw ({err: 6003000, msg: 'CTopic Get'})
        }
    }

    //количество
    static async Count ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM topic WHERE owner_id=${fields.owner_id}`
            let result = await DB.Init.Query(sql)

            return Number (result[0].count)
        } catch (err) {
            console.log(err)
            throw ({err: 6004000, msg: 'CTopic Count'})
        }
    }

    //пользователи
    static async GetUsers ( items ) {
        try {
            //нет массива для обработки
            if ((!items) || (!items.length))
                return []

            /* выгрузка индентификаторов из объектов / пользователей */
            let arUsersId = items.map((item, i) => {
                return item.from_id
            })

            //удаление одинаковых id из массива
            arUsersId = Array.from(new Set(arUsersId))

            let sql = `SELECT id,login,name,date_create,personal_birthday FROM users WHERE id in (${arUsersId})`

            let users = await DB.Init.Query(sql)
            return users

        } catch (err) {
            console.log(err)
            throw ({err: 6005000, msg: 'CTopic GetUsers'})
        }
    }
}