import { flushSync } from "react-dom";
import { A, useRoute } from "../../../index.ts";
import { Intro } from "./Intro.tsx";
import { Section } from "./Section.tsx";

function renderViewTransition(render: () => void) {
  if (document.startViewTransition)
    document.startViewTransition(() => {
      flushSync(render);
    });
  else render();
}

export const App = () => {
  let { at } = useRoute(renderViewTransition);

  return (
    <>
      <nav>
        <A href="/">Intro</A>
        {" | "}
        <A href="/sections/1">Section 1</A>
        {" | "}
        <A href="/sections/2">Section 2</A>
      </nav>
      {at("/", <Intro />)}
      {at(/^\/sections\/(?<id>\d+)\/?$/, ({ params }) => (
        <Section id={params.id} />
      ))}
    </>
  );
};
