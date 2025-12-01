# T8 React Router

*Concise router for React apps*

[![npm](https://img.shields.io/npm/v/@t8/react-router?labelColor=345&color=46e)](https://www.npmjs.com/package/@t8/react-router) ![Lightweight](https://img.shields.io/bundlephobia/minzip/@t8/react-router?label=minzip&labelColor=345&color=46e) ![CSR ✓](https://img.shields.io/badge/CSR-✓-345?labelColor=345) ![SSR ✓](https://img.shields.io/badge/SSR-✓-345?labelColor=345)

🔹 Concise routing API

```jsx
<header className={at("/", "full", "compact")}>
// at "/" ? "full" : "compact"
```

```jsx
{at("/about", <About/>)}
// at "/about" ? <About/> : undefined
```

```jsx
{at(/^\/sections\/(?<id>\d+)\/?$/, ({ params }) => (
  <Section id={params.id}/>
))}
// at "/sections/<id>" ? <Section id={id}/> : undefined
```

🔹 Familiar navigation APIs

```diff
- <a href="/about">About</a>
+ <A href="/about">About</A> // SPA route link
```

```diff
- window.location.assign("/about");
+ route.assign("/about"); // SPA navigation

- window.location.href = "/about";
+ route.href = "/about"; // SPA navigation
```

🔹 Middleware hooks

```jsx
useNavigationStart(callback);
// e.g. to redirect or prevent navigation
```

```jsx
useNavigationComplete(callback);
// e.g. to set the document's title
```

🔹 Typed routes and URL parameters, as an optional enhancement

```jsx
   // ↓ type-safe URL pattern builder
let { url } = createURLSchema({
  "/sections/:id": z.object({ // with Zod
    params: z.object({ id: z.coerce.number() })
  })
});
```

```jsx
                          // ↓ { id: number }
{at(url("/sections/:id"), ({ params }) => (
  <Section id={params.id}/>
))}
```

```jsx
<A href={url("/sections/:id", { params: { id: 1 } })}>Section 1</A>
                             // ↑ { id: number }
```

🔹 URL parameters as state

```jsx
let [state, setState] = useRouteState("/");
```

```jsx
// with type safety based on a custom URL schema
let [state, setState] = useRouteState(url("/"));
```

🔹 Lazy routes

```jsx
{at("/about", <Suspense><About/></Suspense>)}
```

🔹 SSR- and CSR-compatible

Installation: `npm i @t8/react-router`

## Routing

The following example runs through the essential parts of routing code. The `at(route, x, y)` function returns a value based on whether the `route` parameter matches the current URL. It acts similarly to the conditional operator `atRoute ? x : y` and is equally applicable to components and prop values. The route link component that is used for SPA navigation acts and looks similar to the HTML link tag.

```jsx
import { A, useRoute } from "@t8/react-router";
import { Intro } from "./Intro";
import { Section } from "./Section";

let App = () => {
  let { at } = useRoute();

  return (
    <>
      <header className={at("/", "full", "compact")}>
        <h1>App</h1>
        <nav>
          <A href="/">Intro</A>{" | "}
          <A href="/sections/1">Section 1</A>
        </nav>
      </header>
      {at("/", <Intro/>)}
      {at(/^\/sections\/(?<id>\d+)\/?$/, ({ params }) => (
        <Section id={params.id}/>
      ))}
    </>
  );
};
```

[Live demo](https://codesandbox.io/p/sandbox/63xzd4?file=%252Fsrc%252FApp.tsx)

🔹 As mentioned above, `at(route, x, y)` acts similarly to the ternary operator `atRoute ? x : y` often used with conditional rendering, which route-based rendering essentially is: it returns `x` if the current URL matches `route`, and `y` otherwise. Having the ternary function rather than the ternary conditional operator allows for additional flexibility, like omitting an `undefined` fallback parameter (as with `at("/", <Intro/>)` in the example above) or resolving as a dynamic value based on `params` extracted from the route pattern (as with `<Section id={params.id}/>` above).

While `at(route, x, y)` works equally with both components and prop values (and actually with any other route-based values), the component-, config-, and file-based approaches that many routers tend to adopt are focused on component rendering, requiring an extra route matching hook for route-based prop values.

🔹 `at()` calls are independent from each other, they don't have to maintain a certain order, they shouldn't be necessarily grouped in a single component (although they can be, as in the example above). Components with route-based logic can be split like any other components.

🔹 Route-based rendering with the React's `<Activity>` component looks similar to what we've seen in the example above:

```jsx
// Without Activity
{at("/about", <About/>)}

// With Activity
<Activity mode={at("/about", "visible", "hidden")}>
  <About/>
</Activity>
```

## Navigation

The route navigation API is largely aligned with the similar native JS APIs familiar to most web developers, such as `<a href="/x">` and `window.location`:

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

🔹 A route link component can be switched to the replace mode by having the `data-navigation-mode="replace"` attribute. In the replace mode, clicking the link will replace the current history navigation entry rather than keep it as a previous record (similarly to calling `route.replace(url)`), effectively preventing the user from returning to the current URL by pressing the browser's *Back* button.

🔹 Like the route link `<A>` corresponds to the HTML link tag `<a>`, the route link `<Area>` corresponds to the HTML link tag `<area>`.

## Middleware

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

## URL parameters

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

## Type safety

Type-safe routing is as an optional enhancement. It's enabled by supporting route patterns created with a type-safe URL builder like *url-shape* together with a schema created with a validation library implementing the [Standard Schema](https://github.com/standard-schema/standard-schema#readme) spec, like *zod*, *valibot*, *arktype*, or *yup*. This approach allows for gradual or partial adoption of type-safe routing in an application.

```tsx
import { A, useRoute } from "@t8/react-router";
import { createURLSchema } from "url-shape";
import { z } from "zod";

const { url } = createURLSchema({
  "/": z.object({}), // Goes without parameters
  "/sections/:id": z.object({
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
          <A href={url("/sections/:id", { params: { id: 1 } })}>Start</A>
        </nav>
      </header>
      {at(url("/"), <Intro/>)}
      {at(url("/sections/:id"), ({ params }) => (
        <Section id={params.id}/>
      ))}
    </>
  );
};
```

[Type-safe routing live demo](https://codesandbox.io/p/sandbox/vgt64k?file=%2Fsrc%2FApp.tsx)

🔹 The `url()` function is a type-safe URL builder. It creates a URL with a URL pattern defined in the schema and typed parameters that are prevalidated against the given schema: typos and type mismatches are highlighted in a type-aware code editor. [See *url-shape*](https://github.com/t8js/url-shape#readme) for more details.

🔹 A URL schema doesn't have to cover the entire app. Standalone portions of an app can have their own URL schemas.

🔹 Optionally, application-wide type safety can be achieved by disallowing URLs and URL patterns other than provided by the URL builder (the `url()` function in the example above):

```ts
declare module "@t8/react-router" {
  interface Config {
    strict: true;
  }
}
```

Adding this type declaration to an app effectively disallows using `string` and `RegExp` values for routes and route patterns (such as in the route link `href` prop, `route.assign(location)`, and the routing function `at(routePattern, x, y)`), only allowing values returned from the URL builder with the same routing APIs.

🔹 A URL builder pattern (like `url("/sections/:id")`) can also be used with `useRouteState(pattern)` and `useRouteMatch(pattern)` to manipulate [URL parameters](#url-parameters) in a type-safe manner.

[Typed URL parameters state demo](https://codesandbox.io/p/sandbox/qnd87w?file=%2Fsrc%2FShapeSection.tsx)

🔹 Recap: It's using typed URL patterns (like from `url()` of *url-shape*) that enables type-safe route handling, which is an optional enhancement. Plain `string` routes and `RegExp` route patterns are handled with baseline typing sufficient in many cases.

## Nested routes

Nested routes don't require special rendering rules. All routes are handled equally and independently from each other.

```js
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
  "/sections/:sectionId": z.object({
    params: sectionParams,
  }),
  "/sections/:sectionId/stories/:storyId": z.object({
    params: z.object({
      ...sectionParams.shape, // Shared params
      storyId: z.string(),
    }),
  }),
});
```

[Live typed nested routes demo](https://codesandbox.io/p/sandbox/htfslv?file=%252Fsrc%252FApp.tsx)

In such a setup, arbitrary relations between the routes are seen and managed directly, allowing for fine-grained control, including sharing or filtering out certain parameters.

## Location provider

Server-side rendering and unit tests are the examples of the environments lacking a global location object (such as `window.location`). They are the prime use cases for the location provider, `<Router>`.

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
let { route, at } = useRoute();

console.log(route.href); // returns the router's `location`
```

Both `route` and `at()` returned from `useRoute()` operate based on the router's `location`.

`<Router>` can be used with client-side rendering as well. In most cases, it is unnecessary since by default the route context takes the global location from `window.location` if it's available.

## Custom routing behavior

[Custom routing behavior example](https://codesandbox.io/p/sandbox/w7rsjl?file=%252Fsrc%252FApp.tsx)

In this example, we've got a kind of a browser-in-browser with its routing based on a text input rather than the URL. It's enabled by passing an instance of a custom extension of the `Route` class, `InputRoute`, to the `<Router>` component, configured to interact with a text input.

This example also shows how the same routing code (of the `<Content>` component) can interact with either the URL or the text input element based on the closest `<Router>` component up the component tree.

## Unknown routes

The fallback parameter of the route-matching function `at(route, x, y)` can be used as a way to handle unknown routes, as shown in the example below. In a [type-safe setup](#type-safety), unknown routes can be handled based on whether the given route belongs to the URL schema (e.g. with `validate(route)` from [*url-shape*](https://github.com/t8js/url-shape#readme)).

```jsx
import { A, useRoute } from "@t8/react-router";

const routeMap = {
  intro: "/intro",
  sections: /^\/sections\/(?<id>\d+)\/?$/,
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
      {at(routeMap.sections, ({ params }) => (
        <Section id={params.id}/>
      ))}
      {at(knownRoutes, null, <Error/>)}
    </>
  );
};
```

The last `at()` in this example results in `null` (that is no content) for all known routes and renders the error content for the rest unknown routes.

🔹 `at()` calls don't have to maintain a specific order, and the `at()` call handling unknown routes doesn't have to be the last.

🔹 `at()` calls don't have to be grouped side by side like in the example above, their collocation is not a requirement. `at()` calls are not coupled together, they can be split across separate components and files (like any other conditionally rendered components).

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
