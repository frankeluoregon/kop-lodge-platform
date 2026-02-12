globalThis.process ??= {}; globalThis.process.env ??= {};
function renderMarkdown(md) {
  return md.replace(/^### (.+)$/gm, "<h3>$1</h3>").replace(/^## (.+)$/gm, "<h2>$1</h2>").replace(/^# (.+)$/gm, "<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>').replace(/^---$/gm, "<hr>").replace(/^- (.+)$/gm, "<li>$1</li>").replace(/(<li>[\s\S]+?<\/li>)(?!\s*<li>)/g, "<ul>$1</ul>").split(/\n{2,}/).map((block) => {
    block = block.trim();
    if (!block) return "";
    if (/^<[a-z]/.test(block)) return block;
    return `<p>${block.replace(/\n/g, "<br>")}</p>`;
  }).join("\n");
}

export { renderMarkdown as r };
