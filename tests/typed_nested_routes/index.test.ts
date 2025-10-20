import { expect, type Page, test } from "@playwright/test";
import { type Server, serve } from "@t8/serve";

class Playground {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async clickLink(name: string) {
    await this.page.getByRole("link", { name }).click();
  }
  async hasLink(name: string, url: string) {
    await expect(this.page.getByRole("link", { name })).toHaveAttribute("href", url);
  }
  async hasPath(value: string) {
    await expect(this.page).toHaveURL(({ pathname, search }) => pathname + search === value);
  }
  async hasTitle(value: string) {
    await expect(this.page.locator("h1")).toHaveText(value);
  }
}

test.describe("typed nested routes", () => {
  let server: Server;

  test.beforeAll(async () => {
    server = await serve({
      path: "tests/typed_nested_routes",
      bundle: "src/index.tsx",
      spa: true,
    });
  });

  test.afterAll(() => {
    server.close();
  });

  test("nav links", async ({ page }) => {
    let p = new Playground(page);

    await page.goto("/");
    await p.hasTitle("Intro");
    await p.hasLink("Intro", "/");
    await p.hasLink("Section 1", "/sections/1");
    await p.hasLink("Story 1.1", "/sections/1/stories/1");
    await p.hasLink("Story 1.2", "/sections/1/stories/2");
    await p.hasLink("Section 2", "/sections/2");
    await p.hasLink("Story 2.1", "/sections/2/stories/1");
    await p.hasLink("Section 3", "/sections/3");
    await p.hasLink("Story 3.2", "/sections/3/stories/2");
  });

  test("link content", async ({ page }) => {
    let p = new Playground(page);

    await page.goto("/");
    await p.hasTitle("Intro");

    await p.clickLink("Section 1");
    await p.hasTitle("Section 1");
    await p.hasPath("/sections/1");

    await p.clickLink("Story 1.2");
    await p.hasTitle("Story 1.2");
    await p.hasPath("/sections/1/stories/2");

    await p.clickLink("Story 3.1");
    await p.hasTitle("Story 3.1");
    await p.hasPath("/sections/3/stories/1");

    await p.clickLink("Intro");
    await p.hasTitle("Intro");
    await p.hasPath("/");

    await p.clickLink("Section 2");
    await p.hasTitle("Section 2");
    await p.hasPath("/sections/2");
  });

  test("section url", async ({ page }) => {
    let p = new Playground(page);

    await page.goto("/sections/2");
    await p.hasTitle("Section 2");

    await p.clickLink("Story 3.2");
    await p.hasTitle("Story 3.2");
    await p.hasPath("/sections/3/stories/2");

    await p.clickLink("Intro");
    await p.hasTitle("Intro");
    await p.hasPath("/");
  });

  test("story url", async ({ page }) => {
    let p = new Playground(page);

    await page.goto("/sections/2/stories/2");
    await p.hasTitle("Story 2.2");

    await p.clickLink("Story 1.3");
    await p.hasTitle("Story 1.3");
    await p.hasPath("/sections/1/stories/3");

    await p.clickLink("Intro");
    await p.hasTitle("Intro");
    await p.hasPath("/");

    await p.clickLink("Section 3");
    await p.hasTitle("Section 3");
    await p.hasPath("/sections/3");
  });
});
