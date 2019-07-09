"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var Router = /** @class */ (function () {
    function Router(paths) {
        var _this = this;
        this.paths = paths;
        this.window = window;
        this.window.addEventListener('hashchange', function () { return _this.onHashChange(); });
        this.onHashChange();
    }
    Router.prototype.onHashChange = function () {
        var hash = window.location.hash;
        this.subscribe(utils_1.getRouteInfo(hash, this.paths));
    };
    Router.prototype.subscribe = function (routeInfo) {
        return routeInfo;
    };
    return Router;
}());
exports.default = (function (paths) { return new Router(paths); });
