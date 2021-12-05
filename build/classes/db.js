"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DB = void 0;

var _mongodb = require("mongodb");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DB = /*#__PURE__*/function () {
  function DB() {
    _classCallCheck(this, DB);
  }

  _createClass(DB, [{
    key: "Init",
    value: function () {
      var _Init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parameters, dbName) {
        var url, client;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                //let url = `mongodb://${parameters.host}:${parameters.port}`
                //if (parameters.login)
                //`mongodb://${parameters.login}:${parameters.password}@${parameters.host}:${parameters.port}/?authSource=${parameters.source}`
                url = 'mongodb://root:A28392839@localhost:27017/?authSource=admin';
                client = new _mongodb.MongoClient(url);
                _context.next = 4;
                return client.connect();

              case 4:
                console.log('Connected successfully to server');
                return _context.abrupt("return", client.db(dbName));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function Init(_x, _x2) {
        return _Init.apply(this, arguments);
      }

      return Init;
    }()
  }, {
    key: "ObjectID",
    value: function ObjectID(value) {
      if (value && typeof value === 'string') return (0, _mongodb.ObjectId)(value);
      return value;
    }
  }, {
    key: "arObjectID",
    value: function arObjectID(arValue) {
      var arResult = [];
      arValue.forEach(function (value, i, arr) {
        if (value && typeof value === 'string') arResult.push((0, _mongodb.ObjectId)(value));
        if (value && _typeof(value) === 'object') arResult.push(value);
      });
      if (arResult.length) return arResult;
      return arValue;
    }
  }]);

  return DB;
}(); //import { Pool } from 'pg'

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

}*/


exports.DB = DB;