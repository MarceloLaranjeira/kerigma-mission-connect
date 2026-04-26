import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function escapeCsv(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function exportCSV(filename: string, columns: string[], rows: Array<Record<string, unknown>>) {
  const header = columns.join(",");
  const body = rows.map((r) => columns.map((c) => escapeCsv(r[c])).join(",")).join("\n");
  const csv = `\uFEFF${header}\n${body}`;
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), filename);
}

export function exportPDF(
  filename: string,
  title: string,
  columns: string[],
  rows: Array<Record<string, unknown>>,
  subtitle?: string
) {
  const doc = new jsPDF({ orientation: columns.length > 4 ? "landscape" : "portrait" });
  doc.setFontSize(14);
  doc.text(title, 14, 16);
  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(subtitle, 14, 22);
    doc.setTextColor(0);
  }
  autoTable(doc, {
    startY: subtitle ? 28 : 22,
    head: [columns],
    body: rows.map((r) => columns.map((c) => (r[c] ?? "") as string)),
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [37, 99, 235] },
  });
  doc.save(filename);
}