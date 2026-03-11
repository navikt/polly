(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/util/router.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLocation",
    ()=>useLocation,
    "useNavigate",
    ()=>useNavigate,
    "useParams",
    ()=>useParams
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
/**
 * Compatibility shim so existing components that import from 'react-router'
 * can be pointed here instead, with equivalent hooks backed by next/router.
 *
 * Replace:  import { useNavigate, useParams, useLocation } from 'react-router'
 * With:     import { useNavigate, useParams, useLocation } from '@/util/router'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
function useNavigate() {
    _s();
    var router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    var normalizeUrl = function(to) {
        var _to_pathname;
        var raw = typeof to === 'string' ? to.trim() : (_to_pathname = to.pathname) !== null && _to_pathname !== void 0 ? _to_pathname : '/';
        var lower = raw.toLowerCase();
        if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
            return '/';
        }
        var path = raw.startsWith('/') || raw.startsWith('?') || raw.startsWith('#') ? raw : "/".concat(raw);
        // Explicitly encode HTML meta-characters to break XSS taint chain
        return path.replace(/</g, '%3C').replace(/>/g, '%3E').replace(/"/g, '%22').replace(/'/g, '%27');
    };
    var navigate = function(to, options) {
        if (typeof to === 'number') {
            if (to === -1) router.back();
            return;
        }
        var url = normalizeUrl(to);
        if (options === null || options === void 0 ? void 0 : options.replace) {
            router.replace(url);
        } else {
            router.push(url);
        }
    };
    return navigate;
}
_s(useNavigate, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
function useParams() {
    _s1();
    var router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    var safe = Object.fromEntries(Object.entries(router.query).filter(function(param) {
        var _param = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(param, 2), v = _param[1];
        return typeof v !== 'string' || !/^[a-z][a-z0-9+\-.]*:/i.test(v);
    }).map(function(param) {
        var _param = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(param, 2), k = _param[0], v = _param[1];
        return [
            k,
            Array.isArray(v) ? v[0] : v
        ];
    }));
    return safe;
}
_s1(useParams, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
function useLocation() {
    _s2();
    var router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    var asPath = router.asPath;
    var hashIdx = asPath.indexOf('#');
    var withoutHash = hashIdx >= 0 ? asPath.substring(0, hashIdx) : asPath;
    var hash = hashIdx >= 0 ? asPath.substring(hashIdx) : '';
    var qIdx = withoutHash.indexOf('?');
    var pathname = qIdx >= 0 ? withoutHash.substring(0, qIdx) : withoutHash;
    var search = qIdx >= 0 ? withoutHash.substring(qIdx) : '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {
        pathname: pathname,
        search: search,
        hash: hash,
        state: null,
        key: 'default',
        unstable_mask: undefined
    };
}
_s2(useLocation, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/util/env.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "env",
    ()=>env
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
;
var env = {
    pollyBaseUrl: ("TURBOPACK compile-time value", "/api") || '/api',
    lovdataLovBaseUrl: ("TURBOPACK compile-time value", "https://lovdata.no/lov/"),
    lovdataForskriftBaseUrl: ("TURBOPACK compile-time value", "https://lovdata.no/forskrift/"),
    teamKatBaseUrl: ("TURBOPACK compile-time value", "https://teamkatalog.intern.nav.no/"),
    slackId: ("TURBOPACK compile-time value", "T5LNAMWNA"),
    defaultStartDate: ("TURBOPACK compile-time value", "2006-07-01") || '0001-01-01',
    disableRiskOwner: ("TURBOPACK compile-time value", "true"),
    disableDpProcess: ("TURBOPACK compile-time value", "false")
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/UserApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUserInfo",
    ()=>getUserInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
;
;
;
;
;
// Add auth cookie to rest calls
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].defaults.withCredentials = true;
var getUserInfo = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            return [
                2,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/userinfo"))
            ];
        });
    })();
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/util/codeToFineText.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tekster",
    ()=>tekster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
;
var tekster = {
    READ: 'Les',
    WRITE: 'Skriv',
    SUPER: 'Super',
    ADMIN: 'Admin',
    CREATE: 'Opprett',
    UPDATE: 'Oppdater',
    DELETE: 'Slett',
    INFORMATION_TYPE: 'Opplysningstype',
    POLICY: 'Opplysningstype i behandling',
    PROCESS: 'Behandling',
    DISCLOSURE: 'Utlevering',
    DOCUMENT: 'Dokument',
    CODELIST: 'Kodeverk',
    INFO: 'Info',
    WARNING: 'Advarsel',
    ERROR: 'Feil',
    MISSING_LEGAL_BASIS: 'Behandlingsgrunnlag er ikke avklart',
    EXCESS_INFO: 'Overskuddsinformasjon',
    MISSING_ARTICLE_6: 'Behandlingsgrunnlag for artikkel 6 mangler',
    MISSING_ARTICLE_9: 'Behandlingsgrunnlag for artikkel 9 mangler',
    USES_ALL_INFO_TYPE: 'Bruker alle opplysningstyper'
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/service/User.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EGroup",
    ()=>EGroup,
    "user",
    ()=>user
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$UserApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/UserApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/codeToFineText.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$permissionOverride$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/permissionOverride.ts [client] (ecmascript)");
;
;
;
;
;
;
var EGroup = /*#__PURE__*/ function(EGroup) {
    EGroup["READ"] = "READ";
    EGroup["WRITE"] = "WRITE";
    EGroup["SUPER"] = "SUPER";
    EGroup["ADMIN"] = "ADMIN";
    return EGroup;
}({});
var UserService = function() {
    var loaded = false;
    var userInfo = {
        loggedIn: false,
        groups: []
    };
    var error;
    var getMode = function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$permissionOverride$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getPermissionMode"])();
    };
    var fetchData = function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$UserApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getUserInfo"])().then(function(response) {
                                if (response.status === 200) {
                                    handleGetResponse(response);
                                }
                            }).catch(function(error) {
                                error = error.message;
                                console.debug({
                                    error: error
                                });
                                loaded = true;
                            })
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
    var promise = ("TURBOPACK compile-time truthy", 1) ? fetchData() : "TURBOPACK unreachable";
    var handleGetResponse = function(response) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(response.data) === 'object' && response.data !== null) {
            userInfo = response.data;
        } else {
            error = response.data;
            console.debug({
                error: error
            });
        }
        loaded = true;
    };
    var isLoggedIn = function() {
        return userInfo.loggedIn;
    };
    var getIdent = function() {
        var _userInfo_ident;
        return (_userInfo_ident = userInfo.ident) !== null && _userInfo_ident !== void 0 ? _userInfo_ident : '';
    };
    var getEmail = function() {
        var _userInfo_email;
        return (_userInfo_email = userInfo.email) !== null && _userInfo_email !== void 0 ? _userInfo_email : '';
    };
    var getName = function() {
        var _userInfo_name;
        return (_userInfo_name = userInfo.name) !== null && _userInfo_name !== void 0 ? _userInfo_name : '';
    };
    var getGivenName = function() {
        var _userInfo_givenName;
        return (_userInfo_givenName = userInfo.givenName) !== null && _userInfo_givenName !== void 0 ? _userInfo_givenName : '';
    };
    var getFamilyName = function() {
        var _userInfo_familyName;
        return (_userInfo_familyName = userInfo.familyName) !== null && _userInfo_familyName !== void 0 ? _userInfo_familyName : '';
    };
    var getGroups = function() {
        return userInfo.groups;
    };
    var getGroupsHumanReadable = function() {
        return userInfo.groups.map(function(group) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tekster"][group] || group;
        });
    };
    var hasGroup = function(group) {
        return getGroups().indexOf(group) >= 0;
    };
    var canRead = function() {
        return hasGroup("READ");
    };
    var canWrite = function() {
        var mode = getMode();
        if (mode === 'read') {
            return false;
        }
        var hasWrite = hasGroup("WRITE");
        var hasAdmin = hasGroup("ADMIN");
        var hasSuper = hasGroup("SUPER");
        if (mode === 'write') {
            return hasWrite || hasAdmin || hasSuper;
        }
        // mode === 'admin'
        return hasWrite || hasAdmin || hasSuper;
    };
    var isSuper = function() {
        return getMode() === 'admin' && hasGroup("SUPER");
    };
    var isAdmin = function() {
        return getMode() === 'admin' && hasGroup("ADMIN");
    };
    var wait = function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            promise
                        ];
                    case 1:
                        _state.sent();
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var isLoaded = function() {
        return loaded;
    };
    return {
        isLoggedIn: isLoggedIn,
        getIdent: getIdent,
        getEmail: getEmail,
        getName: getName,
        getGivenName: getGivenName,
        getFamilyName: getFamilyName,
        getGroups: getGroups,
        getGroupsHumanReadable: getGroupsHumanReadable,
        hasGroup: hasGroup,
        canRead: canRead,
        canWrite: canWrite,
        isSuper: isSuper,
        isAdmin: isAdmin,
        wait: wait,
        isLoaded: isLoaded
    };
};
_c = UserService;
var user = UserService();
var _c;
__turbopack_context__.k.register(_c, "UserService");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/util/helper-functions.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkForAaregDispatcher",
    ()=>checkForAaregDispatcher,
    "disableEnter",
    ()=>disableEnter,
    "getNoDpiaLabel",
    ()=>getNoDpiaLabel,
    "isLink",
    ()=>isLink,
    "mapBool",
    ()=>mapBool,
    "shortenLinksInText",
    ()=>shortenLinksInText
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$link$2f$Link$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/link/Link.js [client] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/tooltip/Tooltip.js [client] (ecmascript) <export default as Tooltip>");
;
var _this = ("TURBOPACK compile-time value", void 0);
;
;
var isLink = function(text) {
    var regex = /http[s]?:\/\/.*/gm;
    if (!regex.test(text)) {
        return false;
    }
    return true;
};
var shortenLinksInText = function(text) {
    return text.split(/\s+/).map(function(word, index) {
        if (isLink(word)) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__["Tooltip"], {
                        content: word,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$link$2f$Link$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                            href: word,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            children: "se ekstern lenke"
                        }, void 0, false, {
                            fileName: "[project]/src/util/helper-functions.tsx",
                            lineNumber: 20,
                            columnNumber: 13
                        }, _this)
                    }, void 0, false, {
                        fileName: "[project]/src/util/helper-functions.tsx",
                        lineNumber: 19,
                        columnNumber: 11
                    }, _this),
                    " "
                ]
            }, index, true, {
                fileName: "[project]/src/util/helper-functions.tsx",
                lineNumber: 18,
                columnNumber: 9
            }, _this);
        } else {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: [
                    word,
                    " "
                ]
            }, index, true, {
                fileName: "[project]/src/util/helper-functions.tsx",
                lineNumber: 28,
                columnNumber: 14
            }, _this);
        }
    });
};
var mapBool = function(b) {
    return b === true ? true : b === false ? false : undefined;
};
var disableEnter = function(event) {
    if (event.key === 'Enter') event.preventDefault();
};
var getNoDpiaLabel = function(id) {
    if (id === 'NO_SPECIAL_CATEGORY_PI') {
        return 'Ingen særlige kategorier personopplysninger behandles';
    } else if (id === 'SMALL_SCALE') {
        return 'Behandlingen skjer ikke i stor skala (få personopplysninger eller registrerte)';
    } else if (id === 'NO_DATASET_CONSOLIDATION') {
        return 'Ingen sammenstilling av datasett på tvers av formål';
    } else if (id === 'NO_NEW_TECH') {
        return 'Ingen bruk av teknologi på nye måter eller ny teknologi';
    } else if (id === 'NO_PROFILING_OR_AUTOMATION') {
        return 'Ingen bruk av profilering eller automatisering';
    } else if (id === 'OTHER') {
        return 'Annet';
    }
    return '';
};
var checkForAaregDispatcher = function(process) {
    return process.affiliation.disclosureDispatchers.find(function(disclosureDispatcher) {
        return disclosureDispatcher.shortName === 'Aa-reg';
    });
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/DpProcessApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDpProcess",
    ()=>createDpProcess,
    "deleteDpProcess",
    ()=>deleteDpProcess,
    "dpProcessToFormValues",
    ()=>dpProcessToFormValues,
    "fromValuesToDpProcess",
    ()=>fromValuesToDpProcess,
    "getAllDpProcesses",
    ()=>getAllDpProcesses,
    "getDpProcess",
    ()=>getDpProcess,
    "getDpProcessByDepartment",
    ()=>getDpProcessByDepartment,
    "getDpProcessByPageAndSize",
    ()=>getDpProcessByPageAndSize,
    "getDpProcessByProductTeam",
    ()=>getDpProcessByProductTeam,
    "searchDpProcess",
    ()=>searchDpProcess,
    "updateDpProcess",
    ()=>updateDpProcess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_to_consumable_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/helper-functions.tsx [client] (ecmascript)");
;
;
;
;
;
;
;
var getAllDpProcesses = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var PAGE_SIZE, firstPage, AllDpProcesses, currentPage, _, _1;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    PAGE_SIZE = 100;
                    return [
                        4,
                        getDpProcessByPageAndSize(0, PAGE_SIZE)
                    ];
                case 1:
                    firstPage = _state.sent();
                    if (!(firstPage.pages === 1)) return [
                        3,
                        2
                    ];
                    return [
                        2,
                        firstPage.content.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(firstPage.content) : []
                    ];
                case 2:
                    AllDpProcesses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(firstPage.content);
                    currentPage = 1;
                    _state.label = 3;
                case 3:
                    if (!(currentPage < firstPage.pages)) return [
                        3,
                        6
                    ];
                    _1 = (_ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(AllDpProcesses)).concat;
                    return [
                        4,
                        getDpProcessByPageAndSize(currentPage, PAGE_SIZE)
                    ];
                case 4:
                    AllDpProcesses = _1.apply(_, [
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"].apply(void 0, [
                            _state.sent().content
                        ])
                    ]);
                    _state.label = 5;
                case 5:
                    currentPage++;
                    return [
                        3,
                        3
                    ];
                case 6:
                    return [
                        2,
                        AllDpProcesses
                    ];
                case 7:
                    return [
                        2
                    ];
            }
        });
    })();
};
var getDpProcessByPageAndSize = function(pageNumber, pageSize) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/dpprocess?pageNumber=").concat(pageNumber, "&pageSize=").concat(pageSize))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getDpProcessByDepartment = function(department) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/dpprocess/department/").concat(department))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getDpProcessByProductTeam = function(productTeam) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/dpprocess/productTeam/").concat(productTeam))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getDpProcess = function(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/dpprocess/").concat(id))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var searchDpProcess = function(text) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/dpprocess/search/").concat(text))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var createDpProcess = function(dpProcessFormValues) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var body;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    body = fromValuesToDpProcess(dpProcessFormValues);
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/dpprocess"), body)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var updateDpProcess = function(id, dpProcess) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].put("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/dpprocess/").concat(id), dpProcess)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var deleteDpProcess = function(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].delete("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/dpprocess/").concat(id))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var dpProcessToFormValues = function(dpProcess) {
    var _affiliation_department;
    var _ref = dpProcess || {}, affiliation = _ref.affiliation, art10 = _ref.art10, art9 = _ref.art9, dataProcessingAgreements = _ref.dataProcessingAgreements, description = _ref.description, end = _ref.end, externalProcessResponsible = _ref.externalProcessResponsible, id = _ref.id, name = _ref.name, purposeDescription = _ref.purposeDescription, retention = _ref.retention, start = _ref.start, subDataProcessing = _ref.subDataProcessing;
    return {
        affiliation: {
            department: (affiliation === null || affiliation === void 0 ? void 0 : (_affiliation_department = affiliation.department) === null || _affiliation_department === void 0 ? void 0 : _affiliation_department.code) || '',
            nomDepartmentId: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.nomDepartmentId) || '',
            nomDepartmentName: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.nomDepartmentName) || '',
            seksjoner: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.seksjoner) || [],
            fylker: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.fylker) || [],
            navKontorer: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.navKontorer) || [],
            subDepartments: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.subDepartments.map(function(sd) {
                return sd.code;
            })) || [],
            productTeams: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.productTeams) || [],
            products: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.products.map(function(p) {
                return p.code;
            })) || [],
            disclosureDispatchers: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.disclosureDispatchers.map(function(d) {
                return d.code;
            })) || []
        },
        art10: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(art10),
        art9: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(art9),
        dataProcessingAgreements: dataProcessingAgreements || [],
        description: description || '',
        end: end || undefined,
        externalProcessResponsible: externalProcessResponsible && externalProcessResponsible.code || undefined,
        subDataProcessing: {
            dataProcessor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(subDataProcessing === null || subDataProcessing === void 0 ? void 0 : subDataProcessing.dataProcessor),
            processors: (subDataProcessing === null || subDataProcessing === void 0 ? void 0 : subDataProcessing.processors) || []
        },
        id: id,
        name: name || '',
        purposeDescription: purposeDescription || '',
        retention: {
            retentionMonths: (retention === null || retention === void 0 ? void 0 : retention.retentionMonths) || 0,
            retentionStart: (retention === null || retention === void 0 ? void 0 : retention.retentionStart) || ''
        },
        start: start || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].defaultStartDate
    };
};
var fromValuesToDpProcess = function(values) {
    return {
        affiliation: values.affiliation,
        art10: values.art10,
        art9: values.art9,
        dataProcessingAgreements: values.dataProcessingAgreements,
        description: values.description,
        end: values.end,
        externalProcessResponsible: values.externalProcessResponsible ? values.externalProcessResponsible : undefined,
        subDataProcessing: {
            dataProcessor: values.subDataProcessing.dataProcessor,
            processors: values.subDataProcessing.processors || []
        },
        id: values.id,
        name: values.name || '',
        purposeDescription: values.purposeDescription,
        retention: values.retention,
        start: values.start
    };
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/CodelistApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCodelist",
    ()=>createCodelist,
    "deleteCodelist",
    ()=>deleteCodelist,
    "getAllCodelists",
    ()=>getAllCodelists,
    "getAllCountries",
    ()=>getAllCountries,
    "getCodelistUsage",
    ()=>getCodelistUsage,
    "getCodelistUsageByListName",
    ()=>getCodelistUsageByListName,
    "getCountriesOutsideEUEEA",
    ()=>getCountriesOutsideEUEEA,
    "replaceCodelistUsage",
    ()=>replaceCodelistUsage,
    "updateCodelist",
    ()=>updateCodelist
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
;
;
;
;
;
var getAllCodelists = function(refresh) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/codelist?refresh=").concat(refresh ? 'true' : 'false'))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getCodelistUsageByListName = function(listname) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/codelist/usage/find/").concat(listname))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getCodelistUsage = function(listname, code) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/codelist/usage/find/").concat(listname, "/").concat(code))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var replaceCodelistUsage = function(listname, oldCode, newCode, newCodeName) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/codelist/usage/replace"), {
                            list: listname,
                            oldCode: oldCode,
                            newCode: newCode,
                            newCodeName: newCodeName
                        })
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var createCodelist = function(code) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            return [
                2,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/codelist"), [
                    code
                ])
            ];
        });
    })();
};
var updateCodelist = function(code) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            return [
                2,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].put("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/codelist"), [
                    code
                ])
            ];
        });
    })();
};
var deleteCodelist = function(list, code) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            return [
                2,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].delete("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/codelist/").concat(list, "/").concat(code))
            ];
        });
    })();
};
var getAllCountries = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/codelist/countries"))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getCountriesOutsideEUEEA = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/codelist/countriesoutsideeea"))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/util/clipboard.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "copyToClipboard",
    ()=>copyToClipboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
;
var copyToClipboard = function(text) {
    var el = document.createElement('textarea');
    el.innerText = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    el.remove();
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/util/hooks/customHooks.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAwait",
    ()=>useAwait,
    "useDebouncedState",
    ()=>useDebouncedState,
    "useForceUpdate",
    ()=>useForceUpdate,
    "useQuery",
    ()=>useQuery,
    "useQueryParam",
    ()=>useQueryParam,
    "useRefs",
    ()=>useRefs,
    "useUpdateOnChange",
    ()=>useUpdateOnChange
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
;
;
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
;
function useDebouncedState(initialValue, delay) {
    _s();
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(initialValue), 2), value = _useState[0], setValue = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(value), 2), debouncedValue = _useState1[0], setDebouncedValue = _useState1[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDebouncedState.useEffect": function() {
            var handler = setTimeout({
                "useDebouncedState.useEffect.handler": function() {
                    setDebouncedValue(value);
                }
            }["useDebouncedState.useEffect.handler"], delay);
            return ({
                "useDebouncedState.useEffect": function() {
                    clearTimeout(handler);
                }
            })["useDebouncedState.useEffect"];
        }
    }["useDebouncedState.useEffect"], [
        value,
        delay
    ]);
    // value returned as actual non-debounced value to be used in inputfields etc
    return [
        debouncedValue,
        setValue,
        value
    ];
}
_s(useDebouncedState, "ZiX+uXQ6Qh0840rbcoMNwVlV6Tc=");
function useForceUpdate() {
    _s1();
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0), 2), val = _useState[0], setVal = _useState[1];
    return function() {
        return setVal(val + 1);
    };
}
_s1(useForceUpdate, "XeVoAYDfweeGAwOcym/L9MmPyyI=");
function useUpdateOnChange(value) {
    _s2();
    var update = useForceUpdate();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useUpdateOnChange.useEffect": function() {
            update();
        }
    }["useUpdateOnChange.useEffect"], [
        value
    ]);
}
_s2(useUpdateOnChange, "FFf+WCduuMTRORPVuOy4hz2AQKY=", false, function() {
    return [
        useForceUpdate
    ];
});
function useAwait(promise, setLoading) {
    _s3();
    var update = useForceUpdate();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAwait.useEffect": function() {
            ;
            ({
                "useAwait.useEffect": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
                        "useAwait.useEffect": function() {
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                                "useAwait.useEffect": function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            if (setLoading) {
                                                setLoading(true);
                                            }
                                            return [
                                                4,
                                                promise
                                            ];
                                        case 1:
                                            _state.sent();
                                            update();
                                            if (setLoading) {
                                                setLoading(false);
                                            }
                                            return [
                                                2
                                            ];
                                    }
                                }
                            }["useAwait.useEffect"]);
                        }
                    }["useAwait.useEffect"])();
                }
            })["useAwait.useEffect"]();
        }
    }["useAwait.useEffect"], []);
}
_s3(useAwait, "FFf+WCduuMTRORPVuOy4hz2AQKY=", false, function() {
    return [
        useForceUpdate
    ];
});
function useRefs(ids) {
    var refs = ids.reduce(function(acc, value) {
        acc[value] = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createRef"])();
        return acc;
    }, {}) || {};
    return refs;
}
function useQuery() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    var location = window.location;
    return new URLSearchParams(location.search);
}
function useQueryParam(queryParam) {
    _s4();
    return useQuery().get(queryParam) || undefined;
}
_s4(useQueryParam, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        useQuery
    ];
});
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/util/hooks/table.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SORT_DIRECTION",
    ()=>SORT_DIRECTION,
    "useTable",
    ()=>useTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_to_consumable_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
;
;
var _s = __turbopack_context__.k.signature();
;
var SORT_DIRECTION = {
    ASC: 'ASC',
    DESC: 'DESC'
};
var newSort = function(newColumn, columnPrevious, directionPrevious) {
    var newDirection = columnPrevious && newColumn === columnPrevious && directionPrevious === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC;
    return {
        newDirection: newDirection,
        newColumn: newColumn
    };
};
var getSortFunction = function(sortColumn, useDefaultStringCompare, sorting) {
    if (!sorting) {
        if (useDefaultStringCompare) {
            return function(a, b) {
                return a[sortColumn].localeCompare(b[sortColumn]);
            };
        } else {
            return undefined;
        }
    }
    return sorting[sortColumn];
};
var toDirection = function(direction, column) {
    var newDirection = {};
    newDirection[column] = direction;
    return newDirection;
};
var useTable = function(initialData, config) {
    _s();
    var _ref = config || {}, sorting = _ref.sorting, useDefaultStringCompare = _ref.useDefaultStringCompare, showLast = _ref.showLast;
    var initialSort = newSort(config === null || config === void 0 ? void 0 : config.initialSortColumn);
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(initialData), 2), data = _useState[0], setData = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true), 2), isInitialSort = _useState1[0], setIsInitialSort = _useState1[1];
    var _useState2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(initialSort.newDirection), 2), sortDirection = _useState2[0], setSortDirection = _useState2[1];
    var _useState3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(initialSort.newColumn), 2), sortColumn = _useState3[0], setSortColumn = _useState3[1];
    var _useState4 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(toDirection(initialSort.newDirection, initialSort.newColumn)), 2), direction = _useState4[0], setDirection = _useState4[1];
    var sortTableData = function() {
        if (sortColumn) {
            var sortFunct = getSortFunction(sortColumn, !!useDefaultStringCompare, sorting);
            if (!sortFunct) {
                console.warn("invalid sort column ".concat(String(sortColumn), " no sort function supplied"));
            } else {
                try {
                    var sorted = initialData.slice(0).sort(sortFunct);
                    var ordered = sortDirection === SORT_DIRECTION.ASC ? sorted : sorted.reverse();
                    if (showLast && isInitialSort) {
                        ordered = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(ordered.filter(function(order) {
                            return !showLast(order);
                        })).concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(ordered.filter(showLast)));
                    }
                    return ordered;
                } catch (error) {
                    console.error('Error during sort of ', initialData, sortFunct, error);
                }
            }
        }
        return initialData;
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTable.useEffect": function() {
            return setData(sortTableData());
        }
    }["useTable.useEffect"], [
        sortColumn,
        sortDirection,
        initialData
    ]);
    var sort = function(sortColumnName) {
        var _newSort = newSort(sortColumnName, sortColumn, sortDirection), newDirection = _newSort.newDirection, newColumn = _newSort.newColumn;
        setSortColumn(newColumn);
        setSortDirection(newDirection);
        setDirection(toDirection(newDirection, newColumn));
        setIsInitialSort(false);
    };
    var state = {
        data: data,
        direction: direction,
        sortColumn: sortColumn,
        sortDirection: sortDirection
    };
    return [
        state,
        sort
    ];
};
_s(useTable, "0Vc10IX7BIcBmwtjgMUM8yREwbA=");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/util/hooks/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$table$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/table.ts [client] (ecmascript)");
;
;
;
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/util/theme.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chartColor",
    ()=>chartColor,
    "primitives",
    ()=>primitives,
    "searchResultColor",
    ()=>searchResultColor,
    "theme",
    ()=>theme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
;
var primitives = {
    primary: 'var(--a-surface-action)',
    primary50: 'var(--a-surface-subtle)',
    primary100: 'var(--a-surface-subtle)',
    primary150: 'var(--a-surface-subtle)',
    primary200: 'var(--a-border-action)',
    primary300: 'var(--a-surface-action)',
    primary400: 'var(--a-surface-action)'
};
var chartColor = {
    generalBlue: '#409FDD',
    generalRed: '#FF7983',
    generalMustard: '#FFCC40',
    lightGreen: '#C9EA95',
    orange: '#FFAB66',
    darkGreen: '#408DA0'
};
var searchResultColor = {
    informationTypeBackground: '#E0DAE7',
    purposeBackground: '#E0F5FB',
    processBackground: '#CCEAD8',
    dpProcessBackground: '#FFCC40',
    teamBackground: '#FFE9CC',
    productAreaBackground: '#F5DBEB',
    departmentBackground: '#ECEFCC',
    subDepartmentBackground: '#D1E9EB',
    thirdPartyBackground: '#E5E5E5',
    systemBackground: '#FED2B9',
    documentBackground: '#C9EA95',
    nationalLawBackground: '#FFAB66',
    gdprBackground: '#99C2E8'
};
var theme = {
    colors: {
        primary: primitives.primary,
        primary50: primitives.primary50,
        primary100: primitives.primary100,
        primary150: primitives.primary150,
        primary200: primitives.primary200,
        primary300: primitives.primary300,
        primary400: primitives.primary400,
        accent100: 'var(--a-surface-info-subtle)',
        accent300: 'var(--a-surface-info)',
        positive300: 'var(--a-surface-success)',
        positive400: 'var(--a-text-success)',
        warning300: 'var(--a-surface-warning)',
        warning400: 'var(--a-text-warning)',
        negative400: 'var(--a-surface-danger)',
        negative500: 'var(--a-text-danger)',
        mono100: 'var(--a-surface-subtle)',
        mono600: 'var(--a-border-subtle)',
        mono1000: 'var(--a-text-default)'
    },
    sizing: {
        scale100: '0.25rem',
        scale200: '0.5rem',
        scale300: '0.75rem',
        scale500: '1rem',
        scale600: '1.25rem',
        scale700: '1.5rem',
        scale800: '2rem',
        scale1200: '3rem',
        scale2400: '6rem'
    }
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/util/index.tsx [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$clipboard$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/clipboard.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/hooks/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/theme.ts [client] (ecmascript)");
;
;
;
;
;
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/constants.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EAlertEventLevel",
    ()=>EAlertEventLevel,
    "EAlertEventType",
    ()=>EAlertEventType,
    "EAuditAction",
    ()=>EAuditAction,
    "ELegalBasesUse",
    ()=>ELegalBasesUse,
    "ENoDpiaReason",
    ()=>ENoDpiaReason,
    "ENomNivaa",
    ()=>ENomNivaa,
    "EObjectType",
    ()=>EObjectType,
    "EOrgEnhetsType",
    ()=>EOrgEnhetsType,
    "EProcessField",
    ()=>EProcessField,
    "EProcessSelection",
    ()=>EProcessSelection,
    "EProcessState",
    ()=>EProcessState,
    "EProcessStatus",
    ()=>EProcessStatus,
    "EProcessStatusFilter",
    ()=>EProcessStatusFilter,
    "TRANSFER_GROUNDS_OUTSIDE_EU_OTHER",
    ()=>TRANSFER_GROUNDS_OUTSIDE_EU_OTHER,
    "disclosureSort",
    ()=>disclosureSort,
    "documentSort",
    ()=>documentSort,
    "dpProcessSort",
    ()=>dpProcessSort,
    "getPolicySort",
    ()=>getPolicySort,
    "getProcessSort",
    ()=>getProcessSort,
    "informationTypeSort",
    ()=>informationTypeSort
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
;
var ELegalBasesUse = /*#__PURE__*/ function(ELegalBasesUse) {
    ELegalBasesUse["INHERITED_FROM_PROCESS"] = "INHERITED_FROM_PROCESS";
    ELegalBasesUse["EXCESS_INFO"] = "EXCESS_INFO";
    ELegalBasesUse["UNRESOLVED"] = "UNRESOLVED";
    ELegalBasesUse["DEDICATED_LEGAL_BASES"] = "DEDICATED_LEGAL_BASES";
    return ELegalBasesUse;
}({});
var EAlertEventType = /*#__PURE__*/ function(EAlertEventType) {
    EAlertEventType["MISSING_LEGAL_BASIS"] = "MISSING_LEGAL_BASIS";
    EAlertEventType["EXCESS_INFO"] = "EXCESS_INFO";
    EAlertEventType["MISSING_ARTICLE_6"] = "MISSING_ARTICLE_6";
    EAlertEventType["MISSING_ARTICLE_9"] = "MISSING_ARTICLE_9";
    EAlertEventType["USES_ALL_INFO_TYPE"] = "USES_ALL_INFO_TYPE";
    return EAlertEventType;
}({});
var EAlertEventLevel = /*#__PURE__*/ function(EAlertEventLevel) {
    EAlertEventLevel["INFO"] = "INFO";
    EAlertEventLevel["WARNING"] = "WARNING";
    EAlertEventLevel["ERROR"] = "ERROR";
    return EAlertEventLevel;
}({});
var EAuditAction = /*#__PURE__*/ function(EAuditAction) {
    EAuditAction["CREATE"] = "CREATE";
    EAuditAction["UPDATE"] = "UPDATE";
    EAuditAction["DELETE"] = "DELETE";
    return EAuditAction;
}({});
var EObjectType = /*#__PURE__*/ function(EObjectType) {
    EObjectType["INFORMATION_TYPE"] = "INFORMATION_TYPE";
    EObjectType["POLICY"] = "POLICY";
    EObjectType["PROCESS"] = "PROCESS";
    EObjectType["PROCESSOR"] = "PROCESSOR";
    EObjectType["DP_PROCESS"] = "DP_PROCESS";
    EObjectType["DISCLOSURE"] = "DISCLOSURE";
    EObjectType["DOCUMENT"] = "DOCUMENT";
    EObjectType["CODELIST"] = "CODELIST";
    EObjectType["GENERIC_STORAGE"] = "GENERIC_STORAGE";
    return EObjectType;
}({});
var EProcessField = /*#__PURE__*/ function(EProcessField) {
    EProcessField["DPIA"] = "DPIA";
    EProcessField["DPIA_REFERENCE_MISSING"] = "DPIA_REFERENCE_MISSING";
    EProcessField["PROFILING"] = "PROFILING";
    EProcessField["AIUSAGE"] = "AIUSAGE";
    EProcessField["AUTOMATION"] = "AUTOMATION";
    EProcessField["RETENTION"] = "RETENTION";
    EProcessField["RETENTION_DATA"] = "RETENTION_DATA";
    EProcessField["DATA_PROCESSOR"] = "DATA_PROCESSOR";
    EProcessField["EXCESS_INFO"] = "EXCESS_INFO";
    EProcessField["USES_ALL_INFO_TYPE"] = "USES_ALL_INFO_TYPE";
    EProcessField["MISSING_LEGAL_BASIS"] = "MISSING_LEGAL_BASIS";
    EProcessField["MISSING_ARTICLE_6"] = "MISSING_ARTICLE_6";
    EProcessField["MISSING_ARTICLE_9"] = "MISSING_ARTICLE_9";
    EProcessField["COMMON_EXTERNAL_PROCESSOR"] = "COMMON_EXTERNAL_PROCESSOR";
    return EProcessField;
}({});
var EProcessState = /*#__PURE__*/ function(EProcessState) {
    EProcessState["YES"] = "YES";
    EProcessState["NO"] = "NO";
    EProcessState["UNKNOWN"] = "UNKNOWN";
    return EProcessState;
}({});
var EProcessStatusFilter = /*#__PURE__*/ function(EProcessStatusFilter) {
    EProcessStatusFilter["All"] = "ALL";
    EProcessStatusFilter["COMPLETED"] = "COMPLETED";
    EProcessStatusFilter["IN_PROGRESS"] = "IN_PROGRESS";
    EProcessStatusFilter["NEEDS_REVISION"] = "NEEDS_REVISION";
    return EProcessStatusFilter;
}({});
var EProcessStatus = /*#__PURE__*/ function(EProcessStatus) {
    EProcessStatus["COMPLETED"] = "COMPLETED";
    EProcessStatus["IN_PROGRESS"] = "IN_PROGRESS";
    EProcessStatus["NEEDS_REVISION"] = "NEEDS_REVISION";
    return EProcessStatus;
}({});
var ENoDpiaReason = /*#__PURE__*/ function(ENoDpiaReason) {
    ENoDpiaReason["NO_SPECIAL_CATEGORY_PI"] = "NO_SPECIAL_CATEGORY_PI";
    ENoDpiaReason["SMALL_SCALE"] = "SMALL_SCALE";
    ENoDpiaReason["NO_DATASET_CONSOLIDATION"] = "NO_DATASET_CONSOLIDATION";
    ENoDpiaReason["NO_NEW_TECH"] = "NO_NEW_TECH";
    ENoDpiaReason["NO_PROFILING_OR_AUTOMATION"] = "NO_PROFILING_OR_AUTOMATION";
    ENoDpiaReason["OTHER"] = "OTHER";
    return ENoDpiaReason;
}({});
var EProcessSelection = /*#__PURE__*/ function(EProcessSelection) {
    EProcessSelection["ONE"] = "ONE";
    EProcessSelection["ALL"] = "ALL";
    EProcessSelection["DEPARTMENT"] = "DEPARTMENT";
    EProcessSelection["PRODUCT_AREA"] = "PRODUCT_AREA";
    return EProcessSelection;
}({});
var TRANSFER_GROUNDS_OUTSIDE_EU_OTHER = 'OTHER';
var getPolicySort = function(codelistUtils) {
    return {
        purposes: function(a, b) {
            return codelistUtils && codelistUtils.getShortnameForCode(a.purposes[0]).localeCompare(codelistUtils.getShortnameForCode(b.purposes[0]), 'nb');
        },
        informationType: function(a, b) {
            return a.informationType.name.localeCompare(b.informationType.name);
        },
        process: function(a, b) {
            var _a_process, _b_process;
            return (((_a_process = a.process) === null || _a_process === void 0 ? void 0 : _a_process.name) || '').localeCompare(((_b_process = b.process) === null || _b_process === void 0 ? void 0 : _b_process.name) || '');
        },
        subjectCategories: function(a, b) {
            return codelistUtils && codelistUtils.getShortnameForCode(a.subjectCategories[0]).localeCompare(codelistUtils.getShortnameForCode(b.subjectCategories[0]), 'nb');
        },
        legalBases: function(a, b) {
            return a.legalBases.length - b.legalBases.length;
        }
    };
};
var disclosureSort = {
    name: function(a, b) {
        return (a.name || '').localeCompare(b.name || '');
    },
    recipient: function(a, b) {
        return a.recipient.shortName.localeCompare(b.recipient.shortName);
    },
    recipientPurpose: function(a, b) {
        return a.recipientPurpose.localeCompare(b.recipientPurpose);
    },
    document: function(a, b) {
        var _a_document, _b_document;
        return (((_a_document = a.document) === null || _a_document === void 0 ? void 0 : _a_document.name) || '').localeCompare(((_b_document = b.document) === null || _b_document === void 0 ? void 0 : _b_document.name) || '');
    },
    description: function(a, b) {
        return a.description.localeCompare(b.description);
    },
    legalBases: function(a, b) {
        return a.legalBases.length - b.legalBases.length;
    }
};
var informationTypeSort = {
    name: function(a, b) {
        return (a.name || '').localeCompare(b.name || '');
    },
    description: function(a, b) {
        return (a.description || '').localeCompare(b.description || '');
    },
    orgMaster: function(a, b) {
        var _a_orgMaster, _b_orgMaster;
        return (((_a_orgMaster = a.orgMaster) === null || _a_orgMaster === void 0 ? void 0 : _a_orgMaster.shortName) || '').localeCompare(((_b_orgMaster = b.orgMaster) === null || _b_orgMaster === void 0 ? void 0 : _b_orgMaster.shortName) || '');
    },
    term: function(a, b) {
        return (a.term || '').localeCompare(b.term || '');
    }
};
var documentSort = {
    informationType: function(a, b) {
        return a.informationType.name.localeCompare(b.informationType.name);
    },
    subjectCategories: function(a, b) {
        return a.subjectCategories.length - b.subjectCategories.length;
    }
};
var getProcessSort = function(codelistUtils) {
    return {
        name: function(a, b) {
            return a.name.localeCompare(b.name);
        },
        purposes: function(a, b) {
            return codelistUtils.getShortnameForCode(a.purposes[0]).localeCompare(codelistUtils.getShortnameForCode(b.purposes[0]), 'nb');
        },
        affiliation: function(a) {
            var _a_affiliation_department, _a_affiliation_department1;
            return (((_a_affiliation_department = a.affiliation.department) === null || _a_affiliation_department === void 0 ? void 0 : _a_affiliation_department.shortName) || '').localeCompare(((_a_affiliation_department1 = a.affiliation.department) === null || _a_affiliation_department1 === void 0 ? void 0 : _a_affiliation_department1.shortName) || '');
        }
    };
};
var dpProcessSort = {
    name: function(a, b) {
        return a.name.localeCompare(b.name);
    },
    externalProcessResponsible: function(a, b) {
        var _a_externalProcessResponsible, _b_externalProcessResponsible;
        return (((_a_externalProcessResponsible = a.externalProcessResponsible) === null || _a_externalProcessResponsible === void 0 ? void 0 : _a_externalProcessResponsible.shortName) || '').localeCompare(((_b_externalProcessResponsible = b.externalProcessResponsible) === null || _b_externalProcessResponsible === void 0 ? void 0 : _b_externalProcessResponsible.shortName) || '');
    },
    affiliation: function(a) {
        var _a_affiliation_department, _a_affiliation_department1;
        return (((_a_affiliation_department = a.affiliation.department) === null || _a_affiliation_department === void 0 ? void 0 : _a_affiliation_department.shortName) || '').localeCompare(((_a_affiliation_department1 = a.affiliation.department) === null || _a_affiliation_department1 === void 0 ? void 0 : _a_affiliation_department1.shortName) || '');
    },
    description: function(a, b) {
        return (a.description || '').localeCompare(b.description || '');
    },
    changeStamp: function(a, b) {
        return (a.changeStamp.lastModifiedBy || '').localeCompare(b.changeStamp.lastModifiedBy || '');
    }
};
var EOrgEnhetsType = /*#__PURE__*/ function(EOrgEnhetsType) {
    EOrgEnhetsType["ARBEIDSLIVSSENTER"] = "ARBEIDSLIVSSENTER";
    EOrgEnhetsType["NAV_ARBEID_OG_YTELSER"] = "NAV_ARBEID_OG_YTELSER";
    EOrgEnhetsType["ARBEIDSRAADGIVNING"] = "ARBEIDSRAADGIVNING";
    EOrgEnhetsType["DIREKTORAT"] = "DIREKTORAT";
    EOrgEnhetsType["DIR"] = "DIR";
    EOrgEnhetsType["FYLKE"] = "FYLKE";
    EOrgEnhetsType["NAV_FAMILIE_OG_PENSJONSYTELSER"] = "NAV_FAMILIE_OG_PENSJONSYTELSER";
    EOrgEnhetsType["HJELPEMIDLER_OG_TILRETTELEGGING"] = "HJELPEMIDLER_OG_TILRETTELEGGING";
    EOrgEnhetsType["KLAGEINSTANS"] = "KLAGEINSTANS";
    EOrgEnhetsType["NAV_KONTAKTSENTER"] = "NAV_KONTAKTSENTER";
    EOrgEnhetsType["KONTROLL_KONTROLLENHET"] = "KONTROLL_KONTROLLENHET";
    EOrgEnhetsType["NAV_KONTOR"] = "NAV_KONTOR";
    EOrgEnhetsType["TILTAK"] = "TILTAK";
    EOrgEnhetsType["NAV_OKONOMITJENESTE"] = "NAV_OKONOMITJENESTE";
    return EOrgEnhetsType;
}({});
var ENomNivaa = /*#__PURE__*/ function(ENomNivaa) {
    ENomNivaa["LINJEENHET"] = "LINJEENHET";
    ENomNivaa["DRIFTSENHET"] = "DRIFTSENHET";
    ENomNivaa["ARBEIDSOMRAADE"] = "ARBEIDSOMRAADE";
    return ENomNivaa;
}({});
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/PolicyApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "convertLegalBasesToFormValues",
    ()=>convertLegalBasesToFormValues,
    "convertPolicyToFormValues",
    ()=>convertPolicyToFormValues,
    "createPolicies",
    ()=>createPolicies,
    "createPolicy",
    ()=>createPolicy,
    "deletePoliciesByProcessId",
    ()=>deletePoliciesByProcessId,
    "deletePolicy",
    ()=>deletePolicy,
    "getPoliciesForInformationType",
    ()=>getPoliciesForInformationType,
    "getPolicy",
    ()=>getPolicy,
    "mapPolicyFromForm",
    ()=>mapPolicyFromForm,
    "updatePolicy",
    ()=>updatePolicy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread_props.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$shortid$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/shortid/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
;
;
;
;
;
;
;
;
;
var getPoliciesForInformationType = function(informationTypeId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/policy?informationTypeId=").concat(informationTypeId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getPolicy = function(policyId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/policy/").concat(policyId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var createPolicy = function(policy) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var body;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    body = mapPolicyFromForm(policy);
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/policy"), [
                            body
                        ])
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content[0]
                    ];
            }
        });
    })();
};
var createPolicies = function(policies) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var body;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    body = policies.map(mapPolicyFromForm);
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/policy"), body)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content
                    ];
            }
        });
    })();
};
var updatePolicy = function(policy) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var body;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    body = mapPolicyFromForm(policy);
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].put("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/policy/").concat(policy.id), body)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var deletePolicy = function(policyId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].delete("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/policy/").concat(policyId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var deletePoliciesByProcessId = function(processId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].delete("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/policy/process/").concat(processId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var mapPolicyFromForm = function(values) {
    var _values_informationType;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, values), {
        subjectCategories: values.subjectCategories,
        informationType: undefined,
        informationTypeId: (_values_informationType = values.informationType) === null || _values_informationType === void 0 ? void 0 : _values_informationType.id,
        process: undefined,
        processId: values.process.id,
        legalBases: values.legalBasesUse !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ELegalBasesUse"].DEDICATED_LEGAL_BASES ? [] : values.legalBases,
        legalBasesUse: values.legalBasesUse
    });
};
var convertLegalBasesToFormValues = function(legalBases) {
    return (legalBases || []).map(function(legalBasis) {
        return {
            gdpr: legalBasis.gdpr && legalBasis.gdpr.code,
            nationalLaw: legalBasis.nationalLaw && legalBasis.nationalLaw.code || undefined,
            description: legalBasis.description || undefined,
            key: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$shortid$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].generate()
        };
    });
};
var convertPolicyToFormValues = function(policy, otherPolicies) {
    return {
        legalBasesOpen: false,
        id: policy.id,
        process: policy.process,
        purposes: policy.purposes.map(function(p) {
            return p.code;
        }),
        informationType: policy.informationType,
        subjectCategories: policy.subjectCategories.map(function(code) {
            return code.code;
        }),
        legalBasesUse: policy.legalBasesUse,
        legalBases: convertLegalBasesToFormValues(policy.legalBases),
        documentIds: policy.documentIds || [],
        otherPolicies: otherPolicies
    };
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/DisclosureApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "convertDisclosureToFormValues",
    ()=>convertDisclosureToFormValues,
    "convertFormValuesToDisclosure",
    ()=>convertFormValuesToDisclosure,
    "createDisclosure",
    ()=>createDisclosure,
    "deleteDisclosure",
    ()=>deleteDisclosure,
    "getAllDisclosures",
    ()=>getAllDisclosures,
    "getDisclosure",
    ()=>getDisclosure,
    "getDisclosureByDepartment",
    ()=>getDisclosureByDepartment,
    "getDisclosureByProductTeam",
    ()=>getDisclosureByProductTeam,
    "getDisclosureSummaries",
    ()=>getDisclosureSummaries,
    "getDisclosuresByInformationTypeId",
    ()=>getDisclosuresByInformationTypeId,
    "getDisclosuresByPageAndPageSize",
    ()=>getDisclosuresByPageAndPageSize,
    "getDisclosuresByProcessId",
    ()=>getDisclosuresByProcessId,
    "getDisclosuresByRecipient",
    ()=>getDisclosuresByRecipient,
    "getDisclosuresWithEmptyLegalBases",
    ()=>getDisclosuresWithEmptyLegalBases,
    "searchDisclosure",
    ()=>searchDisclosure,
    "updateDisclosure",
    ()=>updateDisclosure,
    "useDisclosureSearch",
    ()=>useDisclosureSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/helper-functions.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/PolicyApi.ts [client] (ecmascript)");
;
;
;
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
var getAllDisclosures = function(pageSize, pageNumber) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/disclosure?pageSize=").concat(pageSize, "&pageNumber=").concat(pageNumber))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content
                    ];
            }
        });
    })();
};
var getDisclosure = function(disclosureId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/disclosure/").concat(disclosureId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getDisclosuresByPageAndPageSize = function(pageNumber, pageSize) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/disclosure?pageNumber=").concat(pageNumber, "&pageSize=").concat(pageSize))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getDisclosureSummaries = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/disclosure/summary"))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getDisclosuresWithEmptyLegalBases = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/disclosure?emptyLegalBases=true"))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content
                    ];
            }
        });
    })();
};
var getDisclosuresByRecipient = function(recipient) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/disclosure?recipient=").concat(recipient))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content
                    ];
            }
        });
    })();
};
var getDisclosuresByProcessId = function(processId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/disclosure?processId=").concat(processId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content
                    ];
            }
        });
    })();
};
var getDisclosuresByInformationTypeId = function(informationTypeId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/disclosure?informationTypeId=").concat(informationTypeId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content
                    ];
            }
        });
    })();
};
var searchDisclosure = function(text) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/disclosure/search/").concat(text))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getDisclosureByDepartment = function(department) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/disclosure/department/").concat(department))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getDisclosureByProductTeam = function(productTeam) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/disclosure/productTeam/").concat(productTeam))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var createDisclosure = function(disclosure) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var body;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    body = convertFormValuesToDisclosure(disclosure);
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/disclosure"), body)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var updateDisclosure = function(disclosure) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var body;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    body = convertFormValuesToDisclosure(disclosure);
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].put("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/disclosure/").concat(body.id), body)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var deleteDisclosure = function(disclosureId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].delete("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/disclosure/").concat(disclosureId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var convertFormValuesToDisclosure = function(values) {
    var _values_document;
    return {
        id: values.id,
        recipient: values.recipient,
        name: values.name,
        recipientPurpose: values.recipientPurpose,
        description: values.description,
        documentId: (_values_document = values.document) === null || _values_document === void 0 ? void 0 : _values_document.id,
        legalBases: values.legalBases ? values.legalBases : [],
        start: values.start,
        end: values.end,
        processIds: values.processIds.length > 0 ? values.processIds : values.processes.map(function(p) {
            return p.id;
        }) || [],
        informationTypeIds: values.informationTypes ? values.informationTypes.map(function(i) {
            return i.id;
        }) : [],
        abroad: {
            abroad: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(values.abroad.abroad),
            countries: values.abroad.countries,
            refToAgreement: values.abroad.refToAgreement,
            businessArea: values.abroad.businessArea
        },
        administrationArchiveCaseNumber: values.administrationArchiveCaseNumber,
        thirdCountryReceiver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(values.thirdCountryReceiver),
        assessedConfidentiality: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(values.assessedConfidentiality),
        confidentialityDescription: values.confidentialityDescription,
        productTeams: values.productTeams,
        department: values.department,
        nomDepartmentId: values.nomDepartmentId,
        nomDepartmentName: values.nomDepartmentName
    };
};
var convertDisclosureToFormValues = function(disclosure) {
    var _disclosure_department;
    return {
        id: disclosure.id,
        recipient: disclosure.recipient.code || '',
        name: disclosure.name || '',
        recipientPurpose: disclosure ? disclosure.recipientPurpose : '',
        description: disclosure.description || '',
        document: disclosure.document ? {
            name: disclosure.document.name,
            description: disclosure.document.description,
            dataAccessClass: disclosure.document.dataAccessClass ? disclosure.document.dataAccessClass.code : '',
            informationTypes: disclosure.document.informationTypes
        } : undefined,
        legalBases: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["convertLegalBasesToFormValues"])((disclosure === null || disclosure === void 0 ? void 0 : disclosure.legalBases) || []),
        legalBasesOpen: false,
        start: disclosure.start || undefined,
        end: disclosure.end || undefined,
        processes: disclosure.processes || [],
        informationTypes: disclosure.informationTypes || [],
        abroad: {
            abroad: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(disclosure.abroad.abroad),
            countries: disclosure.abroad.countries || [],
            refToAgreement: disclosure.abroad.refToAgreement || '',
            businessArea: disclosure.abroad.businessArea || ''
        },
        productTeams: disclosure.productTeams || [],
        department: (disclosure === null || disclosure === void 0 ? void 0 : (_disclosure_department = disclosure.department) === null || _disclosure_department === void 0 ? void 0 : _disclosure_department.code) || '',
        nomDepartmentId: (disclosure === null || disclosure === void 0 ? void 0 : disclosure.nomDepartmentId) || '',
        nomDepartmentName: (disclosure === null || disclosure === void 0 ? void 0 : disclosure.nomDepartmentName) || '',
        processIds: disclosure.processIds || [],
        administrationArchiveCaseNumber: disclosure.administrationArchiveCaseNumber || '',
        thirdCountryReceiver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(disclosure.thirdCountryReceiver),
        assessedConfidentiality: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(disclosure.assessedConfidentiality),
        confidentialityDescription: disclosure.confidentialityDescription || ''
    };
};
var useDisclosureSearch = function() {
    _s();
    var _useDebouncedState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useDebouncedState"])('', 200), 2), disclosureSearch = _useDebouncedState[0], setDisclosureSearch = _useDebouncedState[1];
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]), 2), disclosureSearchResult = _useState[0], setDisclosureSearchResult = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), loading = _useState1[0], setLoading = _useState1[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDisclosureSearch.useEffect": function() {
            ;
            ({
                "useDisclosureSearch.useEffect": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
                        "useDisclosureSearch.useEffect": function() {
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                                "useDisclosureSearch.useEffect": function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            if (!(disclosureSearch && disclosureSearch.length > 2)) return [
                                                3,
                                                2
                                            ];
                                            setLoading(true);
                                            return [
                                                4,
                                                searchDisclosure(disclosureSearch)
                                            ];
                                        case 1:
                                            setDisclosureSearchResult.apply(void 0, [
                                                _state.sent().content
                                            ]);
                                            setLoading(false);
                                            return [
                                                3,
                                                3
                                            ];
                                        case 2:
                                            setDisclosureSearchResult([]);
                                            _state.label = 3;
                                        case 3:
                                            return [
                                                2
                                            ];
                                    }
                                }
                            }["useDisclosureSearch.useEffect"]);
                        }
                    }["useDisclosureSearch.useEffect"])();
                }
            })["useDisclosureSearch.useEffect"]();
        }
    }["useDisclosureSearch.useEffect"], [
        disclosureSearch
    ]);
    return [
        disclosureSearchResult,
        setDisclosureSearch,
        loading
    ];
};
_s(useDisclosureSearch, "KnpB1pLjJ2ZTSn2i7cI0BJP0Kag=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useDebouncedState"]
    ];
});
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/SettingsApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSettings",
    ()=>getSettings,
    "writeSettings",
    ()=>writeSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
;
;
;
;
;
var getSettings = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/settings"))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var writeSettings = function(settings) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/settings"), settings)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/DocumentApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInformationTypesDocument",
    ()=>createInformationTypesDocument,
    "deleteDocument",
    ()=>deleteDocument,
    "getDefaultProcessDocument",
    ()=>getDefaultProcessDocument,
    "getDocument",
    ()=>getDocument,
    "getDocumentByPageAndPageSize",
    ()=>getDocumentByPageAndPageSize,
    "getDocumentsForInformationType",
    ()=>getDocumentsForInformationType,
    "searchDocuments",
    ()=>searchDocuments,
    "updateInformationTypesDocument",
    ()=>updateInformationTypesDocument,
    "useDocumentSearch",
    ()=>useDocumentSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$SettingsApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/SettingsApi.ts [client] (ecmascript)");
;
;
;
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
var getDocument = function(documentId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/document/").concat(documentId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getDocumentByPageAndPageSize = function(pageNumber, pageSize) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/document?pageNumber=").concat(pageNumber, "&pageSize=").concat(pageSize))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getDefaultProcessDocument = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var settings;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$SettingsApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getSettings"])()
                    ];
                case 1:
                    settings = _state.sent();
                    return [
                        4,
                        getDocument(settings.defaultProcessDocument)
                    ];
                case 2:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    })();
};
var getDocumentsForInformationType = function(informationTypeId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/document?informationTypeId=").concat(informationTypeId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var searchDocuments = function(name) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/document/search/").concat(name))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var updateInformationTypesDocument = function(document) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var body;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    body = mapFormValuesToDocument(document);
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].put("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/document/").concat(document.id), body)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var createInformationTypesDocument = function(document) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var body;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    body = mapFormValuesToDocument(document);
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/document"), body)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var deleteDocument = function(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].delete("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/document/").concat(id))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var mapFormValuesToDocument = function(document) {
    return {
        id: document.id ? document.id : undefined,
        name: document.name,
        description: document.description,
        informationTypes: document.informationTypes.map(function(it) {
            return {
                informationTypeId: it.informationTypeId,
                subjectCategories: it.subjectCategories.map(function(sc) {
                    return sc.code;
                })
            };
        }),
        dataAccessClass: document.dataAccessClass
    };
};
var useDocumentSearch = function() {
    _s();
    var _useDebouncedState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useDebouncedState"])('', 200), 2), documentSearch = _useDebouncedState[0], setDocumentSearch = _useDebouncedState[1];
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]), 2), documentSearchResult = _useState[0], setDocumentSearchResult = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), loading = _useState1[0], setLoading = _useState1[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDocumentSearch.useEffect": function() {
            ;
            ({
                "useDocumentSearch.useEffect": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
                        "useDocumentSearch.useEffect": function() {
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                                "useDocumentSearch.useEffect": function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            if (!(documentSearch && documentSearch.length > 2)) return [
                                                3,
                                                2
                                            ];
                                            setLoading(true);
                                            return [
                                                4,
                                                searchDocuments(documentSearch)
                                            ];
                                        case 1:
                                            setDocumentSearchResult.apply(void 0, [
                                                _state.sent().content
                                            ]);
                                            setLoading(false);
                                            return [
                                                3,
                                                3
                                            ];
                                        case 2:
                                            setDocumentSearchResult([]);
                                            _state.label = 3;
                                        case 3:
                                            return [
                                                2
                                            ];
                                    }
                                }
                            }["useDocumentSearch.useEffect"]);
                        }
                    }["useDocumentSearch.useEffect"])();
                }
            })["useDocumentSearch.useEffect"]();
        }
    }["useDocumentSearch.useEffect"], [
        documentSearch
    ]);
    return [
        documentSearchResult,
        setDocumentSearch,
        loading
    ];
};
_s(useDocumentSearch, "Y5Nnum+hmTlq4QSpKnEbIHXSoow=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useDebouncedState"]
    ];
});
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/InfoTypeApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInformationType",
    ()=>createInformationType,
    "deleteInformationType",
    ()=>deleteInformationType,
    "getInformationType",
    ()=>getInformationType,
    "getInformationTypes",
    ()=>getInformationTypes,
    "getInformationTypesBy",
    ()=>getInformationTypesBy,
    "getInformationTypesShort",
    ()=>getInformationTypesShort,
    "mapInfoTypeToFormVals",
    ()=>mapInfoTypeToFormVals,
    "searchInformationType",
    ()=>searchInformationType,
    "updateInformationType",
    ()=>updateInformationType,
    "useInfoTypeSearch",
    ()=>useInfoTypeSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$query$2d$string$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/query-string/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
;
;
;
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
var getInformationTypes = function(page, limit) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/informationtype?pageNumber=").concat(page - 1, "&pageSize=").concat(limit))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getInformationTypesShort = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/informationtype/short"))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content
                    ];
            }
        });
    })();
};
var getInformationTypesBy = function(params) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/informationtype?").concat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$query$2d$string$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].stringify(params, {
                            skipNull: true
                        })))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var searchInformationType = function(text) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/informationtype/search"), {
                            params: {
                                name: text
                            }
                        })
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getInformationType = function(informationTypeId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/informationtype/").concat(informationTypeId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var deleteInformationType = function(informationTypeId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].delete("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/informationtype/").concat(informationTypeId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var createInformationType = function(informationType) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/informationtype"), [
                            informationType
                        ])
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content[0]
                    ];
            }
        });
    })();
};
var updateInformationType = function(informationType) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].put("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/informationtype/").concat(informationType.id), informationType)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var useInfoTypeSearch = function() {
    _s();
    var _useDebouncedState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useDebouncedState"])('', 200), 2), infoTypeSearch = _useDebouncedState[0], setInfoTypeSearch = _useDebouncedState[1];
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]), 2), infoTypeSearchResult = _useState[0], setInfoTypeSearchResult = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), loading = _useState1[0], setLoading = _useState1[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useInfoTypeSearch.useEffect": function() {
            var search = {
                "useInfoTypeSearch.useEffect.search": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
                        "useInfoTypeSearch.useEffect.search": function() {
                            var res;
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                                "useInfoTypeSearch.useEffect.search": function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            if (!(infoTypeSearch && infoTypeSearch.length > 2)) return [
                                                3,
                                                2
                                            ];
                                            setLoading(true);
                                            return [
                                                4,
                                                searchInformationType(infoTypeSearch)
                                            ];
                                        case 1:
                                            res = _state.sent();
                                            setInfoTypeSearchResult(res.content);
                                            setLoading(false);
                                            _state.label = 2;
                                        case 2:
                                            return [
                                                2
                                            ];
                                    }
                                }
                            }["useInfoTypeSearch.useEffect.search"]);
                        }
                    }["useInfoTypeSearch.useEffect.search"])();
                }
            }["useInfoTypeSearch.useEffect.search"];
            search();
        }
    }["useInfoTypeSearch.useEffect"], [
        infoTypeSearch
    ]);
    return [
        infoTypeSearchResult,
        infoTypeSearch,
        setInfoTypeSearch,
        loading
    ];
};
_s(useInfoTypeSearch, "7FSPE1AE4+cULx10EoYaaQ4q/vA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useDebouncedState"]
    ];
});
var mapInfoTypeToFormVals = function(data) {
    var _data_sensitivity, _data_categories, _data_sources, _data_orgMaster;
    return {
        id: data.id,
        name: data.name || '',
        term: data.term || '',
        sensitivity: ((_data_sensitivity = data.sensitivity) === null || _data_sensitivity === void 0 ? void 0 : _data_sensitivity.code) || '',
        categories: (data === null || data === void 0 ? void 0 : (_data_categories = data.categories) === null || _data_categories === void 0 ? void 0 : _data_categories.map(function(c) {
            return c.code;
        })) || [],
        sources: (data === null || data === void 0 ? void 0 : (_data_sources = data.sources) === null || _data_sources === void 0 ? void 0 : _data_sources.map(function(c) {
            return c.code;
        })) || [],
        productTeams: data.productTeams || [],
        keywords: data.keywords || [],
        description: data.description || '',
        orgMaster: ((_data_orgMaster = data.orgMaster) === null || _data_orgMaster === void 0 ? void 0 : _data_orgMaster.code) || ''
    };
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/ProcessApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "convertFormValuesToProcess",
    ()=>convertFormValuesToProcess,
    "convertProcessToFormValues",
    ()=>convertProcessToFormValues,
    "createProcess",
    ()=>createProcess,
    "deleteProcess",
    ()=>deleteProcess,
    "getProcess",
    ()=>getProcess,
    "getProcessByStateAndStatus",
    ()=>getProcessByStateAndStatus,
    "getProcessByStateAndStatusForDepartment",
    ()=>getProcessByStateAndStatusForDepartment,
    "getProcessByStateAndStatusForProductArea",
    ()=>getProcessByStateAndStatusForProductArea,
    "getProcessPurposeCount",
    ()=>getProcessPurposeCount,
    "getProcessesByProcessor",
    ()=>getProcessesByProcessor,
    "getProcessesByPurpose",
    ()=>getProcessesByPurpose,
    "getProcessesFor",
    ()=>getProcessesFor,
    "getRecentEditedProcesses",
    ()=>getRecentEditedProcesses,
    "searchProcess",
    ()=>searchProcess,
    "searchProcessOptions",
    ()=>searchProcessOptions,
    "updateProcess",
    ()=>updateProcess,
    "useProcessSearch",
    ()=>useProcessSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread_props.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$query$2d$string$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/query-string/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/helper-functions.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/PolicyApi.ts [client] (ecmascript)");
;
;
;
;
;
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
var getProcess = function(processId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var data;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/process/").concat(processId))
                    ];
                case 1:
                    data = _state.sent().data;
                    data.policies.forEach(function(p) {
                        return p.process = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, data), {
                            policies: []
                        });
                    });
                    return [
                        2,
                        data
                    ];
            }
        });
    })();
};
var getProcessByStateAndStatus = function(processField, processState) {
    var processStatus = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EProcessStatusFilter"].All;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/process/state?processField=").concat(processField, "&processState=").concat(processState, "&processStatus=").concat(processStatus))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content
                    ];
            }
        });
    })();
};
var getProcessByStateAndStatusForProductArea = function(processField, processState) {
    var processStatus = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EProcessStatusFilter"].All, productreaId = arguments.length > 3 ? arguments[3] : void 0;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/process/state?processField=").concat(processField, "&processState=").concat(processState, "&processStatus=").concat(processStatus, "&productAreaId=").concat(productreaId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content
                    ];
            }
        });
    })();
};
var getProcessByStateAndStatusForDepartment = function(processField, processState) {
    var processStatus = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EProcessStatusFilter"].All, departmentCode = arguments.length > 3 ? arguments[3] : void 0;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/process/state?processField=").concat(processField, "&processState=").concat(processState, "&processStatus=").concat(processStatus, "&department=").concat(departmentCode))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content
                    ];
            }
        });
    })();
};
var searchProcess = function(text) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/process/search/").concat(text))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getProcessesByPurpose = function(text) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/process/purpose/").concat(text))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getProcessesByProcessor = function(processorId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/process?pageNumber=0&pageSize=200&processorId=").concat(processorId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getProcessesFor = function(params) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/process?").concat(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$query$2d$string$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].stringify(params, {
                            skipNull: true
                        }), "&pageSize=250"))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getProcessPurposeCount = function(query) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/process/count?").concat(query))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var createProcess = function(process) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var body;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    body = convertFormValuesToProcess(process);
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/process"), body)
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var deleteProcess = function(processId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].delete("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/process/").concat(processId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var updateProcess = function(process) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var body, data;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    body = convertFormValuesToProcess(process);
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].put("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/process/").concat(process.id), body)
                    ];
                case 1:
                    data = _state.sent().data;
                    data.policies.forEach(function(p) {
                        return p.process = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, data), {
                            policies: []
                        });
                    });
                    return [
                        2,
                        data
                    ];
            }
        });
    })();
};
var getRecentEditedProcesses = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/process/myedits"))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content
                    ];
            }
        });
    })();
};
var convertProcessToFormValues = function(process) {
    var _affiliation_department;
    var _ref = process || {}, id = _ref.id, purposes = _ref.purposes, name = _ref.name, description = _ref.description, additionalDescription = _ref.additionalDescription, affiliation = _ref.affiliation, commonExternalProcessResponsible = _ref.commonExternalProcessResponsible, legalBases = _ref.legalBases, start = _ref.start, end = _ref.end, usesAllInformationTypes = _ref.usesAllInformationTypes, automaticProcessing = _ref.automaticProcessing, profiling = _ref.profiling, aiUsageDescription = _ref.aiUsageDescription, dataProcessing = _ref.dataProcessing, retention = _ref.retention, dpia = _ref.dpia, status = _ref.status;
    return {
        legalBasesOpen: false,
        id: id,
        name: name || '',
        description: description || '',
        additionalDescription: additionalDescription || '',
        purposes: (purposes === null || purposes === void 0 ? void 0 : purposes.map(function(p) {
            return p.code;
        })) || [],
        affiliation: {
            department: (affiliation === null || affiliation === void 0 ? void 0 : (_affiliation_department = affiliation.department) === null || _affiliation_department === void 0 ? void 0 : _affiliation_department.code) || '',
            nomDepartmentId: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.nomDepartmentId) || '',
            nomDepartmentName: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.nomDepartmentName) || '',
            seksjoner: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.seksjoner) || [],
            fylker: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.fylker) || [],
            navKontorer: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.navKontorer) || [],
            subDepartments: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.subDepartments.map(function(sd) {
                return sd.code;
            })) || [],
            productTeams: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.productTeams) || [],
            products: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.products.map(function(p) {
                return p.code;
            })) || [],
            disclosureDispatchers: (affiliation === null || affiliation === void 0 ? void 0 : affiliation.disclosureDispatchers.map(function(d) {
                return d.code;
            })) || []
        },
        commonExternalProcessResponsible: commonExternalProcessResponsible && commonExternalProcessResponsible.code || undefined,
        legalBases: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["convertLegalBasesToFormValues"])(legalBases),
        start: start || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].defaultStartDate,
        end: end || undefined,
        usesAllInformationTypes: process && !!usesAllInformationTypes,
        automaticProcessing: process ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(automaticProcessing) : false,
        profiling: process ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(profiling) : false,
        aiUsageDescription: {
            aiUsage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(aiUsageDescription === null || aiUsageDescription === void 0 ? void 0 : aiUsageDescription.aiUsage),
            description: (aiUsageDescription === null || aiUsageDescription === void 0 ? void 0 : aiUsageDescription.description) || '',
            reusingPersonalInformation: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(aiUsageDescription === null || aiUsageDescription === void 0 ? void 0 : aiUsageDescription.reusingPersonalInformation),
            startDate: (aiUsageDescription === null || aiUsageDescription === void 0 ? void 0 : aiUsageDescription.startDate) || undefined,
            endDate: (aiUsageDescription === null || aiUsageDescription === void 0 ? void 0 : aiUsageDescription.endDate) || undefined,
            registryNumber: (aiUsageDescription === null || aiUsageDescription === void 0 ? void 0 : aiUsageDescription.registryNumber) || ''
        },
        dataProcessing: {
            dataProcessor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(dataProcessing === null || dataProcessing === void 0 ? void 0 : dataProcessing.dataProcessor),
            processors: (dataProcessing === null || dataProcessing === void 0 ? void 0 : dataProcessing.processors) || []
        },
        retention: {
            retentionPlan: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(retention === null || retention === void 0 ? void 0 : retention.retentionPlan),
            retentionMonths: (retention === null || retention === void 0 ? void 0 : retention.retentionMonths) || 0,
            retentionStart: (retention === null || retention === void 0 ? void 0 : retention.retentionStart) || '',
            retentionDescription: (retention === null || retention === void 0 ? void 0 : retention.retentionDescription) || ''
        },
        status: status || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EProcessStatus"].IN_PROGRESS,
        dpia: {
            grounds: (dpia === null || dpia === void 0 ? void 0 : dpia.grounds) || '',
            needForDpia: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["mapBool"])(dpia === null || dpia === void 0 ? void 0 : dpia.needForDpia),
            processImplemented: (dpia === null || dpia === void 0 ? void 0 : dpia.processImplemented) || false,
            refToDpia: (dpia === null || dpia === void 0 ? void 0 : dpia.refToDpia) || '',
            riskOwner: (dpia === null || dpia === void 0 ? void 0 : dpia.riskOwner) || '',
            riskOwnerFunction: (dpia === null || dpia === void 0 ? void 0 : dpia.riskOwnerFunction) || '',
            noDpiaReasons: (dpia === null || dpia === void 0 ? void 0 : dpia.noDpiaReasons) || []
        },
        disclosures: []
    };
};
var convertFormValuesToProcess = function(values) {
    var _values_dpia, _values_dpia1, _values_dpia2, _values_dpia3, _values_dpia4, _values_dpia5;
    return {
        id: values.id,
        name: values.name,
        description: values.description,
        additionalDescription: values.additionalDescription,
        purposes: values.purposes,
        affiliation: values.affiliation,
        commonExternalProcessResponsible: values.commonExternalProcessResponsible ? values.commonExternalProcessResponsible : undefined,
        legalBases: values.legalBases ? values.legalBases : [],
        start: values.start,
        end: values.end,
        usesAllInformationTypes: values.usesAllInformationTypes,
        automaticProcessing: values.automaticProcessing,
        profiling: values.profiling,
        aiUsageDescription: {
            aiUsage: values.aiUsageDescription.aiUsage,
            description: values.aiUsageDescription.description,
            reusingPersonalInformation: values.aiUsageDescription.reusingPersonalInformation,
            startDate: values.aiUsageDescription.startDate,
            endDate: values.aiUsageDescription.endDate,
            registryNumber: values.aiUsageDescription.registryNumber
        },
        dataProcessing: {
            dataProcessor: values.dataProcessing.dataProcessor,
            processors: values.dataProcessing.processors || []
        },
        retention: values.retention,
        status: values.status,
        dpia: {
            grounds: ((_values_dpia = values.dpia) === null || _values_dpia === void 0 ? void 0 : _values_dpia.needForDpia) ? '' : (values.dpia.noDpiaReasons || []).filter(function(r) {
                return r === 'OTHER';
            }).length > 0 ? (_values_dpia1 = values.dpia) === null || _values_dpia1 === void 0 ? void 0 : _values_dpia1.grounds : '',
            needForDpia: values.dpia.needForDpia,
            refToDpia: ((_values_dpia2 = values.dpia) === null || _values_dpia2 === void 0 ? void 0 : _values_dpia2.needForDpia) ? values.dpia.refToDpia : '',
            processImplemented: (_values_dpia3 = values.dpia) === null || _values_dpia3 === void 0 ? void 0 : _values_dpia3.processImplemented,
            riskOwner: (_values_dpia4 = values.dpia) === null || _values_dpia4 === void 0 ? void 0 : _values_dpia4.riskOwner,
            riskOwnerFunction: (_values_dpia5 = values.dpia) === null || _values_dpia5 === void 0 ? void 0 : _values_dpia5.riskOwnerFunction,
            noDpiaReasons: values.dpia.noDpiaReasons || []
        }
    };
};
var useProcessSearch = function() {
    _s();
    var _useDebouncedState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useDebouncedState"])('', 200), 2), processSearch = _useDebouncedState[0], setProcessSearch = _useDebouncedState[1];
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]), 2), processSearchResult = _useState[0], setProcessSearchResult = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), loading = _useState1[0], setLoading = _useState1[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useProcessSearch.useEffect": function() {
            ;
            ({
                "useProcessSearch.useEffect": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
                        "useProcessSearch.useEffect": function() {
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                                "useProcessSearch.useEffect": function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            if (!(processSearch && processSearch.length > 2)) return [
                                                3,
                                                2
                                            ];
                                            setLoading(true);
                                            return [
                                                4,
                                                searchProcess(processSearch)
                                            ];
                                        case 1:
                                            setProcessSearchResult.apply(void 0, [
                                                _state.sent().content
                                            ]);
                                            setLoading(false);
                                            return [
                                                3,
                                                3
                                            ];
                                        case 2:
                                            setProcessSearchResult([]);
                                            _state.label = 3;
                                        case 3:
                                            return [
                                                2
                                            ];
                                    }
                                }
                            }["useProcessSearch.useEffect"]);
                        }
                    }["useProcessSearch.useEffect"])();
                }
            })["useProcessSearch.useEffect"]();
        }
    }["useProcessSearch.useEffect"], [
        processSearch
    ]);
    return [
        processSearchResult,
        setProcessSearch,
        loading
    ];
};
_s(useProcessSearch, "MzVIX+fviR0FKt++frF4Ifxnsqs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useDebouncedState"]
    ];
});
var searchProcessOptions = function(searchParam) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var behandlinger;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!(searchParam && searchParam.length > 2)) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        searchProcess(searchParam)
                    ];
                case 1:
                    behandlinger = _state.sent().content;
                    if (behandlinger && behandlinger.length) {
                        return [
                            2,
                            behandlinger.map(function(behandling) {
                                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
                                    value: behandling.id,
                                    label: 'B' + behandling.number + ' ' + behandling.purposes[0].shortName + ': ' + behandling.name
                                }, behandling);
                            })
                        ];
                    }
                    _state.label = 2;
                case 2:
                    return [
                        2,
                        []
                    ];
            }
        });
    })();
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/DashboardApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDashboard",
    ()=>getDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
;
;
;
;
;
var getDashboard = function(filter) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/dash?filter=").concat(filter))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/TeamApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAllProductAreas",
    ()=>getAllProductAreas,
    "getAllTeams",
    ()=>getAllTeams,
    "getProductArea",
    ()=>getProductArea,
    "getResourceById",
    ()=>getResourceById,
    "getResourcesByIds",
    ()=>getResourcesByIds,
    "getTeam",
    ()=>getTeam,
    "mapTeamResourceToOption",
    ()=>mapTeamResourceToOption,
    "mapTeamToOption",
    ()=>mapTeamToOption,
    "searchProductArea",
    ()=>searchProductArea,
    "searchResourceByName",
    ()=>searchResourceByName,
    "searchTeam",
    ()=>searchTeam,
    "useAllAreas",
    ()=>useAllAreas,
    "useTeamResourceSearch",
    ()=>useTeamResourceSearch,
    "useTeamResourceSearchOptions",
    ()=>useTeamResourceSearchOptions,
    "useTeamSearch",
    ()=>useTeamSearch,
    "useTeamSearchOptions",
    ()=>useTeamSearchOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread_props.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
;
;
;
;
;
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
;
;
var defaultTeam = function(teamId) {
    return {
        id: teamId,
        name: teamId,
        description: '',
        productAreaId: undefined,
        slackChannel: undefined,
        tags: [],
        members: []
    };
};
var teamPromiseCache = new Map();
var getAllTeams = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var data;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/team"))
                    ];
                case 1:
                    data = _state.sent().data;
                    return [
                        2,
                        data
                    ];
            }
        });
    })();
};
var getTeam = function(teamId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var cached, promise;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            cached = teamPromiseCache.get(teamId);
            if (cached) return [
                2,
                cached
            ];
            promise = function() {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
                    var data, error, _error_response;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    2,
                                    ,
                                    3
                                ]);
                                return [
                                    4,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/team/").concat(teamId))
                                ];
                            case 1:
                                data = _state.sent().data;
                                data.members = data.members.sort(function(a, b) {
                                    return (a.name || '').localeCompare(b.name || '');
                                });
                                return [
                                    2,
                                    data
                                ];
                            case 2:
                                error = _state.sent();
                                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(error) && ((_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.status) === 404) {
                                    return [
                                        2,
                                        defaultTeam(teamId)
                                    ];
                                }
                                teamPromiseCache.delete(teamId);
                                throw error;
                            case 3:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }();
            teamPromiseCache.set(teamId, promise);
            return [
                2,
                promise
            ];
        });
    })();
};
var searchTeam = function(teamSearch) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/team/search/").concat(teamSearch))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getAllProductAreas = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/team/productarea"))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content
                    ];
            }
        });
    })();
};
var getProductArea = function(paId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var data;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/team/productarea/").concat(paId))
                    ];
                case 1:
                    data = _state.sent().data;
                    data.members = data.members.sort(function(a, b) {
                        return (a.name || '').localeCompare(b.name || '');
                    });
                    return [
                        2,
                        data
                    ];
            }
        });
    })();
};
var searchProductArea = function(search) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/team/productarea/search/").concat(search))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getResourceById = function(resourceId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/team/resource/").concat(resourceId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var searchResourceByName = function(resourceName) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/team/resource/search/").concat(resourceName))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getResourcesByIds = function(ids) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var resourcesPromise, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, id, _tmp;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    resourcesPromise = [];
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(_iterator = ids[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            id = _step.value;
                            resourcesPromise.push(getResourceById(id));
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
                    if (!(resourcesPromise.length > 0)) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        Promise.all(resourcesPromise)
                    ];
                case 1:
                    _tmp = _state.sent();
                    return [
                        3,
                        3
                    ];
                case 2:
                    _tmp = [];
                    _state.label = 3;
                case 3:
                    return [
                        2,
                        _tmp
                    ];
            }
        });
    })();
};
var mapTeamResourceToOption = function(teamResource) {
    return {
        value: teamResource.navIdent,
        label: teamResource.fullName
    };
};
var mapTeamToOption = function(team, index) {
    return {
        value: team.id,
        label: team.name,
        index: index
    };
};
var useTeamSearch = function() {
    _s();
    var _useDebouncedState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useDebouncedState"])('', 200), 2), teamSearch = _useDebouncedState[0], setTeamSearch = _useDebouncedState[1];
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]), 2), searchResult = _useState[0], setInfoTypeSearchResult = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), loading = _useState1[0], setLoading = _useState1[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTeamSearch.useEffect": function() {
            var search = {
                "useTeamSearch.useEffect.search": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
                        "useTeamSearch.useEffect.search": function() {
                            var res, options;
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                                "useTeamSearch.useEffect.search": function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            if (!(teamSearch && teamSearch.length > 2)) return [
                                                3,
                                                2
                                            ];
                                            setLoading(true);
                                            return [
                                                4,
                                                searchTeam(teamSearch)
                                            ];
                                        case 1:
                                            res = _state.sent();
                                            options = res.content.map(mapTeamToOption);
                                            setInfoTypeSearchResult(options);
                                            setLoading(false);
                                            _state.label = 2;
                                        case 2:
                                            return [
                                                2
                                            ];
                                    }
                                }
                            }["useTeamSearch.useEffect.search"]);
                        }
                    }["useTeamSearch.useEffect.search"])();
                }
            }["useTeamSearch.useEffect.search"];
            search();
        }
    }["useTeamSearch.useEffect"], [
        teamSearch
    ]);
    return [
        searchResult,
        setTeamSearch,
        loading
    ];
};
_s(useTeamSearch, "yqEc1W0RmkOpizINQcmeSMJQfoE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useDebouncedState"]
    ];
});
var useTeamSearchOptions = function(searchParam) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var teams, searchResult;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!(searchParam && searchParam.length > 2)) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        searchTeam(searchParam)
                    ];
                case 1:
                    teams = _state.sent().content;
                    searchResult = teams.map(function(team) {
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, team), {
                            value: team.id,
                            label: team.name
                        });
                    });
                    return [
                        2,
                        searchResult
                    ];
                case 2:
                    return [
                        2,
                        []
                    ];
            }
        });
    })();
};
var useTeamResourceSearchOptions = function(searchParam) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var teams;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!(searchParam && searchParam.length > 2)) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        searchResourceByName(searchParam)
                    ];
                case 1:
                    teams = _state.sent().content;
                    return [
                        2,
                        teams.map(mapTeamResourceToOption)
                    ];
                case 2:
                    return [
                        2,
                        []
                    ];
            }
        });
    })();
};
var useTeamResourceSearch = function() {
    _s1();
    var _useDebouncedState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useDebouncedState"])('', 200), 2), teamResourceSearch = _useDebouncedState[0], setTeamResourceSearch = _useDebouncedState[1];
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]), 2), searchResult = _useState[0], setInfoTypeSearchResult = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), loading = _useState1[0], setLoading = _useState1[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTeamResourceSearch.useEffect": function() {
            var search = {
                "useTeamResourceSearch.useEffect.search": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
                        "useTeamResourceSearch.useEffect.search": function() {
                            var res, options;
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                                "useTeamResourceSearch.useEffect.search": function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            if (!(teamResourceSearch && teamResourceSearch.length > 2)) return [
                                                3,
                                                2
                                            ];
                                            setLoading(true);
                                            return [
                                                4,
                                                searchResourceByName(teamResourceSearch)
                                            ];
                                        case 1:
                                            res = _state.sent();
                                            options = res.content.map(mapTeamResourceToOption);
                                            setInfoTypeSearchResult(options);
                                            setLoading(false);
                                            _state.label = 2;
                                        case 2:
                                            return [
                                                2
                                            ];
                                    }
                                }
                            }["useTeamResourceSearch.useEffect.search"]);
                        }
                    }["useTeamResourceSearch.useEffect.search"])();
                }
            }["useTeamResourceSearch.useEffect.search"];
            search();
        }
    }["useTeamResourceSearch.useEffect"], [
        teamResourceSearch
    ]);
    return [
        searchResult,
        setTeamResourceSearch,
        loading
    ];
};
_s1(useTeamResourceSearch, "KqCm6WuMfaTgkarcPik2qSHRHq0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useDebouncedState"]
    ];
});
var useAllAreas = function() {
    _s2();
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]), 2), areas = _useState[0], setAreas = _useState[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAllAreas.useEffect": function() {
            ;
            ({
                "useAllAreas.useEffect": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
                        "useAllAreas.useEffect": function() {
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                                "useAllAreas.useEffect": function(_state) {
                                    return [
                                        2,
                                        getAllProductAreas().then(setAreas)
                                    ];
                                }
                            }["useAllAreas.useEffect"]);
                        }
                    }["useAllAreas.useEffect"])();
                }
            })["useAllAreas.useEffect"]();
        }
    }["useAllAreas.useEffect"], []);
    return areas;
};
_s2(useAllAreas, "5bJDOeewJsQsIFKkx4L+fR7UODE=");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/TermApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getTerm",
    ()=>getTerm,
    "mapTermToOption",
    ()=>mapTermToOption,
    "searchTerm",
    ()=>searchTerm,
    "useTermSearch",
    ()=>useTermSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
;
;
;
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
var getTerm = function(termId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/term/").concat(termId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var searchTerm = function(termSearch) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/term/search/").concat(termSearch))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var mapTermToOption = function(term) {
    return {
        value: term.id,
        label: term.name + ' - ' + term.description
    };
};
var useTermSearch = function() {
    _s();
    var _useDebouncedState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useDebouncedState"])('', 200), 2), termSearch = _useDebouncedState[0], setTermSearch = _useDebouncedState[1];
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]), 2), searchResult = _useState[0], setInfoTypeSearchResult = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), loading = _useState1[0], setLoading = _useState1[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useTermSearch.useEffect": function() {
            var search = {
                "useTermSearch.useEffect.search": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
                        "useTermSearch.useEffect.search": function() {
                            var res, options;
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                                "useTermSearch.useEffect.search": function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            if (!(termSearch && termSearch.length > 2)) return [
                                                3,
                                                2
                                            ];
                                            setLoading(true);
                                            return [
                                                4,
                                                searchTerm(termSearch)
                                            ];
                                        case 1:
                                            res = _state.sent();
                                            options = res.content.map(mapTermToOption);
                                            setInfoTypeSearchResult(options);
                                            setLoading(false);
                                            _state.label = 2;
                                        case 2:
                                            return [
                                                2
                                            ];
                                    }
                                }
                            }["useTermSearch.useEffect.search"]);
                        }
                    }["useTermSearch.useEffect.search"])();
                }
            }["useTermSearch.useEffect.search"];
            search();
        }
    }["useTermSearch.useEffect"], [
        termSearch
    ]);
    return [
        searchResult,
        setTermSearch,
        loading
    ];
};
_s(useTermSearch, "Z/2URWAGUeuzWzvXzTLlLIxBE+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useDebouncedState"]
    ];
});
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/GetAllApi.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAll",
    ()=>getAll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_to_consumable_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$CodelistApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/CodelistApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$UserApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/UserApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DisclosureApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/DisclosureApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DocumentApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/DocumentApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$InfoTypeApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/InfoTypeApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/PolicyApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$ProcessApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/ProcessApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DashboardApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/DashboardApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TeamApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/TeamApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TermApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/TermApi.ts [client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
var getAll = function(fetcher) {
    return function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
            var PAGE_SIZE, firstPage, all, currentPage, _, _1;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                switch(_state.label){
                    case 0:
                        PAGE_SIZE = 100;
                        return [
                            4,
                            fetcher(0, PAGE_SIZE)
                        ];
                    case 1:
                        firstPage = _state.sent();
                        if (!(firstPage.pages < 2)) return [
                            3,
                            2
                        ];
                        return [
                            2,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(firstPage.content)
                        ];
                    case 2:
                        all = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(firstPage.content);
                        currentPage = 1;
                        _state.label = 3;
                    case 3:
                        if (!(currentPage < firstPage.pages)) return [
                            3,
                            6
                        ];
                        _1 = (_ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(all)).concat;
                        return [
                            4,
                            fetcher(currentPage, PAGE_SIZE)
                        ];
                    case 4:
                        all = _1.apply(_, [
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"].apply(void 0, [
                                _state.sent().content
                            ])
                        ]);
                        _state.label = 5;
                    case 5:
                        currentPage++;
                        return [
                            3,
                            3
                        ];
                    case 6:
                        return [
                            2,
                            all
                        ];
                    case 7:
                        return [
                            2
                        ];
                }
            });
        })();
    };
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/NomApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAllNomAvdelinger",
    ()=>getAllNomAvdelinger,
    "getAllNomFylker",
    ()=>getAllNomFylker,
    "getAvdelingByNomId",
    ()=>getAvdelingByNomId,
    "getAvdelingOptions",
    ()=>getAvdelingOptions,
    "getAvdelingSearchItem",
    ()=>getAvdelingSearchItem,
    "getByNomId",
    ()=>getByNomId,
    "getFylkerOptions",
    ()=>getFylkerOptions,
    "getSeksjonOptions",
    ()=>getSeksjonOptions,
    "getSeksjonerForNomAvdeling",
    ()=>getSeksjonerForNomAvdeling,
    "searchNavKontorByName",
    ()=>searchNavKontorByName,
    "searchNavKontorOptions",
    ()=>searchNavKontorOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
;
;
;
;
;
var getAllNomAvdelinger = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/nom/avdelinger"))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data.content
                    ];
            }
        });
    })();
};
var getSeksjonerForNomAvdeling = function(avdelingId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/nom/seksjon/avdeling/").concat(avdelingId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getAvdelingByNomId = function(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/nom/avdeling/").concat(id))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getByNomId = function(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/nom/").concat(id))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getAllNomFylker = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/nom/fylker"))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var searchNavKontorByName = function(searchTerm) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/nom/nav-kontor/").concat(searchTerm))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getAvdelingOptions = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var avdelinger;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        getAllNomAvdelinger()
                    ];
                case 1:
                    avdelinger = _state.sent();
                    if (avdelinger && avdelinger.length) {
                        return [
                            2,
                            avdelinger.map(function(avdeling) {
                                return {
                                    value: avdeling.id,
                                    label: avdeling.navn
                                };
                            }).sort(function(a, b) {
                                return a.label.localeCompare(b.label);
                            })
                        ];
                    }
                    return [
                        2,
                        []
                    ];
            }
        });
    })();
};
var getSeksjonOptions = function(avdelingId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var seksjoner;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        getSeksjonerForNomAvdeling(avdelingId)
                    ];
                case 1:
                    seksjoner = _state.sent();
                    if (seksjoner && seksjoner.length) {
                        return [
                            2,
                            seksjoner.map(function(seksjon) {
                                return {
                                    value: seksjon.id,
                                    label: seksjon.navn
                                };
                            }).sort(function(a, b) {
                                return a.label.localeCompare(b.label);
                            })
                        ];
                    }
                    return [
                        2,
                        []
                    ];
            }
        });
    })();
};
var getFylkerOptions = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var fylker;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        getAllNomFylker()
                    ];
                case 1:
                    fylker = _state.sent();
                    if (fylker && fylker.length) {
                        return [
                            2,
                            fylker.map(function(fylke) {
                                return {
                                    value: fylke.id,
                                    label: fylke.navn
                                };
                            }).sort(function(a, b) {
                                return a.label.localeCompare(b.label);
                            })
                        ];
                    }
                    return [
                        2,
                        []
                    ];
            }
        });
    })();
};
var getAvdelingSearchItem = function(search, list, typeName, backgroundColor) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var avdelinger;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        getAllNomAvdelinger()
                    ];
                case 1:
                    avdelinger = _state.sent();
                    if (avdelinger && avdelinger.length) {
                        return [
                            2,
                            avdelinger.filter(function(avdeling) {
                                return avdeling.navn.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                            }).map(function(avdeling) {
                                return {
                                    id: avdeling.id,
                                    sortKey: avdeling.navn,
                                    label: avdeling.navn,
                                    type: list,
                                    typeName: typeName,
                                    tagColor: backgroundColor || ''
                                };
                            })
                        ];
                    } else {
                        return [
                            2,
                            []
                        ];
                    }
                    //TURBOPACK unreachable
                    ;
            }
        });
    })();
};
var searchNavKontorOptions = function(searchParam) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var navKontorer;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!(searchParam && searchParam.length > 2)) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        searchNavKontorByName(searchParam)
                    ];
                case 1:
                    navKontorer = _state.sent();
                    if (navKontorer && navKontorer.length) {
                        return [
                            2,
                            navKontorer.map(function(navKontor) {
                                return {
                                    value: navKontor.id,
                                    label: navKontor.navn
                                };
                            })
                        ];
                    }
                    _state.label = 2;
                case 2:
                    return [
                        2,
                        []
                    ];
            }
        });
    })();
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/service/Codelist.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ARTICLE_6_PREFIX",
    ()=>ARTICLE_6_PREFIX,
    "ARTICLE_9_PREFIX",
    ()=>ARTICLE_9_PREFIX,
    "CodelistService",
    ()=>CodelistService,
    "DESCRIPTION_GDPR_ARTICLES",
    ()=>DESCRIPTION_GDPR_ARTICLES,
    "EListName",
    ()=>EListName,
    "ESensitivityLevel",
    ()=>ESensitivityLevel,
    "NATIONAL_LAW_GDPR_ARTICLES",
    ()=>NATIONAL_LAW_GDPR_ARTICLES
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$GetAllApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/api/GetAllApi.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$CodelistApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/CodelistApi.ts [client] (ecmascript)");
;
;
;
;
var _s = __turbopack_context__.k.signature();
;
;
var EListName = /*#__PURE__*/ function(EListName) {
    EListName["PURPOSE"] = "PURPOSE";
    EListName["CATEGORY"] = "CATEGORY";
    EListName["THIRD_PARTY"] = "THIRD_PARTY";
    EListName["SENSITIVITY"] = "SENSITIVITY";
    EListName["NATIONAL_LAW"] = "NATIONAL_LAW";
    EListName["SUBJECT_CATEGORY"] = "SUBJECT_CATEGORY";
    EListName["GDPR_ARTICLE"] = "GDPR_ARTICLE";
    EListName["DEPARTMENT"] = "DEPARTMENT";
    EListName["SUB_DEPARTMENT"] = "SUB_DEPARTMENT";
    EListName["SYSTEM"] = "SYSTEM";
    EListName["TRANSFER_GROUNDS_OUTSIDE_EU"] = "TRANSFER_GROUNDS_OUTSIDE_EU";
    EListName["DATA_PROCESSOR"] = "DATA_PROCESSOR";
    EListName["DATA_ACCESS_CLASS"] = "DATA_ACCESS_CLASS";
    return EListName;
}({});
var ESensitivityLevel = /*#__PURE__*/ function(ESensitivityLevel) {
    ESensitivityLevel["ART6"] = "POL";
    ESensitivityLevel["ART9"] = "SAERLIGE";
    ESensitivityLevel["ART10"] = "STRAFF";
    return ESensitivityLevel;
}({});
var ARTICLE_6_PREFIX = 'ART6';
var ARTICLE_9_PREFIX = 'ART9';
var NATIONAL_LAW_GDPR_ARTICLES = [
    'ART61C',
    'ART61E'
];
var DESCRIPTION_GDPR_ARTICLES = [
    'ART61C',
    'ART61E',
    'ART61F'
];
var LOVDATA_FORSKRIFT_PREFIX = 'FORSKRIFT';
var DEPARTMENTS_WITH_SUB_DEPARTMENTS = [
    'OESA',
    'YTA',
    'ATA'
];
var CodelistService = function() {
    _s();
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(), 2), lists = _useState[0], setLists = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(), 2), error = _useState1[0], setError = _useState1[1];
    var _useState2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(), 2), countries = _useState2[0], setCountries = _useState2[1];
    var _useState3 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(), 2), countriesOutsideEUEEA = _useState3[0], setCountriesOutsideEUEEA = _useState3[1];
    var handleGetCodelistResponse = function(response) {
        if ((typeof response === "undefined" ? "undefined" : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(response)) === 'object' && response !== null) {
            setLists(response);
        } else {
            setError(response);
        }
    };
    var fetchData = function(refresh) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
            var codeListPromise, allCountriesPromise, countriesPromise;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!(lists === undefined && countries === undefined && countriesOutsideEUEEA === undefined || refresh)) return [
                            3,
                            5
                        ];
                        return [
                            4,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$CodelistApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getAllCodelists"])(refresh).then(handleGetCodelistResponse).catch(function(error) {
                                return setError(error.message);
                            })
                        ];
                    case 1:
                        codeListPromise = _state.sent();
                        return [
                            4,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$CodelistApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getAllCountries"])().then(function(codes) {
                                return setCountries(codes);
                            }).catch(function(error) {
                                return setError(error.message);
                            })
                        ];
                    case 2:
                        allCountriesPromise = _state.sent();
                        return [
                            4,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$CodelistApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getCountriesOutsideEUEEA"])().then(function(codes) {
                                return setCountriesOutsideEUEEA(codes);
                            }).catch(function(error) {
                                return setError(error.message);
                            })
                        ];
                    case 3:
                        countriesPromise = _state.sent();
                        return [
                            4,
                            Promise.all([
                                codeListPromise,
                                allCountriesPromise,
                                countriesPromise
                            ])
                        ];
                    case 4:
                        _state.sent();
                        _state.label = 5;
                    case 5:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CodelistService.useEffect": function() {
            ;
            ({
                "CodelistService.useEffect": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
                        "CodelistService.useEffect": function() {
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                                "CodelistService.useEffect": function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                fetchData()
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                }
                            }["CodelistService.useEffect"]);
                        }
                    }["CodelistService.useEffect"])();
                }
            })["CodelistService.useEffect"]();
        }
    }["CodelistService.useEffect"], []);
    var isLoaded = function() {
        return lists || error;
    };
    var getAllCountryCodes = function() {
        return countries || [];
    };
    var getCountryCodesOutsideEu = function() {
        return countriesOutsideEUEEA || [];
    };
    var countryName = function(code) {
        var _getAllCountryCodes_find;
        return ((_getAllCountryCodes_find = getAllCountryCodes().find(function(country) {
            return country.code === code;
        })) === null || _getAllCountryCodes_find === void 0 ? void 0 : _getAllCountryCodes_find.description) || code;
    };
    var getCodes = function(list) {
        return lists && lists.codelist[list] ? lists.codelist[list].sort(function(c1, c2) {
            return c1.shortName.localeCompare(c2.shortName);
        }) : [];
    };
    var getCode = function(list, codeName) {
        return getCodes(list).find(function(code) {
            return code.code === codeName;
        });
    };
    var valid = function(list, codeName) {
        return !!codeName && !!getCode(list, codeName);
    };
    var getShortnameForCode = function(code) {
        return getShortname(code.list, code.code);
    };
    var getShortnameForCodes = function(codes) {
        return codes.map(function(code) {
            return getShortname(code.list, code.code);
        }).join(', ');
    };
    var getShortname = function(list, codeName) {
        var code = getCode(list, codeName);
        return code ? code.shortName : codeName;
    };
    var getShortnames = function(list, codeNames) {
        return codeNames.map(function(codeName) {
            return getShortname(list, codeName);
        });
    };
    var getDescription = function(list, codeName) {
        var code = getCode(list, codeName);
        return code ? code.description : codeName;
    };
    var getParsedOptions = function(listName) {
        return getCodes(listName).map(function(code) {
            return {
                id: code.code,
                label: code.shortName
            };
        });
    };
    var getParsedOptionsForList = function(listName, selected) {
        return selected.map(function(code) {
            return {
                id: code,
                label: getShortname(listName, code)
            };
        });
    };
    var getParsedOptionsFilterOutSelected = function(listName, currentSelected) {
        var parsedOptions = getParsedOptions(listName);
        return !currentSelected ? parsedOptions : parsedOptions.filter(function(option) {
            return currentSelected.includes(option.id) ? null : option.id;
        });
    };
    var requiresNationalLaw = function(gdprCode) {
        return gdprCode && NATIONAL_LAW_GDPR_ARTICLES.indexOf(gdprCode) >= 0;
    };
    var requiresDescription = function(gdprCode) {
        return gdprCode && DESCRIPTION_GDPR_ARTICLES.indexOf(gdprCode) >= 0;
    };
    var requiresArt9 = function(sensitivityCode) {
        return sensitivityCode === "SAERLIGE";
    };
    var isArt6 = function(gdprCode) {
        return gdprCode && gdprCode.startsWith(ARTICLE_6_PREFIX);
    };
    var isArt9 = function(gdprCode) {
        return gdprCode && gdprCode.startsWith(ARTICLE_9_PREFIX);
    };
    var isForskrift = function(nationalLawCode) {
        return nationalLawCode && nationalLawCode.includes(LOVDATA_FORSKRIFT_PREFIX);
    };
    var showSubDepartment = function(departmentCode) {
        return departmentCode && DEPARTMENTS_WITH_SUB_DEPARTMENTS.indexOf(departmentCode) >= 0;
    };
    var makeIdLabelForAllCodeLists = function() {
        return Object.keys(EListName).map(function(key) {
            return {
                id: key,
                label: key
            };
        });
    };
    var utils = {
        fetchData: fetchData,
        isLoaded: isLoaded,
        getCodes: getCodes,
        getCode: getCode,
        valid: valid,
        getShortnameForCode: getShortnameForCode,
        getShortnameForCodes: getShortnameForCodes,
        getShortnames: getShortnames,
        getShortname: getShortname,
        getDescription: getDescription,
        getParsedOptions: getParsedOptions,
        getParsedOptionsForList: getParsedOptionsForList,
        getParsedOptionsFilterOutSelected: getParsedOptionsFilterOutSelected,
        isForskrift: isForskrift,
        countryName: countryName,
        getCountryCodesOutsideEu: getCountryCodesOutsideEu,
        requiresNationalLaw: requiresNationalLaw,
        requiresDescription: requiresDescription,
        requiresArt9: requiresArt9,
        isArt6: isArt6,
        isArt9: isArt9,
        showSubDepartment: showSubDepartment,
        makeIdLabelForAllCodeLists: makeIdLabelForAllCodeLists
    };
    return [
        utils,
        lists,
        setLists
    ];
};
_s(CodelistService, "5r+DMuxAM0WYABf3yI8E5KFvmRM=");
_c = CodelistService;
var _c;
__turbopack_context__.k.register(_c, "CodelistService");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/util/sort.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prefixBiasedSort",
    ()=>prefixBiasedSort
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
;
var start = function(prefix) {
    return function(text) {
        var startIndex = text.indexOf(prefix.toLowerCase());
        return startIndex < 0 ? Number.MAX_VALUE : startIndex;
    };
};
var prefixBiasedSort = function(prefix, a, b) {
    var comp = start(prefix);
    var aLower = a.toLowerCase();
    var bLower = b.toLowerCase();
    var c1 = comp(aLower) - comp(bLower);
    return c1 === 0 ? aLower.localeCompare(bLower, 'nb') : c1;
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/AsyncSelectComponents.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomSearchSelect",
    ()=>CustomSearchSelect,
    "DropdownIndicator",
    ()=>DropdownIndicator,
    "default",
    ()=>__TURBOPACK__default__export__,
    "noOptionMessage",
    ()=>noOptionMessage,
    "selectOverrides",
    ()=>selectOverrides,
    "selectOverridesError",
    ()=>selectOverridesError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread_props.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$MagnifyingGlass$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MagnifyingGlassIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/MagnifyingGlass.js [client] (ecmascript) <export default as MagnifyingGlassIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$index$2d$641ee5b8$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__c__as__components$3e$__ = __turbopack_context__.i("[project]/node_modules/react-select/dist/index-641ee5b8.esm.js [client] (ecmascript) <export c as components>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$async$2f$dist$2f$react$2d$select$2d$async$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-select/async/dist/react-select-async.esm.js [client] (ecmascript) <locals>");
;
;
;
;
var _this = ("TURBOPACK compile-time value", void 0);
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
var CustomSearchSelect = function(props) {
    _s();
    var ariaLabel = props.ariaLabel, placeholder = props.placeholder, inputId = props.inputId, instanceId = props.instanceId, hasError = props.hasError, onChange = props.onChange, loadOptions = props.loadOptions;
    var wrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null), 2), dialogPortalTarget = _useState[0], setDialogPortalTarget = _useState[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomSearchSelect.useEffect": function() {
            var wrapper = wrapperRef.current;
            if (!wrapper) return;
            var closestDialog = wrapper.closest('dialog') || wrapper.closest('[role="dialog"]');
            setDialogPortalTarget(closestDialog);
        }
    }["CustomSearchSelect.useEffect"], []);
    var menuPortalTarget = dialogPortalTarget !== null && dialogPortalTarget !== void 0 ? dialogPortalTarget : typeof document !== 'undefined' ? document.body : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: wrapperRef,
        className: "w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$async$2f$dist$2f$react$2d$select$2d$async$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
            className: "w-full",
            "aria-label": ariaLabel,
            inputId: inputId,
            instanceId: instanceId,
            placeholder: placeholder,
            components: {
                DropdownIndicator: DropdownIndicator
            },
            noOptionsMessage: function(param) {
                var inputValue = param.inputValue;
                return noOptionMessage(inputValue);
            },
            controlShouldRenderValue: false,
            loadingMessage: function() {
                return 'Søker...';
            },
            isClearable: false,
            loadOptions: loadOptions,
            onChange: onChange,
            menuPortalTarget: menuPortalTarget,
            menuPosition: menuPortalTarget ? 'fixed' : 'absolute',
            styles: hasError ? selectOverridesError : selectOverrides
        }, void 0, false, {
            fileName: "[project]/src/components/common/AsyncSelectComponents.tsx",
            lineNumber: 46,
            columnNumber: 7
        }, _this)
    }, void 0, false, {
        fileName: "[project]/src/components/common/AsyncSelectComponents.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, _this);
};
_s(CustomSearchSelect, "e4VBZU+MeOlCB7gI3zYTiDk6Ulg=");
_c = CustomSearchSelect;
var DropdownIndicator = function(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$index$2d$641ee5b8$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__c__as__components$3e$__["components"].DropdownIndicator, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, props), {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$MagnifyingGlass$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MagnifyingGlassIcon$3e$__["MagnifyingGlassIcon"], {
            title: "Søk",
            "aria-label": "Søk"
        }, void 0, false, {
            fileName: "[project]/src/components/common/AsyncSelectComponents.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, _this)
    }), void 0, false, {
        fileName: "[project]/src/components/common/AsyncSelectComponents.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, _this);
};
_c1 = DropdownIndicator;
var noOptionMessage = function(inputValue) {
    if (inputValue.length < 3 && inputValue.length > 0) {
        return 'Skriv minst 3 tegn for å søke';
    } else if (inputValue.length >= 3) {
        return 'Fant ingen resultater for "'.concat(inputValue, '"');
    } else {
        return '';
    }
};
var selectOverrides = {
    control: function(base) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, base), {
            cursor: 'text',
            height: '3rem',
            color: 'var(--ax-text-neutral)',
            backgroundColor: 'var(--ax-bg-input)',
            border: '1px solid var(--ax-border-neutral)',
            borderColor: 'var(--ax-border-neutral)',
            borderRadius: 'var(--ax-radius-8)',
            ':focus-within': {
                borderColor: 'var(--ax-border-strong)',
                outline: '3px solid var(--ax-border-focus)',
                outlineOffset: '3px'
            },
            ':focus': {
                borderColor: 'var(--ax-border-strong)'
            },
            ':hover': {
                borderColor: 'var(--ax-border-strong)'
            }
        });
    },
    menu: function(base) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, base), {
            backgroundColor: 'var(--ax-bg-raised)',
            border: '1px solid var(--ax-border-subtleA)',
            boxShadow: 'var(--ax-shadow-dialog)',
            marginTop: '0.25rem',
            borderRadius: 'var(--ax-radius-12)',
            overflow: 'hidden',
            zIndex: 9999
        });
    },
    menuPortal: function(base) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, base), {
            zIndex: 9999
        });
    },
    menuList: function(base) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, base), {
            padding: 0
        });
    },
    option: function(base, state) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, base), {
            color: 'var(--ax-text-neutral)',
            backgroundColor: state.isFocused ? 'var(--ax-bg-moderate-hoverA)' : state.isSelected ? 'var(--ax-bg-moderate-pressedA)' : 'var(--ax-bg-raised)',
            ':active': {
                backgroundColor: 'var(--ax-bg-moderate-pressedA)'
            }
        });
    },
    input: function(base) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, base), {
            color: 'var(--ax-text-neutral)'
        });
    },
    placeholder: function(base) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, base), {
            color: 'var(--ax-text-subtle)'
        });
    },
    singleValue: function(base) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, base), {
            color: 'var(--ax-text-neutral)'
        });
    },
    dropdownIndicator: function(base) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, base), {
            color: 'var(--ax-text-neutral)',
            ':hover': {
                color: 'var(--ax-text-neutral)'
            }
        });
    },
    indicatorSeparator: function() {
        return {
            display: 'none'
        };
    }
};
var selectOverridesError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, selectOverrides), {
    control: function(base) {
        var ctrl = selectOverrides.control(base);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, ctrl), {
            border: '1px solid var(--ax-border-danger)',
            borderColor: 'var(--ax-border-danger)',
            ':focus-within': (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, ctrl[':focus-within']), {
                borderColor: 'var(--ax-border-danger)'
            }),
            ':focus': {
                borderColor: 'var(--ax-border-danger)'
            },
            ':hover': {
                borderColor: 'var(--ax-border-danger)'
            }
        });
    }
});
const __TURBOPACK__default__export__ = CustomSearchSelect;
var _c, _c1;
__turbopack_context__.k.register(_c, "CustomSearchSelect");
__turbopack_context__.k.register(_c1, "DropdownIndicator");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/Button/CustomButton.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/button/Button.js [client] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/tooltip/Tooltip.js [client] (ecmascript) <export default as Tooltip>");
;
var _this = ("TURBOPACK compile-time value", void 0);
;
;
var Tooltip = function(props) {
    return props.tooltip ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__["Tooltip"], {
        content: props.tooltip,
        children: props.children
    }, void 0, false, {
        fileName: "[project]/src/components/common/Button/CustomButton.tsx",
        lineNumber: 36,
        columnNumber: 19
    }, _this) : props.children;
};
_c = Tooltip;
var Button = function(props) {
    var _props_icon;
    var baseuiKind = props.kind === 'outline' ? 'secondary' : props.kind;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "inline ".concat(props.marginLeft ? 'ml-2.5' : '', " ").concat(props.marginRight ? 'mr-2.5' : '')
            }, void 0, false, {
                fileName: "[project]/src/components/common/Button/CustomButton.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tooltip, {
                tooltip: props.tooltip,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                    variant: baseuiKind,
                    size: props.size,
                    onClick: function() {
                        var _props_onClick;
                        return (_props_onClick = props.onClick) === null || _props_onClick === void 0 ? void 0 : _props_onClick.call(props);
                    },
                    icon: (_props_icon = props.icon) !== null && _props_icon !== void 0 ? _props_icon : props.startEnhancer,
                    disabled: props.disabled,
                    loading: props.loading,
                    type: props.type,
                    "aria-label": props.ariaLabel,
                    children: (props.children || props.iconEnd) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-2",
                        children: [
                            props.children,
                            props.iconEnd
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/common/Button/CustomButton.tsx",
                        lineNumber: 58,
                        columnNumber: 13
                    }, _this)
                }, void 0, false, {
                    fileName: "[project]/src/components/common/Button/CustomButton.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "[project]/src/components/common/Button/CustomButton.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "inline ".concat(props.marginRight ? 'mr-2.5' : '')
            }, void 0, false, {
                fileName: "[project]/src/components/common/Button/CustomButton.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true);
};
_c1 = Button;
const __TURBOPACK__default__export__ = Button;
var _c, _c1;
__turbopack_context__.k.register(_c, "Tooltip");
__turbopack_context__.k.register(_c1, "Button");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/audit/AuditButton.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuditButton",
    ()=>AuditButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$ClockDashed$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockDashedIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/ClockDashed.js [client] (ecmascript) <export default as ClockDashedIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/User.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Button$2f$CustomButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/Button/CustomButton.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/RouteLink.tsx [client] (ecmascript)");
;
var _this = ("TURBOPACK compile-time value", void 0);
;
;
;
;
;
var AuditButton = function(props) {
    var id = props.id, auditId = props.auditId, kind = props.kind, marginLeft = props.marginLeft, marginRight = props.marginRight, children = props.children;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].isAdmin() && null,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].isAdmin() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/admin/audit/".concat(id) + (auditId ? "/".concat(auditId) : ''),
                children: [
                    children && children,
                    ' ',
                    !children && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Button$2f$CustomButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            tooltip: "Versjonering",
                            marginLeft: marginLeft,
                            marginRight: marginRight,
                            size: "xsmall",
                            kind: kind || 'outline',
                            ariaLabel: "Versjonering",
                            startEnhancer: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center leading-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$ClockDashed$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockDashedIcon$3e$__["ClockDashedIcon"], {
                                    "aria-hidden": true,
                                    className: "block"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/audit/AuditButton.tsx",
                                    lineNumber: 43,
                                    columnNumber: 21
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/audit/AuditButton.tsx",
                                lineNumber: 42,
                                columnNumber: 19
                            }, void 0)
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/audit/AuditButton.tsx",
                            lineNumber: 34,
                            columnNumber: 15
                        }, _this)
                    }, void 0, false)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/audit/AuditButton.tsx",
                lineNumber: 30,
                columnNumber: 9
            }, _this)
        ]
    }, void 0, true);
};
_c = AuditButton;
var _c;
__turbopack_context__.k.register(_c, "AuditButton");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/RouteLink.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ObjectLink",
    ()=>ObjectLink,
    "default",
    ()=>__TURBOPACK__default__export__,
    "urlForObject",
    ()=>urlForObject
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread_props.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_without_properties$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_without_properties.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/router.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$link$2f$Link$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/link/Link.js [client] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/Codelist.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$audit$2f$AuditButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/audit/AuditButton.tsx [client] (ecmascript)");
;
;
;
;
var _this = ("TURBOPACK compile-time value", void 0);
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
var RouteLink = function(props) {
    _s();
    var hideUnderline = props.hideUnderline, plain = props.plain, restprops = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_without_properties$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(props, [
        "hideUnderline",
        "plain"
    ]);
    var navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNavigate"])();
    // Treat absolute URLs (https:, mailto:, //example.com, etc.) as external.
    var isExternalHref = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(props.href);
    var className = [
        restprops.className,
        hideUnderline ? 'no-underline' : undefined,
        plain ? 'text-inherit' : undefined
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$link$2f$Link$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
        className: className
    }, restprops), {
        onClick: function(event) {
            var _restprops_onClick;
            (_restprops_onClick = restprops.onClick) === null || _restprops_onClick === void 0 ? void 0 : _restprops_onClick.call(restprops, event);
            if (isExternalHref) return;
            event.preventDefault();
            navigate(props.href);
        }
    }), void 0, false, {
        fileName: "[project]/src/components/common/RouteLink.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, _this);
};
_s(RouteLink, "CzcTeTziyjMsSrAVmHuCCb6+Bfg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNavigate"]
    ];
});
_c = RouteLink;
const __TURBOPACK__default__export__ = RouteLink;
var urlForObject = function(type, id, audit) {
    switch(type){
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].INFORMATION_TYPE:
            return "/informationtype/".concat(id);
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].CATEGORY:
            return "/informationtype?category=".concat(id);
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].POLICY:
            return "/policy/".concat(id);
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].PROCESS:
            return "/process/".concat(id);
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].PROCESSOR:
            return "/processor/".concat(id);
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].DP_PROCESS:
            return "/dpprocess/".concat(id);
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].DISCLOSURE:
            return "/disclosure/".concat(id);
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].DOCUMENT:
            return "/document/".concat(id);
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].CODELIST:
            return "/admin/codelist/".concat(id.substring(0, id.indexOf('-')));
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].GENERIC_STORAGE:
            var _this;
            if (audit && ((_this = audit.data) === null || _this === void 0 ? void 0 : _this.type) === 'SETTINGS') {
                return '/admin/settings';
            }
            return '/';
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].PURPOSE:
            return "/process/purpose/".concat(id);
        case 'team':
            return "/team/".concat(id);
        case 'productarea':
            return "/productarea/".concat(id);
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].DEPARTMENT:
            return "/process/department/".concat(id);
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].SUB_DEPARTMENT:
            return "/process/subdepartment/".concat(id);
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].THIRD_PARTY:
            return "/thirdparty/".concat(id);
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].SYSTEM:
            return "/system/".concat(id);
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].GDPR_ARTICLE:
            return "/process/legal?gdprArticle=".concat(id);
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].NATIONAL_LAW:
            return "/process/legal?nationalLaw=".concat(id);
    }
};
var ObjectLink = function(props) {
    var disable = props.disable, children = props.children, type = props.type, id = props.id, audit = props.audit, hideUnderline = props.hideUnderline, withHistory = props.withHistory;
    var linkClassName = hideUnderline ? 'no-underline' : undefined;
    var link = disable ? children : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RouteLink, {
        href: urlForObject(type, id, audit),
        className: linkClassName,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/common/RouteLink.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, _this);
    return withHistory ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-between w-full items-center",
        children: [
            link,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$audit$2f$AuditButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["AuditButton"], {
                id: id,
                kind: "tertiary"
            }, void 0, false, {
                fileName: "[project]/src/components/common/RouteLink.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/RouteLink.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, _this) : link;
};
_c1 = ObjectLink;
var _c, _c1;
__turbopack_context__.k.register(_c, "RouteLink");
__turbopack_context__.k.register(_c1, "ObjectLink");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/search/components/SmallRadio.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SmallRadio",
    ()=>SmallRadio
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$form$2f$radio$2f$Radio$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/form/radio/Radio.js [client] (ecmascript) <export default as Radio>");
;
var _this = ("TURBOPACK compile-time value", void 0);
;
;
var SmallRadio = function(value, text) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$form$2f$radio$2f$Radio$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Radio$3e$__["Radio"], {
        value: value,
        className: "m-0 ml-2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-xs text-(--ax-text-neutral)",
            children: text
        }, void 0, false, {
            fileName: "[project]/src/components/search/components/SmallRadio.tsx",
            lineNumber: 6,
            columnNumber: 5
        }, _this)
    }, void 0, false, {
        fileName: "[project]/src/components/search/components/SmallRadio.tsx",
        lineNumber: 5,
        columnNumber: 3
    }, _this);
};
_c = SmallRadio;
var _c;
__turbopack_context__.k.register(_c, "SmallRadio");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/search/components/SelectType.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SelectType",
    ()=>SelectType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$form$2f$radio$2f$RadioGroup$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RadioGroup$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/form/radio/RadioGroup.js [client] (ecmascript) <export default as RadioGroup>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/search/components/SmallRadio.tsx [client] (ecmascript)");
;
var _this = ("TURBOPACK compile-time value", void 0);
;
;
;
var SelectType = function(props) {
    var type = props.type, setType = props.setType;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "polly-mainsearch-filter-menu text-sm absolute top-full left-0 mt-1 bg-(--ax-bg-raised) w-fit min-w-[12rem] max-w-[calc(100vw-1rem)] rounded-(--ax-radius-12) border border-solid border-(--ax-border-subtleA) shadow-[0px_0px_6px_3px_rgba(0,0,0,0.08)] z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-3 py-2",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$form$2f$radio$2f$RadioGroup$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RadioGroup$3e$__["RadioGroup"], {
                onChange: function(value) {
                    return setType(value);
                },
                className: "flex flex-col",
                legend: "",
                hideLegend: true,
                value: type,
                children: [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SmallRadio"])('all', 'Alle'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SmallRadio"])('informationType', 'Opplysningstype'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SmallRadio"])('purpose', 'Formål'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SmallRadio"])('process', 'Behandlinger'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SmallRadio"])('dpprocess', 'Nav som databehandler'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SmallRadio"])('team', 'Team'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SmallRadio"])('productarea', 'Område'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SmallRadio"])('department', 'Avdeling'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SmallRadio"])('subDepartment', 'Linja'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SmallRadio"])('thirdParty', 'Ekstern part'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SmallRadio"])('system', 'System'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SmallRadio"])('document', 'Dokument'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SmallRadio"])('nationalLaw', 'Nasjonal lov'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SmallRadio"])('gdprArticle', 'GDPR artikkel')
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/search/components/SelectType.tsx",
                lineNumber: 16,
                columnNumber: 9
            }, _this)
        }, void 0, false, {
            fileName: "[project]/src/components/search/components/SelectType.tsx",
            lineNumber: 15,
            columnNumber: 7
        }, _this)
    }, void 0, false, {
        fileName: "[project]/src/components/search/components/SelectType.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, _this);
};
_c = SelectType;
var _c;
__turbopack_context__.k.register(_c, "SelectType");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/search/MainSearch.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DropdownIndicator",
    ()=>DropdownIndicator,
    "MainSearch",
    ()=>MainSearch,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread_props.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_to_consumable_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/router.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$Filter$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FilterIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/Filter.js [client] (ecmascript) <export default as FilterIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$MagnifyingGlass$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MagnifyingGlassIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/MagnifyingGlass.js [client] (ecmascript) <export default as MagnifyingGlassIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tag$2f$Tag$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/tag/Tag.js [client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$index$2d$641ee5b8$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__c__as__components$3e$__ = __turbopack_context__.i("[project]/node_modules/react-select/dist/index-641ee5b8.esm.js [client] (ecmascript) <export c as components>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$async$2f$dist$2f$react$2d$select$2d$async$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-select/async/dist/react-select-async.esm.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DpProcessApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/DpProcessApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$GetAllApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/api/GetAllApi.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DocumentApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/DocumentApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$InfoTypeApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/InfoTypeApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$ProcessApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/ProcessApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TeamApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/TeamApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$NomApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/NomApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/Codelist.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$sort$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/sort.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/theme.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/AsyncSelectComponents.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Button$2f$CustomButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/Button/CustomButton.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/RouteLink.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SelectType$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/search/components/SelectType.tsx [client] (ecmascript)");
;
;
;
;
;
;
;
var _this = ("TURBOPACK compile-time value", void 0);
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
var mainSearchSelectOverrides = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["selectOverrides"]), {
    control: function(base) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["selectOverrides"].control(base)), {
            backgroundColor: 'var(--ax-bg-default)',
            border: '1px solid #D9DBE0',
            color: 'var(--ax-text-neutral)'
        });
    },
    input: function(base) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["selectOverrides"].input(base)), {
            color: 'var(--ax-text-neutral)',
            caretColor: 'var(--ax-text-neutral)'
        });
    },
    placeholder: function(base) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["selectOverrides"].placeholder(base)), {
            color: 'var(--ax-neutral-1000)'
        });
    },
    singleValue: function(base) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["selectOverrides"].singleValue(base)), {
            color: 'var(--ax-text-neutral)'
        });
    },
    menu: function(base) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["selectOverrides"].menu(base)), {
            backgroundColor: 'var(--ax-bg-raised)',
            zIndex: 2000
        });
    },
    menuList: function(base) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["selectOverrides"].menuList(base)), {
            backgroundColor: 'var(--ax-bg-raised)'
        });
    },
    option: function(base, state) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["selectOverrides"].option(base, state)), {
            backgroundColor: state.isFocused ? 'var(--ax-bg-moderate-hoverA)' : state.isSelected ? 'var(--ax-bg-moderate-pressedA)' : 'var(--ax-bg-raised)'
        });
    }
});
var searchCodelist = function(search, list, typeName, backgroundColor, codelistUtils) {
    return codelistUtils.getCodes(list).filter(function(code) {
        return code.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0;
    }).map(function(code) {
        return {
            id: code.code,
            sortKey: code.shortName,
            label: code.shortName,
            typeName: typeName,
            type: list,
            tagColor: backgroundColor
        };
    });
};
var getCodelistByListnameAndType = function(search, list, typeName, codelistUtils) {
    return codelistUtils.getCodes(list).filter(function(code) {
        return code.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0;
    }).map(function(code) {
        return {
            id: code.code,
            sortKey: code.shortName,
            label: code.shortName,
            type: list,
            typeName: typeName
        };
    });
};
var Option = function(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$index$2d$641ee5b8$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__c__as__components$3e$__["components"].Option, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, props), {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: props.data.label
                }, void 0, false, {
                    fileName: "[project]/src/components/search/MainSearch.tsx",
                    lineNumber: 135,
                    columnNumber: 7
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tag$2f$Tag$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                    size: "small",
                    variant: "info",
                    style: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, props.data.tagColor ? {
                        backgroundColor: props.data.tagColor
                    } : {}), {
                        color: 'var(--ax-text-neutral-contrast)'
                    }),
                    children: props.data.typeName
                }, void 0, false, {
                    fileName: "[project]/src/components/search/MainSearch.tsx",
                    lineNumber: 136,
                    columnNumber: 7
                }, _this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/search/MainSearch.tsx",
            lineNumber: 134,
            columnNumber: 5
        }, _this)
    }), void 0, false, {
        fileName: "[project]/src/components/search/MainSearch.tsx",
        lineNumber: 133,
        columnNumber: 3
    }, _this);
};
_c = Option;
var DropdownIndicator = function(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$dist$2f$index$2d$641ee5b8$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__c__as__components$3e$__["components"].DropdownIndicator, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, props), {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$MagnifyingGlass$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MagnifyingGlassIcon$3e$__["MagnifyingGlassIcon"], {
            title: "Søk",
            "aria-label": "Søk"
        }, void 0, false, {
            fileName: "[project]/src/components/search/MainSearch.tsx",
            lineNumber: 152,
            columnNumber: 5
        }, _this)
    }), void 0, false, {
        fileName: "[project]/src/components/search/MainSearch.tsx",
        lineNumber: 151,
        columnNumber: 3
    }, _this);
};
_c1 = DropdownIndicator;
var MainSearch = function() {
    _s();
    var _CodelistService = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["CodelistService"])(), 1), codelistUtils = _CodelistService[0];
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), filter = _useState[0], setFilter = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('all'), 2), type = _useState1[0], setType = _useState1[1];
    var navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNavigate"])();
    var useMainSearchOption = function(searchParam) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
            var searchResult, results, searches, compareFn, add;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!(searchParam && searchParam.length > 2)) return [
                            3,
                            12
                        ];
                        if (!(type === 'purpose')) return [
                            3,
                            1
                        ];
                        return [
                            2,
                            getCodelistByListnameAndType(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].PURPOSE, 'Formål', codelistUtils)
                        ];
                    case 1:
                        if (!(type === 'department')) return [
                            3,
                            3
                        ];
                        return [
                            4,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$NomApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getAvdelingSearchItem"])(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].DEPARTMENT, 'Avdeling')
                        ];
                    case 2:
                        return [
                            2,
                            _state.sent()
                        ];
                    case 3:
                        if (!(type === 'subDepartment')) return [
                            3,
                            4
                        ];
                        return [
                            2,
                            getCodelistByListnameAndType(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].SUB_DEPARTMENT, 'Linja', codelistUtils)
                        ];
                    case 4:
                        if (!(type === 'thirdParty')) return [
                            3,
                            5
                        ];
                        return [
                            2,
                            getCodelistByListnameAndType(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].THIRD_PARTY, 'Ekstern part', codelistUtils)
                        ];
                    case 5:
                        if (!(type === 'system')) return [
                            3,
                            6
                        ];
                        return [
                            2,
                            getCodelistByListnameAndType(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].SYSTEM, 'System', codelistUtils)
                        ];
                    case 6:
                        if (!(type === 'nationalLaw')) return [
                            3,
                            7
                        ];
                        return [
                            2,
                            getCodelistByListnameAndType(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].NATIONAL_LAW, 'Nasjonal lov', codelistUtils)
                        ];
                    case 7:
                        if (!(type === 'gdprArticle')) return [
                            3,
                            8
                        ];
                        return [
                            2,
                            getCodelistByListnameAndType(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].GDPR_ARTICLE, 'GDPR artikkel', codelistUtils)
                        ];
                    case 8:
                        searchResult = [];
                        results = [];
                        searches = [];
                        compareFn = function(a, b) {
                            if (a.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].PROCESS && a.number === parseInt(searchParam)) return -1;
                            else if (b.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].PROCESS && b.number === parseInt(searchParam)) return 1;
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$sort$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["prefixBiasedSort"])(searchParam, a.sortKey, b.sortKey);
                        };
                        add = function(items) {
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
                                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                                    results = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(results).concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(items)).sort(compareFn);
                                    searchResult = results;
                                    return [
                                        2
                                    ];
                                });
                            })();
                        };
                        if (!(type === 'all')) return [
                            3,
                            10
                        ];
                        add(searchCodelist(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].PURPOSE, 'Behandlingsaktivitet', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchResultColor"].purposeBackground, codelistUtils));
                        return [
                            4,
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$NomApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getAvdelingSearchItem"])(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].DEPARTMENT, 'Avdeling', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchResultColor"].departmentBackground)
                        ];
                    case 9:
                        add.apply(void 0, [
                            _state.sent()
                        ]);
                        add(searchCodelist(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].SUB_DEPARTMENT, 'Linja', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchResultColor"].subDepartmentBackground, codelistUtils));
                        add(searchCodelist(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].THIRD_PARTY, 'Ekstern part', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchResultColor"].thirdPartyBackground, codelistUtils));
                        add(searchCodelist(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].SYSTEM, 'System', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchResultColor"].systemBackground, codelistUtils));
                        add(searchCodelist(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].NATIONAL_LAW, 'Nasjonal lov', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchResultColor"].nationalLawBackground, codelistUtils));
                        add(searchCodelist(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].GDPR_ARTICLE, 'GDPR artikkel', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchResultColor"].gdprBackground, codelistUtils));
                        _state.label = 10;
                    case 10:
                        if (type === 'all' || type === 'informationType') {
                            searches.push(function() {
                                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
                                    var infoTypesRes;
                                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                return [
                                                    4,
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$InfoTypeApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchInformationType"])(searchParam)
                                                ];
                                            case 1:
                                                infoTypesRes = _state.sent();
                                                add(infoTypesRes.content.map(function(it) {
                                                    return {
                                                        id: it.id,
                                                        sortKey: it.name,
                                                        typeName: 'Opplysningstype',
                                                        tagColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchResultColor"].informationTypeBackground,
                                                        label: it.name,
                                                        type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].INFORMATION_TYPE
                                                    };
                                                }));
                                                return [
                                                    2
                                                ];
                                        }
                                    });
                                })();
                            }());
                        }
                        if (type === 'all' || type === 'process') {
                            searches.push(function() {
                                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
                                    var resProcess;
                                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                return [
                                                    4,
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$ProcessApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchProcess"])(searchParam)
                                                ];
                                            case 1:
                                                resProcess = _state.sent();
                                                add(resProcess.content.map(function(content) {
                                                    var purposes = content.purposes.map(function(purpose) {
                                                        return codelistUtils.getShortnameForCode(purpose);
                                                    }).join(', ');
                                                    return {
                                                        id: content.id,
                                                        sortKey: "".concat(content.name, " ").concat(purposes),
                                                        typeName: 'Behandling',
                                                        tagColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchResultColor"].processBackground,
                                                        label: "".concat(purposes, ": ").concat(content.name),
                                                        type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].PROCESS,
                                                        number: content.number
                                                    };
                                                }));
                                                return [
                                                    2
                                                ];
                                        }
                                    });
                                })();
                            }());
                        }
                        if (type === 'all' || type === 'dpprocess') {
                            searches.push(function() {
                                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
                                    var resProcess;
                                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                return [
                                                    4,
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DpProcessApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchDpProcess"])(searchParam)
                                                ];
                                            case 1:
                                                resProcess = _state.sent();
                                                add(resProcess.content.map(function(content) {
                                                    return {
                                                        id: content.id,
                                                        sortKey: content.name,
                                                        typeName: 'Nav som databehandler',
                                                        tagColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchResultColor"].dpProcessBackground,
                                                        label: content.name,
                                                        type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].DP_PROCESS
                                                    };
                                                }));
                                                return [
                                                    2
                                                ];
                                        }
                                    });
                                })();
                            }());
                        }
                        if (type === 'all' || type === 'team') {
                            searches.push(function() {
                                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
                                    var resTeams;
                                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                return [
                                                    4,
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TeamApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchTeam"])(searchParam)
                                                ];
                                            case 1:
                                                resTeams = _state.sent();
                                                add(resTeams.content.map(function(content) {
                                                    return {
                                                        id: content.id,
                                                        sortKey: content.name,
                                                        typeName: 'Team',
                                                        tagColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchResultColor"].teamBackground,
                                                        label: content.name,
                                                        type: 'team'
                                                    };
                                                }));
                                                return [
                                                    2
                                                ];
                                        }
                                    });
                                })();
                            }());
                        }
                        if (type === 'all' || type === 'productarea') {
                            searches.push(function() {
                                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
                                    var result;
                                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                return [
                                                    4,
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TeamApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchProductArea"])(searchParam)
                                                ];
                                            case 1:
                                                result = _state.sent();
                                                add(result.content.map(function(content) {
                                                    return {
                                                        id: content.id,
                                                        sortKey: content.name,
                                                        typeName: 'Område',
                                                        tagColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchResultColor"].productAreaBackground,
                                                        label: content.name,
                                                        type: 'productarea'
                                                    };
                                                }));
                                                return [
                                                    2
                                                ];
                                        }
                                    });
                                })();
                            }());
                        }
                        if (type === 'all' || type === 'document') {
                            searches.push(function() {
                                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
                                    var resDocs;
                                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                return [
                                                    4,
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DocumentApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchDocuments"])(searchParam)
                                                ];
                                            case 1:
                                                resDocs = _state.sent();
                                                add(resDocs.content.map(function(content) {
                                                    return {
                                                        id: content.id,
                                                        sortKey: content.name,
                                                        typeName: 'Dokument',
                                                        tagColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["searchResultColor"].documentBackground,
                                                        label: content.name,
                                                        type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].DOCUMENT
                                                    };
                                                }));
                                                return [
                                                    2
                                                ];
                                        }
                                    });
                                })();
                            }());
                        }
                        return [
                            4,
                            Promise.all(searches)
                        ];
                    case 11:
                        _state.sent();
                        return [
                            2,
                            searchResult
                        ];
                    case 12:
                        return [
                            2,
                            []
                        ];
                }
            });
        })();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center w-182.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$select$2f$async$2f$dist$2f$react$2d$select$2d$async$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
                    className: "w-full",
                    "aria-label": "Søk",
                    placeholder: "Søk",
                    loadOptions: useMainSearchOption,
                    components: {
                        Option: Option,
                        DropdownIndicator: DropdownIndicator
                    },
                    noOptionsMessage: function(param) {
                        var inputValue = param.inputValue;
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["noOptionMessage"])(inputValue);
                    },
                    controlShouldRenderValue: false,
                    loadingMessage: function() {
                        return 'Søker...';
                    },
                    isClearable: false,
                    styles: mainSearchSelectOverrides,
                    onChange: function(value) {
                        var item = value;
                        (function() {
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
                                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
                                    if (item) {
                                        navigate((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["urlForObject"])(item.type, item.id));
                                    }
                                    return [
                                        2
                                    ];
                                });
                            })();
                        })();
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/search/MainSearch.tsx",
                    lineNumber: 413,
                    columnNumber: 9
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative ml-1 flex items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Button$2f$CustomButton$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            onClick: function() {
                                return setFilter(!filter);
                            },
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center leading-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$Filter$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FilterIcon$3e$__["FilterIcon"], {
                                    "aria-hidden": true,
                                    className: "block text-[#D9DBE0]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/search/MainSearch.tsx",
                                    lineNumber: 438,
                                    columnNumber: 17
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/src/components/search/MainSearch.tsx",
                                lineNumber: 437,
                                columnNumber: 15
                            }, void 0),
                            size: "xsmall",
                            kind: filter ? 'primary-neutral' : 'tertiary-neutral',
                            ariaLabel: "Filter"
                        }, void 0, false, {
                            fileName: "[project]/src/components/search/MainSearch.tsx",
                            lineNumber: 434,
                            columnNumber: 11
                        }, _this),
                        filter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SelectType$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SelectType"], {
                            type: type,
                            setType: setType
                        }, void 0, false, {
                            fileName: "[project]/src/components/search/MainSearch.tsx",
                            lineNumber: 445,
                            columnNumber: 22
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/search/MainSearch.tsx",
                    lineNumber: 433,
                    columnNumber: 9
                }, _this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/search/MainSearch.tsx",
            lineNumber: 412,
            columnNumber: 7
        }, _this)
    }, void 0, false, {
        fileName: "[project]/src/components/search/MainSearch.tsx",
        lineNumber: 411,
        columnNumber: 5
    }, _this);
};
_s(MainSearch, "RIvyac8oeStB52qFyis4k/W21yE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNavigate"]
    ];
});
_c2 = MainSearch;
const __TURBOPACK__default__export__ = MainSearch;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Option");
__turbopack_context__.k.register(_c1, "DropdownIndicator");
__turbopack_context__.k.register(_c2, "MainSearch");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Header.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/router.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$CaretDown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CaretDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/CaretDown.js [client] (ecmascript) <export default as CaretDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$Person$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PersonIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/Person.js [client] (ecmascript) <export default as PersonIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/button/Button.js [client] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$dropdown$2f$Dropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dropdown$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/dropdown/Dropdown.js [client] (ecmascript) <export default as Dropdown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$internal$2d$header$2f$InternalHeader$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__InternalHeader$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/internal-header/InternalHeader.js [client] (ecmascript) <locals> <export default as InternalHeader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Label$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Label$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/typography/Label.js [client] (ecmascript) <export default as Label>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$link$2f$Link$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/link/Link.js [client] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$popover$2f$Popover$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Popover$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/popover/Popover.js [client] (ecmascript) <export default as Popover>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$primitives$2f$stack$2f$Spacer$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Spacer$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/primitives/stack/Spacer.js [client] (ecmascript) <export default as Spacer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$toggle$2d$group$2f$ToggleGroup$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__ToggleGroup$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/toggle-group/ToggleGroup.js [client] (ecmascript) <locals> <export default as ToggleGroup>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/User.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$MainSearch$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/search/MainSearch.tsx [client] (ecmascript)");
;
;
var _this = ("TURBOPACK compile-time value", void 0);
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
;
;
;
;
;
;
function useAbsoluteCurrentUrl() {
    var _location_search, _location_hash;
    _s();
    var location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useLocation"])();
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return "".concat(window.location.origin).concat(location.pathname).concat((_location_search = location.search) !== null && _location_search !== void 0 ? _location_search : '').concat((_location_hash = location.hash) !== null && _location_hash !== void 0 ? _location_hash : '');
}
_s(useAbsoluteCurrentUrl, "pkHmaVRPskBaU4tMJuJJpV42k1I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useLocation"]
    ];
});
var LoggedInHeader = function() {
    _s1();
    var buttonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), openState = _useState[0], setOpenState = _useState[1];
    var redirectUri = useAbsoluteCurrentUrl();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                variant: "tertiary",
                "data-color": "neutral",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex items-center leading-none",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$Person$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PersonIcon$3e$__["PersonIcon"], {
                        "aria-hidden": true,
                        className: "block"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 41,
                        columnNumber: 13
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/src/components/Header.tsx",
                    lineNumber: 40,
                    columnNumber: 11
                }, void 0),
                ref: buttonRef,
                onClick: function() {
                    return setOpenState(!openState);
                },
                "aria-expanded": openState,
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].getIdent()
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$popover$2f$Popover$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Popover$3e$__["Popover"], {
                open: openState,
                onClose: function() {
                    return setOpenState(false);
                },
                anchorEl: buttonRef.current,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$popover$2f$Popover$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Popover$3e$__["Popover"].Content, {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Label$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Label$3e$__["Label"], {
                                children: [
                                    "Navn: ",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].getName()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 55,
                                columnNumber: 13
                            }, _this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Label$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Label$3e$__["Label"], {
                                children: [
                                    "Grupper: ",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].getGroupsHumanReadable().join(', ')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, _this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex w-full p-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$link$2f$Link$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                    variant: "neutral",
                                    href: redirectUri ? "/logout?redirect_uri=".concat(encodeURIComponent(redirectUri)) : '/logout',
                                    children: "Logg ut"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 58,
                                    columnNumber: 15
                                }, _this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, _this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, _this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Header.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true);
};
_s1(LoggedInHeader, "Ia4I7EUe3tReem7r40iN7YT6jAU=", false, function() {
    return [
        useAbsoluteCurrentUrl
    ];
});
_c = LoggedInHeader;
var LoginButton = function() {
    _s2();
    var redirectUri = useAbsoluteCurrentUrl();
    var href = redirectUri ? "/login?redirect_uri=".concat(encodeURIComponent(redirectUri)) : '/login';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$internal$2d$header$2f$InternalHeader$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__InternalHeader$3e$__["InternalHeader"].Button, {
        as: "a",
        href: href,
        children: "Logg inn"
    }, void 0, false, {
        fileName: "[project]/src/components/Header.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, _this);
};
_s2(LoginButton, "F500cpMgitDot+r+KIvQp7Sa7Tk=", false, function() {
    return [
        useAbsoluteCurrentUrl
    ];
});
_c1 = LoginButton;
var AdminOptions = function(param) {
    var showPermissionOverrides = param.showPermissionOverrides, permissionMode = param.permissionMode, onPermissionModeChange = param.onPermissionModeChange;
    var pages = [
        {
            label: 'Administrering av kodeverk',
            href: '/admin/codelist'
        },
        {
            label: 'Versjonering',
            href: '/admin/audit'
        },
        {
            label: 'Innstillinger',
            href: '/admin/settings'
        },
        {
            label: 'Mail log',
            href: '/admin/maillog'
        },
        {
            label: 'Trenger revidering',
            href: '/admin/request-revision',
            super: true
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$dropdown$2f$Dropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dropdown$3e$__["Dropdown"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$internal$2d$header$2f$InternalHeader$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__InternalHeader$3e$__["InternalHeader"].Button, {
                as: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$dropdown$2f$Dropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dropdown$3e$__["Dropdown"].Toggle,
                children: [
                    "Admin ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$CaretDown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CaretDownIcon$3e$__["CaretDownIcon"], {
                        title: "a11y-title",
                        fontSize: "1.5rem",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 109,
                        columnNumber: 15
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$dropdown$2f$Dropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dropdown$3e$__["Dropdown"].Menu, {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$dropdown$2f$Dropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dropdown$3e$__["Dropdown"].Menu.List, {
                        children: pages.map(function(page) {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$dropdown$2f$Dropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dropdown$3e$__["Dropdown"].Menu.List.Item, {
                                as: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$link$2f$Link$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"],
                                variant: "neutral",
                                href: page.href,
                                children: page.label
                            }, page.label, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, _this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, _this),
                    showPermissionOverrides && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-2 pt-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$toggle$2d$group$2f$ToggleGroup$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__ToggleGroup$3e$__["ToggleGroup"], {
                            size: "small",
                            "aria-label": "Tilgangsmodus",
                            value: permissionMode,
                            onChange: function(value) {
                                if (value === 'admin' || value === 'write' || value === 'read') {
                                    onPermissionModeChange(value);
                                }
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$toggle$2d$group$2f$ToggleGroup$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__ToggleGroup$3e$__["ToggleGroup"].Item, {
                                    value: "admin",
                                    children: "Admin"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 133,
                                    columnNumber: 15
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$toggle$2d$group$2f$ToggleGroup$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__ToggleGroup$3e$__["ToggleGroup"].Item, {
                                    value: "write",
                                    children: "Skriv"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 134,
                                    columnNumber: 15
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$toggle$2d$group$2f$ToggleGroup$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__ToggleGroup$3e$__["ToggleGroup"].Item, {
                                    value: "read",
                                    children: "Les"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 135,
                                    columnNumber: 15
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 123,
                            columnNumber: 13
                        }, _this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Header.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, _this);
};
_c2 = AdminOptions;
var Header = function(param) {
    var themeMode = param.themeMode, onThemeModeChange = param.onThemeModeChange, permissionMode = param.permissionMode, onPermissionModeChange = param.onPermissionModeChange;
    _s3();
    var location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useLocation"])();
    var navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNavigate"])();
    var canUsePermissionOverrides = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].hasGroup(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EGroup"].ADMIN) || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].hasGroup(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EGroup"].SUPER);
    var setPermissionMode = function(mode) {
        onPermissionModeChange(mode);
        if (mode !== 'admin' && location.pathname.startsWith('/admin')) {
            navigate('/');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$internal$2d$header$2f$InternalHeader$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__InternalHeader$3e$__["InternalHeader"], {
        className: "polly-white-internalheader",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$internal$2d$header$2f$InternalHeader$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__InternalHeader$3e$__["InternalHeader"].Title, {
                href: "/",
                children: "Behandlingskatalog"
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$primitives$2f$stack$2f$Spacer$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Spacer$3e$__["Spacer"], {}, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center py-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$MainSearch$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/Header.tsx",
                    lineNumber: 174,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 173,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$primitives$2f$stack$2f$Spacer$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Spacer$3e$__["Spacer"], {}, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center px-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$toggle$2d$group$2f$ToggleGroup$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__ToggleGroup$3e$__["ToggleGroup"], {
                    size: "small",
                    "aria-label": "Tema",
                    value: themeMode,
                    onChange: function(value) {
                        if (value === 'dark' || value === 'light') {
                            onThemeModeChange(value);
                        }
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$toggle$2d$group$2f$ToggleGroup$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__ToggleGroup$3e$__["ToggleGroup"].Item, {
                            value: "light",
                            children: "Lyst tema"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 188,
                            columnNumber: 11
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$toggle$2d$group$2f$ToggleGroup$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__ToggleGroup$3e$__["ToggleGroup"].Item, {
                            value: "dark",
                            children: "Mørkt tema"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 189,
                            columnNumber: 11
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Header.tsx",
                    lineNumber: 178,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, _this),
            canUsePermissionOverrides && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AdminOptions, {
                showPermissionOverrides: canUsePermissionOverrides,
                permissionMode: permissionMode,
                onPermissionModeChange: setPermissionMode
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 194,
                columnNumber: 9
            }, _this),
            !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].isLoggedIn() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginButton, {}, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 200,
                columnNumber: 30
            }, _this),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].isLoggedIn() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoggedInHeader, {}, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 201,
                columnNumber: 29
            }, _this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Header.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, _this);
};
_s3(Header, "ZmJpvzBBf8J7VCgSKqUUk0eHjAY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useLocation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNavigate"]
    ];
});
_c3 = Header;
const __TURBOPACK__default__export__ = Header;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "LoggedInHeader");
__turbopack_context__.k.register(_c1, "LoginButton");
__turbopack_context__.k.register(_c2, "AdminOptions");
__turbopack_context__.k.register(_c3, "Header");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/AlertApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAlertEvents",
    ()=>getAlertEvents,
    "getAlertForDisclosure",
    ()=>getAlertForDisclosure,
    "getAlertForInformationType",
    ()=>getAlertForInformationType,
    "getAlertForProcess",
    ()=>getAlertForProcess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
;
;
;
;
;
var getAlertForInformationType = function(informationTypeId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/alert/informationtype/").concat(informationTypeId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getAlertForProcess = function(processId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/alert/process/").concat(processId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getAlertForDisclosure = function(disclosureId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/alert/disclosure/").concat(disclosureId))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
var getAlertEvents = function(page, count, type, level, processId, informationTypeId, disclosureId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/alert/events?pageNumber=").concat(page, "&pageSize=").concat(count) + (type ? "&type=".concat(type) : '') + (level ? "&level=".concat(level) : '') + (processId ? "&processId=".concat(processId) : '') + (informationTypeId ? "&informationTypeId=".concat(informationTypeId) : '') + (disclosureId ? "&disclosureId=".concat(disclosureId) : ''))
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().data
                    ];
            }
        });
    })();
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/CustomizedStatefulTooltip.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$InformationSquare$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InformationSquareIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/InformationSquare.js [client] (ecmascript) <export default as InformationSquareIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/button/Button.js [client] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/tooltip/Tooltip.js [client] (ecmascript) <export default as Tooltip>");
;
var _this = ("TURBOPACK compile-time value", void 0);
;
;
;
var CustomizedStatefulTooltip = function(props) {
    var content = props.content, text = props.text, color = props.color, icon = props.icon;
    var hasExplicitIcon = icon !== undefined;
    var IconComponent = icon ? icon : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$InformationSquare$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InformationSquareIcon$3e$__["InformationSquareIcon"], {
        title: "tooltip",
        color: color || undefined
    }, void 0, false, {
        fileName: "[project]/src/components/common/CustomizedStatefulTooltip.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, _this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__["Tooltip"], {
        content: content,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
            type: "button",
            variant: "tertiary-neutral",
            size: "small",
            icon: hasExplicitIcon ? IconComponent : text ? undefined : IconComponent,
            iconPosition: text && hasExplicitIcon ? 'left' : undefined,
            children: text
        }, void 0, false, {
            fileName: "[project]/src/components/common/CustomizedStatefulTooltip.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, _this)
    }, void 0, false, {
        fileName: "[project]/src/components/common/CustomizedStatefulTooltip.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, _this);
};
_c = CustomizedStatefulTooltip;
const __TURBOPACK__default__export__ = CustomizedStatefulTooltip;
var _c;
__turbopack_context__.k.register(_c, "CustomizedStatefulTooltip");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/InformationType/Sensitivity.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sensitivity",
    ()=>Sensitivity,
    "sensitivityColor",
    ()=>sensitivityColor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$Shield$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/Shield.js [client] (ecmascript) <export default as ShieldIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/Codelist.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/theme.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$CustomizedStatefulTooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/CustomizedStatefulTooltip.tsx [client] (ecmascript)");
;
var _this = ("TURBOPACK compile-time value", void 0);
;
;
;
;
;
function sensitivityColor(code) {
    switch(code){
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ESensitivityLevel"].ART9:
            // Icon-only warning decoration color (rawValue: #CA5000)
            return 'var(--ax-text-warning-decoration)';
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["theme"].colors.mono1000;
    }
}
var Sensitivity = function(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$CustomizedStatefulTooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        content: "".concat(props.codelistUtils.getDescription(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EListName"].SENSITIVITY, props.sensitivity.code)),
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$Shield$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldIcon$3e$__["ShieldIcon"], {
            "aria-hidden": true,
            className: "block",
            style: {
                color: sensitivityColor(props.sensitivity.code)
            }
        }, void 0, false, {
            fileName: "[project]/src/components/InformationType/Sensitivity.tsx",
            lineNumber: 21,
            columnNumber: 9
        }, void 0)
    }, void 0, false, {
        fileName: "[project]/src/components/InformationType/Sensitivity.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, _this);
};
_c = Sensitivity;
var _c;
__turbopack_context__.k.register(_c, "Sensitivity");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/AlertEventPage.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertEventPage",
    ()=>AlertEventPage,
    "canViewAlerts",
    ()=>canViewAlerts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread_props.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/router.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$ChevronDown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/ChevronDown.js [client] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$XMark$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/XMark.js [client] (ecmascript) <export default as XMarkIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/button/Button.js [client] (ecmascript) <export default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$chips$2f$Chips$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Chips$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/chips/Chips.js [client] (ecmascript) <locals> <export default as Chips>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$dropdown$2f$Dropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dropdown$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/dropdown/Dropdown.js [client] (ecmascript) <export default as Dropdown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Heading$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/typography/Heading.js [client] (ecmascript) <export default as Heading>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Label$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Label$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/typography/Label.js [client] (ecmascript) <export default as Label>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$pagination$2f$Pagination$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pagination$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/pagination/Pagination.js [client] (ecmascript) <export default as Pagination>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$form$2f$select$2f$Select$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/form/select/Select.js [client] (ecmascript) <export default as Select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/table/Table.js [client] (ecmascript) <export default as Table>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$AlertApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/AlertApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$InformationType$2f$Sensitivity$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/InformationType/Sensitivity.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/RouteLink.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/Codelist.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/User.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/codeToFineText.ts [client] (ecmascript)");
;
;
;
;
var _this = ("TURBOPACK compile-time value", void 0);
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
;
var clampPage = function(state, page, limit) {
    if (page < 1 || page > state.events.pages) {
        return state.page;
    }
    var maxPage = Math.ceil(state.events.totalElements / limit);
    return page > maxPage ? maxPage : page;
};
var reducer = function(state, action) {
    switch(action.type){
        case 'OBJECT_FILTER':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, state), {
                processId: action.objectType === 'process' ? action.id : undefined,
                informationTypeId: action.objectType === 'informationtype' ? action.id : undefined,
                disclosureId: action.objectType === 'disclosure' ? action.id : undefined
            });
        case 'EVENTS':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, state), {
                events: action.value,
                page: clampPage((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, state), {
                    events: action.value
                }), state.page, state.limit)
            });
        case 'PAGE':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, state), {
                page: clampPage(state, action.value, state.limit)
            });
        case 'LIMIT':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, state), {
                limit: action.value,
                page: clampPage(state, state.page, action.value)
            });
        case 'EVENT_TYPE':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, state), {
                page: 1,
                type: action.value
            });
        case 'EVENT_LEVEL':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread_props$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, state), {
                page: 1,
                level: action.value
            });
    }
};
var AlertEventPage = function() {
    _s();
    var _CodelistService = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["CodelistService"])(), 1), codelistUtils = _CodelistService[0];
    var _useParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useParams"])(), objectType = _useParams.objectType, id = _useParams.id;
    var _useReducer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useReducer"])(reducer, {
        events: {
            content: [],
            numberOfElements: 0,
            pageNumber: 0,
            pages: 0,
            pageSize: 1,
            totalElements: 0
        },
        page: 1,
        limit: 50,
        level: undefined,
        type: undefined,
        processId: objectType === 'process' ? id : undefined,
        informationTypeId: objectType === 'informationtype' ? id : undefined,
        disclosureId: objectType === 'disclosure' ? id : undefined
    }), 2), state = _useReducer[0], dispatch = _useReducer[1];
    var setPage = function(p) {
        return dispatch({
            type: 'PAGE',
            value: p
        });
    };
    var setLimit = function(l) {
        return dispatch({
            type: 'LIMIT',
            value: l
        });
    };
    var setType = function(t) {
        return dispatch({
            type: 'EVENT_TYPE',
            value: t
        });
    };
    var setLevel = function(l) {
        return dispatch({
            type: 'EVENT_LEVEL',
            value: l
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AlertEventPage.useEffect": function() {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$AlertApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getAlertEvents"])(state.page - 1, state.limit, state.type, state.level, state.processId, state.informationTypeId, state.disclosureId).then({
                "AlertEventPage.useEffect": function(a) {
                    return dispatch({
                        type: 'EVENTS',
                        value: a
                    });
                }
            }["AlertEventPage.useEffect"]);
        }
    }["AlertEventPage.useEffect"], [
        state.page,
        state.limit,
        state.type,
        state.level,
        state.processId,
        state.informationTypeId,
        state.disclosureId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AlertEventPage.useEffect": function() {
            dispatch({
                type: 'OBJECT_FILTER',
                objectType: objectType,
                id: id
            });
        }
    }["AlertEventPage.useEffect"], [
        objectType,
        id
    ]);
    var filterToggle = function(text, newLevel) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$chips$2f$Chips$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Chips$3e$__["Chips"].Toggle, {
            checkmark: false,
            selected: state.level === newLevel,
            onClick: function() {
                return setLevel(newLevel);
            },
            children: text
        }, text, false, {
            fileName: "[project]/src/pages/AlertEventPage.tsx",
            lineNumber: 135,
            columnNumber: 5
        }, _this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex w-full justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Heading$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading$3e$__["Heading"], {
                        size: "large",
                        children: "Varsler"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, _this),
                    (state.informationTypeId || state.processId || state.disclosureId) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Label$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Label$3e$__["Label"], {
                                className: "mr-3",
                                children: "Filter:"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, _this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                                variant: "secondary",
                                size: "xsmall",
                                className: "mx-2.5",
                                onClick: function() {
                                    return dispatch({
                                        type: 'OBJECT_FILTER'
                                    });
                                },
                                children: [
                                    state.processId && 'Behandling',
                                    state.informationTypeId && 'Opplysningstype',
                                    state.disclosureId && 'Utlevering',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-2 inline-flex items-center leading-none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$XMark$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__["XMarkIcon"], {
                                            "aria-hidden": true,
                                            className: "block"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/AlertEventPage.tsx",
                                            lineNumber: 162,
                                            columnNumber: 17
                                        }, _this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 161,
                                        columnNumber: 15
                                    }, _this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, _this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 150,
                        columnNumber: 11
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/AlertEventPage.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full flex mb-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$form$2f$select$2f$Select$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                        label: "Type varsel",
                        onChange: function(event) {
                            if (event.target.value !== '') {
                                setType(event.target.value);
                            } else {
                                setType(undefined);
                            }
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Velg type"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, _this),
                            Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EAlertEventType"]).map(function(t) {
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: t,
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tekster"][t]
                                }, t, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, _this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full flex justify-end items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Label$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Label$3e$__["Label"], {
                                className: "mr-3",
                                children: "Nivå:"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, _this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$chips$2f$Chips$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Chips$3e$__["Chips"], {
                                children: [
                                    filterToggle('Alle'),
                                    filterToggle('Info', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EAlertEventLevel"].INFO),
                                    filterToggle('Advarsel', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EAlertEventLevel"].WARNING),
                                    filterToggle('Feil', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EAlertEventLevel"].ERROR)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, _this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/AlertEventPage.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"], {
                size: "small",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].Header, {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].Row, {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].ColumnHeader, {
                                    children: "Behandling"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 200,
                                    columnNumber: 13
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].ColumnHeader, {
                                    children: "Opplysningstype"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].ColumnHeader, {
                                    children: "Utlevering"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 202,
                                    columnNumber: 13
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].ColumnHeader, {
                                    children: "Nivå - Type"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 203,
                                    columnNumber: 13
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].ColumnHeader, {
                                    children: "Tidspunkt"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 204,
                                    columnNumber: 13
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].ColumnHeader, {
                                    children: "Bruker"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 205,
                                    columnNumber: 13
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/AlertEventPage.tsx",
                            lineNumber: 199,
                            columnNumber: 11
                        }, _this)
                    }, void 0, false, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].Body, {
                        children: state.events.content.map(function(event, index) {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].Row, {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].DataCell, {
                                        textSize: "small",
                                        children: event.process ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ObjectLink"], {
                                            id: event.process.id,
                                            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].PROCESS,
                                            children: [
                                                codelistUtils.getShortnameForCodes(event.process.purposes),
                                                ":",
                                                ' ',
                                                event.process.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/AlertEventPage.tsx",
                                            lineNumber: 213,
                                            columnNumber: 19
                                        }, _this) : ''
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 211,
                                        columnNumber: 15
                                    }, _this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].DataCell, {
                                        textSize: "small",
                                        children: event.informationType ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ObjectLink"], {
                                            id: event.informationType.id,
                                            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].INFORMATION_TYPE,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$InformationType$2f$Sensitivity$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Sensitivity"], {
                                                    sensitivity: event.informationType.sensitivity,
                                                    codelistUtils: codelistUtils
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                                    lineNumber: 225,
                                                    columnNumber: 21
                                                }, _this),
                                                " ",
                                                event.informationType.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/AlertEventPage.tsx",
                                            lineNumber: 224,
                                            columnNumber: 19
                                        }, _this) : ''
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 222,
                                        columnNumber: 15
                                    }, _this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].DataCell, {
                                        textSize: "small",
                                        children: event.disclosure ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ObjectLink"], {
                                            id: event.disclosure.id,
                                            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].DISCLOSURE,
                                            children: event.disclosure.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/AlertEventPage.tsx",
                                            lineNumber: 239,
                                            columnNumber: 19
                                        }, _this) : ''
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 237,
                                        columnNumber: 15
                                    }, _this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].DataCell, {
                                        textSize: "small",
                                        children: [
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tekster"][event.level],
                                            " - ",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tekster"][event.type]
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 247,
                                        columnNumber: 15
                                    }, _this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].DataCell, {
                                        textSize: "small",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(event.changeStamp.lastModifiedDate).format('lll')
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 250,
                                        columnNumber: 15
                                    }, _this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$table$2f$Table$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Table$3e$__["Table"].DataCell, {
                                        textSize: "small",
                                        children: event.changeStamp.lastModifiedBy
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 253,
                                        columnNumber: 15
                                    }, _this)
                                ]
                            }, index, true, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, _this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 208,
                        columnNumber: 9
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/AlertEventPage.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$dropdown$2f$Dropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dropdown$3e$__["Dropdown"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"], {
                                variant: "tertiary",
                                as: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$dropdown$2f$Dropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dropdown$3e$__["Dropdown"].Toggle,
                                children: [
                                    "".concat(state.limit, " Rader"),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-2 inline-flex items-center leading-none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$ChevronDown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                                            "aria-hidden": true,
                                            className: "block"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/AlertEventPage.tsx",
                                            lineNumber: 263,
                                            columnNumber: 15
                                        }, _this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 262,
                                        columnNumber: 13
                                    }, _this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 260,
                                columnNumber: 11
                            }, _this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$dropdown$2f$Dropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dropdown$3e$__["Dropdown"].Menu, {
                                className: "w-fit",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$dropdown$2f$Dropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dropdown$3e$__["Dropdown"].Menu.List, {
                                    children: [
                                        5,
                                        10,
                                        20,
                                        50,
                                        100
                                    ].map(function(pageSize) {
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$dropdown$2f$Dropdown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dropdown$3e$__["Dropdown"].Menu.List.Item, {
                                            as: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$button$2f$Button$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Button$3e$__["Button"],
                                            onClick: function() {
                                                return setLimit(pageSize);
                                            },
                                            children: pageSize
                                        }, 'pageSize_' + pageSize, false, {
                                            fileName: "[project]/src/pages/AlertEventPage.tsx",
                                            lineNumber: 269,
                                            columnNumber: 17
                                        }, _this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 267,
                                    columnNumber: 13
                                }, _this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 266,
                                columnNumber: 11
                            }, _this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$pagination$2f$Pagination$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pagination$3e$__["Pagination"], {
                        page: state.page,
                        onPageChange: setPage,
                        count: state.events.pages || 1,
                        prevNextTexts: true,
                        size: "small"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/AlertEventPage.tsx",
                lineNumber: 258,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true);
};
_s(AlertEventPage, "bLNbnSLqC9LSHaipHrnsNlpvoG4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useParams"]
    ];
});
_c = AlertEventPage;
var canViewAlerts = function() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].isSuper() || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].isAdmin();
};
var _c;
__turbopack_context__.k.register(_c, "AlertEventPage");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/util/config.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "behandlingskatalogSlackChannelId",
    ()=>behandlingskatalogSlackChannelId,
    "datajegerSlackLink",
    ()=>datajegerSlackLink,
    "documentationLink",
    ()=>documentationLink,
    "navSlackTeamId",
    ()=>navSlackTeamId,
    "productAreaLink",
    ()=>productAreaLink,
    "slackRedirectUrl",
    ()=>slackRedirectUrl,
    "teamLink",
    ()=>teamLink,
    "termUrl",
    ()=>termUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
;
;
var navSlackTeamId = 'T5LNAMWNA';
var behandlingskatalogSlackChannelId = 'CR1B19E6L';
var datajegerSlackLink = "slack://channel?team=".concat(navSlackTeamId, "&id=").concat(behandlingskatalogSlackChannelId);
var documentationLink = 'https://navikt.github.io/naka/behandlingskatalog';
var termUrl = function(termId) {
    return "https://navno.sharepoint.com/sites/begreper/SitePages/Begrep.aspx?bid=".concat(termId);
};
var slackRedirectUrl = function(c) {
    return "https://slack.com/app_redirect?team=".concat(navSlackTeamId, "&channel=").concat(c.toLowerCase());
};
var teamLink = function(teamId) {
    return "".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].teamKatBaseUrl, "team/").concat(teamId);
};
var productAreaLink = function(productAreaId) {
    return "".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].teamKatBaseUrl, "productarea/").concat(productAreaId);
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/SideBar/NavItem.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/router.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$ChevronDown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/ChevronDown.js [client] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$ChevronRight$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/ChevronRight.js [client] (ecmascript) <export default as ChevronRightIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$BodyShort$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BodyShort$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/typography/BodyShort.js [client] (ecmascript) <export default as BodyShort>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/tooltip/Tooltip.js [client] (ecmascript) <export default as Tooltip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/RouteLink.tsx [client] (ecmascript)");
;
var _this = ("TURBOPACK compile-time value", void 0);
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
var checkCurrentLocationIsTheSameAsSideBarItem = function(currentLocationUrl, sidebarItemUrl) {
    if (sidebarItemUrl.slice(0, 2) === '//') {
        return false;
    }
    return currentLocationUrl.split('/')[1] === sidebarItemUrl.split('/')[1];
};
var NavItem = function(props) {
    _s();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        href: props.to,
        style: {
            textDecoration: 'none'
        },
        className: "block w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center h-8.75",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mr-2.5",
                    children: checkCurrentLocationIsTheSameAsSideBarItem((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useLocation"])().pathname, props.to) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$ChevronDown$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                        "aria-hidden": true,
                        className: "block text-[#dcdde2]!",
                        style: {
                            fontSize: '1.5rem'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/SideBar/NavItem.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, _this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$ChevronRight$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
                        "aria-hidden": true,
                        className: "block text-[#dcdde2]!",
                        style: {
                            fontSize: '1.5rem'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/SideBar/NavItem.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, _this)
                }, void 0, false, {
                    fileName: "[project]/src/components/SideBar/NavItem.tsx",
                    lineNumber: 26,
                    columnNumber: 7
                }, _this),
                props.tooltip ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tooltip$3e$__["Tooltip"], {
                    content: props.tooltip,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$BodyShort$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BodyShort$3e$__["BodyShort"], {
                        size: "small",
                        style: {
                            color: '#E0E1E5',
                            whiteSpace: props.noWrap ? 'nowrap' : undefined
                        },
                        children: props.text
                    }, void 0, false, {
                        fileName: "[project]/src/components/SideBar/NavItem.tsx",
                        lineNumber: 43,
                        columnNumber: 11
                    }, _this)
                }, void 0, false, {
                    fileName: "[project]/src/components/SideBar/NavItem.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, _this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$BodyShort$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BodyShort$3e$__["BodyShort"], {
                    size: "small",
                    style: {
                        color: '#E0E1E5',
                        whiteSpace: props.noWrap ? 'nowrap' : undefined
                    },
                    children: props.text
                }, void 0, false, {
                    fileName: "[project]/src/components/SideBar/NavItem.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, _this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/SideBar/NavItem.tsx",
            lineNumber: 25,
            columnNumber: 5
        }, _this)
    }, void 0, false, {
        fileName: "[project]/src/components/SideBar/NavItem.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, _this);
};
_s(NavItem, "EuD9q2dZ34PfN/QO2OBhBzeMxmY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useLocation"]
    ];
});
_c = NavItem;
const __TURBOPACK__default__export__ = NavItem;
var _c;
__turbopack_context__.k.register(_c, "NavItem");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/SideBar/SideBar.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$BodyShort$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BodyShort$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/typography/BodyShort.js [client] (ecmascript) <export default as BodyShort>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$AlertEventPage$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/AlertEventPage.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SideBar/NavItem.tsx [client] (ecmascript)");
;
var _this = ("TURBOPACK compile-time value", void 0);
;
;
;
;
;
;
var SideBar = function() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full w-60 bg-black! flex flex-col",
        style: {
            backgroundColor: '#1B232F'
        },
        role: "navigation",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "sticky top-0 h-screen flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 min-h-0 pl-3 pr-3 pt-6 overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            to: "/process",
                            text: "Behandlinger",
                            tooltip: "En aktivitet du gjør på personopplysninger for å oppnå et formål. Eks. på behandling: Saksbehandling av alderspensjon"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 15,
                            columnNumber: 9
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            to: "/dpprocess",
                            text: "Nav som databehandler",
                            noWrap: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 20,
                            columnNumber: 9
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            to: "/informationtype",
                            text: "Opplysningstyper",
                            tooltip: "Personopplysninger som f.eks. kjønn, sivilstand, pensjonsopptjening."
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 21,
                            columnNumber: 9
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            to: "/document",
                            text: "Dokumenter",
                            tooltip: "En samling av opplysningstyper. Sykmelding og inntektsmelding er eksempler på dokumenter som inneholder flere opplysningstyper."
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 26,
                            columnNumber: 9
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            to: "/disclosure",
                            text: "Utleveringer",
                            tooltip: "En samling av utleveringer av persondata fra Nav til eksterne bedrifter eller etater"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 31,
                            columnNumber: 9
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            to: "/thirdparty",
                            text: "Eksterne parter",
                            tooltip: "Parter utenfor Nav som vi samhandler med. Eksempler er Folkeregisteret, Lånekassen, brukere, arbeidsgivere"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 36,
                            columnNumber: 9
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            to: "/system",
                            text: "Systemer",
                            tooltip: "En samling av beslektede applikasjoner som sammen løser et forretningsbehov. F.eks. Pesys, Modia, Aa-reg"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 41,
                            columnNumber: 9
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            to: "/processor",
                            text: "Databehandlere"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 46,
                            columnNumber: 9
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            to: "/dashboard",
                            text: "Dashboard",
                            tooltip: "Oversikt og statistikk over behandlinger og andre samlinger i behandlingskatalogen"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 47,
                            columnNumber: 9
                        }, _this),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$AlertEventPage$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["canViewAlerts"])() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                to: "/alert/events",
                                text: "Varsler"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SideBar/SideBar.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, _this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            to: "//navikt.github.io/naka/behandlingskatalog",
                            text: "Veileder"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 57,
                            columnNumber: 9
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SideBar/SideBar.tsx",
                    lineNumber: 14,
                    columnNumber: 7
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-62 mt-auto pt-6 pb-22",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pb-4 w-[40%]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: "/navlogo.svg",
                                    alt: "Nav logo",
                                    width: 120,
                                    height: 44,
                                    style: {
                                        width: '100%',
                                        height: 'auto'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/SideBar/SideBar.tsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, _this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/SideBar/SideBar.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, _this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 61,
                            columnNumber: 9
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["datajegerSlackLink"],
                            style: {
                                textDecoration: 'none'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/Slack_Monochrome_White.svg",
                                        width: 60,
                                        height: 60,
                                        alt: "slack logo"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SideBar/SideBar.tsx",
                                        lineNumber: 75,
                                        columnNumber: 13
                                    }, _this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$BodyShort$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BodyShort$3e$__["BodyShort"], {
                                        size: "small",
                                        style: {
                                            color: '#E0E1E5'
                                        },
                                        children: "#behandlingskatalogen"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SideBar/SideBar.tsx",
                                        lineNumber: 76,
                                        columnNumber: 13
                                    }, _this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SideBar/SideBar.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, _this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 73,
                            columnNumber: 9
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SideBar/SideBar.tsx",
                    lineNumber: 60,
                    columnNumber: 7
                }, _this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/SideBar/SideBar.tsx",
            lineNumber: 13,
            columnNumber: 5
        }, _this)
    }, void 0, false, {
        fileName: "[project]/src/components/SideBar/SideBar.tsx",
        lineNumber: 8,
        columnNumber: 3
    }, _this);
};
_c = SideBar;
const __TURBOPACK__default__export__ = SideBar;
var _c;
__turbopack_context__.k.register(_c, "SideBar");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/util/themeMode.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getInitialThemeMode",
    ()=>getInitialThemeMode,
    "persistThemeMode",
    ()=>persistThemeMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
;
var storageKey = 'polly-theme-mode';
var getInitialThemeMode = function() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    var stored = window.localStorage.getItem(storageKey);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }
    return 'light';
};
var persistThemeMode = function(mode) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.setItem(storageKey, mode);
};
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/main.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$theme$2f$Theme$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/theme/Theme.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Header.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$SideBar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SideBar/SideBar.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/Codelist.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/User.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$permissionOverride$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/permissionOverride.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$themeMode$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/themeMode.ts [client] (ecmascript)");
;
;
var _this = ("TURBOPACK compile-time value", void 0);
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
var Main = function(param) {
    var children = param.children;
    _s();
    // all pages need these
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAwait"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].wait());
    var _CodelistService = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["CodelistService"])(), 1), codelistUtils = _CodelistService[0];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAwait"])(codelistUtils.fetchData());
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        "Main._useState.useState": function() {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$themeMode$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getInitialThemeMode"])();
        }
    }["Main._useState.useState"]), 2), themeMode = _useState[0], setThemeMode = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        "Main._useState.useState": function() {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$permissionOverride$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getInitialPermissionMode"])();
        }
    }["Main._useState.useState"]), 2), permissionMode = _useState1[0], setPermissionModeState = _useState1[1];
    var _useState2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        "Main._useState.useState": function() {
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].isLoaded();
        }
    }["Main._useState.useState"]), 2), userLoaded = _useState2[0], setUserLoaded = _useState2[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Main.useEffect": function() {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].wait().then({
                "Main.useEffect": function() {
                    return setUserLoaded(true);
                }
            }["Main.useEffect"]);
        }
    }["Main.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Main.useEffect": function() {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$themeMode$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["persistThemeMode"])(themeMode);
        }
    }["Main.useEffect"], [
        themeMode
    ]);
    var handlePermissionModeChange = function(value) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$permissionOverride$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["setPermissionMode"])(value);
        setPermissionModeState(value);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Main.useEffect": function() {
            document.documentElement.classList.remove('light', 'dark');
            document.body.classList.remove('light', 'dark');
            document.documentElement.classList.add(themeMode);
            document.body.classList.add(themeMode);
            return ({
                "Main.useEffect": function() {
                    document.documentElement.classList.remove('light', 'dark');
                    document.body.classList.remove('light', 'dark');
                }
            })["Main.useEffect"];
        }
    }["Main.useEffect"], [
        themeMode
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$permissionOverride$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["AppStateContext"].Provider, {
        value: {
            permissionMode: permissionMode,
            userLoaded: userLoaded
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$theme$2f$Theme$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Theme"], {
                theme: themeMode,
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-h-screen w-full flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            themeMode: themeMode,
                            onThemeModeChange: setThemeMode,
                            permissionMode: permissionMode,
                            onPermissionModeChange: handlePermissionModeChange
                        }, void 0, false, {
                            fileName: "[project]/src/main.tsx",
                            lineNumber: 60,
                            columnNumber: 13
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex w-full flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-60",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$SideBar$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/main.tsx",
                                        lineNumber: 69,
                                        columnNumber: 17
                                    }, _this)
                                }, void 0, false, {
                                    fileName: "[project]/src/main.tsx",
                                    lineNumber: 68,
                                    columnNumber: 15
                                }, _this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-48 w-full px-7 py-7",
                                    children: children
                                }, void 0, false, {
                                    fileName: "[project]/src/main.tsx",
                                    lineNumber: 72,
                                    columnNumber: 15
                                }, _this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/main.tsx",
                            lineNumber: 67,
                            columnNumber: 13
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/main.tsx",
                    lineNumber: 59,
                    columnNumber: 11
                }, _this)
            }, void 0, false, {
                fileName: "[project]/src/main.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, _this)
        }, void 0, false, {
            fileName: "[project]/src/main.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, _this)
    }, void 0, false, {
        fileName: "[project]/src/main.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, _this);
};
_s(Main, "MH/RB5i/UC7Xnsq6c5zRWVFNDVQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAwait"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAwait"]
    ];
});
_c = Main;
const __TURBOPACK__default__export__ = Main;
var _c;
__turbopack_context__.k.register(_c, "Main");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/main.tsx [client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/main.tsx [client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_658dfbcd._.js.map