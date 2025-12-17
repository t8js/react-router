import { expect, type Page, test } from "@playwright/test";
import { type Server, serve } from "@t8/serve";

class Playground {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async getScrollY() {
    return await this.page.evaluate(() => window.scrollY);
  }
  async isScrolledUp() {
    expect(await this.getScrollY()).toBe(0);
  }
  async isScrolledAway() {
    expect(await this.getScrollY()).toBeGreaterThan(100);
  }
  async hasPath(value: string) {
    await expect(this.page).toHaveURL(
      ({ pathname, search, hash }) => pathname + search + hash === value,
    );
  }
  async hasMainTitle(value: string) {
    await expect(this.page.locator("h1:visible")).toHaveText(value);
  }
}

test.describe("link scroll mode", () => {
  let server: Server;

  test.beforeAll(async () => {
    server = await serve({
      path: "tests/link_scroll_mode",
      bundle: "src/index.tsx",
      spa: true,
    });
  });

  test.afterAll(() => {
    server.close();
  });

  test("default", async ({ page }) => {
    let p = new Playground(page);

    await page.goto("/");
    await p.hasMainTitle("Intro");
    await p.isScrolledUp();

    let link = page.getByRole("link", { name: "To the story", exact: true });

    await link.scrollIntoViewIfNeeded();
    await p.isScrolledAway();
    await link.click();
    await p.hasPath("/story");
    await p.hasMainTitle("Story");
    await p.isScrolledUp();
  });

  test('data-scroll="off"', async ({ page }) => {
    let p = new Playground(page);

    await page.goto("/");
    await p.hasMainTitle("Intro");
    await p.isScrolledUp();

    let link = page.getByRole("link", {
      name: "To the story (no scroll)",
      exact: true,
    });

    await link.scrollIntoViewIfNeeded();
    await p.isScrolledAway();
    await link.click();
    await p.hasPath("/story");
    await p.hasMainTitle("Story");
    await p.isScrolledAway();
  });

  test("same-page fragment link", async ({ page }) => {
    let p = new Playground(page);

    await page.goto("/");
    await p.hasMainTitle("Intro");
    await p.isScrolledUp();

    let link = page.getByRole("link", {
      name: "To the footnotes",
      exact: true,
    });

    await link.scrollIntoViewIfNeeded();

    let footnotes = page.locator("#footnotes");

    await expect(footnotes).not.toBeInViewport();
    await link.click();
    await p.hasPath("/#footnotes");
    await p.isScrolledAway();
    await expect(footnotes).toBeInViewport();
  });

  test("other-page fragment link", async ({ page }) => {
    let p = new Playground(page);

    await page.goto("/");
    await p.hasMainTitle("Intro");
    await p.isScrolledUp();

    let link = page.getByRole("link", {
      name: "To the story's postscript",
      exact: true,
    });

    await link.scrollIntoViewIfNeeded();

    let storyPostscript = page.locator("#ps");

    await expect(storyPostscript).toBeHidden();
    await link.click();
    await p.hasPath("/story#ps");
    await p.isScrolledAway();
    await expect(storyPostscript).toBeInViewport();
  });
});
