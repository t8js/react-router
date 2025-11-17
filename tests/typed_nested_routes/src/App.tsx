import { createURLSchema } from "url-shape";
import { z } from "zod";
import { A, useRoute } from "../../../index.ts";

let sectionParams = z.object({
  sectionId: z.coerce.number(),
});

const { url } = createURLSchema({
  "/": z.object({}),
  "/sections/:sectionId": z.object({
    params: sectionParams,
  }),
  "/sections/:sectionId/stories/:storyId": z.object({
    params: z.object({
      ...sectionParams.shape, // Shared params
      storyId: z.coerce.number(),
    }),
  }),
});

const sectionCount = 3;
const sectionStoryCount = 3;

let Nav = () => (
  <nav>
    <ul>
      <li>
        <A href={url("/")}>Intro</A>
      </li>
      {Array.from({ length: sectionCount }).map((_, i) => (
        <li key={i}>
          <A
            href={url("/sections/:sectionId", { params: { sectionId: i + 1 } })}
          >
            Section {i + 1}
          </A>
          <ul>
            {Array.from({ length: sectionStoryCount }).map((_, k) => (
              <li key={`${i}_${k}`}>
                <A
                  href={url("/sections/:sectionId/stories/:storyId", {
                    params: { sectionId: i + 1, storyId: k + 1 },
                  })}
                >
                  Story {i + 1}.{k + 1}
                </A>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </nav>
);

export let App = () => {
  let { at } = useRoute();

  return (
    <>
      <Nav />
      {at(url("/sections/:sectionId"), ({ params }) => (
        <main>
          <h1>Section {params.sectionId}</h1>
        </main>
      ))}
      {at(url("/sections/:sectionId/stories/:storyId"), ({ params }) => (
        <main>
          <h1>
            Story {params.sectionId}.{params.storyId}
          </h1>
        </main>
      ))}
      {at(
        url("/"),
        <main>
          <h1>Intro</h1>
        </main>,
      )}
    </>
  );
};
