(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_object_spread.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_to_consumable_array.js [client] (ecmascript)");
;
;
;
function connect(param) {
    var addMessageListener = param.addMessageListener, sendMessage = param.sendMessage, _param_onUpdateError = param.onUpdateError, onUpdateError = _param_onUpdateError === void 0 ? console.error : _param_onUpdateError;
    addMessageListener(function(msg) {
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(var i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    var queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: function(param) {
            var _param = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(param, 2), chunkPath = _param[0], callback = _param[1];
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = queued[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var _step_value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(_step.value, 2), chunkPath = _step_value[0], callback = _step_value[1];
                subscribeToChunkUpdate(chunkPath, sendMessage, callback);
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
}
var updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
        type: 'turbopack-subscribe'
    }, resource));
    return function() {
        sendJSON(sendMessage, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
            type: 'turbopack-unsubscribe'
        }, resource));
    };
}
function handleSocketConnected(sendMessage) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = updateCallbackSets.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var key = _step.value;
            subscribeToUpdates(sendMessage, JSON.parse(key));
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
// we aggregate all pending updates until the issues are resolved
var chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    var key = resourceKey(msg.resource);
    var aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = chunkListsWithPendingUpdates.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var msg = _step.value;
            triggerUpdate(msg);
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
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    var chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    var merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            var update = updateA.merged[0];
            for(var i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(var i1 = 0; i1 < updateB.merged.length; i1++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i1]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks: chunks,
        merged: merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    var chunks = {};
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Object.entries(chunksA)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _step_value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(_step.value, 2), chunkPath = _step_value[0], chunkUpdateA = _step_value[1];
            var chunkUpdateB = chunksB[chunkPath];
            if (chunkUpdateB != null) {
                var mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
                if (mergedUpdate != null) {
                    chunks[chunkPath] = mergedUpdate;
                }
            } else {
                chunks[chunkPath] = chunkUpdateA;
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
    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
    try {
        for(var _iterator1 = Object.entries(chunksB)[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
            var _step_value1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(_step1.value, 2), chunkPath1 = _step_value1[0], chunkUpdateB1 = _step_value1[1];
            if (chunks[chunkPath1] == null) {
                chunks[chunkPath1] = chunkUpdateB1;
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
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    var entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    var chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries: entries,
        chunks: chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_object_spread$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({}, entriesA, entriesB);
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    var chunks = {};
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Object.entries(chunksA)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _step_value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(_step.value, 2), chunkPath = _step_value[0], chunkUpdateA = _step_value[1];
            var chunkUpdateB = chunksB[chunkPath];
            if (chunkUpdateB != null) {
                var mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
                if (mergedUpdate != null) {
                    chunks[chunkPath] = mergedUpdate;
                }
            } else {
                chunks[chunkPath] = chunkUpdateA;
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
    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
    try {
        for(var _iterator1 = Object.entries(chunksB)[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
            var _step_value1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(_step1.value, 2), chunkPath1 = _step_value1[0], chunkUpdateB1 = _step_value1[1];
            if (chunks[chunkPath1] == null) {
                chunks[chunkPath1] = chunkUpdateB1;
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
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        var _updateA_modules, _updateB_modules;
        var added = [];
        var deleted = [];
        var deletedModules = new Set((_updateA_modules = updateA.modules) !== null && _updateA_modules !== void 0 ? _updateA_modules : []);
        var addedModules = new Set((_updateB_modules = updateB.modules) !== null && _updateB_modules !== void 0 ? _updateB_modules : []);
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = addedModules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var moduleId = _step.value;
                if (!deletedModules.has(moduleId)) {
                    added.push(moduleId);
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
        var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
        try {
            for(var _iterator1 = deletedModules[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                var moduleId1 = _step1.value;
                if (!addedModules.has(moduleId1)) {
                    deleted.push(moduleId1);
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
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added: added,
            deleted: deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        var _updateA_added, _updateB_added, _updateA_deleted, _updateB_deleted;
        var added1 = new Set((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((_updateA_added = updateA.added) !== null && _updateA_added !== void 0 ? _updateA_added : []).concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((_updateB_added = updateB.added) !== null && _updateB_added !== void 0 ? _updateB_added : [])));
        var deleted1 = new Set((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((_updateA_deleted = updateA.deleted) !== null && _updateA_deleted !== void 0 ? _updateA_deleted : []).concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((_updateB_deleted = updateB.deleted) !== null && _updateB_deleted !== void 0 ? _updateB_deleted : [])));
        if (updateB.added != null) {
            var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
            try {
                for(var _iterator2 = updateB.added[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                    var moduleId2 = _step2.value;
                    deleted1.delete(moduleId2);
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
        }
        if (updateB.deleted != null) {
            var _iteratorNormalCompletion3 = true, _didIteratorError3 = false, _iteratorError3 = undefined;
            try {
                for(var _iterator3 = updateB.deleted[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true){
                    var moduleId3 = _step3.value;
                    added1.delete(moduleId3);
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
        return {
            type: 'partial',
            added: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(added1),
            deleted: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(deleted1)
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        var _updateA_modules1, _updateB_added1, _updateB_deleted1;
        var modules = new Set((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((_updateA_modules1 = updateA.modules) !== null && _updateA_modules1 !== void 0 ? _updateA_modules1 : []).concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((_updateB_added1 = updateB.added) !== null && _updateB_added1 !== void 0 ? _updateB_added1 : [])));
        var _iteratorNormalCompletion4 = true, _didIteratorError4 = false, _iteratorError4 = undefined;
        try {
            for(var _iterator4 = ((_updateB_deleted1 = updateB.deleted) !== null && _updateB_deleted1 !== void 0 ? _updateB_deleted1 : [])[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true){
                var moduleId4 = _step4.value;
                modules.delete(moduleId4);
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
        return {
            type: 'added',
            modules: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(modules)
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        var _updateB_modules1;
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        var modules1 = new Set((_updateB_modules1 = updateB.modules) !== null && _updateB_modules1 !== void 0 ? _updateB_modules1 : []);
        if (updateA.added != null) {
            var _iteratorNormalCompletion5 = true, _didIteratorError5 = false, _iteratorError5 = undefined;
            try {
                for(var _iterator5 = updateA.added[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true){
                    var moduleId5 = _step5.value;
                    modules1.delete(moduleId5);
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
        }
        return {
            type: 'deleted',
            modules: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_to_consumable_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(modules1)
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error("Invariant: ".concat(message));
}
var CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    var aI = list.indexOf(a) + 1 || list.length;
    var bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
var chunksWithIssues = new Map();
function emitIssues() {
    var issues = [];
    var deduplicationSet = new Set();
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = chunksWithIssues[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _step_value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(_step.value, 2), _ = _step_value[0], chunkIssues = _step_value[1];
            var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
            try {
                for(var _iterator1 = chunkIssues[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                    var chunkIssue = _step1.value;
                    if (deduplicationSet.has(chunkIssue.formatted)) continue;
                    issues.push(chunkIssue);
                    deduplicationSet.add(chunkIssue.formatted);
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
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    var key = resourceKey(msg.resource);
    var hasCriticalIssues = false;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = msg.issues[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var issue = _step.value;
            if (CRITICAL.includes(issue.severity)) {
                hasCriticalIssues = true;
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
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
var SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
var CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort(function(a, b) {
        var first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
var hooks = {
    beforeRefresh: function() {},
    refresh: function() {},
    buildOk: function() {},
    issues: function(_issues) {}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            var runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    var key = resourceKey(resource);
    var callbackSet;
    var existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return function() {
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    var key = resourceKey(msg.resource);
    var callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = callbackSet.callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var callback = _step.value;
            callback(msg);
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
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
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
"[project]/src/util/permissionOverride.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppStateContext",
    ()=>AppStateContext,
    "getInitialPermissionMode",
    ()=>getInitialPermissionMode,
    "getPermissionMode",
    ()=>getPermissionMode,
    "persistPermissionMode",
    ()=>persistPermissionMode,
    "setPermissionMode",
    ()=>setPermissionMode,
    "useAppState",
    ()=>useAppState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
var MODE_STORAGE_KEY = 'polly.permissionMode';
var LEGACY_OVERRIDE_KEY = 'polly.permissionOverride';
var DEFAULT_MODE = 'admin';
var isPermissionMode = function(value) {
    return value === 'admin' || value === 'write' || value === 'read';
};
var readModeFromStorage = function() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    var storedMode = window.localStorage.getItem(MODE_STORAGE_KEY);
    if (storedMode && isPermissionMode(storedMode)) {
        return storedMode;
    }
    var legacy = window.localStorage.getItem(LEGACY_OVERRIDE_KEY);
    if (!legacy) return DEFAULT_MODE;
    try {
        var _parsed_adminEnabled, _parsed_writeEnabled;
        var parsed = JSON.parse(legacy);
        var adminEnabled = (_parsed_adminEnabled = parsed.adminEnabled) !== null && _parsed_adminEnabled !== void 0 ? _parsed_adminEnabled : true;
        var writeEnabled = (_parsed_writeEnabled = parsed.writeEnabled) !== null && _parsed_writeEnabled !== void 0 ? _parsed_writeEnabled : true;
        if (adminEnabled) return 'admin';
        if (writeEnabled) return 'write';
        return 'read';
    } catch (unused) {
        return DEFAULT_MODE;
    }
};
var currentMode = readModeFromStorage();
var getInitialPermissionMode = function() {
    return currentMode;
};
var persistPermissionMode = function(value) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.localStorage.setItem(MODE_STORAGE_KEY, value);
};
var getPermissionMode = function() {
    return currentMode;
};
var setPermissionMode = function(value) {
    currentMode = value;
    persistPermissionMode(value);
};
var AppStateContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])({
    permissionMode: DEFAULT_MODE,
    userLoaded: false
});
var useAppState = function() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(AppStateContext);
};
_s(useAppState, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
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
"[project]/src/components/Main/ShortcutNav.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShortcutCard",
    ()=>ShortcutCard,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$BodyLong$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BodyLong$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/typography/BodyLong.js [client] (ecmascript) <export default as BodyLong>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$BodyShort$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BodyShort$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/typography/BodyShort.js [client] (ecmascript) <export default as BodyShort>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$index$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/util/index.tsx [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/theme.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/RouteLink.tsx [client] (ecmascript)");
;
;
var _this = ("TURBOPACK compile-time value", void 0);
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
var ShortcutCard = function(props) {
    _s();
    var title = props.title, subtitle = props.subtitle, to = props.to;
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false), 2), hover = _useState[0], setHover = _useState[1];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onMouseEnter: function() {
            return setHover(true);
        },
        onMouseLeave: function() {
            return setHover(false);
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            href: to,
            hideUnderline: true,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: '320px',
                    height: '150px',
                    margin: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["theme"].sizing.scale200,
                    backgroundColor: 'var(--ax-bg-raised)',
                    boxShadow: hover ? '0px 4px 2px -1px rgba(0,0,0,0.7)' : '0px 0px 6px 3px rgba(0,0,0,0.08)',
                    boxSizing: 'border-box',
                    border: '1px solid var(--ax-border-subtleA)',
                    outline: hover ? '2px solid var(--ax-border-focus)' : '2px solid var(--ax-border-default)',
                    outlineOffset: 0,
                    borderRadius: 10
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center justify-center h-full text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$BodyLong$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BodyLong$3e$__["BodyLong"], {
                                style: {
                                    wordBreak: 'break-word',
                                    color: 'var(--ax-text-default)',
                                    textDecoration: 'underline',
                                    fontWeight: 'bolder',
                                    marginTop: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["theme"].sizing.scale300,
                                    marginBottom: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$theme$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["theme"].sizing.scale200
                                },
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/components/Main/ShortcutNav.tsx",
                                lineNumber: 39,
                                columnNumber: 15
                            }, _this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Main/ShortcutNav.tsx",
                            lineNumber: 38,
                            columnNumber: 13
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$BodyShort$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BodyShort$3e$__["BodyShort"], {
                                style: {
                                    color: 'var(--ax-text-neutral)'
                                },
                                children: subtitle
                            }, void 0, false, {
                                fileName: "[project]/src/components/Main/ShortcutNav.tsx",
                                lineNumber: 54,
                                columnNumber: 15
                            }, _this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Main/ShortcutNav.tsx",
                            lineNumber: 53,
                            columnNumber: 13
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Main/ShortcutNav.tsx",
                    lineNumber: 37,
                    columnNumber: 11
                }, _this)
            }, void 0, false, {
                fileName: "[project]/src/components/Main/ShortcutNav.tsx",
                lineNumber: 19,
                columnNumber: 9
            }, _this)
        }, void 0, false, {
            fileName: "[project]/src/components/Main/ShortcutNav.tsx",
            lineNumber: 18,
            columnNumber: 7
        }, _this)
    }, void 0, false, {
        fileName: "[project]/src/components/Main/ShortcutNav.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, _this);
};
_s(ShortcutCard, "bRXmKus9fOZFlca/6zXTYU+twGY=");
_c = ShortcutCard;
var ShortcutNav = function() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-between flex-wrap",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShortcutCard, {
                title: "Behandlinger",
                subtitle: "Se og endre behandlinger",
                to: "/process"
            }, void 0, false, {
                fileName: "[project]/src/components/Main/ShortcutNav.tsx",
                lineNumber: 65,
                columnNumber: 5
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShortcutCard, {
                title: "Opplysningstyper",
                subtitle: "Se og endre opplysningstyper",
                to: "/informationtype"
            }, void 0, false, {
                fileName: "[project]/src/components/Main/ShortcutNav.tsx",
                lineNumber: 66,
                columnNumber: 5
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShortcutCard, {
                title: "Eksterne parter",
                subtitle: "Se alle eksterne parter",
                to: "/thirdparty"
            }, void 0, false, {
                fileName: "[project]/src/components/Main/ShortcutNav.tsx",
                lineNumber: 71,
                columnNumber: 5
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShortcutCard, {
                title: "Dashboard",
                subtitle: "Se statistikk over behandlinger",
                to: "/dashboard"
            }, void 0, false, {
                fileName: "[project]/src/components/Main/ShortcutNav.tsx",
                lineNumber: 72,
                columnNumber: 5
            }, _this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Main/ShortcutNav.tsx",
        lineNumber: 64,
        columnNumber: 3
    }, _this);
};
_c1 = ShortcutNav;
const __TURBOPACK__default__export__ = ShortcutNav;
var _c, _c1;
__turbopack_context__.k.register(_c, "ShortcutCard");
__turbopack_context__.k.register(_c1, "ShortcutNav");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/api/AuditApi.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAuditLog",
    ()=>getAuditLog,
    "getAudits",
    ()=>getAudits,
    "getEvents",
    ()=>getEvents
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/env.ts [client] (ecmascript)");
;
;
;
;
;
;
var getAuditLog = function(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        var auditLog;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/audit/log/").concat(id))
                    ];
                case 1:
                    auditLog = _state.sent().data;
                    auditLog.audits.sort(function(a, b) {
                        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(b.time).valueOf() - (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(a.time).valueOf();
                    });
                    return [
                        2,
                        auditLog
                    ];
            }
        });
    })();
};
var getAudits = function(page, count, table) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/audit?pageNumber=").concat(page, "&pageSize=").concat(count) + (table ? "&table=".concat(table) : ''))
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
var getEvents = function(page, count, table, action) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(function() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$env$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["env"].pollyBaseUrl, "/event?pageNumber=").concat(page, "&pageSize=").concat(count, "&table=").concat(table) + (action ? "&action=".concat(action) : ''))
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
"[project]/src/components/admin/audit/AuditComponents.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuditActionIcon",
    ()=>AuditActionIcon,
    "AuditLabel",
    ()=>AuditLabel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$InformationSquare$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InformationSquareIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/InformationSquare.js [client] (ecmascript) <export default as InformationSquareIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$MinusCircle$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MinusCircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/MinusCircle.js [client] (ecmascript) <export default as MinusCircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$PlusCircle$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/aksel-icons/dist/react/esm/PlusCircle.js [client] (ecmascript) <export default as PlusCircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Label$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Label$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/typography/Label.js [client] (ecmascript) <export default as Label>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/codeToFineText.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$CustomizedStatefulTooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/CustomizedStatefulTooltip.tsx [client] (ecmascript)");
;
var _this = ("TURBOPACK compile-time value", void 0);
;
;
;
;
;
;
var AuditLabel = function(props) {
    var label = props.label, children = props.children;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex w-1/5 self-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Label$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Label$3e$__["Label"], {
                    children: label
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/audit/AuditComponents.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "[project]/src/components/admin/audit/AuditComponents.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, _this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/audit/AuditComponents.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, _this);
};
_c = AuditLabel;
var AuditActionIcon = function(props) {
    var action = props.action, withText = props.withText;
    var iconStyle = {
        transform: 'translateY(1px)'
    };
    var icon = action === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EAuditAction"].CREATE && {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$PlusCircle$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircleIcon$3e$__["PlusCircleIcon"], {
            title: "Opprett",
            style: iconStyle
        }, void 0, false, {
            fileName: "[project]/src/components/admin/audit/AuditComponents.tsx",
            lineNumber: 34,
            columnNumber: 11
        }, _this),
        color: undefined
    } || action === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EAuditAction"].UPDATE && {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$InformationSquare$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InformationSquareIcon$3e$__["InformationSquareIcon"], {
            title: "Oppdater",
            style: iconStyle
        }, void 0, false, {
            fileName: "[project]/src/components/admin/audit/AuditComponents.tsx",
            lineNumber: 38,
            columnNumber: 13
        }, _this),
        color: undefined
    } || action === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EAuditAction"].DELETE && {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$aksel$2d$icons$2f$dist$2f$react$2f$esm$2f$MinusCircle$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MinusCircleIcon$3e$__["MinusCircleIcon"], {
            title: "Slett",
            style: iconStyle
        }, void 0, false, {
            fileName: "[project]/src/components/admin/audit/AuditComponents.tsx",
            lineNumber: 42,
            columnNumber: 13
        }, _this),
        color: undefined
    } || {
        icon: undefined,
        color: undefined
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$CustomizedStatefulTooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        content: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tekster"][action],
        text: withText ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tekster"][action] : undefined,
        color: icon.color,
        icon: icon.icon
    }, void 0, false, {
        fileName: "[project]/src/components/admin/audit/AuditComponents.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, _this);
};
_c1 = AuditActionIcon;
var _c, _c1;
__turbopack_context__.k.register(_c, "AuditLabel");
__turbopack_context__.k.register(_c1, "AuditActionIcon");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/audit/LastEvents.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LastEvents",
    ()=>LastEvents
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Heading$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/typography/Heading.js [client] (ecmascript) <export default as Heading>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Label$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Label$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/typography/Label.js [client] (ecmascript) <export default as Label>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$form$2f$select$2f$Select$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/form/select/Select.js [client] (ecmascript) <export default as Select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tabs$2f$Tabs$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Tabs$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/tabs/Tabs.js [client] (ecmascript) <locals> <export default as Tabs>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$AuditApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/AuditApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/util/codeToFineText.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$CustomizedStatefulTooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/CustomizedStatefulTooltip.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/RouteLink.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$audit$2f$AuditComponents$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/audit/AuditComponents.tsx [client] (ecmascript)");
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
var LastEvents = function() {
    _s();
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(), 2), events = _useState[0], setEvents = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].PROCESS), 2), table = _useState1[0], setTable = _useState1[1];
    var _useState2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EAuditAction"].CREATE), 2), action = _useState2[0], setAction = _useState2[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LastEvents.useEffect": function() {
            ;
            ({
                "LastEvents.useEffect": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
                        "LastEvents.useEffect": function() {
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                                "LastEvents.useEffect": function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$AuditApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getEvents"])(0, 10, table, action)
                                            ];
                                        case 1:
                                            setEvents.apply(void 0, [
                                                _state.sent()
                                            ]);
                                            return [
                                                2
                                            ];
                                    }
                                }
                            }["LastEvents.useEffect"]);
                        }
                    }["LastEvents.useEffect"])();
                }
            })["LastEvents.useEffect"]();
        }
    }["LastEvents.useEffect"], [
        table,
        action
    ]);
    var content = events === null || events === void 0 ? void 0 : events.content.map(function(event) {
        var row = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pr-2 min-w-0 flex items-center gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "shrink-0 align-middle",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$audit$2f$AuditComponents$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["AuditActionIcon"], {
                                action: event.action
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                                lineNumber: 27,
                                columnNumber: 13
                            }, _this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "overflow-hidden whitespace-nowrap text-ellipsis",
                            children: event.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                            lineNumber: 29,
                            columnNumber: 11
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "sm:min-w-32 sm:text-right",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$CustomizedStatefulTooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(event.time).format('lll'),
                        text: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(event.time).fromNow()
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, _this)
                }, void 0, false, {
                    fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, _this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, _this);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-1.5",
            children: event.action === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EAuditAction"].DELETE ? row : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["urlForObject"])(event.table, event.tableId),
                hideUnderline: true,
                className: "block w-full min-w-0",
                children: row
            }, void 0, false, {
                fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                lineNumber: 45,
                columnNumber: 11
            }, _this)
        }, event.id, false, {
            fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, _this);
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Heading$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading$3e$__["Heading"], {
                        size: "medium",
                        level: "2",
                        children: "Siste hendelser"
                    }, void 0, false, {
                        fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, _this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 flex-wrap w-full sm:w-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Label$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Label$3e$__["Label"], {
                                className: "mr-2",
                                children: "Hendelsestype"
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                                lineNumber: 64,
                                columnNumber: 11
                            }, _this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$form$2f$select$2f$Select$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Select$3e$__["Select"], {
                                size: "small",
                                label: "Hendelsestype",
                                hideLabel: true,
                                onChange: function(event) {
                                    return setAction(event.target.value);
                                },
                                children: Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EAuditAction"]).map(function(auditAction) {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: auditAction,
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tekster"][auditAction]
                                    }, auditAction, false, {
                                        fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, _this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, _this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, _this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, _this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tabs$2f$Tabs$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Tabs$3e$__["Tabs"], {
                    value: table,
                    onChange: function(val) {
                        return setTable(val);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tabs$2f$Tabs$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Tabs$3e$__["Tabs"].List, {
                                className: "min-w-max",
                                children: [
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].PROCESS,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].INFORMATION_TYPE,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].DISCLOSURE,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].DOCUMENT
                                ].map(function(tableName) {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tabs$2f$Tabs$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Tabs$3e$__["Tabs"].Tab, {
                                        value: tableName,
                                        label: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$util$2f$codeToFineText$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tekster"][tableName] || tableName
                                    }, tableName, false, {
                                        fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                                        lineNumber: 89,
                                        columnNumber: 17
                                    }, _this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                                lineNumber: 82,
                                columnNumber: 13
                            }, _this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, _this),
                        [
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].PROCESS,
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].INFORMATION_TYPE,
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].DISCLOSURE,
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].DOCUMENT
                        ].map(function(tableName) {
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$tabs$2f$Tabs$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__Tabs$3e$__["Tabs"].Panel, {
                                value: tableName,
                                children: content
                            }, tableName, false, {
                                fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, _this);
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                    lineNumber: 80,
                    columnNumber: 9
                }, _this)
            }, void 0, false, {
                fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, _this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/audit/LastEvents.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, _this);
};
_s(LastEvents, "YshkFBQ7GjF3PEDjvCNVtVn85tY=");
_c = LastEvents;
var _c;
__turbopack_context__.k.register(_c, "LastEvents");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/admin/audit/RecentEditsByUser.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RecentEditsByUser",
    ()=>RecentEditsByUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Heading$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/typography/Heading.js [client] (ecmascript) <export default as Heading>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$GetAllApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/api/GetAllApi.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$ProcessApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/ProcessApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$CustomizedStatefulTooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/CustomizedStatefulTooltip.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/RouteLink.tsx [client] (ecmascript)");
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
var RecentEditsByUser = function() {
    _s();
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]), 2), recentEdits = _useState[0], setRecentEdits = _useState[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RecentEditsByUser.useEffect": function() {
            ;
            ({
                "RecentEditsByUser.useEffect": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
                        "RecentEditsByUser.useEffect": function() {
                            var data;
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                                "RecentEditsByUser.useEffect": function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$ProcessApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getRecentEditedProcesses"])()
                                            ];
                                        case 1:
                                            data = _state.sent();
                                            setRecentEdits(data);
                                            return [
                                                2
                                            ];
                                    }
                                }
                            }["RecentEditsByUser.useEffect"]);
                        }
                    }["RecentEditsByUser.useEffect"])();
                }
            })["RecentEditsByUser.useEffect"]();
        }
    }["RecentEditsByUser.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "items-center w-full min-w-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Heading$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading$3e$__["Heading"], {
                size: "medium",
                level: "2",
                className: "mb-6",
                children: "Mine siste endringer"
            }, void 0, false, {
                fileName: "[project]/src/components/admin/audit/RecentEditsByUser.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, _this),
            recentEdits.slice(0, 10).sort(function(a, b) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(b.time).valueOf() - (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(a.time).valueOf();
            }).map(function(ps) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$RouteLink$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["urlForObject"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EObjectType"].PROCESS, ps.process.id),
                    hideUnderline: true,
                    className: "block w-full min-w-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full flex flex-col sm:flex-row sm:justify-between mb-1.5 min-w-0 gap-1 sm:gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0 overflow-hidden whitespace-nowrap text-ellipsis",
                                children: ps.process.name
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/audit/RecentEditsByUser.tsx",
                                lineNumber: 35,
                                columnNumber: 15
                            }, _this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sm:min-w-32 sm:text-right",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$CustomizedStatefulTooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(ps.time).format('lll'),
                                    text: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(ps.time).fromNow()
                                }, void 0, false, {
                                    fileName: "[project]/src/components/admin/audit/RecentEditsByUser.tsx",
                                    lineNumber: 39,
                                    columnNumber: 17
                                }, _this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/admin/audit/RecentEditsByUser.tsx",
                                lineNumber: 38,
                                columnNumber: 15
                            }, _this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/admin/audit/RecentEditsByUser.tsx",
                        lineNumber: 34,
                        columnNumber: 13
                    }, _this)
                }, ps.process.id, false, {
                    fileName: "[project]/src/components/admin/audit/RecentEditsByUser.tsx",
                    lineNumber: 28,
                    columnNumber: 11
                }, _this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/admin/audit/RecentEditsByUser.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, _this);
};
_s(RecentEditsByUser, "1Kwc87qo2DxVyrqfES9054nQ9nY=");
_c = RecentEditsByUser;
var _c;
__turbopack_context__.k.register(_c, "RecentEditsByUser");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/Markdown.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Markdown",
    ()=>Markdown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$BodyLong$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BodyLong$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/typography/BodyLong.js [client] (ecmascript) <export default as BodyLong>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Heading$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/typography/Heading.js [client] (ecmascript) <export default as Heading>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$link$2f$Link$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/link/Link.js [client] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$list$2f$List$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/list/List.js [client] (ecmascript) <locals> <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [client] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rehype$2d$raw$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/rehype-raw/lib/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/remark-gfm/lib/index.js [client] (ecmascript)");
;
var _this = ("TURBOPACK compile-time value", void 0);
;
;
;
;
;
var Markdown = function(param) {
    var _param_escapeHtml = param.escapeHtml, escapeHtml = _param_escapeHtml === void 0 ? true : _param_escapeHtml, _param_compact = param.compact, compact = _param_compact === void 0 ? false : _param_compact, _param_inline = param.inline, inline = _param_inline === void 0 ? false : _param_inline, source = param.source;
    var renderers = {
        a: function(linkProps) {
            var children = linkProps.children, href = linkProps.href;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$link$2f$Link$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                href: href,
                target: '_blank',
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/common/Markdown.tsx",
                lineNumber: 23,
                columnNumber: 9
            }, _this);
        },
        p: function(parProps) {
            var children = parProps.children;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$BodyLong$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BodyLong$3e$__["BodyLong"], {
                style: compact || inline ? {
                    marginTop: 0,
                    marginBottom: 0,
                    display: inline ? 'inline' : undefined
                } : undefined,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/common/Markdown.tsx",
                lineNumber: 31,
                columnNumber: 9
            }, _this);
        },
        h2: function(headerProps) {
            var children = headerProps.children;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Heading$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading$3e$__["Heading"], {
                size: "medium",
                level: "2",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/common/Markdown.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, _this);
        },
        h3: function(headerProps) {
            var children = headerProps.children;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Heading$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading$3e$__["Heading"], {
                size: "small",
                level: "3",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/common/Markdown.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, _this);
        },
        h4: function(headerProps) {
            var children = headerProps.children;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Heading$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading$3e$__["Heading"], {
                size: "xsmall",
                level: "4",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/common/Markdown.tsx",
                lineNumber: 65,
                columnNumber: 9
            }, _this);
        },
        href: function(linkProps) {
            var children = linkProps.children, href = linkProps.href;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$link$2f$Link$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                href: href,
                target: '_blank',
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/common/Markdown.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, _this);
        },
        li: function(liProps) {
            var children = liProps.children;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$list$2f$List$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__List$3e$__["List"].Item, {
                className: "ml-4",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/common/Markdown.tsx",
                lineNumber: 80,
                columnNumber: 14
            }, _this);
        },
        ul: function(ulProps) {
            var children = ulProps.children;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$list$2f$List$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__List$3e$__["List"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/common/Markdown.tsx",
                lineNumber: 84,
                columnNumber: 14
            }, _this);
        }
    };
    var htmlPlugins = escapeHtml ? [] : [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$rehype$2d$raw$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"]
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "polly-markdown",
        style: {
            color: 'var(--ax-text-neutral)',
            display: inline ? 'inline' : undefined
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
            components: renderers,
            remarkPlugins: [
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"]
            ],
            rehypePlugins: htmlPlugins,
            children: source || ''
        }, void 0, false, {
            fileName: "[project]/src/components/common/Markdown.tsx",
            lineNumber: 93,
            columnNumber: 7
        }, _this)
    }, void 0, false, {
        fileName: "[project]/src/components/common/Markdown.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, _this);
};
_c = Markdown;
var _c;
__turbopack_context__.k.register(_c, "Markdown");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/MainPage.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MainPage",
    ()=>MainPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_async_to_generator.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_sliced_to_array.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__ = __turbopack_context__.i("[project]/node_modules/tslib/tslib.es6.mjs [client] (ecmascript) <export __generator as _>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Heading$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading$3e$__ = __turbopack_context__.i("[project]/node_modules/@navikt/ds-react/esm/typography/Heading.js [client] (ecmascript) <export default as Heading>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$GetAllApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/api/GetAllApi.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DashboardApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/DashboardApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$SettingsApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/api/SettingsApi.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Main$2f$ShortcutNav$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Main/ShortcutNav.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$audit$2f$LastEvents$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/audit/LastEvents.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$audit$2f$RecentEditsByUser$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/audit/RecentEditsByUser.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Markdown$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/Markdown.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/service/User.ts [client] (ecmascript)");
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
var MainPage = function() {
    _s();
    var _useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(), 2), settings = _useState[0], setSettings = _useState[1];
    var _useState1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true), 2), isLoading = _useState1[0], setLoading = _useState1[1];
    var _useState2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_sliced_to_array$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(), 2), dashboardData = _useState2[0], setDashboardData = _useState2[1];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MainPage.useEffect": function() {
            ;
            ({
                "MainPage.useEffect": function() {
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_async_to_generator$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])({
                        "MainPage.useEffect": function() {
                            var key;
                            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$export__$5f$_generator__as__$5f3e$__["_"])(this, {
                                "MainPage.useEffect": function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$SettingsApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getSettings"])()
                                            ];
                                        case 1:
                                            setSettings.apply(void 0, [
                                                _state.sent()
                                            ]);
                                            setLoading(false);
                                            for(var key in localStorage){
                                                if (key.indexOf('Yposition') === 0) {
                                                    localStorage.removeItem(key);
                                                }
                                            }
                                            return [
                                                2
                                            ];
                                    }
                                }
                            }["MainPage.useEffect"]);
                        }
                    }["MainPage.useEffect"])();
                }
            })["MainPage.useEffect"]();
        }
    }["MainPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MainPage.useEffect": function() {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$DashboardApi$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getDashboard"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EProcessStatusFilter"].All).then(setDashboardData);
        }
    }["MainPage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-wrap",
        role: "main",
        children: !isLoading && dashboardData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center mb-10",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Heading$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading$3e$__["Heading"], {
                                size: "xlarge",
                                level: "1",
                                children: "Hva vil du gjøre?"
                            }, void 0, false, {
                                fileName: "[project]/src/pages/MainPage.tsx",
                                lineNumber: 39,
                                columnNumber: 15
                            }, _this)
                        }, void 0, false, {
                            fileName: "[project]/src/pages/MainPage.tsx",
                            lineNumber: 38,
                            columnNumber: 13
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Main$2f$ShortcutNav$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/src/pages/MainPage.tsx",
                            lineNumber: 43,
                            columnNumber: 13
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/MainPage.tsx",
                    lineNumber: 37,
                    columnNumber: 11
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full flex justify-center mt-12 mb-10",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Heading$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading$3e$__["Heading"], {
                        size: "large",
                        level: "2",
                        children: "Hva har endret seg i det siste?"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/MainPage.tsx",
                        lineNumber: 47,
                        columnNumber: 13
                    }, _this)
                }, void 0, false, {
                    fileName: "[project]/src/pages/MainPage.tsx",
                    lineNumber: 46,
                    columnNumber: 11
                }, _this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-full flex mb-6 flex-wrap gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex w-full md:w-[48%] min-w-0",
                            style: {
                                minHeight: '550px'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-4 rounded-lg shadow-[0px_0px_6px_3px_rgba(0,0,0,0.08)] w-full min-w-0",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$service$2f$User$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["user"].isLoggedIn() ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$audit$2f$RecentEditsByUser$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["RecentEditsByUser"], {}, void 0, false, {
                                    fileName: "[project]/src/pages/MainPage.tsx",
                                    lineNumber: 56,
                                    columnNumber: 19
                                }, _this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full flex flex-col",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$navikt$2f$ds$2d$react$2f$esm$2f$typography$2f$Heading$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heading$3e$__["Heading"], {
                                            size: "medium",
                                            level: "2",
                                            className: "mb-6",
                                            children: "Mine siste endringer"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/MainPage.tsx",
                                            lineNumber: 59,
                                            columnNumber: 21
                                        }, _this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 flex items-center justify-center text-center px-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                children: [
                                                    "Du er logget ut og kan ikke se dine siste endringer.",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                        fileName: "[project]/src/pages/MainPage.tsx",
                                                        lineNumber: 65,
                                                        columnNumber: 25
                                                    }, _this),
                                                    "Logg inn på nytt for å se dine siste endringer."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/MainPage.tsx",
                                                lineNumber: 63,
                                                columnNumber: 23
                                            }, _this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/MainPage.tsx",
                                            lineNumber: 62,
                                            columnNumber: 21
                                        }, _this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/MainPage.tsx",
                                    lineNumber: 58,
                                    columnNumber: 19
                                }, _this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/MainPage.tsx",
                                lineNumber: 54,
                                columnNumber: 15
                            }, _this)
                        }, void 0, false, {
                            fileName: "[project]/src/pages/MainPage.tsx",
                            lineNumber: 53,
                            columnNumber: 13
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex w-full md:w-[48%] min-w-0",
                            style: {
                                minHeight: '550px'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-4 rounded-lg shadow-[0px_0px_6px_3px_rgba(0,0,0,0.08)] w-full min-w-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$audit$2f$LastEvents$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["LastEvents"], {}, void 0, false, {
                                    fileName: "[project]/src/pages/MainPage.tsx",
                                    lineNumber: 75,
                                    columnNumber: 17
                                }, _this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/MainPage.tsx",
                                lineNumber: 74,
                                columnNumber: 15
                            }, _this)
                        }, void 0, false, {
                            fileName: "[project]/src/pages/MainPage.tsx",
                            lineNumber: 73,
                            columnNumber: 13
                        }, _this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full mt-2 mb-0.5",
                            style: {
                                minHeight: '550px'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-4 rounded-lg shadow-[0px_0px_6px_3px_rgba(0,0,0,0.08)]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$Markdown$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["Markdown"], {
                                    source: settings === null || settings === void 0 ? void 0 : settings.frontpageMessage,
                                    escapeHtml: false
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/MainPage.tsx",
                                    lineNumber: 81,
                                    columnNumber: 17
                                }, _this)
                            }, void 0, false, {
                                fileName: "[project]/src/pages/MainPage.tsx",
                                lineNumber: 80,
                                columnNumber: 15
                            }, _this)
                        }, void 0, false, {
                            fileName: "[project]/src/pages/MainPage.tsx",
                            lineNumber: 79,
                            columnNumber: 13
                        }, _this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/pages/MainPage.tsx",
                    lineNumber: 52,
                    columnNumber: 11
                }, _this)
            ]
        }, void 0, true)
    }, void 0, false, {
        fileName: "[project]/src/pages/MainPage.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, _this);
};
_s(MainPage, "jzz5DKEKxVDAZaUfKxL2x1lOdOg=");
_c = MainPage;
var _c;
__turbopack_context__.k.register(_c, "MainPage");
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/index.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_type_of.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$MainPage$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/MainPage.tsx [client] (ecmascript)");
;
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$MainPage$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MainPage"];
if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_type_of$2e$js__$5b$client$5d$__$28$ecmascript$29$__["_"])(globalThis.$RefreshHelpers$) === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    function() {
        return __turbopack_context__.r("[project]/pages/index.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__330b64ef._.js.map