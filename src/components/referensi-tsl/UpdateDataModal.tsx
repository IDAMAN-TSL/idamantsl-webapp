"use client";

import React from "react";
import { ChevronDown, Save, Trash2, X } from "lucide-react";

interface UpdateDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateDataModal({
  isOpen,
  onClose,
}: Readonly<UpdateDataModalProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm md:p-8">
      <div className="relative w-full max-w-4xl rounded-[14px] bg-white px-6 py-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.35)] md:px-8 md:py-7">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Tutup modal"
        >
          <X className="h-5 w-5" strokeWidth={2.2} />
        </button>

        <div className="text-center">
          <h2 className="text-[15px] font-medium text-gray-900 md:text-[16px]">
            Perbarui Data Referensi TSL
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <InputField label="Nama TSL" />
            <SelectField label="Jenis TSL" options={["Tumbuhan", "Satwa"]} />
            <InputField label="Kingdom" />
            <InputField label="Divisi" />
            <InputField label="Kelas" />
            <InputField label="Ordo" />
          </div>

          <div className="flex flex-col gap-4">
            <InputField label="Family" />
            <InputField label="Genus" />
            <InputField label="Spesies" />
            <SelectField
              label="Status Perlindungan Nasional"
              options={["Dilindungi", "Tidak Dilindungi"]}
            />
            <SelectField
              label="Status CITES"
              options={["Appendix I", "Appendix II", "Appendix III"]}
            />
            <SelectField
              label="Status IUCN"
              options={["LC", "NT", "VU", "EN", "CR", "EW", "EX", "DD", "NE"]}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-red-700 sm:w-auto">
            <Trash2 className="h-4.5 w-4.5" strokeWidth={2.5} />
            Hapus
          </button>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-[14px] font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8E9E25] px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#7e8d20]"
            >
              <Save className="h-4.5 w-4.5" strokeWidth={2.4} />
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label }: Readonly<{ label: string }>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] text-gray-500">{label}</label>
      <input
        type="text"
        className="h-8 w-full rounded-[3px] border border-[#C7D0AF] bg-white px-3 text-[12px] text-gray-800 outline-none focus:ring-1 focus:ring-[#8E9E25]"
      />
    </div>
  );
}

function SelectField({
  label,
  options,
}: Readonly<{
  label: string;
  options: string[];
}>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] text-gray-500">{label}</label>
      <div className="relative">
        <select className="h-8 w-full appearance-none rounded-[3px] border border-[#C7D0AF] bg-white px-3 pr-7 text-[12px] text-gray-800 outline-none focus:ring-1 focus:ring-[#8E9E25]">
          <option value=""></option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8E9E25]">
          <ChevronDown className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}
