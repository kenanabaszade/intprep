import { it, expect } from "vitest";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  symlinkSync,
  rmSync,
  existsSync,
} from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
it("indexes imports and exact authors without changing input or reading symlink escapes", () => {
  const temp = mkdtempSync(join(tmpdir(), "academy-index-"));
  const root = join(temp, "repo");
  mkdirSync(root);
  const script = resolve("scripts/index-repository.mjs");
  const git = (...args: string[]) =>
    execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();
  try {
    git("init", "-q");
    git("config", "user.name", "Fixture Developer");
    git("config", "user.email", "fixture@example.test");
    mkdirSync(join(root, "Feature"));
    mkdirSync(join(root, "Core"));
    writeFileSync(
      join(root, "Feature/View.swift"),
      "import Core\nstruct View {}\n",
    );
    writeFileSync(join(root, "Core/Model.swift"), "struct Model {}\n");
    writeFileSync(join(temp, "Secret.swift"), 'let SECRET = "never export"');
    symlinkSync(join(temp, "Secret.swift"), join(root, "Feature/Escape.swift"));
    git("add", ".");
    git("commit", "-qm", "Fixture feature");
    const before = git("status", "--porcelain=v1");
    const output = join(temp, "snapshot.json");
    execFileSync("node", [script, "--root", root, "--out", output], {
      encoding: "utf8",
    });
    const json = readFileSync(output, "utf8");
    const snapshot = JSON.parse(json);
    expect(snapshot.files).toHaveLength(2);
    expect(json).not.toContain("never export");
    expect(
      snapshot.modules.find((m: { id: string }) => m.id === "Feature")
        .dependencies,
    ).toEqual(["Core"]);
    expect(snapshot.contributions[0].authorEmail).toBe("fixture@example.test");
    expect(git("status", "--porcelain=v1")).toBe(before);
    expect(readFileSync(join(root, "Feature/View.swift"), "utf8")).toBe(
      "import Core\nstruct View {}\n",
    );
    const bad = spawnSync(
      "node",
      [script, "--root", root, "--out", join(root, "unsafe.json")],
      { encoding: "utf8" },
    );
    expect(bad.status).not.toBe(0);
    expect(existsSync(join(root, "unsafe.json"))).toBe(false);
    const overwrite = spawnSync(
      "node",
      [script, "--root", root, "--out", output],
      { encoding: "utf8" },
    );
    expect(overwrite.status).not.toBe(0);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
