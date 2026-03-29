/**
 * Client-side file downloads (CSV / JSON) for dashboard export actions.
 */

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  downloadBlob(blob, filename.endsWith(".json") ? filename : `${filename}.json`);
}

function csvCell(v: unknown): string {
  if (v == null || v === "") return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

function escapeCsvField(s: string): string {
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Flat rows; values are stringified. Omits columns with no keys if rows empty. */
export function downloadCsv(
  filename: string,
  rows: Array<Record<string, unknown>>,
  columns?: string[]
) {
  const keys =
    columns && columns.length
      ? columns
      : rows.length
        ? Object.keys(rows[0])
        : [];
  const header = keys.map((k) => escapeCsvField(k)).join(",");
  const lines = rows.map((row) =>
    keys.map((k) => escapeCsvField(csvCell(row[k]))).join(",")
  );
  const csv = [header, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename.endsWith(".csv") ? filename : `${filename}.csv`);
}
