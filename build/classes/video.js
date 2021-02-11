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
    value: //добавить новое видео
    function () {
      var _Add = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(fields) {
        var albums, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                //если владелец не указан
                if (!fields.owner_id) fields.owner_id = fields.from_id;
                albums = fields.albums; //удаляем из массива

                if (fields.albums || fields.albums === null) delete fields.albums;
                _context2.next = 6;
                return _db.DB.Init.Insert("".concat(_db.DB.Init.TablePrefix, "video"), fields, "ID");

              case 6:
                result = _context2.sent;
                if (albums && albums.length) albums.map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(item, i) {
                    var arFields;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            arFields = {
                              album_id: item,
                              object_id: result[0].id,
                              create_id: fields.create_id
                            };
                            _context.next = 3;
                            return _db.DB.Init.Insert("".concat(_db.DB.Init.TablePrefix, "album_link"), arFields, "ID");

                          case 3:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x2, _x3) {
                    return _ref.apply(this, arguments);
                  };
                }());
                return _context2.abrupt("return", result[0]);

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                throw {
                  err: 8001000,
                  msg: 'CVideo Add'
                };

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 11]]);
      }));

      function Add(_x) {
        return _Add.apply(this, arguments);
      }

      return Add;
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
                return _db.DB.Init.Query("SELECT * FROM ".concat(_db.DB.Init.TablePrefix, "video WHERE id in (").concat(ids, ")"));

              case 4:
                result = _context4.sent;
                _context4.next = 7;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(item, i) {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            if (!item.file) {
                              _context3.next = 5;
                              break;
                            }

                            _context3.next = 3;
                            return _file["default"].GetById([item.file]);

                          case 3:
                            item.file = _context3.sent;
                            item.file = item.file[0];

                          case 5:
                            return _context3.abrupt("return", item);

                          case 6:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x5, _x6) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 7:
                result = _context4.sent;
                return _context4.abrupt("return", result);

              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4["catch"](0);
                console.log(_context4.t0);
                throw {
                  err: 8001000,
                  msg: 'CVideo GetById'
                };

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 11]]);
      }));

      function GetById(_x4) {
        return _GetById.apply(this, arguments);
      }

      return GetById;
    }() //загрузка

  }, {
    key: "Get",
    value: function () {
      var _Get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                sql = "SELECT * FROM ".concat(_db.DB.Init.TablePrefix, "video WHERE owner_id=").concat(fields.owner_id);
                /* видео из альбома */

                if (fields.album_id) sql = "SELECT ".concat(_db.DB.Init.TablePrefix, "video.*\n                    FROM ").concat(_db.DB.Init.TablePrefix, "album_link\n                    INNER JOIN ").concat(_db.DB.Init.TablePrefix, "video ON ").concat(_db.DB.Init.TablePrefix, "video.id = ").concat(_db.DB.Init.TablePrefix, "album_link.object_id WHERE ").concat(_db.DB.Init.TablePrefix, "album_link.album_id = ").concat(fields.album_id);
                sql += " LIMIT $1 OFFSET $2 ";
                _context6.next = 6;
                return _db.DB.Init.Query(sql, [fields.count, fields.offset]);

              case 6:
                result = _context6.sent;
                _context6.next = 9;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(item, i) {
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            if (!item.file) {
                              _context5.next = 5;
                              break;
                            }

                            _context5.next = 3;
                            return _file["default"].GetById([item.file]);

                          case 3:
                            item.file = _context5.sent;
                            item.file = item.file[0];

                          case 5:
                            return _context5.abrupt("return", item);

                          case 6:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }));

                  return function (_x8, _x9) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 9:
                result = _context6.sent;
                return _context6.abrupt("return", result);

              case 13:
                _context6.prev = 13;
                _context6.t0 = _context6["catch"](0);
                console.log(_context6.t0);
                throw {
                  err: 8001000,
                  msg: 'CVideo Get'
                };

              case 17:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 13]]);
      }));

      function Get(_x7) {
        return _Get.apply(this, arguments);
      }

      return Get;
    }() //количество

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
                sql = "SELECT COUNT(*) FROM ".concat(_db.DB.Init.TablePrefix, "video WHERE owner_id=").concat(fields.owner_id);
                /* видео из альбома */

                if (fields.album_id) sql = "SELECT COUNT(*)\n                    FROM ".concat(_db.DB.Init.TablePrefix, "album_link\n                    WHERE ").concat(_db.DB.Init.TablePrefix, "album_link.album_id = ").concat(fields.album_id);
                _context7.next = 5;
                return _db.DB.Init.Query(sql);

              case 5:
                result = _context7.sent;
                return _context7.abrupt("return", Number(result[0].count));

              case 9:
                _context7.prev = 9;
                _context7.t0 = _context7["catch"](0);
                console.log(_context7.t0);
                throw {
                  err: 8001000,
                  msg: 'CVideo Count'
                };

              case 13:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 9]]);
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
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(user, i) {
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
                    return _ref4.apply(this, arguments);
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
    }() //добавить новый видео альбом

  }, {
    key: "AddAlbum",
    value: function () {
      var _AddAlbum = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(fields) {
        var result;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                fields.module = 'video'; //если владелец не указан

                if (!fields.owner_id) fields.owner_id = fields.from_id;
                _context10.next = 5;
                return _db.DB.Init.Insert("".concat(_db.DB.Init.TablePrefix, "album"), fields, "ID");

              case 5:
                result = _context10.sent;
                return _context10.abrupt("return", result[0]);

              case 9:
                _context10.prev = 9;
                _context10.t0 = _context10["catch"](0);
                console.log(_context10.t0);
                throw {
                  err: 8001000,
                  msg: 'CVideo Add'
                };

              case 13:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[0, 9]]);
      }));

      function AddAlbum(_x14) {
        return _AddAlbum.apply(this, arguments);
      }

      return AddAlbum;
    }() //загрузка

  }, {
    key: "GetAlbums",
    value: function () {
      var _GetAlbums = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                sql = "SELECT * FROM ".concat(_db.DB.Init.TablePrefix, "album WHERE owner_id=").concat(fields.owner_id, " AND module='video'");
                sql += " LIMIT $1 OFFSET $2 ";
                _context12.next = 5;
                return _db.DB.Init.Query(sql, [fields.count, fields.offset]);

              case 5:
                result = _context12.sent;
                _context12.next = 8;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(item, i) {
                    return regeneratorRuntime.wrap(function _callee11$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            if (!item.image_id) {
                              _context11.next = 5;
                              break;
                            }

                            _context11.next = 3;
                            return _file["default"].GetById([item.image_id]);

                          case 3:
                            item.image_id = _context11.sent;
                            item.image_id = item.image_id[0];

                          case 5:
                            return _context11.abrupt("return", item);

                          case 6:
                          case "end":
                            return _context11.stop();
                        }
                      }
                    }, _callee11);
                  }));

                  return function (_x16, _x17) {
                    return _ref5.apply(this, arguments);
                  };
                }()));

              case 8:
                result = _context12.sent;
                return _context12.abrupt("return", result);

              case 12:
                _context12.prev = 12;
                _context12.t0 = _context12["catch"](0);
                console.log(_context12.t0);
                throw {
                  err: 8001000,
                  msg: 'CVideo GetAlbums'
                };

              case 16:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, null, [[0, 12]]);
      }));

      function GetAlbums(_x15) {
        return _GetAlbums.apply(this, arguments);
      }

      return GetAlbums;
    }() //количество

  }, {
    key: "CountAlbums",
    value: function () {
      var _CountAlbums = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0;
                sql = "SELECT COUNT(*) FROM ".concat(_db.DB.Init.TablePrefix, "album WHERE owner_id=").concat(fields.owner_id, " AND module='video'");
                _context13.next = 4;
                return _db.DB.Init.Query(sql);

              case 4:
                result = _context13.sent;
                return _context13.abrupt("return", Number(result[0].count));

              case 8:
                _context13.prev = 8;
                _context13.t0 = _context13["catch"](0);
                console.log(_context13.t0);
                throw {
                  err: 8001000,
                  msg: 'CVideo CountAlbums'
                };

              case 12:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, null, [[0, 8]]);
      }));

      function CountAlbums(_x18) {
        return _CountAlbums.apply(this, arguments);
      }

      return CountAlbums;
    }()
  }]);

  return _default;
}();

exports["default"] = _default;