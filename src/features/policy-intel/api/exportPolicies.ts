import { supabase } from '@/lib/supabase'

export interface ExportOptions {
  format: 'csv' | 'xlsx'
  lang?: 'en' | 'ar'
  from?: string
  to?: string
  ids?: string[]
}

export async function exportPolicies(options: ExportOptions): Promise<void> {
  try {
    const { format, lang = 'en', from, to, ids } = options

    const { data, error } = await supabase.functions.invoke('policy-risk-export-v1', {
      method: 'POST',
      body: {
        format,
        lang,
        from,
        to,
        ids
      }
    })

    if (error) {
      console.error('Export error:', error)
      throw new Error(`Export failed: ${error.message}`)
    }

    if (format === 'csv') {
      // For CSV, the response is already the file content
      const blob = new Blob([data], { type: 'text/csv; charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `policy-risk-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      // For XLSX, use the returned data with SheetJS
      const ExcelJS = await import('exceljs')
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Policy Risk Export')

      if (data.data && data.data.length > 0) {
        const headers = Object.keys(data.data[0])
        
        // Add headers
        const headerRow = worksheet.addRow(headers)
        headerRow.font = { bold: true }
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE0E0E0' }
        }

        // Add data rows
        data.data.forEach((row: any) => {
          const rowValues = headers.map(header => row[header])
          worksheet.addRow(rowValues)
        })

        // Auto-size columns
        worksheet.columns.forEach(column => {
          let maxLength = 0
          if (column.eachCell) {
            column.eachCell({ includeEmpty: true }, (cell: any) => {
              const columnLength = cell.value ? cell.value.toString().length : 10
              if (columnLength > maxLength) {
                maxLength = columnLength
              }
            })
          }
          column.width = Math.min(maxLength + 2, 50)
        })
      }

      // Generate and download the Excel file
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `policy-risk-export-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

  } catch (error) {
    console.error('Unexpected error in exportPolicies:', error)
    throw error instanceof Error ? error : new Error('Export failed')
  }
}

// Utility function to export a single row
export async function exportSinglePolicy(
  policyId: string, 
  format: 'csv' | 'xlsx', 
  lang: 'en' | 'ar' = 'en'
): Promise<void> {
  return exportPolicies({
    format,
    lang,
    ids: [policyId]
  })
}

// Utility function to export filtered results
export async function exportFilteredPolicies(
  format: 'csv' | 'xlsx',
  lang: 'en' | 'ar' = 'en',
  filters?: {
    from?: string
    to?: string
    q?: string
  }
): Promise<void> {
  return exportPolicies({
    format,
    lang,
    from: filters?.from,
    to: filters?.to
  })
}

// Hook for React components with loading state
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useExportPolicies() {
  return useMutation({
    mutationFn: exportPolicies,
    onSuccess: () => {
      toast.success('Export completed successfully')
    },
    onError: (error: Error) => {
      console.error('Export failed:', error)
      toast.error(`Export failed: ${error.message}`)
    }
  })
}

export function useExportSinglePolicy() {
  return useMutation({
    mutationFn: ({ policyId, format, lang }: { 
      policyId: string, 
      format: 'csv' | 'xlsx', 
      lang?: 'en' | 'ar' 
    }) => exportSinglePolicy(policyId, format, lang),
    onSuccess: () => {
      toast.success('Policy exported successfully')
    },
    onError: (error: Error) => {
      console.error('Export failed:', error)
      toast.error(`Export failed: ${error.message}`)
    }
  })
}