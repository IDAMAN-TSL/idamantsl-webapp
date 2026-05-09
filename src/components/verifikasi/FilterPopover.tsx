"use client";

import React, { useEffect, useState, type RefObject } from "react";
import { X, Filter as FilterIcon } from "lucide-react";

const FILTER_GROUPS = {
  jenis: {
    title: "Jenis",
    options: ["Tambah", "Perbarui", "Hapus"],
  },
  data: {
    title: "Data",
    options: [
      "Penangkar",
      "Pengedar DN",
      "Pengedar LN",
      "Lembaga Konservasi",
      "Referensi TSL",
    ],
  },
  bidang: {
    title: "Bidang KSDA",
    options: ["I. Bogor", "II. Soreang", "III. Ciamis"],
  },
  status: {
    title: "Status",
    options: ["Disetujui", "Menunggu", "Ditolak"],
  },
} as const;

interface Props {
  filterButtonRef: RefObject<HTMLDivElement | null>;
  filterOpen: boolean;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedJenisFilters: string[];
  selectedDataFilters: string[];
  selectedBidangFilters: string[];
  selectedStatusFilters: string[];
  onToggleJenis: (k: string) => void;
  onToggleData: (k: string) => void;
  onToggleBidang: (k: string) => void;
  onToggleStatus: (k: string) => void;
  onReset: () => void;
}

export default function FilterPopover({
  filterButtonRef,
  filterOpen,
  setFilterOpen,
  selectedJenisFilters,
  selectedDataFilters,
  selectedBidangFilters,
  selectedStatusFilters,
  onToggleJenis,
  onToggleData,
  onToggleBidang,
  onToggleStatus,
  onReset,
}: Readonly<Props>) {
  const activeCount =
    selectedJenisFilters.length +
    selectedDataFilters.length +
    selectedBidangFilters.length +
    selectedStatusFilters.length;
  const isActive = activeCount > 0;

  const toggle = (section: "jenis" | "data" | "bidang" | "status", value: string) => {
    if (section === "jenis") return onToggleJenis(value);
    if (section === "data") return onToggleData(value);
    if (section === "bidang") return onToggleBidang(value);
    return onToggleStatus(value);
  };

  // update position on resize/scroll similar to existing modal
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const updatePosition = () => {
    const anchor = filterButtonRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const panelWidth = Math.min(window.innerWidth - 24, 560);
    const top = Math.max(12, rect.bottom + 10);
    const left = Math.max(12, Math.min(rect.right - panelWidth, window.innerWidth - panelWidth - 12));
    setPosition({ top, left });
  };

  useEffect(() => {
    if (!filterOpen) return;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [filterOpen, filterButtonRef]);

  return (
    <div ref={filterButtonRef} className="relative">
      <button
        type="button"
        onClick={() => setFilterOpen((p) => !p)}
        aria-pressed={isActive}
        className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-[13px] font-medium transition-colors ${
          isActive
            ? "border border-[#C4CE71] bg-[#F2F6D7] text-[#647221] hover:bg-[#E8F0C9]"
            : "border border-[#D7D7D7] bg-white text-[#444444] hover:bg-[#FAFAFA]"
        }`}
      >
        <FilterIcon className="h-4 w-4" strokeWidth={2.1} />
        <span>Filter</span>
        {activeCount > 0 && (
          <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8E9E25] px-1.5 text-[11px] font-semibold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {filterOpen && position && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-50 cursor-default border-0 bg-black/10 p-0"
            onClick={() => setFilterOpen(false)}
            aria-label="Tutup filter"
          />

          <div
            className="fixed z-51 w-140 max-w-[calc(100vw-24px)] rounded-xl border border-[#DCDCDC] bg-white p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.28)]"
            style={{ top: position.top, left: position.left }}
          >
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
              aria-label="Tutup modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {Object.entries(FILTER_GROUPS).map(([groupKey, group]) => {
                const section = groupKey as keyof typeof FILTER_GROUPS;
                const values =
                  section === "jenis"
                    ? selectedJenisFilters
                    : section === "data"
                    ? selectedDataFilters
                    : section === "bidang"
                    ? selectedBidangFilters
                    : selectedStatusFilters;

                return (
                  <div key={groupKey}>
                    <h3 className="mb-2 pr-6 text-[13px] font-semibold text-gray-900">{group.title}</h3>
                    <div className="flex flex-col gap-2">
                      {group.options.map((option) => (
                        <label key={option} className="flex cursor-pointer items-center gap-2 text-[12px] text-gray-700">
                          <input
                            type="checkbox"
                            checked={values.includes(option)}
                            onChange={() => toggle(section as any, option)}
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
                onClick={() => {
                  onReset();
                  setFilterOpen(false);
                }}
                className="rounded-lg bg-[#F2F6D7] px-3 py-2 text-[12px] font-medium text-[#647221] transition-colors hover:bg-[#E8F0C9]"
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
