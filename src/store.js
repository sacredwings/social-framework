import { Client } from 'minio'
import { MongoClient } from "mongodb"

//СОСТОЯНИЕ
let minioClient = null
let mongoClient = null
let xxx = null

//MINIO
const SetMinioClient = (config) => {
    minioClient = new Client({
        endPoint: config.endPoint,
        port: config.port,
        useSSL: config.useSSL,
        accessKey: config.accessKey,
        secretKey: config.secretKey
    })
}
const GetMinioClient = (config) => {
    return minioClient
}

//MONGO
const GetMongoClient = () => {
    return mongoClient
}
const SetMongoClient = (config) => {
    const client = new MongoClient(config.url)
    client.connect().then(()=>{
        mongoClient = client.db(config.dbName)
    })
}

//MONGO
const GetX = () => {
    return xxx
}
const SetX = (config) => {
    xxx = config
}

export const Store = {
    GetMinioClient,
    SetMinioClient,

    GetMongoClient,
    SetMongoClient,

    GetX,
    SetX
}
