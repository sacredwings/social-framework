// @ts-nocheck
//import { MongoClient, ObjectId } from 'mongodb'
//import { ObjectId } from 'mongodb'
//type InterfaceClient = object | null
import {Store} from '../store'

export class DB {

    ObjectID (value) {
        let newObjectId = Store.GetMongoObjectId()

        //если null
        if (!value) return null

        //строка 24 символа
        if ((value) && (typeof value === 'string') && (value.length === 24))
            return new newObjectId(value)

        //массив
        if ((value) && (value.length)) {

            value = value.map((value, i, arr) => {
                if ((value) && (typeof value === 'string') && (value.length === 24))
                    return new newObjectId(value)

                if ((value) && (typeof value === 'object'))
                    return value

                return null
            })
        }

        //уже объект, но и точно не массив
        if ((value) && (typeof value === 'object'))
            return value

        return null
    }
/*
    ObjectID (value) {
        //строка 24 символа
        if ((value) && (typeof value === 'string') && (value.length === 24))
            return new ObjectId(value)

        //уже объект
        if ((value) && (typeof value === 'object'))
            return value

        return null
    }

    arObjectID (arValue) {
        let arResult = []

        //если null
        if (!arValue) return null

        arValue.forEach(function(value, i, arr) {
            if ((value) && (typeof value === 'string') && (value.length === 24))
                arResult.push(new ObjectId(value))

            if ((value) && (typeof value === 'object'))
                arResult.push(value)

            if (!value)
                arResult.push(null)
        })

        if (arResult.length) return arResult

        return arValue
    }*/
}

//import { Pool } from 'pg'

/*
export class DB {
    //из конфига в пулы
    constructor( ) {
        this.pg = {}
    }

    //выбор драйвера
    Driver ( name ) {
        this.driver = name;
    }

    CreateConnect ( config ) {
        try {

            //указываем, что переменная является объектом
            this.arPools = {}

            //наполняем объект пулами
            for (let key in config)
                this.arPools[key] = new Pool(config[key])

        } catch (err) {
            console.log(err)
            throw ({code: 100, msg: 'DB Creating: no db connect'})
        }
    }

    //выбор активного пула для работы
    SelectDB ( poolName ) {
        try {

            //выбор коннекта с базой
            this.pool = this.arPools[poolName]

        } catch (err) {
            console.log(err)
            throw ({code: 110, msg: 'DB Create'})
        }
    }

    //классический запрос в базу
    async Query ( sql, value = null ) {
        try {
            let result = await this.pool.query( sql, value )
            return result.rows
        } catch (err) {
            console.log(err)
            throw ({code: 120, msg: 'DB Query'})
        }
    }

    //новая запись
    async Insert ( tableName, arData, arReturn = null ) {
        try {
            //обнуление и типизация
            let field = [] //названия полей
            let fieldValue = [] //шаблон
            let value = [] //значаения полей
            let i = 1 //первое значение

            //из массива в sql строку
            if (typeof arReturn === "array")
                arReturn = arReturn.join(',')

            //из ассоциативного массива по массивам
            for(let key in arData){
                field.push(key)
                fieldValue.push(`$${i}`)

                //если содержимое является массивом, но не null
                if ((typeof arData[key] === "object") && (arData[key] !== null))
                    value.push(JSON.stringify(arData[key]));
                else
                    value.push(arData[key])

                i++
            }

            //в стоку для SQL
            field = field.join(',')
            fieldValue = fieldValue.join(',')

            //шаблон
            let sql = `INSERT INTO ${tableName} (${field}) VALUES (${fieldValue})`
            if (arReturn)
                sql += ` RETURNING ${arReturn}`

            //выполнение
            let result = await this.pool.query(sql, value)
            return result.rows

        } catch (err) {
            console.log(err)
            if (!err.err) console.log(err)
            throw ({code: 130, msg: 'DB Insert'})
        }
    }


    async Update ( tableName, arData, arWhere = null, arReturn = null ) {
        try {
            let field = []; //названия полей
            let where = []; //названия полей
            let number = []; //номера
            let value = []; //значаения полей
            let i = 1; //первое значение

            //из массива в sql строку
            if (typeof arReturn === "array")
                arReturn = arReturn.join(',');

            //из ассоциативного массива по массивам
            for(let key in arData){
                field.push(`${key}=$${i}`);
                number.push(`$${i}`);
                value.push(arData[key]);
                i++;
            }

            //из ассоциативного массива по массивам
            for(let key in arWhere){
                where.push(`${key}=$${i}`);
                number.push(`$${i}`);
                value.push(arWhere[key]);
                i++;
            }

            //в стоку для SQL
            field = field.join(', ');
            where = where.join(' AND ');
            number = number.join(',');

            //шаблон
            let sql = `UPDATE ${tableName} SET ${field}  `;

            if (arWhere)
                sql += ` WHERE ${where}`;

            if (arReturn)
                sql += ` RETURNING ${arReturn}`;

            //выполнение
            let result = await this.pool.query( sql, value );
            return result.rows;

        } catch (err) {
            if (!err.err) console.log(err);
            throw ({code: 140, msg: 'DB Update'});
        }
    }

}*/