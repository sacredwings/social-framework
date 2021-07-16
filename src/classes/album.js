//добавить новый видео альбом
import {DB} from "./db";
import CFile from "./file";

export default class {

//добавить новый видео альбом
    static async Add(fields) {
        try {
            //если владелец не указан
            if (!fields.owner_id) fields.owner_id = fields.from_id

            let result = await DB.Init.Insert(`${DB.Init.TablePrefix}album`, fields, `ID`)
            return result[0]

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CAlbum Add'})
        }
    }

    static async Edit(id, fields) {
        try {
            let result = await DB.Init.Update(`${DB.Init.TablePrefix}album`, fields, {id: id}, `ID`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CAlbum Edit'})
        }
    }

//загрузка
    static async Get(fields) {
        try {
            if (fields.album_id)
                fields.album_id = ` album_id=${fields.album_id} `
            else
                fields.album_id = ` album_id IS NULL `

            let sql = `SELECT *
                       FROM ${DB.Init.TablePrefix}album
                       WHERE owner_id = ${fields.owner_id} AND module = '${fields.module}' AND ${fields.album_id}
                       ORDER BY title ASC`
            sql += ` LIMIT $1 OFFSET $2 `

            console.log(sql)

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
            throw ({err: 8001000, msg: 'CAlbum Get'})
        }
    }

//количество
    static async Count(fields) {
        try {
            if (fields.album_id)
                fields.album_id = ` album_id=${fields.album_id} `
            else
                fields.album_id = ` album_id IS NULL `

            let sql = `SELECT COUNT(*)
                       FROM ${DB.Init.TablePrefix}album
                       WHERE owner_id = ${fields.owner_id} AND module = '${fields.module}' AND ${fields.album_id}`

            let result = await DB.Init.Query(sql)

            return Number(result[0].count)

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CAlbum Count'})
        }
    }

    //добавить новое в альбом
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
                await DB.Init.Insert(`${DB.Init.TablePrefix}album_${fields.module}_link`, arFields, `ID`)
            })

            return true

        } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CArticle InAlbum'})
        }
    }
}