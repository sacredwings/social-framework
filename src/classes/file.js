import fs from "fs-extra"
import crypto from "crypto"
import extractFrames from "ffmpeg-extract-frame"
import {getType, getExtension} from 'mime';

import { DB } from "./db"
import { Store } from "../store"

export class CFile {

    //Сохраняем новый вайл в таблицу файлов и сам файл
    static async Add ({module, file, from_id, to_group_id}) {
        try {
            const mongoClient = Store.GetMongoClient()
            const minioClient = Store.GetMinioClient()
            let collection = mongoClient.collection('file')
            from_id = new DB().ObjectID(from_id)
            to_group_id = new DB().ObjectID(to_group_id)

            file.name = file.name.replace(/\.[^/\\.]+$/, "")
            //file.name = file.name.replace(/[^\w\s!?]/g,'')
            // x.replace(/\.[^/.]+$/, "")

            //ИМЯ И ТИПЫ

            //содержимое файла в буфере
            let file_buffer = fs.createReadStream(file.path)
            file_buffer = await new Promise(function(resolve,reject){
                file_buffer.on('data', (data) => resolve(data))
            })

            //хеш содержимого
            let hash = crypto.createHash('md5').update(file_buffer).digest("hex")

            //поиск файла по хэшу
            let getFile = await this.GetByHash(hash)
            if (getFile) {
                //файл уже был загружен этим пользователем
                if (getFile.from_id.toString() === from_id.toString()) return getFile

                //создаем запись с теме же полями, меняем владельца
                let arFields = {
                    ...getFile, ...{from_id: from_id}
                }
                let result = await collection.insertOne(arFields)
                return arFields
            }

            //перепроверка mime типа
            let mimeType = await getType(file.path)
            let mimeExtension = await getExtension(mimeType)

            let bucketName = null
            let objectName = null

            //ПОДГОТОВКА К ЗАГРУЗКЕ ФАЙЛА

            //ВИДЕО
            if (mimeType === 'video/mp4') {
                bucketName = 'video'
                objectName = `${hash}/original.${mimeExtension}`

                //СОЗДАНИЕ SNAPSHOT
                await extractFrames({
                    input: file.path,
                    output: `${file.path}.jpeg`,
                    offset: 3000 // seek offset in milliseconds
                })

                //для minio
                let metaData = {
                    'Content-Type': 'image/jpeg',
                    'User-Id': from_id,
                    //'Title': file.name
                }

                //загрузка
                minioClient.fPutObject('video', `${hash}/snapshot.jpeg`, `${file.path}.jpeg`, metaData, async function(err, objInfo) {

                    if(err) {
                        let result = collection.updateOne({_id: objectId}, {$set: {status_snapshot: 'err'}}, {upsert: true})
                        return console.log(err)
                    }

                    //файл
                    let arStatus = {
                        snapshot_status: 'ok',
                        snapshot_mime: 'image/jpeg',
                        snapshot_ext: 'jpeg'
                    }
                    let result = collection.updateOne({_id: objectId}, {$set: arStatus}, {upsert: true})
                })
            }

            //ИЗОБРАЖЕНИЕ
            if ((mimeType === 'image/gif') ||
                (mimeType === 'image/png') ||
                (mimeType === 'image/jpeg')) {

                bucketName = 'image'
                objectName = `${hash}.${mimeExtension}`
            }

            //АУДИО
            if ((mimeType === 'audio/mp4') ||
                (mimeType === 'audio/mpeg')) {

                bucketName = 'audio'
                objectName = `${hash}.${mimeExtension}`
            }

            //ДОКУМЕНТ
            if ((mimeType === 'application/msword') ||
                (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
                (mimeType === 'application/vnd.ms-excel') ||
                (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
                (mimeType === 'application/pdf') ||
                (mimeType === 'text/plain')) {

                bucketName = 'doc'
                objectName = `${hash}.${mimeExtension}`
            }

            //ЗАГРУЗКА ФАЙЛА
            let metaData = {
                'Content-Type': mimeType,
                'User-Id': from_id,
                //'Title': file.name
            }

            //id объекта который быдет создан в базе
            let objectId = null

            minioClient.fPutObject(bucketName, objectName, file.path, metaData, async function(err, objInfo) {

                if(err) {
                    let result = collection.updateOne({_id: objectId}, {$set: {status: 'err'}}, {upsert: true})
                    return console.log(err)
                }

                //файл
                let arStatus = {
                    status: 'ok',
                    minio_etag: objInfo.etag,
                    minio_version_id: objInfo.versionId
                }
                let result = collection.updateOne({_id: objectId}, {$set: arStatus}, {upsert: true})

            })

            //добавление записи о файле в таблицу
            let arFields = {
                module: module,
                status: 'upload',

                size: file.size,
                type: mimeType,
                ext: mimeExtension,

                bucket_name: bucketName,
                object_name: hash,

                from_id: from_id,
                to_group_id: to_group_id,

                //не нужно, превью будет именем замого файла / оно обязательно
                //file_id: (fields.file_id) ? fields.file_id : newIdImg,

                title: file.name,
                text: null,
                //album_ids: album_ids,
            }

            let result = await collection.insertOne(arFields)
            //для обновления статуса загрузки файла
            objectId = arFields._id

            return arFields

        } catch (err) {
            console.log(err)
            throw ({code: 3001000, msg: 'CFile Add'})
        }
    }

    //Сохраняем новый вайл в таблицу файлов и сам файл
    static async SaveFile ( fields, savePath, preview = true ) {
        try {
            const mongoClient = Store.GetMongoClient()
            fields.to_user_id = new DB().ObjectID(fields.to_user_id)
            fields.to_group_id = new DB().ObjectID(fields.to_group_id)
            if (fields.to_group_id)
                delete fields.to_user_id

            if (fields.album_ids)
                fields.album_ids = new DB().arObjectID(fields.album_ids)

            //id вложенного файла
            fields.file_id = new DB().ObjectID(fields.file_id)

            let collection = mongoClient.collection('file')

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
                album_ids: fields.album_ids,
                create_id: fields.create_id
            }

            let result = await collection.insertOne(arFields)
            return arFields

        } catch (err) {
            console.log(err)
            throw ({code: 3001000, msg: 'CFile SaveFile'})
        }

    }

//загрузка по id
    static async GetById ( ids ) {
        try {
            const mongoClient = Store.GetMongoClient()
            ids = new DB().arObjectID(ids)

            let collection = mongoClient.collection('file');
            //let result = await collection.find({_id: { $in: ids}}).toArray()
            let result = await collection.aggregate([
                { $match:
                        {
                            _id: {$in: ids}
                        }
                },
                { $lookup:
                        {
                            from: 'file',
                            localField: 'file_id',
                            foreignField: '_id',
                            as: '_file_id',
                        },

                },
                {
                    $unwind:
                        {
                            path: '$_file_id',
                            preserveNullAndEmptyArrays: true
                        }
                }
            ]).toArray();

            result = await Promise.all(result.map(async (item, i) => {
                if (item.text === null) item.text = ''

                return item;
            }));

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CFile GetById'})
        }
    }


//загрузка по id
    static async GetByHash ( hash ) {
        try {
            const mongoClient = Store.GetMongoClient()

            let collection = mongoClient.collection('file');
            //let result = await collection.find({_id: { $in: ids}}).toArray()
            let result = await collection.findOne({object_name: hash})

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CFile GetById'})
        }
    }

    /*
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
            throw ({code: 3003000, msg: 'CFile Delete'})
        }

    }*/
}

const ImageSave = async (pathVideo, pathImg) => {
    try {
        return await extractFrames({
            input: pathVideo,
            output: pathImg,
            offset: 3000 // seek offset in milliseconds
        })
    } catch (e) {
        return false
    }

}