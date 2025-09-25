import { expect, type Page, test } from "@playwright/test";
import { serve, type Server } from "@t8/serve";

class Playground {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async hasPath(value: string) {
    await expect(this.page).toHaveURL(({ pathname, search }) => pathname + search === value);
  }
  async clickLink(name: string) {
    await this.page.getByRole("link", { name }).click();
  }
  async showsLoadingStatus() {
    await expect(this.page.locator("p", { hasText: "⌛ Loading..." })).toBeVisible();
  }
  async showsItemList() {
    await expect(this.page.locator("li", { hasText: "bed" })).toBeVisible();
  }
  async hasTitle(value: string) {
    await expect(this.page.locator("h1")).toHaveText(value);
  }
}

let server: Server;

test.beforeAll(async () => {
  server = await serve({
    path: "tests/lazy_routes",
    bundle: "src/index.tsx",
    spa: true,
  });
});

test.afterAll(() => {
  server.close();
});

test("lazy", async ({ page }) => {
  let p = new Playground(page);

  await page.goto("/");
  await p.hasTitle("Intro");
  await p.clickLink("Items");
  await p.hasPath("/items");
  await p.showsLoadingStatus();
  await p.hasTitle("Items");
  await p.showsItemList();

  await p.clickLink("Intro");
  await p.hasTitle("Intro");
  await p.hasPath("/");

  await p.clickLink("Items");
  await p.hasPath("/items");
  await p.hasTitle("Items");
  await p.showsItemList();
});
