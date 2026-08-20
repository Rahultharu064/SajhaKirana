import React from "react";

type Props = { open: boolean; onClose: () => void; title: string; children: React.ReactNode };

export default function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
