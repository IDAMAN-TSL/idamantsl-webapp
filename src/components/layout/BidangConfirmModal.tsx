"use client";

import { X, Plus, Pencil, Trash2 } from "lucide-react";

type ConfirmType = "add" | "update" | "delete";

interface BidangConfirmModalProps {
  isOpen: boolean;
  type: ConfirmType;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const CONFIG: Record<ConfirmType, {
  iconBg: string;
  iconColor: string;
  iconBorder: string;
  title: string;
  question: string;
  btnBg: string;
  btnHover: string;
  btnBorder: string;
  btnText: string;
  btnTextColor: string;
  btnLabel: string;
  Icon: React.FC<{ className?: string; strokeWidth?: number }>;
}> = {
  add: {
    iconBg: "bg-[#F2F6D7]",
    iconColor: "text-[#7A8F1E]",
    iconBorder: "border-[#D4DB8B]",
    title: "Ajukan Tambah Data",
    question: "Apakah Anda yakin menambah data ini?",
    btnBg: "bg-[#F6F7E6]",
    btnHover: "hover:bg-[#eef1d1]",
    btnBorder: "border-[#C4CE71]",
    btnText: "text-[#7A8F1E]",
    btnTextColor: "text-[#7A8F1E]",
    btnLabel: "Ajukan Tambah",
    Icon: Plus,
  },
  update: {
    iconBg: "bg-[#FFF8DA]",
    iconColor: "text-[#C19A15]",
    iconBorder: "border-[#E6D382]",
    title: "Ajukan Perbarui Data",
    question: "Apakah Anda yakin memperbarui data ini?",
    btnBg: "bg-[#FFF8DA]",
    btnHover: "hover:bg-[#FFF2C0]",
    btnBorder: "border-[#E6D382]",
    btnText: "text-[#C19A15]",
    btnTextColor: "text-[#C19A15]",
    btnLabel: "Ajukan Perbarui",
    Icon: Pencil,
  },
  delete: {
    iconBg: "bg-[#FFEEEE]",
    iconColor: "text-[#D24B4B]",
    iconBorder: "border-[#F2A6A6]",
    title: "Ajukan Hapus Data",
    question: "Apakah Anda yakin menghapus data ini?",
    btnBg: "bg-[#FFEEEE]",
    btnHover: "hover:bg-[#FFE1E1]",
    btnBorder: "border-[#F2A6A6]",
    btnText: "text-[#D24B4B]",
    btnTextColor: "text-[#D24B4B]",
    btnLabel: "Ajukan Hapus",
    Icon: Trash2,
  },
};

export function BidangConfirmModal({
  isOpen,
  type,
  onClose,
  onConfirm,
  isLoading = false,
}: Readonly<BidangConfirmModalProps>) {
  if (!isOpen) return null;

  const c = CONFIG[type];
  const { Icon } = c;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/25 p-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-sm rounded-2xl bg-white px-6 py-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)]">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${c.iconBg} ${c.iconBorder}`}>
            <Icon className={`h-4.5 w-4.5 ${c.iconColor}`} strokeWidth={2.3} />
          </div>
          <span className="text-[14px] font-semibold text-gray-800">{c.title}</span>
        </div>

        {/* Body */}
        <div className="mt-4">
          <p className="text-[14px] font-semibold text-gray-900">{c.question}</p>
          <p className="mt-1 text-[13px] text-gray-500">
            Data ini akan ditinjau terlebih dahulu oleh Pusat BBKSDA Jabar
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-[13px] font-semibold transition-colors disabled:opacity-50 ${c.btnBg} ${c.btnBorder} ${c.btnText} ${c.btnHover}`}
          >
            <Icon className="h-4 w-4" strokeWidth={2.3} />
            {isLoading ? "Memproses..." : c.btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
