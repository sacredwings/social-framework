import {DB} from "./db";
export default class {

    static async Add ( fields ) {
        try {
            fields.like = false
            if (fields.like)
                fields.like = true

            //запись
            let result = await DB.Init.Insert(`${DB.Init.TablePrefix}like`, fields, `ID`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 4001000, msg: 'CLike Add'})
        }
    }

    static async Count ( fields ) {
        try {
            fields.like = false
            if (fields.like)
                fields.like = true

            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}like WHERE module=${fields.module} AND object_id=${fields.object_id} AND dislike=${fields.like}`
            let result = await DB.Init.Query(sql)

            return Number (result[0].count)
        } catch (err) {
            console.log(err)
            throw ({err: 4003000, msg: 'CLike Count'})
        }
    }
}