import { getRouteInfo } from './utils'
import { Subscriber } from './types'

class Router {
  window: Window
  paths: string[]
  subscribers: Subscriber[]
  constructor(paths: string[]) {
    this.paths = paths
    this.window = window
    this.subscribers = []
    this.window.addEventListener('hashchange', () => this.onHashChange())
    this.onHashChange()
  }

  private onHashChange() {
    const hash = window.location.hash
    const routeInfo = getRouteInfo(hash, this.paths)
    this.subscribers.forEach(sub => sub(routeInfo))
  }

  subscribe(subscriber: Subscriber) {
    this.subscribers = [...this.subscribers, subscriber]
  }
}

export default (paths: string[]) => new Router(paths)
