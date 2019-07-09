export interface RoutePart {
  part: string
  index: number
  isParam: boolean
}

export type Route = RoutePart[]

export interface Query {
  [key: string]: string
}

export interface Params {
  [key: string]: string
}

export interface RouteInfo {
  matchesRoute: boolean
  params: Params
  query: Query
  route?: string
}