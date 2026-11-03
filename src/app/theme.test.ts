import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC_DIR = join(process.cwd(), "src");
const GLOBALS_CSS = readFileSync(join(SRC_DIR, "app/globals.css"), "utf8");
const AA_TEXT = 4.5;
const AA_NON_TEXT = 3;

type Tokens = Record<string, string>;

function readTokens(block: string): Tokens {
  return Object.fromEntries(
    [...block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map(([, name, hex]) => [name, hex]),
  );
}

const lightTokens = readTokens(GLOBALS_CSS.split("@theme")[0]);
const darkTokens = readTokens(GLOBALS_CSS.split("prefers-color-scheme: dark")[1] ?? "");

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

/** [foreground token, background token, minimum ratio, where it is used] */
const PAIRS: [string, string, number, string][] = [
  ["foreground", "background", AA_TEXT, "body text"],
  ["foreground", "card", AA_TEXT, "card text"],
  ["foreground", "surface", AA_TEXT, "quiet panel text"],
  ["muted", "background", AA_TEXT, "secondary text"],
  ["muted", "card", AA_TEXT, "secondary text on cards"],
  ["accent", "background", AA_TEXT, "links"],
  ["accent", "card", AA_TEXT, "links on cards"],
  ["accent-foreground", "accent", AA_TEXT, "slate button label"],
  ["danger", "background", AA_TEXT, "field errors"],
  ["danger", "card", AA_TEXT, "errors on cards"],
  ["band-foreground", "band", AA_TEXT, "band title"],
  ["band-muted", "band", AA_TEXT, "band subtitle"],
  ["band-cta-foreground", "band-cta", AA_TEXT, "tan button label"],
  ["band-cta", "band", AA_NON_TEXT, "logo and band focus ring"],
  ["accent", "background", AA_NON_TEXT, "focus ring"],
];

describe.each([
  ["light", lightTokens],
  ["dark", darkTokens],
])("%s theme contrast", (_mode, tokens) => {
  it.each(PAIRS)("%s on %s meets %s:1 (%s)", (fg, bg, minimum) => {
    expect(tokens[fg], `missing token --${fg}`).toBeDefined();
    expect(tokens[bg], `missing token --${bg}`).toBeDefined();
    expect(contrastRatio(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(minimum);
  });
});

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(tsx?|css)$/.test(name) && !name.endsWith(".test.ts") && !name.endsWith(".test.tsx") ? [path] : [];
  });
}

describe("theme tokens", () => {
  it("defines every colour in globals.css only", () => {
    const filesWithHex = sourceFiles(SRC_DIR)
      .filter((path) => !path.endsWith(join("app", "globals.css")))
      .filter((path) => /#[0-9a-fA-F]{3,8}\b/.test(readFileSync(path, "utf8")));

    expect(filesWithHex).toEqual([]);
  });

  it("defines the same tokens for light and dark", () => {
    expect(Object.keys(darkTokens).sort()).toEqual(Object.keys(lightTokens).sort());
  });
});
