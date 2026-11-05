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
  await page.getByRole("button", { name: "Middle", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Under the hood: COW separates logical value from storage",
    }),
  ).toBeVisible();
  await expect(
    page.locator('[data-teaching-level="junior"]').first(),
  ).toBeVisible();
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
test("full chapter teaches a mechanism and persists an authored tutor conversation without an API", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (!r.url().startsWith("http://127.0.0.1") && !r.url().startsWith("data:"))
      external.push(r.url());
  });
  await page.goto(path("/learn/topic-02/"));
  await expect(
    page.getByRole("heading", {
      name: "Start from zero: copying a fact versus sharing an object",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Senior judgment: measure the cost, protect the contract",
    }),
  ).toBeAttached();
  await expect(page.locator(".worked-example")).toHaveCount(2);
  await expect(page.locator(".deep-interview-question")).toHaveCount(3);
  await page.getByRole("button", { name: "Middle", exact: true }).click();
  await expect(
    page.locator("[data-teaching-level=junior]").first(),
  ).toBeVisible();
  await page
    .getByText("Show the correction and why it works", { exact: true })
    .click();
  await expect(
    page.getByText("Create receipt at 100; change the live balance to 0;", {
      exact: false,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Does Array copy-on-write deep-copy class elements?",
      exact: true,
    })
    .click();
  await expect(page.locator(".tutor-message.assistant")).toContainText(
    "Copying array storage copies element values",
  );
  await expect(page.locator(".tutor-message.assistant")).toContainText(
    "actor isolation",
  );
  await page.reload();
  await expect(page.locator(".tutor-message.assistant")).toContainText(
    "Copying array storage copies element values",
  );
  await page
    .getByRole("textbox", { name: "What would you like explained?" })
    .fill("medieval pottery kiln glaze temperatures");
  await page
    .getByRole("button", { name: "Find an authored explanation" })
    .click();
  await expect(page.locator(".tutor-message.assistant").last()).toContainText(
    "do not have an authored answer",
  );
  expect(external).toEqual([]);
});
test("curriculum distinguishes full teaching from notes and filters chapters", async ({
  page,
}) => {
  await page.goto(path("/curriculum/"));
  await page.getByRole("checkbox", { name: "Long-form chapters only" }).check();
  await expect(page.locator(".topic-row")).toHaveCount(13);
  await expect(page.locator(".topic-actions .chip.green")).toHaveCount(13);
  await page.goto(path("/learn/topic-03/"));
  await expect(
    page.getByText("This entry is a brief study note.", { exact: false }),
  ).toBeVisible();
  await page.goto(path("/questions/"));
  await page
    .getByRole("textbox", { name: "Search questions" })
    .fill("Array copy-on-write deep-copy");
  await expect(
    page.getByRole("heading", {
      name: "Does Array copy-on-write deep-copy class elements?",
    }),
  ).toBeVisible();
  await page.getByText("Model answer & follow-up", { exact: true }).click();
  await expect(
    page.getByText("No. Copying array storage copies element values;", {
      exact: false,
    }),
  ).toBeVisible();
});
test("open-ended tutor requires consent, formats code and excludes private imports", async ({
  page,
}) => {
  let requests = 0;
  let sent = "";
  await page.route("https://provider.example.test/tutor", async (route) => {
    requests++;
    sent = route.request().postData() || "";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        choices: [
          {
            message: {
              content:
                "## A different example\n\nA constant reference is different from an immutable object.\n\n```swift\nlet value = 42\nprint(value)\n```\n\n<script>window.__tutorLeak = true</script>",
            },
          },
        ],
      }),
    });
  });
  await page.goto(path("/settings/"));
  await page
    .locator("input[type=file]")
    .nth(1)
    .setInputFiles({
      name: "private.md",
      mimeType: "text/markdown",
      buffer: Buffer.from(
        "PRIVATE_REPORT_SENTINEL — never transmit this document",
      ),
    });
  await expect(page.getByRole("status")).toContainText(
    "Historical report imported locally",
  );
  await page
    .getByRole("combobox", { name: "Optional provider", exact: true })
    .selectOption("openai-compatible");
  await page
    .getByRole("textbox", { name: "Full endpoint URL (no secrets)" })
    .fill("https://provider.example.test/tutor");
  await page.getByRole("textbox", { name: "Model name" }).fill("test-tutor");
  await page.getByRole("button", { name: "Save optional provider" }).click();
  await page.goto(path("/learn/topic-02/"));
  await page
    .getByRole("textbox", { name: "What would you like explained?" })
    .fill("Can you teach this with a different concrete Swift example?");
  expect(requests).toBe(0);
  page.once("dialog", (d) => d.dismiss());
  await page.getByRole("button", { name: "Ask configured AI" }).click();
  expect(requests).toBe(0);
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Ask configured AI" }).click();
  await expect(
    page.locator(".tutor-message.assistant h2", {
      hasText: "A different example",
    }),
  ).toBeVisible();
  await expect(page.locator(".tutor-message.assistant pre")).toContainText(
    "let value = 42",
  );
  expect(requests).toBe(1);
  expect(sent).toContain("Public authored lesson context");
  expect(sent).toContain("Copying the buffer");
  expect(sent).not.toContain("PRIVATE_REPORT_SENTINEL");
  expect(await page.evaluate(() => "__tutorLeak" in window)).toBe(false);
});
test("prediction assessment includes its own exact reference code", async ({
  page,
}) => {
  await page.goto(path("/learn/topic-02/"));
  await page
    .getByRole("button", {
      name: "Both struct values contain a reference to the same Account",
      exact: false,
    })
    .click();
  await page
    .getByRole("button", { name: "Check understanding", exact: true })
    .click();
  await page.getByRole("button", { name: "Try a different question" }).click();
  await expect(page.locator("#quiz details[open] code")).toContainText(
    "print(a.count, c.count)",
  );
  await page
    .getByRole("textbox", { name: "Predicted console output" })
    .fill("20\n2 3");
  await page
    .getByRole("button", { name: "Check understanding", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "That reasoning holds" }),
  ).toBeVisible();
});
test("Swift Basics explains concepts before code and links source items to their teaching", async ({
  page,
}) => {
  await page.goto(path("/learn/topic-01/"));
  await expect(
    page.getByRole("heading", {
      name: "Before syntax: what does a program actually do?",
    }),
  ).toBeVisible();
  const order = await page.evaluate(() => {
    const theory = document.getElementById("types-before-inference");
    const examples = document.getElementById("worked-examples");
    return (
      !!theory &&
      !!examples &&
      !!(
        theory.compareDocumentPosition(examples) &
        Node.DOCUMENT_POSITION_FOLLOWING
      )
    );
  });
  expect(order).toBe(true);
  await expect(page.locator("#constants-and-change")).toContainText(
    "The useful question is not",
  );
  await expect(page.locator("#aliases-and-returning")).toContainText("Void");
  await page.getByRole("link", { name: "3 teaching references" }).click();
  await expect(page.locator("#teaching-sources")).toContainText("SE-0102");
  await expect(page.locator("#teaching-sources .chip.green")).toHaveCount(3);
  await page
    .getByText("Original syllabus items and checkpoints", { exact: true })
    .click();
  await expect(page.locator(".inventory-list a")).toHaveCount(18);
  await page
    .getByRole("button", { name: "Switch language", exact: true })
    .click();
  await expect(page.locator("#types-before-inference")).toContainText(
    "Inference təkrarı azaldır",
  );
});
test("UIKit and SwiftUI lessons start with explanations and mark source limits", async ({
  page,
}) => {
  await page.goto(path("/learn/topic-13/"));
  await expect(
    page.getByRole("heading", {
      name: "What is UIKit, and what problem does a UI framework solve?",
    }),
  ).toBeVisible();
  await expect(page.locator("#uikit-controller-lifecycle")).toContainText(
    "Loaded",
  );
  await expect(page.locator("#teaching-sources")).toContainText(
    "Reading link · not retrieved",
  );
  await expect(page.locator("#teaching-sources")).toContainText(
    "Lighter View Controllers (2013)",
  );
  await page.goto(path("/learn/topic-33/"));
  await expect(
    page.getByRole("heading", {
      name: "The problem: keeping the interface consistent with changing data",
    }),
  ).toBeVisible();
  await expect(page.locator("#swiftui-view-body")).toContainText(
    "A body is a computed property",
  );
  await expect(page.locator("#teaching-sources")).toContainText("SE-0395");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
