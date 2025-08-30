import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';

interface CenteredLayoutProps {
  title?: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export default function CenteredLayout({ title, description, className = "", children }: CenteredLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start gap-10 px-4 py-10">
      {children || <Outlet />}
    </div>
  );
}