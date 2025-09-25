import { A, useRoute } from "../../..";

const Header = () => {
  let { withRoute } = useRoute();

  return (
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
  );
};

const Intro = () => (
  <main>
    <h2>Intro</h2>
  </main>
);

const Section = ({ id }: { id: string }) => (
  <main>
    <h2>Section {id}</h2>
  </main>
);

export const App = () => {
  let { withRoute } = useRoute();

  return (
    <>
      <Header />
      {withRoute("/", <Intro />)}
      {withRoute(/^\/sections\/(?<id>\d+)\/?$/, ({ params }) => (
        <Section id={params.id!} />
      ))}
    </>
  );
};
