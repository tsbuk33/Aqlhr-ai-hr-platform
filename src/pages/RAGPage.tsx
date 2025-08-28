import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * RAGPage - Dedicated page that redirects to Assistant with RAG mode
 * This provides a clean deep-link URL for RAG functionality
 */
const RAGPage: React.FC = () => {
  // Redirect to assistant with RAG mode parameter
  return <Navigate to="/assistant?mode=rag" replace />;
};

export default RAGPage;