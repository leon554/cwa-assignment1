import { expect, test } from "@playwright/test";

test("health returns 200", async ({ request }) => {
  const response = await request.get("/health");
  expect(response.status()).toBe(200);
});
