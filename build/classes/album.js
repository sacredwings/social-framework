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
    value: //добавить новый видео альбом
    function () {
      var _Add = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fields) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                //если владелец не указан
                if (!fields.owner_id) fields.owner_id = fields.from_id;
                _context.next = 4;
                return _db.DB.Init.Insert("".concat(_db.DB.Init.TablePrefix, "album"), fields, "ID");

              case 4:
                result = _context.sent;
                return _context.abrupt("return", result[0]);

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw {
                  err: 8001000,
                  msg: 'CAlbum Add'
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
    }()
  }, {
    key: "Edit",
    value: function () {
      var _Edit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id, fields) {
        var result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _db.DB.Init.Update("".concat(_db.DB.Init.TablePrefix, "album"), fields, {
                  id: id
                }, "ID");

              case 3:
                result = _context2.sent;
                return _context2.abrupt("return", result[0]);

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                throw {
                  err: 8001000,
                  msg: 'CAlbum Edit'
                };

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 7]]);
      }));

      function Edit(_x2, _x3) {
        return _Edit.apply(this, arguments);
      }

      return Edit;
    }() //загрузка

  }, {
    key: "Get",
    value: function () {
      var _Get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                if (fields.album_id) fields.album_id = " album_id=".concat(fields.album_id, " ");else fields.album_id = " album_id IS NULL ";
                sql = "SELECT *\n                       FROM ".concat(_db.DB.Init.TablePrefix, "album\n                       WHERE owner_id = ").concat(fields.owner_id, " AND module = '").concat(fields.module, "' AND ").concat(fields.album_id, "\n                       ORDER BY title ASC");
                sql += " LIMIT $1 OFFSET $2 ";
                console.log(sql);
                _context4.next = 7;
                return _db.DB.Init.Query(sql, [fields.count, fields.offset]);

              case 7:
                result = _context4.sent;
                _context4.next = 10;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(item, i) {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            if (!item.image_id) {
                              _context3.next = 5;
                              break;
                            }

                            _context3.next = 3;
                            return _file["default"].GetById([item.image_id]);

                          case 3:
                            item.image_id = _context3.sent;
                            item.image_id = item.image_id[0];

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
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 10:
                result = _context4.sent;
                return _context4.abrupt("return", result);

              case 14:
                _context4.prev = 14;
                _context4.t0 = _context4["catch"](0);
                console.log(_context4.t0);
                throw {
                  err: 8001000,
                  msg: 'CAlbum Get'
                };

              case 18:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 14]]);
      }));

      function Get(_x4) {
        return _Get.apply(this, arguments);
      }

      return Get;
    }() //количество

  }, {
    key: "Count",
    value: function () {
      var _Count = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(fields) {
        var sql, result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                if (fields.album_id) fields.album_id = " album_id=".concat(fields.album_id, " ");else fields.album_id = " album_id IS NULL ";
                sql = "SELECT COUNT(*)\n                       FROM ".concat(_db.DB.Init.TablePrefix, "album\n                       WHERE owner_id = ").concat(fields.owner_id, " AND module = '").concat(fields.module, "' AND ").concat(fields.album_id);
                _context5.next = 5;
                return _db.DB.Init.Query(sql);

              case 5:
                result = _context5.sent;
                return _context5.abrupt("return", Number(result[0].count));

              case 9:
                _context5.prev = 9;
                _context5.t0 = _context5["catch"](0);
                console.log(_context5.t0);
                throw {
                  err: 8001000,
                  msg: 'CAlbum Count'
                };

              case 13:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 9]]);
      }));

      function Count(_x7) {
        return _Count.apply(this, arguments);
      }

      return Count;
    }() //добавить новое в альбом

  }, {
    key: "InAlbum",
    value: function () {
      var _InAlbum = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(fields) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                // сделать проверку, что файл и альбом твои
                //раскидываем файл по альбомам
                fields.album_ids.map( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(item, i) {
                    var arFields;
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            arFields = {
                              album_id: item,
                              object_id: fields.object_id,
                              create_id: fields.create_id
                            };
                            console.log(arFields);
                            _context6.next = 4;
                            return _db.DB.Init.Insert("".concat(_db.DB.Init.TablePrefix, "album_").concat(fields.module, "_link"), arFields, "ID");

                          case 4:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6);
                  }));

                  return function (_x9, _x10) {
                    return _ref2.apply(this, arguments);
                  };
                }());
                return _context7.abrupt("return", true);

              case 5:
                _context7.prev = 5;
                _context7.t0 = _context7["catch"](0);
                console.log(_context7.t0);
                throw {
                  err: 8001000,
                  msg: 'CArticle InAlbum'
                };

              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 5]]);
      }));

      function InAlbum(_x8) {
        return _InAlbum.apply(this, arguments);
      }

      return InAlbum;
    }()
  }]);

  return _default;
}();

exports["default"] = _default;