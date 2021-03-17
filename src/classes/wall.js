import {DB} from "./db";
import CFile from "./file";

export default class {

    //новая тема для обсуждений
    static async Add ( fields ) {
        try {
            //если владелец не указан
            if (!fields.owner_id) fields.owner_id = fields.from_id

            //запись
            let result = await DB.Init.Insert(`${DB.Init.TablePrefix}wall`, fields, `ID`)
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({err: 6001000, msg: 'CWall Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = ids.join(',');
            let result = await DB.Init.Query(`SELECT * FROM ${DB.Init.TablePrefix}wall WHERE id in (${ids})`)

            result = await Promise.all(result.map(async (item, i) => {
                /* загрузка инфы о файле */
                if (item.files)
                    item.files = await CFile.GetById(item.files);

                if (item.from_id)
                    item.from_id = Number (item.from_id);

                if (item.owner_id)
                    item.owner_id = Number (item.owner_id);

                return item;
            }));

            return result[0]

        } catch (err) {
            console.log(err)
            throw ({err: 6002000, msg: 'CWall GetById'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {

            let sql = `SELECT * FROM ${DB.Init.TablePrefix}wall WHERE owner_id=${fields.owner_id}`
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
            throw ({err: 6003000, msg: 'CWall Get'})
        }
    }

    //количество
    static async Count ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}wall WHERE owner_id=${fields.owner_id}`
            let result = await DB.Init.Query(sql)

            return Number (result[0].count)
        } catch (err) {
            console.log(err)
            throw ({err: 6004000, msg: 'CWall Count'})
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

            let sql = `SELECT id,login,first_name,create_date,birthday,photo FROM ${DB.Init.TablePrefix}user WHERE id in (${arUsersId})`
            let users = await DB.Init.Query(sql)

            users = await Promise.all(users.map(async (user, i)=>{
                if (user.photo) {
                    user.photo = await CFile.GetById([user.photo]);
                    user.photo = user.photo[0]
                }
                return user
            }))

            return users

        } catch (err) {
            console.log(err)
            throw ({err: 6005000, msg: 'CWall GetUsers'})
        }
    }

    //поиск по обсуждениям
    static async Search ( fields ) {
        try {
            let there = []

            if (fields.q)
                there.push(` to_tsvector(title) @@ websearch_to_tsquery('${fields.q.toLowerCase()}') `) //в нижний регистр

            //запрос
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}wall `

            //объединеие параметров запроса
            if (there.length)
                sql += `WHERE ` + there.join(' AND ')

            sql += ` LIMIT $1 OFFSET $2`

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])
            console.log(sql)

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
            throw ({err: 7001000, msg: 'CWall Search'})
        }
    }

    //количество / поиск по обсуждениям
    static async SearchCount ( fields ) {
        try {
            let there = []

            if (fields.q)
                there.push(` to_tsvector(title) @@ websearch_to_tsquery('${fields.q.toLowerCase()}') `) //в нижний регистр

            //запрос
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}wall `

            //объединеие параметров запроса
            if (there.length)
                sql += `WHERE ` + there.join(' AND ')

            console.log(sql)
            let result = await DB.Init.Query(sql)

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CWall SearchCount'})
        }
    }

    //количество / поиск по обсуждениям
    static async Delete ( id ) {
        try {
            //запись
            let result = await DB.Init.Query(`DELETE FROM sf_wall WHERE id = ${id}`)
            return true

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CWall Delete'})
        }
    }
}