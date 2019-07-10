import { Subscriber } from './types';
export declare const goTo: (hash: string) => void;
declare class Router {
    window: Window;
    paths: string[];
    subscribers: Subscriber[];
    constructor(paths: string[]);
    private onHashChange;
    subscribe(subscriber: Subscriber): void;
    goTo(hash: string): void;
}
declare const _default: (paths: string[]) => Router;
export default _default;
