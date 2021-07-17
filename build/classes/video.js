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
    key: "Edit",
    value: //добавить новое видео
    function () {
      var _Edit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fields, where) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                // сделать проверку, что файл и альбом твои

                /*
                            let arFields = {
                                file_id: fields.file_id,
                                title: fields.title,
                                text: fields.text
                            }
                */
                if (!fields.file_id) delete fields.file_id;
                if (!fields.title) delete fields.title; //if (!fields.text) delete fields.text

                _context.next = 5;
                return _db.DB.Init.Update("".concat(_db.DB.Init.TablePrefix, "file"), fields, where, null);

              case 5:
                return _context.abrupt("return", true);

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw {
                  err: 8001000,
                  msg: 'CVideo Edit'
                };

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 8]]);
      }));

      function Edit(_x, _x2) {
        return _Edit.apply(this, arguments);
      }

      return Edit;
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
                return _db.DB.Init.Query("SELECT * FROM ".concat(_db.DB.Init.TablePrefix, "file WHERE id in (").concat(ids, ") AND ((type='video/mp4') OR (type='video/avi')) ORDER BY id DESC"));

              case 4:
                result = _context3.sent;
                _context3.next = 7;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(item, i) {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            /* загрузка инфы о файле */

                            /*
                            if (item.file) {
                                item.file = await CFile.GetById([item.file]);
                                item.file = item.file[0]
                            }
                              if (item.file_preview) {
                                item.file_preview = await CFile.GetById([item.file_preview]);
                                item.file_preview = item.file_preview[0]
                            }*/
                            if (item.text === null) item.text = '';
                            /* загрузка инфы о файле */

                            if (!item.file_id) {
                              _context2.next = 6;
                              break;
                            }

                            _context2.next = 4;
                            return _file["default"].GetById([item.file_id]);

                          case 4:
                            item.file_id = _context2.sent;
                            item.file_id = item.file_id[0];

                          case 6:
                            return _context2.abrupt("return", item);

                          case 7:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x4, _x5) {
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
                  err: 8001000,
                  msg: 'CVideo GetById'
                };

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 11]]);
      }));

      function GetById(_x3) {
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
                sql = "SELECT * FROM ".concat(_db.DB.Init.TablePrefix, "file WHERE owner_id=").concat(fields.owner_id, " AND ((type='video/mp4') OR (type='video/avi')) ORDER BY id DESC");
                /* видео из альбома */

                if (fields.album_id) sql = "SELECT ".concat(_db.DB.Init.TablePrefix, "file.*\n                    FROM ").concat(_db.DB.Init.TablePrefix, "album_video_link\n                    INNER JOIN ").concat(_db.DB.Init.TablePrefix, "file ON ").concat(_db.DB.Init.TablePrefix, "file.id = ").concat(_db.DB.Init.TablePrefix, "album_video_link.object_id WHERE ").concat(_db.DB.Init.TablePrefix, "album_video_link.album_id = ").concat(fields.album_id, " AND (").concat(_db.DB.Init.TablePrefix, "file.type='video/mp4') ORDER BY id DESC");
                sql += " LIMIT $1 OFFSET $2 ";
                _context5.next = 6;
                return _db.DB.Init.Query(sql, [fields.count, fields.offset]);

              case 6:
                result = _context5.sent;
                _context5.next = 9;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(item, i) {
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            if (!item.file_id) {
                              _context4.next = 5;
                              break;
                            }

                            _context4.next = 3;
                            return _file["default"].GetById([item.file_id]);

                          case 3:
                            item.file_id = _context4.sent;
                            item.file_id = item.file_id[0];

                          case 5:
                            return _context4.abrupt("return", item);

                          case 6:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));

                  return function (_x7, _x8) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 9:
                result = _context5.sent;
                return _context5.abrupt("return", result);

              case 13:
                _context5.prev = 13;
                _context5.t0 = _context5["catch"](0);
                console.log(_context5.t0);
                throw {
                  err: 8001000,
                  msg: 'CVideo Get'
                };

              case 17:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 13]]);
      }));

      function Get(_x6) {
        return _Get.apply(this, arguments);
      }

      return Get;
    }() //количество

  }, {
    key: "GetCount",
    value: function () {
      var _GetCount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                sql = "SELECT COUNT(*) FROM ".concat(_db.DB.Init.TablePrefix, "file WHERE owner_id=").concat(fields.owner_id, " AND ((type='video/mp4') OR (type='video/avi'))");
                /* видео из альбома */

                if (fields.album_id) sql = "SELECT COUNT(*)\n                    FROM ".concat(_db.DB.Init.TablePrefix, "album_video_link\n                    LEFT JOIN ").concat(_db.DB.Init.TablePrefix, "file ON ").concat(_db.DB.Init.TablePrefix, "album_video_link.object_id = ").concat(_db.DB.Init.TablePrefix, "file.id\n                    WHERE ").concat(_db.DB.Init.TablePrefix, "album_video_link.album_id = ").concat(fields.album_id, " AND ((").concat(_db.DB.Init.TablePrefix, "file.type='video/mp4') OR (").concat(_db.DB.Init.TablePrefix, "file.type='video/avi'))");
                _context6.next = 5;
                return _db.DB.Init.Query(sql);

              case 5:
                result = _context6.sent;
                return _context6.abrupt("return", Number(result[0].count));

              case 9:
                _context6.prev = 9;
                _context6.t0 = _context6["catch"](0);
                console.log(_context6.t0);
                throw {
                  err: 8001000,
                  msg: 'CVideo GetCount'
                };

              case 13:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 9]]);
      }));

      function GetCount(_x9) {
        return _GetCount.apply(this, arguments);
      }

      return GetCount;
    }() //количество всех видео

  }, {
    key: "Count",
    value: function () {
      var _Count = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                sql = "SELECT COUNT(*) FROM ".concat(_db.DB.Init.TablePrefix, "file WHERE (type='video/mp4') OR (type='video/avi')");
                _context7.next = 4;
                return _db.DB.Init.Query(sql);

              case 4:
                result = _context7.sent;
                return _context7.abrupt("return", Number(result[0].count));

              case 8:
                _context7.prev = 8;
                _context7.t0 = _context7["catch"](0);
                console.log(_context7.t0);
                throw {
                  err: 8001000,
                  msg: 'CVideo Count'
                };

              case 12:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 8]]);
      }));

      function Count(_x10) {
        return _Count.apply(this, arguments);
      }

      return Count;
    }() //пользователи

  }, {
    key: "GetUsers",
    value: function () {
      var _GetUsers = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(items) {
        var arUsersId, sql, users;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;

                if (!(!items || !items.length)) {
                  _context9.next = 3;
                  break;
                }

                return _context9.abrupt("return", []);

              case 3:
                /* выгрузка индентификаторов из объектов / пользователей */
                arUsersId = items.map(function (item, i) {
                  return item.from_id;
                }); //удаление одинаковых id из массива

                arUsersId = Array.from(new Set(arUsersId));
                sql = "SELECT id,login,first_name,create_date,birthday,photo FROM ".concat(_db.DB.Init.TablePrefix, "user WHERE id in (").concat(arUsersId, ")");
                _context9.next = 8;
                return _db.DB.Init.Query(sql);

              case 8:
                users = _context9.sent;
                _context9.next = 11;
                return Promise.all(users.map( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(user, i) {
                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            if (!user.photo) {
                              _context8.next = 5;
                              break;
                            }

                            _context8.next = 3;
                            return _file["default"].GetById([user.photo]);

                          case 3:
                            user.photo = _context8.sent;
                            user.photo = user.photo[0];

                          case 5:
                            return _context8.abrupt("return", user);

                          case 6:
                          case "end":
                            return _context8.stop();
                        }
                      }
                    }, _callee8);
                  }));

                  return function (_x12, _x13) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 11:
                users = _context9.sent;
                return _context9.abrupt("return", users);

              case 15:
                _context9.prev = 15;
                _context9.t0 = _context9["catch"](0);
                console.log(_context9.t0);
                throw {
                  err: 8001000,
                  msg: 'CVideo GetUsers'
                };

              case 19:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[0, 15]]);
      }));

      function GetUsers(_x11) {
        return _GetUsers.apply(this, arguments);
      }

      return GetUsers;
    }() //поиск по обсуждениям

  }, {
    key: "Search",
    value: function () {
      var _Search = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(fields) {
        var there, sql, result;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                there = [" ((type='video/mp4') OR (type='video/avi')) "];
                if (fields.q) there.push(" to_tsvector(title) @@ websearch_to_tsquery('".concat(fields.q.toLowerCase(), "') ")); //в нижний регистр
                //запрос
                //let sql = `SELECT * FROM ${DB.Init.TablePrefix}video `

                sql = "SELECT * FROM ".concat(_db.DB.Init.TablePrefix, "file "); //объединеие параметров запроса

                if (there.length) sql += "WHERE " + there.join(' AND ');
                sql += " LIMIT $1 OFFSET $2";
                _context11.next = 8;
                return _db.DB.Init.Query(sql, [fields.count, fields.offset]);

              case 8:
                result = _context11.sent;
                console.log(sql);
                _context11.next = 12;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(item, i) {
                    return regeneratorRuntime.wrap(function _callee10$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            if (!item.file_id) {
                              _context10.next = 4;
                              break;
                            }

                            _context10.next = 3;
                            return _file["default"].GetById(item.file_id);

                          case 3:
                            item.file_id = _context10.sent;

                          case 4:
                            return _context10.abrupt("return", item);

                          case 5:
                          case "end":
                            return _context10.stop();
                        }
                      }
                    }, _callee10);
                  }));

                  return function (_x15, _x16) {
                    return _ref4.apply(this, arguments);
                  };
                }()));

              case 12:
                result = _context11.sent;
                return _context11.abrupt("return", result);

              case 16:
                _context11.prev = 16;
                _context11.t0 = _context11["catch"](0);
                console.log(_context11.t0);
                throw {
                  err: 7001000,
                  msg: 'CVideo Search'
                };

              case 20:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, null, [[0, 16]]);
      }));

      function Search(_x14) {
        return _Search.apply(this, arguments);
      }

      return Search;
    }() //количество / поиск

  }, {
    key: "SearchCount",
    value: function () {
      var _SearchCount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(fields) {
        var there, sql, result;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                there = [" ((type='video/mp4') OR (type='video/avi')) "];
                if (fields.q) there.push(" to_tsvector(title) @@ websearch_to_tsquery('".concat(fields.q.toLowerCase(), "') ")); //в нижний регистр
                //запрос
                //let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}video `

                sql = "SELECT COUNT(*) FROM ".concat(_db.DB.Init.TablePrefix, "file "); //объединеие параметров запроса

                if (there.length) sql += "WHERE " + there.join(' AND ');
                console.log(sql);
                _context12.next = 8;
                return _db.DB.Init.Query(sql);

              case 8:
                result = _context12.sent;
                return _context12.abrupt("return", Number(result[0].count));

              case 12:
                _context12.prev = 12;
                _context12.t0 = _context12["catch"](0);
                console.log(_context12.t0);
                throw {
                  err: 7001000,
                  msg: 'CVideo SearchCount'
                };

              case 16:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, null, [[0, 12]]);
      }));

      function SearchCount(_x17) {
        return _SearchCount.apply(this, arguments);
      }

      return SearchCount;
    }()
  }]);

  return _default;
}();

exports["default"] = _default;