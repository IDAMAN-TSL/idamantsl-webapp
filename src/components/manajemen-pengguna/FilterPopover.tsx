"use client";

import { useEffect, useState, type RefObject } from "react";
import { X, Filter as FilterIcon } from "lucide-react";
import { PERAN_FILTER_OPTIONS } from "./peran-filter-options";

const FILTER_GROUPS = {
  peran: {
    title: "Peran",
    options: PERAN_FILTER_OPTIONS,
  },
} as const;

interface FilterPopoverProps {
  filterButtonRef: RefObject<HTMLDivElement | null>;
  filterOpen: boolean;
  setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPeranFilters: string[];
  onTogglePeran: (key: string) => void;
  onReset: () => void;
}

export function FilterPopover({
  filterButtonRef,
  filterOpen,
  setFilterOpen,
  selectedPeranFilters,
  onTogglePeran,
  onReset,
}: Readonly<FilterPopoverProps>) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const activeCount = selectedPeranFilters.length;
  const isActive = activeCount > 0;

  const updatePosition = () => {
    const anchor = filterButtonRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const panelWidth = Math.min(window.innerWidth - 24, 360);
    const offsetLeft = 0;
    const left = Math.max(
      12,
      Math.min(rect.right - panelWidth - offsetLeft, window.innerWidth - panelWidth - 12)
    );
    const top = Math.max(12, rect.bottom + 10);

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
        onClick={() => setFilterOpen((prev) => !prev)}
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
            className="fixed z-51 w-[min(20vw,420px)] max-w-[calc(20vw-24px)] rounded-xl border border-[#DCDCDC] bg-white p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.28)]"
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

            <div className="grid grid-cols-1 gap-5">
              {Object.entries(FILTER_GROUPS).map(([groupKey, group]) => (
                <div key={groupKey}>
                  <h3 className="mb-2 pr-6 text-[13px] font-semibold text-gray-900">{group.title}</h3>
                  <div className="flex flex-col gap-2">
                    {group.options.map((option) => (
                      <label key={option.key} className="flex cursor-pointer items-center gap-2 text-[12px] text-gray-700">
                        <input
                          type="checkbox"
                          checked={selectedPeranFilters.includes(option.key)}
                          onChange={() => onTogglePeran(option.key)}
                          className="h-4 w-4 rounded border-gray-300 accent-[#8E9E25] focus:ring-[#8E9E25]"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
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
