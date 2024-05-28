// @ts-nocheck
import fs from "fs-extra"
import crypto from "crypto"
import extractFrames from "ffmpeg-extract-frame-ver-1-0-2"
import mime from 'mime'
//import {getType, getExtension} from 'mime';
import axios from "axios";
import { DB } from "./db"
import { Store } from "../store"
import path from "path";
import { md5 } from 'js-md5';

export class CFile {

    static async Upload ({module, file_form, file_url, object_id=null, from_id, to_user_id, to_group_id, bucket_name='', bucket_mini=true}) {

        //КОНЕКТЫ
        let mongoClient = Store.GetMongoClient()
        let minioClient = Store.GetMinioClient()

        //ПРОВЕРКА наличия файла
        if ((!file_form) && (!file_url)) return false

        from_id = new DB().ObjectID(from_id)
        to_user_id = new DB().ObjectID(to_user_id)
        to_group_id = new DB().ObjectID(to_group_id)

        let newBucketName = null
        let fileBuffer = null
        let fileMime = null
        let fileSize = null
        let fileName = null

        //ФОРМА
        if (file_form) {
            //файл в буфер
            const bytes = await file_form.arrayBuffer()
            fileBuffer = Buffer.from(bytes)
            //свойства
            fileMime = file_form.type
            fileSize = file_form.size
        }

        //URL
        if (file_url) {
            let response = await axios({
                url: file_url, //your url
                method: 'GET',
                responseType: 'arraybuffer' //'blob', // important
            })
            //результат запроса в буфер
            fileBuffer = Buffer.from(response.data, 'binary')
            fileMime = 'image/jpeg'
        }

        //ХЕШ содержимого буфера
        let fileHash = md5.hex(fileBuffer)
        let mimeExtension = mime.getExtension(fileMime)//await getExtension(fileMime)

        //ИМЯ ФАЙЛА без расширения
        fileName = fileHash
        if ((file_form) && (file_form.name)) fileName = file_form.name.replace(/\.[^/\\.]+$/, "")

        let minioObjectName = null
        let mongoCollectionName = null

        //ВИДЕО
        if ((fileMime === 'video/mp4') ||
            (fileMime === 'video/mpeg')) {

            newBucketName = `${bucket_name}video`
            minioObjectName = `${fileHash}/original.${mimeExtension}`
            mongoCollectionName = 'video'

            //minio хранилище
            if (bucket_mini) {
                newBucketName = bucket_name
                minioObjectName = 'video/' + minioObjectName
            }
        }

        //ИЗОБРАЖЕНИЕ
        if ((fileMime === 'image/gif') ||
            (fileMime === 'image/png') ||
            (fileMime === 'image/jpeg')) {

            newBucketName = `${bucket_name}img`
            minioObjectName = `${fileHash}.${mimeExtension}`
            mongoCollectionName = 'img'

            //minio хранилище
            if (bucket_mini) {
                newBucketName = bucket_name
                minioObjectName = 'img/' + minioObjectName
            }
        }

        //АУДИО
        if ((fileMime === 'audio/mp4') ||
            (fileMime === 'audio/mpeg')) {

            newBucketName = `${bucket_name}audio`
            minioObjectName = `${fileHash}.${mimeExtension}`
            mongoCollectionName = 'audio'

            //minio хранилище
            if (bucket_mini) {
                newBucketName = bucket_name
                minioObjectName = 'audio/' + minioObjectName
            }
        }

        //ДОКУМЕНТ
        if ((fileMime === 'application/msword') ||
            (fileMime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
            (fileMime === 'application/vnd.ms-excel') ||
            (fileMime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
            (fileMime === 'application/pdf') ||
            (fileMime === 'text/plain')) {

            newBucketName = `${bucket_name}doc`
            minioObjectName = `${fileHash}.${mimeExtension}`
            mongoCollectionName = 'doc'

            //minio хранилище
            if (bucket_mini) {
                newBucketName = bucket_name
                minioObjectName = 'doc/' + minioObjectName
            }

        }

        //ПРОВЕРКА наличия дополнительных данных
        if (!fileMime) return false
        if (!minioObjectName) return false
        if (!mongoCollectionName) return false
        if (!newBucketName) return false

        //ПРЕВЬЮ
        //object_id привязывается только к видео / файл может быть только изображением
        if ((object_id) && (mongoCollectionName !== 'img')) return false //ВЫХОД

        if (object_id) {
            let collection = mongoClient.collection('video')

            //object_id привязывается только к видео / файл должен существовать
            let getFile = await this.GetById([object_id], 'video')

            if (!getFile.length) return false //ВЫХОД если файла нет
            getFile = getFile[0]

            //object_id привязывается только к видео / файл должен быть видео
            if (getFile.type !== 'video/mp4') return false

            //mime тип файла
            let metaData = {
                'Content-Type': 'image/jpeg',
                'User-Id': from_id,
            }

            //загрузка файла
            try {
                let snapshotBucketName = `${bucket_name}video`
                let snapshotObjectName = `${getFile.object_name}/snapshot.jpeg`

                //minio хранилище
                if (bucket_mini) {
                    snapshotBucketName = bucket_name
                    snapshotObjectName = `video/${getFile.object_name}/snapshot.jpeg`
                }

                let resultMinio = await minioClient.putObject(snapshotBucketName, snapshotObjectName, fileBuffer, metaData)
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
            if (getFile.from_id.toString() === from_id.toString()) return getFile

            //создаем запись с теми же полями, меняем владельца
            let arFields = {
                ...getFile, ...{from_id: from_id, to_user_id: to_user_id, to_group_id: to_group_id}
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

            from_id: from_id,
            to_user_id: to_user_id,
            to_group_id: to_group_id,

            title: fileName,
            text: null,

            count_view: 0,
            count_comment: 0,
            count_like: 0,
            count_dislike: 0,
            count_repeat: 0,

            create_date: new Date()
        }

        //если явно указан id
        //if (_id) arFields._id = _id

        await collection.insertOne(arFields)

        //ПОДГОТОВКА К ЗАГРУЗКЕ ФАЙЛА

        //mime тип файла
        let metaData = {
            'Content-Type': fileMime,
            'User-Id': from_id,
        }

        try {

            //загрузка файла
            let resultMinio = await minioClient.putObject(newBucketName, minioObjectName, fileBuffer, metaData)
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
        if (mongoCollectionName === 'video') {
            try {

                //проверка и создание временного каталога
                if (!fs.existsSync(`${process.cwd()}/tmp`)) await fs.mkdirSync(path.join(process.cwd(), "tmp"))

                let fileVideoName = `${minioClient.protocol}//${minioClient.host}:${minioClient.port}/${newBucketName}/${minioObjectName}`

                //извлечение кадра
                await extractFrames({
                    input: fileVideoName,
                    output: `${process.cwd()}/tmp/${fileHash}_snapshot.jpeg`,
                    offset: 3000 // seek offset in milliseconds
                })

                //console.log(`${process.cwd()}/tmp/${fileHash}_snapshot.jpeg`)
                //удаление временного файла
                //await fs.unlinkSync(`${process.cwd()}/tmp/${fileHash}_snapshot.jpeg`)

                //mime тип файла
                let metaData = {
                    'Content-Type': 'image/jpeg',
                    'User-Id': from_id,
                }

                let snapshotObjectName =`${fileHash}/snapshot.jpeg`
                if (bucket_mini)
                    snapshotObjectName = 'video/' + snapshotObjectName

                //загрузка файла
                let resultMinio = await minioClient.fPutObject(newBucketName, snapshotObjectName, `${process.cwd()}/tmp/${fileHash}_snapshot.jpeg`, metaData)
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

    static async GetById ( ids, collectionName ) {
        try {
            ids = new DB().ObjectID(ids)

            const mongoClient = Store.GetMongoClient()
            let collection = mongoClient.collection(collectionName);
            let result = await collection.find({_id: {$in: ids}}).toArray()

            return result
        } catch (err) {
            console.log(err)
            throw ({code: 8001000, msg: 'CFile GetById'})
        }
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

async function getChecksumSha256(blob: Blob): Promise<string> {
    //const uint8Array = new Uint8Array(await blob.arrayBuffer());
    const uint8Array = new Uint8Array(blob)
    const hashBuffer = await crypto.subtle.digest('md5', uint8Array)
    const hashArray = Array.from(new Uint8Array(hashBuffer))

    return hashArray.map((h) => h.toString(16).padStart(2, '0')).join('')
    // if you like, it, yan can buy me a coffee https://paypal.me/bilelz/1000000
}
