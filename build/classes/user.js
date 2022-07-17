"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CUser = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _crypto = _interopRequireDefault(require("crypto"));

var _db = require("./db");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var CUser = /*#__PURE__*/function () {
  function CUser() {
    _classCallCheck(this, CUser);
  }

  _createClass(CUser, null, [{
    key: "Add",
    value: //добавить пользователя
    function () {
      var _Add = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(fields) {
        var hash, saltRounds, passwordSalt, arUsers, collection, arFields, result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                if (fields.email) fields.email = fields.email.toLowerCase();
                if (fields.login) fields.login = fields.login.toLowerCase(); //создаем hash код

                hash = new Date().toString();
                hash = _crypto["default"].createHash('md5').update(hash).digest("hex"); //создаем hash пароль

                saltRounds = 10;
                _context.next = 8;
                return _bcrypt["default"].genSalt(saltRounds);

              case 8:
                passwordSalt = _context.sent;
                _context.next = 11;
                return _bcrypt["default"].hash(fields.password, passwordSalt);

              case 11:
                fields.password = _context.sent;
                _context.next = 14;
                return this.GetByEmail(fields.email);

              case 14:
                arUsers = _context.sent;

                if (!arUsers) {
                  _context.next = 17;
                  break;
                }

                throw {
                  code: 30020001,
                  msg: 'Такой email уже зарегистрирован'
                };

              case 17:
                _context.next = 19;
                return this.GetByLogin(fields.login);

              case 19:
                arUsers = _context.sent;

                if (!arUsers) {
                  _context.next = 22;
                  break;
                }

                throw {
                  code: 30020001,
                  msg: 'Такой login уже зарегистрирован'
                };

              case 22:
                collection = _db.DB.Client.collection('user'); //список

                arFields = {
                  login: fields.login,
                  email: fields.email,
                  password: fields.password,
                  first_name: fields.first_name,
                  date_reg: new Date()
                };
                _context.next = 26;
                return collection.insertOne(arFields);

              case 26:
                result = _context.sent;
                return _context.abrupt("return", arFields);

              case 30:
                _context.prev = 30;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw _objectSpread(_objectSpread({}, {
                  code: 7001000,
                  msg: 'CUser AddUser'
                }), _context.t0);

              case 34:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 30]]);
      }));

      function Add(_x) {
        return _Add.apply(this, arguments);
      }

      return Add;
    }() //поиск по id

  }, {
    key: "GetById",
    value: function () {
      var _GetById = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(ids) {
        var collection, result;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                ids = new _db.DB().arObjectID(ids);
                collection = _db.DB.Client.collection('user'); //let result = await collection.find({_id: { $in: ids}}).toArray()

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
                }]).toArray();

              case 5:
                result = _context2.sent;
                return _context2.abrupt("return", result);

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                throw {
                  code: 7001000,
                  msg: 'CUser GetById'
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
    }() //поиск по email

  }, {
    key: "GetByEmail",
    value: function () {
      var _GetByEmail = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(email) {
        var collection, result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                //в нижний регистр
                email = email.toLowerCase();
                collection = _db.DB.Client.collection('user'); //let result = await collection.findOne({login})

                _context3.next = 5;
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
                result = _context3.sent;

                if (result.length) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt("return", false);

              case 8:
                return _context3.abrupt("return", result[0]);

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  code: 7001000,
                  msg: 'CUser GetByEmail'
                };

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 11]]);
      }));

      function GetByEmail(_x3) {
        return _GetByEmail.apply(this, arguments);
      }

      return GetByEmail;
    }() //поиск по login

  }, {
    key: "GetByLogin",
    value: function () {
      var _GetByLogin = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(login) {
        var collection, result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                //в нижний регистр
                login = login.toLowerCase();
                collection = _db.DB.Client.collection('user'); //let result = await collection.findOne({login})

                _context4.next = 5;
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
                  code: 7001000,
                  msg: 'CUser GetByLogin'
                };

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 11]]);
      }));

      function GetByLogin(_x4) {
        return _GetByLogin.apply(this, arguments);
      }

      return GetByLogin;
    }()
  }, {
    key: "Edit",
    value: function () {
      var _Edit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(id, fields) {
        var salt, collection, result;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                id = new _db.DB().ObjectID(id);

                if (!fields.password) {
                  _context5.next = 9;
                  break;
                }

                _context5.next = 5;
                return _bcrypt["default"].genSalt();

              case 5:
                salt = _context5.sent;
                _context5.next = 8;
                return _bcrypt["default"].hash(fields.password, salt);

              case 8:
                fields.password = _context5.sent;

              case 9:
                collection = _db.DB.Client.collection('user');
                result = collection.updateOne({
                  _id: id
                }, {
                  $set: fields
                }, {
                  upsert: true
                }); //let result = await DB.Init.Update (`${DB.Init.TablePrefix}user`, fields, {id: id},`id`)

                return _context5.abrupt("return", fields);

              case 14:
                _context5.prev = 14;
                _context5.t0 = _context5["catch"](0);
                console.log(_context5.t0);
                throw {
                  code: 7002000,
                  msg: 'CUser Edit'
                };

              case 18:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 14]]);
      }));

      function Edit(_x5, _x6) {
        return _Edit.apply(this, arguments);
      }

      return Edit;
    }() //поиск по пользователям

  }, {
    key: "Get",
    value: function () {
      var _Get = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(fields) {
        var collection, arAggregate, result;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
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
                arAggregate.push({
                  $sort: {
                    last_action_date: -1
                  }
                });
                _context6.next = 8;
                return collection.aggregate(arAggregate).limit(fields.count + fields.offset).skip(fields.offset).toArray();

              case 8:
                result = _context6.sent;
                return _context6.abrupt("return", result);

              case 12:
                _context6.prev = 12;
                _context6.t0 = _context6["catch"](0);
                console.log(_context6.t0);
                throw {
                  code: 7001000,
                  msg: 'CUser Get'
                };

              case 16:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 12]]);
      }));

      function Get(_x7) {
        return _Get.apply(this, arguments);
      }

      return Get;
    }() //количество / поиск по пользователям

  }, {
    key: "GetCount",
    value: function () {
      var _GetCount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(fields) {
        var collection, arSearch, result;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                collection = _db.DB.Client.collection('user');
                arSearch = {};
                if (fields.q) arSearch = {
                  $text: {
                    $search: fields.q
                  }
                };
                _context7.next = 6;
                return collection.count(arSearch);

              case 6:
                result = _context7.sent;
                return _context7.abrupt("return", result);

              case 10:
                _context7.prev = 10;
                _context7.t0 = _context7["catch"](0);
                console.log(_context7.t0);
                throw {
                  code: 7001000,
                  msg: 'CUser GetCount'
                };

              case 14:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 10]]);
      }));

      function GetCount(_x8) {
        return _GetCount.apply(this, arguments);
      }

      return GetCount;
    }()
  }, {
    key: "Count",
    value: function () {
      var _Count = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(fields) {
        var collection, result;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                collection = _db.DB.Client.collection('user');
                _context8.next = 4;
                return collection.count();

              case 4:
                result = _context8.sent;
                return _context8.abrupt("return", result);

              case 8:
                _context8.prev = 8;
                _context8.t0 = _context8["catch"](0);
                console.log(_context8.t0);
                throw {
                  code: 8001000,
                  msg: 'CUser Count'
                };

              case 12:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[0, 8]]);
      }));

      function Count(_x9) {
        return _Count.apply(this, arguments);
      }

      return Count;
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
            throw ({code: 8001000, msg: 'CVideo Count'})
        }
    }*/

    /*
        //пользователи
        static async GetByField ( items, fieldName ) {
            try {
                //нет массива для обработки
                if ((!items) || (!items.length))
                    return []
    
                let arUsersId = []
    
                items.forEach((item, i) => {
                    if (item[fieldName] > 0)
                        arUsersId.push(item[fieldName])
                })
    
                if (!arUsersId.length) return []
    
                //удаление одинаковых id из массива
                arUsersId = Array.from(new Set(arUsersId))
    
                let collection = DB.Client.collection('user');
                let result = await collection.aggregate([
                    { $match:
                            {
                                _id: {$in: arUsersId}
                            }
                    },
                    { $lookup:
                            {
                                from: 'file',
                                localField: 'photo',
                                foreignField: '_id',
                                as: '_photo',
                                pipeline: [
                                    { $lookup:
                                            {
                                                from: 'file',
                                                localField: 'file_id',
                                                foreignField: '_id',
                                                as: '_file_id'
                                            }
                                    },
                                    {
                                        $unwind:
                                            {
                                                path: '$_file_id',
                                                preserveNullAndEmptyArrays: true
                                            }
                                    }
                                ]
                            },
                    },
                    {
                        $unwind:
                            {
                                path: '$_photo',
                                preserveNullAndEmptyArrays: true
                            }
                    }
                ]).toArray();
    
                return result
    
            } catch (err) {
                console.log(err)
                throw ({code: 6005000, msg: 'CUser GetByField'})
            }
        }*/

    /*
    static async reset (value) {
        try {
            //создаем hash /нужно поменять на дату
            let hash = new Date().toString();
            hash = crypto.createHash('md5').update(hash).digest("hex");
    
            let arUsers = await modelsProfile.getUserByEmail(value.email);
            console.log(arUsers)
            if (!arUsers.length)
                throw ({code: 30040001, msg: 'Такой email не зарегистрирован'});
    
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
            throw ({...{code: 30040000, msg: 'Отправка кода на e-mail'}, ...err});
        }
    }
    static async resetActivate (value) {
        try {
            let code = await modelsProfile.getByCode(1, value.code);
            if (!code.length)
                throw ({code: 30050001, msg: 'Такого кода не существует, попробуйте востановить пароль еще раз'});
    
            //создание хеш пароля
            const saltRounds = 10;
            let passwordSalt = await bcrypt.genSalt(saltRounds);
            value.password = await bcrypt.hash(value.password, passwordSalt);
    
            await modelsProfile.setPassword(code[0].user_id, value.password);
    
            return true;
    
        } catch (err) {
            throw ({...{code: 30050000, msg: 'Отправка кода на e-mail'}, ...err});
        }*/

  }]);

  return CUser;
}();

exports.CUser = CUser;