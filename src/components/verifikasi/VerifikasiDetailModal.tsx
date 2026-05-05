"use client";

import { X } from "lucide-react";

interface VerifikasiRow {
  id: string;
  tanggalPengajuan: string;
  jenisPengajuan: string;
  dataPengajuan: string;
  peran: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  alasanPenolakan?: string;
  tabelTarget?: string;
  targetId?: number;
  rawData?: any;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: VerifikasiRow | null;
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

export function VerifikasiDetailModal({ isOpen, onClose, data }: Readonly<Props>) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm md:p-8">
      <div className="relative w-full max-w-2xl rounded-[14px] bg-white px-8 py-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.3)]">
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
          Detail Data Pengajuan
        </h2>

        {/* ── Section 1: Informasi Pengajuan ── */}
        <p className="mt-6 text-[13px] font-semibold text-[#8E9E25]">Informasi Pengajuan</p>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-4">
            <ReadField label="Tanggal Pengajuan" value={data.tanggalPengajuan} />
            <ReadField label="Data Pengajuan" value={data.dataPengajuan} />
          </div>
          <div className="flex flex-col gap-4">
            <ReadField label="Jenis Pengajuan" value={data.jenisPengajuan} />
            <ReadField label="Peran" value={data.peran} />
          </div>
        </div>

        {/* ── Section 2: Status ── */}
        <p className="mt-6 text-[13px] font-semibold text-[#8E9E25]">Status Pengajuan</p>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-4">
            <ReadField label="Status" value={data.status} />
          </div>
          {data.status === "Ditolak" && (
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[12px] text-gray-500">Alasan Penolakan</label>
              <input
                type="text"
                readOnly
                value={data.alasanPenolakan ?? ""}
                className="h-8 w-full rounded-[3px] border border-[#E3E3E3] bg-[#FAFAFA] px-3 text-[12px] text-gray-700 outline-none"
              />
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-[11px] text-gray-400">
          <span>ID Pengajuan: <strong>#{data.id}</strong></span>
          <span>Data Pengajuan: <strong>{data.dataPengajuan || "—"}</strong></span>
        </div>
      </div>
    </div>
  );
}
