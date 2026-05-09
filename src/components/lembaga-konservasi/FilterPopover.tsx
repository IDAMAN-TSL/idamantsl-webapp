"use client";

import React from "react";
import { X } from "lucide-react";

type PenangkaranFilterState = {
  bidang: string[];
  seksi: string[];
  status: string[];
};

const FILTER_GROUPS = {
  bidang: {
    title: "Bidang KSDA",
    options: ["I. Bogor", "II. Soreang", "III. Ciamis"],
  },
  seksi: {
    title: "Seksi Konservasi",
    options: ["I. Serang", "II. Bogor", "III. Soreang", "IV. Purwakarta", "V. Garut", "VI. Tasikmalaya"],
  },
  status: {
    title: "Status",
    options: ["Disetujui", "Menunggu", "Ditolak"],
  },
} as const;

interface FilterPopoverProps {
  filterButtonRef: React.RefObject<HTMLDivElement | null>;
  filterOpen: boolean;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filterState: PenangkaranFilterState;
  toggleRowFilter: (group: keyof PenangkaranFilterState, value: string) => void;
  clearRowFilters: () => void;
}

export default function FilterPopover({
  filterButtonRef,
  filterOpen,
  setFilterOpen,
  filterState,
  toggleRowFilter,
  clearRowFilters,
}: Readonly<FilterPopoverProps>) {
  const activeCount = filterState.bidang.length + filterState.seksi.length + filterState.status.length;
  const isActive = activeCount > 0;
  return (
    <div ref={filterButtonRef} className="relative">
      <button
        type="button"
        onClick={() => setFilterOpen((previous) => !previous)}
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
          <span className="ml-1 inline-flex items-center justify-center rounded-full bg-[#8E9E25] px-2 py-0.5 text-[11px] font-semibold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {filterOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-50 cursor-default border-0 bg-black/10 p-0"
            onClick={() => setFilterOpen(false)}
            aria-label="Tutup filter"
          />

          <div className="absolute right-0 top-full z-51 mt-2 w-120 rounded-xl border border-[#DCDCDC] bg-white p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.28)]">
          <button
            type="button"
            onClick={() => setFilterOpen(false)}
            className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
            aria-label="Tutup filter"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {Object.entries(FILTER_GROUPS).map(([groupKey, group]) => {
              const typedGroup = groupKey as keyof PenangkaranFilterState;
              const values = filterState[typedGroup];

              return (
                <div key={groupKey}>
                  <h3 className="mb-2 pr-6 text-[13px] font-semibold text-gray-900">{group.title}</h3>
                  <div className="flex flex-col gap-2">
                    {group.options.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-[12px] text-gray-700">
                        <input
                          type="checkbox"
                          checked={values.includes(option)}
                          onChange={() => toggleRowFilter(typedGroup, option)}
                          className="h-4 w-4 rounded border-gray-300 accent-[#8E9E25] focus:ring-[#8E9E25]"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#E8E8E8] pt-3">
            <button
              type="button"
              onClick={clearRowFilters}
              className="rounded-lg  bg-[#F2F6D7] px-3 py-2 text-[12px] font-medium text-[#647221] transition-colors hover:bg-[#E8F0C9]"
            >
              Hapus filter
            </button>
            
          </div>
          </div>
        </>
      )}
    </div>
  );
}
