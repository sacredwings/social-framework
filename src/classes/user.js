const bcrypt = require('bcrypt');
import {DB} from "./db";
import CFile from './file'

export default class {

    //поиск по id
    static async GetById ( ids ) {
        try {
            ids = ids.join(',');
            let result = await DB.Init.Query(`SELECT * FROM users WHERE id in (${ids})`)

            result = await Promise.all(result.map(async (item, i) => {
                /* загрузка инфы о файле */
                if (item.personal_photo) {
                    item.personal_photo = await CFile.GetById([item.personal_photo]);
                    item.personal_photo = item.personal_photo[0]
                }

                return item;
            }));

            return result

        } catch (err) {
            console.log(err)
            throw ({err: 7001000, msg: 'CUser GetById'})
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
            throw ({err: 7002000, msg: 'CUser Update'})
        }
    }
}