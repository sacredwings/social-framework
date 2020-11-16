const bcrypt = require('bcrypt');
import {DB} from "./db";
import CFile from './file'

export default class {

    //поиск по id
    static async GetById ( id ) {
        try {
            let result = await DB.Init.Query(`SELECT * FROM users WHERE id=$1`, [id])

            //нет результата
            if (!result.length) return false

            //упрощаем
            result = result[0]

            if (result.personal_photo) {
                result.personal_photo = await CFile.GetById([result.personal_photo]);
                result.personal_photo = result.personal_photo[0]
            }

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CUser GetById'})
        }
    }

    static async Update ( id, fields ) {
        try {
            if (fields.password) {
                const salt = await bcrypt.genSalt();
                fields.password = await bcrypt.hash(fields.password, salt);
            }
            console.log(fields)

            let result = await DB.Init.Update (`users`, fields, {id: id},`id`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 2003000, msg: 'CUser Update'})
        }
    }
}