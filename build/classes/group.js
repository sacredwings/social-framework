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
                  err: 2001000,
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
    }() //поиск по id

  }, {
    key: "GetById",
    value: function () {
      var _GetById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id) {
        var result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _db.DB.Init.Query("SELECT * FROM groups WHERE id=$1", [id]);

              case 3:
                result = _context2.sent;
                return _context2.abrupt("return", result[0]);

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                throw {
                  err: 2001000,
                  msg: 'CGroup GetById'
                };

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 7]]);
      }));

      function GetById(_x2) {
        return _GetById.apply(this, arguments);
      }

      return GetById;
    }() //обновление основного фото

  }, {
    key: "UpdatePhoto",
    value: function () {
      var _UpdatePhoto = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(userId, file) {
        var user, arFields, result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return this.GetById(userId);

              case 3:
                user = _context3.sent;
                arFields = {
                  user_id: userId,
                  name: file.name,
                  size: file.size,
                  tmp_name: file.path,
                  type: file.type,
                  old_file: null,
                  module_id: "group",
                  description: null
                }; //файл уже загружен, нужно удалить

                if (user.personal_photo) {
                  arFields.old_file = user.personal_photo;
                  arFields.del = true;
                }

                _context3.next = 8;
                return _file["default"].SaveFile(arFields, "".concat(global.__basedir, "/"));

              case 8:
                result = _context3.sent;
                arFields = {
                  personal_photo: result.id
                };
                _context3.next = 12;
                return this.Update(userId, arFields);

              case 12:
                _context3.next = 18;
                break;

              case 14:
                _context3.prev = 14;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  err: 2002000,
                  msg: 'CGroup UpdatePhoto'
                };

              case 18:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 14]]);
      }));

      function UpdatePhoto(_x3, _x4) {
        return _UpdatePhoto.apply(this, arguments);
      }

      return UpdatePhoto;
    }() //обновление полей

  }, {
    key: "Update",
    value: function () {
      var _Update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(id, fields) {
        var result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return _db.DB.Init.Update("groups", fields, {
                  id: id
                }, "id");

              case 3:
                result = _context4.sent;
                return _context4.abrupt("return", result[0]);

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4["catch"](0);
                console.log(_context4.t0);
                throw {
                  err: 2003000,
                  msg: 'CGroup Update'
                };

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 7]]);
      }));

      function Update(_x5, _x6) {
        return _Update.apply(this, arguments);
      }

      return Update;
    }() //удаление группы

  }, {
    key: "Delete",
    value: function () {
      var _Delete = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(id) {
        var result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return _db.DB.Init.Update("groups", {
                  "delete": true
                }, {
                  id: id
                }, "id");

              case 3:
                result = _context5.sent;
                return _context5.abrupt("return", result[0]);

              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5["catch"](0);
                console.log(_context5.t0);
                throw {
                  err: 2003000,
                  msg: 'CGroup Update'
                };

              case 11:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 7]]);
      }));

      function Delete(_x7) {
        return _Delete.apply(this, arguments);
      }

      return Delete;
    }()
  }]);

  return _default;
}();

exports["default"] = _default;