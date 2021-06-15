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
    value: //новая тема для обсуждений
    function () {
      var _Add = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fields) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                //если владелец не указан
                if (!fields.owner_id) fields.owner_id = fields.from_id; //запись

                _context.next = 4;
                return _db.DB.Init.Insert("".concat(_db.DB.Init.TablePrefix, "article"), fields, "ID");

              case 4:
                result = _context.sent;
                return _context.abrupt("return", result[0]);

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw {
                  err: 6001000,
                  msg: 'CArticle Add'
                };

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 8]]);
      }));

      function Add(_x) {
        return _Add.apply(this, arguments);
      }

      return Add;
    }() //добавить новое видео

  }, {
    key: "InAlbum",
    value: function () {
      var _InAlbum = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(fields) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                // сделать проверку, что файл и альбом твои
                //раскидываем файл по альбомам
                fields.album_ids.map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(item, i) {
                    var arFields;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            arFields = {
                              album_id: item,
                              object_id: fields.object_id,
                              create_id: fields.create_id
                            };
                            console.log(arFields);
                            _context2.next = 4;
                            return _db.DB.Init.Insert("".concat(_db.DB.Init.TablePrefix, "album_article_link"), arFields, "ID");

                          case 4:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x3, _x4) {
                    return _ref.apply(this, arguments);
                  };
                }());
                return _context3.abrupt("return", true);

              case 5:
                _context3.prev = 5;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  err: 8001000,
                  msg: 'CArticle InAlbum'
                };

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 5]]);
      }));

      function InAlbum(_x2) {
        return _InAlbum.apply(this, arguments);
      }

      return InAlbum;
    }() //загрузка по id

  }, {
    key: "GetById",
    value: function () {
      var _GetById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(ids) {
        var result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                ids = ids.join(',');
                _context4.next = 4;
                return _db.DB.Init.Query("SELECT * FROM ".concat(_db.DB.Init.TablePrefix, "article WHERE id in (").concat(ids, ")"));

              case 4:
                result = _context4.sent;
                _context4.next = 11;
                break;

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4["catch"](0);
                console.log(_context4.t0);
                throw {
                  err: 8001000,
                  msg: 'CArticle GetById'
                };

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 7]]);
      }));

      function GetById(_x5) {
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
                sql = "SELECT * FROM ".concat(_db.DB.Init.TablePrefix, "article WHERE owner_id=").concat(fields.owner_id);
                /* видео из альбома */

                if (fields.album_id) sql = "SELECT ".concat(_db.DB.Init.TablePrefix, "article.*\n                    FROM ").concat(_db.DB.Init.TablePrefix, "album_article_link\n                    INNER JOIN ").concat(_db.DB.Init.TablePrefix, "article ON ").concat(_db.DB.Init.TablePrefix, "article.id = ").concat(_db.DB.Init.TablePrefix, "album_article_link.object_id WHERE ").concat(_db.DB.Init.TablePrefix, "album_article_link.album_id = ").concat(fields.album_id, " AND owner_id=").concat(fields.owner_id);
                sql += " LIMIT $1 OFFSET $2 ";
                _context5.next = 6;
                return _db.DB.Init.Query(sql, [fields.count, fields.offset]);

              case 6:
                result = _context5.sent;
                return _context5.abrupt("return", result);

              case 10:
                _context5.prev = 10;
                _context5.t0 = _context5["catch"](0);
                console.log(_context5.t0);
                throw {
                  err: 8001000,
                  msg: 'CArticle Get'
                };

              case 14:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 10]]);
      }));

      function Get(_x6) {
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
                sql = "SELECT COUNT(*) FROM ".concat(_db.DB.Init.TablePrefix, "article WHERE owner_id=").concat(fields.owner_id);
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
                  err: 8001000,
                  msg: 'CArticle Count'
                };

              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 8]]);
      }));

      function Count(_x7) {
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
                  return item.from_id;
                }); //удаление одинаковых id из массива

                arUsersId = Array.from(new Set(arUsersId));
                sql = "SELECT id,login,first_name,create_date,birthday,photo FROM ".concat(_db.DB.Init.TablePrefix, "user WHERE id in (").concat(arUsersId, ")");
                _context8.next = 8;
                return _db.DB.Init.Query(sql);

              case 8:
                users = _context8.sent;
                _context8.next = 11;
                return Promise.all(users.map( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(user, i) {
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

                  return function (_x9, _x10) {
                    return _ref2.apply(this, arguments);
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
                  err: 8001000,
                  msg: 'CArticle GetUsers'
                };

              case 19:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[0, 15]]);
      }));

      function GetUsers(_x8) {
        return _GetUsers.apply(this, arguments);
      }

      return GetUsers;
    }() //добавить новый видео альбом

  }, {
    key: "AddAlbum",
    value: function () {
      var _AddAlbum = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(fields) {
        var result;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                fields.module = 'article'; //если владелец не указан

                if (!fields.owner_id) fields.owner_id = fields.from_id;
                _context9.next = 5;
                return _db.DB.Init.Insert("".concat(_db.DB.Init.TablePrefix, "album"), fields, "ID");

              case 5:
                result = _context9.sent;
                return _context9.abrupt("return", result[0]);

              case 9:
                _context9.prev = 9;
                _context9.t0 = _context9["catch"](0);
                console.log(_context9.t0);
                throw {
                  err: 8001000,
                  msg: 'CArticle AddAlbum'
                };

              case 13:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[0, 9]]);
      }));

      function AddAlbum(_x11) {
        return _AddAlbum.apply(this, arguments);
      }

      return AddAlbum;
    }() //загрузка

  }, {
    key: "GetAlbums",
    value: function () {
      var _GetAlbums = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                sql = "SELECT * FROM ".concat(_db.DB.Init.TablePrefix, "album WHERE owner_id=").concat(fields.owner_id, " AND module='article' ORDER BY title ASC");
                sql += " LIMIT $1 OFFSET $2 ";
                _context11.next = 5;
                return _db.DB.Init.Query(sql, [fields.count, fields.offset]);

              case 5:
                result = _context11.sent;
                _context11.next = 8;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(item, i) {
                    return regeneratorRuntime.wrap(function _callee10$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            if (!item.image_id) {
                              _context10.next = 5;
                              break;
                            }

                            _context10.next = 3;
                            return _file["default"].GetById([item.image_id]);

                          case 3:
                            item.image_id = _context10.sent;
                            item.image_id = item.image_id[0];

                          case 5:
                            return _context10.abrupt("return", item);

                          case 6:
                          case "end":
                            return _context10.stop();
                        }
                      }
                    }, _callee10);
                  }));

                  return function (_x13, _x14) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 8:
                result = _context11.sent;
                return _context11.abrupt("return", result);

              case 12:
                _context11.prev = 12;
                _context11.t0 = _context11["catch"](0);
                console.log(_context11.t0);
                throw {
                  err: 8001000,
                  msg: 'CArticle GetAlbums'
                };

              case 16:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, null, [[0, 12]]);
      }));

      function GetAlbums(_x12) {
        return _GetAlbums.apply(this, arguments);
      }

      return GetAlbums;
    }() //количество

  }, {
    key: "CountAlbums",
    value: function () {
      var _CountAlbums = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                sql = "SELECT COUNT(*) FROM ".concat(_db.DB.Init.TablePrefix, "album WHERE owner_id=").concat(fields.owner_id, " AND module='article'");
                _context12.next = 4;
                return _db.DB.Init.Query(sql);

              case 4:
                result = _context12.sent;
                return _context12.abrupt("return", Number(result[0].count));

              case 8:
                _context12.prev = 8;
                _context12.t0 = _context12["catch"](0);
                console.log(_context12.t0);
                throw {
                  err: 8001000,
                  msg: 'CArticle CountAlbums'
                };

              case 12:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, null, [[0, 8]]);
      }));

      function CountAlbums(_x15) {
        return _CountAlbums.apply(this, arguments);
      }

      return CountAlbums;
    }()
  }]);

  return _default;
}();

exports["default"] = _default;