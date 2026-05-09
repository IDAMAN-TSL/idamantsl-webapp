"use client";

import { useEffect, useState, type RefObject } from "react";
import { X } from "lucide-react";

interface FilterVerifikasiModalProps {
  isOpen: boolean;
  anchorRef: RefObject<HTMLButtonElement | null>;
  selectedJenisFilters: string[];
  selectedDataFilters: string[];
  selectedBidangFilters: string[];
  selectedStatusFilters: string[];
  onClose: () => void;
  onToggleJenis: (key: string) => void;
  onToggleData: (key: string) => void;
  onToggleBidang: (key: string) => void;
  onToggleStatus: (key: string) => void;
  onReset: () => void;
}

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

export function FilterVerifikasiModal({
  isOpen,
  anchorRef,
  selectedJenisFilters,
  selectedDataFilters,
  selectedBidangFilters,
  selectedStatusFilters,
  onClose,
  onToggleJenis,
  onToggleData,
  onToggleBidang,
  onToggleStatus,
  onReset,
}: Readonly<FilterVerifikasiModalProps>) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = () => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const panelWidth = Math.min(window.innerWidth - 24, 560);
    const top = Math.max(12, rect.bottom + 10);
    const offsetLeft = 0;
    const left = Math.max(
      12,
      Math.min(rect.right - panelWidth - offsetLeft, window.innerWidth - panelWidth - 12)
    );

    setPosition({ top, left });
  };

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, anchorRef]);

  if (!isOpen || !position) {
    return null;
  }

  const selectedMap = {
    jenis: selectedJenisFilters,
    data: selectedDataFilters,
    bidang: selectedBidangFilters,
    status: selectedStatusFilters,
  };

  const handleToggle = (sectionKey: keyof typeof selectedMap, value: string) => {
    if (sectionKey === "jenis") {
      onToggleJenis(value);
      return;
    }

    if (sectionKey === "data") {
      onToggleData(value);
      return;
    }

    if (sectionKey === "bidang") {
      onToggleBidang(value);
      return;
    }

    onToggleStatus(value);
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
        className="fixed z-51 w-140 max-w-[calc(100vw-24px)] rounded-xl border border-[#DCDCDC] bg-white p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.28)]"
        style={{ top: position.top, left: position.left }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
          aria-label="Tutup modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Object.entries(FILTER_GROUPS).map(([groupKey, group]) => {
            const typedGroup = groupKey as keyof typeof selectedMap;
            const values = selectedMap[typedGroup];

            return (
              <div key={groupKey}>
                <h3 className="mb-2 pr-6 text-[13px] font-semibold text-gray-900">{group.title}</h3>
                <div className="flex flex-col gap-2">
                  {group.options.map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-2 text-[12px] text-gray-700">
                      <input
                        type="checkbox"
                        checked={values.includes(option)}
                        onChange={() => handleToggle(typedGroup, option)}
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
            onClick={onReset}
            className="rounded-lg bg-[#F2F6D7] px-3 py-2 text-[12px] font-medium text-[#647221] transition-colors hover:bg-[#E8F0C9]"
          >
            Hapus filter
          </button>
        </div>
      </div>
    </>
  );
}
