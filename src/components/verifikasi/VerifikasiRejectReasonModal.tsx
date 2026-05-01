"use client";

import { AlertCircle, X } from "lucide-react";

interface VerifikasiRejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: string;
}

export function VerifikasiRejectReasonModal({
  isOpen,
  onClose,
  reason,
}: Readonly<VerifikasiRejectReasonModalProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-sm rounded-[22px] bg-white px-6 py-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.28)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Tutup modal"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" strokeWidth={2.5} />
          </div>

          <div className="pt-0.5">
            <h3 className="text-[15px] font-semibold text-gray-900">
              Alasan Penolakan Data
            </h3>
          </div>
        </div>

        <p className="mt-4 text-[14px] text-gray-700">
          {reason}
        </p>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
