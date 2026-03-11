(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
    typeof document === "object" ? document.currentScript : undefined,
    {"otherChunks":["static/chunks/src_main_tsx_f26271e6._.js","static/chunks/node_modules_next_dist_compiled_8ca6b690._.js","static/chunks/node_modules_next_dist_shared_lib_40125ada._.js","static/chunks/node_modules_next_dist_client_5a8a528e._.js","static/chunks/node_modules_next_dist_75b597d7._.js","static/chunks/node_modules_next_5ba47e86._.js","static/chunks/node_modules_react-dom_4411d9bd._.js","static/chunks/node_modules_moment_b5d659a7._.js","static/chunks/node_modules_9dbdf982._.js","static/chunks/[root-of-the-server]__24bd8782._.js",{"path":"static/chunks/_e81299af._.css","included":["[project]/src/main.css [client] (css)","[project]/node_modules/json-diff-kit/dist/viewer.css [client] (css)"],"moduleChunks":["static/chunks/src_main_css_65f1660e._.single.css","static/chunks/node_modules_json-diff-kit_dist_viewer_css_65f1660e._.single.css"]}],"runtimeModuleIds":["[project]/node_modules/next/dist/compiled/@next/react-refresh-utils/dist/runtime.js [client] (ecmascript)","[project]/node_modules/next/dist/client/next-dev-turbopack.js [client] (ecmascript)","[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/_app\" }"]}
]);
(() => {
if (!Array.isArray(globalThis.TURBOPACK)) {
    return;
}

const CHUNK_BASE_PATH = "/_next/";
const RELATIVE_ROOT_PATH = "/ROOT";
const RUNTIME_PUBLIC_PATH = "/_next/";
const CHUNK_SUFFIX = (self.TURBOPACK_CHUNK_SUFFIX ?? document?.currentScript?.getAttribute?.('src')?.replace(/^(.*(?=\?)|^.*$)/, "")) || "";
/**
 * This file contains runtime types and functions that are shared between all
 * TurboPack ECMAScript runtimes.
 *
 * It will be prepended to the runtime code of each runtime.
 */ /* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="./runtime-types.d.ts" />
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
    return d(g, "next", {
        value: verb(0)
    }), d(g, "throw", {
        value: verb(1)
    }), d(g, "return", {
        value: verb(2)
    }), typeof Symbol === "function" && d(g, Symbol.iterator, {
        value: function() {
            return this;
        }
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var REEXPORTED_OBJECTS = new WeakMap();
/**
 * Constructs the `__turbopack_context__` object for a module.
 */ function Context(module, exports) {
    this.m = module;
    // We need to store this here instead of accessing it from the module object to:
    // 1. Make it available to factories directly, since we rewrite `this` to
    //    `__turbopack_context__.e` in CJS modules.
    // 2. Support async modules which rewrite `module.exports` to a promise, so we
    //    can still access the original exports object from functions like
    //    `esmExport`
    // Ideally we could find a new approach for async modules and drop this property altogether.
    this.e = exports;
}
var contextPrototype = Context.prototype;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag;
function defineProp(obj, name, options) {
    if (!hasOwnProperty.call(obj, name)) Object.defineProperty(obj, name, options);
}
function getOverwrittenModule(moduleCache, id) {
    var module = moduleCache[id];
    if (!module) {
        // This is invoked when a module is merged into another module, thus it wasn't invoked via
        // instantiateModule and the cache entry wasn't created yet.
        module = createModuleObject(id);
        moduleCache[id] = module;
    }
    return module;
}
/**
 * Creates the module object. Only done here to ensure all module objects have the same shape.
 */ function createModuleObject(id) {
    return {
        exports: {},
        error: undefined,
        id: id,
        namespaceObject: undefined
    };
}
var BindingTag_Value = 0;
/**
 * Adds the getters to the exports object.
 */ function esm(exports, bindings) {
    defineProp(exports, '__esModule', {
        value: true
    });
    if (toStringTag) defineProp(exports, toStringTag, {
        value: 'Module'
    });
    var i = 0;
    while(i < bindings.length){
        var propName = bindings[i++];
        var tagOrFunction = bindings[i++];
        if (typeof tagOrFunction === 'number') {
            if (tagOrFunction === BindingTag_Value) {
                defineProp(exports, propName, {
                    value: bindings[i++],
                    enumerable: true,
                    writable: false
                });
            } else {
                throw new Error("unexpected tag: ".concat(tagOrFunction));
            }
        } else {
            var getterFn = tagOrFunction;
            if (typeof bindings[i] === 'function') {
                var setterFn = bindings[i++];
                defineProp(exports, propName, {
                    get: getterFn,
                    set: setterFn,
                    enumerable: true
                });
            } else {
                defineProp(exports, propName, {
                    get: getterFn,
                    enumerable: true
                });
            }
        }
    }
    Object.seal(exports);
}
/**
 * Makes the module an ESM with exports
 */ function esmExport(bindings, id) {
    var module;
    var exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    module.namespaceObject = exports;
    esm(exports, bindings);
}
contextPrototype.s = esmExport;
function ensureDynamicExports(module, exports) {
    var reexportedObjects = REEXPORTED_OBJECTS.get(module);
    if (!reexportedObjects) {
        REEXPORTED_OBJECTS.set(module, reexportedObjects = []);
        module.exports = module.namespaceObject = new Proxy(exports, {
            get: function get(target, prop) {
                if (hasOwnProperty.call(target, prop) || prop === 'default' || prop === '__esModule') {
                    return Reflect.get(target, prop);
                }
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = reexportedObjects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var obj = _step.value;
                        var value = Reflect.get(obj, prop);
                        if (value !== undefined) return value;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return undefined;
            },
            ownKeys: function ownKeys(target) {
                var keys = Reflect.ownKeys(target);
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = reexportedObjects[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var obj = _step.value;
                        var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                        try {
                            for(var _iterator1 = Reflect.ownKeys(obj)[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                var key = _step1.value;
                                if (key !== 'default' && !keys.includes(key)) keys.push(key);
                            }
                        } catch (err) {
                            _didIteratorError1 = true;
                            _iteratorError1 = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                    _iterator1.return();
                                }
                            } finally{
                                if (_didIteratorError1) {
                                    throw _iteratorError1;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                return keys;
            }
        });
    }
    return reexportedObjects;
}
/**
 * Dynamically exports properties from an object
 */ function dynamicExport(object, id) {
    var module;
    var exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    var reexportedObjects = ensureDynamicExports(module, exports);
    if ((typeof object === "undefined" ? "undefined" : _type_of(object)) === 'object' && object !== null) {
        reexportedObjects.push(object);
    }
}
contextPrototype.j = dynamicExport;
function exportValue(value, id) {
    var module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = value;
}
contextPrototype.v = exportValue;
function exportNamespace(namespace, id) {
    var module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = module.namespaceObject = namespace;
}
contextPrototype.n = exportNamespace;
function createGetter(obj, key) {
    return function() {
        return obj[key];
    };
}
/**
 * @returns prototype of the object
 */ var getProto = Object.getPrototypeOf ? function(obj) {
    return Object.getPrototypeOf(obj);
} : function(obj) {
    return obj.__proto__;
};
/** Prototypes that are not expanded for exports */ var LEAF_PROTOTYPES = [
    null,
    getProto({}),
    getProto([]),
    getProto(getProto)
];
/**
 * @param raw
 * @param ns
 * @param allowExportDefault
 *   * `false`: will have the raw module as default export
 *   * `true`: will have the default property as default export
 */ function interopEsm(raw, ns, allowExportDefault) {
    var bindings = [];
    var defaultLocation = -1;
    for(var current = raw; ((typeof current === "undefined" ? "undefined" : _type_of(current)) === 'object' || typeof current === 'function') && !LEAF_PROTOTYPES.includes(current); current = getProto(current)){
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = Object.getOwnPropertyNames(current)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var key = _step.value;
                bindings.push(key, createGetter(raw, key));
                if (defaultLocation === -1 && key === 'default') {
                    defaultLocation = bindings.length - 1;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    // this is not really correct
    // we should set the `default` getter if the imported module is a `.cjs file`
    if (!(allowExportDefault && defaultLocation >= 0)) {
        // Replace the binding with one for the namespace itself in order to preserve iteration order.
        if (defaultLocation >= 0) {
            // Replace the getter with the value
            bindings.splice(defaultLocation, 1, BindingTag_Value, raw);
        } else {
            bindings.push('default', BindingTag_Value, raw);
        }
    }
    esm(ns, bindings);
    return ns;
}
function createNS(raw) {
    if (typeof raw === 'function') {
        return function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            return raw.apply(this, args);
        };
    } else {
        return Object.create(null);
    }
}
function esmImport(id) {
    var module = getOrInstantiateModuleFromParent(id, this.m);
    // any ES module has to have `module.namespaceObject` defined.
    if (module.namespaceObject) return module.namespaceObject;
    // only ESM can be an async module, so we don't need to worry about exports being a promise here.
    var raw = module.exports;
    return module.namespaceObject = interopEsm(raw, createNS(raw), raw && raw.__esModule);
}
contextPrototype.i = esmImport;
function asyncLoader(moduleId) {
    var loader = this.r(moduleId);
    return loader(esmImport.bind(this));
}
contextPrototype.A = asyncLoader;
// Add a simple runtime require so that environments without one can still pass
// `typeof require` CommonJS checks so that exports are correctly registered.
var runtimeRequire = // @ts-ignore
typeof require === 'function' ? require : function require1() {
    throw new Error('Unexpected use of runtime require');
};
contextPrototype.t = runtimeRequire;
function commonJsRequire(id) {
    return getOrInstantiateModuleFromParent(id, this.m).exports;
}
contextPrototype.r = commonJsRequire;
/**
 * Remove fragments and query parameters since they are never part of the context map keys
 *
 * This matches how we parse patterns at resolving time.  Arguably we should only do this for
 * strings passed to `import` but the resolve does it for `import` and `require` and so we do
 * here as well.
 */ function parseRequest(request) {
    // Per the URI spec fragments can contain `?` characters, so we should trim it off first
    // https://datatracker.ietf.org/doc/html/rfc3986#section-3.5
    var hashIndex = request.indexOf('#');
    if (hashIndex !== -1) {
        request = request.substring(0, hashIndex);
    }
    var queryIndex = request.indexOf('?');
    if (queryIndex !== -1) {
        request = request.substring(0, queryIndex);
    }
    return request;
}
/**
 * `require.context` and require/import expression runtime.
 */ function moduleContext(map) {
    function moduleContext(id) {
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].module();
        }
        var e = new Error("Cannot find module '".concat(id, "'"));
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    }
    moduleContext.keys = function() {
        return Object.keys(map);
    };
    moduleContext.resolve = function(id) {
        id = parseRequest(id);
        if (hasOwnProperty.call(map, id)) {
            return map[id].id();
        }
        var e = new Error("Cannot find module '".concat(id, "'"));
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    };
    moduleContext.import = function(id) {
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            moduleContext(id)
                        ];
                    case 1:
                        return [
                            2,
                            _state.sent()
                        ];
                }
            });
        })();
    };
    return moduleContext;
}
contextPrototype.f = moduleContext;
/**
 * Returns the path of a chunk defined by its data.
 */ function getChunkPath(chunkData) {
    return typeof chunkData === 'string' ? chunkData : chunkData.path;
}
function isPromise(maybePromise) {
    return maybePromise != null && (typeof maybePromise === "undefined" ? "undefined" : _type_of(maybePromise)) === 'object' && 'then' in maybePromise && typeof maybePromise.then === 'function';
}
function isAsyncModuleExt(obj) {
    return turbopackQueues in obj;
}
function createPromise() {
    var resolve;
    var reject;
    var promise = new Promise(function(res, rej) {
        reject = rej;
        resolve = res;
    });
    return {
        promise: promise,
        resolve: resolve,
        reject: reject
    };
}
// Load the CompressedmoduleFactories of a chunk into the `moduleFactories` Map.
// The CompressedModuleFactories format is
// - 1 or more module ids
// - a module factory function
// So walking this is a little complex but the flat structure is also fast to
// traverse, we can use `typeof` operators to distinguish the two cases.
function installCompressedModuleFactories(chunkModules, offset, moduleFactories, newModuleId) {
    var i = offset;
    while(i < chunkModules.length){
        var moduleId = chunkModules[i];
        var end = i + 1;
        // Find our factory function
        while(end < chunkModules.length && typeof chunkModules[end] !== 'function'){
            end++;
        }
        if (end === chunkModules.length) {
            throw new Error('malformed chunk format, expected a factory function');
        }
        // Each chunk item has a 'primary id' and optional additional ids. If the primary id is already
        // present we know all the additional ids are also present, so we don't need to check.
        if (!moduleFactories.has(moduleId)) {
            var moduleFactoryFn = chunkModules[end];
            applyModuleFactoryName(moduleFactoryFn);
            newModuleId === null || newModuleId === void 0 ? void 0 : newModuleId(moduleId);
            for(; i < end; i++){
                moduleId = chunkModules[i];
                moduleFactories.set(moduleId, moduleFactoryFn);
            }
        }
        i = end + 1; // end is pointing at the last factory advance to the next id or the end of the array.
    }
}
// everything below is adapted from webpack
// https://github.com/webpack/webpack/blob/6be4065ade1e252c1d8dcba4af0f43e32af1bdc1/lib/runtime/AsyncModuleRuntimeModule.js#L13
var turbopackQueues = Symbol('turbopack queues');
var turbopackExports = Symbol('turbopack exports');
var turbopackError = Symbol('turbopack error');
function resolveQueue(queue) {
    if (queue && queue.status !== 1) {
        queue.status = 1;
        queue.forEach(function(fn) {
            return fn.queueCount--;
        });
        queue.forEach(function(fn) {
            return fn.queueCount-- ? fn.queueCount++ : fn();
        });
    }
}
function wrapDeps(deps) {
    return deps.map(function(dep) {
        if (dep !== null && (typeof dep === "undefined" ? "undefined" : _type_of(dep)) === 'object') {
            if (isAsyncModuleExt(dep)) return dep;
            if (isPromise(dep)) {
                var queue = Object.assign([], {
                    status: 0
                });
                var _obj;
                var obj = (_obj = {}, _define_property(_obj, turbopackExports, {}), _define_property(_obj, turbopackQueues, function(fn) {
                    return fn(queue);
                }), _obj);
                dep.then(function(res) {
                    obj[turbopackExports] = res;
                    resolveQueue(queue);
                }, function(err) {
                    obj[turbopackError] = err;
                    resolveQueue(queue);
                });
                return obj;
            }
        }
        var _obj1;
        return _obj1 = {}, _define_property(_obj1, turbopackExports, dep), _define_property(_obj1, turbopackQueues, function() {}), _obj1;
    });
}
function asyncModule(body, hasAwait) {
    var module = this.m;
    var queue = hasAwait ? Object.assign([], {
        status: -1
    }) : undefined;
    var depQueues = new Set();
    var _createPromise = createPromise(), resolve = _createPromise.resolve, reject = _createPromise.reject, rawPromise = _createPromise.promise;
    var _obj;
    var promise = Object.assign(rawPromise, (_obj = {}, _define_property(_obj, turbopackExports, module.exports), _define_property(_obj, turbopackQueues, function(fn) {
        queue && fn(queue);
        depQueues.forEach(fn);
        promise['catch'](function() {});
    }), _obj));
    var attributes = {
        get: function get() {
            return promise;
        },
        set: function set(v) {
            // Calling `esmExport` leads to this.
            if (v !== promise) {
                promise[turbopackExports] = v;
            }
        }
    };
    Object.defineProperty(module, 'exports', attributes);
    Object.defineProperty(module, 'namespaceObject', attributes);
    function handleAsyncDependencies(deps) {
        var currentDeps = wrapDeps(deps);
        var getResult = function() {
            return currentDeps.map(function(d) {
                if (d[turbopackError]) throw d[turbopackError];
                return d[turbopackExports];
            });
        };
        var _createPromise = createPromise(), promise = _createPromise.promise, resolve = _createPromise.resolve;
        var fn = Object.assign(function() {
            return resolve(getResult);
        }, {
            queueCount: 0
        });
        function fnQueue(q) {
            if (q !== queue && !depQueues.has(q)) {
                depQueues.add(q);
                if (q && q.status === 0) {
                    fn.queueCount++;
                    q.push(fn);
                }
            }
        }
        currentDeps.map(function(dep) {
            return dep[turbopackQueues](fnQueue);
        });
        return fn.queueCount ? promise : getResult();
    }
    function asyncResult(err) {
        if (err) {
            reject(promise[turbopackError] = err);
        } else {
            resolve(promise[turbopackExports]);
        }
        resolveQueue(queue);
    }
    body(handleAsyncDependencies, asyncResult);
    if (queue && queue.status === -1) {
        queue.status = 0;
    }
}
contextPrototype.a = asyncModule;
/**
 * A pseudo "fake" URL object to resolve to its relative path.
 *
 * When UrlRewriteBehavior is set to relative, calls to the `new URL()` will construct url without base using this
 * runtime function to generate context-agnostic urls between different rendering context, i.e ssr / client to avoid
 * hydration mismatch.
 *
 * This is based on webpack's existing implementation:
 * https://github.com/webpack/webpack/blob/87660921808566ef3b8796f8df61bd79fc026108/lib/runtime/RelativeUrlRuntimeModule.js
 */ var relativeURL = function relativeURL(inputUrl) {
    var realUrl = new URL(inputUrl, 'x:/');
    var values = {};
    for(var key in realUrl)values[key] = realUrl[key];
    values.href = inputUrl;
    values.pathname = inputUrl.replace(/[?#].*/, '');
    values.origin = values.protocol = '';
    values.toString = values.toJSON = function() {
        for(var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++){
            _args[_key] = arguments[_key];
        }
        return inputUrl;
    };
    for(var key1 in values)Object.defineProperty(this, key1, {
        enumerable: true,
        configurable: true,
        value: values[key1]
    });
};
relativeURL.prototype = URL.prototype;
contextPrototype.U = relativeURL;
/**
 * Utility function to ensure all variants of an enum are handled.
 */ function invariant(never, computeMessage) {
    throw new Error("Invariant: ".concat(computeMessage(never)));
}
/**
 * A stub function to make `require` available but non-functional in ESM.
 */ function requireStub(_moduleId) {
    throw new Error('dynamic usage of require is not supported');
}
contextPrototype.z = requireStub;
// Make `globalThis` available to the module in a way that cannot be shadowed by a local variable.
contextPrototype.g = globalThis;
function applyModuleFactoryName(factory) {
    // Give the module factory a nice name to improve stack traces.
    Object.defineProperty(factory, 'name', {
        value: 'module evaluation'
    });
}
/**
 * This file contains runtime types and functions that are shared between all
 * Turbopack *development* ECMAScript runtimes.
 *
 * It will be appended to the runtime code of each runtime right after the
 * shared runtime utils.
 */ /* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../base/globals.d.ts" />
/// <reference path="../../../shared/runtime-utils.ts" />
// Used in WebWorkers to tell the runtime about the chunk base path
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
    return d(g, "next", {
        value: verb(0)
    }), d(g, "throw", {
        value: verb(1)
    }), d(g, "return", {
        value: verb(2)
    }), typeof Symbol === "function" && d(g, Symbol.iterator, {
        value: function() {
            return this;
        }
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var browserContextPrototype = Context.prototype;
var SourceType = /*#__PURE__*/ function(SourceType) {
    /**
   * The module was instantiated because it was included in an evaluated chunk's
   * runtime.
   * SourceData is a ChunkPath.
   */ SourceType[SourceType["Runtime"] = 0] = "Runtime";
    /**
   * The module was instantiated because a parent module imported it.
   * SourceData is a ModuleId.
   */ SourceType[SourceType["Parent"] = 1] = "Parent";
    /**
   * The module was instantiated because it was included in a chunk's hot module
   * update.
   * SourceData is an array of ModuleIds or undefined.
   */ SourceType[SourceType["Update"] = 2] = "Update";
    return SourceType;
}(SourceType || {});
var moduleFactories = new Map();
contextPrototype.M = moduleFactories;
var availableModules = new Map();
var availableModuleChunks = new Map();
function factoryNotAvailableMessage(moduleId, sourceType, sourceData) {
    var instantiationReason;
    switch(sourceType){
        case 0:
            instantiationReason = "as a runtime entry of chunk ".concat(sourceData);
            break;
        case 1:
            instantiationReason = "because it was required from module ".concat(sourceData);
            break;
        case 2:
            instantiationReason = 'because of an HMR update';
            break;
        default:
            invariant(sourceType, function(sourceType) {
                return "Unknown source type: ".concat(sourceType);
            });
    }
    return "Module ".concat(moduleId, " was instantiated ").concat(instantiationReason, ", but the module factory is not available.");
}
function loadChunk(chunkData) {
    return loadChunkInternal(1, this.m.id, chunkData);
}
browserContextPrototype.l = loadChunk;
function loadInitialChunk(chunkPath, chunkData) {
    return loadChunkInternal(0, chunkPath, chunkData);
}
function loadChunkInternal(sourceType, sourceData, chunkData) {
    return _async_to_generator(function() {
        var includedList, modulesPromises, includedModuleChunksList, moduleChunksPromises, promise, moduleChunksToLoad, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, moduleChunk, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, moduleChunkToLoad, promise1, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, includedModuleChunk, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, included;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (typeof chunkData === 'string') {
                        return [
                            2,
                            loadChunkPath(sourceType, sourceData, chunkData)
                        ];
                    }
                    includedList = chunkData.included || [];
                    modulesPromises = includedList.map(function(included) {
                        if (moduleFactories.has(included)) return true;
                        return availableModules.get(included);
                    });
                    if (!(modulesPromises.length > 0 && modulesPromises.every(function(p) {
                        return p;
                    }))) return [
                        3,
                        2
                    ];
                    // When all included items are already loaded or loading, we can skip loading ourselves
                    return [
                        4,
                        Promise.all(modulesPromises)
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
                case 2:
                    includedModuleChunksList = chunkData.moduleChunks || [];
                    moduleChunksPromises = includedModuleChunksList.map(function(included) {
                        // TODO(alexkirsz) Do we need this check?
                        // if (moduleFactories[included]) return true;
                        return availableModuleChunks.get(included);
                    }).filter(function(p) {
                        return p;
                    });
                    if (!(moduleChunksPromises.length > 0)) return [
                        3,
                        5
                    ];
                    if (!(moduleChunksPromises.length === includedModuleChunksList.length)) return [
                        3,
                        4
                    ];
                    // When all included module chunks are already loaded or loading, we can skip loading ourselves
                    return [
                        4,
                        Promise.all(moduleChunksPromises)
                    ];
                case 3:
                    _state.sent();
                    return [
                        2
                    ];
                case 4:
                    moduleChunksToLoad = new Set();
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(_iterator = includedModuleChunksList[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            moduleChunk = _step.value;
                            if (!availableModuleChunks.has(moduleChunk)) {
                                moduleChunksToLoad.add(moduleChunk);
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                    try {
                        for(_iterator1 = moduleChunksToLoad[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                            moduleChunkToLoad = _step1.value;
                            promise1 = loadChunkPath(sourceType, sourceData, moduleChunkToLoad);
                            availableModuleChunks.set(moduleChunkToLoad, promise1);
                            moduleChunksPromises.push(promise1);
                        }
                    } catch (err) {
                        _didIteratorError1 = true;
                        _iteratorError1 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                _iterator1.return();
                            }
                        } finally{
                            if (_didIteratorError1) {
                                throw _iteratorError1;
                            }
                        }
                    }
                    promise = Promise.all(moduleChunksPromises);
                    return [
                        3,
                        6
                    ];
                case 5:
                    promise = loadChunkPath(sourceType, sourceData, chunkData.path);
                    _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
                    try {
                        // Mark all included module chunks as loading if they are not already loaded or loading.
                        for(_iterator2 = includedModuleChunksList[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                            includedModuleChunk = _step2.value;
                            if (!availableModuleChunks.has(includedModuleChunk)) {
                                availableModuleChunks.set(includedModuleChunk, promise);
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                                _iterator2.return();
                            }
                        } finally{
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                    _state.label = 6;
                case 6:
                    _iteratorNormalCompletion3 = true, _didIteratorError3 = false, _iteratorError3 = undefined;
                    try {
                        for(_iterator3 = includedList[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true){
                            included = _step3.value;
                            if (!availableModules.has(included)) {
                                // It might be better to race old and new promises, but it's rare that the new promise will be faster than a request started earlier.
                                // In production it's even more rare, because the chunk optimization tries to deduplicate modules anyway.
                                availableModules.set(included, promise);
                            }
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                                _iterator3.return();
                            }
                        } finally{
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }
                    return [
                        4,
                        promise
                    ];
                case 7:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
}
var loadedChunk = Promise.resolve(undefined);
var instrumentedBackendLoadChunks = new WeakMap();
// Do not make this async. React relies on referential equality of the returned Promise.
function loadChunkByUrl(chunkUrl) {
    return loadChunkByUrlInternal(1, this.m.id, chunkUrl);
}
browserContextPrototype.L = loadChunkByUrl;
// Do not make this async. React relies on referential equality of the returned Promise.
function loadChunkByUrlInternal(sourceType, sourceData, chunkUrl) {
    var thenable = BACKEND.loadChunkCached(sourceType, chunkUrl);
    var entry = instrumentedBackendLoadChunks.get(thenable);
    if (entry === undefined) {
        var resolve = instrumentedBackendLoadChunks.set.bind(instrumentedBackendLoadChunks, thenable, loadedChunk);
        entry = thenable.then(resolve).catch(function(cause) {
            var loadReason;
            switch(sourceType){
                case 0:
                    loadReason = "as a runtime dependency of chunk ".concat(sourceData);
                    break;
                case 1:
                    loadReason = "from module ".concat(sourceData);
                    break;
                case 2:
                    loadReason = 'from an HMR update';
                    break;
                default:
                    invariant(sourceType, function(sourceType) {
                        return "Unknown source type: ".concat(sourceType);
                    });
            }
            var error = new Error("Failed to load chunk ".concat(chunkUrl, " ").concat(loadReason).concat(cause ? ": ".concat(cause) : ''), cause ? {
                cause: cause
            } : undefined);
            error.name = 'ChunkLoadError';
            throw error;
        });
        instrumentedBackendLoadChunks.set(thenable, entry);
    }
    return entry;
}
// Do not make this async. React relies on referential equality of the returned Promise.
function loadChunkPath(sourceType, sourceData, chunkPath) {
    var url = getChunkRelativeUrl(chunkPath);
    return loadChunkByUrlInternal(sourceType, sourceData, url);
}
/**
 * Returns an absolute url to an asset.
 */ function resolvePathFromModule(moduleId) {
    var _ref;
    var exported = this.r(moduleId);
    return (_ref = exported === null || exported === void 0 ? void 0 : exported.default) !== null && _ref !== void 0 ? _ref : exported;
}
browserContextPrototype.R = resolvePathFromModule;
/**
 * no-op for browser
 * @param modulePath
 */ function resolveAbsolutePath(modulePath) {
    return "/ROOT/".concat(modulePath !== null && modulePath !== void 0 ? modulePath : '');
}
browserContextPrototype.P = resolveAbsolutePath;
/**
 * Returns a blob URL for the worker.
 * @param chunks list of chunks to load
 */ function getWorkerBlobURL(chunks) {
    // It is important to reverse the array so when bootstrapping we can infer what chunk is being
    // evaluated by poping urls off of this array.  See `getPathFromScript`
    var bootstrap = "self.TURBOPACK_WORKER_LOCATION = ".concat(JSON.stringify(location.origin), ";\nself.TURBOPACK_CHUNK_SUFFIX = ").concat(JSON.stringify(CHUNK_SUFFIX), ";\nself.TURBOPACK_NEXT_CHUNK_URLS = ").concat(JSON.stringify(chunks.reverse().map(getChunkRelativeUrl), null, 2), ";\nimportScripts(...self.TURBOPACK_NEXT_CHUNK_URLS.map(c => self.TURBOPACK_WORKER_LOCATION + c).reverse());");
    var blob = new Blob([
        bootstrap
    ], {
        type: 'text/javascript'
    });
    return URL.createObjectURL(blob);
}
browserContextPrototype.b = getWorkerBlobURL;
/**
 * Instantiates a runtime module.
 */ function instantiateRuntimeModule(moduleId, chunkPath) {
    return instantiateModule(moduleId, 0, chunkPath);
}
/**
 * Returns the URL relative to the origin where a chunk can be fetched from.
 */ function getChunkRelativeUrl(chunkPath) {
    return "".concat(CHUNK_BASE_PATH).concat(chunkPath.split('/').map(function(p) {
        return encodeURIComponent(p);
    }).join('/')).concat(CHUNK_SUFFIX);
}
function getPathFromScript(chunkScript) {
    if (typeof chunkScript === 'string') {
        return chunkScript;
    }
    var chunkUrl = typeof TURBOPACK_NEXT_CHUNK_URLS !== 'undefined' ? TURBOPACK_NEXT_CHUNK_URLS.pop() : chunkScript.getAttribute('src');
    var src = decodeURIComponent(chunkUrl.replace(/[?#].*$/, ''));
    var path = src.startsWith(CHUNK_BASE_PATH) ? src.slice(CHUNK_BASE_PATH.length) : src;
    return path;
}
var regexJsUrl = /\.js(?:\?[^#]*)?(?:#.*)?$/;
/**
 * Checks if a given path/URL ends with .js, optionally followed by ?query or #fragment.
 */ function isJs(chunkUrlOrPath) {
    return regexJsUrl.test(chunkUrlOrPath);
}
var regexCssUrl = /\.css(?:\?[^#]*)?(?:#.*)?$/;
/**
 * Checks if a given path/URL ends with .css, optionally followed by ?query or #fragment.
 */ function isCss(chunkUrl) {
    return regexCssUrl.test(chunkUrl);
}
function loadWebAssembly(chunkPath, edgeModule, importsObj) {
    return BACKEND.loadWebAssembly(1, this.m.id, chunkPath, edgeModule, importsObj);
}
contextPrototype.w = loadWebAssembly;
function loadWebAssemblyModule(chunkPath, edgeModule) {
    return BACKEND.loadWebAssemblyModule(1, this.m.id, chunkPath, edgeModule);
}
contextPrototype.u = loadWebAssemblyModule;
/// <reference path="./dev-globals.d.ts" />
/// <reference path="./dev-protocol.d.ts" />
/// <reference path="./dev-extensions.ts" />
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _construct(Parent, args, Class) {
    if (_is_native_reflect_construct()) {
        _construct = Reflect.construct;
    } else {
        _construct = function construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _set_prototype_of(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
}
function _is_native_function(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function _wrap_native_super(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrap_native_super = function wrapNativeSuper(Class) {
        if (Class === null || !_is_native_function(Class)) return Class;
        if (typeof Class !== "function") {
            throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return _construct(Class, arguments, _get_prototype_of(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return _set_prototype_of(Wrapper, Class);
    };
    return _wrap_native_super(Class);
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
}
var _globalThis, _TURBOPACK_CHUNK_UPDATE_LISTENERS;
var devContextPrototype = Context.prototype;
/**
 * This file contains runtime types and functions that are shared between all
 * Turbopack *development* ECMAScript runtimes.
 *
 * It will be appended to the runtime code of each runtime right after the
 * shared runtime utils.
 */ /* eslint-disable @typescript-eslint/no-unused-vars */ var devModuleCache = Object.create(null);
devContextPrototype.c = devModuleCache;
var UpdateApplyError = /*#__PURE__*/ function(Error1) {
    "use strict";
    _inherits(UpdateApplyError, Error1);
    function UpdateApplyError(message, dependencyChain) {
        _class_call_check(this, UpdateApplyError);
        var _this;
        _this = _call_super(this, UpdateApplyError, [
            message
        ]), _define_property(_this, "name", 'UpdateApplyError'), _define_property(_this, "dependencyChain", void 0);
        _this.dependencyChain = dependencyChain;
        return _this;
    }
    return UpdateApplyError;
}(_wrap_native_super(Error));
/**
 * Module IDs that are instantiated as part of the runtime of a chunk.
 */ var runtimeModules = new Set();
/**
 * Map from module ID to the chunks that contain this module.
 *
 * In HMR, we need to keep track of which modules are contained in which so
 * chunks. This is so we don't eagerly dispose of a module when it is removed
 * from chunk A, but still exists in chunk B.
 */ var moduleChunksMap = new Map();
/**
 * Map from a chunk path to all modules it contains.
 */ var chunkModulesMap = new Map();
/**
 * Chunk lists that contain a runtime. When these chunk lists receive an update
 * that can't be reconciled with the current state of the page, we need to
 * reload the runtime entirely.
 */ var runtimeChunkLists = new Set();
/**
 * Map from a chunk list to the chunk paths it contains.
 */ var chunkListChunksMap = new Map();
/**
 * Map from a chunk path to the chunk lists it belongs to.
 */ var chunkChunkListsMap = new Map();
/**
 * Maps module IDs to persisted data between executions of their hot module
 * implementation (`hot.data`).
 */ var moduleHotData = new Map();
/**
 * Maps module instances to their hot module state.
 */ var moduleHotState = new Map();
/**
 * Modules that call `module.hot.invalidate()` (while being updated).
 */ var queuedInvalidatedModules = new Set();
/**
 * Gets or instantiates a runtime module.
 */ // @ts-ignore
function getOrInstantiateRuntimeModule(chunkPath, moduleId) {
    var module = devModuleCache[moduleId];
    if (module) {
        if (module.error) {
            throw module.error;
        }
        return module;
    }
    // @ts-ignore
    return instantiateModule(moduleId, SourceType.Runtime, chunkPath);
}
/**
 * Retrieves a module from the cache, or instantiate it if it is not cached.
 */ // @ts-ignore Defined in `runtime-utils.ts`
var getOrInstantiateModuleFromParent = function(id, sourceModule) {
    if (!sourceModule.hot.active) {
        console.warn("Unexpected import of module ".concat(id, " from module ").concat(sourceModule.id, ", which was deleted by an HMR update"));
    }
    var module = devModuleCache[id];
    if (sourceModule.children.indexOf(id) === -1) {
        sourceModule.children.push(id);
    }
    if (module) {
        if (module.error) {
            throw module.error;
        }
        if (module.parents.indexOf(sourceModule.id) === -1) {
            module.parents.push(sourceModule.id);
        }
        return module;
    }
    return instantiateModule(id, SourceType.Parent, sourceModule.id);
};
function DevContext(module, exports, refresh) {
    Context.call(this, module, exports);
    this.k = refresh;
}
DevContext.prototype = Context.prototype;
function instantiateModule(moduleId, sourceType, sourceData) {
    // We are in development, this is always a string.
    var id = moduleId;
    var moduleFactory = moduleFactories.get(id);
    if (typeof moduleFactory !== 'function') {
        // This can happen if modules incorrectly handle HMR disposes/updates,
        // e.g. when they keep a `setTimeout` around which still executes old code
        // and contains e.g. a `require("something")` call.
        throw new Error(factoryNotAvailableMessage(id, sourceType, sourceData) + ' It might have been deleted in an HMR update.');
    }
    var hotData = moduleHotData.get(id);
    var _createModuleHot = createModuleHot(id, hotData), hot = _createModuleHot.hot, hotState = _createModuleHot.hotState;
    var parents;
    switch(sourceType){
        case SourceType.Runtime:
            runtimeModules.add(id);
            parents = [];
            break;
        case SourceType.Parent:
            // No need to add this module as a child of the parent module here, this
            // has already been taken care of in `getOrInstantiateModuleFromParent`.
            parents = [
                sourceData
            ];
            break;
        case SourceType.Update:
            parents = sourceData || [];
            break;
        default:
            invariant(sourceType, function(sourceType) {
                return "Unknown source type: ".concat(sourceType);
            });
    }
    var module = createModuleObject(id);
    var exports = module.exports;
    module.parents = parents;
    module.children = [];
    module.hot = hot;
    devModuleCache[id] = module;
    moduleHotState.set(module, hotState);
    // NOTE(alexkirsz) This can fail when the module encounters a runtime error.
    try {
        runModuleExecutionHooks(module, function(refresh) {
            var context = new DevContext(module, exports, refresh);
            moduleFactory(context, module, exports);
        });
    } catch (error) {
        module.error = error;
        throw error;
    }
    if (module.namespaceObject && module.exports !== module.namespaceObject) {
        // in case of a circular dependency: cjs1 -> esm2 -> cjs1
        interopEsm(module.exports, module.namespaceObject);
    }
    return module;
}
var DUMMY_REFRESH_CONTEXT = {
    register: function(_type, _id) {},
    signature: function() {
        return function(_type) {};
    },
    registerExports: function(_module, _helpers) {}
};
/**
 * NOTE(alexkirsz) Webpack has a "module execution" interception hook that
 * Next.js' React Refresh runtime hooks into to add module context to the
 * refresh registry.
 */ function runModuleExecutionHooks(module, executeModule) {
    if (typeof globalThis.$RefreshInterceptModuleExecution$ === 'function') {
        var cleanupReactRefreshIntercept = globalThis.$RefreshInterceptModuleExecution$(module.id);
        try {
            executeModule({
                register: globalThis.$RefreshReg$,
                signature: globalThis.$RefreshSig$,
                registerExports: registerExportsAndSetupBoundaryForReactRefresh
            });
        } finally{
            // Always cleanup the intercept, even if module execution failed.
            cleanupReactRefreshIntercept();
        }
    } else {
        // If the react refresh hooks are not installed we need to bind dummy functions.
        // This is expected when running in a Web Worker.  It is also common in some of
        // our test environments.
        executeModule(DUMMY_REFRESH_CONTEXT);
    }
}
/**
 * This is adapted from https://github.com/vercel/next.js/blob/3466862d9dc9c8bb3131712134d38757b918d1c0/packages/react-refresh-utils/internal/ReactRefreshModule.runtime.ts
 */ function registerExportsAndSetupBoundaryForReactRefresh(module, helpers) {
    var _module_hot_data_prevExports;
    var currentExports = module.exports;
    var prevExports = (_module_hot_data_prevExports = module.hot.data.prevExports) !== null && _module_hot_data_prevExports !== void 0 ? _module_hot_data_prevExports : null;
    helpers.registerExportsForReactRefresh(currentExports, module.id);
    // A module can be accepted automatically based on its exports, e.g. when
    // it is a Refresh Boundary.
    if (helpers.isReactRefreshBoundary(currentExports)) {
        // Save the previous exports on update, so we can compare the boundary
        // signatures.
        module.hot.dispose(function(data) {
            data.prevExports = currentExports;
        });
        // Unconditionally accept an update to this module, we'll check if it's
        // still a Refresh Boundary later.
        module.hot.accept();
        // This field is set when the previous version of this module was a
        // Refresh Boundary, letting us know we need to check for invalidation or
        // enqueue an update.
        if (prevExports !== null) {
            // A boundary can become ineligible if its exports are incompatible
            // with the previous exports.
            //
            // For example, if you add/remove/change exports, we'll want to
            // re-execute the importing modules, and force those components to
            // re-render. Similarly, if you convert a class component to a
            // function, we want to invalidate the boundary.
            if (helpers.shouldInvalidateReactRefreshBoundary(helpers.getRefreshBoundarySignature(prevExports), helpers.getRefreshBoundarySignature(currentExports))) {
                module.hot.invalidate();
            } else {
                helpers.scheduleUpdate();
            }
        }
    } else {
        // Since we just executed the code for the module, it's possible that the
        // new exports made it ineligible for being a boundary.
        // We only care about the case when we were _previously_ a boundary,
        // because we already accepted this update (accidental side effect).
        var isNoLongerABoundary = prevExports !== null;
        if (isNoLongerABoundary) {
            module.hot.invalidate();
        }
    }
}
function formatDependencyChain(dependencyChain) {
    return "Dependency chain: ".concat(dependencyChain.join(' -> '));
}
function computeOutdatedModules(added, modified) {
    var newModuleFactories = new Map();
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = added[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _step_value = _sliced_to_array(_step.value, 2), moduleId = _step_value[0], entry = _step_value[1];
            if (entry != null) {
                newModuleFactories.set(moduleId, _eval(entry));
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    var outdatedModules = computedInvalidatedModules(modified.keys());
    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
    try {
        for(var _iterator1 = modified[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
            var _step_value1 = _sliced_to_array(_step1.value, 2), moduleId1 = _step_value1[0], entry1 = _step_value1[1];
            newModuleFactories.set(moduleId1, _eval(entry1));
        }
    } catch (err) {
        _didIteratorError1 = true;
        _iteratorError1 = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                _iterator1.return();
            }
        } finally{
            if (_didIteratorError1) {
                throw _iteratorError1;
            }
        }
    }
    return {
        outdatedModules: outdatedModules,
        newModuleFactories: newModuleFactories
    };
}
function computedInvalidatedModules(invalidated) {
    var outdatedModules = new Set();
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = invalidated[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var moduleId = _step.value;
            var effect = getAffectedModuleEffects(moduleId);
            switch(effect.type){
                case 'unaccepted':
                    throw new UpdateApplyError("cannot apply update: unaccepted module. ".concat(formatDependencyChain(effect.dependencyChain), "."), effect.dependencyChain);
                case 'self-declined':
                    throw new UpdateApplyError("cannot apply update: self-declined module. ".concat(formatDependencyChain(effect.dependencyChain), "."), effect.dependencyChain);
                case 'accepted':
                    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                    try {
                        for(var _iterator1 = effect.outdatedModules[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                            var outdatedModuleId = _step1.value;
                            outdatedModules.add(outdatedModuleId);
                        }
                    } catch (err) {
                        _didIteratorError1 = true;
                        _iteratorError1 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                _iterator1.return();
                            }
                        } finally{
                            if (_didIteratorError1) {
                                throw _iteratorError1;
                            }
                        }
                    }
                    break;
                // TODO(alexkirsz) Dependencies: handle dependencies effects.
                default:
                    invariant(effect, function(effect) {
                        return "Unknown effect type: ".concat(effect === null || effect === void 0 ? void 0 : effect.type);
                    });
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return outdatedModules;
}
function computeOutdatedSelfAcceptedModules(outdatedModules) {
    var outdatedSelfAcceptedModules = [];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = outdatedModules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var moduleId = _step.value;
            var module = devModuleCache[moduleId];
            var hotState = moduleHotState.get(module);
            if (module && hotState.selfAccepted && !hotState.selfInvalidated) {
                outdatedSelfAcceptedModules.push({
                    moduleId: moduleId,
                    errorHandler: hotState.selfAccepted
                });
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return outdatedSelfAcceptedModules;
}
/**
 * Adds, deletes, and moves modules between chunks. This must happen before the
 * dispose phase as it needs to know which modules were removed from all chunks,
 * which we can only compute *after* taking care of added and moved modules.
 */ function updateChunksPhase(chunksAddedModules, chunksDeletedModules) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = chunksAddedModules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _step_value = _sliced_to_array(_step.value, 2), chunkPath = _step_value[0], addedModuleIds = _step_value[1];
            var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
            try {
                for(var _iterator1 = addedModuleIds[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                    var moduleId = _step1.value;
                    addModuleToChunk(moduleId, chunkPath);
                }
            } catch (err) {
                _didIteratorError1 = true;
                _iteratorError1 = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                        _iterator1.return();
                    }
                } finally{
                    if (_didIteratorError1) {
                        throw _iteratorError1;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    var disposedModules = new Set();
    var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
    try {
        for(var _iterator2 = chunksDeletedModules[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
            var _step_value1 = _sliced_to_array(_step2.value, 2), chunkPath1 = _step_value1[0], addedModuleIds1 = _step_value1[1];
            var _iteratorNormalCompletion3 = true, _didIteratorError3 = false, _iteratorError3 = undefined;
            try {
                for(var _iterator3 = addedModuleIds1[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true){
                    var moduleId1 = _step3.value;
                    if (removeModuleFromChunk(moduleId1, chunkPath1)) {
                        disposedModules.add(moduleId1);
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                        _iterator3.return();
                    }
                } finally{
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
            }
        } finally{
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
    return {
        disposedModules: disposedModules
    };
}
function disposePhase(outdatedModules, disposedModules) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = outdatedModules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var moduleId = _step.value;
            disposeModule(moduleId, 'replace');
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
    try {
        for(var _iterator1 = disposedModules[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
            var moduleId1 = _step1.value;
            disposeModule(moduleId1, 'clear');
        }
    } catch (err) {
        _didIteratorError1 = true;
        _iteratorError1 = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                _iterator1.return();
            }
        } finally{
            if (_didIteratorError1) {
                throw _iteratorError1;
            }
        }
    }
    // Removing modules from the module cache is a separate step.
    // We also want to keep track of previous parents of the outdated modules.
    var outdatedModuleParents = new Map();
    var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
    try {
        for(var _iterator2 = outdatedModules[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
            var moduleId2 = _step2.value;
            var oldModule = devModuleCache[moduleId2];
            outdatedModuleParents.set(moduleId2, oldModule === null || oldModule === void 0 ? void 0 : oldModule.parents);
            delete devModuleCache[moduleId2];
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
            }
        } finally{
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
    // TODO(alexkirsz) Dependencies: remove outdated dependency from module
    // children.
    return {
        outdatedModuleParents: outdatedModuleParents
    };
}
/**
 * Disposes of an instance of a module.
 *
 * Returns the persistent hot data that should be kept for the next module
 * instance.
 *
 * NOTE: mode = "replace" will not remove modules from the devModuleCache
 * This must be done in a separate step afterwards.
 * This is important because all modules need to be disposed to update the
 * parent/child relationships before they are actually removed from the devModuleCache.
 * If this was done in this method, the following disposeModule calls won't find
 * the module from the module id in the cache.
 */ function disposeModule(moduleId, mode) {
    var module = devModuleCache[moduleId];
    if (!module) {
        return;
    }
    var hotState = moduleHotState.get(module);
    var data = {};
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        // Run the `hot.dispose` handler, if any, passing in the persistent
        // `hot.data` object.
        for(var _iterator = hotState.disposeHandlers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var disposeHandler = _step.value;
            disposeHandler(data);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    // This used to warn in `getOrInstantiateModuleFromParent` when a disposed
    // module is still importing other modules.
    module.hot.active = false;
    moduleHotState.delete(module);
    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
    try {
        // TODO(alexkirsz) Dependencies: delete the module from outdated deps.
        // Remove the disposed module from its children's parent list.
        // It will be added back once the module re-instantiates and imports its
        // children again.
        for(var _iterator1 = module.children[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
            var childId = _step1.value;
            var child = devModuleCache[childId];
            if (!child) {
                continue;
            }
            var idx = child.parents.indexOf(module.id);
            if (idx >= 0) {
                child.parents.splice(idx, 1);
            }
        }
    } catch (err) {
        _didIteratorError1 = true;
        _iteratorError1 = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                _iterator1.return();
            }
        } finally{
            if (_didIteratorError1) {
                throw _iteratorError1;
            }
        }
    }
    switch(mode){
        case 'clear':
            delete devModuleCache[module.id];
            moduleHotData.delete(module.id);
            break;
        case 'replace':
            moduleHotData.set(module.id, data);
            break;
        default:
            invariant(mode, function(mode) {
                return "invalid mode: ".concat(mode);
            });
    }
}
function applyPhase(outdatedSelfAcceptedModules, newModuleFactories, outdatedModuleParents, reportError) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        // Update module factories.
        for(var _iterator = newModuleFactories.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _step_value = _sliced_to_array(_step.value, 2), moduleId = _step_value[0], factory = _step_value[1];
            applyModuleFactoryName(factory);
            moduleFactories.set(moduleId, factory);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
    try {
        // TODO(alexkirsz) Run new runtime entries here.
        // TODO(alexkirsz) Dependencies: call accept handlers for outdated deps.
        // Re-instantiate all outdated self-accepted modules.
        for(var _iterator1 = outdatedSelfAcceptedModules[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
            var _step_value1 = _step1.value, moduleId1 = _step_value1.moduleId, errorHandler = _step_value1.errorHandler;
            try {
                instantiateModule(moduleId1, SourceType.Update, outdatedModuleParents.get(moduleId1));
            } catch (err) {
                if (typeof errorHandler === 'function') {
                    try {
                        errorHandler(err, {
                            moduleId: moduleId1,
                            module: devModuleCache[moduleId1]
                        });
                    } catch (err2) {
                        reportError(err2);
                        reportError(err);
                    }
                } else {
                    reportError(err);
                }
            }
        }
    } catch (err) {
        _didIteratorError1 = true;
        _iteratorError1 = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                _iterator1.return();
            }
        } finally{
            if (_didIteratorError1) {
                throw _iteratorError1;
            }
        }
    }
}
function applyUpdate(update) {
    switch(update.type){
        case 'ChunkListUpdate':
            applyChunkListUpdate(update);
            break;
        default:
            invariant(update, function(update) {
                return "Unknown update type: ".concat(update.type);
            });
    }
}
function applyChunkListUpdate(update) {
    if (update.merged != null) {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = update.merged[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var merged = _step.value;
                switch(merged.type){
                    case 'EcmascriptMergedUpdate':
                        applyEcmascriptMergedUpdate(merged);
                        break;
                    default:
                        invariant(merged, function(merged) {
                            return "Unknown merged type: ".concat(merged.type);
                        });
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    if (update.chunks != null) {
        var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
        try {
            for(var _iterator1 = Object.entries(update.chunks)[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                var _step_value = _sliced_to_array(_step1.value, 2), chunkPath = _step_value[0], chunkUpdate = _step_value[1];
                var chunkUrl = getChunkRelativeUrl(chunkPath);
                switch(chunkUpdate.type){
                    case 'added':
                        BACKEND.loadChunkCached(SourceType.Update, chunkUrl);
                        break;
                    case 'total':
                        var _DEV_BACKEND_reloadChunk, _DEV_BACKEND;
                        (_DEV_BACKEND_reloadChunk = (_DEV_BACKEND = DEV_BACKEND).reloadChunk) === null || _DEV_BACKEND_reloadChunk === void 0 ? void 0 : _DEV_BACKEND_reloadChunk.call(_DEV_BACKEND, chunkUrl);
                        break;
                    case 'deleted':
                        var _DEV_BACKEND_unloadChunk, _DEV_BACKEND1;
                        (_DEV_BACKEND_unloadChunk = (_DEV_BACKEND1 = DEV_BACKEND).unloadChunk) === null || _DEV_BACKEND_unloadChunk === void 0 ? void 0 : _DEV_BACKEND_unloadChunk.call(_DEV_BACKEND1, chunkUrl);
                        break;
                    case 'partial':
                        invariant(chunkUpdate.instruction, function(instruction) {
                            return "Unknown partial instruction: ".concat(JSON.stringify(instruction), ".");
                        });
                        break;
                    default:
                        invariant(chunkUpdate, function(chunkUpdate) {
                            return "Unknown chunk update type: ".concat(chunkUpdate.type);
                        });
                }
            }
        } catch (err) {
            _didIteratorError1 = true;
            _iteratorError1 = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                    _iterator1.return();
                }
            } finally{
                if (_didIteratorError1) {
                    throw _iteratorError1;
                }
            }
        }
    }
}
function applyEcmascriptMergedUpdate(update) {
    var _update_entries = update.entries, entries = _update_entries === void 0 ? {} : _update_entries, _update_chunks = update.chunks, chunks = _update_chunks === void 0 ? {} : _update_chunks;
    var _computeChangedModules = computeChangedModules(entries, chunks), added = _computeChangedModules.added, modified = _computeChangedModules.modified, chunksAdded = _computeChangedModules.chunksAdded, chunksDeleted = _computeChangedModules.chunksDeleted;
    var _computeOutdatedModules = computeOutdatedModules(added, modified), outdatedModules = _computeOutdatedModules.outdatedModules, newModuleFactories = _computeOutdatedModules.newModuleFactories;
    var disposedModules = updateChunksPhase(chunksAdded, chunksDeleted).disposedModules;
    applyInternal(outdatedModules, disposedModules, newModuleFactories);
}
function applyInvalidatedModules(outdatedModules) {
    if (queuedInvalidatedModules.size > 0) {
        computedInvalidatedModules(queuedInvalidatedModules).forEach(function(moduleId) {
            outdatedModules.add(moduleId);
        });
        queuedInvalidatedModules.clear();
    }
    return outdatedModules;
}
function applyInternal(outdatedModules, disposedModules, newModuleFactories) {
    outdatedModules = applyInvalidatedModules(outdatedModules);
    var outdatedSelfAcceptedModules = computeOutdatedSelfAcceptedModules(outdatedModules);
    var outdatedModuleParents = disposePhase(outdatedModules, disposedModules).outdatedModuleParents;
    // we want to continue on error and only throw the error after we tried applying all updates
    var error;
    function reportError(err) {
        if (!error) error = err;
    }
    applyPhase(outdatedSelfAcceptedModules, newModuleFactories, outdatedModuleParents, reportError);
    if (error) {
        throw error;
    }
    if (queuedInvalidatedModules.size > 0) {
        applyInternal(new Set(), [], new Map());
    }
}
function computeChangedModules(entries, updates) {
    var chunksAdded = new Map();
    var chunksDeleted = new Map();
    var added = new Map();
    var modified = new Map();
    var deleted = new Set();
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Object.entries(updates)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _step_value = _sliced_to_array(_step.value, 2), chunkPath = _step_value[0], mergedChunkUpdate = _step_value[1];
            switch(mergedChunkUpdate.type){
                case 'added':
                    {
                        var updateAdded = new Set(mergedChunkUpdate.modules);
                        var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                        try {
                            for(var _iterator1 = updateAdded[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                var moduleId = _step1.value;
                                added.set(moduleId, entries[moduleId]);
                            }
                        } catch (err) {
                            _didIteratorError1 = true;
                            _iteratorError1 = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                    _iterator1.return();
                                }
                            } finally{
                                if (_didIteratorError1) {
                                    throw _iteratorError1;
                                }
                            }
                        }
                        chunksAdded.set(chunkPath, updateAdded);
                        break;
                    }
                case 'deleted':
                    {
                        // We could also use `mergedChunkUpdate.modules` here.
                        var updateDeleted = new Set(chunkModulesMap.get(chunkPath));
                        var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
                        try {
                            for(var _iterator2 = updateDeleted[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                                var moduleId1 = _step2.value;
                                deleted.add(moduleId1);
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                                    _iterator2.return();
                                }
                            } finally{
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                        chunksDeleted.set(chunkPath, updateDeleted);
                        break;
                    }
                case 'partial':
                    {
                        var updateAdded1 = new Set(mergedChunkUpdate.added);
                        var updateDeleted1 = new Set(mergedChunkUpdate.deleted);
                        var _iteratorNormalCompletion3 = true, _didIteratorError3 = false, _iteratorError3 = undefined;
                        try {
                            for(var _iterator3 = updateAdded1[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true){
                                var moduleId2 = _step3.value;
                                added.set(moduleId2, entries[moduleId2]);
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                                    _iterator3.return();
                                }
                            } finally{
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                        var _iteratorNormalCompletion4 = true, _didIteratorError4 = false, _iteratorError4 = undefined;
                        try {
                            for(var _iterator4 = updateDeleted1[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true){
                                var moduleId3 = _step4.value;
                                deleted.add(moduleId3);
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                                    _iterator4.return();
                                }
                            } finally{
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }
                        chunksAdded.set(chunkPath, updateAdded1);
                        chunksDeleted.set(chunkPath, updateDeleted1);
                        break;
                    }
                default:
                    invariant(mergedChunkUpdate, function(mergedChunkUpdate) {
                        return "Unknown merged chunk update type: ".concat(mergedChunkUpdate.type);
                    });
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    var _iteratorNormalCompletion5 = true, _didIteratorError5 = false, _iteratorError5 = undefined;
    try {
        // If a module was added from one chunk and deleted from another in the same update,
        // consider it to be modified, as it means the module was moved from one chunk to another
        // AND has new code in a single update.
        for(var _iterator5 = added.keys()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true){
            var moduleId4 = _step5.value;
            if (deleted.has(moduleId4)) {
                added.delete(moduleId4);
                deleted.delete(moduleId4);
            }
        }
    } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                _iterator5.return();
            }
        } finally{
            if (_didIteratorError5) {
                throw _iteratorError5;
            }
        }
    }
    var _iteratorNormalCompletion6 = true, _didIteratorError6 = false, _iteratorError6 = undefined;
    try {
        for(var _iterator6 = Object.entries(entries)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true){
            var _step_value1 = _sliced_to_array(_step6.value, 2), moduleId5 = _step_value1[0], entry = _step_value1[1];
            // Modules that haven't been added to any chunk but have new code are considered
            // to be modified.
            // This needs to be under the previous loop, as we need it to get rid of modules
            // that were added and deleted in the same update.
            if (!added.has(moduleId5)) {
                modified.set(moduleId5, entry);
            }
        }
    } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                _iterator6.return();
            }
        } finally{
            if (_didIteratorError6) {
                throw _iteratorError6;
            }
        }
    }
    return {
        added: added,
        deleted: deleted,
        modified: modified,
        chunksAdded: chunksAdded,
        chunksDeleted: chunksDeleted
    };
}
function getAffectedModuleEffects(moduleId) {
    var outdatedModules = new Set();
    var queue = [
        {
            moduleId: moduleId,
            dependencyChain: []
        }
    ];
    var nextItem;
    while(nextItem = queue.shift()){
        var _$moduleId = nextItem.moduleId, dependencyChain = nextItem.dependencyChain;
        if (_$moduleId != null) {
            if (outdatedModules.has(_$moduleId)) {
                continue;
            }
            outdatedModules.add(_$moduleId);
        }
        // We've arrived at the runtime of the chunk, which means that nothing
        // else above can accept this update.
        if (_$moduleId === undefined) {
            return {
                type: 'unaccepted',
                dependencyChain: dependencyChain
            };
        }
        var module = devModuleCache[_$moduleId];
        var hotState = moduleHotState.get(module);
        if (// The module is not in the cache. Since this is a "modified" update,
        // it means that the module was never instantiated before.
        !module || hotState.selfAccepted && !hotState.selfInvalidated) {
            continue;
        }
        if (hotState.selfDeclined) {
            return {
                type: 'self-declined',
                dependencyChain: dependencyChain,
                moduleId: _$moduleId
            };
        }
        if (runtimeModules.has(_$moduleId)) {
            queue.push({
                moduleId: undefined,
                dependencyChain: _to_consumable_array(dependencyChain).concat([
                    _$moduleId
                ])
            });
            continue;
        }
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = module.parents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var parentId = _step.value;
                var parent = devModuleCache[parentId];
                if (!parent) {
                    continue;
                }
                // TODO(alexkirsz) Dependencies: check accepted and declined
                // dependencies here.
                queue.push({
                    moduleId: parentId,
                    dependencyChain: _to_consumable_array(dependencyChain).concat([
                        _$moduleId
                    ])
                });
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return {
        type: 'accepted',
        moduleId: moduleId,
        outdatedModules: outdatedModules
    };
}
function handleApply(chunkListPath, update) {
    switch(update.type){
        case 'partial':
            {
                // This indicates that the update is can be applied to the current state of the application.
                applyUpdate(update.instruction);
                break;
            }
        case 'restart':
            {
                // This indicates that there is no way to apply the update to the
                // current state of the application, and that the application must be
                // restarted.
                DEV_BACKEND.restart();
                break;
            }
        case 'notFound':
            {
                // This indicates that the chunk list no longer exists: either the dynamic import which created it was removed,
                // or the page itself was deleted.
                // If it is a dynamic import, we simply discard all modules that the chunk has exclusive access to.
                // If it is a runtime chunk list, we restart the application.
                if (runtimeChunkLists.has(chunkListPath)) {
                    DEV_BACKEND.restart();
                } else {
                    disposeChunkList(chunkListPath);
                }
                break;
            }
        default:
            throw new Error("Unknown update type: ".concat(update.type));
    }
}
function createModuleHot(moduleId, hotData) {
    var hotState = {
        selfAccepted: false,
        selfDeclined: false,
        selfInvalidated: false,
        disposeHandlers: []
    };
    var hot = {
        // TODO(alexkirsz) This is not defined in the HMR API. It was used to
        // decide whether to warn whenever an HMR-disposed module required other
        // modules. We might want to remove it.
        active: true,
        data: hotData !== null && hotData !== void 0 ? hotData : {},
        // TODO(alexkirsz) Support full (dep, callback, errorHandler) form.
        accept: function(modules, _callback, _errorHandler) {
            if (modules === undefined) {
                hotState.selfAccepted = true;
            } else if (typeof modules === 'function') {
                hotState.selfAccepted = modules;
            } else {
                throw new Error('unsupported `accept` signature');
            }
        },
        decline: function(dep) {
            if (dep === undefined) {
                hotState.selfDeclined = true;
            } else {
                throw new Error('unsupported `decline` signature');
            }
        },
        dispose: function(callback) {
            hotState.disposeHandlers.push(callback);
        },
        addDisposeHandler: function(callback) {
            hotState.disposeHandlers.push(callback);
        },
        removeDisposeHandler: function(callback) {
            var idx = hotState.disposeHandlers.indexOf(callback);
            if (idx >= 0) {
                hotState.disposeHandlers.splice(idx, 1);
            }
        },
        invalidate: function() {
            hotState.selfInvalidated = true;
            queuedInvalidatedModules.add(moduleId);
        },
        // NOTE(alexkirsz) This is part of the management API, which we don't
        // implement, but the Next.js React Refresh runtime uses this to decide
        // whether to schedule an update.
        status: function() {
            return 'idle';
        },
        // NOTE(alexkirsz) Since we always return "idle" for now, these are no-ops.
        addStatusHandler: function(_handler) {},
        removeStatusHandler: function(_handler) {},
        // NOTE(jridgewell) Check returns the list of updated modules, but we don't
        // want the webpack code paths to ever update (the turbopack paths handle
        // this already).
        check: function() {
            return Promise.resolve(null);
        }
    };
    return {
        hot: hot,
        hotState: hotState
    };
}
/**
 * Removes a module from a chunk.
 * Returns `true` if there are no remaining chunks including this module.
 */ function removeModuleFromChunk(moduleId, chunkPath) {
    var moduleChunks = moduleChunksMap.get(moduleId);
    moduleChunks.delete(chunkPath);
    var chunkModules = chunkModulesMap.get(chunkPath);
    chunkModules.delete(moduleId);
    var noRemainingModules = chunkModules.size === 0;
    if (noRemainingModules) {
        chunkModulesMap.delete(chunkPath);
    }
    var noRemainingChunks = moduleChunks.size === 0;
    if (noRemainingChunks) {
        moduleChunksMap.delete(moduleId);
    }
    return noRemainingChunks;
}
/**
 * Disposes of a chunk list and its corresponding exclusive chunks.
 */ function disposeChunkList(chunkListPath) {
    var _DEV_BACKEND_unloadChunk, _DEV_BACKEND;
    var chunkPaths = chunkListChunksMap.get(chunkListPath);
    if (chunkPaths == null) {
        return false;
    }
    chunkListChunksMap.delete(chunkListPath);
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = chunkPaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var chunkPath = _step.value;
            var chunkChunkLists = chunkChunkListsMap.get(chunkPath);
            chunkChunkLists.delete(chunkListPath);
            if (chunkChunkLists.size === 0) {
                chunkChunkListsMap.delete(chunkPath);
                disposeChunk(chunkPath);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    // We must also dispose of the chunk list's chunk itself to ensure it may
    // be reloaded properly in the future.
    var chunkListUrl = getChunkRelativeUrl(chunkListPath);
    (_DEV_BACKEND_unloadChunk = (_DEV_BACKEND = DEV_BACKEND).unloadChunk) === null || _DEV_BACKEND_unloadChunk === void 0 ? void 0 : _DEV_BACKEND_unloadChunk.call(_DEV_BACKEND, chunkListUrl);
    return true;
}
/**
 * Disposes of a chunk and its corresponding exclusive modules.
 *
 * @returns Whether the chunk was disposed of.
 */ function disposeChunk(chunkPath) {
    var // This should happen whether the chunk has any modules in it or not.
    // For instance, CSS chunks have no modules in them, but they still need to be unloaded.
    _DEV_BACKEND_unloadChunk, _DEV_BACKEND;
    var chunkUrl = getChunkRelativeUrl(chunkPath);
    (_DEV_BACKEND_unloadChunk = (_DEV_BACKEND = DEV_BACKEND).unloadChunk) === null || _DEV_BACKEND_unloadChunk === void 0 ? void 0 : _DEV_BACKEND_unloadChunk.call(_DEV_BACKEND, chunkUrl);
    var chunkModules = chunkModulesMap.get(chunkPath);
    if (chunkModules == null) {
        return false;
    }
    chunkModules.delete(chunkPath);
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = chunkModules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var moduleId = _step.value;
            var moduleChunks = moduleChunksMap.get(moduleId);
            moduleChunks.delete(chunkPath);
            var noRemainingChunks = moduleChunks.size === 0;
            if (noRemainingChunks) {
                moduleChunksMap.delete(moduleId);
                disposeModule(moduleId, 'clear');
                availableModules.delete(moduleId);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return true;
}
/**
 * Adds a module to a chunk.
 */ function addModuleToChunk(moduleId, chunkPath) {
    var moduleChunks = moduleChunksMap.get(moduleId);
    if (!moduleChunks) {
        moduleChunks = new Set([
            chunkPath
        ]);
        moduleChunksMap.set(moduleId, moduleChunks);
    } else {
        moduleChunks.add(chunkPath);
    }
    var chunkModules = chunkModulesMap.get(chunkPath);
    if (!chunkModules) {
        chunkModules = new Set([
            moduleId
        ]);
        chunkModulesMap.set(chunkPath, chunkModules);
    } else {
        chunkModules.add(moduleId);
    }
}
/**
 * Marks a chunk list as a runtime chunk list. There can be more than one
 * runtime chunk list. For instance, integration tests can have multiple chunk
 * groups loaded at runtime, each with its own chunk list.
 */ function markChunkListAsRuntime(chunkListPath) {
    runtimeChunkLists.add(chunkListPath);
}
function registerChunk(registration) {
    var chunkPath = getPathFromScript(registration[0]);
    var runtimeParams;
    // When bootstrapping we are passed a single runtimeParams object so we can distinguish purely based on length
    if (registration.length === 2) {
        runtimeParams = registration[1];
    } else {
        runtimeParams = undefined;
        installCompressedModuleFactories(registration, /* offset= */ 1, moduleFactories, function(id) {
            return addModuleToChunk(id, chunkPath);
        });
    }
    return BACKEND.registerChunk(chunkPath, runtimeParams);
}
/**
 * Subscribes to chunk list updates from the update server and applies them.
 */ function registerChunkList(chunkList) {
    var chunkListScript = chunkList.script;
    var chunkListPath = getPathFromScript(chunkListScript);
    // The "chunk" is also registered to finish the loading in the backend
    BACKEND.registerChunk(chunkListPath);
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS.push([
        chunkListPath,
        handleApply.bind(null, chunkListPath)
    ]);
    // Adding chunks to chunk lists and vice versa.
    var chunkPaths = new Set(chunkList.chunks.map(getChunkPath));
    chunkListChunksMap.set(chunkListPath, chunkPaths);
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = chunkPaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var chunkPath = _step.value;
            var chunkChunkLists = chunkChunkListsMap.get(chunkPath);
            if (!chunkChunkLists) {
                chunkChunkLists = new Set([
                    chunkListPath
                ]);
                chunkChunkListsMap.set(chunkPath, chunkChunkLists);
            } else {
                chunkChunkLists.add(chunkListPath);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    if (chunkList.source === 'entry') {
        markChunkListAsRuntime(chunkListPath);
    }
}
(_TURBOPACK_CHUNK_UPDATE_LISTENERS = (_globalThis = globalThis).TURBOPACK_CHUNK_UPDATE_LISTENERS) !== null && _TURBOPACK_CHUNK_UPDATE_LISTENERS !== void 0 ? _TURBOPACK_CHUNK_UPDATE_LISTENERS : _globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = [];
/**
 * This file contains the runtime code specific to the Turbopack development
 * ECMAScript DOM runtime.
 *
 * It will be appended to the base development runtime code.
 */ /* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../../../browser/runtime/base/runtime-base.ts" />
/// <reference path="../../../shared/runtime-types.d.ts" />
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self1 = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self1, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
    return d(g, "next", {
        value: verb(0)
    }), d(g, "throw", {
        value: verb(1)
    }), d(g, "return", {
        value: verb(2)
    }), typeof Symbol === "function" && d(g, Symbol.iterator, {
        value: function() {
            return this;
        }
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var BACKEND;
/**
 * Maps chunk paths to the corresponding resolver.
 */ var chunkResolvers = new Map();
(function() {
    BACKEND = {
        registerChunk: function registerChunk(chunkPath, params) {
            return _async_to_generator(function() {
                var chunkUrl, resolver, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, otherChunkData, otherChunkPath, otherChunkUrl, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, moduleId;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            chunkUrl = getChunkRelativeUrl(chunkPath);
                            resolver = getOrCreateResolver(chunkUrl);
                            resolver.resolve();
                            if (params == null) {
                                return [
                                    2
                                ];
                            }
                            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            try {
                                for(_iterator = params.otherChunks[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                    otherChunkData = _step.value;
                                    otherChunkPath = getChunkPath(otherChunkData);
                                    otherChunkUrl = getChunkRelativeUrl(otherChunkPath);
                                    // Chunk might have started loading, so we want to avoid triggering another load.
                                    getOrCreateResolver(otherChunkUrl);
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally{
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                } finally{
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                            // This waits for chunks to be loaded, but also marks included items as available.
                            return [
                                4,
                                Promise.all(params.otherChunks.map(function(otherChunkData) {
                                    return loadInitialChunk(chunkPath, otherChunkData);
                                }))
                            ];
                        case 1:
                            _state.sent();
                            if (params.runtimeModuleIds.length > 0) {
                                _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                                try {
                                    for(_iterator1 = params.runtimeModuleIds[Symbol.iterator](); !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                        moduleId = _step1.value;
                                        getOrInstantiateRuntimeModule(chunkPath, moduleId);
                                    }
                                } catch (err) {
                                    _didIteratorError1 = true;
                                    _iteratorError1 = err;
                                } finally{
                                    try {
                                        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                            _iterator1.return();
                                        }
                                    } finally{
                                        if (_didIteratorError1) {
                                            throw _iteratorError1;
                                        }
                                    }
                                }
                            }
                            return [
                                2
                            ];
                    }
                });
            })();
        },
        /**
     * Loads the given chunk, and returns a promise that resolves once the chunk
     * has been loaded.
     */ loadChunkCached: function loadChunkCached(sourceType, chunkUrl) {
            return doLoadChunk(sourceType, chunkUrl);
        },
        loadWebAssembly: function loadWebAssembly(_sourceType, _sourceData, wasmChunkPath, _edgeModule, importsObj) {
            return _async_to_generator(function() {
                var req, instance;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            req = fetchWebAssembly(wasmChunkPath);
                            return [
                                4,
                                WebAssembly.instantiateStreaming(req, importsObj)
                            ];
                        case 1:
                            instance = _state.sent().instance;
                            return [
                                2,
                                instance.exports
                            ];
                    }
                });
            })();
        },
        loadWebAssemblyModule: function loadWebAssemblyModule(_sourceType, _sourceData, wasmChunkPath, _edgeModule) {
            return _async_to_generator(function() {
                var req;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            req = fetchWebAssembly(wasmChunkPath);
                            return [
                                4,
                                WebAssembly.compileStreaming(req)
                            ];
                        case 1:
                            return [
                                2,
                                _state.sent()
                            ];
                    }
                });
            })();
        }
    };
    function getOrCreateResolver(chunkUrl) {
        var resolver = chunkResolvers.get(chunkUrl);
        if (!resolver) {
            var resolve;
            var reject;
            var promise = new Promise(function(innerResolve, innerReject) {
                resolve = innerResolve;
                reject = innerReject;
            });
            resolver = {
                resolved: false,
                loadingStarted: false,
                promise: promise,
                resolve: function() {
                    resolver.resolved = true;
                    resolve();
                },
                reject: reject
            };
            chunkResolvers.set(chunkUrl, resolver);
        }
        return resolver;
    }
    /**
   * Loads the given chunk, and returns a promise that resolves once the chunk
   * has been loaded.
   */ function doLoadChunk(sourceType, chunkUrl) {
        var resolver = getOrCreateResolver(chunkUrl);
        if (resolver.loadingStarted) {
            return resolver.promise;
        }
        if (sourceType === SourceType.Runtime) {
            // We don't need to load chunks references from runtime code, as they're already
            // present in the DOM.
            resolver.loadingStarted = true;
            if (isCss(chunkUrl)) {
                // CSS chunks do not register themselves, and as such must be marked as
                // loaded instantly.
                resolver.resolve();
            }
            // We need to wait for JS chunks to register themselves within `registerChunk`
            // before we can start instantiating runtime modules, hence the absence of
            // `resolver.resolve()` in this branch.
            return resolver.promise;
        }
        if (typeof importScripts === 'function') {
            // We're in a web worker
            if (isCss(chunkUrl)) {
            // ignore
            } else if (isJs(chunkUrl)) {
                self.TURBOPACK_NEXT_CHUNK_URLS.push(chunkUrl);
                importScripts(TURBOPACK_WORKER_LOCATION + chunkUrl);
            } else {
                throw new Error("can't infer type of chunk from URL ".concat(chunkUrl, " in worker"));
            }
        } else {
            // TODO(PACK-2140): remove this once all filenames are guaranteed to be escaped.
            var decodedChunkUrl = decodeURI(chunkUrl);
            if (isCss(chunkUrl)) {
                var previousLinks = document.querySelectorAll('link[rel=stylesheet][href="'.concat(chunkUrl, '"],link[rel=stylesheet][href^="').concat(chunkUrl, '?"],link[rel=stylesheet][href="').concat(decodedChunkUrl, '"],link[rel=stylesheet][href^="').concat(decodedChunkUrl, '?"]'));
                if (previousLinks.length > 0) {
                    // CSS chunks do not register themselves, and as such must be marked as
                    // loaded instantly.
                    resolver.resolve();
                } else {
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = chunkUrl;
                    link.onerror = function() {
                        resolver.reject();
                    };
                    link.onload = function() {
                        // CSS chunks do not register themselves, and as such must be marked as
                        // loaded instantly.
                        resolver.resolve();
                    };
                    // Append to the `head` for webpack compatibility.
                    document.head.appendChild(link);
                }
            } else if (isJs(chunkUrl)) {
                var previousScripts = document.querySelectorAll('script[src="'.concat(chunkUrl, '"],script[src^="').concat(chunkUrl, '?"],script[src="').concat(decodedChunkUrl, '"],script[src^="').concat(decodedChunkUrl, '?"]'));
                if (previousScripts.length > 0) {
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        // There is this edge where the script already failed loading, but we
                        // can't detect that. The Promise will never resolve in this case.
                        for(var _iterator = Array.from(previousScripts)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var script = _step.value;
                            script.addEventListener('error', function() {
                                resolver.reject();
                            });
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                } else {
                    var script1 = document.createElement('script');
                    script1.src = chunkUrl;
                    // We'll only mark the chunk as loaded once the script has been executed,
                    // which happens in `registerChunk`. Hence the absence of `resolve()` in
                    // this branch.
                    script1.onerror = function() {
                        resolver.reject();
                    };
                    // Append to the `head` for webpack compatibility.
                    document.head.appendChild(script1);
                }
            } else {
                throw new Error("can't infer type of chunk from URL ".concat(chunkUrl));
            }
        }
        resolver.loadingStarted = true;
        return resolver.promise;
    }
    function fetchWebAssembly(wasmChunkPath) {
        return fetch(getChunkRelativeUrl(wasmChunkPath));
    }
})();
/**
 * This file contains the runtime code specific to the Turbopack development
 * ECMAScript DOM runtime.
 *
 * It will be appended to the base development runtime code.
 */ /* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../base/runtime-base.ts" />
/// <reference path="../base/dev-base.ts" />
/// <reference path="./runtime-backend-dom.ts" />
/// <reference path="../../../shared/require-type.d.ts" />
var DEV_BACKEND;
(function() {
    DEV_BACKEND = {
        unloadChunk: function unloadChunk(chunkUrl) {
            deleteResolver(chunkUrl);
            // TODO(PACK-2140): remove this once all filenames are guaranteed to be escaped.
            var decodedChunkUrl = decodeURI(chunkUrl);
            if (isCss(chunkUrl)) {
                var links = document.querySelectorAll('link[href="'.concat(chunkUrl, '"],link[href^="').concat(chunkUrl, '?"],link[href="').concat(decodedChunkUrl, '"],link[href^="').concat(decodedChunkUrl, '?"]'));
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = Array.from(links)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var link = _step.value;
                        link.remove();
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else if (isJs(chunkUrl)) {
                // Unloading a JS chunk would have no effect, as it lives in the JS
                // runtime once evaluated.
                // However, we still want to remove the script tag from the DOM to keep
                // the HTML somewhat consistent from the user's perspective.
                var scripts = document.querySelectorAll('script[src="'.concat(chunkUrl, '"],script[src^="').concat(chunkUrl, '?"],script[src="').concat(decodedChunkUrl, '"],script[src^="').concat(decodedChunkUrl, '?"]'));
                var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                try {
                    for(var _iterator1 = Array.from(scripts)[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                        var script = _step1.value;
                        script.remove();
                    }
                } catch (err) {
                    _didIteratorError1 = true;
                    _iteratorError1 = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                            _iterator1.return();
                        }
                    } finally{
                        if (_didIteratorError1) {
                            throw _iteratorError1;
                        }
                    }
                }
            } else {
                throw new Error("can't infer type of chunk from URL ".concat(chunkUrl));
            }
        },
        reloadChunk: function reloadChunk(chunkUrl) {
            return new Promise(function(resolve, reject) {
                if (!isCss(chunkUrl)) {
                    reject(new Error('The DOM backend can only reload CSS chunks'));
                    return;
                }
                var decodedChunkUrl = decodeURI(chunkUrl);
                var previousLinks = document.querySelectorAll('link[rel=stylesheet][href="'.concat(chunkUrl, '"],link[rel=stylesheet][href^="').concat(chunkUrl, '?"],link[rel=stylesheet][href="').concat(decodedChunkUrl, '"],link[rel=stylesheet][href^="').concat(decodedChunkUrl, '?"]'));
                if (previousLinks.length === 0) {
                    reject(new Error("No link element found for chunk ".concat(chunkUrl)));
                    return;
                }
                var link = document.createElement('link');
                link.rel = 'stylesheet';
                if (navigator.userAgent.includes('Firefox')) {
                    // Firefox won't reload CSS files that were previously loaded on the current page,
                    // we need to add a query param to make sure CSS is actually reloaded from the server.
                    //
                    // I believe this is this issue: https://bugzilla.mozilla.org/show_bug.cgi?id=1037506
                    //
                    // Safari has a similar issue, but only if you have a `<link rel=preload ... />` tag
                    // pointing to the same URL as the stylesheet: https://bugs.webkit.org/show_bug.cgi?id=187726
                    link.href = "".concat(chunkUrl, "?ts=").concat(Date.now());
                } else {
                    link.href = chunkUrl;
                }
                link.onerror = function() {
                    reject();
                };
                link.onload = function() {
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        // First load the new CSS, then remove the old ones. This prevents visible
                        // flickering that would happen in-between removing the previous CSS and
                        // loading the new one.
                        for(var _iterator = Array.from(previousLinks)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var previousLink = _step.value;
                            previousLink.remove();
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    // CSS chunks do not register themselves, and as such must be marked as
                    // loaded instantly.
                    resolve();
                };
                // Make sure to insert the new CSS right after the previous one, so that
                // its precedence is higher.
                previousLinks[0].parentElement.insertBefore(link, previousLinks[0].nextSibling);
            });
        },
        restart: function() {
            return self.location.reload();
        }
    };
    function deleteResolver(chunkUrl) {
        chunkResolvers.delete(chunkUrl);
    }
})();
function _eval(param) {
    var code = param.code, url = param.url, map = param.map;
    code += "\n\n//# sourceURL=".concat(encodeURI(location.origin + CHUNK_BASE_PATH + url + CHUNK_SUFFIX));
    if (map) {
        code += "\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(btoa(// btoa doesn't handle nonlatin characters, so escape them as \x sequences
        // See https://stackoverflow.com/a/26603875
        unescape(encodeURIComponent(map))));
    }
    // eslint-disable-next-line no-eval
    return eval(code);
}
const chunksToRegister = globalThis.TURBOPACK;
globalThis.TURBOPACK = { push: registerChunk };
chunksToRegister.forEach(registerChunk);
const chunkListsToRegister = globalThis.TURBOPACK_CHUNK_LISTS || [];
globalThis.TURBOPACK_CHUNK_LISTS = { push: registerChunkList };
chunkListsToRegister.forEach(registerChunkList);
})();


//# sourceMappingURL=pages__app_6fee710d._.js.map