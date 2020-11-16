import fs from "fs-extra";
import crypto from "crypto";
import {DB} from "./db";

export default class {

    //Сохраняем новый вайл в таблицу файлов и сам файл
    static async SaveFile ( fields, savePath ) {
        try {

            //удаление файла с диска и базы
            if (fields.old_file)
                await this.Delete(fields.old_file, true)

            //хеш размера и имени файла
            let hash = crypto.createHash('md5').update(fields.file.size + fields.file.name).digest("hex")

            //вытаскиваем расширение
            let type = fields.file.type.split('/');
            type = type[1]

            let url = `files/${fields.module_id}/${hash}.${type}`

            //к основному пути прибавляем путь к модулю
            savePath = `${savePath}files/${fields.module_id}/${hash}.${type}`

            //копирование файла в постоянную папку
            await fs.copy(fields.file.path, savePath)

            //добавление записи о файле в таблицу
            let arFields = {
                user_id: fields.user_id,
                group_id: fields.group_id,
                size: fields.file.size,
                path: savePath,
                type: fields.file.type,
                url: url,

                name: (fields.name) ? fields.name : fields.file.name,
                description: (fields.description) ? fields.description : null,
            }

            let result = await DB.Init.Insert(`files`, arFields, `id`)
            return result[0].id

        } catch (err) {
            console.log(err)
            throw ({err: 3001000, msg: 'CFile SaveFile'})
        }

    }

    //удаление информации о файле из базы и сам файл
    static async Delete ( id, deleteFile ) {
        try {

            //удаление файла
            if (deleteFile) {
                let result = await DB.Init.Query(`SELECT * FROM files WHERE id=$1`, [id])
                if (!result[0])
                    return false

                result = await fs.remove(`${result[0].path}/${result[0].name}`)
            }

            //удаление записи о файле
            let result = await DB.Init.Query(`DELETE FROM files WHERE id=$1`, [id])
            return true

        } catch (err) {
            console.log(err)
            throw ({err: 3002000, msg: 'CFile Delete'})
        }

    }

    //загрузка файлов
    static async GetById ( ids ) {
        try {
            if (!ids)
                return false

            ids = ids.join(',');

            console.log(`SELECT * FROM files WHERE id in (${ids})`)
            let result = await DB.Init.Query(`SELECT * FROM files WHERE id in (${ids})`)

            if (!result[0])
                return false

            return result;

        } catch (err) {
            console.log(err)
            throw ({err: 3002000, msg: 'CFile GetById'})
        }

    }


}