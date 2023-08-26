import { Client } from 'minio'
import { MongoClient } from "mongodb"

//СОСТОЯНИЕ
let minioClient = null
let mongoClient = null
let test = null

//MINIO
const SetMinioClient = (config, compulsion=false) => {
    //конект уже существует
    if (minioClient && !compulsion) return minioClient

    //новый конект
    minioClient = new Client({
        endPoint: config.endPoint,
        port: config.port,
        useSSL: config.useSSL,
        accessKey: config.accessKey,
        secretKey: config.secretKey
    })

    //вывод конекта
    return minioClient
}
const GetMinioClient = (config) => {
    return minioClient
}

//MONGO
const GetMongoClient = () => {
    return mongoClient
}
const SetMongoClient = (config, compulsion=false) => {
    //конект уже существует
    if (mongoClient && !compulsion) return mongoClient

    //новый конект
    const client = new MongoClient(config.url)
    client.connect()
    mongoClient = client.db(config.dbName)

    //вывод конекта
    return mongoClient
}

//Test
const GetTest = () => {
    return test
}
const SetTest = (config) => {
    test = config
}

export const Store = {
    GetMinioClient,
    SetMinioClient,

    GetMongoClient,
    SetMongoClient,

    GetTest,
    SetTest
}
