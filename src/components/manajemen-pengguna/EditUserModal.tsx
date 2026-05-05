"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, Eye, EyeOff, MapPin, X } from "lucide-react";

interface UserData {
  id: number;
  namaLengkap: string;
  email: string;
  nomorTelepon: string;
  role?: string;
  wilayahId?: number | null;
  namaWilayah?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  status?: string;
  alamatKantor?: string;
  isActive?: boolean;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userData: UserData | null;
}

const PERAN_OPTIONS = [
  "Admin Pusat",
  "Bidang I. Bogor",
  "Bidang II. Soreang",
  "Bidang III. Ciamis",
  "Seksi I. Serang",
  "Seksi II. Bogor",
  "Seksi III. Soreang",
  "Seksi IV. Garut",
  "Seksi V. Purwakarta",
  "Seksi VI. Tasikmalaya",
];

const PERAN_TO_ROLE: Record<
  string,
  {
    role: "admin_pusat" | "bidang_wilayah" | "seksi_wilayah";
    wilayahId?: number;
  }
> = {
  "Admin Pusat": { role: "admin_pusat" },
  "Bidang I. Bogor": { role: "bidang_wilayah", wilayahId: 1 },
  "Bidang II. Soreang": { role: "bidang_wilayah", wilayahId: 2 },
  "Bidang III. Ciamis": { role: "bidang_wilayah", wilayahId: 3 },
  "Seksi I. Serang": { role: "seksi_wilayah", wilayahId: 4 },
  "Seksi II. Bogor": { role: "seksi_wilayah", wilayahId: 5 },
  "Seksi III. Soreang": { role: "seksi_wilayah", wilayahId: 6 },
  "Seksi IV. Garut": { role: "seksi_wilayah", wilayahId: 8 },
  "Seksi V. Purwakarta": { role: "seksi_wilayah", wilayahId: 7 },
  "Seksi VI. Tasikmalaya": { role: "seksi_wilayah", wilayahId: 9 },
};

const ROLE_TO_PERAN: Record<string, string> = {
  admin_pusat: "Admin Pusat",
  bidang_wilayah: "Bidang",
  seksi_wilayah: "Seksi",
};

function getPeranLabel(role?: string, wilayahId?: number | null) {
  if (!role) return "";
  if (role === "admin_pusat") return "Admin Pusat";
  if (!wilayahId) return "";

  if (role === "bidang_wilayah") {
    const label = [
      "Bidang I. Bogor",
      "Bidang II. Soreang",
      "Bidang III. Ciamis",
    ][wilayahId - 1];
    return label || "";
  }

  if (role === "seksi_wilayah") {
    const mapping: Record<number, string> = {
      4: "Seksi I. Serang",
      5: "Seksi II. Bogor",
      6: "Seksi III. Soreang",
      7: "Seksi V. Purwakarta",
      8: "Seksi IV. Garut",
      9: "Seksi VI. Tasikmalaya",
    };
    return mapping[wilayahId] || "";
  }

  return "";
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function EditUserModal({ isOpen, onClose, onSuccess, userData }: Readonly<EditUserModalProps>) {
  const [formData, setFormData] = useState({
    namaLengkap: "",
    peran: "",
    email: "",
    password: "",
    nomorTelepon: "",
    alamatKantor: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        namaLengkap: userData.namaLengkap || "",
        peran: getPeranLabel(userData.role, userData.wilayahId),
        email: userData.email || "",
        password: "", // Intentionally left blank for edit
        nomorTelepon: userData.nomorTelepon && userData.nomorTelepon !== "-" ? userData.nomorTelepon : "",
        alamatKantor: userData.alamatKantor && userData.alamatKantor !== "-" ? userData.alamatKantor : "",
      });
    }
  }, [userData]);

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async () => {
    if (!userData) return;
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      
      const selectedPeran = PERAN_TO_ROLE[formData.peran];
      const fallbackPeran = userData?.role
        ? { role: userData.role as "admin_pusat" | "bidang_wilayah" | "seksi_wilayah", wilayahId: userData.wilayahId ?? undefined }
        : undefined;
      const appliedPeran = selectedPeran ?? fallbackPeran;

      if (!appliedPeran) {
        alert("Peran wajib dipilih");
        return;
      }

      const payload: {
        nama: string;
        email: string;
        nomorTelepon: string | null;
        alamatKantor: string | null;
        role: string;
        wilayahId?: number;
        isActive?: boolean;
        password?: string;
      } = {
        nama: formData.namaLengkap,
        email: formData.email,
        nomorTelepon: formData.nomorTelepon || null,
        alamatKantor: formData.alamatKantor || null,
        role: appliedPeran.role,
        isActive: userData?.isActive ?? true,
      };

      if (appliedPeran.wilayahId) {
        payload.wilayahId = appliedPeran.wilayahId;
      }

      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await fetch(`${url}/api/users/${userData.id}`, {
        method: "PUT",
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
      } else {
        alert(result.message || "Gagal mengubah pengguna");
      }
    } catch (error) {
      console.error("Gagal mengubah pengguna", error);
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
            Perbarui Data Pengguna
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
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-[#4F4F4F]">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-8 w-full rounded-sm border border-[#D4D4D4] bg-white px-3 pr-9 text-[13px] text-[#252525] outline-none placeholder:text-[#B0B0B0] focus:border-[#8E9E25] focus:ring-1 focus:ring-[#8E9E25]/20"
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
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <SelectField
                label="Peran"
                options={PERAN_OPTIONS}
                value={formData.peran}
                onChange={(value) => handleInputChange("peran", value)}
              />
              <Field
                label="Nomor Telepon"
                placeholder="Nomor telepon"
                value={formData.nomorTelepon}
                onChange={(value) => handleInputChange("nomorTelepon", value)}
              />
              <FieldWithIcon
                label="Alamat Kantor"
                placeholder="Alamat kantor"
                value={formData.alamatKantor}
                onChange={(value) => handleInputChange("alamatKantor", value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 text-[11px] text-[#8C8C8C] sm:flex-row sm:items-center sm:gap-6">
            <span>
              Created at {formatDate(userData?.createdAt)} by {ROLE_TO_PERAN[userData?.role || "admin_pusat"] || "Admin Pusat"}
            </span>
            <span>
              Updated at {formatDate(userData?.updatedAt)} by {ROLE_TO_PERAN[userData?.role || "admin_pusat"] || "Admin Pusat"}
            </span>
          </div>

          <div className="flex items-center justify-end gap-3">
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
              className="inline-flex items-center justify-center rounded-md bg-[#F59E0B] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#d98906] disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : "Perbarui"}
            </button>
          </div>
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

