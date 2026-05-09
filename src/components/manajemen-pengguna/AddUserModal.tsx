"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Eye, EyeOff, MapPin, X } from "lucide-react";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Wilayah {
  id: number;
  nomorWilayah: string;
  namaWilayah: string;
  tipeWilayah: "bidang" | "seksi";
}

interface PeranOption {
  label: string;
  role: "admin_pusat" | "bidang_wilayah" | "seksi_wilayah";
  wilayahId?: number;
}

// Fallback options in case API fails
const FALLBACK_PERAN_OPTIONS: PeranOption[] = [
  { label: "Admin Pusat", role: "admin_pusat" },
  { label: "Bidang I. Bogor", role: "bidang_wilayah", wilayahId: 1 },
  { label: "Bidang II. Soreang", role: "bidang_wilayah", wilayahId: 2 },
  { label: "Bidang III. Ciamis", role: "bidang_wilayah", wilayahId: 3 },
  { label: "Seksi I. Serang", role: "seksi_wilayah", wilayahId: 4 },
  { label: "Seksi II. Bogor", role: "seksi_wilayah", wilayahId: 5 },
  { label: "Seksi III. Soreang", role: "seksi_wilayah", wilayahId: 6 },
  { label: "Seksi IV. Garut", role: "seksi_wilayah", wilayahId: 8 },
  { label: "Seksi V. Purwakarta", role: "seksi_wilayah", wilayahId: 7 },
  { label: "Seksi VI. Tasikmalaya", role: "seksi_wilayah", wilayahId: 9 },
];

export function AddUserModal({ isOpen, onClose, onSuccess }: Readonly<AddUserModalProps>) {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    peran: "",
    email: "",
    password: "",
    nomorTelepon: "",
    alamatKantor: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [peranOptions, setPeranOptions] = useState<PeranOption[]>(FALLBACK_PERAN_OPTIONS);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch wilayah data on modal open
  useEffect(() => {
    if (isOpen) {
      fetchPeranOptions();
    }
  }, [isOpen]);

  const fetchPeranOptions = async () => {
    try {
      setIsLoadingOptions(true);
      const token = localStorage.getItem("token");
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

      const res = await fetch(`${url}/api/wilayah`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setPeranOptions(FALLBACK_PERAN_OPTIONS);
        return;
      }

      const result = await res.json();
      const wilayahData: Wilayah[] = result.data || [];

      // Build options dynamically from API data
      const options: PeranOption[] = [
        { label: "Admin Pusat", role: "admin_pusat" },
      ];

      // Add bidang options
      wilayahData
        .filter((w) => w.tipeWilayah === "bidang")
        .sort((a, b) => a.nomorWilayah.localeCompare(b.nomorWilayah))
        .forEach((wilayah) => {
          options.push({
            label: `Bidang ${wilayah.nomorWilayah}. ${wilayah.namaWilayah}`,
            role: "bidang_wilayah",
            wilayahId: wilayah.id,
          });
        });

      // Add seksi options
      wilayahData
        .filter((w) => w.tipeWilayah === "seksi")
        .sort((a, b) => a.nomorWilayah.localeCompare(b.nomorWilayah))
        .forEach((wilayah) => {
          options.push({
            label: `Seksi ${wilayah.nomorWilayah}. ${wilayah.namaWilayah}`,
            role: "seksi_wilayah",
            wilayahId: wilayah.id,
          });
        });

      setPeranOptions(options);
    } catch (error) {
      console.error("Gagal memuat data peran:", error);
      setPeranOptions(FALLBACK_PERAN_OPTIONS);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isStrongPassword = (value: string) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.namaLengkap.trim()) nextErrors.namaLengkap = "Nama lengkap wajib diisi.";
    if (!formData.email.trim()) nextErrors.email = "Email wajib diisi.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) nextErrors.email = "Format email tidak valid.";
    if (!formData.peran.trim()) nextErrors.peran = "Peran wajib dipilih.";
    if (!formData.nomorTelepon.trim()) nextErrors.nomorTelepon = "Nomor telepon wajib diisi.";
    else if (!/^08\d+$/.test(formData.nomorTelepon.trim())) nextErrors.nomorTelepon = "Nomor telepon harus diawali 08 dan hanya berisi angka.";
    if (!formData.alamatKantor.trim()) nextErrors.alamatKantor = "Alamat kantor wajib diisi.";
    if (!formData.password.trim()) nextErrors.password = "Password wajib diisi.";
    else if (!isStrongPassword(formData.password.trim())) nextErrors.password = "Password minimal 8 karakter, mengandung huruf kapital dan angka.";

    return nextErrors;
  };


  const handleSubmit = async () => {
    try {
      const nextErrors = validateForm();
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;

      setIsLoading(true);
      const token = localStorage.getItem("token");
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

      const selectedPeran = peranOptions.find((p) => p.label === formData.peran);
      if (!selectedPeran) {
        alert("Peran wajib dipilih");
        return;
      }

      const trimmedNomorTelepon = formData.nomorTelepon?.trim() || null;
      const trimmedAlamatKantor = formData.alamatKantor?.trim() || null;

      const payload: {
        nama: string;
        email: string;
        password: string;
        nomorTelepon: string | null;
        alamatKantor: string | null;
        role: string;
        wilayahId?: number;
        isActive: boolean;
      } = {
        nama: formData.namaLengkap,
        email: formData.email,
        password: formData.password,
        nomorTelepon: trimmedNomorTelepon,
        alamatKantor: trimmedAlamatKantor,
        role: selectedPeran.role,
        isActive: true,
      };

      console.log("Submitting user data:", payload);

      if (selectedPeran.wilayahId) {
        payload.wilayahId = selectedPeran.wilayahId;
      }

      const res = await fetch(`${url}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok && (result?.success ?? true)) {
        setFormData({
          namaLengkap: "",
          peran: "",
          email: "",
          password: "",
          nomorTelepon: "",
          alamatKantor: "",
        });
        if (onSuccess) onSuccess();
        onClose();
        setErrors({});
      } else {
        alert(result.message || "Gagal menambah pengguna");
      }
    } catch (error) {
      console.error("Gagal menambah pengguna", error);
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
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
            Tambah Data Pengguna
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
                required
                error={errors.namaLengkap}
              />
              <Field
                label="Email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(value) => handleInputChange("email", value)}
                required
                error={errors.email}
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="add-user-password" className="text-[12px] font-medium text-[#4F4F4F]">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="add-user-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`h-8 w-full rounded-sm bg-white px-3 pr-9 text-[13px] text-[#252525] outline-none placeholder:text-[#B0B0B0] focus:border-[#8E9E25] focus:ring-1 focus:ring-[#8E9E25]/20 ${
                      errors.password ? "border border-red-500" : "border border-[#D4D4D4]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8E8E8E]"
                    aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" strokeWidth={2} />
                    ) : (
                      <Eye className="h-4 w-4" strokeWidth={2} />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-600">{errors.password}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <SelectField
                label="Peran"
                options={peranOptions.map((p) => p.label)}
                value={formData.peran}
                onChange={(value) => handleInputChange("peran", value)}
                isLoading={isLoadingOptions}
                required
                error={errors.peran}
              />
              <Field
                label="Nomor Telepon"
                placeholder="Nomor telepon"
                value={formData.nomorTelepon}
                onChange={(value) => handleInputChange("nomorTelepon", value.replaceAll(/\D/g, ""))}
                required
                error={errors.nomorTelepon}
              />
              <FieldWithIcon
                label="Alamat Kantor"
                placeholder="Alamat kantor"
                value={formData.alamatKantor}
                onChange={(value) => handleInputChange("alamatKantor", value)}
                required
                error={errors.alamatKantor}
              />
            </div>
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
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md bg-[#8E9E25] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#7F8F20] disabled:opacity-50"
          >
            {isLoading ? "Menyimpan..." : "Tambah"}
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
  required?: boolean;
  error?: string;
}>;

function Field({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  error,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#4F4F4F]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-8 w-full rounded-sm bg-white px-3 text-[13px] text-[#252525] outline-none placeholder:text-[#B0B0B0] focus:border-[#8E9E25] focus:ring-1 focus:ring-[#8E9E25]/20 ${
          error ? "border border-red-500" : "border border-[#D4D4D4]"
        }`}
      />
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

type FieldWithIconProps = Readonly<{
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}>;

function FieldWithIcon({
  label,
  placeholder = "",
  value,
  onChange,
  required = false,
  error,
}: FieldWithIconProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#4F4F4F]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-8 w-full rounded-sm bg-white pl-8 pr-3 text-[13px] text-[#252525] outline-none placeholder:text-[#B0B0B0] focus:border-[#8E9E25] focus:ring-1 focus:ring-[#8E9E25]/20 ${
            error ? "border border-red-500" : "border border-[#D4D4D4]"
          }`}
        />
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8E9E25]">
          <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
        </span>
      </div>
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

type SelectFieldProps = Readonly<{
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  required?: boolean;
  error?: string;
}>;

function SelectField({ label, options, value, onChange, isLoading = false, required = false, error }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#4F4F4F]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
          className={`h-8 w-full appearance-none rounded-sm bg-white px-3 pr-8 text-[13px] text-[#252525] outline-none focus:border-[#8E9E25] focus:ring-1 focus:ring-[#8E9E25]/20 disabled:opacity-50 ${
            error ? "border border-red-500" : "border border-[#D4D4D4]"
          }`}
        >
          <option value="">{isLoading ? "Memuat..." : "-- Pilih --"}</option>
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
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
