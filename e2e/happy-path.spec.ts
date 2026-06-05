import { test, expect } from "@playwright/test";

test("claims reviewer approves a submitted claim", async ({ page }) => {
  await page.goto("/login");
  await page.getByTestId("login-as-user_daniel").click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/claims?status=submitted");
  await expect(page.getByTestId("table-filter-status")).toBeVisible();

  const claimLink = page.locator("[data-testid^='claim-link-']").first();
  await expect(claimLink).toBeVisible();
  const claimNumber = (await claimLink.getAttribute("data-testid"))!.replace("claim-link-", "");

  await claimLink.click();
  await expect(page).toHaveURL(/\/claims\/[^/]+$/);

  const detail = page.getByTestId("claim-detail");
  await expect(detail).toBeVisible({ timeout: 15_000 });

  const startReview = detail.getByTestId("claim-start-review");
  if (await startReview.isVisible().catch(() => false)) {
    await startReview.click();
    await page.getByTestId("claim-transition-note").fill("Opening review for E2E test.");
    await page.getByTestId("claim-transition-under_review").click();
    await expect(detail.getByTestId("claim-status-under_review")).toBeVisible({ timeout: 15_000 });
  }

  await detail.getByTestId("claim-approve").click();
  await page.getByTestId("claim-transition-note").fill("Approved in E2E happy path.");
  await page.getByTestId("claim-transition-approved").click();
  await expect(detail.getByTestId("claim-status-approved")).toBeVisible({ timeout: 15_000 });

  await page.getByTestId("open-activity").click();
  const feed = page.getByTestId("activity-feed");
  await expect(feed).toBeVisible();
  await expect(feed.getByText(new RegExp(claimNumber, "i")).first()).toBeVisible();
  await expect(feed.getByText(/marked approved/i).first()).toBeVisible();
});
