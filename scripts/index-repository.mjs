#!/usr/bin/env node
// Explicitly local, read-only input adapter. Never fetches, modifies Git, or exports source text.
import {
  realpath,
  readdir,
  lstat,
  readFile,
  writeFile,
} from "node:fs/promises";
import {
  resolve,
  relative,
  dirname,
  basename,
  extname,
  isAbsolute,
  sep,
} from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const args = process.argv.slice(2);
const get = (name) => {
  const i = args.indexOf(name);
  return i < 0 ? undefined : args[i + 1];
};
if (args.includes("--help")) {
  console.log(
    "node scripts/index-repository.mjs --root /explicit/repository --out /outside/repository/index.json [--author exact@email] [--max-commits 200]",
  );
  process.exit(0);
}
async function main() {
  if (!get("--root") || !get("--out"))
    throw new Error(
      "--root and --out are required. Output must be outside the source repository.",
    );
  const root = await realpath(resolve(get("--root")));
  const outArg = resolve(get("--out"));
  const parent = await realpath(dirname(outArg));
  const out = resolve(parent, basename(outArg));
  const inside = (base, path) => {
    const rel = relative(base, path);
    return (
      !rel || (!rel.startsWith(".." + sep) && rel !== ".." && !isAbsolute(rel))
    );
  };
  if (inside(root, out))
    throw new Error("Output inside the source repository is forbidden.");
  const git = (argv) =>
    execFileSync("git", ["--no-optional-locks", "-C", root, ...argv], {
      encoding: "utf8",
      maxBuffer: 20 * 1024 * 1024,
      env: { ...process.env, GIT_OPTIONAL_LOCKS: "0" },
    }).trim();
  if ((await realpath(git(["rev-parse", "--show-toplevel"]))) !== root)
    throw new Error("--root must be the actual Git checkout root.");
  const before = git(["status", "--porcelain=v1", "--untracked-files=all"]);
  const head = git(["rev-parse", "--verify", "HEAD^{commit}"]);
  const skip = new Set([
    ".git",
    ".build",
    ".swiftpm",
    "Pods",
    "Carthage",
    "DerivedData",
    "node_modules",
    ".academy-private",
    "vendor",
    "build",
  ]);
  const files = [];
  let skippedSymlinks = 0;
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (skip.has(entry.name) || entry.name.startsWith(".")) continue;
      const path = resolve(dir, entry.name);
      const stat = await lstat(path);
      if (stat.isSymbolicLink()) {
        skippedSymlinks++;
        continue;
      }
      if (stat.isDirectory()) {
        await walk(path);
        continue;
      }
      if (!stat.isFile() || extname(path) !== ".swift" || stat.size > 2_000_000)
        continue;
      if (files.length >= 30000)
        throw new Error(
          "Index exceeds 30,000 Swift files; narrow the repository adapter scope.",
        );
      const text = await readFile(path, "utf8");
      const imports = Array.from(
        text.matchAll(
          /^\s*(?:@(?:preconcurrency|testable|_exported)\s+)?import\s+(?:(?:class|struct|enum|protocol|func|var|let|typealias)\s+)?([A-Za-z_][A-Za-z0-9_]*)/gm,
        ),
        (m) => m[1],
      );
      const declarations = Array.from(
        text.matchAll(
          /^\s*(?:(?:public|internal|private|fileprivate|open|final|indirect|nonisolated|distributed)\s+)*(?:struct|class|enum|protocol|actor)\s+([A-Za-z_][A-Za-z0-9_]*)/gm,
        ),
        (m) => m[1],
      ).slice(0, 1000);
      files.push({
        path: relative(root, path).split(sep).join("/"),
        hash: createHash("sha256").update(text).digest("hex"),
        lines: text.split("\n").length,
        imports: [...new Set(imports)].slice(0, 500),
        declarations,
      });
    }
  }
  await walk(root);
  files.sort((a, b) => a.path.localeCompare(b.path));
  const knownImports = new Set(files.flatMap((f) => f.imports));
  const groups = new Map();
  for (const file of files) {
    const parts = file.path.split("/").slice(0, -1);
    const id = parts.find((p) => knownImports.has(p)) || parts[0] || "App";
    if (!groups.has(id)) groups.set(id, { id, files: [], dependencies: [] });
    groups.get(id).files.push(file.path);
  }
  for (const group of groups.values()) {
    const owned = new Set(group.files);
    group.dependencies = [
      ...new Set(
        files
          .filter((f) => owned.has(f.path))
          .flatMap((f) => f.imports)
          .filter((i) => i !== group.id && groups.has(i)),
      ),
    ].sort();
  }
  const max = Math.min(1000, Math.max(1, Number(get("--max-commits") || 200)));
  if (!Number.isFinite(max)) throw new Error("Invalid --max-commits.");
  const log = git([
    "log",
    `-${max}`,
    "--no-merges",
    "--format=%H%x1f%an%x1f%ae%x1f%aI%x1f%s",
  ]);
  const author = get("--author");
  const contributions = [];
  for (const line of log.split("\n").filter(Boolean)) {
    const [commit, authorName, authorEmail, date, ...subjects] =
      line.split("\x1f");
    if (author && authorEmail !== author) continue;
    const paths = git([
      "diff-tree",
      "--root",
      "--no-commit-id",
      "--name-only",
      "-r",
      commit,
      "--",
      "*.swift",
    ])
      .split("\n")
      .filter(Boolean);
    contributions.push({
      commit,
      authorName,
      authorEmail,
      date,
      subject: subjects.join(" "),
      files: paths,
    });
  }
  const after = git(["status", "--porcelain=v1", "--untracked-files=all"]);
  if (before !== after)
    throw new Error(
      "Repository changed during indexing; no snapshot written. Rerun when stable.",
    );
  const snapshot = {
    schemaVersion: 1,
    repository: basename(root),
    head,
    generatedAt: new Date().toISOString(),
    files,
    modules: [...groups.values()].sort((a, b) => a.id.localeCompare(b.id)),
    contributions,
    ...(author ? { authorFilter: author } : {}),
  };
  await writeFile(out, JSON.stringify(snapshot, null, 2) + "\n", {
    encoding: "utf8",
    flag: "wx",
    mode: 0o600,
  });
  console.log(
    `Wrote private metadata snapshot: ${files.length} Swift files, ${groups.size} directory groups, ${contributions.length} non-merge commits. Skipped ${skippedSymlinks} symlinks. Input Git status unchanged. Module edges are heuristic import relationships, not a resolved build graph. Keep this file local; import it through Settings. Source contents were not exported.`,
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
