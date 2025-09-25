import { A, useRoute } from "../../..";
import { Browser } from "./Browser";

const Content = () => {
  let { withRoute } = useRoute();

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
        {withRoute("/", <h1>Intro</h1>)}
        {withRoute("/about", <h1>About</h1>)}
        {withRoute(/^\/sections\/(?<id>\d+)$/, ({ params }) => (
          <h1>Section {params.id}</h1>
        ))}
      </section>
    </>
  );
};

export const App = () => {
  let { withRoute } = useRoute();

  return (
    <>
      <Content />
      {withRoute(
        "/",
        <>
          <Browser autoFocus>
            <Content />
          </Browser>
          <Browser initialLocation="/sections/1">
            <Content />
          </Browser>
        </>
      )}
    </>
  );
};
