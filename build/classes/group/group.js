"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CGroup = void 0;

var _db = require("../db");

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var CGroup = /*#__PURE__*/function () {
  function CGroup() {
    _classCallCheck(this, CGroup);
  }

  _createClass(CGroup, null, [{
    key: "Add",
    value: //добавить новую группу
    function () {
      var _Add = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(fields) {
        var collection, result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                fields.create_id = new _db.DB().ObjectID(fields.create_id);
                collection = _db.DB.Client.collection('group');
                _context.next = 5;
                return collection.insertOne(fields);

              case 5:
                result = _context.sent;
                return _context.abrupt("return", fields);

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw {
                  code: 4001000,
                  msg: 'CGroup Add'
                };

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 9]]);
      }));

      function Add(_x) {
        return _Add.apply(this, arguments);
      }

      return Add;
    }() //загрузка по id

  }, {
    key: "GetById",
    value: function () {
      var _GetById = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(ids) {
        var collection, aggregate, result;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                ids = new _db.DB().arObjectID(ids);
                collection = _db.DB.Client.collection('group'); //let result = await collection.find({_id: { $in: ids}}).toArray()

                aggregate = [{
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
                }];
                _context2.next = 6;
                return collection.aggregate(aggregate).toArray();

              case 6:
                result = _context2.sent;
                return _context2.abrupt("return", result);

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](0);
                console.log(_context2.t0);
                throw {
                  code: 4002000,
                  msg: 'CGroup GetById'
                };

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 10]]);
      }));

      function GetById(_x2) {
        return _GetById.apply(this, arguments);
      }

      return GetById;
    }() //загрузка

  }, {
    key: "Get",
    value: function () {
      var _Get = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(fields) {
        var collection, arAggregate, result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                fields.user_id = new _db.DB().ObjectID(fields.user_id);
                collection = _db.DB.Client.collection('group');
                arAggregate = [];
                if (fields.user_id || fields.q) arAggregate.push({
                  $match: {}
                });
                if (fields.user_id) arAggregate[0].$match.create_id = fields.user_id;

                if (fields.q) {
                  arAggregate[0].$match.$text = {};
                  arAggregate[0].$match.$text.$search = fields.q;
                }

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
                    }, {
                      $unwind: {
                        path: '$_file_id',
                        preserveNullAndEmptyArrays: true
                      }
                    }]
                  }
                });
                arAggregate.push({
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
                });
                arAggregate.push({
                  $unwind: {
                    path: '$_photo',
                    preserveNullAndEmptyArrays: true
                  }
                });
                arAggregate.push({
                  $unwind: {
                    path: '$_photo_big',
                    preserveNullAndEmptyArrays: true
                  }
                }); //return arAggregate
                //let result = await collection.find({_id: { $in: ids}}).toArray()

                _context3.next = 13;
                return collection.aggregate(arAggregate).limit(fields.count + fields.offset).skip(fields.offset).toArray();

              case 13:
                result = _context3.sent;
                return _context3.abrupt("return", result);

              case 17:
                _context3.prev = 17;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  code: 4003000,
                  msg: 'CGroup Get'
                };

              case 21:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 17]]);
      }));

      function Get(_x3) {
        return _Get.apply(this, arguments);
      }

      return Get;
    }() //количество

  }, {
    key: "GetCount",
    value: function () {
      var _GetCount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(fields) {
        var collection, arFields;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                fields.user_id = new _db.DB().ObjectID(fields.user_id);
                collection = _db.DB.Client.collection('group');
                arFields = {};
                if (fields.user_id) arFields.create_id = fields.user_id;

                if (fields.q) {
                  arFields.$text = {};
                  arFields.$text.$search = fields.q;
                }

                _context4.next = 8;
                return collection.count(arFields);

              case 8:
                return _context4.abrupt("return", _context4.sent);

              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4["catch"](0);
                console.log(_context4.t0);
                throw {
                  code: 4004000,
                  msg: 'CGroup GetCount'
                };

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 11]]);
      }));

      function GetCount(_x4) {
        return _GetCount.apply(this, arguments);
      }

      return GetCount;
    }()
  }, {
    key: "Count",
    value: function () {
      var _Count = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(fields) {
        var collection, result;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
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
                  code: 8001000,
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
    }()
    /*
        //пользователи
        static async GetUsers ( items ) {
            try {
                //нет массива для обработки
                if ((!items) || (!items.length))
                    return []
    
    
                let arUsersId = items.map((item, i) => {
                    return item.create_id
                })
    
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
    
                /*
                let sql = `SELECT id,login,first_name,create_date,birthday,photo FROM ${DB.Init.TablePrefix}user WHERE id in (${arUsersId})`
                let users = await DB.Init.Query(sql)
    
                users = await Promise.all(users.map(async (user, i)=>{
                    if (user.photo) {
                        user.photo = await CFile.GetById([user.photo]);
                        user.photo = user.photo[0]
                    }
                    return user
                }))
    
                return result
    
            } catch (err) {
                console.log(err)
                throw ({code: 4005000, msg: 'CGroup GetUsers'})
            }
        }
    */

  }, {
    key: "Update",
    value: function () {
      var _Update = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(id, fields) {
        var collection, result;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                id = new _db.DB().ObjectID(id);
                collection = _db.DB.Client.collection('group');
                result = collection.updateOne({
                  _id: id
                }, {
                  $set: fields
                }, {
                  upsert: true
                });
                return _context6.abrupt("return", result);

              case 7:
                _context6.prev = 7;
                _context6.t0 = _context6["catch"](0);
                console.log(_context6.t0);
                throw {
                  code: 4006000,
                  msg: 'CGroup Update'
                };

              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 7]]);
      }));

      function Update(_x6, _x7) {
        return _Update.apply(this, arguments);
      }

      return Update;
    }() //удаление группы

  }, {
    key: "Delete",
    value: function () {
      var _Delete = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(id) {
        var collection, result;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                id = new _db.DB().ObjectID(id);
                collection = _db.DB.Client.collection('group');
                result = collection.updateOne({
                  _id: id
                }, {
                  $set: {
                    "delete": true
                  }
                }, {
                  upsert: true
                });
                return _context7.abrupt("return", result);

              case 7:
                _context7.prev = 7;
                _context7.t0 = _context7["catch"](0);
                console.log(_context7.t0);
                throw {
                  code: 4007000,
                  msg: 'CGroup Delete'
                };

              case 11:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 7]]);
      }));

      function Delete(_x8) {
        return _Delete.apply(this, arguments);
      }

      return Delete;
    }() //ТРАНЗАКЦИИ ПЛАТЕЖНОЙ СИСТЕМЫ YANDEX
    //добавить новую группу

  }, {
    key: "PayTransactionAdd",
    value: function () {
      var _PayTransactionAdd = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(fields) {
        var arFields, collection, result;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.prev = 0;
                fields.user_id = new _db.DB().ObjectID(fields.user_id);
                fields.group_id = new _db.DB().ObjectID(fields.group_id);
                arFields = {
                  user_id: fields.user_id,
                  group_id: fields.group_id,
                  pay_id: fields.pay_id,
                  status: fields.status,
                  price: fields.price,
                  url: fields.url,
                  date_create: new Date()
                };
                collection = _db.DB.Client.collection('pay_transaction_group');
                _context8.next = 7;
                return collection.insertOne(arFields);

              case 7:
                result = _context8.sent;
                return _context8.abrupt("return", fields);

              case 11:
                _context8.prev = 11;
                _context8.t0 = _context8["catch"](0);
                console.log(_context8.t0);
                throw {
                  code: 4001000,
                  msg: 'CGroup PayTransactionAdd'
                };

              case 15:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[0, 11]]);
      }));

      function PayTransactionAdd(_x9) {
        return _PayTransactionAdd.apply(this, arguments);
      }

      return PayTransactionAdd;
    }() //добавить новую группу

  }, {
    key: "PayTransactionGet",
    value: function () {
      var _PayTransactionGet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(fields) {
        var collection, result;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                collection = _db.DB.Client.collection('pay_transaction_group');
                _context9.next = 4;
                return collection.findOne(fields);

              case 4:
                result = _context9.sent;
                return _context9.abrupt("return", result);

              case 8:
                _context9.prev = 8;
                _context9.t0 = _context9["catch"](0);
                console.log(_context9.t0);
                throw {
                  code: 4001000,
                  msg: 'CGroup PayTransactionGet'
                };

              case 12:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, null, [[0, 8]]);
      }));

      function PayTransactionGet(_x10) {
        return _PayTransactionGet.apply(this, arguments);
      }

      return PayTransactionGet;
    }()
  }, {
    key: "PayTransactionUpdate",
    value: function () {
      var _PayTransactionUpdate = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(fields) {
        var collection, result;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                collection = _db.DB.Client.collection('pay_transaction_group');
                result = collection.updateOne({
                  pay_id: fields.pay_id
                }, {
                  $set: {
                    status: fields.status
                  }
                }, {
                  upsert: true
                });
                return _context10.abrupt("return", result);

              case 6:
                _context10.prev = 6;
                _context10.t0 = _context10["catch"](0);
                console.log(_context10.t0);
                throw {
                  code: 4001000,
                  msg: 'CGroup PayTransactionAdd'
                };

              case 10:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[0, 6]]);
      }));

      function PayTransactionUpdate(_x11) {
        return _PayTransactionUpdate.apply(this, arguments);
      }

      return PayTransactionUpdate;
    }() //ОПЛАТА ГРУППЫ ПОЛЬЗОВАТЕЛЕМ
    //добавить новую группу

  }, {
    key: "PayAdd",
    value: function () {
      var _PayAdd = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(fields) {
        var collection, arFields, getResult, getResultActual, dateDay, newDateDay, arSearch, _result, _result2, result;

        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                fields.user_id = new _db.DB().ObjectID(fields.user_id);
                fields.group_id = new _db.DB().ObjectID(fields.group_id);
                fields.transaction_id = new _db.DB().ObjectID(fields.transaction_id);
                collection = _db.DB.Client.collection('pay_group');
                arFields = {
                  user_id: fields.user_id,
                  group_id: fields.group_id
                };
                _context11.next = 8;
                return this.PayGet(arFields);

              case 8:
                getResult = _context11.sent;
                arFields.actual = true;
                _context11.next = 12;
                return this.PayGet(arFields);

              case 12:
                getResultActual = _context11.sent;
                //сколько дней оплаты
                dateDay = new Date();
                newDateDay = Day(fields.day);
                arSearch = {
                  user_id: fields.user_id,
                  group_id: fields.group_id
                }; //еще действует оплата

                if (!getResultActual) {
                  _context11.next = 20;
                  break;
                }

                arFields = {
                  date_pay: Day(fields.day, getResultActual.date_pay),
                  transaction_id: fields.transaction_id,
                  price: fields.price,
                  change_date: new Date() //date_create: new Date()

                };
                _result = collection.updateOne(arSearch, {
                  $set: arFields
                }, {
                  upsert: true
                });
                return _context11.abrupt("return", true);

              case 20:
                if (!getResult) {
                  _context11.next = 24;
                  break;
                }

                arFields = {
                  date_pay: Day(fields.day, dateDay),
                  transaction_id: fields.transaction_id,
                  price: fields.price,
                  change_date: new Date()
                };
                _result2 = collection.updateOne(arSearch, {
                  $set: arFields
                }, {
                  upsert: true
                });
                return _context11.abrupt("return", true);

              case 24:
                //новая оплата
                arFields = {
                  date_pay: newDateDay,
                  transaction_id: fields.transaction_id,
                  price: fields.price,
                  change_date: new Date(),
                  date_create: new Date()
                };
                result = collection.updateOne(arSearch, {
                  $set: arFields
                }, {
                  upsert: true
                });
                return _context11.abrupt("return", true);

              case 29:
                _context11.prev = 29;
                _context11.t0 = _context11["catch"](0);
                console.log(_context11.t0);
                throw {
                  code: 4001000,
                  msg: 'CGroup PayAdd'
                };

              case 33:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[0, 29]]);
      }));

      function PayAdd(_x12) {
        return _PayAdd.apply(this, arguments);
      }

      return PayAdd;
    }() //добавить новую группу

  }, {
    key: "PayGet",
    value: function () {
      var _PayGet = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(fields) {
        var collection, arFields, result;
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                fields.user_id = new _db.DB().ObjectID(fields.user_id);
                fields.group_id = new _db.DB().ObjectID(fields.group_id);
                collection = _db.DB.Client.collection('pay_group');
                arFields = {
                  user_id: fields.user_id,
                  group_id: fields.group_id
                };
                _context12.next = 7;
                return collection.findOne(arFields);

              case 7:
                result = _context12.sent;

                if (result) {
                  _context12.next = 10;
                  break;
                }

                return _context12.abrupt("return", false);

              case 10:
                if (fields.actual) {
                  _context12.next = 12;
                  break;
                }

                return _context12.abrupt("return", result);

              case 12:
                if (!(fields.actual && result.date_pay < new Date())) {
                  _context12.next = 14;
                  break;
                }

                return _context12.abrupt("return", false);

              case 14:
                return _context12.abrupt("return", result);

              case 17:
                _context12.prev = 17;
                _context12.t0 = _context12["catch"](0);
                console.log(_context12.t0);
                throw {
                  code: 4001000,
                  msg: 'CGroup PayGet'
                };

              case 21:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, null, [[0, 17]]);
      }));

      function PayGet(_x13) {
        return _PayGet.apply(this, arguments);
      }

      return PayGet;
    }() //СТАТУС ГРУППЫ
    //добавить новую группу

  }, {
    key: "StatusPay",
    value: function () {
      var _StatusPay = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(fields) {
        var group, result, dateSystem, datePay;
        return _regeneratorRuntime().wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0;
                fields.user_id = new _db.DB().ObjectID(fields.user_id);
                fields.group_id = new _db.DB().ObjectID(fields.group_id);
                _context13.next = 5;
                return this.GetById([fields.group_id]);

              case 5:
                group = _context13.sent;
                if (group.length) group = group[0]; //группа бесплатная

                if (group.price) {
                  _context13.next = 9;
                  break;
                }

                return _context13.abrupt("return", true);

              case 9:
                if (!(group.price && !fields.user_id)) {
                  _context13.next = 11;
                  break;
                }

                return _context13.abrupt("return", false);

              case 11:
                _context13.next = 13;
                return this.PayGet(fields);

              case 13:
                result = _context13.sent;

                if (result) {
                  _context13.next = 16;
                  break;
                }

                return _context13.abrupt("return", false);

              case 16:
                //оплата закончилась
                dateSystem = new Date();
                datePay = new Date(result.pay_date);

                if (!(dateSystem > datePay)) {
                  _context13.next = 20;
                  break;
                }

                return _context13.abrupt("return", false);

              case 20:
                return _context13.abrupt("return", true);

              case 23:
                _context13.prev = 23;
                _context13.t0 = _context13["catch"](0);
                console.log(_context13.t0);
                throw {
                  code: 4001000,
                  msg: 'CGroup PayStatus'
                };

              case 27:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[0, 23]]);
      }));

      function StatusPay(_x14) {
        return _StatusPay.apply(this, arguments);
      }

      return StatusPay;
    }() //Права доступа

  }, {
    key: "StatusAccess",
    value: function () {
      var _StatusAccess = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(fields) {
        var collection, arFields, result;
        return _regeneratorRuntime().wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;

                if (!(!fields.user_id || !fields.group_id)) {
                  _context14.next = 3;
                  break;
                }

                return _context14.abrupt("return", false);

              case 3:
                if (fields.group_id) {
                  _context14.next = 5;
                  break;
                }

                return _context14.abrupt("return", true);

              case 5:
                fields.user_id = new _db.DB().ObjectID(fields.user_id);
                fields.group_id = new _db.DB().ObjectID(fields.group_id);
                collection = _db.DB.Client.collection('group');
                arFields = {
                  _id: fields.group_id,
                  create_id: fields.user_id
                };
                _context14.next = 11;
                return collection.findOne(arFields);

              case 11:
                result = _context14.sent;

                if (!result) {
                  _context14.next = 14;
                  break;
                }

                return _context14.abrupt("return", true);

              case 14:
                return _context14.abrupt("return", false);

              case 17:
                _context14.prev = 17;
                _context14.t0 = _context14["catch"](0);
                console.log(_context14.t0);
                throw {
                  code: 4001000,
                  msg: 'CGroup Access'
                };

              case 21:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, null, [[0, 17]]);
      }));

      function StatusAccess(_x15) {
        return _StatusAccess.apply(this, arguments);
      }

      return StatusAccess;
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
                throw ({code: 6005000, msg: 'CGroup GetByField'})
            }
        }*/

  }]);

  return CGroup;
}();

exports.CGroup = CGroup;

function Day(day) {
  var startDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  var date = new Date(startDate); // Now

  date.setDate(date.getDate() + day); // Set now + 30 days as the new date

  return date;
}