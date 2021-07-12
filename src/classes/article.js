import {DB} from "./db";
import CFile from "./file";

export default class {

    //новая тема для обсуждений
    static async Add ( fields ) {
        try {
            //если владелец не указан
            if (!fields.owner_id) fields.owner_id = fields.from_id

            //запись
            let result = await DB.Init.Insert(`${DB.Init.TablePrefix}article`, fields, `ID`)
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({err: 6001000, msg: 'CArticle Add'})
        }
    }

    //добавить новое видео
    static async InAlbum ( fields ) {
        try {
            // сделать проверку, что файл и альбом твои

            //раскидываем файл по альбомам
            fields.album_ids.map(async (item, i)=>{

                let arFields = {
                    album_id: item,
                    object_id: fields.object_id,

                    create_id: fields.create_id
                }
                console.log(arFields)
                await DB.Init.Insert(`${DB.Init.TablePrefix}album_article_link`, arFields, `ID`)
            })

            return true

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CArticle InAlbum'})
        }
    }

    //загрузка по id
    static async GetById ( ids ) {
        try {
            ids = ids.join(',');
            let result = await DB.Init.Query(`SELECT * FROM ${DB.Init.TablePrefix}article WHERE id in (${ids})`)

            /*
            result = await Promise.all(result.map(async (item, i) => {
                // загрузка инфы о файле

                if (item.file_ids)
                    item.file_ids = await CFile.GetById(item.file_ids);

                return item;
            }));
            */
            return result

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CArticle GetById'})
        }
    }

    //загрузка
    static async Get ( fields ) {
        try {
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}article WHERE owner_id=${fields.owner_id}`

            /* видео из альбома */
            if (fields.album_id)
                sql = `SELECT ${DB.Init.TablePrefix}article.*
                    FROM ${DB.Init.TablePrefix}album_article_link
                    INNER JOIN ${DB.Init.TablePrefix}article ON ${DB.Init.TablePrefix}article.id = ${DB.Init.TablePrefix}album_article_link.object_id WHERE ${DB.Init.TablePrefix}album_article_link.album_id = ${fields.album_id} AND owner_id=${fields.owner_id} ORDER BY id DESC`

            sql += ` LIMIT $1 OFFSET $2 `

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])

            /*
            result = await Promise.all(result.map(async (item, i) => {
                if (item.from_id)
                    item.from_id = Number (item.from_id);

                if (item.owner_id)
                    item.owner_id = Number (item.owner_id);

                if (item.create_id)
                    item.create_id = Number (item.create_id);

                // загрузка инфы о файле
                if (item.file_ids)
                    item.file_ids = await CFile.GetById(item.file_ids);

                return item;
            }));
            */

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CArticle Get'})
        }
    }

    //количество
    static async GetCount ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}article WHERE owner_id=${fields.owner_id}`
            let result = await DB.Init.Query(sql)

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CArticle GetCount'})
        }
    }

    //количество всех видео
    static async Count ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}article`

            let result = await DB.Init.Query(sql)
            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CArticle Count'})
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
            throw ({err: 8001000, msg: 'CArticle GetUsers'})
        }
    }

    //добавить новый видео альбом
    static async AddAlbum ( fields ) {
        try {
            fields.module = 'article'

            //если владелец не указан
            if (!fields.owner_id) fields.owner_id = fields.from_id

            let result = await DB.Init.Insert(`${DB.Init.TablePrefix}album`, fields, `ID`)
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CArticle AddAlbum'})
        }
    }

    //загрузка
    static async GetAlbums ( fields ) {
        try {
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}album WHERE owner_id=${fields.owner_id} AND module='article' ORDER BY title ASC`
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
            throw ({err: 8001000, msg: 'CArticle GetAlbums'})
        }
    }
    //количество
    static async CountAlbums ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}album WHERE owner_id=${fields.owner_id} AND module='article'`
            let result = await DB.Init.Query(sql)

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CArticle CountAlbums'})
        }
    }

    //поиск
    static async Search ( fields ) {
        try {
            let there = []

            if (fields.q)
                there.push(` to_tsvector(title) @@ websearch_to_tsquery('${fields.q.toLowerCase()}') `) //в нижний регистр

            //запрос
            let sql = `SELECT * FROM ${DB.Init.TablePrefix}article `

            //объединеие параметров запроса
            if (there.length)
                sql += `WHERE ` + there.join(' AND ')

            sql += ` LIMIT $1 OFFSET $2`

            let result = await DB.Init.Query(sql, [fields.count, fields.offset])
            console.log(sql)

            result = await Promise.all(result.map(async (item, i) => {

                /*
                if (item.type)
                    item.type = Number (item.type);

                if (item.photo)
                    item.photo = Number (item.photo);

                if (item.create_id)
                    item.create_id = Number (item.create_id);

                /* загрузка инфы о файле */
                /*
                if (item.photo) {
                    item.photo = await CFile.GetById([item.photo]);
                    item.photo = item.photo[0]
                }*/

                return item;
            }));

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CArticle Search'})
        }
    }

    //количество / поиск
    static async SearchCount ( fields ) {
        try {
            let there = []

            if (fields.q)
                there.push(` to_tsvector(title) @@ websearch_to_tsquery('${fields.q.toLowerCase()}') `) //в нижний регистр

            //запрос
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}article `

            //объединеие параметров запроса
            if (there.length)
                sql += `WHERE ` + there.join(' AND ')

            console.log(sql)
            let result = await DB.Init.Query(sql)

            return Number (result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CArticle SearchCount'})
        }
    }
}