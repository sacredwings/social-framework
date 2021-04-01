"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _crypto = _interopRequireDefault(require("crypto"));

var _db = require("./db");

var _user = _interopRequireDefault(require("./user"));

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
    key: "Login",
    value: function () {
      var _Login = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fields) {
        var user, match, token;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _user["default"].GetByLogin(fields.login);

              case 3:
                user = _context.sent;

                if (user) {
                  _context.next = 6;
                  break;
                }

                throw {
                  err: 1001001,
                  msg: 'Неверный логин'
                };

              case 6:
                _context.next = 8;
                return _bcrypt["default"].compare(fields.password, user.password);

              case 8:
                match = _context.sent;

                if (match) {
                  _context.next = 11;
                  break;
                }

                throw {
                  err: 1001002,
                  msg: 'Неверный пароль'
                };

              case 11:
                _context.next = 13;
                return this.AddToken(user.id, fields.ip, fields.browser);

              case 13:
                token = _context.sent;

                if (token) {
                  _context.next = 16;
                  break;
                }

                throw {
                  err: 1001003,
                  msg: 'Токен не создан'
                };

              case 16:
                return _context.abrupt("return", {
                  tid: token.id,
                  token: token.token,
                  id: user.id,
                  login: user.login
                });

              case 19:
                _context.prev = 19;
                _context.t0 = _context["catch"](0);
                throw _objectSpread(_objectSpread({}, {
                  err: 1001000,
                  msg: 'CAuth Login'
                }), _context.t0);

              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 19]]);
      }));

      function Login(_x) {
        return _Login.apply(this, arguments);
      }

      return Login;
    }()
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
                return _db.DB.Init.Query("SELECT * FROM ".concat(_db.DB.Init.TablePrefix, "token WHERE id=$1"), [id]);

              case 3:
                result = _context2.sent;

                if (!result.length) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return", result[0]);

              case 6:
                return _context2.abrupt("return", false);

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                throw {
                  err: 1003000,
                  msg: 'CAuth GetById'
                };

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 9]]);
      }));

      function GetById(_x2) {
        return _GetById.apply(this, arguments);
      }

      return GetById;
    }()
  }, {
    key: "AddToken",
    value: function () {
      var _AddToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(userId, ip, browser) {
        var hash, arFields, result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                //создаем hash /нужно поменять на дату
                hash = new Date().toString();
                hash = _crypto["default"].createHash('md5').update(hash).digest("hex"); //подготовка полей

                arFields = {
                  token: hash,
                  user_id: userId,
                  ip: ip,
                  browser: browser
                }; //запись

                _context3.next = 6;
                return _db.DB.Init.Insert("".concat(_db.DB.Init.TablePrefix, "token"), arFields, "id, token");

              case 6:
                result = _context3.sent;
                return _context3.abrupt("return", result[0]);

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  err: 1004000,
                  msg: 'CAuth AddToken'
                };

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 10]]);
      }));

      function AddToken(_x3, _x4, _x5) {
        return _AddToken.apply(this, arguments);
      }

      return AddToken;
    }()
  }]);

  return _default;
}();

exports["default"] = _default;