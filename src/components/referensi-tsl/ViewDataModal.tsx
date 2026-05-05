"use client";

import React from "react";
import { X } from "lucide-react";

interface ReferensiTSL {
  id: number;
  namaDaerah: string;
  jenis?: string | null;
  kingdom?: string | null;
  divisi?: string | null;
  kelas?: string | null;
  ordo?: string | null;
  famili?: string | null;
  genus?: string | null;
  spesies?: string | null;
  statusPerlindunganNasional?: string | null;
  statusCites?: string | null;
  statusIucn?: string | null;
  namaInputor?: string | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}

interface ViewDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReferensiTSL | null;
}

function formatDate(value?: string | Date | null): string {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

function humanize(value?: string | null): string {
  if (!value) return "—";
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ViewDataModal({ isOpen, onClose, data }: Readonly<ViewDataModalProps>) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm md:p-8">
      <div className="relative w-full max-w-3xl rounded-[14px] bg-white px-8 py-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.3)]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" strokeWidth={2.2} />
        </button>

        {/* Title */}
        <h2 className="text-center text-[15px] font-medium text-gray-900 md:text-[16px]">
          Detail Data Referensi TSL
        </h2>

        {/* ── Section 1: Informasi Umum ── */}
        <p className="mt-6 text-[13px] font-semibold text-[#8E9E25]">Informasi Umum</p>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Left */}
          <div className="flex flex-col gap-4">
            <ReadField label="Nama Daerah" value={data.namaDaerah} />
            <ReadField label="Jenis" value={humanize(data.jenis)} />
            <ReadField label="Kingdom" value={data.kingdom} />
            <ReadField label="Divisi" value={data.divisi} />
            <ReadField label="Kelas" value={data.kelas} />
          </div>
          {/* Right */}
          <div className="flex flex-col gap-4">
            <ReadField label="Ordo" value={data.ordo} />
            <ReadField label="Family" value={data.famili} />
            <ReadField label="Genus" value={data.genus} />
            <ReadField label="Spesies" value={data.spesies} />
          </div>
        </div>

        {/* ── Section 2: Informasi Status ── */}
        <p className="mt-6 text-[13px] font-semibold text-[#8E9E25]">Informasi Status</p>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-4">
            <ReadField label="Status Perlindungan Nasional" value={humanize(data.statusPerlindunganNasional)} />
            <ReadField label="Status CITES" value={humanize(data.statusCites)} />
          </div>
          <div className="flex flex-col gap-4">
            <ReadField label="Status IUCN" value={humanize(data.statusIucn)} />
          </div>
        </div>

        {/* ── Footer timestamps ── */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-[11px] text-gray-400">
          <span>
            Created at <strong>{formatDate(data.createdAt)}</strong>
            {data.namaInputor ? ` by ${data.namaInputor}` : ""}
          </span>
          <span>
            Updated at <strong>{formatDate(data.updatedAt)}</strong>
            {data.namaInputor ? ` by ${data.namaInputor}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

function ReadField({
  label,
  value,
}: Readonly<{ label: string; value?: string | null }>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] text-gray-500">{label}</label>
      <input
        type="text"
        readOnly
        value={value ?? ""}
        className="h-8 w-full rounded-[3px] border border-[#E3E3E3] bg-[#FAFAFA] px-3 text-[12px] text-gray-700 outline-none"
      />
    </div>
  );
}
