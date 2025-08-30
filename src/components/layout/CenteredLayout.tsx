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
    <div className="flex min-h-screen w-full items-center justify-center bg-red-500 p-4">
      {children || <Outlet />}
    </div>
  );
}