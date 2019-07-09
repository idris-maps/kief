import { Query, Params, RouteInfo } from './types';
export declare const getRouteParts: (route: string) => import("./types").RoutePart[];
export declare const getMatchingRoute: (hash: string, routes: import("./types").RoutePart[][]) => import("./types").RoutePart[] | undefined;
export declare const getRouteFromParts: (parts: import("./types").RoutePart[], routes: string[]) => string | undefined;
export declare const getQuery: (hash: string) => Query;
export declare const getParams: (hash: string, route: import("./types").RoutePart[]) => Params;
export declare const getRouteInfo: (hash: string, paths: string[]) => RouteInfo;
