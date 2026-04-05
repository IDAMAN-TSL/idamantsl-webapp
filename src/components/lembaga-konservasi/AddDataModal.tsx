import React, { useState } from "react";
import { X, Save, Calendar, ChevronDown, Trash2, Upload } from "lucide-react";
import { UploadDocModal } from "@/components/ui/UploadDocModal";

interface AddDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddDataModal({ isOpen, onClose }: AddDataModalProps) {
  const [uploadOpen, setUploadOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/40 backdrop-blur-sm p-4 md:p-8">
      {/* Modal Container */}
      <div
        className="w-full max-w-5xl rounded-[32px] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative"
        style={{ backgroundColor: "#edf0deff" }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-[22px] font-extrabold text-gray-900 tracking-tight">
            Formulir Lembaga Konservasi TSL
          </h2>
          <p className="text-sm font-medium text-gray-600 mt-1">
            Isi data dengan baik dan benar
          </p>
        </div>

        {/* Form Body - 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Left Column — 6 fields */}
          <div className="flex flex-col gap-6">
            <InputField label="Nama Unit Lembaga" />
            <InputField label="Alamat Lembaga" />
            <InputField label="Koordinat Lokasi Lembaga" />
            <InputField label="No. SK / Sertifikat Standar" />

            {/* Tanggal SK */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-extrabold text-[#111] ml-1">
                Tanggal SK
              </label>
              <div className="relative">
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-[34px] w-[34px] rounded-[10px] bg-[#5B7943] flex items-center justify-center pointer-events-none z-10">
                  <Calendar className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
                </div>
                <input
                  type="date"
                  className="h-12 w-full rounded-[14px] border border-white/50 pl-[52px] pr-4 outline-none focus:ring-2 focus:ring-[#5B7943]/50 transition-all text-sm text-gray-800 cursor-pointer"
                  style={{
                    backgroundColor: "#EEF0E5",
                    boxShadow: "0 6px 12px -2px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.5)",
                    colorScheme: "light",
                  }}
                />
              </div>
            </div>

            <InputField label="Penerbit" />
          </div>

          {/* Right Column — 5 items */}
          <div className="flex flex-col gap-6">
            {/* Akhir Masa Berlaku Izin */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-extrabold text-[#111] ml-1">
                Akhir Masa Berlaku Izin
              </label>
              <div className="relative">
                <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-[34px] w-[34px] rounded-[10px] bg-[#5B7943] flex items-center justify-center pointer-events-none z-10">
                  <Calendar className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
                </div>
                <input
                  type="date"
                  className="h-12 w-full rounded-[14px] border border-white/50 pl-[52px] pr-4 outline-none focus:ring-2 focus:ring-[#5B7943]/50 transition-all text-sm text-gray-800 cursor-pointer"
                  style={{
                    backgroundColor: "#EEF0E5",
                    boxShadow: "0 6px 12px -2px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.5)",
                    colorScheme: "light",
                  }}
                />
              </div>
            </div>

            <InputField label="Nama Direktur / Penanggung Jawab" />
            <InputField label="No Telepon" />

            {/* Status — single dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-extrabold text-[#111] ml-1">
                Status
              </label>
              <div className="relative">
                <select
                  className="h-12 w-full rounded-[14px] border border-white/50 pl-4 pr-[52px] outline-none appearance-none focus:ring-2 focus:ring-[#5B7943]/50 transition-all text-sm text-gray-800"
                  style={{
                    backgroundColor: "#EEF0E5",
                    boxShadow: "0 6px 12px -2px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.5)",
                  }}
                >
                  <option value="">-- Pilih Status --</option>
                  <option value="aktif">Aktif</option>
                  <option value="tidak-aktif">Tidak Aktif</option>
                  <option value="proses">Dalam Proses</option>
                </select>
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 h-[34px] w-[34px] rounded-[10px] bg-[#5B7943] flex items-center justify-center pointer-events-none">
                  <ChevronDown className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Split Row: Bidang KSDA Wilayah & Seksi Konservasi Wilayah */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-extrabold text-[#111] ml-1">
                  Bidang KSDA Wilayah
                </label>
                <div className="relative">
                  <select
                    className="h-12 w-full rounded-[14px] border border-white/50 pl-4 pr-[44px] outline-none appearance-none focus:ring-2 focus:ring-[#5B7943]/50 transition-all text-sm text-gray-800"
                    style={{
                      backgroundColor: "#EEF0E5",
                      boxShadow: "0 6px 12px -2px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.5)",
                    }}
                  >
                    <option value="">-- Pilih Bidang --</option>
                    <option value="I">I – Bogor</option>
                    <option value="II">II – Soreang</option>
                    <option value="III">III – Ciamis</option>
                  </select>
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 h-[30px] w-[30px] rounded-[8px] bg-[#5B7943] flex items-center justify-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-extrabold text-[#111] ml-1">
                  Seksi Konservasi Wilayah
                </label>
                <div className="relative">
                  <select
                    className="h-12 w-full rounded-[14px] border border-white/50 pl-4 pr-[44px] outline-none appearance-none focus:ring-2 focus:ring-[#5B7943]/50 transition-all text-sm text-gray-800"
                    style={{
                      backgroundColor: "#EEF0E5",
                      boxShadow: "0 6px 12px -2px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.5)",
                    }}
                  >
                    <option value="">-- Pilih Seksi --</option>
                    <option value="I">I – Serang</option>
                    <option value="II">II – Bogor</option>
                    <option value="III">III – Soreang</option>
                    <option value="IV">IV – Purwakarta</option>
                    <option value="V">V – Garut</option>
                    <option value="VI">VI – Tasikmalaya</option>
                  </select>
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 h-[30px] w-[30px] rounded-[8px] bg-[#5B7943] flex items-center justify-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex items-center justify-between gap-4">
          {/* Kiri: Unggah */}
          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#5B7943] hover:bg-[#4a6336] px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(91,121,67,0.3)] transition-all active:scale-95"
          >
            <Upload className="h-5 w-5" strokeWidth={2.5} />
            Unggah
          </button>
          {/* Kanan: Batal + Simpan */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(245,158,11,0.35)] transition-all active:scale-95"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
              Batal
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-[#5B7943] hover:bg-[#4a6336] px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(91,121,67,0.3)] transition-all active:scale-95">
              <Save className="h-5 w-5" strokeWidth={2.5} />
              Simpan
            </button>
          </div>
        </div>

        {/* Upload Doc Modal */}
        <UploadDocModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
      </div>
    </div>
  );
}

{/* Helper component for generic inputs */}
function InputField({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-extrabold text-[#111] ml-1">
        {label}
      </label>
      <input
        type="text"
        className="h-12 w-full rounded-[14px] border border-white/50 px-4 outline-none focus:ring-2 focus:ring-[#5B7943]/50 transition-all text-sm text-gray-800"
        style={{
          backgroundColor: "#EEF0E5",
          boxShadow: "0 6px 12px -2px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.5)",
        }}
      />
    </div>
  );
}
