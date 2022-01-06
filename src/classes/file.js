import fs from "fs-extra"
import crypto from "crypto"
import extractFrames from "ffmpeg-extract-frame"

import {DB} from "./db"

export default class {

    //Сохраняем новый вайл в таблицу файлов и сам файл
    static async SaveFile ( fields, savePath, preview = true ) {
        try {
            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            if (fields.to_group_id)
                delete fields.to_user_id

            //id вложенного файла
            fields.file_id = new DB().ObjectID(fields.file_id)

            let collection = DB.Client.collection('file')

            //удаление файла с диска и базы
            //if (fields.old_file)
                //await this.Delete(fields.old_file, true)

            //содержимое файла
            let file_buffer = fs.createReadStream(fields.file.path)
            file_buffer = await new Promise(function(resolve,reject){
                file_buffer.on('data', (data) => resolve(data))
            })

            //хеш содержимого
            let hash = crypto.createHash('md5').update(file_buffer).digest("hex")

            //вытаскиваем расширение типа
            let type = fields.file.type.split('/');
            type = type[1]

            //url путь к файлу
            let url = `${hash[0]}${hash[1]}/${hash[2]}${hash[3]}/${hash}.${type}`

            //полный путь к файлу
            let newPathVideo = `${savePath}/${url}`

            //копирование файла в постоянную папку
            await fs.copy(fields.file.path, newPathVideo)

            url = `files/${url}`

            let newIdImg = null

            //картинки не существует
            if (!fields.file_id) {

                let urlImg = `${hash[0]}${hash[1]}/${hash[2]}${hash[3]}/${hash}.jpeg`

                //полный путь к файлу
                let newPathImg = `${savePath}${urlImg}`

                try {
                    //вытаскиваем видео
                    await ImageSave(newPathVideo, newPathImg)
                } catch (e) {
                    console.log(e)
                }


                urlImg = `files/${urlImg}`

                let arFields = {

                    size: 0,
                    path: newPathImg,
                    type: 'image/jpeg',
                    url: urlImg,

                    from_id: fields.from_id,
                    to_user_id: fields.to_user_id,
                    to_group_id: fields.to_group_id,

                    file_id: null,

                    title: fields.title,

                    create_id: fields.create_id
                }

                let result = await collection.insertOne(arFields)
                newIdImg = arFields._id
            }

            //добавление записи о файле в таблицу
            let arFields = {

                size: fields.file.size,
                path: newPathVideo,
                type: fields.file.type,
                url: url,

                from_id: fields.from_id,
                to_user_id: fields.to_user_id,
                to_group_id: fields.to_group_id,

                file_id: (fields.file_id) ? fields.file_id : newIdImg,

                title: (fields.title) ? fields.title : fields.file.title,
                text: fields.text,

                create_id: fields.create_id
            }

            let result = await collection.insertOne(arFields)
            return {id: arFields._id}

        } catch (err) {
            console.log(err)
            throw ({err: 3001000, msg: 'CFile SaveFile'})
        }

    }

    //загрузка файлов
    static async GetById ( ids ) {
        try {
            if (!ids)
                return false

            ids = ids.join(',');

            let result = await DB.Init.Query(`SELECT * FROM ${DB.Init.TablePrefix}file WHERE id in (${ids})`)
            result = await Promise.all(result.map(async (item, i) => {

                /* загрузка инфы о файле */
                if (item.file_id) {
                    item.file_id = await this.GetById([item.file_id]);
                    item.file_id = item.file_id[0]
                }


                return item;
            }));

            return result;

        } catch (err) {
            console.log(err)
            throw ({err: 3002000, msg: 'CFile GetById'})
        }

    }

    //удаление информации о файле из базы и сам файл
    static async Delete ( id, deleteFile ) {
        try {
            //удаление файла
            if (deleteFile) {
                let result = await DB.Init.Query(`SELECT * FROM ${DB.Init.TablePrefix}file WHERE id=$1`, [id])
                if (!result[0])
                    return false

                result = await fs.remove(`${result[0].path}/${result[0].name}`)
            }

            //удаление записи о файле
            let result = await DB.Init.Query(`DELETE FROM ${DB.Init.TablePrefix}file WHERE id=$1`, [id])
            return true

        } catch (err) {
            console.log(err)
            throw ({err: 3003000, msg: 'CFile Delete'})
        }

    }
}

const ImageSave = async (pathVideo, pathImg) => {
    return await extractFrames({
        input: pathVideo,
        output: pathImg,
        offset: 3000 // seek offset in milliseconds
    })
}