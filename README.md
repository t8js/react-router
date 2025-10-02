[![npm](https://flat.badgen.net/npm/v/@t8/react-router?labelColor=345&color=46e)](https://www.npmjs.com/package/@t8/react-router) ![Lightweight](https://flat.badgen.net/bundlephobia/minzip/@t8/react-router/?label=minzip&labelColor=345&color=46e&r=0) ![TypeScript ✓](https://flat.badgen.net/badge/TypeScript/✓?labelColor=345&color=345) ![CSR ✓](https://flat.badgen.net/badge/CSR/✓?labelColor=345&color=345) ![SSR ✓](https://flat.badgen.net/badge/SSR/✓?labelColor=345&color=345)

# @t8/react-router

*Straightforward and minimalist router for React apps*

- Consistent route matching in components and prop values
- Decoupled routes: no hierarchy as a prerequisite
- Similar to native navigation APIs
- Straightforward middleware hooks and lazy routes
- Type-safe routing and typed URL parameters
- Straightforward compatibility with SSR and CSR
- Utility hook to convert HTML links to SPA route links

Installation: `npm i @t8/react-router`

## Routing

The route-matching function `withRoute(routePattern, x, y)` acts similarly to the conditional operator `matchesRoutePattern ? x : y` and is equally applicable to components and prop values. The route link component is similar to the HTML link tag:

```jsx
import { A, useRoute } from "@t8/react-router";
import { Intro } from "./Intro";
import { Section } from "./Section";

let App = () => {
  let { withRoute } = useRoute();

  // `withRoute(routePattern, x, y)` acts similarly to
  // `matchesRoutePattern ? x : y`
  return (
    <>
      <header className={withRoute("/", "full", "compact")}>
        <h1>App</h1>
        <nav>
          <A href="/">Intro</A>{" | "}
          <A href="/sections/1">Section 1</A>
        </nav>
      </header>
      {withRoute("/", <Intro/>)}
      {withRoute(/^\/sections\/(?<id>\d+)\/?$/, ({ params }) => (
        <Section id={params.id}/>
      ))}
    </>
  );
};
```

[Live demo](https://codesandbox.io/p/sandbox/63xzd4?file=%252Fsrc%252FApp.tsx)

🔹 `withRoute()` calls are independent from each other, they don't have to maintain a certain order, they shouldn't be necessarily grouped in a single component (although they can be, as in the example above). Components with route-based logic can be split like any other components.

## Route navigation

The route navigation API is largely aligned with the similar native APIs familiar to most web developers, such as `<a href="/x">` and `window.location`:

```diff
+ import { A, useRoute } from "@t8/react-router";

  let UserNav = ({ signedIn }) => {
+   let { route } = useRoute();

    let handleClick = () => {
-     window.location.assign(signedIn ? "/profile" : "/login");
+     route.assign(signedIn ? "/profile" : "/login");
    };

    return (
      <nav>
-       <a href="/">Home</a>
+       <A href="/">Home</A>
        <button onClick={handleClick}>Profile</button>
      </nav>
    );
  };
```

🔹 The `route` object has: `.assign(url)`, `.replace(url)`, `.reload()`, `.href`, `.pathname`, `.search`, `.hash`, `.back()`, `.forward()`, `.go(delta)` — similar to the built-in APIs of `window.location` and `history` carried over to route-based SPA navigation.

🔹 A route link component can be switched to the replace mode by having the `data-navigation-mode="replace"` attribute.

🔹 Like the route link `<A>` corresponds to the HTML link tag `<a>`, the route link `<Area>` corresponds to the HTML link tag `<area>`.

## Routing middleware

The `useNavigationStart()` and `useNavigationComplete()` hooks define routing *middleware*, that is intermediate actions to be done before and after the route navigation occurs:

```jsx
import { useNavigationComplete, useNavigationStart } from "@t8/react-router";

function setTitle(href) {
  if (href === "/intro")
    document.title = "Intro";
}

let App = () => {
  let { route } = useRoute();
  let [hasUnsavedChanges, setUnsavedChanges] = useState(false);

  let handleNavigationStart = useCallback(nextHref => {
    if (hasUnsavedChanges)
      return false; // prevents navigation

    if (nextHref === "/intro") {
      route.assign("/"); // redirection
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

## URL parameters as state

URL parameters, as a portion of the app's state, can be managed in the React's `useState()`-like manner, allowing for quick migration from local state to URL parameters or the other way around:

```diff
+ import { useRouteState } from "@t8/react-router";

  let App = () => {
-   let [{ coords }, setState] = useState({ coords: {} });
+   let [{ query }, setState] = useRouteState("/");

    let setPosition = () => {
      setState(state => ({
        ...state,
-       coords: {
+       query: {
          x: Math.random(),
          y: Math.random(),
        },
      });
    };

    return (
      <>
        <h1>Shape</h1>
-       <Shape x={coords.x} y={coords.y}/>
+       <Shape x={query.x} y={query.y}/>
        <p><button onClick={setPosition}>Move</button></p>
      </>
    );
  };
```

[Route state live demo](https://codesandbox.io/p/sandbox/sgvdfg?file=%252Fsrc%252FApp.tsx)<br>
[Typed route state live demo](https://codesandbox.io/p/sandbox/qnd87w?file=%2Fsrc%2FShapeSection.tsx)

## Type-safe routing

Type-safe routing is as an optional enhancement. It's enabled by supporting route patterns created with a type-safe URL builder like `url-shape` together with a schema created with `zod` or `yup`. This approach allows for gradual or partial adoption of type-safe routing in an application.

```tsx
import { A, useRoute } from "@t8/react-router";
import { createURLSchema } from "url-shape";
import { z } from "zod";

const { url } = createURLSchema({
  "/": null, // Goes without parameters
  "/sections/:id": {
    // Path components
    params: z.object({
      id: z.coerce.number(),
    }),
    // Similarly a `query` schema can be added here
  },
});

let App = () => {
  let { withRoute } = useRoute();

  // `withRoute(routePattern, x, y)` acts similarly to
  // `matchesRoutePattern ? x : y`
  return (
    <>
      <header className={withRoute(url("/"), "full", "compact")}>
        <h1>App</h1>
        <nav>
          <A href={url("/")}>Intro</A>{" | "}
          <A href={url("/sections/:id", { params: { id: 1 } })}>Start</A>
        </nav>
      </header>
      {withRoute(url("/"), <Intro/>)}
      {withRoute(url("/sections/:id"), ({ params }) => (
        <Section id={params.id}/>
      ))}
    </>
  );
};
```

[Type-safe routing live demo](https://codesandbox.io/p/sandbox/vgt64k?file=%2Fsrc%2FApp.tsx)

🔹 The `url()` function is a type-safe URL builder. It creates a URL with a URL pattern defined in the schema and typed parameters that are prevalidated against the given schema: typos and type mismatches are highlighted in a type-aware code editor. [See *url-shape*](https://github.com/axtk/url-shape#readme) for more details.

🔹 A URL schema doesn't have to cover the entire app. Standalone portions of an app can have their own URL schemas.

🔹 Stricter type safety can be achieved by disallowing URLs and URL patterns other than provided by the URL builder (the `url()` function in the example above) throughout the app:

```ts
declare module "@t8/react-router" {
  interface Config {
    strict: true;
  }
}
```

Adding this type declaration to an app effectively disallows using `string` and `RegExp` values for routes and route patterns (such as in the route link `href` prop, `route.assign(location)`, and the routing function `withRoute(routePattern, x, y)`), only allowing values returned from the URL builder with the same routing APIs.

🔹 A URL builder pattern (like `url("/sections/:id")`) can also be used with `useRouteState(pattern)` and `useRouteMatch(pattern)` to manipulate [URL parameters](#url-parameters) in a type-safe manner.

[Typed URL parameters state demo](https://codesandbox.io/p/sandbox/qnd87w?file=%2Fsrc%2FShapeSection.tsx)

🔹 Recap: It's using a typed URL pattern (like with `url()` from `url-shape`) that enables type-safe route handling, which is an optional enhancement. Plain `string` routes and `RegExp` route patterns are handled with more generic typing as a baseline sufficient in many cases.

## `<Router>`

Server-side rendering and unit tests are the examples of the environments lacking a global location (such as `window.location`). They are the prime use cases for the location provider, `<Router>`.

Let's consider an *express* application route as an example:

```jsx
import { renderToString } from "react-dom/server";
import { Router } from "@t8/react-router";

app.get("/", (req, res) => {
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
let { route, withRoute } = useRoute();

console.log(route.href); // returns the router's `location`
```

Both `route` and `withRoute()` returned from `useRoute()` operate based on the router's `location`.

`<Router>` can be used with client-side rendering as well. In most cases, it is unnecessary since by default the route context takes the global location from `window.location` if it's available.

### Custom routing behavior

[Custom routing behavior live demo](https://codesandbox.io/p/sandbox/w7rsjl?file=%252Fsrc%252FApp.tsx)

In this example, we've got a kind of a browser-in-browser with its routing based on a text input rather than the URL. It's enabled by passing an instance of a custom extension of the `Route` class, `InputRoute`, to the `<Router>` component, configured to interact with a text input.

This example also shows how the same routing code (of the `<Content>` component) can interact with either the URL or the text input element based on the closest `<Router>` component up the component tree.

## Unknown routes

The fallback parameter of the route-matching function `withRoute(routePattern, x, y)` can be used as a way to handle unknown routes:

```jsx
import { A, useRoute } from "@t8/react-router";

const routeMap = {
  intro: "/intro",
  sections: /^\/sections\/(?<id>\d+)\/?$/,
};

const knownRoutes = Object.values(routeMap);

let App = () => {
  let { withRoute } = useRoute();

  return (
    <>
      <nav>
        <A href={routeMap.intro}>Intro</A>
      </nav>
      {withRoute(routeMap.intro, <Intro/>)}
      {withRoute(routeMap.sections, ({ params }) => (
        <Section id={params.id}/>
      ))}
      {withRoute(knownRoutes, null, <Error/>)}
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
+ import { Suspense } from "react";
- import { Projects } from "./Projects";
+ import { Projects } from "./Projects.lazy";

  let App = () => (
    <>
      // ...
      {withRoute("/projects", (
-       <Projects/>
+       <Suspense fallback={<p>Loading...</p>}>
+         <Projects/>
+       </Suspense>
      ))}
    </>
  );
```

```diff
+ // Projects.lazy.ts
+ import { lazy } from "react";
+
+ export const Projects = lazy(() => import("./Projects"));
```

[Lazy routes live demo](https://codesandbox.io/p/sandbox/x75p5w?file=%2Fsrc%2FApp.jsx)

In this example, the `<Projects>` component isn't loaded until the corresponding `/projects` route is visited. When it's first visited, while the component is being fetched, `<p>Loading...</p>` shows up, as specified with the `fallback` prop of `<Suspense>`.

## Converting HTML links to SPA route links

A chunk of static HTML content is an example where the route link component can't be directly used but it still might be desirable to make plain HTML links in that content behave as SPA route links. The `useRouteLinks()` hook can be helpful here:

```jsx
import { useRef } from "react";
import { useRouteLinks } from "@t8/react-router";

let Content = ({ value }) => {
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

A selector, or an HTML element, or a collection thereof, can be passed as the second parameter of `useRouteLinks()` to narrow down the relevant link elements:

```js
useRouteLinks(containerRef, ".content a");
```
