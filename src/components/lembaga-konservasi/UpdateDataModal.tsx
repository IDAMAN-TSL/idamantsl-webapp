"use client";

import React, { useRef, useState } from "react";
import { Calendar, ChevronDown, FileText, MapPin, Pencil, X } from "lucide-react";
import { AddDataAlertModal } from "@/components/layout/AddDataAlertModal";

interface UpdateDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
}

const BIDANG_OPTIONS = ["I. Bogor", "II. Soreang", "III. Ciamis"];
const SEKSI_OPTIONS = [
  "I. Serang",
  "II. Bogor",
  "III. Soreang",
  "IV. Purwakarta",
  "V. Garut",
  "VI. Tasikmalaya",
];
const JENIS_TSL_OPTIONS = ["Mamalia", "Aves", "Reptilia", "Amphibia", "Pisces"];

export function UpdateDataModal({ isOpen, onClose, data }: Readonly<UpdateDataModalProps>) {
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alertState, setAlertState] = useState<{isOpen: boolean; type: "success" | "error"; title?: string; message?: string}>({
    isOpen: false,
    type: "success"
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedFileName("");
    onClose();
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const formatFooterDate = (value?: string | null) => {
    if (!value) return "dd mm yyyy";

    return new Date(value).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleSave = () => {
    // Currently UI only, simulate validation error to show the alert
    const userStr = globalThis.window === undefined ? null : localStorage.getItem("user");
    const userRole = userStr ? JSON.parse(userStr).role : "";
    
    if (userRole === "admin_pusat") {
      setAlertState({ 
        isOpen: true, 
        type: "error",
        title: "Perbarui data gagal!",
        message: "Pastikan semua data terisi dengan benar."
      });
    } else {
      setAlertState({ 
        isOpen: true, 
        type: "error",
        title: "Perbarui data gagal!",
        message: "Terjadi kesalahan saat menyimpan perubahan."
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-6 backdrop-blur-sm md:p-8 md:pt-8">
      <button
        type="button"
        aria-label="Tutup modal"
        onClick={handleClose}
        className="absolute inset-0 bg-black/40 focus:outline-none"
      />
      <div className="relative z-10 w-full max-w-260 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-lg bg-white px-5 pb-5 pt-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.26)] md:px-8 md:pb-6 md:pt-8">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup modal"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-black/5 hover:text-gray-800"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <header className="text-center">
          <h2 className="text-[18px] font-medium tracking-tight text-gray-900 md:text-[20px]">
            Perbarui Data Lembaga Konservasi TSL
          </h2>
        </header>

        <div className="mt-7 space-y-8">
          <div className="space-y-5">
            <SectionHeading>Informasi Umum</SectionHeading>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="flex flex-col gap-5">
                <TextField id="unit-lembaga" label="Unit Lembaga Konservasi" />
                <TextField id="nama-direktur" label="Nama Direktur / Penanggung Jawab" />
                <TextField id="nomor-telepon" label="Nomor Telepon" />
                <TextField id="alamat-lembaga" label="Alamat Lembaga Konservasi" icon="location" />
              </div>
              <div className="flex flex-col gap-5">
                <SelectField id="bidang-ksda" label="Bidang KSDA" options={BIDANG_OPTIONS} />
                <SelectField id="seksi-konservasi" label="Seksi Konservasi" options={SEKSI_OPTIONS} />
                <TextField id="alamat-kantor" label="Alamat Kantor" icon="location" />
                <TextField id="koordinat-lembaga" label="Koordinat Lembaga Konservasi" icon="location" />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <SectionHeading>Informasi Perizinan</SectionHeading>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="flex flex-col gap-5">
                <TextField id="nomor-sk" label="Nomor SK / Sertifikat Standar" />
                <FileField
                  id="file-sk"
                  label="SK / Sertifikat Standar"
                  fileName={selectedFileName}
                  note="Pastikan file bertipe .pdf"
                  onPick={openFilePicker}
                />
                <TextField id="penerbit" label="Penerbit" />
              </div>
              <div className="flex flex-col gap-5">
                <DateField id="tanggal-sk" label="Tanggal SK / Sertifikat Standar" />
                <DateField id="akhir-masa-berlaku" label="Akhir Masa Berlaku Izin" />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <SectionHeading>Informasi TSL</SectionHeading>
            <div className="flex flex-col gap-5">
              <SelectField id="jenis-tsl" label="Jenis TSL" options={JENIS_TSL_OPTIONS} fullWidth />
            </div>
          </div>
        </div>

        <footer className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
          <div className="text-[11px] font-medium text-[#9a9a9a]">
            Created at {formatFooterDate(data?.createdAt)} by Admin Pusat
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="text-[11px] font-medium text-[#9a9a9a]">
               Updated at {formatFooterDate(data?.updatedAt)} by Admin Pusat
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-md bg-[#F59F00] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#d98b00]"
            >
              <Pencil className="h-4 w-4" strokeWidth={2.2} />
              Perbarui
            </button>
          </div>
        </footer>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name ?? "")}
        />
      </div>
      <AddDataAlertModal 
        isOpen={alertState.isOpen}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onClose={() => {
          setAlertState((prev) => ({ ...prev, isOpen: false }));
          if (alertState.type === "success") {
            onClose();
          }
        }}
      />
    </div>
  );
}

function SectionHeading({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="text-[14px] font-semibold text-[#9aa51f]">{children}</div>;
}

function TextField({
  id,
  label,
  icon,
}: Readonly<{ id: string; label: string; icon?: "location" }>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          className={`h-9 w-full rounded-[3px] border border-[#c9d0b6] bg-white px-3 text-[12px] text-gray-700 outline-none ${
            icon === "location" ? "pl-7" : ""
          }`}
        />
        {icon === "location" && (
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#9aa51f]">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
          </span>
        )}
      </div>
    </div>
  );
}

function SelectField({
  id,
  label,
  options,
  fullWidth = false,
}: Readonly<{
  id: string;
  label: string;
  options: string[];
  fullWidth?: boolean;
}>) {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? "md:col-span-2" : ""}`}>
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className="h-9 w-full appearance-none rounded-[3px] border border-[#c9d0b6] bg-white px-3 pr-8 text-[12px] text-gray-700 outline-none"
        >
          <option value="">Pilih</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#9aa51f]">
          <ChevronDown className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}

function DateField({ id, label }: Readonly<{ id: string; label: string }>) {
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
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="date"
          className="h-9 w-full rounded-[3px] border border-[#c9d0b6] bg-white px-3 pr-10 text-[12px] text-gray-700 outline-none appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
        />
        <button
          type="button"
          onClick={openDatePicker}
          aria-label={`Pilih tanggal untuk ${label}`}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9aa51f]"
        >
          <Calendar className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

function FileField({
  id,
  label,
  fileName,
  note,
  onPick,
}: Readonly<{
  id: string;
  label: string;
  fileName: string;
  note: string;
  onPick: () => void;
}>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label}
      </label>
      <div className="flex h-9 overflow-hidden rounded-[3px] border border-[#c9d0b6] bg-white">
        <button
          type="button"
          onClick={onPick}
          className="inline-flex items-center gap-2 border-r border-[#c9d0b6] bg-[#F6F7E6] px-3 text-[12px] font-medium text-[#8E9E25] transition-colors hover:bg-[#eef1d1]"
        >
          <FileText className="h-3.5 w-3.5" strokeWidth={2.2} />
          Pilih file
        </button>
        <div className="flex min-w-0 flex-1 items-center px-3 text-[12px] text-gray-400">
          <span className="truncate">{fileName || ""}</span>
        </div>
      </div>
      <p className="text-[10px] text-gray-400">{note}</p>
    </div>
  );
}