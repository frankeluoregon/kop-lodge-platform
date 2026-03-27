#!/usr/bin/env node
/**
 * Push meeting minutes from vault (kop-helmet33/Minutes/) to D1 database.
 * Usage:
 *   node push-minutes.js              — pushes most recent minutes file
 *   node push-minutes.js --list       — list available files and select
 *   node push-minutes.js <filename>   — push specific file
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const VAULT_DIR = path.join(__dirname, "kop-helmet33", "Minutes");
const LODGE_SLUG = "helmet33";
const DB_NAME = "kop-lodge-platform";

// Find all .md minutes files (not agendas)
function getMinutesFiles() {
  return fs.readdirSync(VAULT_DIR)
    .filter(f => f.endsWith(".md") && f.includes("Meeting Minutes"))
    .sort()
    .reverse(); // newest first
}

// Parse frontmatter and content from .md file
function parseMinutes(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return { date: null, title: null, content: raw };

  const fm = fmMatch[1];
  const content = fmMatch[2].trim();

  // Extract date from frontmatter
  const dateMatch = fm.match(/meeting_date:\s*(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : null;

  // Extract title from first heading or filename
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].replace(/\*\*/g, "") : null;

  // Strip obsidian image embeds like ![[gavel.png]]
  const cleaned = content.replace(/!\[\[.*?\]\]\n*/g, "").trim();

  return { date, title, content: cleaned };
}

function pushToD1(date, title, content) {
  // Escape single quotes for SQL
  const esc = (s) => s.replace(/'/g, "''");
  const sql = `INSERT INTO meeting_minutes (lodge_id, meeting_date, title, content, published) VALUES ((SELECT id FROM lodges WHERE slug='${LODGE_SLUG}'), '${esc(date)}', '${esc(title || "")}', '${esc(content)}', 1);`;

  const tmpFile = path.join(__dirname, ".tmp-minutes.sql");
  fs.writeFileSync(tmpFile, sql);
  try {
    const out = execSync(`npx wrangler d1 execute ${DB_NAME} --remote --file=${tmpFile}`, {
      encoding: "utf-8",
      timeout: 30000,
    });
    console.log("Pushed successfully!");
    // Check for error in output
    if (out.includes("ERROR")) {
      console.error(out);
    } else {
      console.log(`  Date: ${date}`);
      console.log(`  Title: ${title}`);
    }
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

async function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const files = getMinutesFiles();

  if (files.length === 0) {
    console.log("No minutes files found in", VAULT_DIR);
    process.exit(1);
  }

  let chosen;

  if (args[0] === "--list") {
    console.log("\nAvailable minutes files:\n");
    files.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
    const answer = await prompt("\nEnter number to push (or 'q' to quit): ");
    if (answer === "q") process.exit(0);
    const idx = parseInt(answer, 10) - 1;
    if (idx < 0 || idx >= files.length) {
      console.log("Invalid selection.");
      process.exit(1);
    }
    chosen = files[idx];
  } else if (args[0]) {
    // Specific filename
    chosen = files.find(f => f.includes(args[0]));
    if (!chosen) {
      console.log(`No minutes file matching "${args[0]}"`);
      process.exit(1);
    }
  } else {
    // Most recent
    chosen = files[0];
    console.log(`Most recent: ${chosen}`);
    const answer = await prompt("Push this file? (y/n): ");
    if (answer.toLowerCase() !== "y") process.exit(0);
  }

  console.log(`\nPushing: ${chosen}`);
  const filePath = path.join(VAULT_DIR, chosen);
  const { date, title, content } = parseMinutes(filePath);

  if (!date) {
    console.error("Could not parse meeting_date from frontmatter.");
    process.exit(1);
  }

  pushToD1(date, title, content);
}

main().catch(console.error);
