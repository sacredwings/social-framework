"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DB = void 0;

var _pg = require("pg");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DB = /*#__PURE__*/function () {
  //из конфига в пулы
  function DB() {
    _classCallCheck(this, DB);

    this.pg = {};
  } //выбор драйвера


  _createClass(DB, [{
    key: "Driver",
    value: function Driver(name) {
      this.driver = name;
    }
  }, {
    key: "CreateConnect",
    value: function CreateConnect(config) {
      try {
        //указываем, что переменная является объектом
        this.arPools = {}; //наполняем объект пулами

        for (var key in config) {
          this.arPools[key] = new _pg.Pool(config[key]);
        }
      } catch (err) {
        console.log(err);
        throw {
          err: 100,
          msg: 'DB Creating: no db connect'
        };
      }
    } //выбор активного пула для работы

  }, {
    key: "SelectDB",
    value: function SelectDB(poolName) {
      try {
        //выбор коннекта с базой
        this.pool = this.arPools[poolName];
      } catch (err) {
        console.log(err);
        throw {
          err: 110,
          msg: 'DB Create'
        };
      }
    } //классический запрос в базу

  }, {
    key: "Query",
    value: function () {
      var _Query = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(sql) {
        var value,
            result,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                value = _args.length > 1 && _args[1] !== undefined ? _args[1] : null;
                _context.prev = 1;
                _context.next = 4;
                return this.pool.query(sql, value);

              case 4:
                result = _context.sent;
                return _context.abrupt("return", result.rows);

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](1);
                console.log(_context.t0);
                throw {
                  err: 120,
                  msg: 'DB Query'
                };

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 8]]);
      }));

      function Query(_x) {
        return _Query.apply(this, arguments);
      }

      return Query;
    }() //новая запись

  }, {
    key: "Insert",
    value: function () {
      var _Insert = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(tableName, arData) {
        var arReturn,
            field,
            fieldValue,
            value,
            i,
            key,
            sql,
            result,
            _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                arReturn = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : null;
                _context2.prev = 1;
                //обнуление и типизация
                field = []; //названия полей

                fieldValue = []; //шаблон

                value = []; //значаения полей

                i = 1; //первое значение
                //из массива в sql строку

                if (typeof arReturn === "array") arReturn = arReturn.join(','); //из ассоциативного массива по массивам

                for (key in arData) {
                  field.push(key);
                  fieldValue.push("$".concat(i)); //если содержимое является массивом, но не null

                  if (_typeof(arData[key]) === "object" && arData[key] !== null) value.push(JSON.stringify(arData[key]));else value.push(arData[key]);
                  i++;
                } //в стоку для SQL


                field = field.join(',');
                fieldValue = fieldValue.join(','); //шаблон

                sql = "INSERT INTO ".concat(tableName, " (").concat(field, ") VALUES (").concat(fieldValue, ")");
                if (arReturn) sql += " RETURNING ".concat(arReturn); //выполнение

                _context2.next = 14;
                return this.pool.query(sql, value);

              case 14:
                result = _context2.sent;
                return _context2.abrupt("return", result.rows);

              case 18:
                _context2.prev = 18;
                _context2.t0 = _context2["catch"](1);
                console.log(_context2.t0);
                if (!_context2.t0.err) console.log(_context2.t0);
                throw {
                  err: 130,
                  msg: 'DB Insert'
                };

              case 23:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 18]]);
      }));

      function Insert(_x2, _x3) {
        return _Insert.apply(this, arguments);
      }

      return Insert;
    }()
  }, {
    key: "Update",
    value: function () {
      var _Update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(tableName, arData) {
        var arWhere,
            arReturn,
            field,
            where,
            number,
            value,
            i,
            key,
            _key,
            sql,
            result,
            _args3 = arguments;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                arWhere = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : null;
                arReturn = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : null;
                _context3.prev = 2;
                field = []; //названия полей

                where = []; //названия полей

                number = []; //номера

                value = []; //значаения полей

                i = 1; //первое значение
                //из массива в sql строку

                if (typeof arReturn === "array") arReturn = arReturn.join(','); //из ассоциативного массива по массивам

                for (key in arData) {
                  field.push("".concat(key, "=$").concat(i));
                  number.push("$".concat(i));
                  value.push(arData[key]);
                  i++;
                } //из ассоциативного массива по массивам


                for (_key in arWhere) {
                  where.push("".concat(_key, "=$").concat(i));
                  number.push("$".concat(i));
                  value.push(arWhere[_key]);
                  i++;
                } //в стоку для SQL


                field = field.join(', ');
                where = where.join(' AND ');
                number = number.join(','); //шаблон

                sql = "UPDATE ".concat(tableName, " SET ").concat(field, "  ");
                if (arWhere) sql += " WHERE ".concat(where);
                if (arReturn) sql += " RETURNING ".concat(arReturn); //выполнение

                _context3.next = 19;
                return this.pool.query(sql, value);

              case 19:
                result = _context3.sent;
                return _context3.abrupt("return", result.rows);

              case 23:
                _context3.prev = 23;
                _context3.t0 = _context3["catch"](2);
                if (!_context3.t0.err) console.log(_context3.t0);
                throw {
                  err: 140,
                  msg: 'DB Update'
                };

              case 27:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[2, 23]]);
      }));

      function Update(_x4, _x5) {
        return _Update.apply(this, arguments);
      }

      return Update;
    }()
  }]);

  return DB;
}();

exports.DB = DB;