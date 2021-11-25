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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

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
    value: //добавить незарегистрированного пользователя
    function () {
      var _AddNoReg = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fields) {
        var collection, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                if (fields.email) fields.email = fields.email.toLowerCase();
                if (fields.login) fields.login = fields.login.toLowerCase();
                collection = _db.DB.Client.collection('user_no_reg');
                _context.next = 6;
                return collection.insertOne(fields);

              case 6:
                result = _context.sent;
                return _context.abrupt("return", fields);

              case 10:
                _context.prev = 10;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw {
                  err: 7001000,
                  msg: 'CUser AddNoReg'
                };

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 10]]);
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
        var collection, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                if (fields.email) fields.email = fields.email.toLowerCase();
                if (fields.login) fields.login = fields.login.toLowerCase();
                collection = _db.DB.Client.collection('user');
                _context2.next = 6;
                return collection.insertOne(fields);

              case 6:
                result = _context2.sent;
                return _context2.abrupt("return", fields);

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                throw {
                  err: 7001000,
                  msg: 'CUser AddUser'
                };

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 10]]);
      }));

      function Add(_x2) {
        return _Add.apply(this, arguments);
      }

      return Add;
    }() //поиск по id

  }, {
    key: "GetById",
    value: function () {
      var _GetById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(ids) {
        var collection, result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                ids = new _db.DB().arObjectID(ids);
                collection = _db.DB.Client.collection('user'); //let result = await collection.find({_id: { $in: ids}}).toArray()

                _context3.next = 5;
                return collection.aggregate([{
                  $match: {
                    _id: {
                      $in: ids
                    }
                  }
                }, {
                  $lookup: {
                    from: 'file',
                    localField: 'photo',
                    foreignField: '_id',
                    as: '_photo',
                    pipeline: [{
                      $lookup: {
                        from: 'file',
                        localField: 'file_id',
                        foreignField: '_id',
                        as: '_file_id'
                      }
                    }]
                  }
                }, {
                  $lookup: {
                    from: 'file',
                    localField: 'photo_big',
                    foreignField: '_id',
                    as: '_photo_big',
                    pipeline: [{
                      $lookup: {
                        from: 'file',
                        localField: 'file_id',
                        foreignField: '_id',
                        as: '_file_id'
                      }
                    }]
                  }
                }, {
                  $unwind: {
                    path: '$_photo',
                    preserveNullAndEmptyArrays: true
                  }
                }, {
                  $unwind: {
                    path: '$_photo_big',
                    preserveNullAndEmptyArrays: true
                  }
                }]).toArray();

              case 5:
                result = _context3.sent;
                return _context3.abrupt("return", result);

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  err: 7001000,
                  msg: 'CUser GetById'
                };

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 9]]);
      }));

      function GetById(_x3) {
        return _GetById.apply(this, arguments);
      }

      return GetById;
    }() //поиск по email

  }, {
    key: "GetByEmail",
    value: function () {
      var _GetByEmail = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(email) {
        var collection, result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                //в нижний регистр
                email = email.toLowerCase();
                collection = _db.DB.Client.collection('user'); //let result = await collection.findOne({login})

                _context4.next = 5;
                return collection.aggregate([{
                  $match: {
                    email: email
                  }
                }, {
                  $lookup: {
                    from: 'file',
                    localField: 'photo',
                    foreignField: '_id',
                    as: '_photo',
                    pipeline: [{
                      $lookup: {
                        from: 'file',
                        localField: 'file_id',
                        foreignField: '_id',
                        as: '_file_id'
                      }
                    }]
                  }
                }, {
                  $lookup: {
                    from: 'file',
                    localField: 'photo_big',
                    foreignField: '_id',
                    as: '_photo_big',
                    pipeline: [{
                      $lookup: {
                        from: 'file',
                        localField: 'file_id',
                        foreignField: '_id',
                        as: '_file_id'
                      }
                    }]
                  }
                }, {
                  $unwind: {
                    path: '$_photo',
                    preserveNullAndEmptyArrays: true
                  }
                }, {
                  $unwind: {
                    path: '$_photo_big',
                    preserveNullAndEmptyArrays: true
                  }
                }]).toArray();

              case 5:
                result = _context4.sent;

                if (result.length) {
                  _context4.next = 8;
                  break;
                }

                return _context4.abrupt("return", false);

              case 8:
                return _context4.abrupt("return", result[0]);

              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4["catch"](0);
                console.log(_context4.t0);
                throw {
                  err: 7001000,
                  msg: 'CUser GetByEmail'
                };

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 11]]);
      }));

      function GetByEmail(_x4) {
        return _GetByEmail.apply(this, arguments);
      }

      return GetByEmail;
    }() //поиск по login

  }, {
    key: "GetByLogin",
    value: function () {
      var _GetByLogin = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(login) {
        var collection, result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                //в нижний регистр
                login = login.toLowerCase();
                collection = _db.DB.Client.collection('user'); //let result = await collection.findOne({login})

                _context5.next = 5;
                return collection.aggregate([{
                  $match: {
                    login: login
                  }
                }, {
                  $lookup: {
                    from: 'file',
                    localField: 'photo',
                    foreignField: '_id',
                    as: '_photo',
                    pipeline: [{
                      $lookup: {
                        from: 'file',
                        localField: 'file_id',
                        foreignField: '_id',
                        as: '_file_id'
                      }
                    }]
                  }
                }, {
                  $lookup: {
                    from: 'file',
                    localField: 'photo_big',
                    foreignField: '_id',
                    as: '_photo_big',
                    pipeline: [{
                      $lookup: {
                        from: 'file',
                        localField: 'file_id',
                        foreignField: '_id',
                        as: '_file_id'
                      }
                    }]
                  }
                }, {
                  $unwind: {
                    path: '$_photo',
                    preserveNullAndEmptyArrays: true
                  }
                }, {
                  $unwind: {
                    path: '$_photo_big',
                    preserveNullAndEmptyArrays: true
                  }
                }]).toArray();

              case 5:
                result = _context5.sent;

                if (result.length) {
                  _context5.next = 8;
                  break;
                }

                return _context5.abrupt("return", false);

              case 8:
                return _context5.abrupt("return", result[0]);

              case 11:
                _context5.prev = 11;
                _context5.t0 = _context5["catch"](0);
                console.log(_context5.t0);
                throw {
                  err: 7001000,
                  msg: 'CUser GetByLogin'
                };

              case 15:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 11]]);
      }));

      function GetByLogin(_x5) {
        return _GetByLogin.apply(this, arguments);
      }

      return GetByLogin;
    }()
  }, {
    key: "Update",
    value: function () {
      var _Update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(id, fields) {
        var salt, result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;

                if (!fields.password) {
                  _context6.next = 8;
                  break;
                }

                _context6.next = 4;
                return _bcrypt["default"].genSalt();

              case 4:
                salt = _context6.sent;
                _context6.next = 7;
                return _bcrypt["default"].hash(fields.password, salt);

              case 7:
                fields.password = _context6.sent;

              case 8:
                console.log(fields);
                _context6.next = 11;
                return _db.DB.Init.Update("".concat(_db.DB.Init.TablePrefix, "user"), fields, {
                  id: id
                }, "id");

              case 11:
                result = _context6.sent;
                return _context6.abrupt("return", result[0]);

              case 15:
                _context6.prev = 15;
                _context6.t0 = _context6["catch"](0);
                console.log(_context6.t0);
                throw {
                  err: 7002000,
                  msg: 'CUser Update'
                };

              case 19:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 15]]);
      }));

      function Update(_x6, _x7) {
        return _Update.apply(this, arguments);
      }

      return Update;
    }()
  }, {
    key: "Reg",
    value: function () {
      var _Reg = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(fields) {
        var hash, saltRounds, passwordSalt, arUsers, arFields;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                //создаем hash код
                hash = new Date().toString();
                hash = _crypto["default"].createHash('md5').update(hash).digest("hex"); //создаем hash пароль

                saltRounds = 10;
                _context7.next = 6;
                return _bcrypt["default"].genSalt(saltRounds);

              case 6:
                passwordSalt = _context7.sent;
                _context7.next = 9;
                return _bcrypt["default"].hash(fields.password, passwordSalt);

              case 9:
                fields.password = _context7.sent;
                //почту в нижний регистр
                fields.email = fields.email.toLowerCase();
                _context7.next = 13;
                return this.GetByEmail(fields.email);

              case 13:
                arUsers = _context7.sent;

                if (!arUsers) {
                  _context7.next = 16;
                  break;
                }

                throw {
                  err: 30020001,
                  msg: 'Такой email уже зарегистрирован'
                };

              case 16:
                _context7.next = 18;
                return this.GetByLogin(fields.login);

              case 18:
                arUsers = _context7.sent;

                if (!arUsers) {
                  _context7.next = 21;
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
                  first_name: fields.first_name,
                  code: hash
                };
                _context7.next = 24;
                return this.AddNoReg(arFields);

              case 24:
                return _context7.abrupt("return", hash);

              case 27:
                _context7.prev = 27;
                _context7.t0 = _context7["catch"](0);
                console.log(_context7.t0);
                throw {
                  err: 7002000,
                  msg: 'CUser Reg'
                };

              case 31:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 27]]);
      }));

      function Reg(_x8) {
        return _Reg.apply(this, arguments);
      }

      return Reg;
    }()
  }, {
    key: "RegActivate",
    value: function () {
      var _RegActivate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(code) {
        var collection, noRegUser, arUsers, arFields, items;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                collection = _db.DB.Client.collection('user_no_reg');
                _context8.next = 4;
                return collection.findOne({
                  code: code
                });

              case 4:
                noRegUser = _context8.sent;

                if (noRegUser) {
                  _context8.next = 7;
                  break;
                }

                throw {
                  err: 30030001,
                  msg: 'Заявки не существует'
                };

              case 7:
                _context8.next = 9;
                return this.GetByEmail(noRegUser.email);

              case 9:
                arUsers = _context8.sent;

                if (!arUsers) {
                  _context8.next = 12;
                  break;
                }

                throw {
                  err: 30020001,
                  msg: 'Такой email уже зарегистрирован'
                };

              case 12:
                _context8.next = 14;
                return this.GetByLogin(noRegUser.login);

              case 14:
                arUsers = _context8.sent;

                if (!arUsers) {
                  _context8.next = 17;
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
                  first_name: noRegUser.first_name,
                  gender: noRegUser.gender
                };
                _context8.next = 20;
                return this.Add(arFields);

              case 20:
                items = _context8.sent;
                return _context8.abrupt("return", true);

              case 24:
                _context8.prev = 24;
                _context8.t0 = _context8["catch"](0);
                throw _objectSpread(_objectSpread({}, {
                  err: 30030000,
                  msg: 'Создание запроса на регистрацию нового пользователя'
                }), _context8.t0);

              case 27:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[0, 24]]);
      }));

      function RegActivate(_x9) {
        return _RegActivate.apply(this, arguments);
      }

      return RegActivate;
    }() //поиск по пользователям

  }, {
    key: "Search",
    value: function () {
      var _Search = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(fields) {
        var collection, arAggregate, result;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                collection = _db.DB.Client.collection('user');
                arAggregate = [];
                if (fields.q) arAggregate.push({
                  $match: {
                    $text: {
                      $search: fields.q
                    }
                  }
                });
                arAggregate.push({
                  $lookup: {
                    from: 'file',
                    localField: 'photo',
                    foreignField: '_id',
                    as: '_photo',
                    pipeline: [{
                      $lookup: {
                        from: 'file',
                        localField: 'file_id',
                        foreignField: '_id',
                        as: '_file_id'
                      }
                    }]
                  }
                }, {
                  $unwind: {
                    path: '$_photo',
                    preserveNullAndEmptyArrays: true
                  }
                });
                _context9.next = 7;
                return collection.aggregate(arAggregate).limit(fields.count).skip(fields.offset).toArray();

              case 7:
                result = _context9.sent;
                return _context9.abrupt("return", result);

              case 11:
                _context9.prev = 11;
                _context9.t0 = _context9["catch"](0);
                console.log(_context9.t0);
                throw {
                  err: 7001000,
                  msg: 'CUser Search'
                };

              case 15:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[0, 11]]);
      }));

      function Search(_x10) {
        return _Search.apply(this, arguments);
      }

      return Search;
    }() //количество / поиск по пользователям

  }, {
    key: "SearchCount",
    value: function () {
      var _SearchCount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(fields) {
        var collection, arSearch, result;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                collection = _db.DB.Client.collection('user');
                arSearch = {};
                if (fields.q) arSearch = {
                  $text: {
                    $search: fields.q
                  }
                };
                _context10.next = 6;
                return collection.count(arSearch);

              case 6:
                result = _context10.sent;
                return _context10.abrupt("return", result);

              case 10:
                _context10.prev = 10;
                _context10.t0 = _context10["catch"](0);
                console.log(_context10.t0);
                throw {
                  err: 7001000,
                  msg: 'CUser SearchCount'
                };

              case 14:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[0, 10]]);
      }));

      function SearchCount(_x11) {
        return _SearchCount.apply(this, arguments);
      }

      return SearchCount;
    }()
    /*
    //количество всех видео
    static async Count ( fields ) {
        try {
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}user`
              let result = await DB.Init.Query(sql)
            return Number (result[0].count)
          } catch (err) {
            console.log(err)
            throw ({err: 8001000, msg: 'CVideo Count'})
        }
    }*/
    //пользователи

  }, {
    key: "GetByField",
    value: function () {
      var _GetByField = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(items, fieldName) {
        var arUsersId, collection, result;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;

                if (!(!items || !items.length)) {
                  _context11.next = 3;
                  break;
                }

                return _context11.abrupt("return", []);

              case 3:
                arUsersId = [];
                /* выгрузка индентификаторов из объектов / пользователей */

                items.forEach(function (item, i) {
                  if (item[fieldName] > 0) arUsersId.push(item[fieldName]);
                });

                if (arUsersId.length) {
                  _context11.next = 7;
                  break;
                }

                return _context11.abrupt("return", []);

              case 7:
                //удаление одинаковых id из массива
                arUsersId = Array.from(new Set(arUsersId));
                collection = _db.DB.Client.collection('user');
                _context11.next = 11;
                return collection.aggregate([{
                  $match: {
                    _id: {
                      $in: arUsersId
                    }
                  }
                }, {
                  $lookup: {
                    from: 'file',
                    localField: 'photo',
                    foreignField: '_id',
                    as: '_photo',
                    pipeline: [{
                      $lookup: {
                        from: 'file',
                        localField: 'file_id',
                        foreignField: '_id',
                        as: '_file_id'
                      }
                    }, {
                      $unwind: {
                        path: '$_file_id',
                        preserveNullAndEmptyArrays: true
                      }
                    }]
                  }
                }, {
                  $unwind: {
                    path: '$_photo',
                    preserveNullAndEmptyArrays: true
                  }
                }]).toArray();

              case 11:
                result = _context11.sent;
                return _context11.abrupt("return", result);

              case 15:
                _context11.prev = 15;
                _context11.t0 = _context11["catch"](0);
                console.log(_context11.t0);
                throw {
                  err: 6005000,
                  msg: 'CUser GetByField'
                };

              case 19:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, null, [[0, 15]]);
      }));

      function GetByField(_x12, _x13) {
        return _GetByField.apply(this, arguments);
      }

      return GetByField;
    }()
    /*
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