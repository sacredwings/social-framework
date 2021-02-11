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
    value: //добавить новую группу
    function () {
      var _Add = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fields) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _db.DB.Init.Insert("".concat(_db.DB.Init.TablePrefix, "group"), fields, "ID");

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
                return _db.DB.Init.Query("SELECT * FROM ".concat(_db.DB.Init.TablePrefix, "group WHERE id in (").concat(ids, ")"));

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
                sql = "SELECT * FROM ".concat(_db.DB.Init.TablePrefix, "group WHERE create_id=").concat(fields.owner_id);
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
                            if (item.type) item.type = Number(item.type);
                            if (item.photo) item.photo = Number(item.photo);
                            if (item.create_id) item.create_id = Number(item.create_id);
                            /* загрузка инфы о файле */

                            if (!item.photo) {
                              _context4.next = 8;
                              break;
                            }

                            _context4.next = 6;
                            return _file["default"].GetById([item.photo]);

                          case 6:
                            item.photo = _context4.sent;
                            item.photo = item.photo[0];

                          case 8:
                            return _context4.abrupt("return", item);

                          case 9:
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
                sql = "SELECT COUNT(*) FROM ".concat(_db.DB.Init.TablePrefix, "group WHERE create_id=").concat(fields.owner_id);
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
      var _GetUsers = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(items) {
        var arUsersId, sql, users;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;

                if (!(!items || !items.length)) {
                  _context8.next = 3;
                  break;
                }

                return _context8.abrupt("return", []);

              case 3:
                /* выгрузка индентификаторов из объектов / пользователей */
                arUsersId = items.map(function (item, i) {
                  return item.create_id;
                }); //удаление одинаковых id из массива

                arUsersId = Array.from(new Set(arUsersId));
                sql = "SELECT id,login,first_name,create_date,birthday,photo FROM ".concat(_db.DB.Init.TablePrefix, "user WHERE id in (").concat(arUsersId, ")");
                _context8.next = 8;
                return _db.DB.Init.Query(sql);

              case 8:
                users = _context8.sent;
                _context8.next = 11;
                return Promise.all(users.map( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(user, i) {
                    return regeneratorRuntime.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            if (!user.photo) {
                              _context7.next = 5;
                              break;
                            }

                            _context7.next = 3;
                            return _file["default"].GetById([user.photo]);

                          case 3:
                            user.photo = _context7.sent;
                            user.photo = user.photo[0];

                          case 5:
                            return _context7.abrupt("return", user);

                          case 6:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7);
                  }));

                  return function (_x10, _x11) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 11:
                users = _context8.sent;
                return _context8.abrupt("return", users);

              case 15:
                _context8.prev = 15;
                _context8.t0 = _context8["catch"](0);
                console.log(_context8.t0);
                throw {
                  err: 4005000,
                  msg: 'CGroup GetUsers'
                };

              case 19:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[0, 15]]);
      }));

      function GetUsers(_x9) {
        return _GetUsers.apply(this, arguments);
      }

      return GetUsers;
    }()
  }, {
    key: "Update",
    value: function () {
      var _Update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(id, fields) {
        var salt, result;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;

                if (!fields.password) {
                  _context9.next = 8;
                  break;
                }

                _context9.next = 4;
                return bcrypt.genSalt();

              case 4:
                salt = _context9.sent;
                _context9.next = 7;
                return bcrypt.hash(fields.password, salt);

              case 7:
                fields.password = _context9.sent;

              case 8:
                console.log(fields);
                _context9.next = 11;
                return _db.DB.Init.Update("".concat(_db.DB.Init.TablePrefix, "group"), fields, {
                  id: id
                }, "id");

              case 11:
                result = _context9.sent;
                return _context9.abrupt("return", result[0]);

              case 15:
                _context9.prev = 15;
                _context9.t0 = _context9["catch"](0);
                console.log(_context9.t0);
                throw {
                  err: 4006000,
                  msg: 'CGroup Update'
                };

              case 19:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[0, 15]]);
      }));

      function Update(_x12, _x13) {
        return _Update.apply(this, arguments);
      }

      return Update;
    }() //удаление группы

  }, {
    key: "Delete",
    value: function () {
      var _Delete = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(id) {
        var result;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                _context10.next = 3;
                return _db.DB.Init.Update("groups", {
                  "delete": true
                }, {
                  id: id
                }, "id");

              case 3:
                result = _context10.sent;
                return _context10.abrupt("return", result[0]);

              case 7:
                _context10.prev = 7;
                _context10.t0 = _context10["catch"](0);
                console.log(_context10.t0);
                throw {
                  err: 4007000,
                  msg: 'CGroup Delete'
                };

              case 11:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[0, 7]]);
      }));

      function Delete(_x14) {
        return _Delete.apply(this, arguments);
      }

      return Delete;
    }() //поиск по группам

  }, {
    key: "Search",
    value: function () {
      var _Search = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(fields) {
        var there, sql, result;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                there = [];
                if (fields.q) there.push(" to_tsvector(title) @@ websearch_to_tsquery('".concat(fields.q.toLowerCase(), "') ")); //в нижний регистр
                //запрос

                sql = "SELECT * FROM ".concat(_db.DB.Init.TablePrefix, "group "); //объединеие параметров запроса

                if (there.length) sql += "WHERE " + there.join(' AND ');
                sql += " LIMIT $1 OFFSET $2";
                _context12.next = 8;
                return _db.DB.Init.Query(sql, [fields.count, fields.offset]);

              case 8:
                result = _context12.sent;
                console.log(sql);
                _context12.next = 12;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(item, i) {
                    return regeneratorRuntime.wrap(function _callee11$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            if (item.type) item.type = Number(item.type);
                            if (item.photo) item.photo = Number(item.photo);
                            if (item.create_id) item.create_id = Number(item.create_id);
                            /* загрузка инфы о файле */

                            if (!item.photo) {
                              _context11.next = 8;
                              break;
                            }

                            _context11.next = 6;
                            return _file["default"].GetById([item.photo]);

                          case 6:
                            item.photo = _context11.sent;
                            item.photo = item.photo[0];

                          case 8:
                            return _context11.abrupt("return", item);

                          case 9:
                          case "end":
                            return _context11.stop();
                        }
                      }
                    }, _callee11);
                  }));

                  return function (_x16, _x17) {
                    return _ref4.apply(this, arguments);
                  };
                }()));

              case 12:
                result = _context12.sent;
                return _context12.abrupt("return", result);

              case 16:
                _context12.prev = 16;
                _context12.t0 = _context12["catch"](0);
                console.log(_context12.t0);
                throw {
                  err: 7001000,
                  msg: 'CGroup Search'
                };

              case 20:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, null, [[0, 16]]);
      }));

      function Search(_x15) {
        return _Search.apply(this, arguments);
      }

      return Search;
    }() //количество / поиск по группам

  }, {
    key: "SearchCount",
    value: function () {
      var _SearchCount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(fields) {
        var there, sql, result;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0;
                there = [];
                if (fields.q) there.push(" to_tsvector(title) @@ websearch_to_tsquery('".concat(fields.q.toLowerCase(), "') ")); //в нижний регистр
                //запрос

                sql = "SELECT COUNT(*) FROM ".concat(_db.DB.Init.TablePrefix, "group "); //объединеие параметров запроса

                if (there.length) sql += "WHERE " + there.join(' AND ');
                console.log(sql);
                _context13.next = 8;
                return _db.DB.Init.Query(sql);

              case 8:
                result = _context13.sent;
                return _context13.abrupt("return", Number(result[0].count));

              case 12:
                _context13.prev = 12;
                _context13.t0 = _context13["catch"](0);
                console.log(_context13.t0);
                throw {
                  err: 7001000,
                  msg: 'CGroup SearchCount'
                };

              case 16:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, null, [[0, 12]]);
      }));

      function SearchCount(_x18) {
        return _SearchCount.apply(this, arguments);
      }

      return SearchCount;
    }()
  }]);

  return _default;
}();

exports["default"] = _default;