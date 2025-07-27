// Test sample with various heading formats that need fixing
import React from 'react';

const TestComponent = () => {
  return (
    <div>
      {/* Module headings - should be Title Case */}
      <h1>core hr management</h1>
      <h1>payroll system</h1>
      <h1>employee data export</h1>
      
      {/* Tool headings - should be UPPERCASE */}
      <h2>data export tool</h2>
      <h2>ai analyzer engine</h2>
      <h2>report generator</h2>
      
      {/* Sub-tool headings - should be lowercase */}
      <span>Data Parser</span>
      <span>File Converter</span>
      <span>Validation Helper</span>
      
      {/* Submodule headings - should be Sentence case */}
      <div title="employee management system">Content</div>
      <Card title="performance tracking module">Content</Card>
      <Button name="attendance calculator">Calculate</Button>
      
      {/* Document names */}
      <p>employee_data_export_december_2024.xlsx</p>
      <p>PAYROLL_REPORT_Q4.pdf</p>
      <p>hr_analytics_dashboard</p>
    </div>
  );
};

export default TestComponent;