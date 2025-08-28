export const documents = {
  en: {
    uploader: {
      title: 'Document Upload',
      subtitle: 'Upload and manage documents with AI-powered processing',
      selectFile: 'Select File',
      orDragDrop: 'or drag and drop files here',
      required: 'Document type is required',
      success: 'Document uploaded successfully',
      failure: 'Failed to upload document',
      upload: 'Upload',
      cancel: 'Cancel',
      docType: 'Document Type',
      govPortal: 'Government Portal',
      expiresOn: 'Expires On',
      refId: 'Reference ID',
      notes: 'Notes',
      parseWithAI: 'Parse with AI',
      aiParsing: {
        title: 'AI Document Parsing',
        provider: 'AI Provider',
        description: 'AI will extract text and structured data from your document',
        processing: 'AI is processing your document...',
        success: 'AI parsing completed successfully',
        failed: 'AI parsing failed'
      },
      excel: {
        ready: 'Excel file ready for import',
        mapColumns: 'Map Columns',
        import: 'Import Excel Data',
        processing: 'Processing Excel file...',
        sheets: 'Excel Sheets',
        rows: 'rows',
        noData: 'No data found in Excel file'
      }
    },
    mapper: {
      title: 'Map Excel Columns',
      subtitle: 'Map your Excel columns to the appropriate database fields',
      selectSheet: 'Select Sheet',
      preview: 'Data Preview',
      mapping: 'Column Mapping',
      excelColumn: 'Excel Column',
      databaseField: 'Database Field',
      autoMap: 'Auto Map',
      clearMapping: 'Clear Mapping',
      import: 'Import Data',
      cancel: 'Cancel',
      export: 'Export as CSV',
      selectField: 'Select field...',
      unmapped: 'Unmapped',
      required: 'Required',
      optional: 'Optional',
      dataPreview: {
        showing: 'Showing',
        of: 'of',
        rows: 'rows'
      },
      validation: {
        noMappings: 'Please map at least one column',
        duplicateFields: 'Some database fields are mapped multiple times',
        missingRequired: 'Required fields must be mapped'
      }
    },
    types: {
      Contract: 'Contract',
      Invoice: 'Invoice',
      Certificate: 'Certificate',
      Report: 'Report',
      License: 'License',
      Permit: 'Permit',
      Application: 'Application',
      Statement: 'Statement',
      Receipt: 'Receipt',
      Other: 'Other'
    },
    fields: {
      government: {
        employeeId: 'Employee ID',
        fullName: 'Full Name',
        firstName: 'First Name',
        lastName: 'Last Name',
        nationalId: 'National ID',
        email: 'Email',
        phone: 'Phone',
        department: 'Department',
        position: 'Position',
        hireDate: 'Hire Date',
        salary: 'Salary',
        status: 'Status'
      },
      employee: {
        id: 'ID',
        employeeNumber: 'Employee Number',
        fullName: 'Full Name',
        arabicName: 'Arabic Name',
        email: 'Email Address',
        phone: 'Phone Number',
        department: 'Department',
        position: 'Job Title',
        grade: 'Grade',
        hireDate: 'Hire Date',
        contractType: 'Contract Type',
        nationality: 'Nationality',
        passportNumber: 'Passport Number',
        visaNumber: 'Visa Number',
        iqamaNumber: 'Iqama Number',
        basicSalary: 'Basic Salary',
        housingAllowance: 'Housing Allowance',
        transportAllowance: 'Transport Allowance',
        totalSalary: 'Total Salary',
        bankName: 'Bank Name',
        accountNumber: 'Account Number',
        iban: 'IBAN'
      }
    },
    status: {
      uploading: 'Uploading...',
      processing: 'Processing...',
      success: 'Success',
      error: 'Error',
      ready: 'Ready',
      pending: 'Pending'
    }
  },
  ar: {
    uploader: {
      title: 'رفع المستندات',
      subtitle: 'رفع وإدارة المستندات مع المعالجة بالذكاء الاصطناعي',
      selectFile: 'اختر ملف',
      orDragDrop: 'أو اسحب وأفلت الملفات هنا',
      required: 'نوع المستند مطلوب',
      success: 'تم رفع المستند بنجاح',
      failure: 'فشل في رفع المستند',
      upload: 'رفع',
      cancel: 'إلغاء',
      docType: 'نوع المستند',
      govPortal: 'البوابة الحكومية',
      expiresOn: 'ينتهي في',
      refId: 'الرقم المرجعي',
      notes: 'ملاحظات',
      parseWithAI: 'تحليل بالذكاء الاصطناعي',
      aiParsing: {
        title: 'تحليل المستندات بالذكاء الاصطناعي',
        provider: 'مقدم الذكاء الاصطناعي',
        description: 'سيقوم الذكاء الاصطناعي باستخراج النص والبيانات المنظمة من مستندك',
        processing: 'الذكاء الاصطناعي يعالج مستندك...',
        success: 'اكتمل تحليل الذكاء الاصطناعي بنجاح',
        failed: 'فشل تحليل الذكاء الاصطناعي'
      },
      excel: {
        ready: 'ملف Excel جاهز للاستيراد',
        mapColumns: 'ربط الأعمدة',
        import: 'استيراد بيانات Excel',
        processing: 'معالجة ملف Excel...',
        sheets: 'أوراق Excel',
        rows: 'صفوف',
        noData: 'لم يتم العثور على بيانات في ملف Excel'
      }
    },
    mapper: {
      title: 'ربط أعمدة Excel',
      subtitle: 'اربط أعمدة Excel الخاصة بك بحقول قاعدة البيانات المناسبة',
      selectSheet: 'اختر الورقة',
      preview: 'معاينة البيانات',
      mapping: 'ربط الأعمدة',
      excelColumn: 'عمود Excel',
      databaseField: 'حقل قاعدة البيانات',
      autoMap: 'ربط تلقائي',
      clearMapping: 'مسح الربط',
      import: 'استيراد البيانات',
      cancel: 'إلغاء',
      export: 'تصدير كـ CSV',
      selectField: 'اختر حقل...',
      unmapped: 'غير مربوط',
      required: 'مطلوب',
      optional: 'اختياري',
      dataPreview: {
        showing: 'عرض',
        of: 'من',
        rows: 'صف'
      },
      validation: {
        noMappings: 'يرجى ربط عمود واحد على الأقل',
        duplicateFields: 'بعض حقول قاعدة البيانات مربوطة عدة مرات',
        missingRequired: 'يجب ربط الحقول المطلوبة'
      }
    },
    types: {
      Contract: 'عقد',
      Invoice: 'فاتورة',
      Certificate: 'شهادة',
      Report: 'تقرير',
      License: 'رخصة',
      Permit: 'تصريح',
      Application: 'طلب',
      Statement: 'بيان',
      Receipt: 'إيصال',
      Other: 'أخرى'
    },
    fields: {
      government: {
        employeeId: 'رقم الموظف',
        fullName: 'الاسم الكامل',
        firstName: 'الاسم الأول',
        lastName: 'اسم العائلة',
        nationalId: 'رقم الهوية الوطنية',
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
        department: 'القسم',
        position: 'المنصب',
        hireDate: 'تاريخ التوظيف',
        salary: 'الراتب',
        status: 'الحالة'
      },
      employee: {
        id: 'المعرف',
        employeeNumber: 'رقم الموظف',
        fullName: 'الاسم الكامل',
        arabicName: 'الاسم بالعربية',
        email: 'عنوان البريد الإلكتروني',
        phone: 'رقم الهاتف',
        department: 'القسم',
        position: 'المسمى الوظيفي',
        grade: 'الدرجة',
        hireDate: 'تاريخ التوظيف',
        contractType: 'نوع العقد',
        nationality: 'الجنسية',
        passportNumber: 'رقم جواز السفر',
        visaNumber: 'رقم التأشيرة',
        iqamaNumber: 'رقم الإقامة',
        basicSalary: 'الراتب الأساسي',
        housingAllowance: 'بدل السكن',
        transportAllowance: 'بدل النقل',
        totalSalary: 'الراتب الإجمالي',
        bankName: 'اسم البنك',
        accountNumber: 'رقم الحساب',
        iban: 'رقم الآيبان'
      }
    },
    status: {
      uploading: 'جارٍ الرفع...',
      processing: 'جارٍ المعالجة...',
      success: 'نجح',
      error: 'خطأ',
      ready: 'جاهز',
      pending: 'في الانتظار'
    }
  }
};