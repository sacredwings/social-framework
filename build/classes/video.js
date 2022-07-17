"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CVideo = void 0;

var _db = require("./db");

var _file = require("./file");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var CVideo = /*#__PURE__*/function () {
  function CVideo() {
    _classCallCheck(this, CVideo);
  }

  _createClass(CVideo, null, [{
    key: "Edit",
    value: //добавить новое видео
    function () {
      var _Edit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(id, fields) {
        var collection, arFields, result;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                // сделать проверку, что файл и альбом твои

                /*
                            let arFields = {
                                file_id: fields.file_id,
                                title: fields.title,
                                text: fields.text
                            }
                */
                id = new _db.DB().ObjectID(id);
                if (fields.album_ids) fields.album_ids = new _db.DB().arObjectID(fields.album_ids);
                collection = _db.DB.Client.collection('file');
                arFields = {
                  _id: id
                };
                result = collection.updateOne(arFields, {
                  $set: fields
                });
                return _context.abrupt("return", result);

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](0);
                console.log(_context.t0);
                throw {
                  code: 8001000,
                  msg: 'CVideo Edit'
                };

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 9]]);
      }));

      function Edit(_x, _x2) {
        return _Edit.apply(this, arguments);
      }

      return Edit;
    }() //загрузка по id

  }, {
    key: "GetById",
    value: function () {
      var _GetById = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(ids) {
        var collection, result;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                ids = new _db.DB().arObjectID(ids);
                collection = _db.DB.Client.collection('file'); //let result = await collection.find({_id: { $in: ids}}).toArray()

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
                    localField: 'file_id',
                    foreignField: '_id',
                    as: '_file_id'
                  }
                }, {
                  $lookup: {
                    from: 'album',
                    localField: 'album_ids',
                    foreignField: '_id',
                    as: '_album_ids'
                  }
                }, {
                  $unwind: {
                    path: '$_file_id',
                    preserveNullAndEmptyArrays: true
                  }
                }]).toArray();

              case 5:
                result = _context3.sent;
                _context3.next = 8;
                return Promise.all(result.map( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(item, i) {
                    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            if (item.text === null) item.text = '';
                            return _context2.abrupt("return", item);

                          case 2:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  }));

                  return function (_x4, _x5) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 8:
                result = _context3.sent;
                return _context3.abrupt("return", result);

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](0);
                console.log(_context3.t0);
                throw {
                  code: 8001000,
                  msg: 'CVideo GetById'
                };

              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 12]]);
      }));

      function GetById(_x3) {
        return _GetById.apply(this, arguments);
      }

      return GetById;
    }() //загрузка

  }, {
    key: "Get",
    value: function () {
      var _Get = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(fields) {
        var arSearchLike, strSearchLike, _iterator, _step, searchLike, collection, arAggregate, result;

        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;

                if (fields.q) {
                  fields.q = fields.q.replace(/[^a-zа-яё\s]/gi, '');
                  fields.q = fields.q.replace(/ +/g, ' ').trim();
                  arSearchLike = fields.q.split(' ');
                  strSearchLike = '';
                  _iterator = _createForOfIteratorHelper(arSearchLike);

                  try {
                    for (_iterator.s(); !(_step = _iterator.n()).done;) {
                      searchLike = _step.value;
                      strSearchLike += "\"".concat(searchLike, "\" ");
                    }
                  } catch (err) {
                    _iterator.e(err);
                  } finally {
                    _iterator.f();
                  }

                  fields.q = strSearchLike;
                }

                fields.to_user_id = new _db.DB().ObjectID(fields.to_user_id);
                fields.to_group_id = new _db.DB().ObjectID(fields.to_group_id);
                fields.album_id = new _db.DB().ObjectID(fields.album_id); //if (fields.to_group_id)
                //delete fields.to_user_id

                collection = _db.DB.Client.collection('file');
                arAggregate = [];
                arAggregate.push({
                  $match: {
                    $or: [{
                      type: 'video/mp4'
                    }, {
                      type: 'video/avi'
                    }]
                  }
                });
                arAggregate.push({
                  $lookup: {
                    from: 'file',
                    localField: 'file_id',
                    foreignField: '_id',
                    as: '_file_id'
                  }
                });
                arAggregate.push({
                  $lookup: {
                    from: 'album',
                    localField: 'album_ids',
                    foreignField: '_id',
                    as: '_album_ids'
                  }
                }); //нет группы, ищем только в бесплатных группах

                if (!fields.to_group_id && !fields.to_user_id) {
                  arAggregate.push({
                    $lookup: {
                      from: 'group',
                      localField: 'to_group_id',
                      foreignField: '_id',
                      as: '_to_group_id'
                    }
                  });
                  arAggregate.push({
                    $match: {
                      $or: [{
                        '_to_group_id.price': null
                      }, {
                        '_to_group_id.price': 0
                      } //{'_to_group_id.price': { '$exists' : true }},
                      ]
                    }
                  });
                }

                arAggregate.push({
                  $unwind: {
                    path: '$_file_id',
                    preserveNullAndEmptyArrays: true
                  }
                });
                if (fields.q) arAggregate[0].$match.$text = {};
                if (fields.q) arAggregate[0].$match.$text.$search = "".concat(fields.q);
                if (fields.to_user_id && !fields.to_group_id) arAggregate[0].$match.to_user_id = fields.to_user_id;
                if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id;
                if (fields.album_id) arAggregate[0].$match.album_ids = fields.album_id;
                /*
                if (!fields.to_group_id) {
                    arAggregate.push(
                        { $lookup:
                                {
                                    from: 'group',
                                    localField: 'to_group_id',
                                    foreignField: '_id',
                                    as: '_to_group_id',
                                }
                        }
                    )
                      arAggregate.push(
                        { $match: {
                                "_to_group_id.price": null,
                              }
                        }
                    )
                }*/

                arAggregate.push({
                  $sort: {
                    comment: -1,
                    like: -1,
                    view: -1,
                    _id: -1
                  }
                });
                _context4.next = 20;
                return collection.aggregate(arAggregate).limit(fields.count + fields.offset).skip(fields.offset).toArray();

              case 20:
                result = _context4.sent;
                return _context4.abrupt("return", result);

              case 24:
                _context4.prev = 24;
                _context4.t0 = _context4["catch"](0);
                console.log(_context4.t0);
                throw {
                  code: 8001000,
                  msg: 'CVideo Get'
                };

              case 28:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 24]]);
      }));

      function Get(_x6) {
        return _Get.apply(this, arguments);
      }

      return Get;
    }() //количество

  }, {
    key: "GetCount",
    value: function () {
      var _GetCount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(fields) {
        var arSearchLike, strSearchLike, _iterator2, _step2, searchLike, collection, arAggregate, result;

        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;

                if (fields.q) {
                  fields.q = fields.q.replace(/[^a-zа-яё\s]/gi, '');
                  fields.q = fields.q.replace(/ +/g, ' ').trim();
                  arSearchLike = fields.q.split(' ');
                  strSearchLike = '';
                  _iterator2 = _createForOfIteratorHelper(arSearchLike);

                  try {
                    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                      searchLike = _step2.value;
                      strSearchLike += "\"".concat(searchLike, "\" ");
                    }
                  } catch (err) {
                    _iterator2.e(err);
                  } finally {
                    _iterator2.f();
                  }

                  fields.q = strSearchLike;
                }

                fields.to_user_id = new _db.DB().ObjectID(fields.to_user_id);
                fields.to_group_id = new _db.DB().ObjectID(fields.to_group_id);
                fields.album_id = new _db.DB().ObjectID(fields.album_id); //if (fields.to_group_id)
                //delete fields.to_user_id

                collection = _db.DB.Client.collection('file');
                arAggregate = [{
                  $match: {
                    $or: [{
                      type: 'video/mp4'
                    }, {
                      type: 'video/avi'
                    }]
                  }
                }]; //нет группы, ищем только в бесплатных группах

                if (!fields.to_group_id && !fields.to_user_id) {
                  arAggregate.push({
                    $lookup: {
                      from: 'group',
                      localField: 'to_group_id',
                      foreignField: '_id',
                      as: '_to_group_id'
                    }
                  });
                  arAggregate.push({
                    $match: {
                      $or: [{
                        '_to_group_id.price': null
                      }, {
                        '_to_group_id.price': 0
                      } //{'_to_group_id.price': { '$exists' : true }},
                      ]
                    }
                  });
                }

                if (fields.q) arAggregate[0].$match.$text = {};
                if (fields.q) arAggregate[0].$match.$text.$search = "".concat(fields.q);
                if (fields.to_user_id && !fields.to_group_id) arAggregate[0].$match.to_user_id = fields.to_user_id;
                if (fields.to_group_id) arAggregate[0].$match.to_group_id = fields.to_group_id;
                if (fields.album_id) arAggregate[0].$match.album_ids = fields.album_id;
                /*
                if (!fields.to_group_id) {
                    arAggregate.push(
                        { $lookup:
                                {
                                    from: 'group',
                                    localField: 'to_group_id',
                                    foreignField: '_id',
                                    as: '_to_group_id',
                                }
                        }
                    )
                      arAggregate.push(
                        { $match: {
                                "_to_group_id.price": null,
                              }
                        }
                    )
                }*/

                arAggregate.push({
                  $count: 'count'
                });
                _context5.next = 16;
                return collection.aggregate(arAggregate).toArray();

              case 16:
                result = _context5.sent;

                if (result.length) {
                  _context5.next = 19;
                  break;
                }

                return _context5.abrupt("return", 0);

              case 19:
                return _context5.abrupt("return", result[0].count);

              case 22:
                _context5.prev = 22;
                _context5.t0 = _context5["catch"](0);
                console.log(_context5.t0);
                throw {
                  code: 8001000,
                  msg: 'CVideo GetCount'
                };

              case 26:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 22]]);
      }));

      function GetCount(_x7) {
        return _GetCount.apply(this, arguments);
      }

      return GetCount;
    }()
  }, {
    key: "Count",
    value: function () {
      var _Count = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(fields) {
        var collection, result;
        return _regeneratorRuntime().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                collection = _db.DB.Client.collection('file');
                _context6.next = 4;
                return collection.count();

              case 4:
                result = _context6.sent;
                return _context6.abrupt("return", result);

              case 8:
                _context6.prev = 8;
                _context6.t0 = _context6["catch"](0);
                console.log(_context6.t0);
                throw {
                  code: 8001000,
                  msg: 'CVideo Count'
                };

              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 8]]);
      }));

      function Count(_x8) {
        return _Count.apply(this, arguments);
      }

      return Count;
    }()
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
                collection = _db.DB.Client.collection('file');
                result = collection.deleteOne({
                  _id: id
                });
                return _context7.abrupt("return", result);

              case 7:
                _context7.prev = 7;
                _context7.t0 = _context7["catch"](0);
                console.log(_context7.t0);
                throw {
                  code: 7001000,
                  msg: 'CVideo Delete'
                };

              case 11:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 7]]);
      }));

      function Delete(_x9) {
        return _Delete.apply(this, arguments);
      }

      return Delete;
    }()
    /*
        //пользователи
        static async GetUsers ( items ) {
            try {
    
                //нет массива для обработки
                if ((!items) || (!items.length))
                    return []
    
                let arUsersId = items.map((item, i) => {
                    return item.from_id
                })
    
                //удаление одинаковых id из массива
                arUsersId = Array.from(new Set(arUsersId))
    
                let sql = `SELECT id,login,first_name,create_date,birthday,photo FROM ${DB.Init.TablePrefix}user WHERE id in (${arUsersId})`
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
                throw ({code: 8001000, msg: 'CVideo GetUsers'})
            }
        }
    */

    /*
        //поиск по обсуждениям
        static async Search ( fields ) {
            try {
                let there = [` ((type='video/mp4') OR (type='video/avi')) `]
    
                if (fields.q)
                    there.push(` to_tsvector(title) @@ websearch_to_tsquery('${fields.q.toLowerCase()}') `) //в нижний регистр
    
                //запрос
                //let sql = `SELECT * FROM ${DB.Init.TablePrefix}video `
                let sql = `SELECT * FROM ${DB.Init.TablePrefix}file `
    
                //объединеие параметров запроса
                if (there.length)
                    sql += `WHERE ` + there.join(' AND ')
    
                sql += ` LIMIT $1 OFFSET $2`
    
                let result = await DB.Init.Query(sql, [fields.count, fields.offset])
                console.log(sql)
    
                result = await Promise.all(result.map(async (item, i) => {
    
                    if (item.from_id)
                        item.from_id = Number (item.from_id);
    
                    if (item.owner_id)
                        item.owner_id = Number (item.owner_id);
    
                    if (item.create_id)
                        item.create_id = Number (item.create_id);
    
                    if (item.file_id) {
                        item.file_id = await CFile.GetById([item.file_id]);
                        item.file_id = item.file_id[0]
                    }
    
                    return item;
                }));
    
                return result
    
            } catch (err) {
                console.log(err)
                throw ({code: 7001000, msg: 'CVideo Search'})
            }
        }
    */

    /*
    //количество / поиск
    static async SearchCount ( fields ) {
        try {
            let there = [` ((type='video/mp4') OR (type='video/avi')) `]
              if (fields.q)
                there.push(` to_tsvector(title) @@ websearch_to_tsquery('${fields.q.toLowerCase()}') `) //в нижний регистр
              //запрос
            //let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}video `
            let sql = `SELECT COUNT(*) FROM ${DB.Init.TablePrefix}file `
              //объединеие параметров запроса
            if (there.length)
                sql += `WHERE ` + there.join(' AND ')
              console.log(sql)
            let result = await DB.Init.Query(sql)
              return Number (result[0].count)
          } catch (err) {
            console.log(err)
            throw ({code: 7001000, msg: 'CVideo SearchCount'})
        }
    }*/

  }]);

  return CVideo;
}();

exports.CVideo = CVideo;