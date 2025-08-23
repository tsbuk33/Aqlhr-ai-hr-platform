import React from 'react';
import { Link } from 'react-router-dom';

export default function DiagnosticHub() {
  const params = new URLSearchParams(window.location.search);
  const dev = params.get('dev') === '1';

  // Minimal, always-visible content so we can verify rendering
  return (
    <div style={{padding: '24px'}}>
      <h1 style={{fontSize: 24, marginBottom: 12}}>Diagnostic Hub</h1>
      {dev && (
        <div style={{marginBottom: 16, padding: 12, border: '1px dashed #666', borderRadius: 8}}>
          <strong>Dev mode:</strong> rendering without auth/tenant. Use these quick links:
          <div style={{display: 'grid', gap: 8, marginTop: 8}}>
            <Link to="../osi?dev=1" relative="path">Organization Structure Intelligence (OSI)</Link>
            <Link to="../retention?dev=1" relative="path">Retention Strategy</Link>
            <Link to="../org-structure-intelligence?dev=1" relative="path">Org Structure Intelligence (legacy path)</Link>
          </div>
        </div>
      )}

      <p>If you can read this, the Hub outlet is rendering.</p>
      <p>Try adding <code>?debug=1</code> to the URL to show the route debug overlay.</p>
    </div>
  );
}