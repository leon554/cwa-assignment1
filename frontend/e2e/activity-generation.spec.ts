import { expect, type Page, test } from "@playwright/test";

async function statValue(page: Page, label: string) {
  const labelText = page.getByText(label, { exact: true });
  await expect(labelText).toBeVisible();
  const value = await labelText.locator("xpath=following-sibling::p[1]").innerText();
  return Number(value);
}

function generationLogged(page: Page) {
  return page.waitForResponse(
    (response) =>
      response.url().includes("/api/metrics/generation") &&
      response.request().method() === "POST",
  );
}

test("generates a word search and a wordle, then the dashboard counts rise", async ({ page }) => {
  page.on("dialog", (dialog) => dialog.accept());

  await page.goto("/dashboard");
  const generations = await statValue(page, "Generations");
  const successful = await statValue(page, "Successful generations");

  await page.goto("/word-search");
  await page.getByRole("button", { name: "Load" }).first().click();
  const searchLogged = generationLogged(page);
  await page.getByRole("button", { name: "Regenerate puzzle" }).click();
  await expect(page.getByRole("grid", { name: "Word search grid" })).toBeVisible();
  await searchLogged;

  const searchDownload = page.waitForEvent("download");
  const searchHtmlLogged = generationLogged(page);
  await page.getByRole("button", { name: "Generate Word Search HTML" }).click();
  expect((await searchDownload).suggestedFilename()).toMatch(/\.html$/);
  await searchHtmlLogged;

  await page.goto("/wordle");
  await page.getByRole("button", { name: "Load" }).first().click();
  await expect(page.getByRole("grid", { name: "Wordle guess grid" })).toBeVisible();
  const wordleDownload = page.waitForEvent("download");
  const wordleLogged = generationLogged(page);
  await page.getByRole("button", { name: "Generate Wordle HTML" }).click();
  expect((await wordleDownload).suggestedFilename()).toMatch(/\.html$/);
  await wordleLogged;

  await page.goto("/dashboard");
  expect(await statValue(page, "Generations")).toBeGreaterThan(generations);
  expect(await statValue(page, "Successful generations")).toBeGreaterThan(successful);
});
