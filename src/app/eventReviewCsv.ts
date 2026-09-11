export interface CsvDocument {
  headers: string[];
  rows: string[][];
}

export function parseCsv(csv: string): CsvDocument {
  const records = parseRecords(csv);
  const [headers = [], ...rows] = records;

  return { headers, rows };
}

export function serializeCsv(document: CsvDocument): string {
  return [document.headers, ...document.rows]
    .map((record) => record.map(escapeCell).join(","))
    .join("\r\n");
}

function parseRecords(csv: string): string[][] {
  const records: string[][] = [];
  let cell = "";
  let inQuotes = false;
  let record: string[] = [];

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (character === '"') {
      if (inQuotes && csv[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (character === "," && !inQuotes) {
      record.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && csv[index + 1] === "\n") {
        index += 1;
      }

      record.push(cell);
      records.push(record);
      cell = "";
      record = [];
    } else {
      cell += character;
    }
  }

  if (cell || record.length > 0) {
    record.push(cell);
    records.push(record);
  }

  return records;
}

function escapeCell(cell: string): string {
  return /[",\r\n]/.test(cell) ? `"${cell.replaceAll('"', '""')}"` : cell;
}
