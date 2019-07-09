import { Subscriber } from './types';
declare class Router {
    window: Window;
    paths: string[];
    subscribers: Subscriber[];
    constructor(paths: string[]);
    private onHashChange;
    subscribe(subscriber: Subscriber): void;
}
declare const _default: (paths: string[]) => Router;
export default _default;
