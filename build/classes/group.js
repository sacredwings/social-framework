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
    //добавить новую группу
    value: function () {
      var _Add = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fields) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _db.DB.Init.Insert("groups", fields, "ID");

              case 3:
                result = _context.sent;
                return _context.abrupt("return", result[0]);

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw {
                  err: 4001000,
                  msg: 'CGroup Add'
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
    }() //загрузка по id

  }, {
    key: "GetById",
    value: function () {
      var _GetById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ids) {
        var result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                ids = ids.join(',');
                _context3.next = 4;
                return _db.DB.Init.Query("SELECT * FROM groups WHERE id in (".concat(ids, ")"));

              case 4:
                result = _context3.sent;
                _context3.next = 7;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(item, i) {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            if (!item.photo) {
                              _context2.next = 5;
                              break;
                            }

                            _context2.next = 3;
                            return _file["default"].GetById([item.photo]);

                          case 3:
                            item.photo = _context2.sent;
                            item.photo = item.photo[0];

                          case 5:
                            item.create_id = Number(item.create_id);
                            return _context2.abrupt("return", item);

                          case 7:
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

              case 7:
                result = _context3.sent;
                return _context3.abrupt("return", result);

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  err: 4002000,
                  msg: 'CGroup GetById'
                };

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 11]]);
      }));

      function GetById(_x2) {
        return _GetById.apply(this, arguments);
      }

      return GetById;
    }() //загрузка

  }, {
    key: "Get",
    value: function () {
      var _Get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                sql = "SELECT * FROM groups WHERE create_id=".concat(fields.owner_id);
                sql += " LIMIT $1 OFFSET $2 ";
                _context5.next = 5;
                return _db.DB.Init.Query(sql, [fields.count, fields.offset]);

              case 5:
                result = _context5.sent;
                _context5.next = 8;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(item, i) {
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            if (!item.photo) {
                              _context4.next = 5;
                              break;
                            }

                            _context4.next = 3;
                            return _file["default"].GetById([item.photo]);

                          case 3:
                            item.photo = _context4.sent;
                            item.photo = item.photo[0];

                          case 5:
                            return _context4.abrupt("return", item);

                          case 6:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));

                  return function (_x6, _x7) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 8:
                result = _context5.sent;
                return _context5.abrupt("return", result);

              case 12:
                _context5.prev = 12;
                _context5.t0 = _context5["catch"](0);
                console.log(_context5.t0);
                throw {
                  err: 4003000,
                  msg: 'CGroup Get'
                };

              case 16:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 12]]);
      }));

      function Get(_x5) {
        return _Get.apply(this, arguments);
      }

      return Get;
    }() //количество

  }, {
    key: "Count",
    value: function () {
      var _Count = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                sql = "SELECT COUNT(*) FROM groups WHERE create_id=".concat(fields.owner_id);
                _context6.next = 4;
                return _db.DB.Init.Query(sql);

              case 4:
                result = _context6.sent;
                return _context6.abrupt("return", Number(result[0].count));

              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6["catch"](0);
                console.log(_context6.t0);
                throw {
                  err: 4004000,
                  msg: 'CGroup Count'
                };

              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 8]]);
      }));

      function Count(_x8) {
        return _Count.apply(this, arguments);
      }

      return Count;
    }() //пользователи

  }, {
    key: "GetUsers",
    value: function () {
      var _GetUsers = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(items) {
        var arUsersId, sql, users;
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
                /* выгрузка индентификаторов из объектов / пользователей */
                arUsersId = items.map(function (item, i) {
                  return item.create_id;
                }); //удаление одинаковых id из массива

                arUsersId = Array.from(new Set(arUsersId));
                sql = "SELECT id,login,name,date_create,personal_birthday FROM users WHERE id in (".concat(arUsersId, ")");
                _context7.next = 8;
                return _db.DB.Init.Query(sql);

              case 8:
                users = _context7.sent;
                return _context7.abrupt("return", users);

              case 12:
                _context7.prev = 12;
                _context7.t0 = _context7["catch"](0);
                console.log(_context7.t0);
                throw {
                  err: 4005000,
                  msg: 'CGroup GetUsers'
                };

              case 16:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 12]]);
      }));

      function GetUsers(_x9) {
        return _GetUsers.apply(this, arguments);
      }

      return GetUsers;
    }()
  }, {
    key: "Update",
    value: function () {
      var _Update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(id, fields) {
        var salt, result;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;

                if (!fields.password) {
                  _context8.next = 8;
                  break;
                }

                _context8.next = 4;
                return bcrypt.genSalt();

              case 4:
                salt = _context8.sent;
                _context8.next = 7;
                return bcrypt.hash(fields.password, salt);

              case 7:
                fields.password = _context8.sent;

              case 8:
                console.log(fields);
                _context8.next = 11;
                return _db.DB.Init.Update("groups", fields, {
                  id: id
                }, "id");

              case 11:
                result = _context8.sent;
                return _context8.abrupt("return", result[0]);

              case 15:
                _context8.prev = 15;
                _context8.t0 = _context8["catch"](0);
                console.log(_context8.t0);
                throw {
                  err: 4006000,
                  msg: 'CGroup Update'
                };

              case 19:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[0, 15]]);
      }));

      function Update(_x10, _x11) {
        return _Update.apply(this, arguments);
      }

      return Update;
    }() //удаление группы

  }, {
    key: "Delete",
    value: function () {
      var _Delete = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(id) {
        var result;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                _context9.next = 3;
                return _db.DB.Init.Update("groups", {
                  "delete": true
                }, {
                  id: id
                }, "id");

              case 3:
                result = _context9.sent;
                return _context9.abrupt("return", result[0]);

              case 7:
                _context9.prev = 7;
                _context9.t0 = _context9["catch"](0);
                console.log(_context9.t0);
                throw {
                  err: 4007000,
                  msg: 'CGroup Delete'
                };

              case 11:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[0, 7]]);
      }));

      function Delete(_x12) {
        return _Delete.apply(this, arguments);
      }

      return Delete;
    }()
  }]);

  return _default;
}();

exports["default"] = _default;