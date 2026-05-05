"use client";

import React, { useState } from "react";
import { X, ChevronDown, MapPin } from "lucide-react";

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData?: {
    id: number;
    namaLengkap: string;
    email: string;
    nomorTelepon: string;
    seksiKonservasi: string;
    alamatKantor: string;
    status: "Aktif" | "Non-aktif";
  };
}

export function UpdateUserModal({
  isOpen,
  onClose,
  userData,
}: Readonly<UpdateUserModalProps>) {
  const [formData, setFormData] = useState({
    namaLengkap: userData?.namaLengkap || "",
    email: userData?.email || "",
    nomorTelepon: userData?.nomorTelepon || "",
    seksiKonservasi: userData?.seksiKonservasi || "",
    alamatKantor: userData?.alamatKantor || "",
    status: userData?.status || ("Aktif" as const),
  });

  if (!isOpen || !userData) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "Aktif" ? "Non-aktif" : "Aktif",
    }));
  };

  const handleSubmit = () => {
    // Handle save logic here
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm md:p-8">
      <div className="relative w-full max-w-2xl rounded-xl bg-white px-6 py-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)] md:px-8 md:py-7">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#A0A0A0] transition-colors hover:bg-gray-100 hover:text-[#666666]"
          aria-label="Tutup modal"
        >
          <X className="h-5 w-5" strokeWidth={2.2} />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-[18px] font-semibold tracking-tight text-[#171717]">
            Ubah Data Pengguna
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <Field
                label="Nama Lengkap"
                placeholder="Nama lengkap"
                value={formData.namaLengkap}
                onChange={(value) => handleInputChange("namaLengkap", value)}
              />
              <Field
                label="Email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(value) => handleInputChange("email", value)}
              />
              <Field
                label="Nomor Telepon"
                placeholder="Nomor telepon"
                value={formData.nomorTelepon}
                onChange={(value) => handleInputChange("nomorTelepon", value)}
              />
            </div>

            <div className="flex flex-col gap-4">
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
                value={formData.seksiKonservasi}
                onChange={(value) => handleInputChange("seksiKonservasi", value)}
              />
              <FieldWithIcon
                label="Alamat Kantor"
                placeholder="Alamat kantor"
                value={formData.alamatKantor}
                onChange={(value) => handleInputChange("alamatKantor", value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[#E0E0E0] bg-[#F9F9F9] px-4 py-3">
            <div>
              <p className="text-[13px] font-semibold text-[#2F2F2F]">Status Pengguna</p>
              <p className="text-[12px] text-[#7A7A7A]">
                {formData.status === "Aktif" ? "Pengguna aktif di sistem" : "Pengguna non-aktif di sistem"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleStatusToggle}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 transition-colors ${
                formData.status === "Aktif"
                  ? "border-[#8E9E25] bg-[#8E9E25]"
                  : "border-[#D0D0D0] bg-[#E8E8E8]"
              }`}
              aria-label="Toggle status"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  formData.status === "Aktif" ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-[#D4D4D4] bg-white px-4 py-2 text-[13px] font-medium text-[#4D4D4D] transition-colors hover:bg-[#FAFAFA]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-md bg-[#8E9E25] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#7F8F20]"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

type FieldProps = Readonly<{
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}>;

function Field({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#4F4F4F]">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded-sm border border-[#D4D4D4] bg-white px-3 text-[13px] text-[#252525] outline-none placeholder:text-[#B0B0B0] focus:border-[#8E9E25] focus:ring-1 focus:ring-[#8E9E25]/20"
      />
    </div>
  );
}

type FieldWithIconProps = Readonly<{
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}>;

function FieldWithIcon({
  label,
  placeholder = "",
  value,
  onChange,
}: FieldWithIconProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#4F4F4F]">{label}</label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-full rounded-sm border border-[#D4D4D4] bg-white pl-8 pr-3 text-[13px] text-[#252525] outline-none placeholder:text-[#B0B0B0] focus:border-[#8E9E25] focus:ring-1 focus:ring-[#8E9E25]/20"
        />
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8E9E25]">
          <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
        </span>
      </div>
    </div>
  );
}

type SelectFieldProps = Readonly<{
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}>;

function SelectField({ label, options, value, onChange }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#4F4F4F]">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-full appearance-none rounded-sm border border-[#D4D4D4] bg-white px-3 pr-8 text-[13px] text-[#252525] outline-none focus:border-[#8E9E25] focus:ring-1 focus:ring-[#8E9E25]/20"
        >
          <option value="">-- Pilih --</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8E8E8E]">
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </div>
    </div>
  );
}
