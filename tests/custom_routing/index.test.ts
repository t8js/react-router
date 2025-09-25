import { expect, type Page, test } from "@playwright/test";
import { type Server, serve } from "@t8/serve";

class Playground {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  getBrowser(n: number) {
    return this.page.locator(`.browser:nth-of-type(${n})`);
  }
  getBrowserInput(n: number) {
    return this.getBrowser(n).locator(".navbar input");
  }
  async hasPath(value: string, n?: number) {
    if (n) await expect(this.getBrowserInput(n)).toHaveValue(value);
    else
      await expect(this.page).toHaveURL(
        ({ pathname, search }) => pathname + search === value,
      );
  }
  async hasTitle(value: string, n?: number) {
    if (n) await expect(this.getBrowser(n).locator("h1")).toHaveText(value);
    else await expect(this.page.locator("#app > section h1")).toHaveText(value);
  }
  async clickLink(name: string, n?: number) {
    if (n) await this.getBrowser(n).getByRole("link", { name }).click();
    else
      await this.page.locator("#app > nav").getByRole("link", { name }).click();
  }
  async goto(value: string, n?: number) {
    if (n) {
      let input = this.getBrowserInput(n);

      await input.fill(value);
      await input.press("Enter");
    } else await this.page.goto(value);
  }
}

let server: Server;

test.beforeAll(async () => {
  server = await serve({
    path: "tests/custom_routing",
    bundle: "src/index.tsx",
    spa: true,
  });
});

test.afterAll(() => {
  server.close();
});

test("top-level", async ({ page }) => {
  let p = new Playground(page);

  await page.goto("/");
  await p.hasPath("/");
  await p.hasPath("/", 1);
  await p.hasPath("/sections/1", 2);

  await p.clickLink("About");
  await p.hasPath("/about");
  await p.hasTitle("About");

  await p.clickLink("Section 1");
  await p.hasPath("/sections/1");
  await p.hasTitle("Section 1");

  await p.clickLink("Section 2");
  await p.hasPath("/sections/2");
  await p.hasTitle("Section 2");

  await p.clickLink("Intro");
  await p.hasPath("/");
  await p.hasTitle("Intro");
  await p.hasPath("/", 1);
  await p.hasPath("/sections/1", 2);
});

test("browser 1", async ({ page }) => {
  let p = new Playground(page);

  await page.goto("/");
  await p.hasPath("/");
  await p.hasTitle("Intro");
  await p.hasPath("/", 1);
  await p.hasTitle("Intro", 1);
  await p.hasPath("/sections/1", 2);
  await p.hasTitle("Section 1", 2);

  await p.clickLink("About", 1);
  await p.hasPath("/");
  await p.hasTitle("Intro");
  await p.hasPath("/about", 1);
  await p.hasTitle("About", 1);
  await p.hasPath("/sections/1", 2);
  await p.hasTitle("Section 1", 2);

  await p.clickLink("Section 1", 1);
  await p.hasPath("/");
  await p.hasTitle("Intro");
  await p.hasPath("/sections/1", 1);
  await p.hasTitle("Section 1", 1);
  await p.hasPath("/sections/1", 2);
  await p.hasTitle("Section 1", 2);

  await p.clickLink("Section 2", 1);
  await p.hasPath("/");
  await p.hasTitle("Intro");
  await p.hasPath("/sections/2", 1);
  await p.hasTitle("Section 2", 1);
  await p.hasPath("/sections/1", 2);
  await p.hasTitle("Section 1", 2);

  await p.clickLink("Intro", 1);
  await p.hasPath("/");
  await p.hasTitle("Intro");
  await p.hasPath("/", 1);
  await p.hasTitle("Intro", 1);
  await p.hasPath("/sections/1", 2);
  await p.hasTitle("Section 1", 2);

  await p.goto("/sections/10", 1);
  await p.hasPath("/sections/10", 1);
  await p.hasTitle("Section 10", 1);
  await p.hasPath("/sections/1", 2);
  await p.hasTitle("Section 1", 2);
  await p.hasPath("/");
  await p.hasTitle("Intro");
});

test("browser 2", async ({ page }) => {
  let p = new Playground(page);

  await page.goto("/");
  await p.hasPath("/");
  await p.hasTitle("Intro");
  await p.hasPath("/", 1);
  await p.hasTitle("Intro", 1);
  await p.hasPath("/sections/1", 2);
  await p.hasTitle("Section 1", 2);

  await p.clickLink("About", 2);
  await p.hasPath("/");
  await p.hasTitle("Intro");
  await p.hasPath("/about", 2);
  await p.hasTitle("About", 2);
  await p.hasPath("/", 1);
  await p.hasTitle("Intro", 1);

  await p.clickLink("Section 1", 2);
  await p.hasPath("/");
  await p.hasTitle("Intro");
  await p.hasPath("/", 1);
  await p.hasTitle("Intro", 1);
  await p.hasPath("/sections/1", 2);
  await p.hasTitle("Section 1", 2);

  await p.clickLink("Section 2", 2);
  await p.hasPath("/");
  await p.hasTitle("Intro");
  await p.hasPath("/", 1);
  await p.hasTitle("Intro", 1);
  await p.hasPath("/sections/2", 2);
  await p.hasTitle("Section 2", 2);

  await p.clickLink("Intro", 2);
  await p.hasPath("/");
  await p.hasTitle("Intro");
  await p.hasPath("/", 1);
  await p.hasTitle("Intro", 1);
  await p.hasPath("/", 2);
  await p.hasTitle("Intro", 2);

  await p.goto("/sections/10", 2);
  await p.hasPath("/sections/10", 2);
  await p.hasTitle("Section 10", 2);
  await p.hasPath("/", 1);
  await p.hasTitle("Intro", 1);
  await p.hasPath("/");
  await p.hasTitle("Intro");
});
