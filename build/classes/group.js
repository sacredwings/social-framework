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
      var _GetById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(ids) {
        var collection, result;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                ids = new _db.DB().arObjectID(ids);
                collection = _db.DB.Client.collection('group'); //let result = await collection.find({_id: { $in: ids}}).toArray()

                _context2.next = 5;
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
                result = _context2.sent;
                return _context2.abrupt("return", result);

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                throw {
                  err: 4002000,
                  msg: 'CGroup GetById'
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
    }() //загрузка

  }, {
    key: "Get",
    value: function () {
      var _Get = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(fields) {
        var collection, result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                fields.user_id = new _db.DB().ObjectID(fields.user_id);
                collection = _db.DB.Client.collection('group'); //let result = await collection.find({_id: { $in: ids}}).toArray()

                _context3.next = 5;
                return collection.aggregate([{
                  $match: {
                    create_id: fields.user_id
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
                }, {
                  $unwind: {
                    path: '$_photo_big',
                    preserveNullAndEmptyArrays: true
                  }
                }]).limit(fields.count).skip(fields.offset).toArray();

              case 5:
                result = _context3.sent;
                return _context3.abrupt("return", result);

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  err: 4003000,
                  msg: 'CGroup Get'
                };

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 9]]);
      }));

      function Get(_x3) {
        return _Get.apply(this, arguments);
      }

      return Get;
    }() //количество

  }, {
    key: "GetCount",
    value: function () {
      var _GetCount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(fields) {
        var collection, result;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                fields.user_id = new _db.DB().ObjectID(fields.user_id);
                collection = _db.DB.Client.collection('group'); //let result = await collection.find({_id: { $in: ids}}).toArray()

                _context4.next = 5;
                return collection.count({
                  create_id: fields.user_id
                });

              case 5:
                result = _context4.sent;
                return _context4.abrupt("return", result);

              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4["catch"](0);
                console.log(_context4.t0);
                throw {
                  err: 4004000,
                  msg: 'CGroup GetCount'
                };

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 9]]);
      }));

      function GetCount(_x4) {
        return _GetCount.apply(this, arguments);
      }

      return GetCount;
    }() //количество всех видео

  }, {
    key: "Count",
    value: function () {
      var _Count = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(fields) {
        var collection, result;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                collection = _db.DB.Client.collection('group');
                _context5.next = 4;
                return collection.count();

              case 4:
                result = _context5.sent;
                return _context5.abrupt("return", result);

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](0);
                console.log(_context5.t0);
                throw {
                  err: 8001000,
                  msg: 'CGroup Count'
                };

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 8]]);
      }));

      function Count(_x5) {
        return _Count.apply(this, arguments);
      }

      return Count;
    }() //пользователи

  }, {
    key: "GetUsers",
    value: function () {
      var _GetUsers = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(items) {
        var arUsersId, collection, result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;

                if (!(!items || !items.length)) {
                  _context6.next = 3;
                  break;
                }

                return _context6.abrupt("return", []);

              case 3:
                /* выгрузка индентификаторов из объектов / пользователей */
                arUsersId = items.map(function (item, i) {
                  return item.create_id;
                }); //удаление одинаковых id из массива

                arUsersId = Array.from(new Set(arUsersId));
                collection = _db.DB.Client.collection('user');
                _context6.next = 8;
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

              case 8:
                result = _context6.sent;
                return _context6.abrupt("return", result);

              case 12:
                _context6.prev = 12;
                _context6.t0 = _context6["catch"](0);
                console.log(_context6.t0);
                throw {
                  err: 4005000,
                  msg: 'CGroup GetUsers'
                };

              case 16:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 12]]);
      }));

      function GetUsers(_x6) {
        return _GetUsers.apply(this, arguments);
      }

      return GetUsers;
    }()
  }, {
    key: "Update",
    value: function () {
      var _Update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(id, fields) {
        var result;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return _db.DB.Init.Update("".concat(_db.DB.Init.TablePrefix, "group"), fields, {
                  id: id
                }, "id");

              case 3:
                result = _context7.sent;
                return _context7.abrupt("return", result[0]);

              case 7:
                _context7.prev = 7;
                _context7.t0 = _context7["catch"](0);
                console.log(_context7.t0);
                throw {
                  err: 4006000,
                  msg: 'CGroup Update'
                };

              case 11:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 7]]);
      }));

      function Update(_x7, _x8) {
        return _Update.apply(this, arguments);
      }

      return Update;
    }() //удаление группы

  }, {
    key: "Delete",
    value: function () {
      var _Delete = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(id) {
        var result;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                _context8.next = 3;
                return _db.DB.Init.Update("groups", {
                  "delete": true
                }, {
                  id: id
                }, "id");

              case 3:
                result = _context8.sent;
                return _context8.abrupt("return", result[0]);

              case 7:
                _context8.prev = 7;
                _context8.t0 = _context8["catch"](0);
                console.log(_context8.t0);
                throw {
                  err: 4007000,
                  msg: 'CGroup Delete'
                };

              case 11:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[0, 7]]);
      }));

      function Delete(_x9) {
        return _Delete.apply(this, arguments);
      }

      return Delete;
    }() //поиск по группам

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
                collection = _db.DB.Client.collection('group');
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
                  $lookup: {
                    from: 'user',
                    localField: 'create_id',
                    foreignField: '_id',
                    as: '_create_id'
                  }
                }, {
                  $unwind: {
                    path: '$_photo',
                    preserveNullAndEmptyArrays: true
                  }
                }, {
                  $unwind: {
                    path: '$_create_id',
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
                  msg: 'CGroup Search'
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
    }() //количество / поиск

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
                collection = _db.DB.Client.collection('group');
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
                  msg: 'CGroup SearchCount'
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
        static async GetByField ( items, fieldName ) {
            try {
                //нет массива для обработки
                if ((!items) || (!items.length))
                    return []
    
                let arGroupId = []
    
                items.forEach((item, i) => {
                    if (item[fieldName] < 0)
                        arGroupId.push(-item[fieldName])
                })
    
                if (!arGroupId.length) return []
    
                //удаление одинаковых id из массива
                arGroupId = Array.from(new Set(arGroupId))
    
                let sql = `SELECT id,title FROM ${DB.Init.TablePrefix}group WHERE id in (${arGroupId})`
                let users = await DB.Init.Query(sql)
    
                users = await Promise.all(users.map(async (user, i)=>{
                    if (user.photo) {
                        user.photo = await CFile.GetById([user.photo]);
                        user.photo = user.photo[0]
                    }
                    return user
                }))
    
                return users
    
            } catch (err) {
                console.log(err)
                throw ({err: 6005000, msg: 'CGroup GetByField'})
            }
        }*/

  }]);

  return _default;
}();

exports["default"] = _default;