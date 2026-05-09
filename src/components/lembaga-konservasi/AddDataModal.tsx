"use client";

import React, { useState, useRef } from "react";
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
  onSuccess?: () => void;
}

const steps = ["Informasi Umum", "Informasi Perizinan", "Informasi TSL"];

export function AddDataModal({ isOpen, onClose, onSuccess }: Readonly<AddDataModalProps>) {
  const [step, setStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    namaLembaga: "",
    namaDirektur: "",
    nomorTelepon: "",
    alamatLembaga: "",
    bidangKsdaId: "",
    seksiKonservasiId: "",
    alamatKantor: "",
    koordinatLembaga: "",
    nomorSk: "",
    penerbit: "",
    tanggalSk: "",
    akhirMasaBerlaku: "",
    tslId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (key: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  if (!isOpen) return null;

  const goBack = () => setStep((previous) => Math.max(previous - 1, 0));
  
  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    const isEmpty = (v?: string) => !v || v.trim() === "";
    
    if (s === 0) {
      if (isEmpty(formData.namaLembaga)) e.namaLembaga = "Field ini wajib diisi";
      if (isEmpty(formData.namaDirektur)) e.namaDirektur = "Field ini wajib diisi";
      if (isEmpty(formData.nomorTelepon)) e.nomorTelepon = "Field ini wajib diisi";
      else if (!/^08\d+$/.test(formData.nomorTelepon)) e.nomorTelepon = "Nomor telepon harus numerik dan diawali 08";
      if (isEmpty(formData.alamatLembaga)) e.alamatLembaga = "Field ini wajib diisi";
      if (isEmpty(formData.bidangKsdaId)) e.bidangKsdaId = "Pilih bidang KSDA";
      if (isEmpty(formData.seksiKonservasiId)) e.seksiKonservasiId = "Pilih seksi konservasi";
      if (isEmpty(formData.alamatKantor)) e.alamatKantor = "Field ini wajib diisi";
      if (isEmpty(formData.koordinatLembaga)) e.koordinatLembaga = "Field ini wajib diisi";
    }
    
    if (s === 1) {
      if (isEmpty(formData.nomorSk)) e.nomorSk = "Field ini wajib diisi";
      if (!selectedFile) e.file = "Unggah file SK";
      if (isEmpty(formData.penerbit)) e.penerbit = "Field ini wajib diisi";
      if (isEmpty(formData.tanggalSk)) e.tanggalSk = "Pilih tanggal SK";
      if (isEmpty(formData.akhirMasaBerlaku)) e.akhirMasaBerlaku = "Pilih akhir masa berlaku";
    }
    
    if (s === 2) {
      if (isEmpty(formData.tslId)) e.tslId = "Pilih jenis TSL";
    }
    
    return e;
  };

  const goNextValidated = () => {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length === 0) setStep((previous) => Math.min(previous + 1, steps.length - 1));
  };

  const closeAndReset = () => {
    setStep(0);
    setSelectedFile(null);
    setFormData({
      namaLembaga: "",
      namaDirektur: "",
      nomorTelepon: "",
      alamatLembaga: "",
      bidangKsdaId: "",
      seksiKonservasiId: "",
      alamatKantor: "",
      koordinatLembaga: "",
      nomorSk: "",
      penerbit: "",
      tanggalSk: "",
      akhirMasaBerlaku: "",
      tslId: "",
    });
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const e: Record<string, string> = {};
      const isEmpty = (v?: string) => !v || v.trim() === "";
      
      Object.keys(formData).forEach((k) => {
        const key = k as keyof typeof formData;
        if (isEmpty(formData[key])) e[key] = "Field ini wajib diisi";
      });
      
      if (!/^08\d+$/.test(formData.nomorTelepon)) e.nomorTelepon = "Nomor telepon harus numerik dan diawali 08";
      if (!selectedFile) e.file = "File SK wajib diunggah";
      
      if (Object.keys(e).length > 0) {
        setErrors(e);
        setIsLoading(false);
        return;
      }

      const token = globalThis.window === undefined ? null : localStorage.getItem("token");
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

      const payload = {
        namaLembaga: formData.namaLembaga,
        namaDirektur: formData.namaDirektur,
        nomorTelepon: formData.nomorTelepon,
        alamatLembaga: formData.alamatLembaga,
        alamatKantor: formData.alamatKantor,
        koordinatLembaga: formData.koordinatLembaga,
        nomorSk: formData.nomorSk,
        penerbit: formData.penerbit,
        tanggalSk: formData.tanggalSk || null,
        akhirMasaBerlaku: formData.akhirMasaBerlaku || null,
        bidangKsdaId: formData.bidangKsdaId ? Number(formData.bidangKsdaId) : null,
        seksiKonservasiId: formData.seksiKonservasiId ? Number(formData.seksiKonservasiId) : null,
        tslId: formData.tslId ? Number(formData.tslId) : null,
      };

      const res = await fetch(`${url}/api/lembaga-konservasi`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      
      if (result.success) {
        if (onSuccess) onSuccess();
        closeAndReset();
      } else if (result.errors && typeof result.errors === "object") {
        setErrors(result.errors);
      } else {
        alert(result.message || "Gagal menambah data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  }

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
            Tambah Data Lembaga Konservasi TSL
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
              <Field
                label="Lembaga Konservasi"
                withLocationIcon={false}
                value={formData.namaLembaga}
                onChange={(v) => setField("namaLembaga", v)}
                required
                error={errors.namaLembaga}
              />
              <Field
                label="Nama Direktur / Penanggung Jawab"
                value={formData.namaDirektur}
                onChange={(v) => setField("namaDirektur", v)}
                required
                error={errors.namaDirektur}
              />
              <Field
                label="Nomor Telepon"
                value={formData.nomorTelepon}
                onChange={(v) => setField("nomorTelepon", v.replaceAll(/\D/g, ""))}
                required
                error={errors.nomorTelepon}
              />
              <Field
                label="Alamat Lembaga Konservasi"
                withLocationIcon
                value={formData.alamatLembaga}
                onChange={(v) => setField("alamatLembaga", v)}
                required
                error={errors.alamatLembaga}
              />
            </div>

            <div className="flex flex-col gap-4">
              <SelectField
                label="Bidang KSDA"
                options={[
                  { label: "I. Bogor", value: "1" },
                  { label: "II. Soreang", value: "2" },
                  { label: "III. Ciamis", value: "3" },
                ]}
                value={formData.bidangKsdaId}
                onChange={(v) => setField("bidangKsdaId", v)}
                required
                error={errors.bidangKsdaId}
              />
              <SelectField
                label="Seksi Konservasi"
                options={[
                  { label: "I. Serang", value: "4" },
                  { label: "II. Bogor", value: "5" },
                  { label: "III. Soreang", value: "6" },
                  { label: "IV. Purwakarta", value: "7" },
                  { label: "V. Garut", value: "8" },
                  { label: "VI. Tasikmalaya", value: "9" },
                ]}
                value={formData.seksiKonservasiId}
                onChange={(v) => setField("seksiKonservasiId", v)}
                required
                error={errors.seksiKonservasiId}
              />
              <Field
                label="Alamat Kantor"
                withLocationIcon={false}
                value={formData.alamatKantor}
                onChange={(v) => setField("alamatKantor", v)}
                required
                error={errors.alamatKantor}
              />
              <Field
                label="Koordinat Lembaga Konservasi"
                withLocationIcon
                value={formData.koordinatLembaga}
                onChange={(v) => setField("koordinatLembaga", v)}
                required
                error={errors.koordinatLembaga}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <Field
                label="Nomor SK / Sertifikat Standar"
                value={formData.nomorSk}
                onChange={(v) => setField("nomorSk", v)}
                required
                error={errors.nomorSk}
              />
              <FilePicker
                label="SK / Sertifikat Standar"
                fileName={selectedFile?.name}
                onPick={() => document.getElementById("add-data-upload-input")?.click()}
                required
                error={errors.file}
              />
              <Field
                label="Penerbit"
                value={formData.penerbit}
                onChange={(v) => setField("penerbit", v)}
                required
                error={errors.penerbit}
              />
            </div>

            <div className="flex flex-col gap-4">
              <DateField
                id="tanggal-sk"
                label="Tanggal SK / Sertifikat Standar"
                value={formData.tanggalSk}
                onChange={(v) => setField("tanggalSk", v)}
                required
                error={errors.tanggalSk}
              />
              <DateField
                id="akhir-masa-berlaku"
                label="Akhir Masa Berlaku Izin"
                value={formData.akhirMasaBerlaku}
                onChange={(v) => setField("akhirMasaBerlaku", v)}
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
                  { label: "Mamalia", value: "1" },
                  { label: "Aves", value: "2" },
                  { label: "Reptilia", value: "3" },
                  { label: "Amphibia", value: "4" },
                  { label: "Pisces", value: "5" },
                ]}
                value={formData.tslId}
                onChange={(v) => setField("tslId", v)}
                required
                error={errors.tslId}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
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
                onClick={goNextValidated}
                className="inline-flex items-center gap-2 rounded-md border border-[#D4DB8B] bg-[#F6F7E6] px-4 py-2 text-[12px] font-medium text-[#8E9E25] transition-colors hover:bg-[#eef1d1]"
              >
                Lanjut
                <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-md bg-[#8E9E25] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#7e8d20] disabled:opacity-50"
              >
                <Plus className="h-4 w-4" strokeWidth={2.2} />
                {isLoading ? "Menyimpan..." : "Tambah"}
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
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
}>;

function Field({ label, withLocationIcon = false, value, onChange, required = false, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] text-gray-500">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-8 w-full rounded-[3px] bg-white px-3 text-[12px] text-gray-800 outline-none focus:ring-1 focus:ring-[#8E9E25] ${
            withLocationIcon ? "pl-7" : ""
          } ${error ? "border border-red-500" : "border border-[#C7D0AF]"}`}
        />
        {withLocationIcon && (
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#8E9E25]">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
          </span>
        )}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
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
  const inputRef = useRef<HTMLInputElement>(null);

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
          onChange={(e) => onChange(e.target.value)}
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
  required = false,
  error,
}: Readonly<{
  label: string;
  fileName?: string;
  onPick: () => void;
  required?: boolean;
  error?: string;
}>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] text-gray-500">{label} {required && <span className="text-red-600">*</span>}</label>
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
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  options,
  fullWidth = false,
  value,
  onChange,
  required = false,
  error,
}: Readonly<{
  label: string;
  options: { label: string; value: string }[];
  fullWidth?: boolean;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
}>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] text-gray-500">{label} {required && <span className="text-red-600">*</span>}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-8 w-full appearance-none rounded-[3px] bg-white px-3 text-[12px] text-gray-800 outline-none focus:ring-1 focus:ring-[#8E9E25] ${
            fullWidth ? "" : "pr-7"
          } ${error ? "border border-red-500" : "border border-[#C7D0AF]"}`}
        >
          <option value=""></option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8E9E25]">
          <ChevronDown className="h-4 w-4" strokeWidth={2} />
        </span>
        {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
      </div>
    </div>
  );
}
