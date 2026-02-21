import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { join, basename, dirname } from "path";
import { tmpdir } from "os";

const CSS = `
  body {
    font-family: Georgia, serif;
    font-size: 14px;
    color: #111;
    margin: 0;
    padding: 0;
  }
  h1 {
    font-family: Georgia, serif;
    font-size: 20px;
    text-align: center;
    border-bottom: 2px solid #333;
    padding-bottom: 8px;
    margin-bottom: 20px;
  }
  h2 {
    font-family: Georgia, serif;
    font-size: 16px;
    border-bottom: 1px solid #aaa;
    margin-top: 18px;
    margin-bottom: 6px;
  }
  table {
    font-family: Georgia, serif;
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 10px;
  }
  td, th {
    font-family: Georgia, serif;
    border: 1px solid #ccc;
    padding: 4px 8px;
  }
  p, li, blockquote, pre, code, strong, em {
    font-family: Georgia, serif;
  }
`;

/**
 * Derive a human-readable title from the markdown filename.
 * e.g. "2026-02-26 - Helmet Lodge No. 33 - Agenda.md" → "2026-02-26 - Helmet Lodge No. 33 - Agenda"
 */
function titleFromPath(filePath: string): string {
  return basename(filePath).replace(/\.md$/i, "");
}

/**
 * Build a temp markdown file with YAML front matter (for md-to-pdf) and
 * an H1 title header, then return the temp file path.
 */
function buildTempMarkdown(
  sourceContent: string,
  title: string,
  cssPath: string,
): string {
  const tempMd = join(tmpdir(), `kop-agenda-${Date.now()}.md`);
  const frontMatter = [
    "---",
    `title: "${title.replace(/"/g, '\\"')}"`,
    "pdf_options:",
    "  format: Letter",
    "  margin: 20mm",
    `stylesheet: "${cssPath.replace(/\\/g, "/")}"`,
    "---",
    "",
    `# ${title}`,
    "",
  ].join("\n");

  writeFileSync(tempMd, frontMatter + sourceContent, "utf-8");
  return tempMd;
}

export function registerAgendaToPdfTool(server: McpServer) {
  server.tool(
    "agenda_to_pdf",
    "Convert a lodge agenda Markdown file to a formatted PDF. " +
      "The filename (without extension) is used as the page title/header. " +
      "Requires md-to-pdf to be installed globally (npm install -g md-to-pdf).",
    {
      md_path: z
        .string()
        .describe(
          "Absolute path to the agenda .md file, " +
            "e.g. 'C:\\\\Users\\\\rikfrankel\\\\kop-helmet33\\\\Minutes\\\\2026-02-26 - Helmet Lodge No. 33 - Agenda.md'",
        ),
      output_path: z
        .string()
        .optional()
        .describe(
          "Absolute path for the output PDF. " +
            "Defaults to the same directory and base name as the input file with a .pdf extension.",
        ),
    },
    async ({ md_path, output_path }) => {
      // ── Validate input ────────────────────────────────────────────────────
      if (!existsSync(md_path)) {
        return {
          content: [{ type: "text", text: `File not found: ${md_path}` }],
          isError: true,
        };
      }

      const title = titleFromPath(md_path);
      const resolvedOutput =
        output_path ?? join(dirname(md_path), `${title}.pdf`);

      // ── Write temp CSS ────────────────────────────────────────────────────
      const tempCss = join(tmpdir(), `kop-agenda-${Date.now()}.css`);
      writeFileSync(tempCss, CSS, "utf-8");

      // ── Build temp markdown with title header ─────────────────────────────
      const sourceContent = readFileSync(md_path, "utf-8");
      const tempMd = buildTempMarkdown(sourceContent, title, tempCss);
      const tempPdf = tempMd.replace(/\.md$/, ".pdf");

      try {
        // ── Run md-to-pdf ─────────────────────────────────────────────────
        execSync(`md-to-pdf "${tempMd}"`, { stdio: "pipe" });

        if (!existsSync(tempPdf)) {
          return {
            content: [
              {
                type: "text",
                text: "md-to-pdf ran but no PDF was produced. Is md-to-pdf installed? (npm install -g md-to-pdf)",
              },
            ],
            isError: true,
          };
        }

        // ── Move to final destination ─────────────────────────────────────
        const pdfBuffer = readFileSync(tempPdf);
        writeFileSync(resolvedOutput, pdfBuffer);

        const sizeKb = Math.round(pdfBuffer.length / 1024);
        return {
          content: [
            {
              type: "text",
              text: `PDF created (${sizeKb} KB): ${resolvedOutput}`,
            },
          ],
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text", text: `Conversion failed: ${message}` }],
          isError: true,
        };
      } finally {
        // ── Cleanup temp files ────────────────────────────────────────────
        for (const f of [tempMd, tempCss, tempPdf]) {
          try {
            if (existsSync(f)) unlinkSync(f);
          } catch {
            // best-effort cleanup
          }
        }
      }
    },
  );
}
