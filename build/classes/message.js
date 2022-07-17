"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CMessage = void 0;

var _db = require("./db");

var _file = require("./file");

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var CMessage = /*#__PURE__*/function () {
  function CMessage() {
    _classCallCheck(this, CMessage);
  }

  _createClass(CMessage, null, [{
    key: "Add",
    value: //добавить новое видео
    function () {
      var _Add = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(fields) {
        var collection, arFieldsMessage, arFields, rsSearch, arQuery, _arFields, result;

        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                //обработка полей
                fields.from_id = new _db.DB().ObjectID(fields.from_id);
                fields.to_id = new _db.DB().ObjectID(fields.to_id);
                fields.file_ids = new _db.DB().arObjectID(fields.file_ids);
                fields.date = new Date(); //сначало само сообщение

                collection = _db.DB.Client.collection('message');
                arFieldsMessage = {
                  from_id: fields.from_id,
                  to_id: fields.to_id,
                  message: fields.message,
                  type: 'P',
                  file_ids: fields.file_ids,
                  read: null,
                  delete_from: null,
                  delete_to: null,
                  create_date: fields.date,
                  change_date: fields.date
                };
                _context.next = 9;
                return collection.insertOne(arFieldsMessage);

              case 9:
                //чат
                collection = _db.DB.Client.collection('chat'); //поиск чата с этим пользователем

                arFields = {
                  user_ids: {
                    $all: [fields.to_id, fields.from_id]
                  }
                };
                _context.next = 13;
                return collection.findOne(arFields);

              case 13:
                rsSearch = _context.sent;

                if (!rsSearch) {
                  _context.next = 19;
                  break;
                }

                arQuery = {
                  _id: rsSearch._id
                };
                _arFields = {
                  message_id: arFieldsMessage._id,
                  change_date: fields.date
                };
                result = collection.updateOne(arQuery, {
                  $set: _arFields
                });
                return _context.abrupt("return", arFieldsMessage);

              case 19:
                //чат нужно создать
                arFields = {
                  user_ids: [fields.from_id, fields.to_id],
                  message_id: arFieldsMessage._id,
                  //id последнего сообщения
                  create_date: fields.date,
                  change_date: fields.date
                };
                _context.next = 22;
                return collection.insertOne(arFields);

              case 22:
                return _context.abrupt("return", arFieldsMessage);

              case 25:
                _context.prev = 25;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw {
                  code: 5001000,
                  msg: 'CMessage Add'
                };

              case 29:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 25]]);
      }));

      function Add(_x) {
        return _Add.apply(this, arguments);
      }

      return Add;
    }()
  }, {
    key: "GetChat",
    value: function () {
      var _GetChat = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(fields) {
        var collection, Aggregate, result;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                fields.from_id = new _db.DB().ObjectID(fields.from_id);
                collection = _db.DB.Client.collection('chat');
                Aggregate = [{
                  $match: {
                    user_ids: fields.from_id
                  }
                }, {
                  $lookup: {
                    from: 'message',
                    localField: 'message_id',
                    foreignField: '_id',
                    as: '_message_id'
                  }
                }, {
                  $lookup: {
                    from: 'user',
                    localField: 'user_ids',
                    foreignField: '_id',
                    as: '_user_ids',
                    pipeline: [{
                      $lookup: {
                        from: 'file',
                        localField: 'photo',
                        foreignField: '_id',
                        as: '_photo'
                      }
                    }, {
                      $unwind: {
                        path: '$_photo',
                        preserveNullAndEmptyArrays: true
                      }
                    }]
                  }
                }, {
                  $unwind: {
                    path: '$_message_id',
                    preserveNullAndEmptyArrays: true
                  }
                }, {
                  $sort: {
                    change_date: -1
                  }
                }];
                _context2.next = 6;
                return collection.aggregate(Aggregate).limit(fields.count + fields.offset).skip(fields.offset).toArray();

              case 6:
                result = _context2.sent;
                return _context2.abrupt("return", result);

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                throw {
                  code: 5003000,
                  msg: 'CMessage Get'
                };

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 10]]);
      }));

      function GetChat(_x2) {
        return _GetChat.apply(this, arguments);
      }

      return GetChat;
    }()
  }, {
    key: "GetChatCount",
    value: function () {
      var _GetChatCount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(fields) {
        var collection, Aggregate, result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                fields.from_id = new _db.DB().ObjectID(fields.from_id);
                collection = _db.DB.Client.collection('chat');
                Aggregate = [{
                  $match: {
                    user_ids: fields.from_id
                  }
                }, {
                  $count: 'count'
                }];
                _context3.next = 6;
                return collection.aggregate(Aggregate).toArray();

              case 6:
                result = _context3.sent;

                if (result.length) {
                  _context3.next = 9;
                  break;
                }

                return _context3.abrupt("return", 0);

              case 9:
                return _context3.abrupt("return", result[0].count);

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  code: 5003000,
                  msg: 'CMessage Count'
                };

              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 12]]);
      }));

      function GetChatCount(_x3) {
        return _GetChatCount.apply(this, arguments);
      }

      return GetChatCount;
    }()
  }, {
    key: "GetByUser",
    value: function () {
      var _GetByUser = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(fields) {
        var collection, Aggregate, result;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                fields.to_id = new _db.DB().ObjectID(fields.to_id);
                fields.from_id = new _db.DB().ObjectID(fields.from_id);
                collection = _db.DB.Client.collection('message');
                Aggregate = [{
                  $match: {
                    $or: [{
                      to_id: fields.to_id,
                      from_id: fields.from_id,
                      delete_from: null
                    }, {
                      to_id: fields.from_id,
                      from_id: fields.to_id,
                      delete_to: null
                    }]
                  }
                }, {
                  $lookup: {
                    from: 'user',
                    localField: 'to_id',
                    foreignField: '_id',
                    as: '_to_id',
                    pipeline: [{
                      $lookup: {
                        from: 'file',
                        localField: 'photo',
                        foreignField: '_id',
                        as: '_photo'
                      }
                    }, {
                      $unwind: {
                        path: '$_photo',
                        preserveNullAndEmptyArrays: true
                      }
                    }]
                  }
                }, {
                  $lookup: {
                    from: 'user',
                    localField: 'from_id',
                    foreignField: '_id',
                    as: '_from_id',
                    pipeline: [{
                      $lookup: {
                        from: 'file',
                        localField: 'photo',
                        foreignField: '_id',
                        as: '_photo'
                      }
                    }, {
                      $unwind: {
                        path: '$_photo',
                        preserveNullAndEmptyArrays: true
                      }
                    }]
                  }
                }, {
                  $lookup: {
                    from: 'file',
                    localField: 'file_ids',
                    foreignField: '_id',
                    as: '_file_ids',
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
                    path: '$_from_id',
                    preserveNullAndEmptyArrays: true
                  }
                }, {
                  $unwind: {
                    path: '$_to_id',
                    preserveNullAndEmptyArrays: true
                  }
                }, {
                  $sort: {
                    _id: -1
                  }
                }];
                _context4.next = 7;
                return collection.aggregate(Aggregate).limit(fields.count + fields.offset).skip(fields.offset).toArray();

              case 7:
                result = _context4.sent;
                return _context4.abrupt("return", result);

              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4["catch"](0);
                console.log(_context4.t0);
                throw {
                  code: 5003000,
                  msg: 'CMessage GetChatUser'
                };

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 11]]);
      }));

      function GetByUser(_x4) {
        return _GetByUser.apply(this, arguments);
      }

      return GetByUser;
    }()
  }, {
    key: "GetByUserCount",
    value: function () {
      var _GetByUserCount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(fields) {
        var collection, Aggregate, result;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                fields.to_id = new _db.DB().ObjectID(fields.to_id);
                fields.from_id = new _db.DB().ObjectID(fields.from_id);
                collection = _db.DB.Client.collection('message');
                Aggregate = [{
                  $match: {
                    $or: [{
                      to_id: fields.to_id,
                      from_id: fields.from_id,
                      delete_from: null
                    }, {
                      to_id: fields.from_id,
                      from_id: fields.to_id,
                      delete_to: null
                    }]
                  }
                }, {
                  $count: 'count'
                }];
                _context5.next = 7;
                return collection.aggregate(Aggregate).toArray();

              case 7:
                result = _context5.sent;

                if (result.length) {
                  _context5.next = 10;
                  break;
                }

                return _context5.abrupt("return", 0);

              case 10:
                return _context5.abrupt("return", result[0].count);

              case 13:
                _context5.prev = 13;
                _context5.t0 = _context5["catch"](0);
                console.log(_context5.t0);
                throw {
                  code: 5003000,
                  msg: 'CMessage GetChatUser'
                };

              case 17:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 13]]);
      }));

      function GetByUserCount(_x5) {
        return _GetByUserCount.apply(this, arguments);
      }

      return GetByUserCount;
    }()
  }, {
    key: "CountNoRead",
    value: function () {
      var _CountNoRead = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(fields) {
        var collection, Aggregate, result;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                fields.from_id = new _db.DB().ObjectID(fields.from_id);
                fields.to_id = new _db.DB().ObjectID(fields.to_id);
                collection = _db.DB.Client.collection('message');
                Aggregate = [];
                if (!fields.from_id) Aggregate.push({
                  $match: {
                    to_id: fields.to_id,
                    read: null
                  }
                });else Aggregate.push({
                  $match: {
                    from_id: fields.from_id,
                    to_id: fields.to_id,
                    read: null
                  }
                });
                Aggregate.push({
                  $count: 'count'
                });
                /*
                let Aggregate = [
                    {
                        $match: {
                            to_id: fields.to_id,
                            read: null
                        }
                    },{
                        $count: 'count'
                    }
                ]*/

                _context6.next = 9;
                return collection.aggregate(Aggregate).toArray();

              case 9:
                result = _context6.sent;

                if (result.length) {
                  _context6.next = 12;
                  break;
                }

                return _context6.abrupt("return", 0);

              case 12:
                return _context6.abrupt("return", result[0].count);

              case 15:
                _context6.prev = 15;
                _context6.t0 = _context6["catch"](0);
                console.log(_context6.t0);
                throw {
                  code: 5003000,
                  msg: 'CMessage CountNoRead'
                };

              case 19:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 15]]);
      }));

      function CountNoRead(_x6) {
        return _CountNoRead.apply(this, arguments);
      }

      return CountNoRead;
    }() //загрузка по id

  }, {
    key: "GetById",
    value: function () {
      var _GetById = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(ids) {
        var collection, Aggregate, result;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                ids = new _db.DB().arObjectID(ids);
                collection = _db.DB.Client.collection('message');
                Aggregate = [{
                  $match: {
                    _id: {
                      $in: ids
                    }
                  }
                }, {
                  $lookup: {
                    from: 'user',
                    localField: 'to_id',
                    foreignField: '_id',
                    as: '_to_id',
                    pipeline: [{
                      $lookup: {
                        from: 'file',
                        localField: 'photo',
                        foreignField: '_id',
                        as: '_photo'
                      }
                    }, {
                      $unwind: {
                        path: '$_photo',
                        preserveNullAndEmptyArrays: true
                      }
                    }]
                  }
                }, {
                  $lookup: {
                    from: 'user',
                    localField: 'from_id',
                    foreignField: '_id',
                    as: '_from_id',
                    pipeline: [{
                      $lookup: {
                        from: 'file',
                        localField: 'photo',
                        foreignField: '_id',
                        as: '_photo'
                      }
                    }, {
                      $unwind: {
                        path: '$_photo',
                        preserveNullAndEmptyArrays: true
                      }
                    }]
                  }
                }, {
                  $lookup: {
                    from: 'file',
                    localField: 'file_ids',
                    foreignField: '_id',
                    as: '_file_ids',
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
                    path: '$_from_id',
                    preserveNullAndEmptyArrays: true
                  }
                }, {
                  $unwind: {
                    path: '$_to_id',
                    preserveNullAndEmptyArrays: true
                  }
                }, {
                  $sort: {
                    _id: -1
                  }
                }];
                _context7.next = 6;
                return collection.aggregate(Aggregate).toArray();

              case 6:
                result = _context7.sent;
                return _context7.abrupt("return", result);

              case 10:
                _context7.prev = 10;
                _context7.t0 = _context7["catch"](0);
                console.log(_context7.t0);
                throw {
                  code: 6002000,
                  msg: 'CMessage GetById'
                };

              case 14:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 10]]);
      }));

      function GetById(_x7) {
        return _GetById.apply(this, arguments);
      }

      return GetById;
    }()
  }, {
    key: "Delete",
    value: function () {
      var _Delete = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(id, myUserId) {
        var arResult, collection, arQuery, arFields, result;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                id = new _db.DB().ObjectID(id);
                _context8.next = 4;
                return this.GetById([id]);

              case 4:
                arResult = _context8.sent;

                if (arResult.length) {
                  _context8.next = 7;
                  break;
                }

                return _context8.abrupt("return", false);

              case 7:
                arResult = arResult[0];
                collection = _db.DB.Client.collection('message');
                arQuery = {
                  _id: id
                };
                arFields = {};
                if (arResult.from_id.toString() === myUserId.toString()) arFields.delete_from = true;else arFields.delete_to = true;
                result = collection.updateOne(arQuery, {
                  $set: arFields
                });
                return _context8.abrupt("return", result);

              case 16:
                _context8.prev = 16;
                _context8.t0 = _context8["catch"](0);
                console.log(_context8.t0);
                throw {
                  code: 7001000,
                  msg: 'CMessage Delete'
                };

              case 20:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[0, 16]]);
      }));

      function Delete(_x8, _x9) {
        return _Delete.apply(this, arguments);
      }

      return Delete;
    }() //прочитать все сообщения с пользователем

  }, {
    key: "ReadAll",
    value: function () {
      var _ReadAll = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(fields) {
        var collection, arQuery, arFields, result;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                fields.to_id = new _db.DB().ObjectID(fields.to_id);
                fields.from_id = new _db.DB().ObjectID(fields.from_id);
                collection = _db.DB.Client.collection('message');
                arQuery = {
                  to_id: fields.from_id,
                  from_id: fields.to_id
                };
                /*
                let arQuery = {
                    to_id: fields.to_id,
                    from_id: fields.from_id
                }*/

                arFields = {
                  read: true
                };
                result = collection.update(arQuery, {
                  $set: arFields
                });
                return _context9.abrupt("return", result);

              case 10:
                _context9.prev = 10;
                _context9.t0 = _context9["catch"](0);
                console.log(_context9.t0);
                throw {
                  code: 5004000,
                  msg: 'CMessage MarkAsReadAll'
                };

              case 14:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[0, 10]]);
      }));

      function ReadAll(_x10) {
        return _ReadAll.apply(this, arguments);
      }

      return ReadAll;
    }()
  }, {
    key: "Edit",
    value: function () {
      var _Edit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(id, fields) {
        var collection, arFields, result;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                id = new _db.DB().ObjectID(id);
                collection = _db.DB.Client.collection('message');
                arFields = {
                  _id: id
                };
                result = collection.updateOne(arFields, {
                  $set: fields
                });
                return _context10.abrupt("return", result);

              case 8:
                _context10.prev = 8;
                _context10.t0 = _context10["catch"](0);
                console.log(_context10.t0);
                throw {
                  code: 8001000,
                  msg: 'CMessage Edit'
                };

              case 12:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[0, 8]]);
      }));

      function Edit(_x11, _x12) {
        return _Edit.apply(this, arguments);
      }

      return Edit;
    }()
    /*
    //прочитать выбранные сообщения
    static async MarkAsRead( fields ) {
        try {
            let sql = `UPDATE ${DB.Init.TablePrefix}message SET read = true WHERE (from_id=${fields.from_id} OR to_id=${fields.from_id}) AND id in (${fields.ids})`
            let result = await DB.Init.Query(sql)
          } catch (err) {
            console.log(err)
            throw ({code: 5005000, msg: 'CMessage Add'})
        }
    }
      //удалить все сообщения с пользователем
    static async DeleteAll( fields ) {
        try {
            let sql = `UPDATE ${DB.Init.TablePrefix}message SET delete_from = true WHERE (from_id=${fields.from_id} AND to_id=${fields.to_id}) OR (to_id=${fields.from_id} AND from_id=${fields.to_id})`
            let result = await DB.Init.Query(sql)
          } catch (err) {
            console.log(err)
            throw ({code: 5005000, msg: 'CMessage DeleteAll'})
        }
    }
    */

    /*
    //удалить выбранные сообщения
    static async Delete( fields ) {
        try {
            fields.ids = fields.ids.join(',');
            let sql = `UPDATE ${DB.Init.TablePrefix}message SET delete_from = true WHERE (from_id=${fields.from_id} OR to_id=${fields.from_id}) AND id in (${fields.ids})`
            let result = await DB.Init.Query(sql)
          } catch (err) {
            console.log(err)
            throw ({code: 5005000, msg: 'CMessage Add'})
        }
    }*/

  }]);

  return CMessage;
}();

exports.CMessage = CMessage;