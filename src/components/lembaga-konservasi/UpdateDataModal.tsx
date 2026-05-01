import React from "react";
import { X, Save, Trash2, Calendar, ChevronDown } from "lucide-react";

interface UpdateDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateDataModal({ isOpen, onClose }: Readonly<UpdateDataModalProps>) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm md:p-8">
      <div className="relative w-full max-w-4xl rounded-[14px] bg-white px-6 py-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.35)] md:px-8 md:py-7">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Tutup modal"
        >
          <X className="h-5 w-5" strokeWidth={2.2} />
        </button>

        <div className="text-center">
          <h2 className="text-[15px] font-medium text-gray-900 md:text-[16px]">
            Perbarui Data Lembaga Konservasi TSL
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Field label="Nama Unit Lembaga" />
            <Field label="Nama Direktur / Penanggung Jawab" />
            <Field label="Nomor Telepon" />
            <Field label="Lokasi Kantor" />
            <Field label="Alamat Lembaga" />
            <Field label="Koordinat Lokasi Lembaga" withLocationIcon />
          </div>

          <div className="flex flex-col gap-4">
            <SelectField
              label="Bidang KSDA Wilayah"
              options={["I – Bogor", "II – Soreang", "III – Ciamis"]}
            />
            <SelectField
              label="Seksi Konservasi Wilayah"
              options={[
                "I – Serang",
                "II – Bogor",
                "III – Soreang",
                "IV – Purwakarta",
                "V – Garut",
                "VI – Tasikmalaya",
              ]}
            />
            <Field label="No. SK / Sertifikat Standar" />
            <DateField label="Tanggal SK" />
            <DateField label="Akhir Masa Berlaku Izin" />
            <Field label="Penerbit" />
            <SelectField
              label="Status"
              options={["Aktif", "Tidak Aktif", "Dalam Proses"]}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-red-700 sm:w-auto">
            <Trash2 className="h-4.5 w-4.5" strokeWidth={2.5} />
            Hapus
          </button>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-[14px] font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8E9E25] px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#7e8d20]"
            >
              <Save className="h-4.5 w-4.5" strokeWidth={2.4} />
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, withLocationIcon = false }: Readonly<{ label: string; withLocationIcon?: boolean }>) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] text-gray-700">
      <span className="font-medium">{label}</span>
      <div className="relative">
        <input
          type="text"
          className={`w-full rounded-xl border border-gray-200 bg-white py-2.5 text-[14px] text-gray-800 shadow-sm outline-none transition-all focus:border-[#8E9E25] focus:ring-2 focus:ring-[#8E9E25]/20 ${
            withLocationIcon ? "pl-10 pr-3" : "px-3"
          }`}
        />
        {withLocationIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-gray-400">
            +
          </span>
        )}
      </div>
    </label>
  );
}

function DateField({ label }: Readonly<{ label: string }>) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] text-gray-700">
      <span className="font-medium">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 inline-flex items-center text-gray-400">
          <Calendar className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <input
          type="date"
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-[14px] text-gray-800 shadow-sm outline-none transition-all focus:border-[#8E9E25] focus:ring-2 focus:ring-[#8E9E25]/20"
        />
      </div>
    </label>
  );
}

function SelectField({
  label,
  options,
}: Readonly<{
  label: string;
  options: string[];
}>) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] text-gray-700">
      <span className="font-medium">{label}</span>
      <div className="relative">
        <select className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-10 text-[14px] text-gray-800 shadow-sm outline-none transition-all focus:border-[#8E9E25] focus:ring-2 focus:ring-[#8E9E25]/20">
          <option value="">Pilih</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 inline-flex items-center text-gray-400">
          <ChevronDown className="h-4 w-4" strokeWidth={2.2} />
        </span>
      </div>
    </label>
  );
}
