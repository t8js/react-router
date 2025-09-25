import { expect, type Page, test } from "@playwright/test";
import { serve, type Server } from "@t8/serve";

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
  async hasMainTitle() {
    await expect(this.page.locator("h1")).toBeVisible();
  }
  async hasSectionTitle(value: string) {
    await expect(this.page.locator("h2:visible")).toHaveText(value);
  }
  async hasFullHeader() {
    await expect(this.page.locator("header")).toHaveClass("full");
  }
  async hasCompactHeader() {
    await expect(this.page.locator("header")).toHaveClass("compact");
  }
}

let server: Server;

test.beforeAll(async () => {
  server = await serve({
    path: "playground/route_matching",
    bundle: "src/index.tsx",
    spa: true,
  });
});

test.afterAll(() => {
  server.close();
});

test("route links", async ({ page }) => {
  let p = new Playground(page);

  await page.goto("/");
  await p.hasMainTitle();
  await p.hasFullHeader();

  await p.clickLink("Section 1");
  await p.hasPath("/sections/1");
  await p.hasSectionTitle("Section 1");
  await p.hasCompactHeader();

  await p.clickLink("Section 2");
  await p.hasPath("/sections/2");
  await p.hasSectionTitle("Section 2");
  await p.hasCompactHeader();

  await p.clickLink("Intro");
  await p.hasPath("/");
  await p.hasSectionTitle("Intro");
  await p.hasFullHeader();
});

test("non-root url", async ({ page }) => {
  let p = new Playground(page);

  await page.goto("/sections/10");
  await p.hasSectionTitle("Section 10");
  await p.hasCompactHeader();

  await p.clickLink("Intro");
  await p.hasPath("/");
  await p.hasSectionTitle("Intro");
  await p.hasFullHeader();

  await p.clickLink("Section 1");
  await p.hasPath("/sections/1");
  await p.hasSectionTitle("Section 1");
  await p.hasCompactHeader();
});
