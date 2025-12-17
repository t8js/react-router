import { A, useRoute } from "../../../index.ts";

export const App = () => {
  let { at } = useRoute();

  return (
    <>
      {at(
        "/",
        <main>
          <h1>Intro</h1>
          <p className="placeholder">Long text placeholder</p>
          <p>
            <A href="/story">To the story</A>
            {" | "}
            <A href="/story" data-scroll="off">
              To the story (no scroll)
            </A>
          </p>
        </main>,
      )}
      {at(
        "/story",
        <main>
          <h1>Story</h1>
          <p className="placeholder">Long text placeholder</p>
          <p>
            <A href="/">Back to the intro</A>
          </p>
        </main>,
      )}
    </>
  );
};
