"use client";

import React from "react";
import { ExternalLink, X } from "lucide-react";

interface LembagaKonservasiDetailData {
  id: number;
  namaLembaga: string;
  namaDirektur: string | null;
  nomorTelepon: string | null;
  alamatLembaga: string | null;
  alamatKantor: string | null;
  koordinatLembaga: string | null;
  nomorSk: string | null;
  tanggalSk: string | null;
  akhirMasaBerlaku: string | null;
  penerbit: string | null;
  bidangKsda?: { namaWilayah: string } | null;
  seksiKonservasi?: { namaWilayah: string } | null;
  jenisTsl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface DetailDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LembagaKonservasiDetailData | null;
}

const formatDate = (value?: string | null) => {
  if (!value) return "dd mm yyyy";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function DetailDataModal({ isOpen, onClose, data }: Readonly<DetailDataModalProps>) {
  if (!isOpen || !data) return null;

  const jenisTsl = data.jenisTsl || "-";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-6 backdrop-blur-sm md:p-8 md:pt-8">
      <button
        type="button"
        aria-label="Tutup modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 focus:outline-none"
      />
      <div className="relative z-10 w-full max-w-260 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-lg bg-white px-5 pb-5 pt-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.26)] md:px-8 md:pb-6 md:pt-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup modal"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-black/5 hover:text-gray-800"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <header className="text-center">
          <h2 className="text-[18px] font-medium tracking-tight text-gray-900 md:text-[20px]">
            Detail Data Lembaga Konservasi TSL
          </h2>
        </header>

        <div className="mt-7 space-y-8">
          <div className="space-y-5">
            <SectionHeading>Informasi Umum</SectionHeading>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="flex flex-col gap-5">
                <ReadField id="detail-unit" label="Unit Lembaga Konservasi" value={data.namaLembaga} />
                <ReadField id="detail-direktur" label="Nama Direktur / Penanggung Jawab" value={data.namaDirektur} />
                <ReadField id="detail-telepon" label="Nomor Telepon" value={data.nomorTelepon} />
                <ReadField id="detail-alamat-lembaga" label="Alamat Lembaga Konservasi" value={data.alamatLembaga} />
              </div>
              <div className="flex flex-col gap-5">
                <ReadField id="detail-bidang" label="Bidang KSDA" value={data.bidangKsda?.namaWilayah} />
                <ReadField id="detail-seksi" label="Seksi Konservasi" value={data.seksiKonservasi?.namaWilayah} />
                <ReadField id="detail-alamat-kantor" label="Alamat Kantor" value={data.alamatKantor} />
                <ReadField id="detail-koordinat" label="Koordinat Lembaga Konservasi" value={data.koordinatLembaga} />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <SectionHeading>Informasi Perizinan</SectionHeading>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="flex flex-col gap-5">
                <ReadField id="detail-nomor-sk" label="Nomor SK / Sertifikat Standar" value={data.nomorSk} />
                <ReadFileField id="detail-file-sk" label="SK / Sertifikat Standar" value={data.nomorSk ? "Tersedia" : "-"} />
                <ReadField id="detail-penerbit" label="Penerbit" value={data.penerbit} />
              </div>
              <div className="flex flex-col gap-5">
                <ReadDateField id="detail-tanggal-sk" label="Tanggal SK / Sertifikat Standar" value={data.tanggalSk} />
                <ReadDateField id="detail-akhir-izin" label="Akhir Masa Berlaku Izin" value={data.akhirMasaBerlaku} />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <SectionHeading>Informasi TSL</SectionHeading>
            <div className="flex flex-col gap-5">
              <ReadField id="detail-jenis-tsl" label="Jenis TSL" value={jenisTsl} fullWidth />
            </div>
          </div>
        </div>

        <footer className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="text-[11px] font-medium text-[#9a9a9a]">
            Created at {formatDate(data.createdAt)} by Admin Pusat
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="text-[11px] font-medium text-[#9a9a9a]">
              Updated at {formatDate(data.updatedAt)} by Admin Pusat
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SectionHeading({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="text-[14px] font-semibold text-[#9aa51f]">{children}</div>;
}

function ReadField({
  id,
  label,
  value,
  fullWidth = false,
}: Readonly<{ id: string; label: string; value?: string | null; fullWidth?: boolean }>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label}
      </label>
      <input
        id={id}
        type="text"
        readOnly
        value={value ?? ""}
        className={`h-9 w-full rounded-[3px] border border-[#c9d0b6] bg-white px-3 text-[12px] text-gray-700 outline-none ${
          fullWidth ? "pr-3" : ""
        }`}
      />
    </div>
  );
}

function ReadDateField({ id, label, value }: Readonly<{ id: string; label: string; value?: string | null }>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label}
      </label>
      <input
        id={id}
        type="text"
        readOnly
        value={value ? new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }) : ""}
        className="h-9 w-full rounded-[3px] border border-[#c9d0b6] bg-white px-3 text-[12px] text-gray-700 outline-none"
      />
    </div>
  );
}

function ReadFileField({ id, label, value }: Readonly<{ id: string; label: string; value: string }>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          readOnly
          value={value}
          className="h-9 w-full rounded-[3px] border border-[#c9d0b6] bg-white px-3 pr-11 text-[12px] text-gray-700 outline-none"
        />
        <button
          type="button"
          className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-7.5 w-7.5 items-center justify-center rounded-md text-[#9aa51f]"
          aria-label="Lihat file"
          tabIndex={-1}
        >
          <ExternalLink className="h-4.5 w-4.5" strokeWidth={2.3} />
        </button>
      </div>
    </div>
  );
}