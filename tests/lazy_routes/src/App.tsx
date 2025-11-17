import { Suspense } from "react";
import { A, useRoute } from "../../../index.ts";
import { Intro } from "./Intro.tsx";
import { ItemList } from "./ItemList.lazy.ts";

export const App = () => {
  let { at } = useRoute();

  return (
    <>
      <nav>
        <A href="/">Intro</A>
        {" | "}
        <A href="/items">Items</A>
      </nav>
      {at("/", <Intro />)}
      {at(
        "/items",
        <Suspense fallback={<p>⌛ Loading...</p>}>
          <ItemList />
        </Suspense>,
      )}
    </>
  );
};
