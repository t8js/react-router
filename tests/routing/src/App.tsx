import { A, useRoute } from "../../../index.ts";

export const App = () => {
  let { at } = useRoute();

  return (
    <>
      <header className={at("/", "full", "compact")}>
        <h1>App</h1>
        <nav>
          <A href="/">Intro</A>
          {" | "}
          <A href="/sections/1">Section 1</A>
          {" | "}
          <A href="/sections/2">Section 2</A>
        </nav>
      </header>
      {at(
        "/",
        <main>
          <h2>Intro</h2>
        </main>,
      )}
      {at(/^\/sections\/(?<id>\d+)\/?$/, ({ params }) => (
        <main>
          <h2>Section {params.id}</h2>
        </main>
      ))}
    </>
  );
};
