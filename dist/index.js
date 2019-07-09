"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var Router = /** @class */ (function () {
    function Router(paths) {
        var _this = this;
        this.paths = paths;
        this.window = window;
        this.subscribers = [];
        this.window.addEventListener('hashchange', function () { return _this.onHashChange(); });
        this.onHashChange();
    }
    Router.prototype.onHashChange = function () {
        var hash = window.location.hash;
        var routeInfo = utils_1.getRouteInfo(hash, this.paths);
        this.subscribers.forEach(function (sub) { return sub(routeInfo); });
    };
    Router.prototype.subscribe = function (subscriber) {
        this.subscribers = this.subscribers.concat([subscriber]);
    };
    return Router;
}());
exports.default = (function (paths) { return new Router(paths); });
