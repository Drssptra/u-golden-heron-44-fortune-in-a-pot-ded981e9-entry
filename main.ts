// Fortune in a Pot — v2 resubmission (revise pass).
//
// This time the plant's fortune is a peace treaty: the cat has finally
// given up nibbling the leaves, so the windowsill belongs to the plant
// alone from now on. Nothing here reuses the v1 fortune — no sun, no
// early watering, no proud new leaf.
//
// Structure note (deliberately unlike the v1 build): the fortune is not
// a single string literal. It is assembled from short clauses, checked
// by a dedicated gate function that counts Unicode code points, and
// written to disk through a small writer class. The entry text itself
// is exactly the v2 text from the resubmission brief.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The fortune's clauses, in reading order. Joined with one space each,
// they form exactly the v2 entry text — em dash included.
const CLAUSES: readonly string[] = [
  "The cat has finally decided",
  "your lovely leaves are off the menu —",
  "from now on, you reign over the",
  "windowsill in peace.",
];

const GATE_MIN_CHARS = 1;
const GATE_MAX_CHARS = 120;

function assembleFortune(clauses: readonly string[]): string {
  const parts = clauses.filter((clause) => clause.length > 0);
  if (parts.length !== clauses.length) {
    throw new Error("fortune clauses must not be empty");
  }
  return parts.join(" ");
}

function gateCheck(text: string): number {
  const chars = [...text].length;
  if (chars < GATE_MIN_CHARS || chars > GATE_MAX_CHARS) {
    throw new Error(
      `fortune must be ${GATE_MIN_CHARS} to ${GATE_MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (text.trim() !== text) {
    throw new Error("fortune must not start or end with whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("fortune must be a single line");
  }
  return chars;
}

class EntryWriter {
  private readonly dir: string;

  constructor(dir: string) {
    this.dir = dir;
  }

  write(text: string): string {
    mkdirSync(this.dir, { recursive: true });
    const target = join(this.dir, "entry.txt");
    writeFileSync(target, text, "utf8");
    return target;
  }
}

function resolveOutputDir(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR;
  return dir !== undefined && dir !== "" ? dir : "/output";
}

function main(): void {
  const fortune = assembleFortune(CLAUSES);
  const chars = gateCheck(fortune);
  const bytes = Buffer.byteLength(fortune, "utf8");
  const target = new EntryWriter(resolveOutputDir()).write(fortune);
  // stdout may carry the entry plus a newline; entry.txt itself has none.
  console.log(fortune);
  console.error(`wrote ${target} (${chars} chars, ${bytes} bytes)`);
}

main();
