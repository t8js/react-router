import { A, useRoute } from "../../..";

export const App = () => {
  let { withRoute } = useRoute();

  return (
    <>
      <header className={withRoute("/", "full", "compact")}>
        <h1>App</h1>
        <nav>
          <A href="/">Intro</A>
          {" | "}
          <A href="/sections/1">Section 1</A>
          {" | "}
          <A href="/sections/2">Section 2</A>
        </nav>
      </header>
      {withRoute(
        "/",
        <main>
          <h2>Intro</h2>
        </main>
      )}
      {withRoute(/^\/sections\/(?<id>\d+)\/?$/, ({ params }) => (
        <main>
          <h2>Section {params.id}</h2>
        </main>
      ))}
    </>
  );
};
