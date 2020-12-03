import {DB} from "./db";
import CFile from './file'

export default class {

    //добавить новую группу
    static async Add ( fields ) {
        try {
            //запись
            let result = await DB.Init.Insert(`groups`, fields, `ID`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 4001000, msg: 'CGroup Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = ids.join(',');
            let result = await DB.Init.Query(`SELECT * FROM groups WHERE id in (${ids})`)

            result = await Promise.all(result.map(async (item, i) => {
                /* загрузка инфы о файле */
                if (item.photo) {
                    item.photo = await CFile.GetById([item.photo]);
                    item.photo = item.photo[0]
                }

                item.create_id = Number (item.create_id)

                return item;
            }));

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 4002000, msg: 'CGroup GetById'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {

            let sql = `SELECT * FROM groups WHERE create_id=${fields.owner_id}`
            sql += ` LIMIT $1 OFFSET $2 `

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])

            result = await Promise.all(result.map(async (item, i) => {

                if (item.type)
                    item.type = Number (item.type);

                if (item.photo)
                    item.photo = Number (item.photo);

                if (item.create_id)
                    item.create_id = Number (item.create_id);

                /* загрузка инфы о файле */
                if (item.photo) {
                    item.photo = await CFile.GetById([item.photo]);
                    item.photo = item.photo[0]
                }

                return item;
            }));

            return result
        } catch (err) {
            console.log(err)
            throw ({err: 4003000, msg: 'CGroup Get'})
        }
    }

    //количество
    static async Count ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM groups WHERE create_id=${fields.owner_id}`
            let result = await DB.Init.Query(sql)

            return Number (result[0].count)
        } catch (err) {
            console.log(err)
            throw ({err: 4004000, msg: 'CGroup Count'})
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
                return item.create_id
            })

            //удаление одинаковых id из массива
            arUsersId = Array.from(new Set(arUsersId))

            let sql = `SELECT id,login,name,date_create,personal_birthday FROM users WHERE id in (${arUsersId})`

            let users = await DB.Init.Query(sql)
            return users

        } catch (err) {
            console.log(err)
            throw ({err: 4005000, msg: 'CGroup GetUsers'})
        }
    }

    static async Update ( id, fields ) {
        try {
            if (fields.password) {
                const salt = await bcrypt.genSalt();
                fields.password = await bcrypt.hash(fields.password, salt);
            }
            console.log(fields)

            let result = await DB.Init.Update (`groups`, fields, {id: id},`id`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 4006000, msg: 'CGroup Update'})
        }
    }

    //удаление группы
    static async Delete ( id ) {
        try {
            let result = await DB.Init.Update (`groups`, {delete: true}, {id: id},`id`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 4007000, msg: 'CGroup Delete'})
        }
    }
}