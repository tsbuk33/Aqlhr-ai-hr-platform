import { ReactNode } from 'react';

interface DevModeGuardProps {
  children: ReactNode;
}

export default function DevModeGuard({ children }: DevModeGuardProps) {
  // This component can be extended later for dev-specific functionality
  // For now, it just passes through children
  return <>{children}</>;
}