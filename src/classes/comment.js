import {DB} from "./db";
import CFile from "./file";

export default class {

    //новый комментарий
    static async Add ( fields ) {
        try {

            if (fields.owner_id > 0)
                fields.user_id = fields.owner_id
            else
                fields.group_id = fields.owner_id

            //удаляем лишний
            delete fields.owner_id

            let result = await DB.Init.Insert('comments', fields, `ID`)
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CComment Add'})
        }
    }

    //загрузка списка
    static async Get ( fields ) {
        try {

            let sql = `SELECT * FROM comments WHERE module=$1 AND object_id=$2 `
            sql += ` LIMIT $3 OFFSET $4 `
            console.log(sql)

            let result = await DB.Init.Query(sql, [fields.module, fields.object_id, fields.count, fields.offset])

            result = await Promise.all(result.map(async (item, i) => {
                if (item.files) {
                    item.files = await CFile.GetById(item.files, true);
                    item.files = item.files
                }

                return item;
            }));

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CComment Get'})
        }
    }

    //количество
    static async Count ( fields ) {
        try {

            let sql = `SELECT COUNT(*) FROM comments WHERE module=$1 AND object_id=$2`
            console.log(sql)

            let result = await DB.Init.Query(sql, [fields.module, fields.object_id])
            console.log(result)

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CComment Count'})
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

            let sql = `SELECT id,login,name,date_create,personal_birthday,personal_photo FROM users WHERE id in (${arUsersId})`
            console.log(sql)

            let users = await DB.Init.Query(sql)

            users = await Promise.all(users.map(async (user, i)=>{
                if (user.personal_photo) {
                    user.personal_photo = await CFile.GetById([user.personal_photo]);
                    user.personal_photo = user.personal_photo[0]
                }
                return user
            }))

            return users

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CComment GetUsers'})
        }
    }
}