import test from 'ava'
import {
  getMatchingRoute,
  getParams,
  getQuery,
  getRouteFromParts,
  getRouteInfo,
  getRouteParts,
} from '../utils'

const route = {
  ABOUT: '/about',
  QUERY: '/query',
  USER: '/users/:id',
  USERS: '/users',
  X: '/:what/some/:id',
}

const routes: string[] = Object.keys(route).map(key => route[key])

test('getParts', t => {
  const parts = getRouteParts('/hello/:world')
  t.true(Array.isArray(parts))
  t.is(parts.length, 2)
  t.deepEqual(parts[0], { index: 0, isParam: false, part: 'hello' })
  t.deepEqual(parts[1], { index: 1, isParam: true, part: ':world' })
})

test('getMatchingRoute', t => {
  const getRoute = (hash: string): string => {
    const matching = getMatchingRoute(hash, routes.map(getRouteParts))
    return matching ? getRouteFromParts(matching, routes) : ''
  }
  t.is(getRoute('#about'), route.ABOUT)
  t.is(getRoute('#!about'), route.ABOUT)
  t.is(getRoute('#/about'), route.ABOUT)
  t.is(getRoute('#!/about'), route.ABOUT)
  t.is(getRoute('#users'), route.USERS)
  t.is(getRoute('#/users/1'), route.USER)
  t.is(getRoute('#xxx/some/else'), route.X)
  t.is(getRoute('#/www/some/120'), route.X)
  t.is(getRoute('#!/query?foo=bar'), route.QUERY)
})

test('getQuery', t => {
  t.deepEqual(getQuery('#a?hello=world&foo=bar'), { hello: 'world', foo: 'bar' })
  t.deepEqual(getQuery('?not==a proper query=really&foo=bar'), { foo: 'bar' })
  t.deepEqual(getQuery('#!xxx?with= space'), { with: ' space' })
})

test('getParams', t => {
  const route = [
    { part: 'users', isParam: false, index: 0 },
    { part: ':id', isParam: true, index: 1 },
    { part: 'contracts', isParam: false, index: 2 },
    { part: ':contractId', isParam: true, index: 3 },
  ]
  t.deepEqual(getParams('#/users/1/contracts/23', route), { id: '1', contractId: '23' })
  t.deepEqual(getParams('#/users/1/contracts/23?foo=bar', route), { id: '1', contractId: '23' })
})

test('getRouteInfo', t => {
  t.deepEqual(getRouteInfo('#about?foo=bar', routes), { matchesRoute: true, route: route.ABOUT, params: {}, query: { foo: 'bar' } })
  t.deepEqual(getRouteInfo('#!/users/12', routes), { matchesRoute: true, route: route.USER, params: { id: '12' }, query: {} })
  t.deepEqual(getRouteInfo('#not-a-route', routes), { matchesRoute: false, params: {}, query: {} })
  t.deepEqual(getRouteInfo('#not-a-route?foo=1', routes), { matchesRoute: false, params: {}, query: { foo: '1' } })
  t.deepEqual(getRouteInfo('without-hash', routes), { matchesRoute: false, params: {}, query: {} })
})