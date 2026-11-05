import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const path = (p: string) => basePath + p;
test("lesson → quiz → bilingual switch → durable progress", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(path("/learn/topic-02/"));
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Value semantics",
  );
  await page.getByRole("tab", { name: "Middle", exact: true }).click();
  await expect(page.getByText("What happens under the hood?")).toBeVisible();
  await page
    .getByRole("button", {
      name: "Both struct values contain a reference to the same Account",
      exact: false,
    })
    .click();
  await page
    .getByRole("button", { name: "Check understanding", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "That reasoning holds" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Switch language", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Dəyər semantikası",
  );
  await expect(page.getByText("Bu düşüncə əsaslıdır.")).toBeVisible();
  await page.getByRole("button", { name: "Oxunmuş kimi qeyd et" }).click();
  await expect(page.getByText("Oxunmuş qeyd edildi.")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Dəyər semantikası",
  );
  await expect(
    page.getByText("Praktika edilir", { exact: true }),
  ).toBeVisible();
  await page.goto(path("/analytics/"));
  await expect(page.getByText("Cavab dəqiqliyi")).toBeVisible();
  await expect(errors).toEqual([]);
});
test("all phases searchable, empty cases honest, no mobile overflow", async ({
  page,
}) => {
  await page.goto(path("/curriculum/"));
  await expect(page.locator(".phase-header")).toHaveCount(17);
  await page
    .getByRole("textbox", { name: "Search syllabus" })
    .fill("Actor reentrancy");
  await expect(page.locator(".topic-row")).toHaveCount(2);
  await page.goto(path("/ibam/modules/"));
  await expect(
    page.getByRole("heading", { name: "A graph needs repository evidence." }),
  ).toBeVisible();
  await expect(page.locator(".react-flow")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("visual labs expose stale response and ownership cycle", async ({
  page,
}) => {
  await page.goto(path("/visualizations/"));
  await page.getByRole("button", { name: "Store closure" }).click();
  await page.getByRole("button", { name: "Release outside owner" }).click();
  await expect(
    page.getByRole("heading", { name: "The cycle keeps it alive." }),
  ).toBeVisible();
  await page
    .getByRole("checkbox", { name: "Use a weak closure capture" })
    .check();
  await expect(
    page.getByRole("heading", { name: "No strong owners remain." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Concurrency", exact: true }).click();
  await page.getByRole("button", { name: "Run the scenario" }).click();
  await expect(page.getByRole("status")).toContainText("A · stale");
  await page
    .getByRole("checkbox", { name: "Check generation after await" })
    .check();
  await page.getByRole("button", { name: "Run the scenario" }).click();
  await expect(page.getByRole("status")).toContainText("B · current");
});
test("private imports stay local, historical instructions stay inert, deletion preserves learning", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (!r.url().startsWith("http://127.0.0.1") && !r.url().startsWith("data:"))
      external.push(r.url());
  });
  await page.goto(path("/settings/"));
  await page
    .locator("input[type=file]")
    .nth(1)
    .setInputFiles({
      name: "private.md",
      mimeType: "text/markdown",
      buffer: Buffer.from(
        "#### Q1. Is this TCA?\n**Middle answer:** No reducer is established.\n**Follow-up:** Who owns mutation?\n<script>window.__privateLeaked = true</script>",
      ),
    });
  await expect(page.getByRole("status")).toContainText(
    "Historical report imported locally",
  );
  await page.goto(path("/ibam/"));
  await expect(page.locator(".report-content")).toContainText("<script>");
  expect(await page.evaluate(() => "__privateLeaked" in window)).toBe(false);
  await page.goto(path("/questions/"));
  await expect(
    page.getByRole("heading", { name: "Is this TCA?" }),
  ).toBeVisible();
  await page.goto(path("/settings/"));
  page.once("dialog", (d) => d.accept());
  await page
    .getByRole("button", { name: "Delete private data", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Private imports removed",
  );
  await page.reload();
  await expect(
    page.getByText("Import your supplied Markdown/TXT report.", {
      exact: false,
    }),
  ).toBeVisible();
  expect(external).toEqual([]);
});
test("interview saves answers and resumes after restart", async ({ page }) => {
  await page.goto(path("/interview/"));
  await page.getByRole("button", { name: "Start session" }).click();
  await page
    .getByRole("textbox", { name: "Your interview answer" })
    .fill(
      "I would define the invariant, inspect ownership and validate the result after suspension before updating UI state.",
    );
  await page.getByRole("button", { name: "Compare & self-assess" }).click();
  await expect(
    page.getByRole("heading", { name: "Evidence-based self-assessment" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save & next question" }).click();
  await expect(page.locator(".history-row")).toHaveCount(0);
  await page.reload();
  await page.getByRole("button", { name: /middle · 1 saved answers/ }).click();
  await expect(page.locator(".interview-surface .chip").first()).toContainText(
    "02",
  );
  await page.getByRole("button", { name: "End session" }).click();
  await expect(page.getByText("Ended", { exact: false })).toBeVisible();
});
test("dashboard keyboard/accessibility and color theme", async ({ page }) => {
  await page.goto(path("/dashboard/"));
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "A little deeper",
  );
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    accessibility.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("local editor and architecture graph load without external assets", async ({
  page,
}) => {
  const external: string[] = [];
  const errors: string[] = [];
  page.on("request", (r) => {
    if (
      !r.url().startsWith("http://127.0.0.1") &&
      !r.url().startsWith("data:") &&
      !r.url().startsWith("blob:")
    )
      external.push(r.url());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(path("/playground/"));
  await page.getByRole("button", { name: "Load Monaco editor" }).click();
  await expect(page.locator(".monaco-editor").first()).toBeVisible({
    timeout: 20000,
  });
  await page.goto(path("/architecture/"));
  await expect(page.locator(".react-flow__node")).toHaveCount(5);
  await page.getByRole("checkbox", { name: "Use-case policy" }).check();
  await expect(page.locator(".react-flow__node")).toHaveCount(6);
  await page.getByRole("button", { name: "View sequence diagram" }).click();
  await expect(page.locator("svg[id^=sequence-]")).toBeVisible({
    timeout: 15000,
  });
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});
test("optional provider needs per-request consent and excludes imported private evidence", async ({
  page,
}) => {
  let payload: unknown = null;
  await page.route("https://provider.example.test/chat", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        choices: [
          { message: { content: "Explain the invariant after suspension." } },
        ],
      }),
    });
  });
  await page.goto(path("/settings/"));
  await page
    .getByRole("combobox", { name: "Optional provider", exact: true })
    .selectOption("openai-compatible");
  await page
    .getByRole("textbox", { name: "Full endpoint URL (no secrets)" })
    .fill("https://provider.example.test/chat");
  await page.getByRole("textbox", { name: "Model name" }).fill("fixture-model");
  await page.getByRole("button", { name: "Save optional provider" }).click();
  expect(payload).toBeNull();
  await page.goto(path("/interview/"));
  await page.getByRole("button", { name: "Start session" }).click();
  await page
    .getByRole("textbox", { name: "Your interview answer" })
    .fill(
      "I would revalidate the current operation after every suspension point.",
    );
  await page.getByRole("button", { name: "Compare & self-assess" }).click();
  expect(payload).toBeNull();
  page.once("dialog", (d) => d.accept());
  await page
    .getByRole("button", { name: "Request optional AI feedback" })
    .click();
  await expect(
    page.getByText("Explain the invariant after suspension.", { exact: true }),
  ).toBeVisible();
  expect(payload).not.toBeNull();
  expect(JSON.stringify(payload)).not.toContain("snapshot");
  expect(JSON.stringify(payload)).not.toContain("privateNotes");
});
