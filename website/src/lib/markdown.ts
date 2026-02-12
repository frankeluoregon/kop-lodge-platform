/**
 * Server-side Markdown → HTML renderer.
 * Uses a minimal implementation to avoid heavy bundle size on Cloudflare Workers.
 */

export function renderMarkdown(md: string): string {
  return (
    md
      // Headings
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      // Bold / italic
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      // Horizontal rule
      .replace(/^---$/gm, "<hr>")
      // Unordered lists (simple, single-level)
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/(<li>[\s\S]+?<\/li>)(?!\s*<li>)/g, "<ul>$1</ul>")
      // Paragraphs (blank-line-separated blocks that aren't already HTML)
      .split(/\n{2,}/)
      .map((block) => {
        block = block.trim();
        if (!block) return "";
        if (/^<[a-z]/.test(block)) return block;
        return `<p>${block.replace(/\n/g, "<br>")}</p>`;
      })
      .join("\n")
  );
}
