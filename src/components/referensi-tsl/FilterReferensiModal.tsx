"use client";

import React from "react";
import { X } from "lucide-react";

const FILTER_GROUPS = {
  status: {
    title: "Status",
    options: ["Disetujui", "Menunggu", "Ditolak"],
  },
} as const;

interface FilterReferensiModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusVerifikasiFilter: string[];
  onStatusVerifikasiChange: (selected: string[]) => void;
}

export function FilterReferensiModal({
  isOpen,
  onClose,
  statusVerifikasiFilter,
  onStatusVerifikasiChange,
}: Readonly<FilterReferensiModalProps>) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40"
      onClick={onClose}
    />
  );
}

export function FilterReferensiDropdown({
  isOpen,
  onClose,
  statusVerifikasiFilter,
  onStatusVerifikasiChange,
  triggerRef,
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
  statusVerifikasiFilter: string[];
  onStatusVerifikasiChange: (selected: string[]) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}>) {
  if (!isOpen || !triggerRef.current) return null;

  const rect = triggerRef.current.getBoundingClientRect();
  const panelWidth = Math.min(window.innerWidth - 24, 360);
  const top = Math.max(12, rect.bottom + 10);
  const left = Math.max(12, Math.min(rect.right - panelWidth, window.innerWidth - panelWidth - 12));

  const toggleStatus = (value: string) => {
    if (statusVerifikasiFilter.includes(value)) {
      onStatusVerifikasiChange(statusVerifikasiFilter.filter((item) => item !== value));
    } else {
      onStatusVerifikasiChange([...statusVerifikasiFilter, value]);
    }
  };

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-50 cursor-default border-0 bg-black/10 p-0"
        onClick={onClose}
        aria-label="Tutup filter"
      />

      <div
        className="fixed z-51 w-[min(40vw,420px)] max-w-[calc(20vw-24px)] rounded-xl border border-[#DCDCDC] bg-white p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.28)]"
        style={{ top, left }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
          aria-label="Tutup filter"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 gap-5">
          {Object.entries(FILTER_GROUPS).map(([groupKey, group]) => (
            <div key={groupKey}>
              <h3 className="mb-2 pr-6 text-[13px] font-semibold text-gray-900">{group.title}</h3>
              <div className="flex flex-col gap-2">
                {group.options.map((option) => (
                  <label key={option} className="flex cursor-pointer items-center gap-2 text-[12px] text-gray-700">
                    <input
                      type="checkbox"
                      checked={statusVerifikasiFilter.includes(option)}
                      onChange={() => toggleStatus(option)}
                      className="h-4 w-4 rounded border-gray-300 accent-[#8E9E25] focus:ring-[#8E9E25]"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#E8E8E8] pt-3">
          <button
            type="button"
            onClick={() => onStatusVerifikasiChange([])}
            className="rounded-lg bg-[#F2F6D7] px-3 py-2 text-[12px] font-medium text-[#647221] transition-colors hover:bg-[#E8F0C9]"
          >
            Hapus filter
          </button>
        </div>
      </div>
    </>
  );
}
