import React, { useMemo, useState } from 'react';
import { ParsedSheet } from '@/lib/data/parseExcel';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

type Mode = 'gov' | 'employee';

export default function ExcelMapperModal({
  open,
  onClose,
  data,
  mode,
  onImport
}: {
  open: boolean;
  onClose: () => void;
  data: ParsedSheet[];
  mode: Mode;
  onImport?: (payload: { rows: Record<string, any>[], mode: Mode }) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [sheetIdx, setSheetIdx] = useState(0);
  const sheet = data[sheetIdx];

  const columns = sheet?.header || [];
  const [map, setMap] = useState<Record<string, string>>({});

  const suggestions = useMemo(() => {
    // naive suggestions
    const map: Record<string, string> = {};
    for (const c of columns) {
      const lower = c.toLowerCase();
      if (mode === 'gov') {
        if (lower.includes('ref')) map[c] = 'ref_id';
        else if (lower.includes('type')) map[c] = 'doc_type';
        else if (lower.includes('expire') || lower.includes('end')) map[c] = 'expires_on';
        else if (lower.includes('note')) map[c] = 'notes';
      } else {
        if (lower.includes('name')) map[c] = 'name';
        else if (lower.includes('iqama') || lower.includes('resid')) map[c] = 'iqama';
        else if (lower.includes('national')) map[c] = 'nationality';
        else if (lower.includes('gender')) map[c] = 'gender';
      }
    }
    return map;
  }, [columns, mode]);

  function applySuggestions() {
    setMap(suggestions);
  }

  function exportCsv() {
    const rows = sheet.rows.map((r) => {
      const out: Record<string, any> = {};
      for (const c of columns) {
        const k = map[c];
        if (k) out[k] = r[c];
      }
      return out;
    });
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'gov' ? 'gov-docs-mapped.csv' : 'employees-mapped.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importServer() {
    const rows = sheet.rows.map((r) => {
      const out: Record<string, any> = {};
      for (const c of columns) {
        const k = map[c];
        if (k) out[k] = r[c];
      }
      return out;
    });
    if (!onImport) return;
    await onImport({ rows, mode });
  }

  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <Card className="w-[900px] max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {mode === 'gov' ? 'Map Government Document Columns' : 'Map Employee Columns'}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sheet Selection */}
          <div className="flex gap-3 items-center">
            <span className="text-sm font-medium">Sheet:</span>
            <Select value={sheetIdx.toString()} onValueChange={(value) => setSheetIdx(Number(value))}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {data.map((s, i) => (
                  <SelectItem key={s.sheetName} value={i.toString()}>
                    {s.sheetName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={applySuggestions} className="ml-auto">
              Auto‑Map
            </Button>
          </div>

          {/* Column Mapping */}
          <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
            {columns.map((c) => (
              <div key={c} className="flex gap-2 items-center">
                <div className="w-1/2 truncate text-sm font-medium">{c}</div>
                <Select 
                  value={map[c] || ''}
                  onValueChange={(value) => setMap((m) => ({ ...m, [c]: value }))}
                >
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">—</SelectItem>
                    {mode === 'gov' ? (
                      <>
                        <SelectItem value="doc_type">doc_type</SelectItem>
                        <SelectItem value="ref_id">ref_id</SelectItem>
                        <SelectItem value="expires_on">expires_on</SelectItem>
                        <SelectItem value="notes">notes</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="name">name</SelectItem>
                        <SelectItem value="iqama">iqama</SelectItem>
                        <SelectItem value="nationality">nationality</SelectItem>
                        <SelectItem value="gender">gender</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={exportCsv}>
              Export CSV
            </Button>
            {onImport && (
              <Button onClick={importServer}>
                Import to Server
              </Button>
            )}
            <Button onClick={onClose}>
              {t('documents.uploader.save')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function toCSV(rows: Record<string, any>[]): string {
  if (!rows.length) return '';
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const lines = [cols.join(',')];
  for (const r of rows) {
    lines.push(cols.map((c) => escapeCsv(r[c])).join(','));
  }
  return lines.join('\n');
}

function escapeCsv(v: any) {
  if (v == null) return '';
  const s = String(v);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}