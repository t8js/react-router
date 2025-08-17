[![npm](https://flat.badgen.net/npm/v/@t8/react-router?labelColor=345&color=46e)](https://www.npmjs.com/package/@t8/react-router) ![Lightweight](https://flat.badgen.net/bundlephobia/minzip/@t8/react-router/?label=minzip&labelColor=345&color=46e&r=0) ![TypeScript ✓](https://flat.badgen.net/badge/TypeScript/✓?labelColor=345&color=345) ![CSR ✓](https://flat.badgen.net/badge/CSR/✓?labelColor=345&color=345) ![SSR ✓](https://flat.badgen.net/badge/SSR/✓?labelColor=345&color=345)

# @t8/react-router

*Straightforward and minimalist router for React apps*

- Consistent route matching in components and prop values
- Decoupled routes: no hierarchy as a prerequisite
- Similar to native navigation APIs
- Straightforward middleware hooks, lazy routes, compatibility with CSR and SSR
- Progressive type-safe routing and typed URL parameters
- Utility hook to convert HTML links to SPA route links

Installation: `npm i @t8/react-router`

## Route matching

In `@t8/react-router`, route-based rendering is similar to conditional rendering with the ternary operator `matchesRoutePattern ? x : y`, applicable to both components and prop values. This is a contrast to the apparent inconsistency of the component-, config-, or file-based route matching which is typically only applicable to component rendering, while route-based prop values have to be handled differently.

```jsx
import {useRoute} from '@t8/react-router';

let App = () => {
    let {route, withRoute} = useRoute();

    // `withRoute(routePattern, x, y)` acts similarly to
    // `matchesRoutePattern ? x : y`
    return (
        <>
            <header className={withRoute('/', 'full', 'compact')}>
                <h1>App</h1>
            </header>
            {withRoute('/', (
                <main>
                    <h1>Intro</h1>
                </main>
            ))}
            {withRoute(/^\/sections\/(?<id>\d+)\/?$/, ({params}) => (
                <main>
                    <h1>Section {params.id}</h1>
                </main>
            ))}
        </>
    );
};
```

[Live demo](https://codesandbox.io/p/sandbox/kqn8wr?file=%252Fsrc%252FApp.tsx)

Note that both the header's `className` prop and the `<main>` component are rendered in a single way using the same route-matching function.

🔹 The ternary route-matching function `withRoute(routePattern, x, y)` returned from the `useRoute()` hook has the semantics similar to the ternary conditional operator `matchesRoutePattern ? x : y`, commonly seen with the conditional rendering pattern, which reflects the fact that route-based rendering also falls under this category.

🔹 `withRoute()` doesn't impose any route hierarchy by default, as it can be used with any route pattern anywhere in the app's components, offering sufficient flexibility to handle an arbitrary route-based logic.

🔹 `withRoute()` accepts route patterns of various types: `string | RegExp | (string | RegExp)[]`. The parameters of a regular expression route pattern (or of the first `RegExp` match in the array) are passed to the second and the third parameter of `withRoute()` if they are functions, as shown in the example above.

## Route navigation

The route navigation API of `@t8/react-router` is largely aligned with the similar native APIs familiar to most web developers, such as `<a href="/x">` and `window.location`, which helps reduce cognitive load and shorten the migration path from the native APIs:

```diff
+ import {A, useRoute} from '@t8/react-router';

  let UserNav = ({signedIn}) => {
+     let {route} = useRoute();

      let handleClick = () => {
-         window.location.assign(signedIn ? '/profile' : '/login');
+         route.assign(signedIn ? '/profile' : '/login');
      };

      return (
          <nav>
-             <a href="/">Home</a>
+             <A href="/">Home</A>
              <button onClick={handleClick}>Profile</button>
          </nav>
      );
  };
```

### Route link component

#### `<A>`

The route link component `<A>` enabling SPA navigation has the same props as the HTML link tag `<a>`. Apart from reducing some cognitive load, sticking to the similar API allows to quickly migrate from plain HTML links to route links (or the other way around).

```jsx
import {A} from '@t8/react-router';

let Nav = () => (
    <nav>
        <A href="/intro">Intro</A>
    </nav>
);
```

#### `<Area>`

`<Area>`, the image map route link component, has the same props and semantics as the HTML image map tag `<area>`, with the SPA navigation enabled.

#### Navigation mode

By default, after the link navigation occurs, the user can navigate back by pressing the browser's *back* button. Optionally, by setting `data-navigation-mode="replace"`, a route link component can be configured to replace the navigation history entry, which will prevent the user from returning to the previous location by clicking the browser's *back* button.

### Imperative route navigation

To jump to another route programmatically, there's the `route` object returned from the `useRoute()` hook:

```jsx
import {useRoute} from '@t8/react-router';

let ProfileButton = ({signedIn}) => {
    let {route} = useRoute();

    let handleClick = () => {
        route.assign(signedIn ? '/profile' : '/login');
    };

    return <button onClick={handleClick}>Profile</button>;
};
```

This particular example is somewhat contrived since it could have been composed in a declarative fashion using the route link component `<A>`. Still, it demonstrates how the `route` object can be used in use cases where the imperative navigation is the only reasonable way to go.

The interface of the `route` object consists of the following parts:

- SPA navigation via the History API:
    - `.assign()`, `.replace()`, `.reload()`, and readonly properties: `.href`, `.pathname`, `.search`, `.hash`, semantically similar to `window.location`;
    - `.back()`, `.forward()`, `.go(delta)`, corresponding to the [`history` methods](https://developer.mozilla.org/en-US/docs/Web/API/History#instance_methods);
- route matching:
    - `.matches(value)`, checking whether the current location matches the given `value`;
    - `.match(value)`, accepting various types of location patterns (`string | RegExp | (string | RegExp)[]`) and returning an object containing the matched parameters or `null` if the current location doesn't match the `value`.

## Routing middleware

The `useNavigationStart()` and `useNavigationComplete()` hooks define routing *middleware*, that is intermediate actions to be done before and after the route navigation occurs:

```jsx
import {useNavigationComplete, useNavigationStart} from '@t8/react-router';

function setTitle(href) {
    if (href === '/intro')
        document.title = 'Intro';
}

let App = () => {
    let {route} = useRoute();
    let [hasUnsavedChanges, setUnsavedChanges] = useState(false);

    let handleNavigationStart = useCallback(nextHref => {
        if (hasUnsavedChanges)
            return false; // prevents navigation

        if (nextHref === '/intro') {
            route.assign('/'); // redirection
            return false;
        }
    }, [hasUnsavedChanges, route]);

    useNavigationStart(handleNavigationStart);
    useNavigationComplete(setTitle);

    return (
        // app content
    );
};
```

This example shows some common examples of what can be handled with routing middleware: preventing navigation with unsaved user input, redirecting to another location, setting the page title based on the current location.

🔹 The callback of both hooks is first called when the component gets mounted if the route is already in the navigation-complete state.

## Converting HTML links to SPA route links

A chunk of static HTML content is an example where the route link component can't be directly used but it still might be desirable to make plain HTML links in that content behave as SPA route links. The `useRouteLinks()` hook can be helpful here:

```jsx
import {useRef} from 'react';
import {useRouteLinks} from '@t8/react-router';

let Content = ({value}) => {
    let containerRef = useRef(null);

    useRouteLinks(containerRef);

    return (
        <div ref={containerRef}>
            {value}
        </div>
    );
};
```

In this example, the `useRouteLinks()` hook makes all HTML links inside the container referenced by `containerRef` act as SPA route links.

To be more specific as to which elements in the container should be converted to route links, a selector, or an HTML element, or a collection thereof, can be passed as the second parameter of `useRouteLinks()`:

```js
useRouteLinks(containerRef, '.content a');
```

## `<Router>`

Server-side rendering and unit tests are the examples of the environments lacking a global location (such as `window.location`). They are the prime use cases for the location provider, `<Router>`.

Let's consider an *express* application route as an example:

```jsx
import {renderToString} from 'react-dom/server';
import {Router} from '@t8/react-router';

app.get('/', (req, res) => {
    let html = renderToString(
        <Router location={req.originalUrl}>
            <App/>
        </Router>,
    );

    res.send(html);
});
```

The value passed to the router's `location` prop can be accessed via the `useRoute()` hook:

```jsx
let {route, withRoute} = useRoute();

console.log(route.href); // returns the router's `location`
```

Both `route` and `withRoute()` returned from `useRoute()` operate based on the router's `location`.

`<Router>` can be used with client-side rendering as well. In most cases, it is unnecessary since by default the route context takes the global location from `window.location` if it's available.

## Unknown routes

The fallback parameter of the route-matching function `withRoute(routePattern, x, y)` can be used as a way to handle unknown routes:

```jsx
import {A, useRoute} from '@t8/react-router';

const routeMap = {
    intro: '/intro',
    sections: /^\/sections\/(?<id>\d+)\/?$/,
};

const knownRoutes = Object.values(routeMap);

let App = () => {
    let {withRoute} = useRoute();

    return (
        <>
            <nav>
                <A href={routeMap.intro}>Intro</A>
            </nav>
            {withRoute(routeMap.intro, (
                <main>
                    <h1>Intro</h1>
                </main>
            ))}
            {withRoute(routeMap.sections, ({params}) => (
                <main>
                    <h1>Section {params.id}</h1>
                </main>
            ))}
            {withRoute(knownRoutes, null, (
                <main className="error">
                    <h1>404 Not found</h1>
                </main>
            ))}
        </>
    );
};
```

The last `withRoute()` in this example results in `null` (that is no content) for all known routes and renders the error content for the rest unknown routes.

🔹 `withRoute()` calls don't have to maintain a specific order, and the unknown route handling `withRoute()` doesn't have to be the last.

🔹 `withRoute()` calls don't have to be grouped side by side like in the example above, their collocation is not a requirement. `withRoute()` calls are not coupled together, they can be split across separate components and files (like any other conditionally rendered components).

## Lazy routes

Lazy routes are routes whose content is loaded on demand, when the route is visited.

Enabling lazy routes doesn't require a specific routing setup. It's a combination of the [route matching](#route-matching) and lazily loaded React components (with `React.lazy()` and React's `<Suspense>`), processed by a code-splitting-capable build tool (like Esbuild, Webpack, Rollup, Vite):

```diff
+ import {Suspense} from 'react';
  import {A, useRoute} from '@t8/react-router';
  import {Intro} from './Intro';
- import {Projects} from './Projects';
+ import {Projects} from './Projects.lazy';

  export const App = () => {
      let {withRoute} = useRoute();

      return (
          <>
              <nav>
                  <A href="/">Intro</A>
                  <A href="/projects">Projects</A>
              </nav>
              {withRoute('/', (
                  <Intro/>
              ))}
              {withRoute('/projects', (
-                 <Projects/>
+                 <Suspense fallback={<p>Loading...</p>}>
+                     <Projects/>
+                 </Suspense>
              ))}
          </>
      );
  };
```

```diff
+ // Projects.lazy.js
+ import {lazy} from 'react';
+
+ export const Projects = lazy(() => import('./Projects'));
```

[Live demo](https://codesandbox.io/p/sandbox/x75p5w?file=%2Fsrc%2FApp.jsx)

In this example, the `<Projects>` component isn't loaded until the corresponding `/projects` route is visited. When it's first visited, while the component is being fetched, `<p>Loading...</p>` shows up, as specified with the `fallback` prop of `<Suspense>`.

## URL parameters

There are two partially overlapping hooks to deal with URL parameters, such as path parameters and query parameters.

🔹 Both hooks accept typed URL patterns covered in the [Type-safe routing](#type-safe-routing) section to deal with typed URL parameters.

🔹 `useRouteMatch(location)` can be used to read URL parameters from a fixed route, a `RegExp` pattern, or an array thereof.

```js
import {useRouteMatch} from '@t8/react-router';

let Section = () => {
    let {params, query} = useRouteMatch(/^\/sections\/(?<id>\d+)\/?$/);

    return (
        <section className={params.id === '1' ? 'cover' : 'regular'}>
            {/* content */}
        </section>
    );
};
```

🔹 `useRouteState(location)` can be used to read and update URL parameters of a fixed route. Similarly to React's `useState()`, the hook returns `[state, setState]` to manipulate the URL's `{params, query}` (which can be regarded as a form of app state).

🔹 To make sure the current location actually matches the given pattern, the boolean `state.ok` flag from `let state = useRouteMatch(location);` or `let [state, setState] = useRouteState(location);` can be used.

🔹 With the `location` parameter omitted, both hooks assume that the current location is implied.

## Type-safe routing

As an optional enhancement, `@t8/react-router` supports progressive schema-based route type safety.

Type-safe routing is enabled by supporting route patterns created with a type-safe URL builder like `url-shape` coupled with a schema created with `zod` or `yup`. This approach allows for gradual or partial adoption of type-safe routing in an application.

```tsx
import {A, useRoute} from '@t8/react-router';
import {createURLSchema} from 'url-shape';
import {z} from 'zod';

const {url} = createURLSchema({
    '/': null, // goes without parameters
    '/sections/:id': {
        params: z.object({
            id: z.coerce.number(),
        }),
    },
    '/search': {
        query: z.object({
            term: z.string(),
            lang: z.optional(z.enum(['current', 'all'])),
        }),
    },
});

let App = () => {
    let {withRoute} = useRoute();

    // `withRoute(routePattern, x, y)` acts similarly to
    // `matchesRoutePattern ? x : y`
    return (
        <>
            <header className={withRoute(url('/'), 'full', 'compact')}>
                <h1>App</h1>
                <nav>
                    <A href={url('/')}>
                        Intro
                    </A>
                    {' | '}
                    <A href={url('/sections/:id', {params: {id: 1}})}>
                        Start
                    </A>
                </nav>
            </header>
            {withRoute(url('/'), (
                <main>
                    <h1>Intro</h1>
                </main>
            ))}
            {withRoute(url('/sections/:id'), ({params}) => (
                <main>
                    <h1>Section {params.id}</h1>
                </main>
            ))}
        </>
    );
};
```

[Live demo](https://codesandbox.io/p/sandbox/vgt64k?file=%2Fsrc%2FApp.tsx)

🔹 The `url()` function is a type-safe URL builder. It creates a URL with a URL pattern defined in the schema and typed parameters that are prevalidated against the given schema: typos and type mismatches are highlighted in a type-aware code editor.

🔹 For more details on the output of the `createURLSchema()`, such as `url()`, `match()`, `validate()`, and the `null`-schema mode, see the [description of `url-shape`](https://github.com/axtk/url-shape#readme).

🔹 A URL schema doesn't have to cover the entire app. Standalone portions of an app can have their own URL schemas.

🔹 Stricter type safety can be achieved by disallowing URLs and URL patterns other than provided by the URL builder (the `url()` function in the example above) throughout the app:

```ts
declare module '@t8/react-router' {
    interface Config {
        strict: true;
    }
}
```

Adding this type declaration to an app effectively disallows using `string` and `RegExp` values for routes and route patterns (such as in the route link `href` prop, `route.assign(location)`, and the ternary route-matching function `withRoute(routePattern, x, y)`), only allowing values returned from the URL builder with the same routing APIs.

🔹 A URL builder pattern (like `url('/sections/:id')`) can also be used with `useRouteMatch(pattern)` and `useRouteState(pattern)` to manipulate [URL parameters](#url-parameters) in a type-safe manner.

[Typed URL parameters state demo](https://codesandbox.io/p/sandbox/qnd87w?file=%2Fsrc%2FShapeSection.tsx)
