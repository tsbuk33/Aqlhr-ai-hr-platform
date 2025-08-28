import * as XLSX from 'xlsx';

export type ParsedSheet = { header: string[]; rows: Record<string, any>[]; sheetName: string };

export function parseExcelFile(file: File): Promise<ParsedSheet[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = new Uint8Array(reader.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const out: ParsedSheet[] = [];
        for (const sheetName of wb.SheetNames) {
          const ws = wb.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }) as any[][];
          if (!json.length) continue;
          const [header, ...body] = json;
          const headerNorm = (header || []).map((h) => String(h || '').trim());
          const rows = body.map((r) => {
            const obj: Record<string, any> = {};
            headerNorm.forEach((h, i) => (obj[h] = r[i]));
            return obj;
          });
          out.push({ header: headerNorm, rows, sheetName });
        }
        resolve(out);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}