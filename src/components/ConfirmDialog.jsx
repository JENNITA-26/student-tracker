import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto ${danger ? 'bg-rose-100' : 'bg-amber-100'}`}>
          <AlertTriangle className={`w-6 h-6 ${danger ? 'text-rose-500' : 'text-amber-500'}`} />
        </div>
        <h2 className="text-base font-semibold text-slate-800 text-center mb-1">{title}</h2>
        <p className="text-sm text-slate-500 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            id="confirm-cancel"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-action"
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors
              ${danger ? 'bg-rose-500 hover:bg-rose-600' : 'bg-amber-500 hover:bg-amber-600'}`}
          >
            {confirmLabel}
          </button>
        </div>
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
