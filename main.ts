// Fortune in a Pot — one kind, funny fortune for the houseplant on the windowsill.
//
// The program writes the fortune, exactly as it is and with no trailing
// newline, to $MAKEFUN_OUTPUT_DIR/entry.txt (or /output/entry.txt when the
// variable is unset), then prints the same line followed by a newline.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const fortune =
  "The sun will visit your windowsill first tomorrow, and your keeper will water you early — a proud new leaf is coming.";

// The gate: entry.txt must be UTF-8 text of 1 to 120 characters.
const MAX_FORTUNE_CHARS = 120;
if (fortune.length === 0 || fortune.length > MAX_FORTUNE_CHARS) {
  console.error(
    `fortune must be 1 to ${MAX_FORTUNE_CHARS} characters, got ${fortune.length}`,
  );
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), fortune, "utf8");
process.stdout.write(`${fortune}\n`);
