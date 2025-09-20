import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  FileText, 
  Lock, 
  Eye, 
  Download, 
  Search,
  Filter,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Key,
  Fingerprint
} from 'lucide-react';

interface SecureDocument {
  id: string;
  title: string;
  titleAr: string;
  type: 'board_minutes' | 'financial' | 'strategic' | 'legal' | 'confidential';
  classification: 'public' | 'internal' | 'confidential' | 'top_secret';
  size: string;
  lastModified: string;
  accessLevel: number;
  encryptionStatus: 'encrypted' | 'decrypting' | 'decrypted';
  viewHistory: Array<{
    userId: string;
    timestamp: string;
    action: 'view' | 'download' | 'print';
  }>;
  expiryDate?: string;
}

interface SecureDocumentAccessProps {
  isArabic: boolean;
  userClearanceLevel: number;
  expanded?: boolean;
}

export const SecureDocumentAccess: React.FC<SecureDocumentAccessProps> = ({ 
  isArabic, 
  userClearanceLevel = 5,
  expanded = false 
}) => {
  const [documents, setDocuments] = useState<SecureDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [decryptingDoc, setDecryptingDoc] = useState<string | null>(null);

  useEffect(() => {
    loadSecureDocuments();
  }, []);

  const loadSecureDocuments = () => {
    // Secure documents data - would come from encrypted storage
    const secureDocsData: SecureDocument[] = [
      {
        id: 'doc_001',
        title: 'Board Meeting Minutes - Q4 2024',
        titleAr: 'محضر اجتماع مجلس الإدارة - الربع الرابع 2024',
        type: 'board_minutes',
        classification: 'confidential',
        size: '2.4 MB',
        lastModified: new Date().toISOString(),
        accessLevel: 4,
        encryptionStatus: 'encrypted',
        viewHistory: [
          { userId: 'ceo', timestamp: new Date().toISOString(), action: 'view' }
        ],
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'doc_002',
        title: 'Financial Statements - Confidential',
        titleAr: 'البيانات المالية - سري',
        type: 'financial',
        classification: 'top_secret',
        size: '5.1 MB',
        lastModified: new Date().toISOString(),
        accessLevel: 5,
        encryptionStatus: 'encrypted',
        viewHistory: [
          { userId: 'cfo', timestamp: new Date().toISOString(), action: 'view' },
          { userId: 'ceo', timestamp: new Date().toISOString(), action: 'download' }
        ]
      },
      {
        id: 'doc_003',
        title: 'Strategic Roadmap 2025-2027',
        titleAr: 'خارطة الطريق الاستراتيجية 2025-2027',
        type: 'strategic',
        classification: 'confidential',
        size: '3.8 MB',
        lastModified: new Date().toISOString(),
        accessLevel: 3,
        encryptionStatus: 'decrypted',
        viewHistory: [
          { userId: 'strategy_team', timestamp: new Date().toISOString(), action: 'view' }
        ]
      },
      {
        id: 'doc_004',
        title: 'Legal Compliance Report',
        titleAr: 'تقرير الامتثال القانوني',
        type: 'legal',
        classification: 'internal',
        size: '1.9 MB',
        lastModified: new Date().toISOString(),
        accessLevel: 2,
        encryptionStatus: 'encrypted',
        viewHistory: []
      },
      {
        id: 'doc_005',
        title: 'M&A Due Diligence - Project Alpha',
        titleAr: 'العناية الواجبة للاندماج والاستحواذ - مشروع ألفا',
        type: 'confidential',
        classification: 'top_secret',
        size: '12.3 MB',
        lastModified: new Date().toISOString(),
        accessLevel: 5,
        encryptionStatus: 'encrypted',
        viewHistory: [
          { userId: 'ceo', timestamp: new Date().toISOString(), action: 'view' }
        ],
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    setDocuments(secureDocsData);
  };

  const handleDecryptDocument = async (docId: string) => {
    setDecryptingDoc(docId);
    
    // Simulate biometric authentication and decryption
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, encryptionStatus: 'decrypted' }
        : doc
    ));
    
    setDecryptingDoc(null);
  };

  const getClassificationColor = (classification: SecureDocument['classification']) => {
    switch (classification) {
      case 'public':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'internal':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'confidential':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'top_secret':
        return 'bg-red-100 text-red-700 border-red-300';
    }
  };

  const getClassificationIcon = (classification: SecureDocument['classification']) => {
    switch (classification) {
      case 'public':
        return <Eye className="h-3 w-3" />;
      case 'internal':
        return <User className="h-3 w-3" />;
      case 'confidential':
        return <Lock className="h-3 w-3" />;
      case 'top_secret':
        return <Shield className="h-3 w-3" />;
    }
  };

  const getEncryptionStatusIcon = (status: SecureDocument['encryptionStatus']) => {
    switch (status) {
      case 'encrypted':
        return <Lock className="h-4 w-4 text-red-500" />;
      case 'decrypting':
        return <Key className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'decrypted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getTypeIcon = (type: SecureDocument['type']) => {
    switch (type) {
      case 'board_minutes':
        return <FileText className="h-4 w-4" />;
      case 'financial':
        return <FileText className="h-4 w-4" />;
      case 'strategic':
        return <FileText className="h-4 w-4" />;
      case 'legal':
        return <FileText className="h-4 w-4" />;
      case 'confidential':
        return <Shield className="h-4 w-4" />;
    }
  };

  const canAccessDocument = (doc: SecureDocument) => {
    return userClearanceLevel >= doc.accessLevel;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.titleAr.includes(searchTerm);
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesClassification = selectedClassification === 'all' || doc.classification === selectedClassification;
    const hasAccess = canAccessDocument(doc);
    
    return matchesSearch && matchesType && matchesClassification && hasAccess;
  });

  const documentTypes = [
    { key: 'all', label: isArabic ? 'الكل' : 'All' },
    { key: 'board_minutes', label: isArabic ? 'محاضر الاجتماعات' : 'Board Minutes' },
    { key: 'financial', label: isArabic ? 'مالي' : 'Financial' },
    { key: 'strategic', label: isArabic ? 'استراتيجي' : 'Strategic' },
    { key: 'legal', label: isArabic ? 'قانوني' : 'Legal' },
    { key: 'confidential', label: isArabic ? 'سري' : 'Confidential' }
  ];

  const classifications = [
    { key: 'all', label: isArabic ? 'الكل' : 'All' },
    { key: 'internal', label: isArabic ? 'داخلي' : 'Internal' },
    { key: 'confidential', label: isArabic ? 'سري' : 'Confidential' },
    { key: 'top_secret', label: isArabic ? 'سري للغاية' : 'Top Secret' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {isArabic ? 'الوصول الآمن للوثائق' : 'Secure Document Access'}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm">
          <Fingerprint className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">
            {isArabic ? `مستوى التصريح: ${userClearanceLevel}` : `Clearance Level: ${userClearanceLevel}`}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isArabic ? 'البحث في الوثائق...' : 'Search documents...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {documentTypes.map((type) => (
              <Button
                key={type.key}
                variant={selectedType === type.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type.key)}
                className="whitespace-nowrap"
              >
                {type.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {classifications.map((classification) => (
              <Button
                key={classification.key}
                variant={selectedClassification === classification.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedClassification(classification.key)}
                className="whitespace-nowrap"
              >
                {classification.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="border">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(doc.type)}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm truncate">
                          {isArabic ? doc.titleAr : doc.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {doc.size}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {isArabic ? 'آخر تعديل' : 'Modified'}: {
                              new Date(doc.lastModified).toLocaleDateString()
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getEncryptionStatusIcon(doc.encryptionStatus)}
                      <Badge className={`${getClassificationColor(doc.classification)} border`}>
                        {getClassificationIcon(doc.classification)}
                        <span className="ml-1 text-xs">
                          {doc.classification.toUpperCase()}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  {doc.expiryDate && (
                    <div className="flex items-center gap-2 text-xs text-orange-600">
                      <Clock className="h-3 w-3" />
                      {isArabic ? 'ينتهي في' : 'Expires'}: {
                        new Date(doc.expiryDate).toLocaleDateString()
                      }
                    </div>
                  )}

                  {expanded && doc.viewHistory.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-medium">
                        {isArabic ? 'سجل الوصول:' : 'Access History:'}
                      </span>
                      <div className="space-y-1">
                        {doc.viewHistory.slice(-3).map((history, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{history.userId}</span>
                            <span>{history.action}</span>
                            <span>{new Date(history.timestamp).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {doc.encryptionStatus === 'encrypted' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDecryptDocument(doc.id)}
                        disabled={decryptingDoc === doc.id}
                      >
                        {decryptingDoc === doc.id ? (
                          <>
                            <Key className="h-4 w-4 mr-2 animate-spin" />
                            {isArabic ? 'جاري فك التشفير...' : 'Decrypting...'}
                          </>
                        ) : (
                          <>
                            <Fingerprint className="h-4 w-4 mr-2" />
                            {isArabic ? 'فك التشفير' : 'Decrypt'}
                          </>
                        )}
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          {isArabic ? 'عرض' : 'View'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          {isArabic ? 'تحميل' : 'Download'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {isArabic ? 'لا توجد وثائق متاحة بمستوى التصريح الخاص بك' : 'No documents available at your clearance level'}
            </p>
          </div>
        )}

        {/* Security Status */}
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  {isArabic ? 'نشط - تشفير شامل' : 'Active - End-to-End Encryption'}
                </span>
              </div>
              <Badge variant="outline" className="text-red-700 border-red-300">
                AES-256
              </Badge>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};