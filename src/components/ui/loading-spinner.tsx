import { RefreshCw } from "lucide-react";

export const LoadingSpinner = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <RefreshCw className="h-6 w-6 animate-spin mr-2" />
      <span>Loading...</span>
    </div>
  );
};