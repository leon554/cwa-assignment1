import { expect, test } from "@playwright/test";

test("creates a word, edits its list, then deletes both", async ({ page }) => {
  const stamp = Date.now();
  const wordName = `e2e-word-${stamp}`;
  const listName = `e2e-list-${stamp}`;
  const editedName = `e2e-list-${stamp}-edited`;

  page.on("dialog", (dialog) => dialog.accept());
  await page.goto("/word");

  await page.getByLabel("English Word").fill(wordName);
  await page.getByRole("button", { name: "/p/ — P (as in pin)" }).click();
  await page.getByRole("button", { name: "Enter" }).click();
  await expect(page.getByRole("button", { name: `Delete ${wordName}`, exact: true })).toBeVisible();

  await page.getByLabel("List Name").fill(listName);
  await page.getByRole("checkbox", { name: wordName }).check();
  await page.getByRole("button", { name: "Create List" }).click();

  const wordOnList = page.getByRole("paragraph").getByText(wordName, { exact: true });

  await expect(page.getByRole("button", { name: `Delete ${listName}`, exact: true })).toBeVisible();
  await expect(wordOnList).toBeVisible();

  await page.getByLabel("Create Or Update List").selectOption("Update List");
  await page.getByLabel("Select List To Update").selectOption({ label: listName });
  const listNameInput = page.getByLabel("List Name");
  await expect(listNameInput).toHaveValue(listName);
  await listNameInput.fill(editedName);
  await page.getByRole("button", { name: "Update List" }).click();

  await expect(page.getByRole("button", { name: `Delete ${listName}`, exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: `Delete ${editedName}`, exact: true })).toBeVisible();
  await expect(wordOnList).toBeVisible();

  await page.getByRole("button", { name: `Delete ${editedName}`, exact: true }).click();
  await expect(page.getByRole("button", { name: `Delete ${editedName}`, exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: `Delete ${wordName}`, exact: true }).click();
  await expect(page.getByRole("button", { name: `Delete ${wordName}`, exact: true })).toHaveCount(0);
});
