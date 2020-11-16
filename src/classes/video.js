import {DB} from "./db";
import CFile from "./file";

export default class {

    //добавить новое видео
    static async Add ( fields ) {
        try {
            let arFields = {
                user_id: fields.user_id,
                group_id: fields.group_id,

                text: fields.text,
                file: fields.file,
            }

            let result = await DB.Init.Insert(`video`, fields, `ID`)
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CVideo Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = ids.join(',');
            let arVideo = await DB.Init.Query(`SELECT * FROM video WHERE id in (${ids})`)

            arVideo = await Promise.all(arVideo.map(async (video, i) => {
                if (video.file) {
                    video.file = await CFile.GetById([video.file]);
                    video.file = video.file[0]
                }

                return video;
            }));

            return arVideo

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CVideo GetById'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {

            let sql = `SELECT * FROM video WHERE ${(fields.user_id) ? `user_id=${fields.user_id}` : `group_id=${fields.group_id}`}`
            sql += ` LIMIT $1 OFFSET $2 `
            console.log(sql)

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])

            result = await Promise.all(result.map(async (item, i) => {
                if (item.file) {
                    item.file = await CFile.GetById([item.file]);
                    item.file = item.file[0]
                }

                return item;
            }));

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CVideo Get'})
        }
    }

    //количество
    static async Count ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM video WHERE ${(fields.owner_id > 0) ? `user_id=${fields.owner_id}` : `group_id=${fields.owner_id}`}`
            console.log(sql)

            let result = await DB.Init.Query(sql)
            console.log(result)

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CVideo Count'})
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
            throw ({err: 2001000, msg: 'CVideo GetUsers'})
        }
    }
}