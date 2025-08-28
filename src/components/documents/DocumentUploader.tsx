import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, X, Calendar, FileSpreadsheet, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { parseExcelFile } from '@/lib/data/parseExcel';
import { ExcelMapperModal } from './ExcelMapperModal';
import type { ParsedSheet } from '@/lib/data/parseExcel';

export interface DocumentMetadata {
  docType: string;
  govPortal?: string;
  expiresOn?: string;
  refId?: string;
  notes?: string;
}

export interface DocumentUploaderProps {
  onUploadSuccess?: (fileUrl: string, metadata: DocumentMetadata) => void;
  onUploadError?: (error: Error) => void;
  onExcelImport?: (data: any[], context: 'government' | 'employee') => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  govPortal?: string;
  docTypes?: string[];
  className?: string;
  allowAIParsing?: boolean;
  context?: 'gov' | 'employee';
  tenantId?: string;
}

export function DocumentUploader({
  onUploadSuccess,
  onUploadError,
  onExcelImport,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.xlsx', '.xls'],
  maxSize = 10,
  govPortal,
  docTypes = ['Contract', 'Invoice', 'Certificate', 'Report', 'License', 'Other'],
  className = '',
  allowAIParsing = true,
  context = 'gov',
  tenantId,
}: DocumentUploaderProps) {
  const { t } = useTranslation();
  const supabase = createClientComponentClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseWithAI, setParseWithAI] = useState(false);
  const [aiProvider, setAiProvider] = useState('genspark');
  const [excelData, setExcelData] = useState<ParsedSheet[]>([]);
  const [excelModal, setExcelModal] = useState(false);
  const [processingExcel, setProcessingExcel] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err' | null; text: string }>({ type: null, text: '' });

  // Form metadata
  const [metadata, setMetadata] = useState<DocumentMetadata>({
    docType: '',
    govPortal: govPortal || '',
    expiresOn: '',
    refId: '',
    notes: '',
  });

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setUploadStatus('error');
      setStatusMessage(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      setUploadStatus('error');
      setStatusMessage(`File type ${fileExtension} not supported`);
      return false;
    }

    return true;
  };

  const handleFile = async (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setUploadStatus('idle');
      setStatusMessage('');
      
      // Auto-process Excel files
      if (file.name.match(/\.(xlsx|xls)$/i)) {
        await processExcelFile(file);
      }
    }
  };

  const processExcelFile = async (file: File) => {
    setProcessingExcel(true);
    try {
      const sheets = await parseExcelFile(file);
      setExcelData(sheets);
      if (sheets.length > 0) {
        setExcelModal(true);
      }
    } catch (error) {
      console.error('Excel processing error:', error);
      setUploadStatus('error');
      setStatusMessage('Failed to process Excel file');
    } finally {
      setProcessingExcel(false);
    }
  };

  const handleExcelImport = (mappedData: any[]) => {
    onExcelImport?.(mappedData, context as 'government' | 'employee');
    setExcelModal(false);
    setSelectedFile(null);
    setExcelData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile || !metadata.docType) {
      setUploadStatus('error');
      setStatusMessage(t('documents.uploader.required'));
      return;
    }

    // Handle Excel files differently
    if (selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      if (excelData.length === 0) {
        await processExcelFile(selectedFile);
      }
      return;
    }

    setUploading(true);
    setUploadStatus('idle');

    try {
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Store in gov_documents table with proper structure
      const documentData = {
        tenant_id: tenantId || user.id,
        portal: govPortal || 'General',
        context: context,
        doc_type: metadata.docType,
        storage_bucket: 'documents',
        storage_path: filePath,
        ref_id: metadata.refId || null,
        expires_on: metadata.expiresOn || null,
        notes: metadata.notes || null,
        uploaded_by: user.id,
      };

      // Insert document record
      const { data: docRecord, error: dbError } = await supabase
        .from('gov_documents')
        .insert([documentData])
        .select()
        .single();

      if (dbError) {
        console.warn('Database insert failed:', dbError);
        // Continue anyway - file was uploaded successfully
      }

      // Trigger AI parsing if enabled
      if (parseWithAI && docRecord) {
        try {
          const aiResponse = await supabase.functions.invoke('ai-doc-ocr-parse-v1', {
            body: {
              docId: docRecord.id,
              path: filePath,
              portal: govPortal || 'General',
              providerHint: aiProvider,
              lang: 'ar',
            }
          });
          
          if (aiResponse.error) {
            console.warn('AI parsing failed:', aiResponse.error);
          }
        } catch (aiError) {
          console.warn('AI parsing request failed:', aiError);
          // Don't fail the upload for AI parsing errors
        }
      }

      setUploadStatus('success');
      setStatusMessage(t('documents.uploader.success'));
      onUploadSuccess?.(publicUrl, metadata);

      // Reset form
      resetForm();

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setStatusMessage(t('documents.uploader.failure'));
      onUploadError?.(error as Error);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setMetadata({
      docType: '',
      govPortal: govPortal || '',
      expiresOn: '',
      refId: '',
      notes: '',
    });
    setParseWithAI(false);
    setExcelData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setStatusMessage('');
    setExcelData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isExcelFile = selectedFile?.name.match(/\.(xlsx|xls)$/i);
  const isPdfOrImage = selectedFile?.name.match(/\.(pdf|jpg|jpeg|png)$/i);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {t('documents.uploader.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 transition-colors
            ${dragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
            ${selectedFile ? 'border-green-500 bg-green-50' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {t('documents.uploader.selectFile')}
                </Button>
                <p className="mt-2 text-sm text-gray-500">
                  {t('documents.uploader.orDragDrop')}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Max {maxSize}MB • {acceptedTypes.join(', ')}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isExcelFile ? (
                    <FileSpreadsheet className="h-8 w-8 text-green-500" />
                  ) : (
                    <FileText className="h-8 w-8 text-blue-500" />
                  )}
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      {processingExcel && <span className="ml-2 text-orange-500">Processing...</span>}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {isExcelFile && excelData.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      Found {excelData.length} sheet(s) with data
                    </span>
                  </div>
                  <div className="mt-2 space-x-2">
                    {excelData.map((sheet, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {sheet.name}: {sheet.data.length} rows
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
          />
        </div>

        {/* Metadata Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="docType">{t('documents.uploader.docType')} *</Label>
            <Select
              value={metadata.docType}
              onValueChange={(value) => setMetadata(prev => ({ ...prev, docType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('documents.uploader.docType')} />
              </SelectTrigger>
              <SelectContent>
                {docTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {govPortal && (
            <div className="space-y-2">
              <Label>{t('documents.uploader.govPortal')}</Label>
              <Input value={govPortal} disabled />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="expiresOn">{t('documents.uploader.expiresOn')}</Label>
            <div className="relative">
              <Input
                id="expiresOn"
                type="date"
                value={metadata.expiresOn}
                onChange={(e) => setMetadata(prev => ({ ...prev, expiresOn: e.target.value }))}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="refId">{t('documents.uploader.refId')}</Label>
            <Input
              id="refId"
              value={metadata.refId}
              onChange={(e) => setMetadata(prev => ({ ...prev, refId: e.target.value }))}
              placeholder={t('documents.uploader.refId')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">{t('documents.uploader.notes')}</Label>
          <Textarea
            id="notes"
            value={metadata.notes}
            onChange={(e) => setMetadata(prev => ({ ...prev, notes: e.target.value }))}
            placeholder={t('documents.uploader.notes')}
            rows={3}
          />
        </div>

        {/* AI Parsing Options */}
        {allowAIParsing && isPdfOrImage && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <Label htmlFor="parseWithAI" className="text-sm font-medium text-blue-800">
                      {t('documents.uploader.aiParsing.title', 'AI Document Parsing')}
                    </Label>
                  </div>
                  <Switch
                    id="parseWithAI"
                    checked={parseWithAI}
                    onCheckedChange={setParseWithAI}
                  />
                </div>
                
                {parseWithAI && (
                  <div className="space-y-3">
                    <Label className="text-sm text-blue-700">
                      {t('documents.uploader.aiParsing.provider', 'AI Provider')}
                    </Label>
                    <Select value={aiProvider} onValueChange={setAiProvider}>
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="genspark">GenSpark AI</SelectItem>
                        <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                        <SelectItem value="manus">Manus AI</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-blue-600">
                      {t('documents.uploader.aiParsing.description', 
                      'AI will extract text and structured data from your document')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Excel Processing Info */}
        {isExcelFile && excelData.length > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {t('documents.uploader.excel.ready', 'Excel file ready for import')}
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => setExcelModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {t('documents.uploader.excel.mapColumns', 'Map Columns')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Messages */}
        {uploadStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {statusMessage}
            </AlertDescription>
          </Alert>
        )}

        {uploadStatus === 'error' && statusMessage && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {statusMessage}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Import Status Messages */}
        {msg.type === 'ok' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {msg.text}
            </AlertDescription>
          </Alert>
        )}
        
        {msg.type === 'err' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {msg.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
          >
            {t('documents.uploader.cancel')}
          </Button>
          
          {isExcelFile && excelData.length > 0 ? (
            <Button
              onClick={() => setExcelModal(true)}
              disabled={!selectedFile || processingExcel}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              {t('documents.uploader.excel.import', 'Import Excel Data')}
            </Button>
          ) : (
            <Button
              onClick={uploadFile}
              disabled={!selectedFile || !metadata.docType || uploading || processingExcel}
            >
              {uploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  {t('documents.uploader.upload')}...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {t('documents.uploader.upload')}
                </>
              )}
            </Button>
          )}
        </div>
        
        {/* Excel Mapper Modal */}
        {excelModal && excelData && (
          <ExcelMapperModal
            open={excelModal}
            onClose={() => setExcelModal(false)}
            data={excelData}
            mode={context === 'employee' ? 'employee' : 'gov'}
            onImport={async ({ rows, mode }) => {
              try {
                setBusy(true); setMsg({ type: null, text: '' });
                if (mode === 'employee') {
                  const res = await (await import('@/lib/api/bulkImport')).bulkImportEmployees(rows, { dryRun: false });
                  if (res?.ok) setMsg({ type: 'ok', text: `Imported: ${res.totals?.success ?? 0} / ${res.totals?.total ?? rows.length}` });
                  else setMsg({ type: 'err', text: `Import failed: ${res?.error ?? 'unknown'}` });
                } else {
                  const res = await (await import('@/lib/api/bulkImport')).bulkImportGovDocs(rows, { dryRun: false });
                  if (res?.ok) setMsg({ type: 'ok', text: `Imported: ${res.totals?.success ?? 0} / ${res.totals?.total ?? rows.length}` });
                  else setMsg({ type: 'err', text: `Import failed: ${res?.error ?? 'unknown'}` });
                }
              } finally {
                setBusy(false);
              }
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}