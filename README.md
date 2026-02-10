# T8 React Router

Concise router for React apps

**Features:** Concise routing API similar to regular conditional rendering&nbsp;&middot; Incrementally adoptable route type safety with fallback typing&nbsp;&middot; useState-like URL params management&nbsp;&middot; Straightforward CSR/SSR&nbsp;&middot; Middleware&nbsp;&middot; Lazy routes&nbsp;&middot; View transitions

<!-- docsgen-show-start --
```diff
// Core parts

// URL-based rendering
at("/", <Intro/>)
<header className={at("/", "full", "compact")}>

// SPA navigation
- window.location.href = "/x";
+ route.href = "/x";

// SPA route link
- <a href="/">Intro</a>
+ <A href="/">Intro</A>
```
-- docsgen-show-end -->

## Routing

URL-based rendering with `at(route, x, y)` works similarly to conditional rendering with the ternary operator `atRoute ? x : y`, equally applicable to props, components and dynamic values:

```jsx
import { useRoute } from "@t8/react-router";

let App = () => {
  let { at } = useRoute();

  return (
    <header className={at("/", "full", "compact")}>
      <h1>App</h1>
    </header>
    {at("/", <Intro/>)}
    {at(/^\/posts\/(?<id>\d+)\/?$/, ({ params }) => <Post id={params.id}/>)}
  );
};
```

[Live demo](https://codesandbox.io/p/sandbox/63xzd4?file=%252Fsrc%252FApp.tsx&h=320)

⬥ `params` in dynamic values contains the route pattern's capturing groups accessible by numeric indices. Named capturing group values can be accessed by their names, like `params.id` in the example above.

## Navigation

The SPA navigation API is largely aligned with the similar built-in APIs:

```diff
+ import { A, useRoute } from "@t8/react-router";

  let UserNav = ({ signedIn }) => {
+   let { route } = useRoute();

    let handleClick = () => {
-     window.location.href = signedIn ? "/profile" : "/login";
+     route.href = signedIn ? "/profile" : "/login";
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

⬥ `<A>` and `<Area>` are the two kinds of SPA route link components available out of the box. They have the same props and semantics as the corresponding HTML link elements `<a>` and `<area>`.

⬥ The `route` object returned from `useRoute()` has: `.assign(url)`, `.replace(url)`, `.reload()`, `.href`, `.pathname`, `.search`, `.hash`, `.back()`, `.forward()`, `.go(delta)`, resembling the built-in APIs of `window.location` and `history` carried over to SPA navigation.

⬥ `route.navigate(options)` combines and extends `route.assign(url)` and `route.replace(url)` serving as a handy drop-in replacement for the similar `window.location` methods:

```js
route.navigate({ href: "/intro", history: "replace", scroll: "off" });
```

The `options` parameter is an object combining values corresponding to the link navigation props described in the [Link props](#link-props) section below, with the `data-` prefix stripped from the prop names.

## Link props

In addition to the props inherited from regular HTML links:

⬥ `data-history="replace"` prevents the user from returning to the current URL by pressing the browser's *Back* button after clicking a link with this prop.

⬥ `data-spa="off"` turns off SPA navigation and triggers a full-page reload.

⬥ `data-scroll="off"` turns off the default scrolling to the element matching the URL fragment or to the top of the page when the link is clicked.

## Middleware

Routing middleware are optional actions to be done before and after a SPA navigation occurs.

The code below shows some common examples of what can be handled with routing middleware: redirecting to another route, preventing navigation with unsaved user input, setting the page title based on the current URL.

```jsx
import { useNavigationComplete, useNavigationStart } from "@t8/react-router";

function setTitle({ href }) {
  document.title = href === "/intro" ? "Intro" : "App";
}

let App = () => {
  let { route } = useRoute();
  let [hasUnsavedChanges, setUnsavedChanges] = useState(false);

  let handleNavigationStart = useCallback(({ href }) => {
    if (hasUnsavedChanges) return false; // prevents navigation

    if (href === "/intro") {
      route.assign("/"); // redirects
      return false;
    }
  }, [hasUnsavedChanges, route]);

  useNavigationStart(handleNavigationStart);
  useNavigationComplete(setTitle);

  // ...
};
```

⬥ The object passed to the middleware callback contains `href` and `referrer`, the navigation destination and initial URLs. The rest of the properties are aligned with the [link data-* props](#link-props), with the `data-` prefix stripped from the props' names.

⬥ The callback of both hooks is first called when the component gets mounted if the route is already in the navigation-complete state.

⬥ The optional `callback` parameter of `useRoute(callback?)` can be used as middleware defining actions to be taken right before or after components get notified to re-render in response to a URL change. This callback receives the `render` function as a parameter that should be called at some point. Use cases for this callback include, for example, activating [animated view transitions](#animated-view-transitions) or (less likely in regular circumstances) skipping re-renders for certain URL changes.

## URL parameters

URL parameters, as a portion of the app's state, can be managed in the React's `useState()`-like manner, allowing for quick migration from local state to URL parameters or the other way around:

```diff
+ import { useRouteState } from "@t8/react-router";

  let App = () => {
-   let [{ coords }, setState] = useState({ coords: { x: 0, y: 0 } });
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

[Route state live demo](https://codesandbox.io/p/sandbox/sgvdfg?file=%252Fsrc%252FApp.tsx&h=360)<br>
[Type-safe route state live demo](https://codesandbox.io/p/sandbox/qnd87w?file=%2Fsrc%2FShapeSection.tsx&h=450)

## Type safety

Type-safe routing is as an optional enhancement, allowing for gradual or partial adoption. It's enabled by supporting route patterns created with a type-safe URL builder like *url-shape* together with a schema created with a validation library implementing the [Standard Schema](https://github.com/standard-schema/standard-schema#readme) spec, like *zod*, *valibot*, *arktype*, or *yup*.

```tsx
import { A, useRoute } from "@t8/react-router";
import { createURLSchema } from "url-shape";
import { z } from "zod";

const { url } = createURLSchema({
  "/": z.object({}), // Goes without parameters
  "/posts/:id": z.object({
    // Path components
    params: z.object({
      id: z.coerce.number(),
    }),
    // Similarly a `query` schema can be added here
  }),
});

let App = () => {
  let { at } = useRoute();

  return (
    <>
      <header className={at(url("/"), "full", "compact")}>
        <h1>App</h1>
        <nav>
          <A href={url("/")}>Intro</A>{" | "}
          <A href={url("/posts/:id", { params: { id: 1 } })}>Start</A>
                                    // ^ { params: { id: number } }
        </nav>
      </header>
      {at(url("/"), <Intro/>)}
      {at(url("/posts/:id"), ({ params }) => <Post id={params.id}/>)}
                             // ^ { params: { id: number } }
    </>
  );
};
```

[Type-safe routing live demo](https://codesandbox.io/p/sandbox/vgt64k?file=%2Fsrc%2FApp.tsx&h=320)

⬥ The `url()` function is a type-safe URL builder. It creates a URL with a URL pattern defined in the schema and typed parameters that are prevalidated against the given schema: typos and type mismatches are highlighted in a type-aware code editor. [See *url-shape*](https://github.com/t8js/url-shape#readme) for more details.

⬥ A URL schema doesn't have to cover the entire app. Standalone portions of an app can have their own URL schemas.

⬥ Optionally, application-wide type safety can be achieved by disallowing URLs and URL patterns other than provided by the URL builder (the `url()` function in the example above):

```ts
declare module "@t8/react-router" {
  interface Config {
    strict: true;
  }
}
```

Adding this type declaration to an app effectively disallows using `string` and `RegExp` values for routes and route patterns (such as in the route link `href` prop, `route.assign(location)`, and the routing function `at(routePattern, x, y)`), only allowing values returned from the URL builder with the same routing APIs.

⬥ A URL builder pattern (like `url("/posts/:id")`) can also be used with `useRouteState(pattern)` and `useRouteMatch(pattern)` to manipulate [URL parameters](#url-parameters) in a type-safe manner.

[Typed URL parameters state demo](https://codesandbox.io/p/sandbox/qnd87w?file=%2Fsrc%2FShapeSection.tsx&h=450)

⬥ Recap: It's using typed URL patterns (like from `url()` of *url-shape*) that enables type-safe route handling, which is an optional enhancement. Plain `string` routes and `RegExp` route patterns are handled with baseline typing sufficient in many cases.

## Nested routes

Nested routes don't require special handling. All routes are handled equally and independently from each other.

```jsx
let App = () => {
  let { at } = useRoute();

  return (
    <>
      {at("/about", <About/>)}
      {at("/about/contacts", <Contacts/>)}
      // ...
    </>
  );
};
```

In a [type-safe setup](#type-safety), a URL schema of a nested route can inherit certain parameters from the parent route. Such relations (which might as well be other than direct nestedness) can be settled within the URL schema with the schema toolset.

```js
import { createURLSchema } from "url-shape";
import { z } from "zod";

let sectionParams = z.object({
  sectionId: z.coerce.number(),
});

export const { url } = createURLSchema({
  "/posts/:sectionId": z.object({
    params: sectionParams,
  }),
  "/posts/:sectionId/stories/:storyId": z.object({
    params: z.object({
      ...sectionParams.shape, // Shared params
      storyId: z.string(),
    }),
  }),
});
```

[Live typed nested routes demo](https://codesandbox.io/p/sandbox/htfslv?file=%252Fsrc%252FApp.tsx&h=360)

Such a setup doesn't impose specific implicit relations between the routes (like parameter inheritance) ahead of time. The relations between the routes, as arbitrary as they can be, are seen and managed directly, allowing for fine-grained control, including sharing or filtering out certain parameters, without the need to work around implicit constraints.

## URL provider

In the browser, the routing hooks like `useRoute()` assume that the current URL is the browser's one (as exposed with `window.location`), by default. A custom initial URL value can be set with the `<Router>` component, which is useful for environments lacking a global URL value, like with server-side rendering or unit tests.

```jsx
<Router href="/intro">
  <App/>
</Router>
```

Now that we've set up a URL context, both `route` and `at()` returned from `useRoute()` inside the `<App>` component operate based on the router's `href`:

```jsx
let { route, at } = useRoute();

console.log(route.href); // returns based on the router's `href`
```

⬥ The `<Router>`'s `href` prop value can be either a string URL or an instance of the `Route` class. The latter option can be used to redefine the default routing behavior (see the [Custom routing behavior](#custom-routing-behavior) section). If the `href` prop value is omitted or `undefined`, `<Router>` falls back to the current URL in the browser.

⬥ With SSR in an *express* application, the URL context setup can be similar to the following:

```jsx
import { renderToString } from "react-dom/server";
import { Router } from "@t8/react-router";

app.get("/", (req, res) => {
  let html = renderToString(
    <Router href={req.originalUrl}>
      <App/>
    </Router>,
  );

  res.send(html);
});
```

## Custom routing behavior

The default URL-based routing behavior is what's used in most cases, but it's also conceivable to have routing based on the URL in a different way or not based on the browser's URL altogether. The `<Router>` component discussed above (or even multiple ones) can be used to set up customized routing behavior over a specific portion of the app (or the entire app).

[Custom routing behavior example](https://codesandbox.io/p/sandbox/w7rsjl?file=%252Fsrc%252FApp.tsx&h=500)

In this example, we've got a kind of a browser-in-browser component with its routing based on a text input rather than the URL. It's enabled by devising a custom extension of the `Route` class, `InputRoute`, configured to interact with a text input, and passing its instance to the `href` prop of the `<Router>` component.

This example also shows how the same routing code (of the `<Content>` component) can interact with either the URL or the text input element based on the closest `<Router>` context up the component tree.

## Unknown routes

The fallback parameter of the route-matching function `at(route, x, y)` can be used as a way to handle unknown routes, as shown in the example below. In a [type-safe setup](#type-safety), unknown routes can be handled based on whether the given route belongs to the URL schema (e.g. with `validate(route)` from [*url-shape*](https://github.com/t8js/url-shape#readme)).

```jsx
import { A, useRoute } from "@t8/react-router";

const routeMap = {
  intro: "/intro",
  posts: /^\/posts\/(?<id>\d+)\/?$/,
};

const knownRoutes = Object.values(routeMap);

let App = () => {
  let { at } = useRoute();

  return (
    <>
      <nav>
        <A href={routeMap.intro}>Intro</A>
      </nav>
      {at(routeMap.intro, <Intro/>)}
      {at(routeMap.posts, ({ params }) => <Post id={params.id}/>)}
      {at(knownRoutes, null, <Error/>)}
    </>
  );
};
```

The last `at()` in this example results in `null` (that is no content) for all known routes and renders the error content for the rest unknown routes.

⬥ `at()` calls don't have to maintain a specific order, and the `at()` call handling unknown routes doesn't have to be the last.

⬥ `at()` calls don't have to be grouped side by side like in the example above, their collocation is not a requirement. `at()` calls are not coupled together, they can be split across separate components and files (like any other conditionally rendered components).

## Lazy routes

Lazy routes are routes whose content is loaded on demand, when the route is visited.

Enabling lazy routes doesn't require a specific routing setup. It's a combination of the [route matching](#routing) and lazily loaded React components (with `React.lazy()` and React's `<Suspense>`), processed by a code-splitting-capable build tool (like Esbuild, Webpack, Rollup, Vite):

```diff
  import { useRoute } from "@t8/react-router";
+ import { Suspense } from "react";
- import { Projects } from "./Projects";
+ import { Projects } from "./Projects.lazy";

  let App = () => {
    let { at } = useRoute();

    return (
      <>
        // ...
        {at("/projects", (
-         <Projects/>
+         <Suspense fallback={<p>Loading...</p>}>
+           <Projects/>
+         </Suspense>
        ))}
      </>
    );
  };
```

```diff
+ // Projects.lazy.ts
+ import { lazy } from "react";
+
+ export const Projects = lazy(() => import("./Projects"));
```

[Lazy routes live demo](https://codesandbox.io/p/sandbox/x75p5w?file=%2Fsrc%2FApp.jsx&h=360)

In this example, the `<Projects>` component isn't loaded until the corresponding `/projects` route is visited. When it's first visited, while the component is being fetched, `<p>Loading...</p>` shows up, as specified with the `fallback` prop of `<Suspense>`.

## Animated view transitions

Animated transitions between different routes can be achieved by using the browser's [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) and the optional `callback` parameter of `useRoute()` can be used to set up such a transition.

```diff
+ import { flushSync } from "react-dom";
  import { A, useRoute } from "@t8/react-router";

+ function renderViewTransition(render) {
+   if (document.startViewTransition) {
+     document.startViewTransition(() => {
+       flushSync(render);
+     });
+   }
+   else render();
+ }

  export const App = () => {
-   let { at } = useRoute();
+   let { at } = useRoute(renderViewTransition);

    return (
      // Content
    );
  };
```

[Live demo](https://codesandbox.io/p/sandbox/znvrmt?file=%252Fsrc%252FApp.tsx&h=380)

In the example above, the `renderViewTransition()` function passed to `useRoute()` calls `document.startViewTransition()` from the View Transition API to start a view transition and React's `flushSync()` to apply the DOM changes synchronously within the view transition, with the visual effects defined with CSS. We also check whether `document.startViewTransition` is supported by the browser and resort to regular rendering if it's not.

To trigger a transition only with specific links, the `options` parameter of the `useRoute()` callback can be used to add a condition for the view transitions. In the example below, we'll only trigger a view transition with the links whose `data-id` attribute, available via `options.id`, is among the listed on `viewTransitionLinkIds`.

```diff
+ let viewTransitionLinkIds = new Set([/* ... */]);

  function renderViewTransition(render, options) {
-   if (document.startViewTransition) {
+   if (document.startViewTransition && viewTransitionLinkIds.has(options.id)) {
      document.startViewTransition(() => {
        flushSync(render);
      });
    }
    else render();
  }
```

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
