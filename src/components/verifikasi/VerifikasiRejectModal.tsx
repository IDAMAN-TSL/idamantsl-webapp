"use client";

import { useState } from "react";
import { AlertCircle, X } from "lucide-react";

interface VerifikasiRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function VerifikasiRejectModal({
  isOpen,
  onClose,
  onConfirm,
}: Readonly<VerifikasiRejectModalProps>) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-sm rounded-[22px] bg-white px-6 py-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.28)]">
        <button
          onClick={handleClose}
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
            <h3 className="text-[15px] font-semibold text-gray-900">Tolak Data</h3>
          </div>
        </div>

        <p className="mt-4 text-[14px] text-gray-700">
          Apakah Anda yakin menolak data ini?
        </p>

        <p className="mt-2 text-[12px] text-gray-600">
          Sertai alasan penolakan
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Masukkan alasan penolakan..."
          rows={3}
          className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-900 placeholder:text-gray-400 focus:border-0 focus:ring-2 focus:ring-red-500 outline-none resize-none"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
}
