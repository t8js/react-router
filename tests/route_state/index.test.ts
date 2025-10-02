import { expect, type Page, test } from "@playwright/test";
import { type Server, serve } from "@t8/serve";

class Playground {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async move() {
    await this.page.getByRole("button", { name: "Move" }).click();
  }
  async reset() {
    await this.page.getByRole("button", { name: "Reset" }).click();
  }
  async hasPath(value: string) {
    await expect(this.page).toHaveURL(
      ({ pathname, search }) => pathname + search === value,
    );
  }
  async hasMatchingShape() {
    let c = this.page.locator('[data-id="circum"]');
    let x = await c.getAttribute("cx");
    let y = await c.getAttribute("cy");
    let r = await c.getAttribute("r");

    await expect(this.page).toHaveURL(({ search }) => {
      if (!search) return x === "50" && y === "50" && r === "30";

      let params = search.slice(1).split("&");

      return (
        params.includes(`x=${x}`) &&
        params.includes(`y=${y}`) &&
        params.includes(`r=${r}`)
      );
    });
  }
}

test.describe("route state", () => {
  let server: Server;

  test.beforeAll(async () => {
    server = await serve({
      path: "tests/route_state",
      bundle: "src/index.tsx",
      spa: true,
    });
  });

  test.afterAll(() => {
    server.close();
  });

  test("move shape", async ({ page }) => {
    let p = new Playground(page);

    await page.goto("/");
    await p.hasMatchingShape();

    await p.move();
    await p.hasMatchingShape();

    await p.move();
    await p.hasMatchingShape();

    await p.reset();
    await p.hasPath("/");
    await p.hasMatchingShape();
  });

  test("non-empty initial state", async ({ page }) => {
    let p = new Playground(page);

    await page.goto("?x=78&y=62&r=28");
    await p.hasMatchingShape();

    await p.reset();
    await p.hasPath("/");
    await p.hasMatchingShape();
  });
});
