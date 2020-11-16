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
            throw ({err: 2001000, msg: 'CGroup Add'})
        }
    }

    //поиск по id
    static async GetById ( id ) {
        try {
            let result = await DB.Init.Query(`SELECT * FROM groups WHERE id=$1`, [id])
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 2001000, msg: 'CGroup GetById'})
        }
    }

    //обновление основного фото
    static async UpdatePhoto ( userId, file ) {
        try {
            let user = await this.GetById(userId)

            let arFields = {
                user_id: userId,
                name: file.name,
                size: file.size,
                tmp_name: file.path,
                type: file.type,
                old_file: null,
                module_id: "group",
                description: null,
            }
            //файл уже загружен, нужно удалить
            if (user.personal_photo) {
                arFields.old_file = user.personal_photo
                arFields.del = true
            }
            let result = await CFile.SaveFile(arFields, `${global.__basedir}/`)

            arFields = {
                personal_photo: result.id
            }
            await this.Update (userId, arFields)

        } catch (err) {
            console.log(err)
            throw ({err: 2002000, msg: 'CGroup UpdatePhoto'})
        }
    }

    //обновление полей
    static async Update ( id, fields ) {
        try {
            let result = await DB.Init.Update (`groups`, fields, {id: id},`id`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 2003000, msg: 'CGroup Update'})
        }
    }

    //удаление группы
    static async Delete ( id ) {
        try {
            let result = await DB.Init.Update (`groups`, {delete: true}, {id: id},`id`)
            return result[0]
        } catch (err) {
            console.log(err)
            throw ({err: 2003000, msg: 'CGroup Update'})
        }
    }
}