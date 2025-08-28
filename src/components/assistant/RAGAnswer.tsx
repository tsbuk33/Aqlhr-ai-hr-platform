import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRAGStream, type Citation } from '../../hooks/useRAGStream';
import { supabase } from '../../lib/supabase';
import { FileText, Download, ExternalLink, Loader2, Send, Copy, Check, AlertCircle, Calendar, Tag, Globe } from 'lucide-react';

interface RAGAnswerProps {
  className?: string;
}

export function RAGAnswer({ className = '' }: RAGAnswerProps) {
  const { t, i18n } = useTranslation();
  const [question, setQuestion] = useState('');
  const [copied, setCopied] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  
  const { citations, text, running, askQuestion, abortStream } = useRAGStream();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isRtl = i18n.language === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || running) return;
    
    askQuestion(question.trim());
    setQuestion('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !running) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopyAnswer = async () => {
    if (!text.trim()) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleExportCsv = async () => {
    if (!citations.length) return;
    
    setExportingCsv(true);
    try {
      const headers = [
        t('rag.export.citation'),
        t('rag.export.title'), 
        t('rag.export.portal'),
        t('rag.export.type'),
        t('rag.export.date')
      ];
      
      const rows = citations.map(citation => [
        `[${citation.n}]`,
        citation.title,
        citation.portal || '',
        citation.doc_type || '',
        new Date(citation.created_at).toLocaleDateString(i18n.language)
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `rag-citations-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export failed:', error);
    } finally {
      setExportingCsv(false);
    }
  };

  const handleExportPdf = async () => {
    if (!text.trim() && !citations.length) return;
    
    setExportingPdf(true);
    try {
      // Use browser's print functionality for PDF export
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      
      const css = `
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
          .answer { margin: 20px 0; white-space: pre-wrap; }
          .citations { margin-top: 30px; }
          .citation { margin: 10px 0; padding: 10px; border-left: 3px solid #3b82f6; background: #f8fafc; }
          .citation-number { font-weight: bold; color: #3b82f6; }
          .citation-title { font-weight: 600; }
          .citation-meta { font-size: 0.875rem; color: #6b7280; }
          @media print { body { padding: 0; } }
          ${isRtl ? 'body { direction: rtl; text-align: right; }' : ''}
        </style>
      `;
      
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${t('rag.export.pdfTitle')}</title>
          ${css}
        </head>
        <body>
          <h1>${t('rag.export.pdfTitle')}</h1>
          
          ${text.trim() ? `
            <h2>${t('rag.answer')}</h2>
            <div class="answer">${text}</div>
          ` : ''}
          
          ${citations.length ? `
            <h2>${t('rag.citations')} (${citations.length})</h2>
            <div class="citations">
              ${citations.map(citation => `
                <div class="citation">
                  <div class="citation-number">[${citation.n}]</div>
                  <div class="citation-title">${citation.title}</div>
                  <div class="citation-meta">
                    ${citation.portal ? `${t('rag.portal')}: ${citation.portal} • ` : ''}
                    ${citation.doc_type ? `${t('rag.type')}: ${citation.doc_type} • ` : ''}
                    ${t('rag.date')}: ${new Date(citation.created_at).toLocaleDateString(i18n.language)}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
        </html>
      `;
      
      printWindow.document.write(content);
      printWindow.document.close();
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setExportingPdf(false);
    }
  };

  const handleViewDocument = async (citation: Citation) => {
    try {
      const { data, error } = await supabase.functions.invoke('doc-sign-url-v1', {
        body: { doc_id: citation.doc_id }
      });
      
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Failed to get document URL:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(i18n.language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const highlightCitations = (text: string) => {
    return text.replace(/\[(\d+)\]/g, (match, num) => {
      const citation = citations.find(c => c.n === parseInt(num));
      const color = citation ? '#3b82f6' : '#6b7280';
      return `<span style="color: ${color}; font-weight: 600; cursor: pointer;" title="${citation?.title || ''}">${match}</span>`;
    });
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="flex-none p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {t('rag.title', 'Ask with Evidence')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('rag.subtitle', 'Get answers backed by your uploaded documents')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Answer Section */}
        <div className="flex-1 flex flex-col">
          {/* Answer Display */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {text.trim() && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{t('rag.answer')}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyAnswer}
                      className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                      title={t('common.copy')}
                    >
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div 
                  className={`prose prose-sm max-w-none ${isRtl ? 'prose-rtl' : ''}`}
                  dangerouslySetInnerHTML={{ __html: highlightCitations(text) }}
                />
              </div>
            )}

            {running && (
              <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">{t('rag.searching')}</span>
              </div>
            )}

            {!text.trim() && !running && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{t('rag.placeholder', 'Ask a question to get evidence-based answers')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Question Input */}
          <div className="flex-none p-4 border-t bg-white">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('rag.questionPlaceholder', 'Ask a question about your documents...')}
                  className={`w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isRtl ? 'text-right' : 'text-left'
                  }`}
                  rows={2}
                  disabled={running}
                />
                <button
                  type="submit"
                  disabled={!question.trim() || running}
                  className={`absolute ${isRtl ? 'left-2' : 'right-2'} bottom-2 p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                >
                  {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              
              {running && (
                <button
                  type="button"
                  onClick={abortStream}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                >
                  {t('common.cancel')}
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Citations Sidebar */}
        {citations.length > 0 && (
          <div className="w-80 border-l bg-gray-50 flex flex-col">
            <div className="flex-none p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">
                  {t('rag.citations')} ({citations.length})
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleExportCsv}
                    disabled={exportingCsv}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                    title={t('rag.exportCsv')}
                  >
                    {exportingCsv ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleExportPdf}
                    disabled={exportingPdf}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                    title={t('rag.exportPdf')}
                  >
                    {exportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {citations.map((citation) => (
                <div
                  key={citation.n}
                  className="bg-white p-3 rounded-lg border hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-none w-6 h-6 bg-blue-100 text-blue-600 text-xs font-semibold rounded flex items-center justify-center">
                      {citation.n}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight mb-2">
                        {citation.title}
                      </h4>
                      
                      <div className="space-y-1 text-xs text-gray-500">
                        {citation.portal && (
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>{citation.portal}</span>
                          </div>
                        )}
                        
                        {citation.doc_type && (
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>{citation.doc_type}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(citation.created_at)}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleViewDocument(citation)}
                        className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {t('rag.viewDocument')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}