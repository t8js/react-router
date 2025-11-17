import { createURLSchema } from "url-shape";
import { z } from "zod";
import { A, useRouteState } from "../../../index.ts";
import { Shape } from "./Shape.tsx";

const { url } = createURLSchema({
  "/shapes/:id": z.object({
    params: z.object({
      id: z.coerce.number(),
    }),
    query: z.optional(
      z.object({
        x: z.coerce.number(),
        y: z.coerce.number(),
        r: z.coerce.number(),
      }),
    ),
  }),
});

export const ShapeSection = () => {
  let [{ params, query }, setState] = useRouteState(url("/shapes/:id"));

  let setPosition = () => {
    setState((state) => ({
      ...state,
      query: {
        x: Math.floor(100 * Math.random()),
        y: Math.floor(100 * Math.random()),
        r: Math.floor(10 + 30 * Math.random()),
      },
    }));
  };

  let resetPosition = () => {
    setState({ params });
  };

  return (
    <main>
      <h1>Shape {params.id}</h1>
      <Shape x={query?.x} y={query?.y} r={query?.r} n={params.id + 2} />
      <p>
        <button onClick={setPosition}>Move</button>{" "}
        <button onClick={resetPosition}>Reset</button>
      </p>
      <nav>
        <A href="/">Intro</A>
        {" | "}
        <A href={url("/shapes/:id", { params: { id: params.id + 1 } })}>
          Next shape →
        </A>
      </nav>
    </main>
  );
};
