"use client";

import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  FileText,
  MapPin,
} from "lucide-react";

interface AddDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = ["Informasi Umum", "Informasi Perizinan", "Informasi TSL"];

export function AddDataModal({ isOpen, onClose }: Readonly<AddDataModalProps>) {
  const [step, setStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    tanggalSk: "",
    akhirMasaBerlaku: "",
  });
  const [errors] = useState<Record<string, string>>({});

  const setField = (key: keyof typeof formData, value: string) =>
    setFormData((previous) => ({ ...previous, [key]: value }));

  if (!isOpen) return null;

  const goNext = () => setStep((previous) => Math.min(previous + 1, steps.length - 1));
  const goPrevious = () => setStep((previous) => Math.max(previous - 1, 0));
  const closeAndReset = () => {
    setStep(0);
    setSelectedFile(null);
    setFormData({ tanggalSk: "", akhirMasaBerlaku: "" });
    onClose();
  };

  const handleSubmit = () => {
    closeAndReset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm md:p-8">
      <div className="relative w-full max-w-4xl rounded-[14px] bg-white px-6 py-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.35)] md:px-8 md:py-7">
        <button
          onClick={closeAndReset}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Tutup modal"
        >
          <X className="h-5 w-5" strokeWidth={2.2} />
        </button>

        <div className="text-center">
          <h2 className="text-[15px] font-medium text-gray-900 md:text-[16px]">
            Tambah Data Pengedar DN TSL
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[12px] md:text-[13px]">
          {steps.map((label, index) => {
            const active = index === step;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setStep(index)}
                className="pb-2"
              >
                <span className={active ? "font-medium text-[#8E9E25]" : "text-gray-400"}>
                  {label}
                </span>
                <span
                  className={`mt-2 block h-px w-full ${active ? "bg-[#8E9E25]" : "bg-gray-200"}`}
                />
              </button>
            );
          })}
        </div>

        {step === 0 && (
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <Field label="Unit Pengedar DN" />
              <Field label="Nama Direktur / Penanggung Jawab" />
              <Field label="Nomor Telepon" />
              <Field label="Alamat Pengedar DN" withLocationIcon />
            </div>

            <div className="flex flex-col gap-4">
              <SelectField label="Bidang KSDA" options={["I. Bogor", "II. Soreang", "III. Ciamis"]} />
              <SelectField
                label="Seksi Konservasi"
                options={[
                  "I. Serang",
                  "II. Bogor",
                  "III. Soreang",
                  "IV. Purwakarta",
                  "V. Garut",
                  "VI. Tasikmalaya",
                ]}
              />
              <Field label="Alamat Kantor" withLocationIcon />
              <Field label="Koordinat Pengedar DN" withLocationIcon />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <Field label="Nomor SK / Sertifikat Standar" />
              <FilePicker
                label="SK / Sertifikat Standar"
                fileName={selectedFile?.name}
                onPick={() => document.getElementById("add-data-upload-input")?.click()}
              />
              <Field label="Penerbit" />
            </div>

            <div className="flex flex-col gap-4">
              <DateField
                id="tanggal-sk"
                label="Tanggal SK / Sertifikat Standar"
                value={formData.tanggalSk}
                onChange={(value) => setField("tanggalSk", value)}
                required
                error={errors.tanggalSk}
              />
              <DateField
                id="akhir-masa-berlaku"
                label="Akhir Masa Berlaku Izin"
                value={formData.akhirMasaBerlaku}
                onChange={(value) => setField("akhirMasaBerlaku", value)}
                required
                error={errors.akhirMasaBerlaku}
              />
            </div>

            <input
              id="add-data-upload-input"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <SelectField
                label="Jenis TSL"
                options={[
                  "Tumbuhan",
                  "Satwa",
                  "Tumbuhan dan Satwa",
                ]}
                fullWidth
              />
            </div>

            <Field label="Indukan Jantan" />
            <Field label="Indukan Betina" />
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {step > 0 ? (
              <button
                type="button"
                onClick={goPrevious}
                className="inline-flex items-center gap-2 rounded-md border border-[#D4DB8B] bg-[#F6F7E6] px-4 py-2 text-[12px] font-medium text-[#8E9E25] transition-colors hover:bg-[#eef1d1]"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
                Sebelumnya
              </button>
            ) : (
              <span />
            )}
          </div>

          <div className="flex justify-end">
            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 rounded-md border border-[#D4DB8B] bg-[#F6F7E6] px-4 py-2 text-[12px] font-medium text-[#8E9E25] transition-colors hover:bg-[#eef1d1]"
              >
                Lanjut
                <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-md bg-[#8E9E25] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#7e8d20]"
              >
                <Plus className="h-4 w-4" strokeWidth={2.2} />
                Tambah
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type FieldProps = Readonly<{
  label: string;
  withLocationIcon?: boolean;
}>;

function Field({ label, withLocationIcon = false }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] text-gray-500">{label}</label>
      <div className="relative">
        <input
          type="text"
          className={`h-8 w-full rounded-[3px] border border-[#C7D0AF] bg-white px-3 text-[12px] text-gray-800 outline-none focus:ring-1 focus:ring-[#8E9E25] ${
            withLocationIcon ? "pl-7" : ""
          }`}
        />
        {withLocationIcon && (
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#8E9E25]">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
          </span>
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  options,
  fullWidth = false,
}: Readonly<{
  label: string;
  options: string[];
  fullWidth?: boolean;
}>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] text-gray-500">{label}</label>
      <div className="relative">
        <select
          className={`h-8 w-full appearance-none rounded-[3px] border border-[#C7D0AF] bg-white px-3 text-[12px] text-gray-800 outline-none focus:ring-1 focus:ring-[#8E9E25] ${
            fullWidth ? "" : "pr-7"
          }`}
        >
          <option value=""></option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8E9E25]">
          <ChevronDown className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}

function DateField({
  id,
  label,
  value,
  onChange,
  required = false,
  error,
}: Readonly<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
}>) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const openDatePicker = () => {
    const input = inputRef.current;
    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.focus();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] text-gray-500">{label} {required && <span className="text-red-600">*</span>}</label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-8 w-full rounded-[3px] bg-white px-3 pr-7 text-[12px] text-gray-800 outline-none appearance-none focus:ring-1 focus:ring-[#8E9E25] [&::-webkit-calendar-picker-indicator]:opacity-0 ${error ? "border border-red-500" : "border border-[#C7D0AF]"}`}
        />
        <button
          type="button"
          onClick={openDatePicker}
          aria-label={`Pilih tanggal untuk ${label}`}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8E9E25]"
        >
          <Calendar className="h-4 w-4" strokeWidth={2} />
        </button>
        {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
      </div>
    </div>
  );
}

function FilePicker({
  label,
  fileName,
  onPick,
}: Readonly<{
  label: string;
  fileName?: string;
  onPick: () => void;
}>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] text-gray-500">{label}</label>
      <div className="flex h-8 overflow-hidden rounded-[3px] border border-[#C7D0AF] bg-white">
        <button
          type="button"
          onClick={onPick}
          className="inline-flex items-center gap-2 border-r border-[#C7D0AF] bg-[#F6F7E6] px-3 text-[12px] text-[#8E9E25] transition-colors hover:bg-[#eef1d1]"
        >
          <FileText className="h-3.5 w-3.5" strokeWidth={2} />
          Pilih file
        </button>
        <div className="flex min-w-0 flex-1 items-center px-3 text-[12px] text-gray-400">
          <span className="truncate">{fileName ?? ""}</span>
        </div>
      </div>
      <p className="text-[10px] text-gray-400">Pastikan file bertipe .pdf</p>
    </div>
  );
}
