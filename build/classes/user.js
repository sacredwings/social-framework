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

var bcrypt = require('bcrypt');

var _default = /*#__PURE__*/function () {
  function _default() {
    _classCallCheck(this, _default);
  }

  _createClass(_default, null, [{
    key: "GetById",
    //поиск по id
    value: function () {
      var _GetById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _db.DB.Init.Query("SELECT * FROM users WHERE id=$1", [id]);

              case 3:
                result = _context.sent;

                if (result.length) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return", false);

              case 6:
                //упрощаем
                result = result[0];

                if (!result.personal_photo) {
                  _context.next = 12;
                  break;
                }

                _context.next = 10;
                return _file["default"].GetById([result.personal_photo]);

              case 10:
                result.personal_photo = _context.sent;
                result.personal_photo = result.personal_photo[0];

              case 12:
                return _context.abrupt("return", result);

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw {
                  err: 2001000,
                  msg: 'CUser GetById'
                };

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 15]]);
      }));

      function GetById(_x) {
        return _GetById.apply(this, arguments);
      }

      return GetById;
    }()
  }, {
    key: "Update",
    value: function () {
      var _Update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id, fields) {
        var salt, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;

                if (!fields.password) {
                  _context2.next = 8;
                  break;
                }

                _context2.next = 4;
                return bcrypt.genSalt();

              case 4:
                salt = _context2.sent;
                _context2.next = 7;
                return bcrypt.hash(fields.password, salt);

              case 7:
                fields.password = _context2.sent;

              case 8:
                console.log(fields);
                _context2.next = 11;
                return _db.DB.Init.Update("users", fields, {
                  id: id
                }, "id");

              case 11:
                result = _context2.sent;
                return _context2.abrupt("return", result[0]);

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                throw {
                  err: 2003000,
                  msg: 'CUser Update'
                };

              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 15]]);
      }));

      function Update(_x2, _x3) {
        return _Update.apply(this, arguments);
      }

      return Update;
    }()
  }]);

  return _default;
}();

exports["default"] = _default;