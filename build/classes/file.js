"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _crypto = _interopRequireDefault(require("crypto"));

var _db = require("./db");

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
    key: "SaveFile",
    //Сохраняем новый вайл в таблицу файлов и сам файл
    value: function () {
      var _SaveFile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fields, savePath) {
        var hash, type, url, arFields, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                //если владелец не указан
                if (!fields.owner_id) fields.owner_id = fields.from_id;

                if (fields.owner_id > 0) {
                  fields.owner_user_id = fields.owner_id;
                  fields.owner_group_id = null;
                } else {
                  fields.owner_user_id = null;
                  fields.owner_group_id = fields.owner_id;
                }

                if (fields.from_id > 0) {
                  fields.from_user_id = fields.from_id;
                  fields.from_group_id = null;
                } else {
                  fields.from_user_id = null;
                  fields.from_group_id = fields.from_id;
                } //удаление файла с диска и базы


                if (!fields.old_file) {
                  _context.next = 7;
                  break;
                }

                _context.next = 7;
                return this.Delete(fields.old_file, true);

              case 7:
                //хеш размера и имени файла
                hash = _crypto["default"].createHash('md5').update(fields.file.size + fields.file.name).digest("hex"); //вытаскиваем расширение

                type = fields.file.type.split('/');
                type = type[1];
                url = "files/".concat(fields.module_id, "/").concat(hash, ".").concat(type); //к основному пути прибавляем путь к модулю

                savePath = "".concat(savePath, "files/").concat(fields.module_id, "/").concat(hash, ".").concat(type); //копирование файла в постоянную папку

                _context.next = 14;
                return _fsExtra["default"].copy(fields.file.path, savePath);

              case 14:
                //добавление записи о файле в таблицу
                arFields = {
                  owner_user_id: fields.owner_user_id,
                  owner_group_id: fields.owner_group_id,
                  from_user_id: fields.from_user_id,
                  from_group_id: fields.from_group_id,
                  size: fields.file.size,
                  path: savePath,
                  type: fields.file.type,
                  url: url,
                  title: fields.title ? fields.title : fields.file.title,
                  text: fields.text ? fields.text : null
                };
                _context.next = 17;
                return _db.DB.Init.Insert("files", arFields, "id");

              case 17:
                result = _context.sent;
                return _context.abrupt("return", result[0].id);

              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw {
                  err: 3001000,
                  msg: 'CFile SaveFile'
                };

              case 25:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 21]]);
      }));

      function SaveFile(_x, _x2) {
        return _SaveFile.apply(this, arguments);
      }

      return SaveFile;
    }() //удаление информации о файле из базы и сам файл

  }, {
    key: "Delete",
    value: function () {
      var _Delete = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id, deleteFile) {
        var _result, result;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;

                if (!deleteFile) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 4;
                return _db.DB.Init.Query("SELECT * FROM files WHERE id=$1", [id]);

              case 4:
                _result = _context2.sent;

                if (_result[0]) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt("return", false);

              case 7:
                _context2.next = 9;
                return _fsExtra["default"].remove("".concat(_result[0].path, "/").concat(_result[0].name));

              case 9:
                _result = _context2.sent;

              case 10:
                _context2.next = 12;
                return _db.DB.Init.Query("DELETE FROM files WHERE id=$1", [id]);

              case 12:
                result = _context2.sent;
                return _context2.abrupt("return", true);

              case 16:
                _context2.prev = 16;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                throw {
                  err: 3002000,
                  msg: 'CFile Delete'
                };

              case 20:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 16]]);
      }));

      function Delete(_x3, _x4) {
        return _Delete.apply(this, arguments);
      }

      return Delete;
    }() //загрузка файлов

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

                if (ids) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return", false);

              case 3:
                ids = ids.join(',');
                _context3.next = 6;
                return _db.DB.Init.Query("SELECT * FROM files WHERE id in (".concat(ids, ")"));

              case 6:
                result = _context3.sent;
                result = result.map(function (item, i) {
                  if (item.owner_user_id) item.owner_id = -Number(item.owner_user_id);
                  if (item.owner_group_id) item.owner_id = -Number(item.owner_group_id);
                  if (item.from_user_id) item.from_id = -Number(item.from_user_id);
                  if (item.from_group_id) item.from_id = -Number(item.from_group_id);
                  delete item.owner_user_id;
                  delete item.owner_group_id;
                  delete item.from_user_id;
                  delete item.from_group_id;
                  return item;
                });
                return _context3.abrupt("return", result);

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  err: 3002000,
                  msg: 'CFile GetById'
                };

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 11]]);
      }));

      function GetById(_x5) {
        return _GetById.apply(this, arguments);
      }

      return GetById;
    }()
  }]);

  return _default;
}();

exports["default"] = _default;