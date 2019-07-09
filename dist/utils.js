"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRouteParts = function (route) {
    return decodeURIComponent(route).trim()
        .split('/')
        .filter(function (part) { return part !== ''; })
        .map(function (part, index) { return ({
        part: part,
        index: index,
        isParam: part.startsWith(':')
    }); });
};
var removeFromStart = function (toRemove) { return function (string) {
    return string.startsWith(toRemove)
        ? string.substr(toRemove.length)
        : string;
}; };
var withoutStart = function (hash) {
    return ['#!/', '#/', '#!', '#', '/'].reduce(function (acc, toRemove) { return removeFromStart(toRemove)(acc); }, hash);
};
var removeQuery = function (hash) { return hash.split('?')[0]; };
var getHashParts = function (hash) {
    return withoutStart(removeQuery(decodeURIComponent(hash)))
        .split('/')
        .map(function (part) { return part.trim(); });
};
var matchesRouteExact = function (hashparts, index) { return function (route) {
    return Boolean(hashparts[index])
        && Boolean(route[index])
        && hashparts[index] === route[index].part
        && !route[index].isParam;
}; };
var matchesRouteParam = function (hashparts, index) { return function (route) {
    return Boolean(hashparts[index]) && route[index].isParam;
}; };
var isSameLength = function (arr1) { return function (arr2) {
    return arr1.length === arr2.length;
}; };
exports.getMatchingRoute = function (hash, routes) {
    var hashparts = getHashParts(hash);
    var routesWithSameLength = routes.filter(isSameLength(hashparts));
    if (!routesWithSameLength) {
        return undefined;
    }
    var matchingRoutes = Array.from(Array(hashparts.length)).map(function (d, i) { return i; })
        .reduce(function (routes, index) {
        var exactMatches = routes.filter(matchesRouteExact(hashparts, index));
        return exactMatches.length > 0
            ? exactMatches
            : routes.filter(matchesRouteParam(hashparts, index));
    }, routesWithSameLength);
    return matchingRoutes[0];
};
exports.getRouteFromParts = function (parts, routes) {
    var route = parts.map(function (_a) {
        var part = _a.part;
        return part;
    }).join('/');
    return routes.find(function (r) { return withoutStart(r) === route; });
};
var getKeyValuesFromQuery = function (query) {
    return query.split('&')
        .map(function (part) { return part.split('='); })
        .filter(function (_a) {
        var key = _a[0], value = _a[1];
        return Boolean(key) && key !== '' && Boolean(value) && value !== '';
    })
        .reduce(function (acc, _a) {
        var _b;
        var key = _a[0], value = _a[1];
        return (__assign({}, acc, (_b = {}, _b[key] = value, _b)));
    }, {});
};
exports.getQuery = function (hash) {
    var afterQuestion = hash.split('?')[1];
    return afterQuestion
        ? getKeyValuesFromQuery(afterQuestion)
        : {};
};
exports.getParams = function (hash, route) {
    var hashparts = getHashParts(hash);
    return route.filter(function (_a) {
        var isParam = _a.isParam;
        return isParam;
    })
        .reduce(function (acc, _a) {
        var _b;
        var part = _a.part, index = _a.index;
        return (__assign({}, acc, (_b = {}, _b[part.substr(1)] = hashparts[index], _b)));
    }, {});
};
exports.getRouteInfo = function (hash, paths) {
    var routes = paths.map(exports.getRouteParts);
    var matchingRoute = exports.getMatchingRoute(hash, routes);
    return matchingRoute
        ? {
            matchesRoute: true,
            route: exports.getRouteFromParts(matchingRoute, paths),
            params: exports.getParams(hash, matchingRoute),
            query: exports.getQuery(hash),
        }
        : {
            matchesRoute: false,
            params: {},
            query: exports.getQuery(hash),
        };
};
