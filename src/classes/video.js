import {DB} from "./db";
import CFile from "./file";

export default class {

    //добавить новое видео
    static async Add ( fields ) {
        try {
            //если владелец не указан
            if (!fields.owner_id) fields.owner_id = fields.from_id

            let albums = fields.albums

            //удаляем из массива
            if ((fields.albums) || (fields.albums === null))
                delete  fields.albums

            let result = await DB.Init.Insert(`${DB.Init.TablePrefix}video`, fields, `ID`)

            if ((albums) && (albums.length))
                albums.map(async (item, i)=>{
                    let arFields = {
                        album_id: item,
                        object_id: result[0].id,

                        create_id: fields.create_id
                    }
                    await DB.Init.Insert(`${DB.Init.TablePrefix}album_link`, arFields, `ID`)
                })

            return result[0]

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CVideo Add'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = ids.join(',');
            let result = await DB.Init.Query(`SELECT * FROM ${DB.Init.TablePrefix}video WHERE id in (${ids})`)

            result = await Promise.all(result.map(async (item, i) => {
                /* загрузка инфы о файле */
                if (item.file) {
                    item.file = await CFile.GetById([item.file]);
                    item.file = item.file[0]
                }

                if (item.file_preview) {
                    item.file_preview = await CFile.GetById([item.file_preview]);
                    item.file_preview = item.file_preview[0]
                }

                return item;
            }));

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CVideo GetById'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}video WHERE owner_id=${fields.owner_id}`

            /* видео из альбома */
            if (fields.album_id)
                sql = `SELECT ${DB.Init.TablePrefix}video.*
                    FROM ${DB.Init.TablePrefix}album_link
                    INNER JOIN ${DB.Init.TablePrefix}video ON ${DB.Init.TablePrefix}video.id = ${DB.Init.TablePrefix}album_link.object_id WHERE ${DB.Init.TablePrefix}album_link.album_id = ${fields.album_id}`

            sql += ` LIMIT $1 OFFSET $2 `

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])
            result = await Promise.all(result.map(async (item, i) => {
                /* загрузка инфы о файле */
                if (item.file) {
                    item.file = await CFile.GetById([item.file]);
                    item.file = item.file[0]
                }

                if (item.file_preview) {
                    item.file_preview = await CFile.GetById([item.file_preview]);
                    item.file_preview = item.file_preview[0]
                }

                return item;
            }));
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CVideo Get'})
        }
    }

    //количество
    static async Count ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}video WHERE owner_id=${fields.owner_id}`

            /* видео из альбома */
            if (fields.album_id)
                sql = `SELECT COUNT(*)
                    FROM ${DB.Init.TablePrefix}album_link
                    WHERE ${DB.Init.TablePrefix}album_link.album_id = ${fields.album_id}`

            let result = await DB.Init.Query(sql)

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CVideo Count'})
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
            throw ({err: 8001000, msg: 'CVideo GetUsers'})
        }
    }

    //добавить новый видео альбом
    static async AddAlbum ( fields ) {
        try {
            fields.module = 'video'

            //если владелец не указан
            if (!fields.owner_id) fields.owner_id = fields.from_id

            let result = await DB.Init.Insert(`${DB.Init.TablePrefix}album`, fields, `ID`)
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CVideo Add'})
        }
    }

    //загрузка
    static async GetAlbums ( fields ) {
        try {
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}album WHERE owner_id=${fields.owner_id} AND module='video'`
            sql += ` LIMIT $1 OFFSET $2 `

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])
            result = await Promise.all(result.map(async (item, i) => {
                /* загрузка инфы о файле */
                if (item.image_id) {
                    item.image_id = await CFile.GetById([item.image_id]);
                    item.image_id = item.image_id[0]
                }

                return item;
            }));
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CVideo GetAlbums'})
        }
    }
    //количество
    static async CountAlbums ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}album WHERE owner_id=${fields.owner_id} AND module='video'`
            let result = await DB.Init.Query(sql)

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CVideo CountAlbums'})
        }
    }
}