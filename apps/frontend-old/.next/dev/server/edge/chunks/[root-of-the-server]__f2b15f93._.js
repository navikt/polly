(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f2b15f93._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
const BACKEND_URL = process.env.POLLY_BACKEND_URL || 'http://localhost:8080';
function middleware(request) {
    const { pathname, search } = request.nextUrl;
    // These are actual Next.js API routes — don't proxy them
    if (pathname === '/api/isAlive' || pathname === '/api/isReady') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    let backendPath = pathname;
    if (pathname.startsWith('/api/internal/')) {
        backendPath = pathname.replace(/^\/api\/internal/, '/internal');
    } else if (pathname.startsWith('/api/')) {
        backendPath = pathname.replace(/^\/api/, '');
    }
    const targetUrl = new URL(`${backendPath}${search}`, BACKEND_URL);
    const requestHeaders = new Headers(request.headers);
    const hostHeader = request.headers.get('host');
    if (hostHeader) requestHeaders.set('x-forwarded-host', hostHeader);
    const proto = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '');
    if (proto) requestHeaders.set('x-forwarded-proto', proto);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].rewrite(targetUrl, {
        request: {
            headers: requestHeaders
        }
    });
}
const config = {
    matcher: [
        '/api/:path*',
        '/login/:path*',
        '/oauth2/:path*',
        '/logout/:path*'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f2b15f93._.js.map