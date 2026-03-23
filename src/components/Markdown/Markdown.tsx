import styles from "./Markdown.module.css";

export interface MarkdownProps {
  content: string;
  className?: string;
}

function parseInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, '<code style="background:var(--bg-base-pressed);padding:1px 4px;border-radius:3px;font-size:0.9em">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:var(--fg-info);text-decoration:underline">$1</a>');
}

function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  let html = "";
  let inList = false;
  let inTable = false;
  let tableHeaderDone = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("### ")) {
      if (inList) { html += "</ul>"; inList = false; }
      if (inTable) { html += "</tbody></table>"; inTable = false; tableHeaderDone = false; }
      html += `<h3>${parseInline(line.slice(4))}</h3>`;
    } else if (line.startsWith("## ")) {
      if (inList) { html += "</ul>"; inList = false; }
      if (inTable) { html += "</tbody></table>"; inTable = false; tableHeaderDone = false; }
      html += `<h2>${parseInline(line.slice(3))}</h2>`;
    } else if (line.startsWith("# ")) {
      if (inList) { html += "</ul>"; inList = false; }
      if (inTable) { html += "</tbody></table>"; inTable = false; tableHeaderDone = false; }
      html += `<h1>${parseInline(line.slice(2))}</h1>`;
    } else if (line.startsWith("- [ ] ") || line.startsWith("- [x] ")) {
      if (!inList) { html += "<ul>"; inList = true; }
      const checked = line.startsWith("- [x] ");
      const text = line.slice(6);
      html += `<li style="list-style:none"><input type="checkbox" disabled ${checked ? "checked" : ""}/> ${parseInline(text)}</li>`;
    } else if (/^[-*] /.test(line)) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${parseInline(line.slice(2))}</li>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList) { html += "<ol>"; inList = true; }
      html += `<li>${parseInline(line.replace(/^\d+\.\s/, ""))}</li>`;
    } else if (line.startsWith("|") && line.endsWith("|")) {
      if (inList) { html += "</ul>"; inList = false; }
      const cells = line.split("|").slice(1, -1).map(c => c.trim());
      if (cells.every(c => /^[-:]+$/.test(c))) {
        tableHeaderDone = true;
        continue;
      }
      if (!inTable) {
        html += "<table><thead><tr>";
        cells.forEach(c => { html += `<th>${parseInline(c)}</th>`; });
        html += "</tr></thead><tbody>";
        inTable = true;
      } else {
        html += "<tr>";
        cells.forEach(c => { html += `<td>${parseInline(c)}</td>`; });
        html += "</tr>";
      }
    } else if (line.trim() === "") {
      if (inList) { html += "</ul>"; inList = false; }
      if (inTable) { html += "</tbody></table>"; inTable = false; tableHeaderDone = false; }
    } else {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<p>${parseInline(line)}</p>`;
    }
  }
  if (inList) html += "</ul>";
  if (inTable) html += "</tbody></table>";
  return html;
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div
      className={`${styles.markdown} ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}
