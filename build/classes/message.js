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
    value: //добавить новое видео
    function () {
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
                sql = "SELECT *\nFROM ".concat(_db.DB.Init.TablePrefix, "message\nWHERE ((from_id=$1 AND to_id=$2) OR (from_id=$2 AND to_id=$1)) AND delete_from IS NOT true ORDER BY id DESC");
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
                    messages["in"] = false;
                  } else {
                    messages.user_id = Number(result[i].from_id);
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
                  msg: 'CMessage GetByUserId'
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
    key: "CountGetByUserId",
    value: function () {
      var _CountGetByUserId = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(fields) {
        var count;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                count = "SELECT COUNT(*)\nFROM ".concat(_db.DB.Init.TablePrefix, "message\nWHERE (from_id=$1 AND to_id=$2) OR (from_id=$2 AND to_id=$1) AND delete_from IS NOT true");
                _context3.next = 4;
                return _db.DB.Init.Query(count, [fields.from_id, fields.to_id]);

              case 4:
                count = _context3.sent;
                return _context3.abrupt("return", Number(count[0].count));

              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  err: 5003000,
                  msg: 'CMessage CountGetByUserId'
                };

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 8]]);
      }));

      function CountGetByUserId(_x3) {
        return _CountGetByUserId.apply(this, arguments);
      }

      return CountGetByUserId;
    }()
  }, {
    key: "Get",
    value: function () {
      var _Get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(fields) {
        var sql, result, arMessages, CheckContinue, i, messages, j;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                sql = "\n            SELECT *\n            FROM\n            sf_message\n            WHERE (from_id, to_id, create_date) in\n\n            (SELECT from_id, to_id, max(create_date)\n            FROM sf_message\n            WHERE (from_id=$1 OR to_id=$1) AND delete_from IS NOT true \n            GROUP BY to_id, from_id) ORDER BY create_date DESC";
                sql += " LIMIT $2 OFFSET $3 "; //запрос

                _context4.next = 5;
                return _db.DB.Init.Query(sql, [fields.from_id, fields.count, fields.offset]);

              case 5:
                result = _context4.sent;
                //ОБЪЕДИНЕНИЕ ВХОДЯЩИХ и ИСХОДЯЩИХ сообщений
                arMessages = []; //массив сообщений уникальных пользователей

                CheckContinue = false; //выйти из цикла до сохранения элемента массива
                //уникальность массива

                i = 0;

              case 9:
                if (!(i < result.length)) {
                  _context4.next = 33;
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

              case 20:
                if (!(j < arMessages.length)) {
                  _context4.next = 27;
                  break;
                }

                if (!(messages.user_id === arMessages[j].user_id)) {
                  _context4.next = 24;
                  break;
                }

                CheckContinue = true;
                return _context4.abrupt("break", 27);

              case 24:
                j++;
                _context4.next = 20;
                break;

              case 27:
                if (!CheckContinue) {
                  _context4.next = 29;
                  break;
                }

                return _context4.abrupt("continue", 30);

              case 29:
                arMessages.push(_objectSpread(_objectSpread({}, result[i]), messages));

              case 30:
                i++;
                _context4.next = 9;
                break;

              case 33:
                return _context4.abrupt("return", arMessages);

              case 36:
                _context4.prev = 36;
                _context4.t0 = _context4["catch"](0);
                console.log(_context4.t0);
                throw {
                  err: 5003000,
                  msg: 'CMessage Get'
                };

              case 40:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 36]]);
      }));

      function Get(_x4) {
        return _Get.apply(this, arguments);
      }

      return Get;
    }()
  }, {
    key: "Count",
    value: function () {
      var _Count = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(fields) {
        var count;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                //let count = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}message WHERE from_id=$1 OR to_id=$1 GROUP BY from_id`
                count = "SELECT COUNT(*)\n            FROM sf_message\n            WHERE (from_id=$1 OR to_id=$1) AND delete_from IS NOT true\n            GROUP BY to_id, from_id";
                _context5.next = 4;
                return _db.DB.Init.Query(count, [fields.from_id]);

              case 4:
                count = _context5.sent;
                return _context5.abrupt("return", count.length);

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](0);
                console.log(_context5.t0);
                throw {
                  err: 5003000,
                  msg: 'CMessage Count'
                };

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 8]]);
      }));

      function Count(_x5) {
        return _Count.apply(this, arguments);
      }

      return Count;
    }() //пользователи

  }, {
    key: "GetUsers",
    value: function () {
      var _GetUsers = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(items, all) {
        var arUsersIdAll, arUsersId, arUsers, sql;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;

                if (!(!items || !items.length)) {
                  _context7.next = 3;
                  break;
                }

                return _context7.abrupt("return", []);

              case 3:
                arUsersIdAll = [];
                /* выгрузка индентификаторов из объектов / пользователей */

                arUsersId = items.map(function (item, i) {
                  arUsersIdAll.push(item.from_id);
                  arUsersIdAll.push(item.to_id);
                  return item.user_id;
                });
                arUsers = []; //удаление одинаковых id из массива

                if (all) {
                  arUsers = Array.from(new Set(arUsersIdAll));
                } else {
                  arUsers = Array.from(new Set(arUsersId));
                }

                sql = "SELECT id,login,first_name,create_date,birthday,photo FROM ".concat(_db.DB.Init.TablePrefix, "user WHERE id in (").concat(arUsers, ")");
                _context7.next = 10;
                return _db.DB.Init.Query(sql);

              case 10:
                arUsers = _context7.sent;
                _context7.next = 13;
                return Promise.all(arUsers.map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(user, i) {
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            if (!user.photo) {
                              _context6.next = 5;
                              break;
                            }

                            _context6.next = 3;
                            return _file["default"].GetById([user.photo]);

                          case 3:
                            user.photo = _context6.sent;
                            user.photo = user.photo[0];

                          case 5:
                            return _context6.abrupt("return", user);

                          case 6:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6);
                  }));

                  return function (_x8, _x9) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 13:
                arUsers = _context7.sent;
                return _context7.abrupt("return", arUsers);

              case 17:
                _context7.prev = 17;
                _context7.t0 = _context7["catch"](0);
                console.log(_context7.t0);
                throw {
                  err: 8001000,
                  msg: 'CMessage GetUsers'
                };

              case 21:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 17]]);
      }));

      function GetUsers(_x6, _x7) {
        return _GetUsers.apply(this, arguments);
      }

      return GetUsers;
    }() //прочитать все сообщения с пользователем

  }, {
    key: "MarkAsReadAll",
    value: function () {
      var _MarkAsReadAll = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                sql = "UPDATE ".concat(_db.DB.Init.TablePrefix, "message SET read = true WHERE from_id=").concat(fields.from_id, " AND to_id=").concat(fields.to_id, " AND id < ").concat(fields.start_message_id);
                console.log(sql);
                _context8.next = 5;
                return _db.DB.Init.Query(sql);

              case 5:
                result = _context8.sent;
                _context8.next = 12;
                break;

              case 8:
                _context8.prev = 8;
                _context8.t0 = _context8["catch"](0);
                console.log(_context8.t0);
                throw {
                  err: 5004000,
                  msg: 'CMessage MarkAsReadAll'
                };

              case 12:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[0, 8]]);
      }));

      function MarkAsReadAll(_x10) {
        return _MarkAsReadAll.apply(this, arguments);
      }

      return MarkAsReadAll;
    }() //прочитать выбранные сообщения

  }, {
    key: "MarkAsRead",
    value: function () {
      var _MarkAsRead = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                sql = "UPDATE ".concat(_db.DB.Init.TablePrefix, "message SET read = true WHERE from_id=").concat(fields.from_id, " AND id in (").concat(fields.message_ids, ")");
                _context9.next = 4;
                return _db.DB.Init.Query(sql);

              case 4:
                result = _context9.sent;
                _context9.next = 11;
                break;

              case 7:
                _context9.prev = 7;
                _context9.t0 = _context9["catch"](0);
                console.log(_context9.t0);
                throw {
                  err: 5005000,
                  msg: 'CMessage Add'
                };

              case 11:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[0, 7]]);
      }));

      function MarkAsRead(_x11) {
        return _MarkAsRead.apply(this, arguments);
      }

      return MarkAsRead;
    }() //удалить все сообщения с пользователем

  }, {
    key: "DeleteAll",
    value: function () {
      var _DeleteAll = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                sql = "UPDATE ".concat(_db.DB.Init.TablePrefix, "message SET delete_from = true WHERE (from_id=").concat(fields.from_id, " AND to_id=").concat(fields.to_id, ") OR (to_id=").concat(fields.from_id, " AND from_id=").concat(fields.to_id, ")");
                _context10.next = 4;
                return _db.DB.Init.Query(sql);

              case 4:
                result = _context10.sent;
                _context10.next = 11;
                break;

              case 7:
                _context10.prev = 7;
                _context10.t0 = _context10["catch"](0);
                console.log(_context10.t0);
                throw {
                  err: 5005000,
                  msg: 'CMessage DeleteAll'
                };

              case 11:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[0, 7]]);
      }));

      function DeleteAll(_x12) {
        return _DeleteAll.apply(this, arguments);
      }

      return DeleteAll;
    }() //удалить выбранные сообщения

  }, {
    key: "Delete",
    value: function () {
      var _Delete = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                fields.ids = fields.ids.join(',');
                sql = "UPDATE ".concat(_db.DB.Init.TablePrefix, "message SET delete_from = true WHERE (from_id=").concat(fields.from_id, " OR to_id=").concat(fields.from_id, ") AND id in (").concat(fields.ids, ")");
                _context11.next = 5;
                return _db.DB.Init.Query(sql);

              case 5:
                result = _context11.sent;
                _context11.next = 12;
                break;

              case 8:
                _context11.prev = 8;
                _context11.t0 = _context11["catch"](0);
                console.log(_context11.t0);
                throw {
                  err: 5005000,
                  msg: 'CMessage Add'
                };

              case 12:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, null, [[0, 8]]);
      }));

      function Delete(_x13) {
        return _Delete.apply(this, arguments);
      }

      return Delete;
    }()
  }]);

  return _default;
}();

exports["default"] = _default;