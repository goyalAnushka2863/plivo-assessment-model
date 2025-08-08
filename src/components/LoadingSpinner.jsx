import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ message = "Processing..." }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
      <Loader2 className="mx-auto text-blue-600 animate-spin mb-4" size={40} />
      <p className="text-lg font-medium text-slate-900 mb-2">{message}</p>
      <p className="text-slate-500">Please wait while we process your request</p>
    </div>
  );
}