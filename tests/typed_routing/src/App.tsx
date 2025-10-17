import { createURLSchema } from "url-shape";
import { z } from "zod";
import { A, useRoute } from "../../..";

let { url } = createURLSchema({
  "/": null, // goes without parameters
  "/sections/:id": {
    params: z.object({
      id: z.coerce.number(),
    }),
  },
});

export const App = () => {
  let { at } = useRoute();

  return (
    <>
      <header className={at(url("/"), "full", "compact")}>
        <h1>App</h1>
        <nav>
          <A href={url("/")}>Intro</A>
          {" | "}
          <A href={url("/sections/:id", { params: { id: 1 } })}>Section 1</A>
          {" | "}
          <A href={url("/sections/:id", { params: { id: 2 } })}>Section 2</A>
        </nav>
      </header>
      {at(
        url("/"),
        <main>
          <h2>Intro</h2>
        </main>,
      )}
      {at(url("/sections/:id"), ({ params }) => (
        <main>
          <h2>Section {params.id}</h2>
        </main>
      ))}
    </>
  );
};
