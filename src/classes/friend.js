import {DB} from "./db";
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