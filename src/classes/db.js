import { Pool } from 'pg'

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
            throw ({err: 100, msg: 'DB Creating: no db connect'})
        }
    }

    //выбор активного пула для работы
    SelectDB ( poolName ) {
        try {

            //выбор коннекта с базой
            this.pool = this.arPools[poolName]

        } catch (err) {
            console.log(err)
            throw ({err: 110, msg: 'DB Create'})
        }
    }

    //классический запрос в базу
    async Query ( sql, value = null ) {
        try {
            let result = await this.pool.query( sql, value )
            return result.rows
        } catch (err) {
            console.log(err)
            throw ({err: 120, msg: 'DB Query'})
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
            throw ({err: 130, msg: 'DB Insert'})
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
            throw ({err: 140, msg: 'DB Update'});
        }
    }

}