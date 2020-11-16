"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _db = require("./db");

var _file = _interopRequireDefault(require("./file"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _default = /*#__PURE__*/function () {
  function _default() {
    _classCallCheck(this, _default);
  }

  _createClass(_default, null, [{
    key: "Add",
    //добавить новое видео
    value: function () {
      var _Add = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fields) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _db.DB.Init.Insert("messages", fields, "ID");

              case 3:
                result = _context.sent;
                return _context.abrupt("return", result[0]);

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw {
                  err: 2001000,
                  msg: 'CMessage Add'
                };

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 7]]);
      }));

      function Add(_x) {
        return _Add.apply(this, arguments);
      }

      return Add;
    }() //загрузка

  }, {
    key: "GetByUserId",
    value: function () {
      var _GetByUserId = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(fields) {
        var sql, result, arMessages, i, messages;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                sql = "SELECT messages.*,\n\nfrom_user.login as from_user_login,\nfrom_user.personal_photo as from_user_personal_photo,\nfrom_user.personal_gender as from_user_personal_gender,\nfrom_user.name as from_user_name,\n\nto_user.login as to_user_login,\nto_user.personal_photo as to_user_personal_photo,\nto_user.personal_gender as to_user_personal_gender,\nto_user.name as to_user_name\n\nFROM messages \nLEFT JOIN users AS from_user ON messages.from_user_id=from_user.id \nLEFT JOIN users AS to_user ON messages.to_user_id=to_user.id \nWHERE (from_user_id=$1 AND to_user_id=$2) OR (from_user_id=$2 AND to_user_id=$1)";
                sql += " LIMIT $3 OFFSET $4 ";
                _context2.next = 5;
                return _db.DB.Init.Query(sql, [fields.owner_id, fields.user_id, fields.count, fields.offset]);

              case 5:
                result = _context2.sent;
                arMessages = []; //массив сообщений уникальных пользователей
                //уникальность массива

                for (i = 0; i < result.length; i++) {
                  //добавление новых полей к массиву
                  messages = {}; //добавление новых полей

                  if (Number(result[i].from_user_id) === fields.owner_id) {
                    messages.user_id = Number(result[i].to_user_id);
                    messages.user_name = result[i].to_user_name;
                    messages["in"] = false;
                  } else {
                    messages.user_id = Number(result[i].from_user_id);
                    messages.user_name = result[i].from_user_name;
                    messages["in"] = true;
                  } //удаление не актуальных полей


                  delete result[i].id;
                  delete result[i].from_user_id;
                  delete result[i].to_user_id;
                  arMessages.push(_objectSpread(_objectSpread({}, result[i]), messages));
                }

                return _context2.abrupt("return", arMessages);

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                throw {
                  err: 2001000,
                  msg: 'CMessage GetUserId'
                };

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 11]]);
      }));

      function GetByUserId(_x2) {
        return _GetByUserId.apply(this, arguments);
      }

      return GetByUserId;
    }()
  }, {
    key: "Get",
    value: function () {
      var _Get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(fields) {
        var sql, outMes, inMes, result, arMessages, CheckContinue, i, messages, j;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                //ИСХОДЯЩИЕ
                sql = "SELECT messages.*,\n\nfrom_user.login as from_user_login,\nfrom_user.personal_photo as from_user_personal_photo,\nfrom_user.personal_gender as from_user_personal_gender,\nfrom_user.name as from_user_name,\n\nto_user.login as to_user_login,\nto_user.personal_photo as to_user_personal_photo,\nto_user.personal_gender as to_user_personal_gender,\nto_user.name as to_user_name\n\nFROM messages \nLEFT JOIN users AS from_user ON messages.from_user_id=from_user.id \nLEFT JOIN users AS to_user ON messages.to_user_id=to_user.id \n\nWHERE messages.from_user_id=$1 AND (messages.to_user_id, messages.date_create) in (\nSELECT to_user_id, max(date_create)\nFROM messages \nWHERE from_user_id=$1\nGROUP BY to_user_id)";
                sql += " LIMIT $2 OFFSET $3 ";
                _context3.next = 5;
                return _db.DB.Init.Query(sql, [fields.owner_id, fields.count, fields.offset]);

              case 5:
                outMes = _context3.sent;
                //ВХОДЯЩИЕ
                sql = "SELECT messages.*,\n\nfrom_user.login as from_user_login,\nfrom_user.personal_photo as from_user_personal_photo,\nfrom_user.personal_gender as from_user_personal_gender,\nfrom_user.name as from_user_name,\n\nto_user.login as to_user_login,\nto_user.personal_photo as to_user_personal_photo,\nto_user.personal_gender as to_user_personal_gender,\nto_user.name as to_user_name\n\nFROM messages \nLEFT JOIN users AS from_user ON messages.from_user_id=from_user.id \nLEFT JOIN users AS to_user ON messages.to_user_id=to_user.id \n\nWHERE messages.to_user_id=$1 AND (messages.from_user_id, messages.date_create) in (\nSELECT from_user_id, max(date_create)\nFROM messages \nWHERE to_user_id=$1\nGROUP BY from_user_id)";
                sql += " LIMIT $2 OFFSET $3 ";
                _context3.next = 10;
                return _db.DB.Init.Query(sql, [fields.owner_id, fields.count, fields.offset]);

              case 10:
                inMes = _context3.sent;
                result = outMes.concat(inMes); //ОБЪЕДИНЕНИЕ ВХОДЯЩИХ и ИСХОДЯЩИХ сообщений

                arMessages = []; //массив сообщений уникальных пользователей

                CheckContinue = false; //выйти из цикла до сохранения элемента массива
                //уникальность массива

                i = 0;

              case 15:
                if (!(i < result.length)) {
                  _context3.next = 36;
                  break;
                }

                CheckContinue = false; //сброс чека / выход из цикла
                //добавление новых полей к массиву

                messages = {}; //добавление новых полей

                if (Number(result[i].from_user_id) === fields.owner_id) {
                  messages.user_id = Number(result[i].to_user_id);
                  messages.user_name = result[i].to_user_name;
                  messages["in"] = false;
                } else {
                  messages.user_id = Number(result[i].from_user_id);
                  messages.user_name = result[i].from_user_name;
                  messages["in"] = true;
                } //удаление не актуальных полей


                delete result[i].id;
                delete result[i].from_user_id;
                delete result[i].to_user_id; //проходим по массиву еще раз и ищем такой же

                j = 0;

              case 23:
                if (!(j < arMessages.length)) {
                  _context3.next = 30;
                  break;
                }

                if (!(messages.user_id === arMessages[j].user_id)) {
                  _context3.next = 27;
                  break;
                }

                CheckContinue = true;
                return _context3.abrupt("break", 30);

              case 27:
                j++;
                _context3.next = 23;
                break;

              case 30:
                if (!CheckContinue) {
                  _context3.next = 32;
                  break;
                }

                return _context3.abrupt("continue", 33);

              case 32:
                arMessages.push(_objectSpread(_objectSpread({}, result[i]), messages));

              case 33:
                i++;
                _context3.next = 15;
                break;

              case 36:
                return _context3.abrupt("return", arMessages);

              case 39:
                _context3.prev = 39;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  err: 2001000,
                  msg: 'CMessage Get'
                };

              case 43:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 39]]);
      }));

      function Get(_x3) {
        return _Get.apply(this, arguments);
      }

      return Get;
    }()
  }]);

  return _default;
}();

exports["default"] = _default;