import { useCallback } from "react";
import { A, useNavigationStart, useRoute } from "../../..";
import { ShapeSection } from "./ShapeSection";

export const App = () => {
  let { route, at } = useRoute();

  let initialRedirect = useCallback(
    (href: string) => {
      if (href === "/") {
        route.assign("/shapes/1");
        return false;
      }
    },
    [route],
  );

  useNavigationStart(initialRedirect);

  return (
    <>
      {at(
        "/",
        <main className="intro">
          <p>
            <A href="/shapes/1">Start</A>
          </p>
        </main>,
      )}
      {at(/^\/shapes\/\d+/, <ShapeSection />)}
    </>
  );
};
