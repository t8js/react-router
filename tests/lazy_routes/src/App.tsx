import { Suspense } from "react";
import { A, useRoute } from "../../..";
import { Intro } from "./Intro";
import { ItemList } from "./ItemList.lazy";

export const App = () => {
  let { withRoute } = useRoute();

  return (
    <>
      <nav>
        <A href="/">Intro</A>
        {" | "}
        <A href="/items">Items</A>
      </nav>
      {withRoute("/", <Intro />)}
      {withRoute(
        "/items",
        <Suspense fallback={<p>⌛ Loading...</p>}>
          <ItemList />
        </Suspense>,
      )}
    </>
  );
};
