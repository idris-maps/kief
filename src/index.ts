import { getRouteInfo } from './utils'
import { RouteInfo } from './types'

class Router {
  window: Window
  paths: string[]
  constructor(paths: string[]) {
    this.paths = paths
    this.window = window
    this.window.addEventListener('hashchange', () => this.onHashChange())
    this.onHashChange()
  }

  onHashChange() {
    const hash = window.location.hash
    this.subscribe(getRouteInfo(hash, this.paths))
  }

  subscribe(routeInfo: RouteInfo) {
    return routeInfo
  }
}

export default (paths: string[]) => new Router(paths)
