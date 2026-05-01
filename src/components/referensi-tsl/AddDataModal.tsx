"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";

interface AddDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sections = ["Informasi Dasar", "Klasifikasi dan Status"];

export function AddDataModal({ isOpen, onClose }: Readonly<AddDataModalProps>) {
  const [section, setSection] = useState(0);

  if (!isOpen) return null;

  const closeAndReset = () => {
    setSection(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm md:p-8">
      <div className="relative w-full max-w-4xl rounded-[14px] bg-white px-6 py-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.35)] md:px-8 md:py-7">
        <button
          onClick={closeAndReset}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Tutup modal"
        >
          <X className="h-5 w-5" strokeWidth={2.2} />
        </button>

        <div className="text-center">
          <h2 className="text-[15px] font-medium text-gray-900 md:text-[16px]">
            Tambah Data Referensi TSL
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-[12px] md:text-[13px]">
          {sections.map((label, index) => {
            const active = index === section;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setSection(index)}
                className="pb-2"
              >
                <span className={active ? "font-medium text-[#8E9E25]" : "text-gray-400"}>
                  {label}
                </span>
                <span
                  className={`mt-2 block h-px w-full ${active ? "bg-[#8E9E25]" : "bg-gray-200"}`}
                />
              </button>
            );
          })}
        </div>

        {section === 0 && (
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <InputField label="Nama TSL" />
              <SelectField
                label="Jenis TSL"
                options={["Tumbuhan", "Satwa"]}
              />
              <InputField label="Kingdom" />
            </div>

            <div className="flex flex-col gap-4">
              <InputField label="Divisi" />
              <InputField label="Kelas" />
            </div>
          </div>
        )}

        {section === 1 && (
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <InputField label="Ordo" />
              <InputField label="Family" />
              <InputField label="Genus" />
              <InputField label="Spesies" />
            </div>

            <div className="flex flex-col gap-4">
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
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {section > 0 ? (
              <button
                type="button"
                onClick={() => setSection((previous) => previous - 1)}
                className="inline-flex items-center gap-2 rounded-md border border-[#D4DB8B] bg-[#F6F7E6] px-4 py-2 text-[12px] font-medium text-[#8E9E25] transition-colors hover:bg-[#eef1d1]"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
                Sebelumnya
              </button>
            ) : (
              <span />
            )}
          </div>

          <div className="flex justify-end">
            {section < sections.length - 1 ? (
              <button
                type="button"
                onClick={() => setSection((previous) => previous + 1)}
                className="inline-flex items-center gap-2 rounded-md border border-[#D4DB8B] bg-[#F6F7E6] px-4 py-2 text-[12px] font-medium text-[#8E9E25] transition-colors hover:bg-[#eef1d1]"
              >
                Lanjut
                <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            ) : (
              <button
                type="button"
                onClick={closeAndReset}
                className="inline-flex items-center gap-2 rounded-md bg-[#8E9E25] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#7e8d20]"
              >
                <Plus className="h-4 w-4" strokeWidth={2.2} />
                Tambah
              </button>
            )}
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
