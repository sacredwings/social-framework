import fs from "fs-extra"
import crypto from "crypto"
import extractFrames from "ffmpeg-extract-frame-ver-1-0-2"
import {getType, getExtension} from 'mime';
import axios from "axios";
import { DB } from "./db"
import { Store } from "../store"
import path from "path";

export class CFile {

    static async Upload ({module, fileForm, fileUrl, object_id=null, fromId, bucketName}) {

        //КОНЕКТЫ
        let mongoClient = Store.GetMongoClient()
        let minioClient = Store.GetMinioClient()

        //ПРОВЕРКА наличия основных данных
        if ((!fileForm) && (!fileUrl)) return false
        //if (!bucketName) return false
        if (!fromId) return false

        fromId = new DB().ObjectID(fromId)

        let fileBuffer = null
        let fileMime = null
        let fileSize = null
        let fileName = null

        //ФОРМА
        if (fileForm) {
            //файл в буфер
            const bytes = await fileForm.arrayBuffer()
            fileBuffer = Buffer.from(bytes)
            //свойства
            fileMime = fileForm.type
            fileSize = fileForm.size
        }

        //URL
        if (fileUrl) {
            let response = await axios({
                url: fileUrl, //your url
                method: 'GET',
                responseType: 'arraybuffer' //'blob', // important
            })
            //результат запроса в буфер
            fileBuffer = Buffer.from(response.data, 'binary')
            fileMime = 'image/jpeg'
        }

        //ХЕШ содержимого буфера
        let fileHash = crypto.createHash('md5').update(fileBuffer).digest("hex")
        let mimeExtension = await getExtension(fileMime)

        //ИМЯ ФАЙЛА без расширения
        fileName = fileHash
        if ((fileForm) && (fileForm.name)) fileName = fileForm.name.replace(/\.[^/\\.]+$/, "")

        let minioObjectName = null
        let mongoCollectionName = null

        //ВИДЕО
        if ((fileMime === 'video/mp4') ||
            (fileMime === 'video/mpeg')) {

            minioObjectName = `${fileHash}/original.${mimeExtension}`
            mongoCollectionName = 'file_video'

            //если не указано minio хранилище
            if (!bucketName)
                bucketName = 'video'
            else
                minioObjectName = 'video/' + minioObjectName
        }

        //ИЗОБРАЖЕНИЕ
        if ((fileMime === 'image/gif') ||
            (fileMime === 'image/png') ||
            (fileMime === 'image/jpeg')) {

            minioObjectName = `${fileHash}.${mimeExtension}`
            mongoCollectionName = 'file_img'

            //если не указано minio хранилище
            if (!bucketName)
                bucketName = 'img'
            else
                minioObjectName = 'img/' + minioObjectName
        }

        //АУДИО
        if ((fileMime === 'audio/mp4') ||
            (fileMime === 'audio/mpeg')) {

            minioObjectName = `${fileHash}.${mimeExtension}`
            mongoCollectionName = 'file_audio'

            //если не указано minio хранилище
            if (!bucketName)
                bucketName = 'audio'
            else
                minioObjectName = 'audio/' + minioObjectName
        }

        //ДОКУМЕНТ
        if ((fileMime === 'application/msword') ||
            (fileMime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
            (fileMime === 'application/vnd.ms-excel') ||
            (fileMime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
            (fileMime === 'application/pdf') ||
            (fileMime === 'text/plain')) {

            minioObjectName = `${fileHash}.${mimeExtension}`
            mongoCollectionName = 'file_doc'

            //если не указано minio хранилище
            if (!bucketName)
                bucketName = 'doc'
            else
                minioObjectName = 'doc/' + minioObjectName
        }

        //ПРОВЕРКА наличия дополнительных данных
        if (!fileMime) return false
        if (!minioObjectName) return false
        if (!mongoCollectionName) return false
        if (!bucketName) return false

        //ПРЕВЬЮ
        //object_id привязывается только к видео / файл может быть только изображением
        if ((object_id) && (bucketName !== 'img')) return false //ВЫХОД

        if (object_id) {
            let collection = mongoClient.collection('file_video')

            //object_id привязывается только к видео / файл должен существовать
            let getFile = await CFile.GetById([object_id], 'file_video')
            if (!getFile) return false //ВЫХОД если файла нет

            getFile = getFile[0]

            //object_id привязывается только к видео / файл должен быть видео
            if (getFile.type !== 'video/mp4') return false

            //mime тип файла
            let metaData = {
                'Content-Type': 'image/jpeg',
                'User-Id': fromId,
            }

            //загрузка файла
            try {
                let resultMinio = await minioClient.putObject(bucketName, `video/${getFile.object_name}/snapshot.jpeg`, fileBuffer, metaData)
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

            return getFile
        }

        //ОСНОВНОЙ ФАЙЛ

        //выбор коллекции
        let collection = mongoClient.collection(mongoCollectionName)

        //поиск файла по хэшу
        let getFile = await CFile.GetByHash(fileHash, mongoCollectionName)

        if (getFile) {
            //файл уже был загружен этим пользователем
            if (getFile.from_id.toString() === fromId.toString()) return getFile

            //создаем запись с теми же полями, меняем владельца
            let arFields = {
                ...getFile, ...{from_id: fromId}
            }
            delete arFields._id

            await collection.insertOne(arFields)
            return arFields
        }

        //новая запись в базу
        let arFields = {
            module: module,
            status: 'upload',

            size: fileSize,
            type: fileMime,
            ext: mimeExtension,

            object_name: fileHash,

            from_id: fromId,

            title: fileName,
            text: null,
        }

        //если явно указан id
        //if (_id) arFields._id = _id

        await collection.insertOne(arFields)

        //ПОДГОТОВКА К ЗАГРУЗКЕ ФАЙЛА

        //mime тип файла
        let metaData = {
            'Content-Type': fileMime,
            'User-Id': fromId,
        }

        try {
            //загрузка файла
            let resultMinio = await minioClient.putObject(bucketName, minioObjectName, fileBuffer, metaData)
            console.log(resultMinio)
            console.log('основной файл загружен')

            let arStatus = {
                status: 'ok',
                minio_etag: resultMinio.etag
            }
            await collection.updateOne({_id: arFields._id}, {$set: arStatus}, {upsert: true})
        } catch (e) {
            console.log(e)
            await collection.updateOne({_id: arFields._id}, {$set: {status: 'err'}}, {upsert: true})
        }
        //СОЗДАНИЕ SNAPSHOT
        if (fileMime === 'video/mp4') {
            try {

                //проверка и создание временного каталога
                if (!fs.existsSync(`${process.cwd()}/tmp`)) await fs.mkdirSync(path.join(process.cwd(), "tmp"))

                //извлечение кадра
                await extractFrames({
                    input: `${minioClient.protocol}//${minioClient.host}:${minioClient.port}/${bucketName}/video/${fileHash}/original.mp4`,
                    output: `${process.cwd()}/tmp/${fileHash}_snapshot.jpeg`,
                    offset: 3000 // seek offset in milliseconds
                })

                //console.log(`${process.cwd()}/tmp/${fileHash}_snapshot.jpeg`)
                //удаление временного файла
                //await fs.unlinkSync(`${process.cwd()}/tmp/${fileHash}_snapshot.jpeg`)

                //mime тип файла
                let metaData = {
                    'Content-Type': 'image/jpeg',
                    'User-Id': fromId,
                }

                //загрузка файла
                let resultMinio = await minioClient.fPutObject(bucketName, `video/${fileHash}/snapshot.jpeg`, `${process.cwd()}/tmp/${fileHash}_snapshot.jpeg`, metaData)
                console.log('извлечение кадра выполнено')
                console.log(resultMinio)

                let arStatus = {
                    snapshot_status: 'ok',
                    snapshot_minio_etag: resultMinio.etag,
                    snapshot_mime: 'image/jpeg',
                    snapshot_ext: 'jpeg'
                }
                await collection.updateOne({_id: arFields._id}, {$set: arStatus}, {upsert: true})
            } catch (e) {
                console.log(e)
                await collection.updateOne({_id: arFields._id}, {$set: {status_snapshot: 'err'}}, {upsert: true})
            }

        }

        return arFields
    }

    //поиск по Хэшу
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