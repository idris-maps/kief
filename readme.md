# Kief

Simple framework agnostic hash router inspired by redux.

## Usage

```typescript
import createRouter from 'kief'

// Define the routes
const router = createRouter([
  '/about',
  '/users',
  '/users/:id', // use colon to define parameters
])

// Listen to hash changes
router.subscribe(routeInfo => {
  // Do whatever
})

```

The callback inside `.subscribe` takes a `RouteInfo` argument:

```typescript
export interface RouteInfo {
  matchesRoute: boolean // Does the current hash match a defined route
  params: { [key: string]: string } // Parameters defined with colon
  query: { [key: string]: string } // Query parameters
  route?: string // The matched route if applicable
}
```

## Examples

### with `lit-html`

```typescript
// The router
const router = createRouter([
  '/query',
  '/users/:id',
])

// The components
const Header = () =>
  html`
    <header>
      <a href="#/">Home</a>
      <a href="#/user/1">User One</a>
      <a href="#/query?foo=bar&hello=world">Some page with query parameters</a>
    </header>
  `
const Home = () => html`<h1>Home</h1>`
const User = (id: string) => html`<h1>User ${id}`
const Query = (query: { [key: string]: string }) =>
  html`
    <h1>Some page with query parameters</h1>
    <table>
      <tr><th>KEY</th><th>VALUE</th></tr>
      ${
        Object.keys(query).map(key => html`<tr><td>${key}</td><td>${object[key]}</td></tr>`)
      }
    </table>
  `
const Page = ({ params, query, route }: RouteInfo) => {
  switch(route) {
    case '/query': return Query(query)
    case '/users/:id': return User(params.id)
    default: return Home()
  }
}
const App = (routeInfo: RouteInfo) =>
  html`
    ${Header()}
    ${Page(routeInfo)}
  `

// Re-render app on route changes
router.subscribe(routeInfo => {
  render(App(routeInfo), document.body)
})
```

### With `redux`

```typescript
// Pass route changes to the store
router.subscribe(routeInfo => store.dispatch({ type: ROUTE_CHANGE, payload: routeInfo }))
```
