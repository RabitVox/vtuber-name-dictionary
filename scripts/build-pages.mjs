import fs from "node:fs";
import path from "node:path";

const TSV_DIR = "tsv";
const OUTPUT_DIR = "web/data";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "dictionary.json");

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const files = fs
    .readdirSync(TSV_DIR)
    .filter(file => file.endsWith(".tsv"));

const entries = [];

for (const file of files) {
    const filePath = path.join(TSV_DIR, file);
    const text = fs.readFileSync(filePath, "utf8");

    const lines = text.split(/\r?\n/);

    for (const line of lines) {
        if (!line.trim()) {
            continue;
        }

        const columns = line.split("\t");

        if (columns.length < 2) {
            continue;
        }

        entries.push({
            reading: columns[0],
            name: columns[1]
        });
    }
}

fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(entries, null, 2),
    "utf8"
);

console.log(`Generated ${entries.length} entries.`);