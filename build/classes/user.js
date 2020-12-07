"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _crypto = _interopRequireDefault(require("crypto"));

var _db = require("./db");

var _file = _interopRequireDefault(require("./file"));

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
    key: "AddNoReg",
    //добавить незарегистрированного пользователя
    value: function () {
      var _AddNoReg = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fields) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                if (fields.email) fields.email = fields.email.toLowerCase();
                if (fields.login) fields.login = fields.login.toLowerCase(); //запись

                _context.next = 5;
                return _db.DB.Init.Insert("users_no_reg", fields, "ID");

              case 5:
                result = _context.sent;
                return _context.abrupt("return", result[0]);

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw {
                  err: 7001000,
                  msg: 'CUser AddNoReg'
                };

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 9]]);
      }));

      function AddNoReg(_x) {
        return _AddNoReg.apply(this, arguments);
      }

      return AddNoReg;
    }() //добавить пользователя

  }, {
    key: "Add",
    value: function () {
      var _Add = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(fields) {
        var result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                if (fields.email) fields.email = fields.email.toLowerCase();
                if (fields.login) fields.login = fields.login.toLowerCase(); //запись

                _context2.next = 5;
                return _db.DB.Init.Insert("users", fields, "ID");

              case 5:
                result = _context2.sent;
                return _context2.abrupt("return", result[0]);

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                throw {
                  err: 7001000,
                  msg: 'CUser AddUser'
                };

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 9]]);
      }));

      function Add(_x2) {
        return _Add.apply(this, arguments);
      }

      return Add;
    }() //поиск по id

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
                return _db.DB.Init.Query("SELECT * FROM users WHERE id in (".concat(ids, ")"));

              case 4:
                result = _context4.sent;
                _context4.next = 7;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(item, i) {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            if (!item.personal_photo) {
                              _context3.next = 5;
                              break;
                            }

                            _context3.next = 3;
                            return _file["default"].GetById([item.personal_photo]);

                          case 3:
                            item.personal_photo = _context3.sent;
                            item.personal_photo = item.personal_photo[0];

                          case 5:
                            return _context3.abrupt("return", item);

                          case 6:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x4, _x5) {
                    return _ref.apply(this, arguments);
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
                  err: 7001000,
                  msg: 'CUser GetById'
                };

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 11]]);
      }));

      function GetById(_x3) {
        return _GetById.apply(this, arguments);
      }

      return GetById;
    }() //поиск по email

  }, {
    key: "GetByEmail",
    value: function () {
      var _GetByEmail = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(email) {
        var result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                //в нижний регистр
                email = email.toLowerCase();
                _context6.next = 4;
                return _db.DB.Init.Query("SELECT * FROM users WHERE email=$1", [email]);

              case 4:
                result = _context6.sent;
                _context6.next = 7;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(item, i) {
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            if (!item.personal_photo) {
                              _context5.next = 5;
                              break;
                            }

                            _context5.next = 3;
                            return _file["default"].GetById([item.personal_photo]);

                          case 3:
                            item.personal_photo = _context5.sent;
                            item.personal_photo = item.personal_photo[0];

                          case 5:
                            return _context5.abrupt("return", item);

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

              case 7:
                result = _context6.sent;

                if (!result.length) {
                  _context6.next = 10;
                  break;
                }

                return _context6.abrupt("return", result[0]);

              case 10:
                return _context6.abrupt("return", false);

              case 13:
                _context6.prev = 13;
                _context6.t0 = _context6["catch"](0);
                console.log(_context6.t0);
                throw {
                  err: 7001000,
                  msg: 'CUser GetByEmail'
                };

              case 17:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 13]]);
      }));

      function GetByEmail(_x6) {
        return _GetByEmail.apply(this, arguments);
      }

      return GetByEmail;
    }() //поиск по login

  }, {
    key: "GetByLogin",
    value: function () {
      var _GetByLogin = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(login) {
        var result;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                //в нижний регистр
                login = login.toLowerCase();
                _context8.next = 4;
                return _db.DB.Init.Query("SELECT * FROM users WHERE login=$1", [login]);

              case 4:
                result = _context8.sent;
                _context8.next = 7;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(item, i) {
                    return regeneratorRuntime.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            if (!item.personal_photo) {
                              _context7.next = 5;
                              break;
                            }

                            _context7.next = 3;
                            return _file["default"].GetById([item.personal_photo]);

                          case 3:
                            item.personal_photo = _context7.sent;
                            item.personal_photo = item.personal_photo[0];

                          case 5:
                            return _context7.abrupt("return", item);

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

              case 7:
                result = _context8.sent;

                if (!result.length) {
                  _context8.next = 10;
                  break;
                }

                return _context8.abrupt("return", result[0]);

              case 10:
                return _context8.abrupt("return", false);

              case 13:
                _context8.prev = 13;
                _context8.t0 = _context8["catch"](0);
                console.log(_context8.t0);
                throw {
                  err: 7001000,
                  msg: 'CUser GetByLogin'
                };

              case 17:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[0, 13]]);
      }));

      function GetByLogin(_x9) {
        return _GetByLogin.apply(this, arguments);
      }

      return GetByLogin;
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
                return _bcrypt["default"].genSalt();

              case 4:
                salt = _context9.sent;
                _context9.next = 7;
                return _bcrypt["default"].hash(fields.password, salt);

              case 7:
                fields.password = _context9.sent;

              case 8:
                console.log(fields);
                _context9.next = 11;
                return _db.DB.Init.Update("users", fields, {
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
                  err: 7002000,
                  msg: 'CUser Update'
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
    }()
  }, {
    key: "Reg",
    value: function () {
      var _Reg = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(fields) {
        var hash, saltRounds, passwordSalt, arUsers, arFields;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                //создаем hash код
                hash = new Date().toString();
                hash = _crypto["default"].createHash('md5').update(hash).digest("hex"); //создаем hash пароль

                saltRounds = 10;
                _context10.next = 6;
                return _bcrypt["default"].genSalt(saltRounds);

              case 6:
                passwordSalt = _context10.sent;
                _context10.next = 9;
                return _bcrypt["default"].hash(fields.password, passwordSalt);

              case 9:
                fields.password = _context10.sent;
                //почту в нижний регистр
                fields.email = fields.email.toLowerCase();
                _context10.next = 13;
                return this.GetByEmail(fields.email);

              case 13:
                arUsers = _context10.sent;

                if (!arUsers) {
                  _context10.next = 16;
                  break;
                }

                throw {
                  err: 30020001,
                  msg: 'Такой email уже зарегистрирован'
                };

              case 16:
                _context10.next = 18;
                return this.GetByLogin(fields.login);

              case 18:
                arUsers = _context10.sent;

                if (!arUsers) {
                  _context10.next = 21;
                  break;
                }

                throw {
                  err: 30020001,
                  msg: 'Такой login уже зарегистрирован'
                };

              case 21:
                arFields = {
                  login: fields.login,
                  email: fields.email,
                  password: fields.password,
                  gender: fields.gender,
                  name: fields.name,
                  code: hash
                };
                _context10.next = 24;
                return this.AddNoReg(arFields);

              case 24:
                return _context10.abrupt("return", hash);

              case 27:
                _context10.prev = 27;
                _context10.t0 = _context10["catch"](0);
                console.log(_context10.t0);
                throw {
                  err: 7002000,
                  msg: 'CUser Reg'
                };

              case 31:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[0, 27]]);
      }));

      function Reg(_x14) {
        return _Reg.apply(this, arguments);
      }

      return Reg;
    }()
  }, {
    key: "RegActivate",
    value: function () {
      var _RegActivate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(code) {
        var noRegUser, arUsers, arFields, items;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                _context11.next = 3;
                return _db.DB.Init.Query("SELECT * FROM users_no_reg WHERE code=$1", [code]);

              case 3:
                noRegUser = _context11.sent;

                if (noRegUser.length) {
                  _context11.next = 6;
                  break;
                }

                throw {
                  err: 30030001,
                  msg: 'Заявки не существует'
                };

              case 6:
                //упрощаем
                noRegUser = noRegUser[0];
                _context11.next = 9;
                return this.GetByEmail(noRegUser.email);

              case 9:
                arUsers = _context11.sent;

                if (!arUsers) {
                  _context11.next = 12;
                  break;
                }

                throw {
                  err: 30020001,
                  msg: 'Такой email уже зарегистрирован'
                };

              case 12:
                _context11.next = 14;
                return this.GetByLogin(noRegUser.login);

              case 14:
                arUsers = _context11.sent;

                if (!arUsers) {
                  _context11.next = 17;
                  break;
                }

                throw {
                  err: 30020001,
                  msg: 'Такой login уже зарегистрирован'
                };

              case 17:
                //список
                arFields = {
                  login: noRegUser.login,
                  email: noRegUser.email,
                  password: noRegUser.password,
                  name: noRegUser.name,
                  personal_gender: noRegUser.gender
                };
                _context11.next = 20;
                return this.Add(arFields);

              case 20:
                items = _context11.sent;
                return _context11.abrupt("return", true);

              case 24:
                _context11.prev = 24;
                _context11.t0 = _context11["catch"](0);
                throw _objectSpread(_objectSpread({}, {
                  err: 30030000,
                  msg: 'Создание запроса на регистрацию нового пользователя'
                }), _context11.t0);

              case 27:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[0, 24]]);
      }));

      function RegActivate(_x15) {
        return _RegActivate.apply(this, arguments);
      }

      return RegActivate;
    }()
    /*
    static async reg (value) {
        try {
            //создаем код из hash
            let hash = new Date().toString();
            hash = crypto.createHash('md5').update(hash).digest("hex");
    
            //создание хеш пароля
            const saltRounds = 10;
            let passwordSalt = await bcrypt.genSalt(saltRounds);
            value.password = await bcrypt.hash(value.password, passwordSalt);
    
            //почту в нижний регистр
            value.email = value.email.toLowerCase();
    
            let arUsers = await modelsProfile.getUserByEmail(value.email);
            if (arUsers.length)
                throw ({err: 30020001, msg: 'Такой email уже зарегистрирован'});
    
            let arAccounts = await modelsProfile.reg(value.email, value.password, value.first_name, hash);
    
            const accountMail = {
                host: 'smtp.yandex.ru', //smtp.mail.ru
                port: 465, //465
                secure: true, // use SSL
                auth: {
                    user: 'reg@zayebot.ru',
                    pass: 'zayebot1247'
                }
            };
            //коннект
            const transporter = createTransport(accountMail);
    
            //отправка
            return transporter.sendMail({
                from: accountMail.auth.user,
                to: value.email,
                subject: 'ZayeBot - Код активации нового пользователя',
                html: `Для активации пользователя, перейдите по ссылке - <a href="https://zayebot.ru/reg-active/${hash}">https://zayebot.ru/reg-active/${hash}</a>`
            });
    
            return arAccounts;
    
        } catch (err) {
            throw ({...{err: 30020000, msg: 'Создание запроса на регистрацию нового пользователя'}, ...err});
        }
    }
    
    static async regActivate (value) {
        try {
            let arUsersCode = await modelsProfile.getUserNoActiveByCode(value.code);
            if (!arUsersCode.length)
                throw ({err: 30030001, msg: 'Заявки не существует'});
    
            let arUsers = await modelsProfile.getUserByEmailOrPhone(arUsersCode[0].email, value.phone);
            if (arUsers.length)
                throw ({err: 30030002, msg: 'Пользователь уже активирован'});
    
            let profile = await modelsProfile.addUser(arUsersCode[0].email, arUsersCode[0].password, arUsersCode[0].first_name, null, value.phone, value.ref);
    
            // создать кошелек
            await modelsPay.addWallet(profile.id);
    
            //здесь создание пользователя
            return true;
    
        } catch (err) {
            throw ({...{err: 30030000, msg: 'Создание запроса на регистрацию нового пользователя'}, ...err});
        }
    }
    static async reset (value) {
        try {
            //создаем hash /нужно поменять на дату
            let hash = new Date().toString();
            hash = crypto.createHash('md5').update(hash).digest("hex");
    
            let arUsers = await modelsProfile.getUserByEmail(value.email);
            console.log(arUsers)
            if (!arUsers.length)
                throw ({err: 30040001, msg: 'Такой email не зарегистрирован'});
    
            await modelsProfile.setByCode(arUsers[0].id, 1, hash);
    
            const accountMail = {
                host: 'smtp.yandex.ru', //smtp.mail.ru
                port: 465, //465
                secure: true, // use SSL
                auth: {
                    user: 'reg@zayebot.ru',
                    pass: 'zayebot1247'
                }
            };
            //коннект
            const transporter = createTransport(accountMail);
    
            //отправка
            transporter.sendMail({
                from: accountMail.auth.user,
                to: value.email,
                subject: 'ZayeBot - Код для востановления доступа к аккаунту',
                html: `Для востановления доступа к аккаунту, перейдите по ссылке - <a href="https://zayebot.ru/reset-active/${hash}">https://zayebot.ru/reset-active/${hash}</a>`
            });
    
            return true;
    
        } catch (err) {
            throw ({...{err: 30040000, msg: 'Отправка кода на e-mail'}, ...err});
        }
    }
    static async resetActivate (value) {
        try {
            let code = await modelsProfile.getByCode(1, value.code);
            if (!code.length)
                throw ({err: 30050001, msg: 'Такого кода не существует, попробуйте востановить пароль еще раз'});
    
            //создание хеш пароля
            const saltRounds = 10;
            let passwordSalt = await bcrypt.genSalt(saltRounds);
            value.password = await bcrypt.hash(value.password, passwordSalt);
    
            await modelsProfile.setPassword(code[0].user_id, value.password);
    
            return true;
    
        } catch (err) {
            throw ({...{err: 30050000, msg: 'Отправка кода на e-mail'}, ...err});
        }*/

  }]);

  return _default;
}();

exports["default"] = _default;