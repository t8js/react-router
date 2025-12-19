import { A, useRoute } from "../../../index.ts";

const Header = () => {
  let { at } = useRoute();

  return (
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
  );
};

const Intro = () => (
  <main>
    <h2>Intro</h2>
  </main>
);

const Section = ({ id }: { id: string | undefined }) => (
  <main>
    <h2>Section {id}</h2>
  </main>
);

export const App = () => {
  let { at } = useRoute();

  return (
    <>
      <Header />
      {at("/", <Intro />)}
      {at(/^\/sections\/(?<id>\d+)\/?$/, ({ params }) => (
        <Section id={params.id} />
      ))}
    </>
  );
};
