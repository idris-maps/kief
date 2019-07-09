import { RouteInfo } from './types';
declare class Router {
    window: Window;
    paths: string[];
    constructor(paths: string[]);
    onHashChange(): void;
    subscribe(routeInfo: RouteInfo): RouteInfo;
}
declare const _default: (paths: string[]) => Router;
export default _default;
