import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRAGStream, type Citation } from '../../hooks/useRAGStream';
import { supabase } from '../../lib/supabaseClient';
import { FileText, Download, ExternalLink, Loader2, Send, Copy, Check, AlertCircle, Calendar, Tag, Globe, Plus, Save, ThumbsUp, ThumbsDown, Clock, User } from 'lucide-react';

interface RAGAnswerProps {
  className?: string;
}

export function RAGAnswer({ className = '' }: RAGAnswerProps) {
  const { t, i18n } = useTranslation();
  const [question, setQuestion] = useState('');
  const [copied, setCopied] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  
  // Phase 24: Evidence -> Action state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskDue, setTaskDue] = useState<string>('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskAssignee, setTaskAssignee] = useState<string>('');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackHelpful, setFeedbackHelpful] = useState<boolean | null>(null);
  const [feedbackReason, setFeedbackReason] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [lastAskedQuestion, setLastAskedQuestion] = useState<string>('');
  
  const { citations, text, running, askQuestion, abortStream } = useRAGStream();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isRtl = i18n.language === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || running) return;
    
    const q = question.trim();
    setLastAskedQuestion(q);
    askQuestion(q);
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

            {/* Phase 24: Action Bar */}
            {text.trim() && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                      disabled={saving}
                    >
                      <Plus className="w-4 h-4" />
                      {t('rag.actions.createTask', 'Create Task')}
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                      disabled={saving}
                    >
                      <Save className="w-4 h-4" />
                      {t('rag.actions.saveNote', 'Save Note')}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {t('rag.actions.wasHelpful', 'Was this helpful?')}
                    </span>
                    <button
                      onClick={() => handleFeedback(true)}
                      className={`p-2 rounded-lg transition-colors ${
                        feedbackHelpful === true
                          ? 'bg-green-100 text-green-600 border border-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                      }`}
                      title={t('rag.actions.helpful', 'Helpful')}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback(false)}
                      className={`p-2 rounded-lg transition-colors ${
                        feedbackHelpful === false
                          ? 'bg-red-100 text-red-600 border border-red-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                      }`}
                      title={t('rag.actions.notHelpful', 'Not helpful')}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* No Evidence Alert */}
            {!running && text.trim() && citations.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-none">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-800 mb-1">
                      {t('rag.noEvidence.title', 'No supporting evidence found')}
                    </h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      {t('rag.noEvidence.description', 'We could not find any supporting documents for this answer. You may want to upload relevant documents or request them from government portals.')}
                    </p>
                    <button
                      onClick={handleRequestEvidence}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-lg hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      {t('rag.noEvidence.requestEvidence', 'Request Evidence Task')}
                    </button>
                  </div>
                </div>
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

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('rag.actions.createTask', 'Create Task from Answer')}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('rag.task.dueDate', 'Due Date (Optional)')}
                  </label>
                  <input
                    type="datetime-local"
                    value={taskDue}
                    onChange={(e) => setTaskDue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('rag.task.priority', 'Priority')}
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">{t('rag.task.low', 'Low')}</option>
                    <option value="medium">{t('rag.task.medium', 'Medium')}</option>
                    <option value="high">{t('rag.task.high', 'High')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('rag.task.assignee', 'Assignee (Optional)')}
                  </label>
                  <input
                    type="text"
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    placeholder={t('rag.task.assigneePlaceholder', 'Enter user ID or leave empty')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  disabled={saving}
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  onClick={handleCreateTask}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                  disabled={saving}
                >
                  {saving ? t('common.saving', 'Saving...') : t('common.create', 'Create')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('rag.feedback.title', 'Help us improve')}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {t('rag.feedback.description', 'What could be improved about this answer?')}
              </p>
              
              <textarea
                value={feedbackReason}
                onChange={(e) => setFeedbackReason(e.target.value)}
                placeholder={t('rag.feedback.placeholder', 'Please describe what was missing or incorrect...')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                rows={4}
              />

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                <button
                  onClick={() => setFeedbackOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  disabled={saving}
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                  disabled={saving}
                >
                  {saving ? t('common.submitting', 'Submitting...') : t('common.submit', 'Submit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Phase 24: Action Handler Functions
  const handleFeedback = (helpful: boolean) => {
    setFeedbackHelpful(helpful);
    if (helpful) {
      // Positive feedback - submit immediately
      handleSubmitFeedback(true);
    } else {
      // Negative feedback - open modal for reason
      setFeedbackOpen(true);
    }
  };

  const handleSubmitFeedback = async (helpfulOverride?: boolean) => {
    setSaving(true);
    try {
      const helpful = helpfulOverride ?? feedbackHelpful ?? false;
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/assistant-actions-v1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          op: 'feedback',
          session_id: null,
          message_id: null,
          question: lastAskedQuestion,
          answer: text,
          helpful,
          reason: helpful ? null : feedbackReason || null
        })
      });

      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error || 'Feedback submission failed');
      }

      setFeedbackOpen(false);
      setFeedbackReason('');
      
      // Show success message
      const message = helpful 
        ? t('rag.feedback.thanksPositive', 'Thank you for the positive feedback!')
        : t('rag.feedback.thanksNegative', 'Thank you for helping us improve!');
      
      // You could show a toast notification here
      console.log(message);
    } catch (error) {
      console.error('Feedback submission error:', error);
      // You could show an error notification here
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTask = async () => {
    setSaving(true);
    try {
      const title = `[AqlHR] ${t('rag.task.titlePrefix', 'Follow-up on evidence answer')} — ${lastAskedQuestion.slice(0, 60)}`;
      const description = [
        t('rag.task.autoGenerated', 'Auto-generated by AqlHR Assistant (evidence-backed)'),
        '',
        `**${t('rag.task.question', 'Question:')}** ${lastAskedQuestion}`,
        '',
        `**${t('rag.task.answer', 'Answer:')}**`,
        text,
        '',
        `**${t('rag.task.citations', 'Citations:')}**`,
        ...citations.map(c => `- [${c.n}] ${c.title} (${c.portal || '-'} / ${c.doc_type || '-'})`)
      ].join('\n');

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/assistant-actions-v1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          op: 'create_task',
          title,
          description,
          priority: taskPriority,
          due_at: taskDue ? new Date(taskDue).toISOString() : null,
          assignee: taskAssignee || null,
          labels: ['assistant', 'evidence', 'rag']
        })
      });

      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error || 'Task creation failed');
      }

      setShowTaskModal(false);
      setTaskDue('');
      setTaskPriority('medium');
      setTaskAssignee('');
      
      // Show success message
      console.log(t('rag.task.created', 'Task created successfully!'));
    } catch (error) {
      console.error('Task creation error:', error);
      // Show error message
      console.error(t('rag.task.error', 'Failed to create task'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNote = async () => {
    setSaving(true);
    try {
      const title = lastAskedQuestion.slice(0, 120);
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/assistant-actions-v1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          op: 'save_note',
          title,
          content: text,
          lang: i18n.language,
          citations
        })
      });

      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error || 'Note save failed');
      }

      // Show success message
      console.log(t('rag.note.saved', 'Note saved successfully!'));
    } catch (error) {
      console.error('Note save error:', error);
      // Show error message
      console.error(t('rag.note.error', 'Failed to save note'));
    } finally {
      setSaving(false);
    }
  };

  const handleRequestEvidence = async () => {
    setSaving(true);
    try {
      const title = `[AqlHR] ${t('rag.evidence.requestTitle', 'Document request for missing evidence')}`;
      const description = `${t('rag.evidence.requestDescription', 'Please upload the official documents related to this query:')}\n\n${t('rag.task.question', 'Question:')} ${lastAskedQuestion}`;

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/assistant-actions-v1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          op: 'create_task',
          title,
          description,
          priority: 'high',
          due_at: null,
          assignee: null,
          labels: ['document', 'request', 'government', 'evidence']
        })
      });

      const result = await response.json();
      if (!result.ok) {
        throw new Error(result.error || 'Evidence request task creation failed');
      }

      // Show success message
      console.log(t('rag.evidence.created', 'Evidence request task created!'));
    } catch (error) {
      console.error('Evidence request error:', error);
      // Show error message
      console.error(t('rag.evidence.error', 'Failed to create evidence request'));
    } finally {
      setSaving(false);
    }
  };
}