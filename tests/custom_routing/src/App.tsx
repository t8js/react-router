import { A, useRoute } from "../../../index.ts";
import { Browser } from "./Browser.tsx";

const Content = () => {
  let { at } = useRoute();

  return (
    <>
      <nav>
        <p>
          <A href="/">Intro</A>
          {" | "}
          <A href="/about">About</A>
          {" | "}
          <A href="/sections/1">Section 1</A>
          {" | "}
          <A href="/sections/2">Section 2</A>
        </p>
      </nav>
      <section>
        {at("/", <h1>Intro</h1>)}
        {at("/about", <h1>About</h1>)}
        {at(/^\/sections\/(?<id>\d+)$/, ({ params }) => (
          <h1>Section {params.id}</h1>
        ))}
      </section>
    </>
  );
};

export const App = () => {
  let { at } = useRoute();

  return (
    <>
      <Content />
      {at(
        "/",
        <>
          <Browser autoFocus>
            <Content />
          </Browser>
          <Browser initialLocation="/sections/1">
            <Content />
          </Browser>
        </>,
      )}
    </>
  );
};
