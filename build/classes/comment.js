"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _db = require("./db");

var _file = _interopRequireDefault(require("./file"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
    //новый комментарий
    value: function () {
      var _Add = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fields) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                if (fields.owner_id > 0) fields.user_id = fields.owner_id;else fields.group_id = fields.owner_id; //удаляем лишний

                delete fields.owner_id;
                _context.next = 5;
                return _db.DB.Init.Insert('comments', fields, "ID");

              case 5:
                result = _context.sent;
                return _context.abrupt("return", result[0]);

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw {
                  err: 2001000,
                  msg: 'CComment Add'
                };

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 9]]);
      }));

      function Add(_x) {
        return _Add.apply(this, arguments);
      }

      return Add;
    }() //загрузка списка

  }, {
    key: "Get",
    value: function () {
      var _Get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                sql = "SELECT * FROM comments WHERE module=$1 AND object_id=$2 ";
                sql += " LIMIT $3 OFFSET $4 ";
                console.log(sql);
                _context3.next = 6;
                return _db.DB.Init.Query(sql, [fields.module, fields.object_id, fields.count, fields.offset]);

              case 6:
                result = _context3.sent;
                _context3.next = 9;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(item, i) {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            if (!item.files) {
                              _context2.next = 5;
                              break;
                            }

                            _context2.next = 3;
                            return _file["default"].GetById(item.files, true);

                          case 3:
                            item.files = _context2.sent;
                            item.files = item.files;

                          case 5:
                            return _context2.abrupt("return", item);

                          case 6:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x3, _x4) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 9:
                result = _context3.sent;
                return _context3.abrupt("return", result);

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  err: 2001000,
                  msg: 'CComment Get'
                };

              case 17:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 13]]);
      }));

      function Get(_x2) {
        return _Get.apply(this, arguments);
      }

      return Get;
    }() //количество

  }, {
    key: "Count",
    value: function () {
      var _Count = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                sql = "SELECT COUNT(*) FROM comments WHERE module=$1 AND object_id=$2";
                console.log(sql);
                _context4.next = 5;
                return _db.DB.Init.Query(sql, [fields.module, fields.object_id]);

              case 5:
                result = _context4.sent;
                console.log(result);
                return _context4.abrupt("return", Number(result[0].count));

              case 10:
                _context4.prev = 10;
                _context4.t0 = _context4["catch"](0);
                console.log(_context4.t0);
                throw {
                  err: 2001000,
                  msg: 'CComment Count'
                };

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 10]]);
      }));

      function Count(_x5) {
        return _Count.apply(this, arguments);
      }

      return Count;
    }() //пользователи

  }, {
    key: "GetUsers",
    value: function () {
      var _GetUsers = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(items) {
        var arUsersId, sql, users;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;

                if (!(!items || !items.length)) {
                  _context6.next = 3;
                  break;
                }

                return _context6.abrupt("return", []);

              case 3:
                arUsersId = items.map(function (comment, i) {
                  return comment.user_id;
                }); //удаление одинаковых id из массива

                arUsersId = Array.from(new Set(arUsersId));
                sql = "SELECT id,login,name,date_create,personal_birthday,personal_photo FROM users WHERE id in (".concat(arUsersId, ")");
                console.log(sql);
                _context6.next = 9;
                return _db.DB.Init.Query(sql);

              case 9:
                users = _context6.sent;
                _context6.next = 12;
                return Promise.all(users.map( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(user, i) {
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            if (!user.personal_photo) {
                              _context5.next = 5;
                              break;
                            }

                            _context5.next = 3;
                            return _file["default"].GetById([user.personal_photo]);

                          case 3:
                            user.personal_photo = _context5.sent;
                            user.personal_photo = user.personal_photo[0];

                          case 5:
                            return _context5.abrupt("return", user);

                          case 6:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }));

                  return function (_x7, _x8) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 12:
                users = _context6.sent;
                return _context6.abrupt("return", users);

              case 16:
                _context6.prev = 16;
                _context6.t0 = _context6["catch"](0);
                console.log(_context6.t0);
                throw {
                  err: 2001000,
                  msg: 'CComment GetUsers'
                };

              case 20:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 16]]);
      }));

      function GetUsers(_x6) {
        return _GetUsers.apply(this, arguments);
      }

      return GetUsers;
    }()
  }]);

  return _default;
}();

exports["default"] = _default;