import { Route, Query, Params, RouteInfo } from './types'

export const getRouteParts = (route: string): Route =>
  decodeURIComponent(route).trim()
    .split('/')
    .filter(part => part !== '')
    .map((part, index) => ({
      part,
      index,
      isParam: part.startsWith(':')
    }))

const removeFromStart = (toRemove: string) => (string: string) =>
  string.startsWith(toRemove)
    ? string.substr(toRemove.length)
    : string

const withoutStart = (hash: string): string =>
  ['#!/', '#/', '#!', '#', '/'].reduce((acc, toRemove) => removeFromStart(toRemove)(acc), hash)

const removeQuery = (hash: string): string => hash.split('?')[0]

const getHashParts = (hash: string): string[] =>
  withoutStart(removeQuery(decodeURIComponent(hash)))
    .split('/')
    .map(part => part.trim())
  

const matchesRouteExact = (hashparts: string[], index: number) => (route: Route): boolean =>
  Boolean(hashparts[index])
    && Boolean(route[index])
    && hashparts[index]  === route[index].part
    && !route[index].isParam

const matchesRouteParam = (hashparts: string[], index: number) => (route: Route): boolean =>
  Boolean(hashparts[index]) && route[index].isParam

const isSameLength = (arr1: any[]) => (arr2: any[]): boolean =>
  arr1.length === arr2.length

export const getMatchingRoute = (hash: string, routes: Route[]): Route | undefined => {
  const hashparts = getHashParts(hash)
  const routesWithSameLength = routes.filter(isSameLength(hashparts))
  if (!routesWithSameLength) { return undefined }
  const matchingRoutes = Array.from(Array(hashparts.length)).map((d, i) => i)
    .reduce((routes: Route[], index: number) => {
      const exactMatches = routes.filter(matchesRouteExact(hashparts, index))
      return exactMatches.length > 0
        ? exactMatches
        : routes.filter(matchesRouteParam(hashparts, index))
    }, routesWithSameLength)
  return matchingRoutes[0]
}

export const getRouteFromParts = (parts: Route, routes: string[]): string | undefined => {
  const route = parts.map(({ part }) => part).join('/')
  return routes.find(r => withoutStart(r) === route)
}

const getKeyValuesFromQuery = (query: string): Query =>
  query.split('&')
    .map(part => part.split('='))
    .filter(([key, value]) => Boolean(key) && key !== '' && Boolean(value) && value !== '')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

export const getQuery = (hash: string): Query => {
  const afterQuestion = hash.split('?')[1]
  return afterQuestion
    ? getKeyValuesFromQuery(afterQuestion)
    : {}
}

export const getParams = (hash: string, route: Route): Params => {
  const hashparts = getHashParts(hash)
  return route.filter(({ isParam }) => isParam)
    .reduce((acc, { part, index }) => ({ ...acc, [part.substr(1)]: hashparts[index] }), {})
}

export const getRouteInfo = (hash: string, paths: string[]): RouteInfo => {
  const routes = paths.map(getRouteParts)
  const matchingRoute = getMatchingRoute(hash, routes)
  return matchingRoute
    ? {
      matchesRoute: true,
      route: getRouteFromParts(matchingRoute, paths),
      params: getParams(hash, matchingRoute),
      query: getQuery(hash),
    }
    : {
      matchesRoute: false,
      params: {},
      query: getQuery(hash),
    }
}