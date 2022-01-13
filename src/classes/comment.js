import {DB} from "./db";
import { CFile } from "./file";

export class CComment {

    //новый комментарий
    static async Add ( fields ) {
        try {
            let result = await DB.Init.Insert(`${DB.Init.TablePrefix}comment`, fields, `ID`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CComment Add'})
        }
    }

    //загрузка списка
    static async Get ( fields ) {
        try {

            let sql = `SELECT * FROM ${DB.Init.TablePrefix}comment WHERE module=$1 AND object_id=$2 ORDER BY id DESC`
            sql += ` LIMIT $3 OFFSET $4 `

            let result = await DB.Init.Query(sql, [fields.module, fields.object_id, fields.count, fields.offset])

            result = await Promise.all(result.map(async (item, i) => {

                if (item.from_id)
                    item.from_id = Number (item.from_id);

                if (item.object_id)
                    item.object_id = Number (item.object_id);

                if (item.create_id)
                    item.create_id = Number (item.create_id);

                /* загрузка инфы о файле */
                if (item.file_ids)
                    item.file_ids = await CFile.GetById(item.file_ids);

                return item;
            }));

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 2002000, msg: 'CComment Get'})
        }
    }

    //количество
    static async Count ( fields ) {
        try {

            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}comment WHERE module=$1 AND object_id=$2`
            let result = await DB.Init.Query(sql, [fields.module, fields.object_id])

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 2003000, msg: 'CComment Count'})
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
            throw ({err: 2004000, msg: 'CComment GetUsers'})
        }
    }
}