module.exports = [
"[project]/src/main.tsx [ssr] (ecmascript, next/dynamic entry, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/[root-of-the-server]__3a2f22be._.js",
  "server/chunks/ssr/[root-of-the-server]__9c4f0278._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/main.tsx [ssr] (ecmascript, next/dynamic entry)");
    });
});
}),
];