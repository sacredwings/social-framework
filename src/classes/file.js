import fs from "fs-extra"
import crypto from "crypto"
import extractFrames from "ffmpeg-extract-frame"
import {getType, getExtension} from 'mime';

import { DB } from "./db"
import { Store } from "../store"

export class CFile {

    //Сохраняем новый вайл в таблицу файлов и сам файл
    static async Add ({_id=null, module, file, from_id, to_group_id, object_id=null}) {
        try {
            const mongoClient = Store.GetMongoClient()
            const minioClient = Store.GetMinioClient()

            from_id = new DB().ObjectID(from_id)
            to_group_id = new DB().ObjectID(to_group_id)
            object_id = new DB().ObjectID(object_id)

            //убираем расширение
            file.name = file.name.replace(/\.[^/\\.]+$/, "")
            //file.name = file.name.replace(/[^\w\s!?]/g,'')
            // x.replace(/\.[^/.]+$/, "")

            //содержимое файла в буфер
            let file_buffer = fs.createReadStream(file.path)
            file_buffer = await new Promise(function(resolve,reject){
                file_buffer.on('data', (data) => resolve(data))
            })

            //хеш содержимого
            let hash = crypto.createHash('md5').update(file_buffer).digest("hex")

            //ОПРЕДЕЛЕНИЕ ТИПОВ
            //перепроверка mime типа
            let mimeType = await getType(file.path)
            let mimeExtension = await getExtension(mimeType)

            let bucketName = null
            let objectName = null
            let tableName = null

            //ВИДЕО
            if ((mimeType === 'video/mp4') ||
                (mimeType === 'video/mpeg')) {

                bucketName = 'video'
                objectName = `${hash}/original.${mimeExtension}`
                tableName = 'file_video'
            }

            //ИЗОБРАЖЕНИЕ
            if ((mimeType === 'image/gif') ||
                (mimeType === 'image/png') ||
                (mimeType === 'image/jpeg')) {

                bucketName = 'image'
                objectName = `${hash}.${mimeExtension}`
                tableName = 'file_image'
            }

            //АУДИО
            if ((mimeType === 'audio/mp4') ||
                (mimeType === 'audio/mpeg')) {

                bucketName = 'audio'
                objectName = `${hash}.${mimeExtension}`
                tableName = 'file_audio'
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
                tableName = 'file_doc'
            }

            //mime тип не прошел проверку
            if (!mimeType) return false
            if (!tableName) return false

            //ПРОВЕРКИ для превью видео

            //object_id привязывается только к видео / может быть только изображением
            if ((object_id) && (bucketName !== 'image')) return false //ВЫХОД

            if (object_id) {
                let collection = mongoClient.collection('file_video')

                //object_id привязывается только к видео / файл должен существовать
                let getFile = await this.GetById([object_id], 'file_video')
                if (!getFile) return false //ВЫХОД

                getFile=getFile[0]

                //object_id привязывается только к видео / файл должен быть видео
                if (getFile.type !== 'video/mp4') return false

                //mime тип файла
                let metaData = {
                    'Content-Type': mimeType,
                    'User-Id': from_id,
                }

                //console.log(getFile)

                //загрузка файла
                try {
                    let resultMinio = await minioClient.fPutObject('video', `${getFile.object_name}/snapshot.jpeg`, file.path, metaData)
                    console.log('загружен новый кадр')

                    let arStatus = {
                        snapshot_status: 'ok',
                        snapshot_minio_etag: resultMinio.etag,
                        snapshot_mime: 'image/jpeg',
                        snapshot_ext: 'jpeg'
                    }
                    await collection.updateOne({_id: getFile._id}, {$set: arStatus}, {upsert: true})
                } catch (err) {
                    await collection.updateOne({_id: getFile._id}, {$set: {snapshot_status: 'err'}}, {upsert: true})
                    return console.log(err)
                }

                /*
                await minioClient.fPutObject('video', `${getFile.object_name}/snapshot.jpeg`, file.path, metaData, async function(err, objInfo) {

                    if(err) {
                        let result = collection.updateOne({_id: getFile._id}, {$set: {snapshot_status: 'err'}}, {upsert: true})
                        return console.log(err)
                    }

                })*/

                return getFile
            }


            //РАБОТА С БАЗОЙ

            //выбор коллекции
            let collection = mongoClient.collection(tableName)

            //поиск файла по хэшу
            let getFile = await this.GetByHash(hash, tableName)
            if (getFile) {

                //файл уже был загружен этим пользователем
                if (getFile.from_id.toString() === from_id.toString()) return getFile

                //создаем запись с теми же полями, меняем владельца
                let arFields = {
                    ...getFile, ...{from_id: from_id}
                }
                delete arFields._id

                await collection.insertOne(arFields)
                return arFields
            }

            //новая запись в базу
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

                title: file.name,
                text: null,
                //album_ids: album_ids,
            }

            //если явно указан id
            if (_id) arFields._id = _id

            await collection.insertOne(arFields)

            //ПОДГОТОВКА К ЗАГРУЗКЕ ФАЙЛА

            //mime тип файла
            let metaData = {
                'Content-Type': mimeType,
                'User-Id': from_id,
            }

            try {
                //загрузка файла
                let resultMinio = await minioClient.fPutObject(bucketName, objectName, file.path, metaData)
                console.log(resultMinio)
                console.log('основной файл загружен')

                let arStatus = {
                    status: 'ok',
                    minio_etag: resultMinio.etag
                }
                await collection.updateOne({_id: arFields._id}, {$set: arStatus}, {upsert: true})
            } catch (e) {
                await collection.updateOne({_id: arFields._id}, {$set: {status: 'err'}}, {upsert: true})
            }
            /*
            await minioClient.fPutObject(bucketName, objectName, file.path, metaData, async function(err, objInfo) {

                if(err) {
                    let result = collection.updateOne({_id: arFields._id}, {$set: {status: 'err'}}, {upsert: true})
                    return console.log(err)
                }
                console.log('загружаю')
                //файл
                let arStatus = {
                    status: 'ok',
                    minio_etag: objInfo.etag,
                    minio_version_id: objInfo.versionId
                }
                let result = collection.updateOne({_id: arFields._id}, {$set: arStatus}, {upsert: true})

            })*/

            //СОЗДАНИЕ SNAPSHOT

            if (mimeType === 'video/mp4') {
                try {
                    //извлечение кадра
                    await extractFrames({
                        input: file.path,
                        output: `${file.path}.jpeg`,
                        offset: 3000 // seek offset in milliseconds
                    })

                    //mime тип файла
                    let metaData = {
                        'Content-Type': 'image/jpeg',
                        'User-Id': from_id,
                    }

                    //загрузка файла
                    let resultMinio = await minioClient.fPutObject('video', `${hash}/snapshot.jpeg`, `${file.path}.jpeg`, metaData)
                    console.log('извлечение кадра выполнено')

                    let arStatus = {
                        snapshot_status: 'ok',
                        snapshot_minio_etag: resultMinio.etag,
                        snapshot_mime: 'image/jpeg',
                        snapshot_ext: 'jpeg'
                    }
                    await collection.updateOne({_id: arFields._id}, {$set: arStatus}, {upsert: true})
                } catch (e) {
                    await collection.updateOne({_id: arFields._id}, {$set: {status_snapshot: 'err'}}, {upsert: true})
                }

                /*
                await minioClient.fPutObject('video', `${hash}/snapshot.jpeg`, `${file.path}.jpeg`, metaData, async function(err, objInfo) {

                    if(err) {
                        let result = collection.updateOne({_id: arFields._id}, {$set: {status_snapshot: 'err'}}, {upsert: true})
                        return console.log(err)
                    }

                    //файл
                    let arStatus = {
                        snapshot_status: 'ok',
                        snapshot_mime: 'image/jpeg',
                        snapshot_ext: 'jpeg'
                    }
                    let result = collection.updateOne({_id: arFields._id}, {$set: arStatus}, {upsert: true})
                })*/
            }

            return arFields

        } catch (err) {
            console.log(err)
            throw ({code: 3001000, msg: 'CFile Add'})
        }
    }

    /*
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

    }*/

//загрузка по id
    static async GetById ( ids, collectionName ) {
        try {
            const mongoClient = Store.GetMongoClient()
            ids = new DB().arObjectID(ids)

            let collection = mongoClient.collection(collectionName)

            let result = await collection.find({_id: { $in: ids}}).toArray()

            if (!result.length) return false
            result = await Promise.all(result.map(async (item, i) => {
                if (item.text === null) item.text = ''

                return item
            }))

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CFile GetById'})
        }
    }


//загрузка по id
    static async GetByHash ( hash, collectionName ) {
        try {
            const mongoClient = Store.GetMongoClient()

            let collection = mongoClient.collection(collectionName);
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