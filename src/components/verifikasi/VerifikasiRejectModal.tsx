"use client";

import { useState } from "react";
import { X, XCircle } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[500px] rounded-2xl bg-white p-6 shadow-xl md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-xl border border-[#F0A0A0] bg-[#FFE8E8]">
              <XCircle className="h-5 w-5 text-[#D24B4B]" strokeWidth={2} />
            </div>
            <h2 className="text-[17px] font-medium text-[#1A1A1A]">Tolak Data</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Tutup modal"
          >
            <X className="h-7 w-7" strokeWidth={1} />
          </button>
        </div>

        {/* Body */}
        <div className="mt-6">
          <h3 className="text-[18px] font-semibold text-[#1A1A1A]">
            Apakah Anda yakin menolak data ini?
          </h3>
          <p className="mt-1.5 text-[15px] text-[#808080]">Beri alasan penolakan</p>

          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-3 w-full rounded-[8px] border border-[#D7D7D7] bg-white px-4 py-3 text-[14px] text-[#1A1A1A] outline-none transition-all placeholder:text-[#A3A3A3] focus:border-[#D24B4B] focus:ring-1 focus:ring-[#D24B4B]"
          />
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="inline-flex items-center gap-2 rounded-xl border border-[#F0A0A0] bg-[#FFE8E8] px-6 py-2.5 text-[15px] font-medium text-[#D24B4B] transition-colors hover:bg-[#FADADA] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XCircle className="h-5 w-5" strokeWidth={2} />
            Tolak
          </button>
        </div>
      </div>
    </div>
  );
}
