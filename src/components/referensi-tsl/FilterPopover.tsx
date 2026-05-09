"use client";

import React from "react";
import { X } from "lucide-react";

const FILTER_GROUPS = {
  status: {
    title: "Status",
    options: ["Disetujui", "Menunggu", "Ditolak"],
  },
} as const;

interface FilterPopoverProps {
  filterButtonRef: React.RefObject<HTMLDivElement | null>;
  filterOpen: boolean;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  statusVerifikasiFilter: string[];
  onStatusVerifikasiChange: (selected: string[]) => void;
  clearFilters: () => void;
}

export default function FilterPopover({
  filterButtonRef,
  filterOpen,
  setFilterOpen,
  statusVerifikasiFilter,
  onStatusVerifikasiChange,
  clearFilters,
}: Readonly<FilterPopoverProps>) {
  const activeCount = statusVerifikasiFilter.length;
  const isActive = activeCount > 0;

  const toggleStatus = (value: string) => {
    if (statusVerifikasiFilter.includes(value)) {
      onStatusVerifikasiChange(statusVerifikasiFilter.filter((item) => item !== value));
    } else {
      onStatusVerifikasiChange([...statusVerifikasiFilter, value]);
    }
  };

  return (
    <div ref={filterButtonRef} className="relative">
      <button
        type="button"
        onClick={() => setFilterOpen((prev) => !prev)}
        aria-pressed={isActive}
        className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-[13px] font-medium transition-colors ${
          isActive
            ? "border border-[#C4CE71] bg-[#F2F6D7] text-[#647221] hover:bg-[#E8F0C9]"
            : "border border-[#D7D7D7] bg-white text-[#444444] hover:bg-[#FAFAFA]"
        }`}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 5h18M6 12h12M10 19h4" />
        </svg>
        <span>Filter</span>
        {activeCount > 0 && (
          <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8E9E25] px-1.5 text-[11px] font-semibold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {filterOpen && filterButtonRef.current && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-50 cursor-default border-0 bg-black/10 p-0"
            onClick={() => setFilterOpen(false)}
            aria-label="Tutup filter"
          />

          {(() => {
            const rect = filterButtonRef.current!.getBoundingClientRect();
            const panelWidth = Math.min(window.innerWidth - 24, 360);
            const top = Math.max(12, rect.bottom + 10);
            const left = Math.max(12, Math.min(rect.right - panelWidth, window.innerWidth - panelWidth - 12));

            return (
              <div
                className="fixed z-51 w-[min(40vw,420px)] max-w-[calc(20vw-24px)] rounded-xl border border-[#DCDCDC] bg-white p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.28)]"
                style={{ top, left }}
              >
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
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
                    onClick={clearFilters}
                    className="rounded-lg bg-[#F2F6D7] px-3 py-2 text-[12px] font-medium text-[#647221] transition-colors hover:bg-[#E8F0C9]"
                  >
                    Hapus filter
                  </button>
                </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}
