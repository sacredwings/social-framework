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
                return _db.DB.Init.Insert("".concat(_db.DB.Init.TablePrefix, "message"), fields, "ID");

              case 3:
                result = _context.sent;
                return _context.abrupt("return", result[0]);

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw {
                  err: 5001000,
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
                sql = "SELECT ".concat(_db.DB.Init.TablePrefix, "message.*,\n\nfrom_user.login as from_user_login,\nfrom_user.photo as from_user_photo,\nfrom_user.gender as from_user_gender,\nfrom_user.first_name as from_user_first_name,\n\nto_user.login as to_user_login,\nto_user.photo as to_user_photo,\nto_user.gender as to_user_gender,\nto_user.first_name as to_user_first_name\n\nFROM ").concat(_db.DB.Init.TablePrefix, "message\nLEFT JOIN ").concat(_db.DB.Init.TablePrefix, "user AS from_user ON ").concat(_db.DB.Init.TablePrefix, "message.from_id=from_user.id \nLEFT JOIN ").concat(_db.DB.Init.TablePrefix, "user AS to_user ON ").concat(_db.DB.Init.TablePrefix, "message.to_id=to_user.id \nWHERE (from_id=$1 AND to_id=$2) OR (from_id=$2 AND to_id=$1)");
                sql += " LIMIT $3 OFFSET $4 ";
                _context2.next = 5;
                return _db.DB.Init.Query(sql, [fields.from_id, fields.to_id, fields.count, fields.offset]);

              case 5:
                result = _context2.sent;
                arMessages = []; //массив сообщений уникальных пользователей
                //уникальность массива

                for (i = 0; i < result.length; i++) {
                  //добавление новых полей к массиву
                  messages = {}; //добавление новых полей

                  if (Number(result[i].from_id) === fields.from_id) {
                    messages.user_id = Number(result[i].to_id);
                    messages.user_first_name = result[i].to_user_first_name;
                    messages["in"] = false;
                  } else {
                    messages.user_id = Number(result[i].from_id);
                    messages.user_first_name = result[i].from_user_first_name;
                    messages["in"] = true;
                  }

                  messages.from_id = Number(result[i].from_id);
                  messages.to_id = Number(result[i].to_id); //удаление не актуальных полей
                  //delete result[i].id
                  //delete result[i].from_id
                  //delete result[i].to_id

                  arMessages.push(_objectSpread(_objectSpread({}, result[i]), messages));
                }

                return _context2.abrupt("return", arMessages);

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                throw {
                  err: 5002000,
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
                sql = "SELECT *\nFROM ".concat(_db.DB.Init.TablePrefix, "message\nWHERE ").concat(_db.DB.Init.TablePrefix, "message.from_id=$1 AND (").concat(_db.DB.Init.TablePrefix, "message.to_id, ").concat(_db.DB.Init.TablePrefix, "message.create_date) in \n\n(SELECT to_id, max(create_date)\nFROM ").concat(_db.DB.Init.TablePrefix, "message \nWHERE from_id=$1\nGROUP BY to_id)");
                sql += " LIMIT $2 OFFSET $3 "; //запрос

                _context3.next = 5;
                return _db.DB.Init.Query(sql, [fields.from_id, fields.count, fields.offset]);

              case 5:
                outMes = _context3.sent;
                //ВХОДЯЩИЕ
                sql = "SELECT *\nFROM ".concat(_db.DB.Init.TablePrefix, "message\nWHERE ").concat(_db.DB.Init.TablePrefix, "message.to_id=$1 AND (").concat(_db.DB.Init.TablePrefix, "message.from_id, ").concat(_db.DB.Init.TablePrefix, "message.create_date) in \n\n(SELECT from_id, max(create_date)\nFROM ").concat(_db.DB.Init.TablePrefix, "message \nWHERE to_id=$1\nGROUP BY from_id)");
                sql += " LIMIT $2 OFFSET $3 "; //запрос

                _context3.next = 10;
                return _db.DB.Init.Query(sql, [fields.from_id, fields.count, fields.offset]);

              case 10:
                inMes = _context3.sent;
                //объединение входящих и исходящих сообщений
                result = outMes.concat(inMes); //ОБЪЕДИНЕНИЕ ВХОДЯЩИХ и ИСХОДЯЩИХ сообщений

                arMessages = []; //массив сообщений уникальных пользователей

                CheckContinue = false; //выйти из цикла до сохранения элемента массива
                //уникальность массива

                i = 0;

              case 15:
                if (!(i < result.length)) {
                  _context3.next = 39;
                  break;
                }

                CheckContinue = false; //сброс чека / выход из цикла
                //добавление новых полей к массиву

                messages = {}; //добавление новых полей

                if (Number(result[i].from_id) === fields.from_id) {
                  messages.user_id = Number(result[i].to_id);
                  messages["in"] = false;
                } else {
                  messages.user_id = Number(result[i].from_id);
                  messages["in"] = true;
                } //удаление не актуальных полей


                delete result[i].id;
                delete result[i].from_id;
                delete result[i].to_id;
                delete result[i].delete_from;
                delete result[i].delete_to;
                delete result[i].important; //проходим по массиву еще раз и ищем такой же

                j = 0;

              case 26:
                if (!(j < arMessages.length)) {
                  _context3.next = 33;
                  break;
                }

                if (!(messages.user_id === arMessages[j].user_id)) {
                  _context3.next = 30;
                  break;
                }

                CheckContinue = true;
                return _context3.abrupt("break", 33);

              case 30:
                j++;
                _context3.next = 26;
                break;

              case 33:
                if (!CheckContinue) {
                  _context3.next = 35;
                  break;
                }

                return _context3.abrupt("continue", 36);

              case 35:
                arMessages.push(_objectSpread(_objectSpread({}, result[i]), messages));

              case 36:
                i++;
                _context3.next = 15;
                break;

              case 39:
                return _context3.abrupt("return", arMessages);

              case 42:
                _context3.prev = 42;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  err: 5003000,
                  msg: 'CMessage Get'
                };

              case 46:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 42]]);
      }));

      function Get(_x3) {
        return _Get.apply(this, arguments);
      }

      return Get;
    }()
  }, {
    key: "Count",
    value: function () {
      var _Count = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(fields) {
        var count;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                count = "SELECT COUNT(*) FROM ".concat(_db.DB.Init.TablePrefix, "message WHERE from_id=$1 OR to_id=$1 GROUP BY from_id");
                _context4.next = 4;
                return _db.DB.Init.Query(count, [fields.from_id]);

              case 4:
                count = _context4.sent;
                return _context4.abrupt("return", count.length);

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](0);
                console.log(_context4.t0);
                throw {
                  err: 5003000,
                  msg: 'CMessage Count'
                };

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 8]]);
      }));

      function Count(_x4) {
        return _Count.apply(this, arguments);
      }

      return Count;
    }() //пользователи

  }, {
    key: "GetUsers",
    value: function () {
      var _GetUsers = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(items) {
        var arUsersId, sql, users;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;

                if (!(!items || !items.length)) {
                  _context5.next = 3;
                  break;
                }

                return _context5.abrupt("return", []);

              case 3:
                /* выгрузка индентификаторов из объектов / пользователей */
                arUsersId = items.map(function (item, i) {
                  return item.user_id;
                }); //удаление одинаковых id из массива

                arUsersId = Array.from(new Set(arUsersId));
                sql = "SELECT id,login,first_name,create_date,birthday FROM ".concat(_db.DB.Init.TablePrefix, "user WHERE id in (").concat(arUsersId, ")");
                _context5.next = 8;
                return _db.DB.Init.Query(sql);

              case 8:
                users = _context5.sent;
                return _context5.abrupt("return", users);

              case 12:
                _context5.prev = 12;
                _context5.t0 = _context5["catch"](0);
                console.log(_context5.t0);
                throw {
                  err: 8001000,
                  msg: 'CMessage GetUsers'
                };

              case 16:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 12]]);
      }));

      function GetUsers(_x5) {
        return _GetUsers.apply(this, arguments);
      }

      return GetUsers;
    }() //добавить новое видео

  }, {
    key: "MarkAsReadAll",
    value: function () {
      var _MarkAsReadAll = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                sql = "UPDATE ".concat(_db.DB.Init.TablePrefix, "message SET read = true WHERE from_id=").concat(fields.from_id, " AND to_id=").concat(fields.to_id, " AND id < ").concat(fields.start_message_id);
                console.log(sql);
                _context6.next = 5;
                return _db.DB.Init.Query(sql);

              case 5:
                result = _context6.sent;
                _context6.next = 12;
                break;

              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6["catch"](0);
                console.log(_context6.t0);
                throw {
                  err: 5004000,
                  msg: 'CMessage MarkAsReadAll'
                };

              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 8]]);
      }));

      function MarkAsReadAll(_x6) {
        return _MarkAsReadAll.apply(this, arguments);
      }

      return MarkAsReadAll;
    }() //добавить новое видео

  }, {
    key: "MarkAsRead",
    value: function () {
      var _MarkAsRead = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                sql = "UPDATE ".concat(_db.DB.Init.TablePrefix, "message SET read = true WHERE from_id=").concat(fields.from_id, " AND id in (").concat(fields.message_ids, ")");
                _context7.next = 4;
                return _db.DB.Init.Query(sql);

              case 4:
                result = _context7.sent;
                _context7.next = 11;
                break;

              case 7:
                _context7.prev = 7;
                _context7.t0 = _context7["catch"](0);
                console.log(_context7.t0);
                throw {
                  err: 5005000,
                  msg: 'CMessage Add'
                };

              case 11:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 7]]);
      }));

      function MarkAsRead(_x7) {
        return _MarkAsRead.apply(this, arguments);
      }

      return MarkAsRead;
    }()
  }]);

  return _default;
}();

exports["default"] = _default;