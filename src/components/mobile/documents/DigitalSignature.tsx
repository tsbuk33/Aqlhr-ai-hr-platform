import React, { useState, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUnifiedLocale } from '@/lib/i18n/unifiedLocaleSystem';
import { 
  PenTool, 
  Eraser, 
  RotateCcw, 
  Save, 
  Upload,
  Check,
  X,
  FileText,
  Calendar,
  MapPin
} from 'lucide-react';

interface DigitalSignatureProps {
  documentName?: string;
  onSignatureComplete?: (signature: string) => void;
}

export const DigitalSignature: React.FC<DigitalSignatureProps> = ({ 
  documentName,
  onSignatureComplete 
}) => {
  const { lang } = useUnifiedLocale();
  const isArabic = lang === 'ar';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureExists, setSignatureExists] = useState(false);
  const [signatureDate] = useState(new Date().toLocaleDateString());

  const startDrawing = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    event.preventDefault();
    setIsDrawing(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX: number, clientY: number;
    
    if (event.type === 'touchstart') {
      const touch = (event as React.TouchEvent).touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      const mouse = event as React.MouseEvent;
      clientX = mouse.clientX;
      clientY = mouse.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    event.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX: number, clientY: number;
    
    if (event.type === 'touchmove') {
      const touch = (event as React.TouchEvent).touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      const mouse = event as React.MouseEvent;
      clientX = mouse.clientX;
      clientY = mouse.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setSignatureExists(true);
  }, []);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureExists(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    onSignatureComplete?.(dataURL);
  };

  // Initialize canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Set drawing properties
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <PenTool className="h-5 w-5 text-primary" />
            {isArabic ? 'التpodqق الرقمي' : 'Digital Signature'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Document Info */}
          {documentName && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {isArabic ? 'المستند' : 'Document'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{documentName}</p>
              
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{signatureDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{isArabic ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Signature Canvas */}
          <div className="space-y-3">
            <div className="relative border-2 border-dashed border-muted rounded-lg bg-background">
              <canvas
                ref={canvasRef}
                className="w-full h-40 cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              
              {!signatureExists && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-muted-foreground text-sm">
                    {isArabic ? 'وقع هنا' : 'Sign here'}
                  </p>
                </div>
              )}
            </div>

            {/* Signature Status */}
            {signatureExists && (
              <div className="flex justify-center">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Check className="h-3 w-3 mr-1" />
                  {isArabic ? 'تم التوقيع' : 'Signature Added'}
                </Badge>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSignature}
              disabled={!signatureExists}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {isArabic ? 'مسح' : 'Clear'}
            </Button>
            
            <Button
              onClick={saveSignature}
              disabled={!signatureExists}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isArabic ? 'حفظ التوقيع' : 'Save Signature'}
            </Button>
          </div>

          {/* Legal Disclaimer */}
          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">
              {isArabic ? 
                'بالتوقيع أدناه، أؤكد أن هذا التوقيع الرقمي صحيح ومُلزم قانونياً.' :
                'By signing below, I confirm that this digital signature is valid and legally binding.'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Signature History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            {isArabic ? 'سجل التوقيعات' : 'Signature History'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                  <PenTool className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {isArabic ? 'عقد العمل - أحمد محمد' : 'Employment Contract - Ahmed Mohamed'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? 'منذ 2 ساعات' : '2 hours ago'}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200">
                {isArabic ? 'مُوقع' : 'Signed'}
              </Badge>
            </div>

            <div className="text-center text-muted-foreground text-sm py-2">
              {isArabic ? 'عرض المزيد من التوقيعات' : 'View more signatures'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};