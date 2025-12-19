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
  async hasPath(value: string) {
    await expect(this.page).toHaveURL(({ pathname }) => pathname === value);
  }
  async hasMainTitle(value: string) {
    await expect(this.page.locator("h1")).toHaveText(value);
  }
}

test.describe
  .only("view transitions", () => {
    let server: Server;

    test.beforeAll(async () => {
      server = await serve({
        path: "tests/view_transitions",
        bundle: "src/index.tsx",
        spa: true,
      });
    });

    test.afterAll(() => {
      server.close();
    });

    // A smoke test verifying that the view transition setup
    // hasn't broken the routing.
    test("routing", async ({ page }) => {
      let p = new Playground(page);

      await page.goto("/");
      await p.hasMainTitle("Intro");

      await p.clickLink("Section 1");
      await p.hasPath("/sections/1");
      await p.hasMainTitle("Section 1");

      await p.clickLink("Section 2");
      await p.hasPath("/sections/2");
      await p.hasMainTitle("Section 2");

      await p.clickLink("Intro");
      await p.hasPath("/");
      await p.hasMainTitle("Intro");
    });
  });
