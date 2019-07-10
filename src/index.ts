import { getRouteInfo } from './utils'
import { Subscriber } from './types'

export const goTo = (hash: string) => {
    window.location.hash = hash
}

class Router {

  window: Window
  paths: string[]
  subscribers: Subscriber[]

  constructor(paths: string[]) {
    this.paths = paths
    this.window = window
    this.subscribers = []
    this.window.addEventListener('hashchange', () => this.onHashChange())
    this.window.addEventListener('load', () => this.onHashChange())
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

  goTo(hash: string) {
    return goTo(hash)
  }
}

export default (paths: string[]) => new Router(paths)
