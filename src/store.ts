// @ts-nocheck
import { Client } from 'minio'
//import { MongoClient } from "mongodb"

//СОСТОЯНИЕ
let minioClient = null
let mongoClient = null
let mongoObjectId = null
let test = null

//MONGO
const GetMongoObjectId = () => {
    return mongoObjectId
}
const GetMongoClient = () => {
    return mongoClient
}
const SetMongoClient = async ({MongoClient, ObjectId}, {url, dbName}) => {
    mongoObjectId = ObjectId

    if (mongoClient) return mongoClient

    const client = new MongoClient(url)
    await client.connect()
    mongoClient = client.db(dbName);

    return mongoClient
}

//MINIO
const SetMinioClient = async (config, compulsion=false) => {
    //конект уже существует
    if (minioClient && !compulsion) return minioClient

    //новый конект
    minioClient = await new Client({
        endPoint: config.endPoint,
        port: config.port,
        useSSL: config.useSSL,
        accessKey: config.accessKey,
        secretKey: config.secretKey
    })

    //вывод конекта
    return minioClient
}
const GetMinioClient = () => {
    return minioClient
}
/*
//MONGO
const GetMongoClient = () => {
    return mongoClient
}
const SetMongoClient = async (config, compulsion=false) => {
    //конект уже существует
    if (mongoClient && !compulsion) return mongoClient

    //новый конект
    const client = await new MongoClient(config.url)
    await client.connect()
    mongoClient = client.db(config.dbName)

    //вывод конекта
    return mongoClient
}
*/
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

    GetMongoObjectId,

    GetTest,
    SetTest
}
