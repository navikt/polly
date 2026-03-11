module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/src/util/router.ts [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLocation",
    ()=>useLocation,
    "useNavigate",
    ()=>useNavigate,
    "useParams",
    ()=>useParams
]);
/**
 * Compatibility shim so existing components that import from 'react-router'
 * can be pointed here instead, with equivalent hooks backed by next/router.
 *
 * Replace:  import { useNavigate, useParams, useLocation } from 'react-router'
 * With:     import { useNavigate, useParams, useLocation } from '@/util/router'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
// Types are re-exported from react-router so callers get the same shapes.
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$router__$5b$external$5d$__$28$react$2d$router$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$react$2d$router$29$__ = __turbopack_context__.i("[externals]/react-router [external] (react-router, cjs, [project]/node_modules/react-router)");
;
;
function useNavigate() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const normalizeUrl = (to)=>{
        const raw = typeof to === 'string' ? to.trim() : to.pathname ?? '/';
        const lower = raw.toLowerCase();
        if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) {
            return '/';
        }
        const path = raw.startsWith('/') || raw.startsWith('?') || raw.startsWith('#') ? raw : `/${raw}`;
        // Explicitly encode HTML meta-characters to break XSS taint chain
        return path.replace(/</g, '%3C').replace(/>/g, '%3E').replace(/"/g, '%22').replace(/'/g, '%27');
    };
    const navigate = (to, options)=>{
        if (typeof to === 'number') {
            if (to === -1) router.back();
            return;
        }
        const url = normalizeUrl(to);
        if (options?.replace) {
            router.replace(url);
        } else {
            router.push(url);
        }
    };
    return navigate;
}
function useParams() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const safe = Object.fromEntries(Object.entries(router.query).filter(([, v])=>typeof v !== 'string' || !/^[a-z][a-z0-9+\-.]*:/i.test(v)).map(([k, v])=>[
            k,
            Array.isArray(v) ? v[0] : v
        ]));
    return safe;
}
function useLocation() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const asPath = router.asPath;
    const hashIdx = asPath.indexOf('#');
    const withoutHash = hashIdx >= 0 ? asPath.substring(0, hashIdx) : asPath;
    const hash = hashIdx >= 0 ? asPath.substring(hashIdx) : '';
    const qIdx = withoutHash.indexOf('?');
    const pathname = qIdx >= 0 ? withoutHash.substring(0, qIdx) : withoutHash;
    const search = qIdx >= 0 ? withoutHash.substring(qIdx) : '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return {
        pathname,
        search,
        hash,
        state: null,
        key: 'default',
        unstable_mask: undefined
    };
}
}),
"[project]/src/util/env.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "env",
    ()=>env
]);
const env = {
    pollyBaseUrl: ("TURBOPACK compile-time value", "/api") || '/api',
    lovdataLovBaseUrl: ("TURBOPACK compile-time value", "https://lovdata.no/lov/"),
    lovdataForskriftBaseUrl: ("TURBOPACK compile-time value", "https://lovdata.no/forskrift/"),
    teamKatBaseUrl: ("TURBOPACK compile-time value", "https://teamkatalog.intern.nav.no/"),
    slackId: ("TURBOPACK compile-time value", "T5LNAMWNA"),
    defaultStartDate: ("TURBOPACK compile-time value", "2006-07-01") || '0001-01-01',
    disableRiskOwner: ("TURBOPACK compile-time value", "true"),
    disableDpProcess: ("TURBOPACK compile-time value", "false")
};
}),
"[project]/src/api/UserApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getUserInfo",
    ()=>getUserInfo
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
// Add auth cookie to rest calls
__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].defaults.withCredentials = true;
const getUserInfo = async ()=>__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/userinfo`);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/util/codeToFineText.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "tekster",
    ()=>tekster
]);
const tekster = {
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
}),
"[project]/src/service/User.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "EGroup",
    ()=>EGroup,
    "user",
    ()=>user
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$UserApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/UserApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/codeToFineText.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$permissionOverride$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/permissionOverride.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$UserApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$UserApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
const UserService = ()=>{
    let loaded = false;
    let userInfo = {
        loggedIn: false,
        groups: []
    };
    let error;
    const getMode = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$permissionOverride$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getPermissionMode"])();
    const fetchData = async ()=>{
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$UserApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getUserInfo"])().then((response)=>{
            if (response.status === 200) {
                handleGetResponse(response);
            }
        }).catch((error)=>{
            error = error.message;
            console.debug({
                error
            });
            loaded = true;
        });
    };
    const promise = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : Promise.resolve();
    const handleGetResponse = (response)=>{
        if (typeof response.data === 'object' && response.data !== null) {
            userInfo = response.data;
        } else {
            error = response.data;
            console.debug({
                error
            });
        }
        loaded = true;
    };
    const isLoggedIn = ()=>{
        return userInfo.loggedIn;
    };
    const getIdent = ()=>{
        return userInfo.ident ?? '';
    };
    const getEmail = ()=>{
        return userInfo.email ?? '';
    };
    const getName = ()=>{
        return userInfo.name ?? '';
    };
    const getGivenName = ()=>{
        return userInfo.givenName ?? '';
    };
    const getFamilyName = ()=>{
        return userInfo.familyName ?? '';
    };
    const getGroups = ()=>{
        return userInfo.groups;
    };
    const getGroupsHumanReadable = ()=>{
        return userInfo.groups.map((group)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["tekster"][group] || group);
    };
    const hasGroup = (group)=>{
        return getGroups().indexOf(group) >= 0;
    };
    const canRead = ()=>{
        return hasGroup("READ");
    };
    const canWrite = ()=>{
        const mode = getMode();
        if (mode === 'read') {
            return false;
        }
        const hasWrite = hasGroup("WRITE");
        const hasAdmin = hasGroup("ADMIN");
        const hasSuper = hasGroup("SUPER");
        if (mode === 'write') {
            return hasWrite || hasAdmin || hasSuper;
        }
        // mode === 'admin'
        return hasWrite || hasAdmin || hasSuper;
    };
    const isSuper = ()=>{
        return getMode() === 'admin' && hasGroup("SUPER");
    };
    const isAdmin = ()=>{
        return getMode() === 'admin' && hasGroup("ADMIN");
    };
    const wait = async ()=>{
        await promise;
    };
    const isLoaded = ()=>{
        return loaded;
    };
    return {
        isLoggedIn,
        getIdent,
        getEmail,
        getName,
        getGivenName,
        getFamilyName,
        getGroups,
        getGroupsHumanReadable,
        hasGroup,
        canRead,
        canWrite,
        isSuper,
        isAdmin,
        wait,
        isLoaded
    };
};
const user = UserService();
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/util/helper-functions.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__ = __turbopack_context__.i("[externals]/@navikt/ds-react [external] (@navikt/ds-react, esm_import, [project]/node_modules/@navikt/ds-react)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const isLink = (text)=>{
    const regex = /http[s]?:\/\/.*/gm;
    if (!regex.test(text)) {
        return false;
    }
    return true;
};
const shortenLinksInText = (text)=>{
    return text.split(/\s+/).map((word, index)=>{
        if (isLink(word)) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Tooltip"], {
                        content: word,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Link"], {
                            href: word,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            children: "se ekstern lenke"
                        }, void 0, false, {
                            fileName: "[project]/src/util/helper-functions.tsx",
                            lineNumber: 20,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/util/helper-functions.tsx",
                        lineNumber: 19,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    " "
                ]
            }, index, true, {
                fileName: "[project]/src/util/helper-functions.tsx",
                lineNumber: 18,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        } else {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                children: [
                    word,
                    " "
                ]
            }, index, true, {
                fileName: "[project]/src/util/helper-functions.tsx",
                lineNumber: 28,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        }
    });
};
const mapBool = (b)=>b === true ? true : b === false ? false : undefined;
const disableEnter = (event)=>{
    if (event.key === 'Enter') event.preventDefault();
};
const getNoDpiaLabel = (id)=>{
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
const checkForAaregDispatcher = (process)=>{
    return process.affiliation.disclosureDispatchers.find((disclosureDispatcher)=>disclosureDispatcher.shortName === 'Aa-reg');
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/api/DpProcessApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/helper-functions.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const getAllDpProcesses = async ()=>{
    const PAGE_SIZE = 100;
    const firstPage = await getDpProcessByPageAndSize(0, PAGE_SIZE);
    if (firstPage.pages === 1) {
        return firstPage.content.length > 0 ? [
            ...firstPage.content
        ] : [];
    } else {
        let AllDpProcesses = [
            ...firstPage.content
        ];
        for(let currentPage = 1; currentPage < firstPage.pages; currentPage++){
            AllDpProcesses = [
                ...AllDpProcesses,
                ...(await getDpProcessByPageAndSize(currentPage, PAGE_SIZE)).content
            ];
        }
        return AllDpProcesses;
    }
};
const getDpProcessByPageAndSize = async (pageNumber, pageSize)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/dpprocess?pageNumber=${pageNumber}&pageSize=${pageSize}`)).data;
};
const getDpProcessByDepartment = async (department)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/dpprocess/department/${department}`)).data;
};
const getDpProcessByProductTeam = async (productTeam)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/dpprocess/productTeam/${productTeam}`)).data;
};
const getDpProcess = async (id)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/dpprocess/${id}`)).data;
};
const searchDpProcess = async (text)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/dpprocess/search/${text}`)).data;
};
const createDpProcess = async (dpProcessFormValues)=>{
    const body = fromValuesToDpProcess(dpProcessFormValues);
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/dpprocess`, body)).data;
};
const updateDpProcess = async (id, dpProcess)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/dpprocess/${id}`, dpProcess)).data;
};
const deleteDpProcess = async (id)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/dpprocess/${id}`)).data;
};
const dpProcessToFormValues = (dpProcess)=>{
    const { affiliation, art10, art9, dataProcessingAgreements, description, end, externalProcessResponsible, id, name, purposeDescription, retention, start, subDataProcessing } = dpProcess || {};
    return {
        affiliation: {
            department: affiliation?.department?.code || '',
            nomDepartmentId: affiliation?.nomDepartmentId || '',
            nomDepartmentName: affiliation?.nomDepartmentName || '',
            seksjoner: affiliation?.seksjoner || [],
            fylker: affiliation?.fylker || [],
            navKontorer: affiliation?.navKontorer || [],
            subDepartments: affiliation?.subDepartments.map((sd)=>sd.code) || [],
            productTeams: affiliation?.productTeams || [],
            products: affiliation?.products.map((p)=>p.code) || [],
            disclosureDispatchers: affiliation?.disclosureDispatchers.map((d)=>d.code) || []
        },
        art10: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(art10),
        art9: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(art9),
        dataProcessingAgreements: dataProcessingAgreements || [],
        description: description || '',
        end: end || undefined,
        externalProcessResponsible: externalProcessResponsible && externalProcessResponsible.code || undefined,
        subDataProcessing: {
            dataProcessor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(subDataProcessing?.dataProcessor),
            processors: subDataProcessing?.processors || []
        },
        id: id,
        name: name || '',
        purposeDescription: purposeDescription || '',
        retention: {
            retentionMonths: retention?.retentionMonths || 0,
            retentionStart: retention?.retentionStart || ''
        },
        start: start || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].defaultStartDate
    };
};
const fromValuesToDpProcess = (values)=>{
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/api/CodelistApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const getAllCodelists = async (refresh)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/codelist?refresh=${refresh ? 'true' : 'false'}`)).data;
};
const getCodelistUsageByListName = async (listname)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/codelist/usage/find/${listname}`)).data;
};
const getCodelistUsage = async (listname, code)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/codelist/usage/find/${listname}/${code}`)).data;
};
const replaceCodelistUsage = async (listname, oldCode, newCode, newCodeName)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/codelist/usage/replace`, {
        list: listname,
        oldCode,
        newCode,
        newCodeName
    })).data;
};
const createCodelist = async (code)=>{
    return __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/codelist`, [
        code
    ]);
};
const updateCodelist = async (code)=>{
    return __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/codelist`, [
        code
    ]);
};
const deleteCodelist = async (list, code)=>{
    return __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/codelist/${list}/${code}`);
};
const getAllCountries = async ()=>(await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/codelist/countries`)).data;
const getCountriesOutsideEUEEA = async ()=>(await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/codelist/countriesoutsideeea`)).data;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/util/clipboard.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "copyToClipboard",
    ()=>copyToClipboard
]);
const copyToClipboard = (text)=>{
    const el = document.createElement('textarea');
    el.innerText = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    el.remove();
};
}),
"[project]/src/util/hooks/customHooks.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
function useDebouncedState(initialValue, delay) {
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initialValue);
    const [debouncedValue, setDebouncedValue] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(value);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handler = setTimeout(()=>{
            setDebouncedValue(value);
        }, delay);
        return ()=>{
            clearTimeout(handler);
        };
    }, [
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
function useForceUpdate() {
    const [val, setVal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    return ()=>setVal(val + 1);
}
function useUpdateOnChange(value) {
    const update = useForceUpdate();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        update();
    }, [
        value
    ]);
}
function useAwait(promise, setLoading) {
    const update = useForceUpdate();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        ;
        (async ()=>{
            if (setLoading) {
                setLoading(true);
            }
            await promise;
            update();
            if (setLoading) {
                setLoading(false);
            }
        })();
    }, []);
}
function useRefs(ids) {
    const refs = ids.reduce((acc, value)=>{
        acc[value] = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createRef"])();
        return acc;
    }, {}) || {};
    return refs;
}
function useQuery() {
    if ("TURBOPACK compile-time truthy", 1) return new URLSearchParams();
    //TURBOPACK unreachable
    ;
    const location = undefined;
}
function useQueryParam(queryParam) {
    return useQuery().get(queryParam) || undefined;
}
}),
"[project]/src/util/hooks/table.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SORT_DIRECTION",
    ()=>SORT_DIRECTION,
    "useTable",
    ()=>useTable
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
const SORT_DIRECTION = {
    ASC: 'ASC',
    DESC: 'DESC'
};
const newSort = (newColumn, columnPrevious, directionPrevious)=>{
    const newDirection = columnPrevious && newColumn === columnPrevious && directionPrevious === SORT_DIRECTION.ASC ? SORT_DIRECTION.DESC : SORT_DIRECTION.ASC;
    return {
        newDirection,
        newColumn
    };
};
const getSortFunction = (sortColumn, useDefaultStringCompare, sorting)=>{
    if (!sorting) {
        if (useDefaultStringCompare) {
            return (a, b)=>a[sortColumn].localeCompare(b[sortColumn]);
        } else {
            return undefined;
        }
    }
    return sorting[sortColumn];
};
const toDirection = (direction, column)=>{
    const newDirection = {};
    newDirection[column] = direction;
    return newDirection;
};
const useTable = (initialData, config)=>{
    const { sorting, useDefaultStringCompare, showLast } = config || {};
    const initialSort = newSort(config?.initialSortColumn);
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initialData);
    const [isInitialSort, setIsInitialSort] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [sortDirection, setSortDirection] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initialSort.newDirection);
    const [sortColumn, setSortColumn] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initialSort.newColumn);
    const [direction, setDirection] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(toDirection(initialSort.newDirection, initialSort.newColumn));
    const sortTableData = ()=>{
        if (sortColumn) {
            const sortFunct = getSortFunction(sortColumn, !!useDefaultStringCompare, sorting);
            if (!sortFunct) {
                console.warn(`invalid sort column ${String(sortColumn)} no sort function supplied`);
            } else {
                try {
                    const sorted = initialData.slice(0).sort(sortFunct);
                    let ordered = sortDirection === SORT_DIRECTION.ASC ? sorted : sorted.reverse();
                    if (showLast && isInitialSort) {
                        ordered = [
                            ...ordered.filter((order)=>!showLast(order)),
                            ...ordered.filter(showLast)
                        ];
                    }
                    return ordered;
                } catch (error) {
                    console.error('Error during sort of ', initialData, sortFunct, error);
                }
            }
        }
        return initialData;
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>setData(sortTableData()), [
        sortColumn,
        sortDirection,
        initialData
    ]);
    const sort = (sortColumnName)=>{
        const { newDirection, newColumn } = newSort(sortColumnName, sortColumn, sortDirection);
        setSortColumn(newColumn);
        setSortDirection(newDirection);
        setDirection(toDirection(newDirection, newColumn));
        setIsInitialSort(false);
    };
    const state = {
        data,
        direction,
        sortColumn,
        sortDirection
    };
    return [
        state,
        sort
    ];
};
}),
"[project]/src/util/hooks/index.ts [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$table$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/table.ts [ssr] (ecmascript)");
;
;
}),
"[project]/src/util/theme.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
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
const primitives = {
    primary: 'var(--a-surface-action)',
    primary50: 'var(--a-surface-subtle)',
    primary100: 'var(--a-surface-subtle)',
    primary150: 'var(--a-surface-subtle)',
    primary200: 'var(--a-border-action)',
    primary300: 'var(--a-surface-action)',
    primary400: 'var(--a-surface-action)'
};
const chartColor = {
    generalBlue: '#409FDD',
    generalRed: '#FF7983',
    generalMustard: '#FFCC40',
    lightGreen: '#C9EA95',
    orange: '#FFAB66',
    darkGreen: '#408DA0'
};
const searchResultColor = {
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
const theme = {
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
}),
"[project]/src/util/index.tsx [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$clipboard$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/clipboard.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/hooks/index.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/theme.ts [ssr] (ecmascript)");
;
;
;
;
}),
"[project]/src/constants.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
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
const TRANSFER_GROUNDS_OUTSIDE_EU_OTHER = 'OTHER';
const getPolicySort = (codelistUtils)=>{
    return {
        purposes: (a, b)=>codelistUtils && codelistUtils.getShortnameForCode(a.purposes[0]).localeCompare(codelistUtils.getShortnameForCode(b.purposes[0]), 'nb'),
        informationType: (a, b)=>a.informationType.name.localeCompare(b.informationType.name),
        process: (a, b)=>(a.process?.name || '').localeCompare(b.process?.name || ''),
        subjectCategories: (a, b)=>codelistUtils && codelistUtils.getShortnameForCode(a.subjectCategories[0]).localeCompare(codelistUtils.getShortnameForCode(b.subjectCategories[0]), 'nb'),
        legalBases: (a, b)=>a.legalBases.length - b.legalBases.length
    };
};
const disclosureSort = {
    name: (a, b)=>(a.name || '').localeCompare(b.name || ''),
    recipient: (a, b)=>a.recipient.shortName.localeCompare(b.recipient.shortName),
    recipientPurpose: (a, b)=>a.recipientPurpose.localeCompare(b.recipientPurpose),
    document: (a, b)=>(a.document?.name || '').localeCompare(b.document?.name || ''),
    description: (a, b)=>a.description.localeCompare(b.description),
    legalBases: (a, b)=>a.legalBases.length - b.legalBases.length
};
const informationTypeSort = {
    name: (a, b)=>(a.name || '').localeCompare(b.name || ''),
    description: (a, b)=>(a.description || '').localeCompare(b.description || ''),
    orgMaster: (a, b)=>(a.orgMaster?.shortName || '').localeCompare(b.orgMaster?.shortName || ''),
    term: (a, b)=>(a.term || '').localeCompare(b.term || '')
};
const documentSort = {
    informationType: (a, b)=>a.informationType.name.localeCompare(b.informationType.name),
    subjectCategories: (a, b)=>a.subjectCategories.length - b.subjectCategories.length
};
const getProcessSort = (codelistUtils)=>{
    return {
        name: (a, b)=>a.name.localeCompare(b.name),
        purposes: (a, b)=>codelistUtils.getShortnameForCode(a.purposes[0]).localeCompare(codelistUtils.getShortnameForCode(b.purposes[0]), 'nb'),
        affiliation: (a)=>(a.affiliation.department?.shortName || '').localeCompare(a.affiliation.department?.shortName || '')
    };
};
const dpProcessSort = {
    name: (a, b)=>a.name.localeCompare(b.name),
    externalProcessResponsible: (a, b)=>(a.externalProcessResponsible?.shortName || '').localeCompare(b.externalProcessResponsible?.shortName || ''),
    affiliation: (a)=>(a.affiliation.department?.shortName || '').localeCompare(a.affiliation.department?.shortName || ''),
    description: (a, b)=>(a.description || '').localeCompare(b.description || ''),
    changeStamp: (a, b)=>(a.changeStamp.lastModifiedBy || '').localeCompare(b.changeStamp.lastModifiedBy || '')
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
}),
"[project]/src/api/PolicyApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$shortid__$5b$external$5d$__$28$shortid$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$shortid$29$__ = __turbopack_context__.i("[externals]/shortid [external] (shortid, cjs, [project]/node_modules/shortid)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const getPoliciesForInformationType = async (informationTypeId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/policy?informationTypeId=${informationTypeId}`)).data;
};
const getPolicy = async (policyId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/policy/${policyId}`)).data;
};
const createPolicy = async (policy)=>{
    const body = mapPolicyFromForm(policy);
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/policy`, [
        body
    ])).data.content[0];
};
const createPolicies = async (policies)=>{
    const body = policies.map(mapPolicyFromForm);
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/policy`, body)).data.content;
};
const updatePolicy = async (policy)=>{
    const body = mapPolicyFromForm(policy);
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/policy/${policy.id}`, body)).data;
};
const deletePolicy = async (policyId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/policy/${policyId}`)).data;
};
const deletePoliciesByProcessId = async (processId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/policy/process/${processId}`)).data;
};
const mapPolicyFromForm = (values)=>{
    return {
        ...values,
        subjectCategories: values.subjectCategories,
        informationType: undefined,
        informationTypeId: values.informationType?.id,
        process: undefined,
        processId: values.process.id,
        legalBases: values.legalBasesUse !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["ELegalBasesUse"].DEDICATED_LEGAL_BASES ? [] : values.legalBases,
        legalBasesUse: values.legalBasesUse
    };
};
const convertLegalBasesToFormValues = (legalBases)=>(legalBases || []).map((legalBasis)=>({
            gdpr: legalBasis.gdpr && legalBasis.gdpr.code,
            nationalLaw: legalBasis.nationalLaw && legalBasis.nationalLaw.code || undefined,
            description: legalBasis.description || undefined,
            key: __TURBOPACK__imported__module__$5b$externals$5d2f$shortid__$5b$external$5d$__$28$shortid$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$shortid$29$__["default"].generate()
        }));
const convertPolicyToFormValues = (policy, otherPolicies)=>({
        legalBasesOpen: false,
        id: policy.id,
        process: policy.process,
        purposes: policy.purposes.map((p)=>p.code),
        informationType: policy.informationType,
        subjectCategories: policy.subjectCategories.map((code)=>code.code),
        legalBasesUse: policy.legalBasesUse,
        legalBases: convertLegalBasesToFormValues(policy.legalBases),
        documentIds: policy.documentIds || [],
        otherPolicies
    });
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/api/DisclosureApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/helper-functions.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/PolicyApi.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
const getAllDisclosures = async (pageSize, pageNumber)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/disclosure?pageSize=${pageSize}&pageNumber=${pageNumber}`)).data.content;
};
const getDisclosure = async (disclosureId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/disclosure/${disclosureId}`)).data;
};
const getDisclosuresByPageAndPageSize = async (pageNumber, pageSize)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/disclosure?pageNumber=${pageNumber}&pageSize=${pageSize}`)).data;
};
const getDisclosureSummaries = async ()=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/disclosure/summary`)).data;
};
const getDisclosuresWithEmptyLegalBases = async ()=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/disclosure?emptyLegalBases=true`)).data.content;
};
const getDisclosuresByRecipient = async (recipient)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/disclosure?recipient=${recipient}`)).data.content;
};
const getDisclosuresByProcessId = async (processId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/disclosure?processId=${processId}`)).data.content;
};
const getDisclosuresByInformationTypeId = async (informationTypeId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/disclosure?informationTypeId=${informationTypeId}`)).data.content;
};
const searchDisclosure = async (text)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/disclosure/search/${text}`)).data;
};
const getDisclosureByDepartment = async (department)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/disclosure/department/${department}`)).data;
};
const getDisclosureByProductTeam = async (productTeam)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/disclosure/productTeam/${productTeam}`)).data;
};
const createDisclosure = async (disclosure)=>{
    const body = convertFormValuesToDisclosure(disclosure);
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/disclosure`, body)).data;
};
const updateDisclosure = async (disclosure)=>{
    const body = convertFormValuesToDisclosure(disclosure);
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/disclosure/${body.id}`, body)).data;
};
const deleteDisclosure = async (disclosureId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/disclosure/${disclosureId}`)).data;
};
const convertFormValuesToDisclosure = (values)=>{
    return {
        id: values.id,
        recipient: values.recipient,
        name: values.name,
        recipientPurpose: values.recipientPurpose,
        description: values.description,
        documentId: values.document?.id,
        legalBases: values.legalBases ? values.legalBases : [],
        start: values.start,
        end: values.end,
        processIds: values.processIds.length > 0 ? values.processIds : values.processes.map((p)=>p.id) || [],
        informationTypeIds: values.informationTypes ? values.informationTypes.map((i)=>i.id) : [],
        abroad: {
            abroad: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(values.abroad.abroad),
            countries: values.abroad.countries,
            refToAgreement: values.abroad.refToAgreement,
            businessArea: values.abroad.businessArea
        },
        administrationArchiveCaseNumber: values.administrationArchiveCaseNumber,
        thirdCountryReceiver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(values.thirdCountryReceiver),
        assessedConfidentiality: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(values.assessedConfidentiality),
        confidentialityDescription: values.confidentialityDescription,
        productTeams: values.productTeams,
        department: values.department,
        nomDepartmentId: values.nomDepartmentId,
        nomDepartmentName: values.nomDepartmentName
    };
};
const convertDisclosureToFormValues = (disclosure)=>{
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
        legalBases: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["convertLegalBasesToFormValues"])(disclosure?.legalBases || []),
        legalBasesOpen: false,
        start: disclosure.start || undefined,
        end: disclosure.end || undefined,
        processes: disclosure.processes || [],
        informationTypes: disclosure.informationTypes || [],
        abroad: {
            abroad: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(disclosure.abroad.abroad),
            countries: disclosure.abroad.countries || [],
            refToAgreement: disclosure.abroad.refToAgreement || '',
            businessArea: disclosure.abroad.businessArea || ''
        },
        productTeams: disclosure.productTeams || [],
        department: disclosure?.department?.code || '',
        nomDepartmentId: disclosure?.nomDepartmentId || '',
        nomDepartmentName: disclosure?.nomDepartmentName || '',
        processIds: disclosure.processIds || [],
        administrationArchiveCaseNumber: disclosure.administrationArchiveCaseNumber || '',
        thirdCountryReceiver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(disclosure.thirdCountryReceiver),
        assessedConfidentiality: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(disclosure.assessedConfidentiality),
        confidentialityDescription: disclosure.confidentialityDescription || ''
    };
};
const useDisclosureSearch = ()=>{
    const [disclosureSearch, setDisclosureSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useDebouncedState"])('', 200);
    const [disclosureSearchResult, setDisclosureSearchResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        ;
        (async ()=>{
            if (disclosureSearch && disclosureSearch.length > 2) {
                setLoading(true);
                setDisclosureSearchResult((await searchDisclosure(disclosureSearch)).content);
                setLoading(false);
            } else {
                setDisclosureSearchResult([]);
            }
        })();
    }, [
        disclosureSearch
    ]);
    return [
        disclosureSearchResult,
        setDisclosureSearch,
        loading
    ];
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/api/SettingsApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getSettings",
    ()=>getSettings,
    "writeSettings",
    ()=>writeSettings
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const getSettings = async ()=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/settings`)).data;
};
const writeSettings = async (settings)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/settings`, settings)).data;
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/api/DocumentApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$SettingsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/SettingsApi.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$SettingsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$SettingsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const getDocument = async (documentId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/document/${documentId}`)).data;
};
const getDocumentByPageAndPageSize = async (pageNumber, pageSize)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/document?pageNumber=${pageNumber}&pageSize=${pageSize}`)).data;
};
const getDefaultProcessDocument = async ()=>{
    const settings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$SettingsApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getSettings"])();
    return await getDocument(settings.defaultProcessDocument);
};
const getDocumentsForInformationType = async (informationTypeId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/document?informationTypeId=${informationTypeId}`)).data;
};
const searchDocuments = async (name)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/document/search/${name}`)).data;
};
const updateInformationTypesDocument = async (document)=>{
    const body = mapFormValuesToDocument(document);
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/document/${document.id}`, body)).data;
};
const createInformationTypesDocument = async (document)=>{
    const body = mapFormValuesToDocument(document);
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/document`, body)).data;
};
const deleteDocument = async (id)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/document/${id}`)).data;
};
const mapFormValuesToDocument = (document)=>({
        id: document.id ? document.id : undefined,
        name: document.name,
        description: document.description,
        informationTypes: document.informationTypes.map((it)=>({
                informationTypeId: it.informationTypeId,
                subjectCategories: it.subjectCategories.map((sc)=>sc.code)
            })),
        dataAccessClass: document.dataAccessClass
    });
const useDocumentSearch = ()=>{
    const [documentSearch, setDocumentSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useDebouncedState"])('', 200);
    const [documentSearchResult, setDocumentSearchResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        ;
        (async ()=>{
            if (documentSearch && documentSearch.length > 2) {
                setLoading(true);
                setDocumentSearchResult((await searchDocuments(documentSearch)).content);
                setLoading(false);
            } else {
                setDocumentSearchResult([]);
            }
        })();
    }, [
        documentSearch
    ]);
    return [
        documentSearchResult,
        setDocumentSearch,
        loading
    ];
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/api/InfoTypeApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$query$2d$string__$5b$external$5d$__$28$query$2d$string$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$query$2d$string$29$__ = __turbopack_context__.i("[externals]/query-string [external] (query-string, esm_import, [project]/node_modules/query-string)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$query$2d$string__$5b$external$5d$__$28$query$2d$string$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$query$2d$string$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$query$2d$string__$5b$external$5d$__$28$query$2d$string$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$query$2d$string$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const getInformationTypes = async (page, limit)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/informationtype?pageNumber=${page - 1}&pageSize=${limit}`)).data;
};
const getInformationTypesShort = async ()=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/informationtype/short`)).data.content;
};
const getInformationTypesBy = async (params)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/informationtype?${__TURBOPACK__imported__module__$5b$externals$5d2f$query$2d$string__$5b$external$5d$__$28$query$2d$string$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$query$2d$string$29$__["default"].stringify(params, {
        skipNull: true
    })}`)).data;
};
const searchInformationType = async (text)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/informationtype/search`, {
        params: {
            name: text
        }
    })).data;
};
const getInformationType = async (informationTypeId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/informationtype/${informationTypeId}`)).data;
};
const deleteInformationType = async (informationTypeId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/informationtype/${informationTypeId}`)).data;
};
const createInformationType = async (informationType)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/informationtype`, [
        informationType
    ])).data.content[0];
};
const updateInformationType = async (informationType)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/informationtype/${informationType.id}`, informationType)).data;
};
const useInfoTypeSearch = ()=>{
    const [infoTypeSearch, setInfoTypeSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useDebouncedState"])('', 200);
    const [infoTypeSearchResult, setInfoTypeSearchResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const search = async ()=>{
            if (infoTypeSearch && infoTypeSearch.length > 2) {
                setLoading(true);
                const res = await searchInformationType(infoTypeSearch);
                setInfoTypeSearchResult(res.content);
                setLoading(false);
            }
        };
        search();
    }, [
        infoTypeSearch
    ]);
    return [
        infoTypeSearchResult,
        infoTypeSearch,
        setInfoTypeSearch,
        loading
    ];
};
const mapInfoTypeToFormVals = (data)=>{
    return {
        id: data.id,
        name: data.name || '',
        term: data.term || '',
        sensitivity: data.sensitivity?.code || '',
        categories: data?.categories?.map((c)=>c.code) || [],
        sources: data?.sources?.map((c)=>c.code) || [],
        productTeams: data.productTeams || [],
        keywords: data.keywords || [],
        description: data.description || '',
        orgMaster: data.orgMaster?.code || ''
    };
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/api/ProcessApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$query$2d$string__$5b$external$5d$__$28$query$2d$string$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$query$2d$string$29$__ = __turbopack_context__.i("[externals]/query-string [external] (query-string, esm_import, [project]/node_modules/query-string)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/helper-functions.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/PolicyApi.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$query$2d$string__$5b$external$5d$__$28$query$2d$string$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$query$2d$string$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$query$2d$string__$5b$external$5d$__$28$query$2d$string$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$query$2d$string$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
const getProcess = async (processId)=>{
    const data = (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/process/${processId}`)).data;
    data.policies.forEach((p)=>p.process = {
            ...data,
            policies: []
        });
    return data;
};
const getProcessByStateAndStatus = async (processField, processState, processStatus = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EProcessStatusFilter"].All)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/process/state?processField=${processField}&processState=${processState}&processStatus=${processStatus}`)).data.content;
};
const getProcessByStateAndStatusForProductArea = async (processField, processState, processStatus = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EProcessStatusFilter"].All, productreaId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/process/state?processField=${processField}&processState=${processState}&processStatus=${processStatus}&productAreaId=${productreaId}`)).data.content;
};
const getProcessByStateAndStatusForDepartment = async (processField, processState, processStatus = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EProcessStatusFilter"].All, departmentCode)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/process/state?processField=${processField}&processState=${processState}&processStatus=${processStatus}&department=${departmentCode}`)).data.content;
};
const searchProcess = async (text)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/process/search/${text}`)).data;
};
const getProcessesByPurpose = async (text)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/process/purpose/${text}`)).data;
};
const getProcessesByProcessor = async (processorId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/process?pageNumber=0&pageSize=200&processorId=${processorId}`)).data;
};
const getProcessesFor = async (params)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/process?${__TURBOPACK__imported__module__$5b$externals$5d2f$query$2d$string__$5b$external$5d$__$28$query$2d$string$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$query$2d$string$29$__["default"].stringify(params, {
        skipNull: true
    })}&pageSize=250`)).data;
};
const getProcessPurposeCount = async (query)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/process/count?${query}`)).data;
};
const createProcess = async (process)=>{
    const body = convertFormValuesToProcess(process);
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/process`, body)).data;
};
const deleteProcess = async (processId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/process/${processId}`)).data;
};
const updateProcess = async (process)=>{
    const body = convertFormValuesToProcess(process);
    const data = (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/process/${process.id}`, body)).data;
    data.policies.forEach((p)=>p.process = {
            ...data,
            policies: []
        });
    return data;
};
const getRecentEditedProcesses = async ()=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/process/myedits`)).data.content;
};
const convertProcessToFormValues = (process)=>{
    const { id, purposes, name, description, additionalDescription, affiliation, commonExternalProcessResponsible, legalBases, start, end, usesAllInformationTypes, automaticProcessing, profiling, aiUsageDescription, dataProcessing, retention, dpia, status } = process || {};
    return {
        legalBasesOpen: false,
        id: id,
        name: name || '',
        description: description || '',
        additionalDescription: additionalDescription || '',
        purposes: purposes?.map((p)=>p.code) || [],
        affiliation: {
            department: affiliation?.department?.code || '',
            nomDepartmentId: affiliation?.nomDepartmentId || '',
            nomDepartmentName: affiliation?.nomDepartmentName || '',
            seksjoner: affiliation?.seksjoner || [],
            fylker: affiliation?.fylker || [],
            navKontorer: affiliation?.navKontorer || [],
            subDepartments: affiliation?.subDepartments.map((sd)=>sd.code) || [],
            productTeams: affiliation?.productTeams || [],
            products: affiliation?.products.map((p)=>p.code) || [],
            disclosureDispatchers: affiliation?.disclosureDispatchers.map((d)=>d.code) || []
        },
        commonExternalProcessResponsible: commonExternalProcessResponsible && commonExternalProcessResponsible.code || undefined,
        legalBases: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["convertLegalBasesToFormValues"])(legalBases),
        start: start || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].defaultStartDate,
        end: end || undefined,
        usesAllInformationTypes: process && !!usesAllInformationTypes,
        automaticProcessing: process ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(automaticProcessing) : false,
        profiling: process ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(profiling) : false,
        aiUsageDescription: {
            aiUsage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(aiUsageDescription?.aiUsage),
            description: aiUsageDescription?.description || '',
            reusingPersonalInformation: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(aiUsageDescription?.reusingPersonalInformation),
            startDate: aiUsageDescription?.startDate || undefined,
            endDate: aiUsageDescription?.endDate || undefined,
            registryNumber: aiUsageDescription?.registryNumber || ''
        },
        dataProcessing: {
            dataProcessor: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(dataProcessing?.dataProcessor),
            processors: dataProcessing?.processors || []
        },
        retention: {
            retentionPlan: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(retention?.retentionPlan),
            retentionMonths: retention?.retentionMonths || 0,
            retentionStart: retention?.retentionStart || '',
            retentionDescription: retention?.retentionDescription || ''
        },
        status: status || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EProcessStatus"].IN_PROGRESS,
        dpia: {
            grounds: dpia?.grounds || '',
            needForDpia: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$helper$2d$functions$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["mapBool"])(dpia?.needForDpia),
            processImplemented: dpia?.processImplemented || false,
            refToDpia: dpia?.refToDpia || '',
            riskOwner: dpia?.riskOwner || '',
            riskOwnerFunction: dpia?.riskOwnerFunction || '',
            noDpiaReasons: dpia?.noDpiaReasons || []
        },
        disclosures: []
    };
};
const convertFormValuesToProcess = (values)=>{
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
            grounds: values.dpia?.needForDpia ? '' : (values.dpia.noDpiaReasons || []).filter((r)=>r === 'OTHER').length > 0 ? values.dpia?.grounds : '',
            needForDpia: values.dpia.needForDpia,
            refToDpia: values.dpia?.needForDpia ? values.dpia.refToDpia : '',
            processImplemented: values.dpia?.processImplemented,
            riskOwner: values.dpia?.riskOwner,
            riskOwnerFunction: values.dpia?.riskOwnerFunction,
            noDpiaReasons: values.dpia.noDpiaReasons || []
        }
    };
};
const useProcessSearch = ()=>{
    const [processSearch, setProcessSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useDebouncedState"])('', 200);
    const [processSearchResult, setProcessSearchResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        ;
        (async ()=>{
            if (processSearch && processSearch.length > 2) {
                setLoading(true);
                setProcessSearchResult((await searchProcess(processSearch)).content);
                setLoading(false);
            } else {
                setProcessSearchResult([]);
            }
        })();
    }, [
        processSearch
    ]);
    return [
        processSearchResult,
        setProcessSearch,
        loading
    ];
};
const searchProcessOptions = async (searchParam)=>{
    if (searchParam && searchParam.length > 2) {
        const behandlinger = (await searchProcess(searchParam)).content;
        if (behandlinger && behandlinger.length) {
            return behandlinger.map((behandling)=>{
                return {
                    value: behandling.id,
                    label: 'B' + behandling.number + ' ' + behandling.purposes[0].shortName + ': ' + behandling.name,
                    ...behandling
                };
            });
        }
    }
    return [];
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/api/DashboardApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getDashboard",
    ()=>getDashboard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const getDashboard = async (filter)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/dash?filter=${filter}`)).data;
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/api/TeamApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const defaultTeam = (teamId)=>({
        id: teamId,
        name: teamId,
        description: '',
        productAreaId: undefined,
        slackChannel: undefined,
        tags: [],
        members: []
    });
const teamPromiseCache = new Map();
const getAllTeams = async ()=>{
    const data = (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/team`)).data;
    return data;
};
const getTeam = async (teamId)=>{
    const cached = teamPromiseCache.get(teamId);
    if (cached) return cached;
    const promise = (async ()=>{
        try {
            const data = (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/team/${teamId}`)).data;
            data.members = data.members.sort((a, b)=>(a.name || '').localeCompare(b.name || ''));
            return data;
        } catch (error) {
            if (__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].isAxiosError(error) && error.response?.status === 404) {
                return defaultTeam(teamId);
            }
            teamPromiseCache.delete(teamId);
            throw error;
        }
    })();
    teamPromiseCache.set(teamId, promise);
    return promise;
};
const searchTeam = async (teamSearch)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/team/search/${teamSearch}`)).data;
};
const getAllProductAreas = async ()=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/team/productarea`)).data.content;
};
const getProductArea = async (paId)=>{
    const data = (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/team/productarea/${paId}`)).data;
    data.members = data.members.sort((a, b)=>(a.name || '').localeCompare(b.name || ''));
    return data;
};
const searchProductArea = async (search)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/team/productarea/search/${search}`)).data;
};
const getResourceById = async (resourceId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/team/resource/${resourceId}`)).data;
};
const searchResourceByName = async (resourceName)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/team/resource/search/${resourceName}`)).data;
};
const getResourcesByIds = async (ids)=>{
    const resourcesPromise = [];
    for (const id of ids){
        resourcesPromise.push(getResourceById(id));
    }
    return resourcesPromise.length > 0 ? await Promise.all(resourcesPromise) : [];
};
const mapTeamResourceToOption = (teamResource)=>({
        value: teamResource.navIdent,
        label: teamResource.fullName
    });
const mapTeamToOption = (team, index)=>({
        value: team.id,
        label: team.name,
        index
    });
const useTeamSearch = ()=>{
    const [teamSearch, setTeamSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useDebouncedState"])('', 200);
    const [searchResult, setInfoTypeSearchResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const search = async ()=>{
            if (teamSearch && teamSearch.length > 2) {
                setLoading(true);
                const res = await searchTeam(teamSearch);
                const options = res.content.map(mapTeamToOption);
                setInfoTypeSearchResult(options);
                setLoading(false);
            }
        };
        search();
    }, [
        teamSearch
    ]);
    return [
        searchResult,
        setTeamSearch,
        loading
    ];
};
const useTeamSearchOptions = async (searchParam)=>{
    if (searchParam && searchParam.length > 2) {
        const teams = (await searchTeam(searchParam)).content;
        const searchResult = teams.map((team)=>{
            return {
                ...team,
                value: team.id,
                label: team.name
            };
        });
        return searchResult;
    }
    return [];
};
const useTeamResourceSearchOptions = async (searchParam)=>{
    if (searchParam && searchParam.length > 2) {
        const teams = (await searchResourceByName(searchParam)).content;
        return teams.map(mapTeamResourceToOption);
    }
    return [];
};
const useTeamResourceSearch = ()=>{
    const [teamResourceSearch, setTeamResourceSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useDebouncedState"])('', 200);
    const [searchResult, setInfoTypeSearchResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const search = async ()=>{
            if (teamResourceSearch && teamResourceSearch.length > 2) {
                setLoading(true);
                const res = await searchResourceByName(teamResourceSearch);
                const options = res.content.map(mapTeamResourceToOption);
                setInfoTypeSearchResult(options);
                setLoading(false);
            }
        };
        search();
    }, [
        teamResourceSearch
    ]);
    return [
        searchResult,
        setTeamResourceSearch,
        loading
    ];
};
const useAllAreas = ()=>{
    const [areas, setAreas] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        ;
        (async ()=>getAllProductAreas().then(setAreas))();
    }, []);
    return areas;
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/api/TermApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
const getTerm = async (termId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/term/${termId}`)).data;
};
const searchTerm = async (termSearch)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/term/search/${termSearch}`)).data;
};
const mapTermToOption = (term)=>({
        value: term.id,
        label: term.name + ' - ' + term.description
    });
const useTermSearch = ()=>{
    const [termSearch, setTermSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useDebouncedState"])('', 200);
    const [searchResult, setInfoTypeSearchResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const search = async ()=>{
            if (termSearch && termSearch.length > 2) {
                setLoading(true);
                const res = await searchTerm(termSearch);
                const options = res.content.map(mapTermToOption);
                setInfoTypeSearchResult(options);
                setLoading(false);
            }
        };
        search();
    }, [
        termSearch
    ]);
    return [
        searchResult,
        setTermSearch,
        loading
    ];
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/api/GetAllApi.ts [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "getAll",
    ()=>getAll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$CodelistApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/CodelistApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$UserApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/UserApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DisclosureApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/DisclosureApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DocumentApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/DocumentApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$InfoTypeApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/InfoTypeApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/PolicyApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$ProcessApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/ProcessApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DashboardApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/DashboardApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TeamApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/TeamApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TermApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/TermApi.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$CodelistApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$UserApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DisclosureApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DocumentApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$InfoTypeApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$ProcessApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DashboardApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TeamApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TermApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$CodelistApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$UserApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DisclosureApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DocumentApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$InfoTypeApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$PolicyApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$ProcessApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DashboardApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TeamApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TermApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
const getAll = (fetcher)=>async ()=>{
        const PAGE_SIZE = 100;
        const firstPage = await fetcher(0, PAGE_SIZE);
        if (firstPage.pages < 2) {
            return [
                ...firstPage.content
            ];
        } else {
            let all = [
                ...firstPage.content
            ];
            for(let currentPage = 1; currentPage < firstPage.pages; currentPage++){
                all = [
                    ...all,
                    ...(await fetcher(currentPage, PAGE_SIZE)).content
                ];
            }
            return all;
        }
    };
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/api/NomApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const getAllNomAvdelinger = async ()=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/nom/avdelinger`)).data.content;
};
const getSeksjonerForNomAvdeling = async (avdelingId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/nom/seksjon/avdeling/${avdelingId}`)).data;
};
const getAvdelingByNomId = async (id)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/nom/avdeling/${id}`)).data;
};
const getByNomId = async (id)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/nom/${id}`)).data;
};
const getAllNomFylker = async ()=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/nom/fylker`)).data;
};
const searchNavKontorByName = async (searchTerm)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/nom/nav-kontor/${searchTerm}`)).data;
};
const getAvdelingOptions = async ()=>{
    const avdelinger = await getAllNomAvdelinger();
    if (avdelinger && avdelinger.length) {
        return avdelinger.map((avdeling)=>{
            return {
                value: avdeling.id,
                label: avdeling.navn
            };
        }).sort((a, b)=>a.label.localeCompare(b.label));
    }
    return [];
};
const getSeksjonOptions = async (avdelingId)=>{
    const seksjoner = await getSeksjonerForNomAvdeling(avdelingId);
    if (seksjoner && seksjoner.length) {
        return seksjoner.map((seksjon)=>{
            return {
                value: seksjon.id,
                label: seksjon.navn
            };
        }).sort((a, b)=>a.label.localeCompare(b.label));
    }
    return [];
};
const getFylkerOptions = async ()=>{
    const fylker = await getAllNomFylker();
    if (fylker && fylker.length) {
        return fylker.map((fylke)=>{
            return {
                value: fylke.id,
                label: fylke.navn
            };
        }).sort((a, b)=>a.label.localeCompare(b.label));
    }
    return [];
};
const getAvdelingSearchItem = async (search, list, typeName, backgroundColor)=>{
    const avdelinger = await getAllNomAvdelinger();
    if (avdelinger && avdelinger.length) {
        return avdelinger.filter((avdeling)=>avdeling.navn.toLowerCase().indexOf(search.toLowerCase()) >= 0).map((avdeling)=>({
                id: avdeling.id,
                sortKey: avdeling.navn,
                label: avdeling.navn,
                type: list,
                typeName: typeName,
                tagColor: backgroundColor || ''
            }));
    } else {
        return [];
    }
};
const searchNavKontorOptions = async (searchParam)=>{
    if (searchParam && searchParam.length > 2) {
        const navKontorer = await searchNavKontorByName(searchParam);
        if (navKontorer && navKontorer.length) {
            return navKontorer.map((navKontor)=>{
                return {
                    value: navKontor.id,
                    label: navKontor.navn
                };
            });
        }
    }
    return [];
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/service/Codelist.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$GetAllApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/api/GetAllApi.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$CodelistApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/CodelistApi.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$GetAllApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$CodelistApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$GetAllApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$CodelistApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
const ARTICLE_6_PREFIX = 'ART6';
const ARTICLE_9_PREFIX = 'ART9';
const NATIONAL_LAW_GDPR_ARTICLES = [
    'ART61C',
    'ART61E'
];
const DESCRIPTION_GDPR_ARTICLES = [
    'ART61C',
    'ART61E',
    'ART61F'
];
const LOVDATA_FORSKRIFT_PREFIX = 'FORSKRIFT';
const DEPARTMENTS_WITH_SUB_DEPARTMENTS = [
    'OESA',
    'YTA',
    'ATA'
];
const CodelistService = ()=>{
    const [lists, setLists] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])();
    const [countries, setCountries] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])();
    const [countriesOutsideEUEEA, setCountriesOutsideEUEEA] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])();
    const handleGetCodelistResponse = (response)=>{
        if (typeof response === 'object' && response !== null) {
            setLists(response);
        } else {
            setError(response);
        }
    };
    const fetchData = async (refresh)=>{
        if (lists === undefined && countries === undefined && countriesOutsideEUEEA === undefined || refresh) {
            const codeListPromise = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$CodelistApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getAllCodelists"])(refresh).then(handleGetCodelistResponse).catch((error)=>setError(error.message));
            const allCountriesPromise = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$CodelistApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getAllCountries"])().then((codes)=>setCountries(codes)).catch((error)=>setError(error.message));
            const countriesPromise = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$CodelistApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getCountriesOutsideEUEEA"])().then((codes)=>setCountriesOutsideEUEEA(codes)).catch((error)=>setError(error.message));
            await Promise.all([
                codeListPromise,
                allCountriesPromise,
                countriesPromise
            ]);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        ;
        (async ()=>{
            await fetchData();
        })();
    }, []);
    const isLoaded = ()=>{
        return lists || error;
    };
    const getAllCountryCodes = ()=>{
        return countries || [];
    };
    const getCountryCodesOutsideEu = ()=>{
        return countriesOutsideEUEEA || [];
    };
    const countryName = (code)=>{
        return getAllCountryCodes().find((country)=>country.code === code)?.description || code;
    };
    const getCodes = (list)=>{
        return lists && lists.codelist[list] ? lists.codelist[list].sort((c1, c2)=>c1.shortName.localeCompare(c2.shortName)) : [];
    };
    const getCode = (list, codeName)=>{
        return getCodes(list).find((code)=>code.code === codeName);
    };
    const valid = (list, codeName)=>{
        return !!codeName && !!getCode(list, codeName);
    };
    const getShortnameForCode = (code)=>{
        return getShortname(code.list, code.code);
    };
    const getShortnameForCodes = (codes)=>{
        return codes.map((code)=>getShortname(code.list, code.code)).join(', ');
    };
    const getShortname = (list, codeName)=>{
        const code = getCode(list, codeName);
        return code ? code.shortName : codeName;
    };
    const getShortnames = (list, codeNames)=>{
        return codeNames.map((codeName)=>getShortname(list, codeName));
    };
    const getDescription = (list, codeName)=>{
        const code = getCode(list, codeName);
        return code ? code.description : codeName;
    };
    const getParsedOptions = (listName)=>{
        return getCodes(listName).map((code)=>{
            return {
                id: code.code,
                label: code.shortName
            };
        });
    };
    const getParsedOptionsForList = (listName, selected)=>{
        return selected.map((code)=>({
                id: code,
                label: getShortname(listName, code)
            }));
    };
    const getParsedOptionsFilterOutSelected = (listName, currentSelected)=>{
        const parsedOptions = getParsedOptions(listName);
        return !currentSelected ? parsedOptions : parsedOptions.filter((option)=>currentSelected.includes(option.id) ? null : option.id);
    };
    const requiresNationalLaw = (gdprCode)=>{
        return gdprCode && NATIONAL_LAW_GDPR_ARTICLES.indexOf(gdprCode) >= 0;
    };
    const requiresDescription = (gdprCode)=>{
        return gdprCode && DESCRIPTION_GDPR_ARTICLES.indexOf(gdprCode) >= 0;
    };
    const requiresArt9 = (sensitivityCode)=>{
        return sensitivityCode === "SAERLIGE";
    };
    const isArt6 = (gdprCode)=>{
        return gdprCode && gdprCode.startsWith(ARTICLE_6_PREFIX);
    };
    const isArt9 = (gdprCode)=>{
        return gdprCode && gdprCode.startsWith(ARTICLE_9_PREFIX);
    };
    const isForskrift = (nationalLawCode)=>{
        return nationalLawCode && nationalLawCode.includes(LOVDATA_FORSKRIFT_PREFIX);
    };
    const showSubDepartment = (departmentCode)=>{
        return departmentCode && DEPARTMENTS_WITH_SUB_DEPARTMENTS.indexOf(departmentCode) >= 0;
    };
    const makeIdLabelForAllCodeLists = ()=>{
        return Object.keys(EListName).map((key)=>({
                id: key,
                label: key
            }));
    };
    const utils = {
        fetchData,
        isLoaded,
        getCodes,
        getCode,
        valid,
        getShortnameForCode,
        getShortnameForCodes,
        getShortnames,
        getShortname,
        getDescription,
        getParsedOptions,
        getParsedOptionsForList,
        getParsedOptionsFilterOutSelected,
        isForskrift,
        countryName,
        getCountryCodesOutsideEu,
        requiresNationalLaw,
        requiresDescription,
        requiresArt9,
        isArt6,
        isArt9,
        showSubDepartment,
        makeIdLabelForAllCodeLists
    };
    return [
        utils,
        lists,
        setLists
    ];
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/util/sort.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prefixBiasedSort",
    ()=>prefixBiasedSort
]);
const start = (prefix)=>(text)=>{
        const startIndex = text.indexOf(prefix.toLowerCase());
        return startIndex < 0 ? Number.MAX_VALUE : startIndex;
    };
const prefixBiasedSort = (prefix, a, b)=>{
    const comp = start(prefix);
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    const c1 = comp(aLower) - comp(bLower);
    return c1 === 0 ? aLower.localeCompare(bLower, 'nb') : c1;
};
}),
"[project]/src/components/common/AsyncSelectComponents.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__ = __turbopack_context__.i("[externals]/@navikt/aksel-icons [external] (@navikt/aksel-icons, esm_import, [project]/node_modules/@navikt/aksel-icons)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select__$5b$external$5d$__$28$react$2d$select$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__ = __turbopack_context__.i("[externals]/react-select [external] (react-select, esm_import, [project]/node_modules/react-select)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select$2f$async__$5b$external$5d$__$28$react$2d$select$2f$async$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__ = __turbopack_context__.i("[externals]/react-select/async [external] (react-select/async, esm_import, [project]/node_modules/react-select)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select__$5b$external$5d$__$28$react$2d$select$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select$2f$async__$5b$external$5d$__$28$react$2d$select$2f$async$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select__$5b$external$5d$__$28$react$2d$select$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select$2f$async__$5b$external$5d$__$28$react$2d$select$2f$async$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const CustomSearchSelect = (props)=>{
    const { ariaLabel, placeholder, inputId, instanceId, hasError, onChange, loadOptions } = props;
    const wrapperRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [dialogPortalTarget, setDialogPortalTarget] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const wrapper = wrapperRef.current;
        if (!wrapper) return;
        const closestDialog = wrapper.closest('dialog') || wrapper.closest('[role="dialog"]');
        setDialogPortalTarget(closestDialog);
    }, []);
    const menuPortalTarget = dialogPortalTarget ?? (typeof document !== 'undefined' ? document.body : undefined);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        ref: wrapperRef,
        className: "w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select$2f$async__$5b$external$5d$__$28$react$2d$select$2f$async$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__["default"], {
            className: "w-full",
            "aria-label": ariaLabel,
            inputId: inputId,
            instanceId: instanceId,
            placeholder: placeholder,
            components: {
                DropdownIndicator
            },
            noOptionsMessage: ({ inputValue })=>noOptionMessage(inputValue),
            controlShouldRenderValue: false,
            loadingMessage: ()=>'Søker...',
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
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/common/AsyncSelectComponents.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const DropdownIndicator = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select__$5b$external$5d$__$28$react$2d$select$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__["components"].DropdownIndicator, {
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__["MagnifyingGlassIcon"], {
            title: "Søk",
            "aria-label": "Søk"
        }, void 0, false, {
            fileName: "[project]/src/components/common/AsyncSelectComponents.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/common/AsyncSelectComponents.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const noOptionMessage = (inputValue)=>{
    if (inputValue.length < 3 && inputValue.length > 0) {
        return 'Skriv minst 3 tegn for å søke';
    } else if (inputValue.length >= 3) {
        return `Fant ingen resultater for "${inputValue}"`;
    } else {
        return '';
    }
};
const selectOverrides = {
    control: (base)=>({
            ...base,
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
        }),
    menu: (base)=>({
            ...base,
            backgroundColor: 'var(--ax-bg-raised)',
            border: '1px solid var(--ax-border-subtleA)',
            boxShadow: 'var(--ax-shadow-dialog)',
            marginTop: '0.25rem',
            borderRadius: 'var(--ax-radius-12)',
            overflow: 'hidden',
            zIndex: 9999
        }),
    menuPortal: (base)=>({
            ...base,
            zIndex: 9999
        }),
    menuList: (base)=>({
            ...base,
            padding: 0
        }),
    option: (base, state)=>({
            ...base,
            color: 'var(--ax-text-neutral)',
            backgroundColor: state.isFocused ? 'var(--ax-bg-moderate-hoverA)' : state.isSelected ? 'var(--ax-bg-moderate-pressedA)' : 'var(--ax-bg-raised)',
            ':active': {
                backgroundColor: 'var(--ax-bg-moderate-pressedA)'
            }
        }),
    input: (base)=>({
            ...base,
            color: 'var(--ax-text-neutral)'
        }),
    placeholder: (base)=>({
            ...base,
            color: 'var(--ax-text-subtle)'
        }),
    singleValue: (base)=>({
            ...base,
            color: 'var(--ax-text-neutral)'
        }),
    dropdownIndicator: (base)=>({
            ...base,
            color: 'var(--ax-text-neutral)',
            ':hover': {
                color: 'var(--ax-text-neutral)'
            }
        }),
    indicatorSeparator: ()=>({
            display: 'none'
        })
};
const selectOverridesError = {
    ...selectOverrides,
    control: (base)=>{
        const ctrl = selectOverrides.control(base);
        return {
            ...ctrl,
            border: '1px solid var(--ax-border-danger)',
            borderColor: 'var(--ax-border-danger)',
            ':focus-within': {
                ...ctrl[':focus-within'],
                borderColor: 'var(--ax-border-danger)'
            },
            ':focus': {
                borderColor: 'var(--ax-border-danger)'
            },
            ':hover': {
                borderColor: 'var(--ax-border-danger)'
            }
        };
    }
};
const __TURBOPACK__default__export__ = CustomSearchSelect;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/common/Button/CustomButton.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__ = __turbopack_context__.i("[externals]/@navikt/ds-react [external] (@navikt/ds-react, esm_import, [project]/node_modules/@navikt/ds-react)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const Tooltip = (props)=>props.tooltip ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Tooltip"], {
        content: props.tooltip,
        children: props.children
    }, void 0, false, {
        fileName: "[project]/src/components/common/Button/CustomButton.tsx",
        lineNumber: 36,
        columnNumber: 19
    }, ("TURBOPACK compile-time value", void 0)) : props.children;
const Button = (props)=>{
    const baseuiKind = props.kind === 'outline' ? 'secondary' : props.kind;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `inline ${props.marginLeft ? 'ml-2.5' : ''} ${props.marginRight ? 'mr-2.5' : ''}`
            }, void 0, false, {
                fileName: "[project]/src/components/common/Button/CustomButton.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Tooltip, {
                tooltip: props.tooltip,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Button"], {
                    variant: baseuiKind,
                    size: props.size,
                    onClick: ()=>props.onClick?.(),
                    icon: props.icon ?? props.startEnhancer,
                    disabled: props.disabled,
                    loading: props.loading,
                    type: props.type,
                    "aria-label": props.ariaLabel,
                    children: (props.children || props.iconEnd) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-2",
                        children: [
                            props.children,
                            props.iconEnd
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/common/Button/CustomButton.tsx",
                        lineNumber: 58,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/common/Button/CustomButton.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/common/Button/CustomButton.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `inline ${props.marginRight ? 'mr-2.5' : ''}`
            }, void 0, false, {
                fileName: "[project]/src/components/common/Button/CustomButton.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
const __TURBOPACK__default__export__ = Button;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/admin/audit/AuditButton.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "AuditButton",
    ()=>AuditButton
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__ = __turbopack_context__.i("[externals]/@navikt/aksel-icons [external] (@navikt/aksel-icons, esm_import, [project]/node_modules/@navikt/aksel-icons)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/User.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Button$2f$CustomButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/Button/CustomButton.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/RouteLink.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Button$2f$CustomButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Button$2f$CustomButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const AuditButton = (props)=>{
    const { id, auditId, kind, marginLeft, marginRight, children } = props;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["user"].isAdmin() && null,
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["user"].isAdmin() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: `/admin/audit/${id}` + (auditId ? `/${auditId}` : ''),
                children: [
                    children && children,
                    ' ',
                    !children && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Button$2f$CustomButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            tooltip: "Versjonering",
                            marginLeft: marginLeft,
                            marginRight: marginRight,
                            size: "xsmall",
                            kind: kind || 'outline',
                            ariaLabel: "Versjonering",
                            startEnhancer: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "flex items-center leading-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__["ClockDashedIcon"], {
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
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/audit/AuditButton.tsx",
                lineNumber: 30,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/common/RouteLink.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "ObjectLink",
    ()=>ObjectLink,
    "default",
    ()=>__TURBOPACK__default__export__,
    "urlForObject",
    ()=>urlForObject
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/router.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__ = __turbopack_context__.i("[externals]/@navikt/ds-react [external] (@navikt/ds-react, esm_import, [project]/node_modules/@navikt/ds-react)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/Codelist.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$audit$2f$AuditButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/audit/AuditButton.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$audit$2f$AuditButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$audit$2f$AuditButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
const RouteLink = (props)=>{
    const { hideUnderline, plain, ...restprops } = props;
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNavigate"])();
    // Treat absolute URLs (https:, mailto:, //example.com, etc.) as external.
    const isExternalHref = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(props.href);
    const className = [
        restprops.className,
        hideUnderline ? 'no-underline' : undefined,
        plain ? 'text-inherit' : undefined
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Link"], {
        className: className,
        ...restprops,
        onClick: (event)=>{
            restprops.onClick?.(event);
            if (isExternalHref) return;
            event.preventDefault();
            navigate(props.href);
        }
    }, void 0, false, {
        fileName: "[project]/src/components/common/RouteLink.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = RouteLink;
const urlForObject = (type, id, audit)=>{
    switch(type){
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].INFORMATION_TYPE:
            return `/informationtype/${id}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].CATEGORY:
            return `/informationtype?category=${id}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].POLICY:
            return `/policy/${id}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].PROCESS:
            return `/process/${id}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].PROCESSOR:
            return `/processor/${id}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].DP_PROCESS:
            return `/dpprocess/${id}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].DISCLOSURE:
            return `/disclosure/${id}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].DOCUMENT:
            return `/document/${id}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].CODELIST:
            return `/admin/codelist/${id.substring(0, id.indexOf('-'))}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].GENERIC_STORAGE:
            if (audit && audit.data?.type === 'SETTINGS') {
                return '/admin/settings';
            }
            return '/';
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].PURPOSE:
            return `/process/purpose/${id}`;
        case 'team':
            return `/team/${id}`;
        case 'productarea':
            return `/productarea/${id}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].DEPARTMENT:
            return `/process/department/${id}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].SUB_DEPARTMENT:
            return `/process/subdepartment/${id}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].THIRD_PARTY:
            return `/thirdparty/${id}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].SYSTEM:
            return `/system/${id}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].GDPR_ARTICLE:
            return `/process/legal?gdprArticle=${id}`;
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].NATIONAL_LAW:
            return `/process/legal?nationalLaw=${id}`;
    }
};
const ObjectLink = (props)=>{
    const { disable, children, type, id, audit, hideUnderline, withHistory } = props;
    const linkClassName = hideUnderline ? 'no-underline' : undefined;
    const link = disable ? children : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(RouteLink, {
        href: urlForObject(type, id, audit),
        className: linkClassName,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/common/RouteLink.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
    return withHistory ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex justify-between w-full items-center",
        children: [
            link,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$audit$2f$AuditButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["AuditButton"], {
                id: id,
                kind: "tertiary"
            }, void 0, false, {
                fileName: "[project]/src/components/common/RouteLink.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/RouteLink.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)) : link;
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/search/components/SmallRadio.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "SmallRadio",
    ()=>SmallRadio
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__ = __turbopack_context__.i("[externals]/@navikt/ds-react [external] (@navikt/ds-react, esm_import, [project]/node_modules/@navikt/ds-react)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const SmallRadio = (value, text)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Radio"], {
        value: value,
        className: "m-0 ml-2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
            className: "text-xs text-(--ax-text-neutral)",
            children: text
        }, void 0, false, {
            fileName: "[project]/src/components/search/components/SmallRadio.tsx",
            lineNumber: 6,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/search/components/SmallRadio.tsx",
        lineNumber: 5,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/search/components/SelectType.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "SelectType",
    ()=>SelectType
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__ = __turbopack_context__.i("[externals]/@navikt/ds-react [external] (@navikt/ds-react, esm_import, [project]/node_modules/@navikt/ds-react)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/search/components/SmallRadio.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const SelectType = (props)=>{
    const { type, setType } = props;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "polly-mainsearch-filter-menu text-sm absolute top-full left-0 mt-1 bg-(--ax-bg-raised) w-fit min-w-[12rem] max-w-[calc(100vw-1rem)] rounded-(--ax-radius-12) border border-solid border-(--ax-border-subtleA) shadow-[0px_0px_6px_3px_rgba(0,0,0,0.08)] z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "px-3 py-2",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["RadioGroup"], {
                onChange: (value)=>setType(value),
                className: "flex flex-col",
                legend: "",
                hideLegend: true,
                value: type,
                children: [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SmallRadio"])('all', 'Alle'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SmallRadio"])('informationType', 'Opplysningstype'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SmallRadio"])('purpose', 'Formål'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SmallRadio"])('process', 'Behandlinger'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SmallRadio"])('dpprocess', 'Nav som databehandler'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SmallRadio"])('team', 'Team'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SmallRadio"])('productarea', 'Område'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SmallRadio"])('department', 'Avdeling'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SmallRadio"])('subDepartment', 'Linja'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SmallRadio"])('thirdParty', 'Ekstern part'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SmallRadio"])('system', 'System'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SmallRadio"])('document', 'Dokument'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SmallRadio"])('nationalLaw', 'Nasjonal lov'),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SmallRadio$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SmallRadio"])('gdprArticle', 'GDPR artikkel')
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/search/components/SelectType.tsx",
                lineNumber: 16,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/search/components/SelectType.tsx",
            lineNumber: 15,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/search/components/SelectType.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/search/MainSearch.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "DropdownIndicator",
    ()=>DropdownIndicator,
    "MainSearch",
    ()=>MainSearch,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/router.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__ = __turbopack_context__.i("[externals]/@navikt/aksel-icons [external] (@navikt/aksel-icons, esm_import, [project]/node_modules/@navikt/aksel-icons)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__ = __turbopack_context__.i("[externals]/@navikt/ds-react [external] (@navikt/ds-react, esm_import, [project]/node_modules/@navikt/ds-react)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select__$5b$external$5d$__$28$react$2d$select$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__ = __turbopack_context__.i("[externals]/react-select [external] (react-select, esm_import, [project]/node_modules/react-select)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select$2f$async__$5b$external$5d$__$28$react$2d$select$2f$async$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__ = __turbopack_context__.i("[externals]/react-select/async [external] (react-select/async, esm_import, [project]/node_modules/react-select)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DpProcessApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/DpProcessApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$GetAllApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/api/GetAllApi.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DocumentApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/DocumentApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$InfoTypeApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/InfoTypeApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$ProcessApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/ProcessApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TeamApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/TeamApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$NomApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/NomApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/Codelist.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$sort$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/sort.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/theme.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/AsyncSelectComponents.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Button$2f$CustomButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/Button/CustomButton.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/RouteLink.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SelectType$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/search/components/SelectType.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select__$5b$external$5d$__$28$react$2d$select$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select$2f$async__$5b$external$5d$__$28$react$2d$select$2f$async$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DpProcessApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$GetAllApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DocumentApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$InfoTypeApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$ProcessApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TeamApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$NomApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Button$2f$CustomButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SelectType$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select__$5b$external$5d$__$28$react$2d$select$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select$2f$async__$5b$external$5d$__$28$react$2d$select$2f$async$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DpProcessApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$GetAllApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DocumentApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$InfoTypeApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$ProcessApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TeamApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$NomApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Button$2f$CustomButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SelectType$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
;
const mainSearchSelectOverrides = {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["selectOverrides"],
    control: (base)=>({
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["selectOverrides"].control(base),
            backgroundColor: 'var(--ax-bg-default)',
            border: '1px solid #D9DBE0',
            color: 'var(--ax-text-neutral)'
        }),
    input: (base)=>({
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["selectOverrides"].input(base),
            color: 'var(--ax-text-neutral)',
            caretColor: 'var(--ax-text-neutral)'
        }),
    placeholder: (base)=>({
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["selectOverrides"].placeholder(base),
            color: 'var(--ax-neutral-1000)'
        }),
    singleValue: (base)=>({
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["selectOverrides"].singleValue(base),
            color: 'var(--ax-text-neutral)'
        }),
    menu: (base)=>({
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["selectOverrides"].menu(base),
            backgroundColor: 'var(--ax-bg-raised)',
            zIndex: 2000
        }),
    menuList: (base)=>({
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["selectOverrides"].menuList(base),
            backgroundColor: 'var(--ax-bg-raised)'
        }),
    option: (base, state)=>({
            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["selectOverrides"].option(base, state),
            backgroundColor: state.isFocused ? 'var(--ax-bg-moderate-hoverA)' : state.isSelected ? 'var(--ax-bg-moderate-pressedA)' : 'var(--ax-bg-raised)'
        })
};
const searchCodelist = (search, list, typeName, backgroundColor, codelistUtils)=>{
    return codelistUtils.getCodes(list).filter((code)=>code.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0).map((code)=>({
            id: code.code,
            sortKey: code.shortName,
            label: code.shortName,
            typeName: typeName,
            type: list,
            tagColor: backgroundColor
        }));
};
const getCodelistByListnameAndType = (search, list, typeName, codelistUtils)=>{
    return codelistUtils.getCodes(list).filter((code)=>code.shortName.toLowerCase().indexOf(search.toLowerCase()) >= 0).map((code)=>({
            id: code.code,
            sortKey: code.shortName,
            label: code.shortName,
            type: list,
            typeName: typeName
        }));
};
const Option = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select__$5b$external$5d$__$28$react$2d$select$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__["components"].Option, {
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                    children: props.data.label
                }, void 0, false, {
                    fileName: "[project]/src/components/search/MainSearch.tsx",
                    lineNumber: 135,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Tag"], {
                    size: "small",
                    variant: "info",
                    style: {
                        ...props.data.tagColor ? {
                            backgroundColor: props.data.tagColor
                        } : {},
                        color: 'var(--ax-text-neutral-contrast)'
                    },
                    children: props.data.typeName
                }, void 0, false, {
                    fileName: "[project]/src/components/search/MainSearch.tsx",
                    lineNumber: 136,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/search/MainSearch.tsx",
            lineNumber: 134,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/search/MainSearch.tsx",
        lineNumber: 133,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const DropdownIndicator = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select__$5b$external$5d$__$28$react$2d$select$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__["components"].DropdownIndicator, {
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__["MagnifyingGlassIcon"], {
            title: "Søk",
            "aria-label": "Søk"
        }, void 0, false, {
            fileName: "[project]/src/components/search/MainSearch.tsx",
            lineNumber: 152,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/search/MainSearch.tsx",
        lineNumber: 151,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const MainSearch = ()=>{
    const [codelistUtils] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["CodelistService"])();
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [type, setType] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('all');
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNavigate"])();
    const useMainSearchOption = async (searchParam)=>{
        if (searchParam && searchParam.length > 2) {
            if (type === 'purpose') {
                return getCodelistByListnameAndType(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].PURPOSE, 'Formål', codelistUtils);
            } else if (type === 'department') {
                return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$NomApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getAvdelingSearchItem"])(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].DEPARTMENT, 'Avdeling');
            } else if (type === 'subDepartment') {
                return getCodelistByListnameAndType(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].SUB_DEPARTMENT, 'Linja', codelistUtils);
            } else if (type === 'thirdParty') {
                return getCodelistByListnameAndType(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].THIRD_PARTY, 'Ekstern part', codelistUtils);
            } else if (type === 'system') {
                return getCodelistByListnameAndType(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].SYSTEM, 'System', codelistUtils);
            } else if (type === 'nationalLaw') {
                return getCodelistByListnameAndType(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].NATIONAL_LAW, 'Nasjonal lov', codelistUtils);
            } else if (type === 'gdprArticle') {
                return getCodelistByListnameAndType(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].GDPR_ARTICLE, 'GDPR artikkel', codelistUtils);
            } else {
                let searchResult = [];
                let results = [];
                const searches = [];
                const compareFn = (a, b)=>{
                    if (a.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].PROCESS && a.number === parseInt(searchParam)) return -1;
                    else if (b.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].PROCESS && b.number === parseInt(searchParam)) return 1;
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$sort$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["prefixBiasedSort"])(searchParam, a.sortKey, b.sortKey);
                };
                const add = async (items)=>{
                    results = [
                        ...results,
                        ...items
                    ].sort(compareFn);
                    searchResult = results;
                };
                if (type === 'all') {
                    add(searchCodelist(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].PURPOSE, 'Behandlingsaktivitet', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchResultColor"].purposeBackground, codelistUtils));
                    add(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$NomApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getAvdelingSearchItem"])(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].DEPARTMENT, 'Avdeling', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchResultColor"].departmentBackground));
                    add(searchCodelist(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].SUB_DEPARTMENT, 'Linja', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchResultColor"].subDepartmentBackground, codelistUtils));
                    add(searchCodelist(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].THIRD_PARTY, 'Ekstern part', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchResultColor"].thirdPartyBackground, codelistUtils));
                    add(searchCodelist(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].SYSTEM, 'System', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchResultColor"].systemBackground, codelistUtils));
                    add(searchCodelist(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].NATIONAL_LAW, 'Nasjonal lov', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchResultColor"].nationalLawBackground, codelistUtils));
                    add(searchCodelist(searchParam, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].GDPR_ARTICLE, 'GDPR artikkel', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchResultColor"].gdprBackground, codelistUtils));
                }
                if (type === 'all' || type === 'informationType') {
                    searches.push((async ()=>{
                        const infoTypesRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$InfoTypeApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchInformationType"])(searchParam);
                        add(infoTypesRes.content.map((it)=>({
                                id: it.id,
                                sortKey: it.name,
                                typeName: 'Opplysningstype',
                                tagColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchResultColor"].informationTypeBackground,
                                label: it.name,
                                type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].INFORMATION_TYPE
                            })));
                    })());
                }
                if (type === 'all' || type === 'process') {
                    searches.push((async ()=>{
                        const resProcess = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$ProcessApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchProcess"])(searchParam);
                        add(resProcess.content.map((content)=>{
                            const purposes = content.purposes.map((purpose)=>codelistUtils.getShortnameForCode(purpose)).join(', ');
                            return {
                                id: content.id,
                                sortKey: `${content.name} ${purposes}`,
                                typeName: 'Behandling',
                                tagColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchResultColor"].processBackground,
                                label: `${purposes}: ${content.name}`,
                                type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].PROCESS,
                                number: content.number
                            };
                        }));
                    })());
                }
                if (type === 'all' || type === 'dpprocess') {
                    searches.push((async ()=>{
                        const resProcess = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DpProcessApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchDpProcess"])(searchParam);
                        add(resProcess.content.map((content)=>{
                            return {
                                id: content.id,
                                sortKey: content.name,
                                typeName: 'Nav som databehandler',
                                tagColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchResultColor"].dpProcessBackground,
                                label: content.name,
                                type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].DP_PROCESS
                            };
                        }));
                    })());
                }
                if (type === 'all' || type === 'team') {
                    searches.push((async ()=>{
                        const resTeams = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TeamApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchTeam"])(searchParam);
                        add(resTeams.content.map((content)=>({
                                id: content.id,
                                sortKey: content.name,
                                typeName: 'Team',
                                tagColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchResultColor"].teamBackground,
                                label: content.name,
                                type: 'team'
                            })));
                    })());
                }
                if (type === 'all' || type === 'productarea') {
                    searches.push((async ()=>{
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$TeamApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchProductArea"])(searchParam);
                        add(result.content.map((content)=>({
                                id: content.id,
                                sortKey: content.name,
                                typeName: 'Område',
                                tagColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchResultColor"].productAreaBackground,
                                label: content.name,
                                type: 'productarea'
                            })));
                    })());
                }
                if (type === 'all' || type === 'document') {
                    searches.push((async ()=>{
                        const resDocs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DocumentApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchDocuments"])(searchParam);
                        add(resDocs.content.map((content)=>({
                                id: content.id,
                                sortKey: content.name,
                                typeName: 'Dokument',
                                tagColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["searchResultColor"].documentBackground,
                                label: content.name,
                                type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].DOCUMENT
                            })));
                    })());
                }
                await Promise.all(searches);
                return searchResult;
            }
        }
        return [];
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex items-center w-182.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$select$2f$async__$5b$external$5d$__$28$react$2d$select$2f$async$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$react$2d$select$29$__["default"], {
                    className: "w-full",
                    "aria-label": "Søk",
                    placeholder: "Søk",
                    loadOptions: useMainSearchOption,
                    components: {
                        Option,
                        DropdownIndicator
                    },
                    noOptionsMessage: ({ inputValue })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AsyncSelectComponents$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["noOptionMessage"])(inputValue),
                    controlShouldRenderValue: false,
                    loadingMessage: ()=>'Søker...',
                    isClearable: false,
                    styles: mainSearchSelectOverrides,
                    onChange: (value)=>{
                        const item = value;
                        (async ()=>{
                            if (item) {
                                navigate((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["urlForObject"])(item.type, item.id));
                            }
                        })();
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/search/MainSearch.tsx",
                    lineNumber: 413,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "relative ml-1 flex items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Button$2f$CustomButton$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            onClick: ()=>setFilter(!filter),
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "flex items-center leading-none",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__["FilterIcon"], {
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
                        }, ("TURBOPACK compile-time value", void 0)),
                        filter && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$components$2f$SelectType$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SelectType"], {
                            type: type,
                            setType: setType
                        }, void 0, false, {
                            fileName: "[project]/src/components/search/MainSearch.tsx",
                            lineNumber: 445,
                            columnNumber: 22
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/search/MainSearch.tsx",
                    lineNumber: 433,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/search/MainSearch.tsx",
            lineNumber: 412,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/search/MainSearch.tsx",
        lineNumber: 411,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = MainSearch;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/Header.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/router.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__ = __turbopack_context__.i("[externals]/@navikt/aksel-icons [external] (@navikt/aksel-icons, esm_import, [project]/node_modules/@navikt/aksel-icons)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__ = __turbopack_context__.i("[externals]/@navikt/ds-react [external] (@navikt/ds-react, esm_import, [project]/node_modules/@navikt/ds-react)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/User.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$MainSearch$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/search/MainSearch.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$MainSearch$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$MainSearch$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
function useAbsoluteCurrentUrl() {
    const location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useLocation"])();
    if ("TURBOPACK compile-time truthy", 1) {
        return undefined;
    }
    //TURBOPACK unreachable
    ;
}
const LoggedInHeader = ()=>{
    const buttonRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [openState, setOpenState] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const redirectUri = useAbsoluteCurrentUrl();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Button"], {
                variant: "tertiary",
                "data-color": "neutral",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                    className: "flex items-center leading-none",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__["PersonIcon"], {
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
                onClick: ()=>setOpenState(!openState),
                "aria-expanded": openState,
                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["user"].getIdent()
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Popover"], {
                open: openState,
                onClose: ()=>setOpenState(false),
                anchorEl: buttonRef.current,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Popover"].Content, {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "p-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Label"], {
                                children: [
                                    "Navn: ",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["user"].getName()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 55,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Label"], {
                                children: [
                                    "Grupper: ",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["user"].getGroupsHumanReadable().join(', ')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex w-full p-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Link"], {
                                    variant: "neutral",
                                    href: redirectUri ? `/logout?redirect_uri=${encodeURIComponent(redirectUri)}` : '/logout',
                                    children: "Logg ut"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 58,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/Header.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
const LoginButton = ()=>{
    const redirectUri = useAbsoluteCurrentUrl();
    const href = redirectUri ? `/login?redirect_uri=${encodeURIComponent(redirectUri)}` : '/login';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["InternalHeader"].Button, {
        as: "a",
        href: href,
        children: "Logg inn"
    }, void 0, false, {
        fileName: "[project]/src/components/Header.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const AdminOptions = ({ showPermissionOverrides, permissionMode, onPermissionModeChange })=>{
    const pages = [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Dropdown"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["InternalHeader"].Button, {
                as: __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Dropdown"].Toggle,
                children: [
                    "Admin ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__["CaretDownIcon"], {
                        title: "a11y-title",
                        fontSize: "1.5rem",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 109,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Dropdown"].Menu, {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Dropdown"].Menu.List, {
                        children: pages.map((page)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Dropdown"].Menu.List.Item, {
                                as: __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Link"],
                                variant: "neutral",
                                href: page.href,
                                children: page.label
                            }, page.label, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    showPermissionOverrides && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "p-2 pt-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["ToggleGroup"], {
                            size: "small",
                            "aria-label": "Tilgangsmodus",
                            value: permissionMode,
                            onChange: (value)=>{
                                if (value === 'admin' || value === 'write' || value === 'read') {
                                    onPermissionModeChange(value);
                                }
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["ToggleGroup"].Item, {
                                    value: "admin",
                                    children: "Admin"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 133,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["ToggleGroup"].Item, {
                                    value: "write",
                                    children: "Skriv"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 134,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["ToggleGroup"].Item, {
                                    value: "read",
                                    children: "Les"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 135,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 123,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Header.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const Header = ({ themeMode, onThemeModeChange, permissionMode, onPermissionModeChange })=>{
    const location = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useLocation"])();
    const navigate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useNavigate"])();
    const canUsePermissionOverrides = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["user"].hasGroup(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EGroup"].ADMIN) || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["user"].hasGroup(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EGroup"].SUPER);
    const setPermissionMode = (mode)=>{
        onPermissionModeChange(mode);
        if (mode !== 'admin' && location.pathname.startsWith('/admin')) {
            navigate('/');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["InternalHeader"], {
        className: "polly-white-internalheader",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["InternalHeader"].Title, {
                href: "/",
                children: "Behandlingskatalog"
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Spacer"], {}, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center py-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$MainSearch$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/Header.tsx",
                    lineNumber: 174,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 173,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Spacer"], {}, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center px-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["ToggleGroup"], {
                    size: "small",
                    "aria-label": "Tema",
                    value: themeMode,
                    onChange: (value)=>{
                        if (value === 'dark' || value === 'light') {
                            onThemeModeChange(value);
                        }
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["ToggleGroup"].Item, {
                            value: "light",
                            children: "Lyst tema"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 188,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["ToggleGroup"].Item, {
                            value: "dark",
                            children: "Mørkt tema"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 189,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Header.tsx",
                    lineNumber: 178,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            canUsePermissionOverrides && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(AdminOptions, {
                showPermissionOverrides: canUsePermissionOverrides,
                permissionMode: permissionMode,
                onPermissionModeChange: setPermissionMode
            }, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 194,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["user"].isLoggedIn() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(LoginButton, {}, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 200,
                columnNumber: 30
            }, ("TURBOPACK compile-time value", void 0)),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["user"].isLoggedIn() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(LoggedInHeader, {}, void 0, false, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 201,
                columnNumber: 29
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Header.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Header;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/api/AlertApi.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const getAlertForInformationType = async (informationTypeId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/alert/informationtype/${informationTypeId}`)).data;
};
const getAlertForProcess = async (processId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/alert/process/${processId}`)).data;
};
const getAlertForDisclosure = async (disclosureId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/alert/disclosure/${disclosureId}`)).data;
};
const getAlertEvents = async (page, count, type, level, processId, informationTypeId, disclosureId)=>{
    return (await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl}/alert/events?pageNumber=${page}&pageSize=${count}` + (type ? `&type=${type}` : '') + (level ? `&level=${level}` : '') + (processId ? `&processId=${processId}` : '') + (informationTypeId ? `&informationTypeId=${informationTypeId}` : '') + (disclosureId ? `&disclosureId=${disclosureId}` : ''))).data;
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/common/CustomizedStatefulTooltip.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__ = __turbopack_context__.i("[externals]/@navikt/aksel-icons [external] (@navikt/aksel-icons, esm_import, [project]/node_modules/@navikt/aksel-icons)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__ = __turbopack_context__.i("[externals]/@navikt/ds-react [external] (@navikt/ds-react, esm_import, [project]/node_modules/@navikt/ds-react)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const CustomizedStatefulTooltip = (props)=>{
    const { content, text, color, icon } = props;
    const hasExplicitIcon = icon !== undefined;
    const IconComponent = icon ? icon : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__["InformationSquareIcon"], {
        title: "tooltip",
        color: color || undefined
    }, void 0, false, {
        fileName: "[project]/src/components/common/CustomizedStatefulTooltip.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Tooltip"], {
        content: content,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Button"], {
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
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/common/CustomizedStatefulTooltip.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CustomizedStatefulTooltip;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/InformationType/Sensitivity.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "Sensitivity",
    ()=>Sensitivity,
    "sensitivityColor",
    ()=>sensitivityColor
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__ = __turbopack_context__.i("[externals]/@navikt/aksel-icons [external] (@navikt/aksel-icons, esm_import, [project]/node_modules/@navikt/aksel-icons)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/Codelist.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/theme.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$CustomizedStatefulTooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/CustomizedStatefulTooltip.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$CustomizedStatefulTooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$CustomizedStatefulTooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
function sensitivityColor(code) {
    switch(code){
        case __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["ESensitivityLevel"].ART9:
            // Icon-only warning decoration color (rawValue: #CA5000)
            return 'var(--ax-text-warning-decoration)';
        default:
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["theme"].colors.mono1000;
    }
}
const Sensitivity = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$CustomizedStatefulTooltip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        content: `${props.codelistUtils.getDescription(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EListName"].SENSITIVITY, props.sensitivity.code)}`,
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__["ShieldIcon"], {
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
    }, ("TURBOPACK compile-time value", void 0));
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/pages/AlertEventPage.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "AlertEventPage",
    ()=>AlertEventPage,
    "canViewAlerts",
    ()=>canViewAlerts
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/router.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__ = __turbopack_context__.i("[externals]/@navikt/aksel-icons [external] (@navikt/aksel-icons, esm_import, [project]/node_modules/@navikt/aksel-icons)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__ = __turbopack_context__.i("[externals]/@navikt/ds-react [external] (@navikt/ds-react, esm_import, [project]/node_modules/@navikt/ds-react)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$moment__$5b$external$5d$__$28$moment$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$moment$29$__ = __turbopack_context__.i("[externals]/moment [external] (moment, cjs, [project]/node_modules/moment)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$AlertApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/AlertApi.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$InformationType$2f$Sensitivity$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/InformationType/Sensitivity.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/RouteLink.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/Codelist.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/User.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/codeToFineText.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$AlertApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$InformationType$2f$Sensitivity$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$AlertApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$InformationType$2f$Sensitivity$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
const clampPage = (state, page, limit)=>{
    if (page < 1 || page > state.events.pages) {
        return state.page;
    }
    const maxPage = Math.ceil(state.events.totalElements / limit);
    return page > maxPage ? maxPage : page;
};
const reducer = (state, action)=>{
    switch(action.type){
        case 'OBJECT_FILTER':
            return {
                ...state,
                processId: action.objectType === 'process' ? action.id : undefined,
                informationTypeId: action.objectType === 'informationtype' ? action.id : undefined,
                disclosureId: action.objectType === 'disclosure' ? action.id : undefined
            };
        case 'EVENTS':
            return {
                ...state,
                events: action.value,
                page: clampPage({
                    ...state,
                    events: action.value
                }, state.page, state.limit)
            };
        case 'PAGE':
            return {
                ...state,
                page: clampPage(state, action.value, state.limit)
            };
        case 'LIMIT':
            return {
                ...state,
                limit: action.value,
                page: clampPage(state, state.page, action.value)
            };
        case 'EVENT_TYPE':
            return {
                ...state,
                page: 1,
                type: action.value
            };
        case 'EVENT_LEVEL':
            return {
                ...state,
                page: 1,
                level: action.value
            };
    }
};
const AlertEventPage = ()=>{
    const [codelistUtils] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["CodelistService"])();
    const { objectType, id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useParams"])();
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useReducer"])(reducer, {
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
    });
    const setPage = (p)=>dispatch({
            type: 'PAGE',
            value: p
        });
    const setLimit = (l)=>dispatch({
            type: 'LIMIT',
            value: l
        });
    const setType = (t)=>dispatch({
            type: 'EVENT_TYPE',
            value: t
        });
    const setLevel = (l)=>dispatch({
            type: 'EVENT_LEVEL',
            value: l
        });
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$AlertApi$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getAlertEvents"])(state.page - 1, state.limit, state.type, state.level, state.processId, state.informationTypeId, state.disclosureId).then((a)=>dispatch({
                type: 'EVENTS',
                value: a
            }));
    }, [
        state.page,
        state.limit,
        state.type,
        state.level,
        state.processId,
        state.informationTypeId,
        state.disclosureId
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        dispatch({
            type: 'OBJECT_FILTER',
            objectType,
            id
        });
    }, [
        objectType,
        id
    ]);
    const filterToggle = (text, newLevel)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Chips"].Toggle, {
            checkmark: false,
            selected: state.level === newLevel,
            onClick: ()=>setLevel(newLevel),
            children: text
        }, text, false, {
            fileName: "[project]/src/pages/AlertEventPage.tsx",
            lineNumber: 135,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex w-full justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Heading"], {
                        size: "large",
                        children: "Varsler"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    (state.informationTypeId || state.processId || state.disclosureId) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Label"], {
                                className: "mr-3",
                                children: "Filter:"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Button"], {
                                variant: "secondary",
                                size: "xsmall",
                                className: "mx-2.5",
                                onClick: ()=>dispatch({
                                        type: 'OBJECT_FILTER'
                                    }),
                                children: [
                                    state.processId && 'Behandling',
                                    state.informationTypeId && 'Opplysningstype',
                                    state.disclosureId && 'Utlevering',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "ml-2 inline-flex items-center leading-none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__["XMarkIcon"], {
                                            "aria-hidden": true,
                                            className: "block"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/AlertEventPage.tsx",
                                            lineNumber: 162,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 161,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 150,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/AlertEventPage.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "w-full flex mb-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Select"], {
                        label: "Type varsel",
                        onChange: (event)=>{
                            if (event.target.value !== '') {
                                setType(event.target.value);
                            } else {
                                setType(undefined);
                            }
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Velg type"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EAlertEventType"]).map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                    value: t,
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["tekster"][t]
                                }, t, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "w-full flex justify-end items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Label"], {
                                className: "mr-3",
                                children: "Nivå:"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Chips"], {
                                children: [
                                    filterToggle('Alle'),
                                    filterToggle('Info', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EAlertEventLevel"].INFO),
                                    filterToggle('Advarsel', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EAlertEventLevel"].WARNING),
                                    filterToggle('Feil', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EAlertEventLevel"].ERROR)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/AlertEventPage.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"], {
                size: "small",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].Header, {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].Row, {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].ColumnHeader, {
                                    children: "Behandling"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 200,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].ColumnHeader, {
                                    children: "Opplysningstype"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].ColumnHeader, {
                                    children: "Utlevering"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 202,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].ColumnHeader, {
                                    children: "Nivå - Type"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 203,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].ColumnHeader, {
                                    children: "Tidspunkt"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 204,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].ColumnHeader, {
                                    children: "Bruker"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 205,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/AlertEventPage.tsx",
                            lineNumber: 199,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].Body, {
                        children: state.events.content.map((event, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].Row, {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].DataCell, {
                                        textSize: "small",
                                        children: event.process ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["ObjectLink"], {
                                            id: event.process.id,
                                            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].PROCESS,
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
                                        }, ("TURBOPACK compile-time value", void 0)) : ''
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 211,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].DataCell, {
                                        textSize: "small",
                                        children: event.informationType ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["ObjectLink"], {
                                            id: event.informationType.id,
                                            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].INFORMATION_TYPE,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$InformationType$2f$Sensitivity$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["Sensitivity"], {
                                                    sensitivity: event.informationType.sensitivity,
                                                    codelistUtils: codelistUtils
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                                    lineNumber: 225,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " ",
                                                event.informationType.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/AlertEventPage.tsx",
                                            lineNumber: 224,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)) : ''
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 222,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].DataCell, {
                                        textSize: "small",
                                        children: event.disclosure ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["ObjectLink"], {
                                            id: event.disclosure.id,
                                            type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["EObjectType"].DISCLOSURE,
                                            children: event.disclosure.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/AlertEventPage.tsx",
                                            lineNumber: 239,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)) : ''
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 237,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].DataCell, {
                                        textSize: "small",
                                        children: [
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["tekster"][event.level],
                                            " - ",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["tekster"][event.type]
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 247,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].DataCell, {
                                        textSize: "small",
                                        children: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$moment__$5b$external$5d$__$28$moment$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$moment$29$__["default"])(event.changeStamp.lastModifiedDate).format('lll')
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 250,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Table"].DataCell, {
                                        textSize: "small",
                                        children: event.changeStamp.lastModifiedBy
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 253,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, index, true, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 208,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/AlertEventPage.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex justify-between mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Dropdown"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Button"], {
                                variant: "tertiary",
                                as: __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Dropdown"].Toggle,
                                children: [
                                    `${state.limit} Rader`,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "ml-2 inline-flex items-center leading-none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__["ChevronDownIcon"], {
                                            "aria-hidden": true,
                                            className: "block"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/AlertEventPage.tsx",
                                            lineNumber: 263,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                                        lineNumber: 262,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 260,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Dropdown"].Menu, {
                                className: "w-fit",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Dropdown"].Menu.List, {
                                    children: [
                                        5,
                                        10,
                                        20,
                                        50,
                                        100
                                    ].map((pageSize)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Dropdown"].Menu.List.Item, {
                                            as: __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Button"],
                                            onClick: ()=>setLimit(pageSize),
                                            children: pageSize
                                        }, 'pageSize_' + pageSize, false, {
                                            fileName: "[project]/src/pages/AlertEventPage.tsx",
                                            lineNumber: 269,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/AlertEventPage.tsx",
                                    lineNumber: 267,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/pages/AlertEventPage.tsx",
                                lineNumber: 266,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Pagination"], {
                        page: state.page,
                        onPageChange: setPage,
                        count: state.events.pages || 1,
                        prevNextTexts: true,
                        size: "small"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/AlertEventPage.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/AlertEventPage.tsx",
                lineNumber: 258,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
const canViewAlerts = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["user"].isSuper() || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["user"].isAdmin();
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/util/config.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [ssr] (ecmascript)");
;
const navSlackTeamId = 'T5LNAMWNA';
const behandlingskatalogSlackChannelId = 'CR1B19E6L';
const datajegerSlackLink = `slack://channel?team=${navSlackTeamId}&id=${behandlingskatalogSlackChannelId}`;
const documentationLink = 'https://navikt.github.io/naka/behandlingskatalog';
const termUrl = (termId)=>`https://navno.sharepoint.com/sites/begreper/SitePages/Begrep.aspx?bid=${termId}`;
const slackRedirectUrl = (c)=>`https://slack.com/app_redirect?team=${navSlackTeamId}&channel=${c.toLowerCase()}`;
const teamLink = (teamId)=>`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].teamKatBaseUrl}team/${teamId}`;
const productAreaLink = (productAreaId)=>`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["env"].teamKatBaseUrl}productarea/${productAreaId}`;
}),
"[project]/src/components/SideBar/NavItem.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/router.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__ = __turbopack_context__.i("[externals]/@navikt/aksel-icons [external] (@navikt/aksel-icons, esm_import, [project]/node_modules/@navikt/aksel-icons)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__ = __turbopack_context__.i("[externals]/@navikt/ds-react [external] (@navikt/ds-react, esm_import, [project]/node_modules/@navikt/ds-react)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/RouteLink.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const checkCurrentLocationIsTheSameAsSideBarItem = (currentLocationUrl, sidebarItemUrl)=>{
    if (sidebarItemUrl.slice(0, 2) === '//') {
        return false;
    }
    return currentLocationUrl.split('/')[1] === sidebarItemUrl.split('/')[1];
};
const NavItem = (props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: props.to,
        style: {
            textDecoration: 'none'
        },
        className: "block w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex items-center h-8.75",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "mr-2.5",
                    children: checkCurrentLocationIsTheSameAsSideBarItem((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$router$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useLocation"])().pathname, props.to) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__["ChevronDownIcon"], {
                        "aria-hidden": true,
                        className: "block text-[#dcdde2]!",
                        style: {
                            fontSize: '1.5rem'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/SideBar/NavItem.tsx",
                        lineNumber: 28,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$aksel$2d$icons__$5b$external$5d$__$2840$navikt$2f$aksel$2d$icons$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$29$__["ChevronRightIcon"], {
                        "aria-hidden": true,
                        className: "block text-[#dcdde2]!",
                        style: {
                            fontSize: '1.5rem'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/SideBar/NavItem.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/SideBar/NavItem.tsx",
                    lineNumber: 26,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                props.tooltip ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Tooltip"], {
                    content: props.tooltip,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["BodyShort"], {
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
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/SideBar/NavItem.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["BodyShort"], {
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
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/SideBar/NavItem.tsx",
            lineNumber: 25,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/SideBar/NavItem.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const __TURBOPACK__default__export__ = NavItem;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/SideBar/SideBar.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__ = __turbopack_context__.i("[externals]/@navikt/ds-react [external] (@navikt/ds-react, esm_import, [project]/node_modules/@navikt/ds-react)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$AlertEventPage$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/AlertEventPage.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$config$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/config.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SideBar/NavItem.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$AlertEventPage$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$AlertEventPage$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
const SideBar = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "h-full w-60 bg-black! flex flex-col",
        style: {
            backgroundColor: '#1B232F'
        },
        role: "navigation",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "sticky top-0 h-screen flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex-1 min-h-0 pl-3 pr-3 pt-6 overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            to: "/process",
                            text: "Behandlinger",
                            tooltip: "En aktivitet du gjør på personopplysninger for å oppnå et formål. Eks. på behandling: Saksbehandling av alderspensjon"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 15,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            to: "/dpprocess",
                            text: "Nav som databehandler",
                            noWrap: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 20,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            to: "/informationtype",
                            text: "Opplysningstyper",
                            tooltip: "Personopplysninger som f.eks. kjønn, sivilstand, pensjonsopptjening."
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 21,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            to: "/document",
                            text: "Dokumenter",
                            tooltip: "En samling av opplysningstyper. Sykmelding og inntektsmelding er eksempler på dokumenter som inneholder flere opplysningstyper."
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 26,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            to: "/disclosure",
                            text: "Utleveringer",
                            tooltip: "En samling av utleveringer av persondata fra Nav til eksterne bedrifter eller etater"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 31,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            to: "/thirdparty",
                            text: "Eksterne parter",
                            tooltip: "Parter utenfor Nav som vi samhandler med. Eksempler er Folkeregisteret, Lånekassen, brukere, arbeidsgivere"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 36,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            to: "/system",
                            text: "Systemer",
                            tooltip: "En samling av beslektede applikasjoner som sammen løser et forretningsbehov. F.eks. Pesys, Modia, Aa-reg"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 41,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            to: "/processor",
                            text: "Databehandlere"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 46,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            to: "/dashboard",
                            text: "Dashboard",
                            tooltip: "Oversikt og statistikk over behandlinger og andre samlinger i behandlingskatalogen"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 47,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$AlertEventPage$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["canViewAlerts"])() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                to: "/alert/events",
                                text: "Varsler"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SideBar/SideBar.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$NavItem$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            to: "//navikt.github.io/naka/behandlingskatalog",
                            text: "Veileder"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 57,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SideBar/SideBar.tsx",
                    lineNumber: 14,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "max-w-62 mt-auto pt-6 pb-22",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "pb-4 w-[40%]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/SideBar/SideBar.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 61,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$config$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["datajegerSlackLink"],
                            style: {
                                textDecoration: 'none'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex justify-center items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/Slack_Monochrome_White.svg",
                                        width: 60,
                                        height: 60,
                                        alt: "slack logo"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SideBar/SideBar.tsx",
                                        lineNumber: 75,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["BodyShort"], {
                                        size: "small",
                                        style: {
                                            color: '#E0E1E5'
                                        },
                                        children: "#behandlingskatalogen"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SideBar/SideBar.tsx",
                                        lineNumber: 76,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SideBar/SideBar.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/SideBar/SideBar.tsx",
                            lineNumber: 73,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/SideBar/SideBar.tsx",
                    lineNumber: 60,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/SideBar/SideBar.tsx",
            lineNumber: 13,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/SideBar/SideBar.tsx",
        lineNumber: 8,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const __TURBOPACK__default__export__ = SideBar;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/util/themeMode.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getInitialThemeMode",
    ()=>getInitialThemeMode,
    "persistThemeMode",
    ()=>persistThemeMode
]);
const storageKey = 'polly-theme-mode';
const getInitialThemeMode = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return 'light';
    //TURBOPACK unreachable
    ;
    const stored = undefined;
};
const persistThemeMode = (mode)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
}),
"[project]/src/main.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__ = __turbopack_context__.i("[externals]/@navikt/ds-react [external] (@navikt/ds-react, esm_import, [project]/node_modules/@navikt/ds-react)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-runtime [external] (react/jsx-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Header.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$SideBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SideBar/SideBar.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/Codelist.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/User.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/hooks/customHooks.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$permissionOverride$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/permissionOverride.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$themeMode$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/themeMode.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$SideBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$SideBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
const Main = ({ children })=>{
    // all pages need these
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useAwait"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["user"].wait());
    const [codelistUtils] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$Codelist$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["CodelistService"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$hooks$2f$customHooks$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useAwait"])(codelistUtils.fetchData());
    const [themeMode, setThemeMode] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$themeMode$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getInitialThemeMode"])());
    const [permissionMode, setPermissionModeState] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$permissionOverride$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getInitialPermissionMode"])());
    const [userLoaded, setUserLoaded] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["user"].isLoaded());
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["user"].wait().then(()=>setUserLoaded(true));
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$themeMode$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["persistThemeMode"])(themeMode);
    }, [
        themeMode
    ]);
    const handlePermissionModeChange = (value)=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$permissionOverride$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["setPermissionMode"])(value);
        setPermissionModeState(value);
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        document.documentElement.classList.remove('light', 'dark');
        document.body.classList.remove('light', 'dark');
        document.documentElement.classList.add(themeMode);
        document.body.classList.add(themeMode);
        return ()=>{
            document.documentElement.classList.remove('light', 'dark');
            document.body.classList.remove('light', 'dark');
        };
    }, [
        themeMode
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$permissionOverride$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["AppStateContext"].Provider, {
        value: {
            permissionMode,
            userLoaded
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$runtime$2c$__cjs$29$__["Fragment"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f40$navikt$2f$ds$2d$react__$5b$external$5d$__$2840$navikt$2f$ds$2d$react$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$29$__["Theme"], {
                theme: themeMode,
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex min-h-screen w-full flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                            themeMode: themeMode,
                            onThemeModeChange: setThemeMode,
                            permissionMode: permissionMode,
                            onPermissionModeChange: handlePermissionModeChange
                        }, void 0, false, {
                            fileName: "[project]/src/main.tsx",
                            lineNumber: 60,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex w-full flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "min-w-60",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SideBar$2f$SideBar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/main.tsx",
                                        lineNumber: 69,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/main.tsx",
                                    lineNumber: 68,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-48 w-full px-7 py-7",
                                    children: children
                                }, void 0, false, {
                                    fileName: "[project]/src/main.tsx",
                                    lineNumber: 72,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/main.tsx",
                            lineNumber: 67,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/main.tsx",
                    lineNumber: 59,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/main.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/main.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/main.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = Main;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/main.tsx [ssr] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/main.tsx [ssr] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3a2f22be._.js.map