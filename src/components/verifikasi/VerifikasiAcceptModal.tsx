"use client";

import { CheckCircle2, X } from "lucide-react";

interface VerifikasiAcceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function VerifikasiAcceptModal({
  isOpen,
  onClose,
  onConfirm,
}: Readonly<VerifikasiAcceptModalProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[500px] rounded-2xl bg-white p-6 shadow-xl md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-[#9ED49A] bg-[#EAF7E5]">
              <CheckCircle2 className="h-5 w-5 text-[#49A043]" strokeWidth={2} />
            </div>
            <h2 className="text-[17px] font-medium text-[#1A1A1A]">Terima Data</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Tutup modal"
          >
            <X className="h-7 w-7" strokeWidth={1} />
          </button>
        </div>

        {/* Body */}
        <div className="mt-6">
          <h3 className="text-[18px] font-semibold text-[#1A1A1A]">
            Apakah Anda yakin menerima data ini?
          </h3>
          <p className="mt-1.5 text-[15px] text-[#808080]">
            Data ini akan diterima dan disimpan dalam database IDAMAN TSL
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-xl border border-[#9ED49A] bg-[#EAF7E5] px-6 py-2.5 text-[15px] font-medium text-[#49A043] transition-colors hover:bg-[#DCF0D6]"
          >
            <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
            Terima
          </button>
        </div>
      </div>
    </div>
  );
}
