import {DB} from "./db";
import CFile from "./file";
import CUser from "./user";
export default class {

    static async Add ( fields ) {
        try {
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}friend WHERE
                                ((user_id=${fields.user_id} AND friend_id=${fields.friend_id}) OR
                                 (user_id=${fields.friend_id} AND friend_id=${fields.user_id}))
                            AND allowed is null`

            console.log(sql)
            let resultFriend = await DB.Init.Query(sql)

            console.log(resultFriend)

            if (!resultFriend.length) {
                let resultAdd = await DB.Init.Insert(`${DB.Init.TablePrefix}friend`, fields, `ID`)
                return resultAdd[0]
            }

            //заявка входящая
            if (Number (resultFriend[0].friend_id) === Number(fields.user_id)) {
                //просматриваем и принимаем
                let newField = {
                    viewed: true,
                    allowed: true
                }

                let resultEdit = await DB.Init.Update (`${DB.Init.TablePrefix}friend`, newField, {id: resultFriend[0].id},`id`)
                return resultEdit[0]
            }

            return false
        } catch (err) {
            console.log(err)
            throw ({err: 4001000, msg: 'CFriend Add'})
        }
    }

    static async Delete ( fields ) {
        try {
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}friend WHERE
                                ((user_id=${fields.user_id} AND friend_id=${fields.friend_id}) OR
                                 (user_id=${fields.friend_id} AND friend_id=${fields.user_id}))`

            console.log(sql)
            let resultFriend = await DB.Init.Query(sql)

            console.log(resultFriend)

            //нечего удалять
            if (!resultFriend.length)
                return false

            resultFriend = resultFriend[0]

            //заявка входящая / in
            if (Number (resultFriend.friend_id) === Number(fields.user_id)) {
                let newField = {
                    viewed: true,
                    allowed: null
                }
                await DB.Init.Update (`${DB.Init.TablePrefix}friend`, newField, {id: resultFriend.id},`id`)

                return true
            }

            //заявка исходящая / out
            if (Number (resultFriend.user_id) === Number(fields.user_id)) {
                let sql = `DELETE FROM ${DB.Init.TablePrefix}friend WHERE user_id=${fields.user_id} AND friend_id=${fields.friend_id}`
                await DB.Init.Query(sql)

                return true
            }

            return false

            return false
        } catch (err) {
            console.log(err)
            throw ({err: 4001000, msg: 'CFriend Add'})
        }
    }

    static async Status ( fields ) {
        try {
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}friend WHERE
                                ((user_id=${fields.user_id} AND friend_id=${fields.friend_id}) OR
                                 (user_id=${fields.friend_id} AND friend_id=${fields.user_id}))`

            console.log(sql)
            let resultFriend = await DB.Init.Query(sql)

            console.log(resultFriend)

            //нет заявки
            if (!resultFriend.length)
                return 'none'

            resultFriend = resultFriend[0]

            //друг
            if (resultFriend.allowed === true)
                return 'friend'

            //заявка входящая
            if ((Number (resultFriend.friend_id) === Number(fields.user_id)) && (resultFriend.viewed === true))
                return 'viewed'

            //заявка входящая
            if (Number (resultFriend.friend_id) === Number(fields.user_id))
                return 'in'

            //заявка исходящая
            if (Number (resultFriend.user_id) === Number(fields.user_id))
                return 'out'

            return false
        } catch (err) {
            console.log(err)
            throw ({err: 4001000, msg: 'CFriend Status'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {

            let sql = `SELECT * FROM ${DB.Init.TablePrefix}friend WHERE
                ((user_id=${fields.user_id} AND friend_id=${fields.friend_id}) OR
                 (user_id=${fields.friend_id} AND friend_id=${fields.user_id})) 
                            AND allowed=true ORDER BY id DESC`

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