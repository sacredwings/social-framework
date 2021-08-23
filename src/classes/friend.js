import {DB} from "./db";
import CFile from "./file";
import CUser from "./user";
export default class {

    static async Add ( fields ) {
        try {
            //запись
            let result = await DB.Init.Insert(`${DB.Init.TablePrefix}friend`, fields, `ID`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 4001000, msg: 'CFriend Add'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {

            let sql = `SELECT * FROM ${DB.Init.TablePrefix}friend WHERE user_id=${fields.user_id} OR friend_id=${fields.user_id} AND allowed=true ORDER BY id DESC`
            sql += ` LIMIT $1 OFFSET $2 `

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])

            let arUsers = []
            result = await Promise.all(result.map(async (item, i) => {

                //сохраняем из одного поля в общий массив
                if (Number (item.user_id) !== fields.user_id)
                    arUsers.push(item.user_id)

                //сохраняем из другого поля в общий массив
                if (Number (item.friend_id) !== fields.friend_id)
                    arUsers.push(item.friend_id)

                return item;
            }));

            arUsers = await CUser.GetById ( arUsers );

            //фильтр
            arUsers = await Promise.all(arUsers.map(async (item, i) => {

                let newField = {
                    id:             item.id,
                    timestamp_x:    item.timestamp_x,
                    login:          item.login,
                    active:         item.active,

                    first_name:     item.first_name,
                    last_name:      item.last_name,
                    second_name:    item.second_name,
                    photo:          item.photo,
                }
                return newField;
            }));

            return arUsers
        } catch (err) {
            console.log(err)
            throw ({err: 6003000, msg: 'CFriend Get'})
        }
    }

    //количество
    static async GetCount ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}friend WHERE user_id=${fields.user_id} OR friend_id=${fields.user_id} AND allowed=true`
            //let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}post WHERE owner_id=${fields.owner_id}`
            let result = await DB.Init.Query(sql)

            return Number (result[0].count)
        } catch (err) {
            console.log(err)
            throw ({err: 6004000, msg: 'CFriend GetCount'})
        }
    }

    static async Accept ( fields, where ) {
        try {
            //просмотренно
            fields.viewed = true
            fields.allowed = true

            //запись
            let result = await DB.Init.Update(`${DB.Init.TablePrefix}friend`, fields, where,`ID`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 4001000, msg: 'CFriend Accept'})
        }
    }
}