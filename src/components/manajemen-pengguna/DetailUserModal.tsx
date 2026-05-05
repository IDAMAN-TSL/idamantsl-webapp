"use client";

import React from "react";
import { Eye, EyeOff, MapPin, X } from "lucide-react";

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
}

interface DetailUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | null;
}

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
    return label || "Bidang Wilayah";
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
    return mapping[wilayahId] || "Seksi Wilayah";
  }

  return "";
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, ' '); // Example: 05 05 2026
}

export function DetailUserModal({ isOpen, onClose, userData }: Readonly<DetailUserModalProps>) {
  const [showPassword, setShowPassword] = React.useState(false);

  if (!isOpen) return null;

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
            Detail Data Pengguna
          </h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <ReadOnlyField
                label="Nama Lengkap"
                value={userData?.namaLengkap || "-"}
              />
              <ReadOnlyField
                label="Email"
                value={userData?.email || "-"}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-[#A3A3A3]">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    readOnly
                    value="********"
                    className="h-8 w-full rounded-sm border border-[#D4D4D4] bg-[#F9F9F9] px-3 pr-9 text-[13px] text-[#525252] outline-none"
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
              <ReadOnlyField
                label="Peran"
                value={getPeranLabel(userData?.role, userData?.wilayahId)}
              />
              <ReadOnlyField
                label="Nomor Telepon"
                value={userData?.nomorTelepon || "-"}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-[#A3A3A3]">Alamat Kantor</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={userData?.alamatKantor || "-"}
                    className="h-8 w-full rounded-sm border border-[#D4D4D4] bg-[#F9F9F9] pl-8 pr-3 text-[13px] text-[#525252] outline-none"
                  />
                  <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8E9E25]">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[11px] text-[#A3A3A3]">
            Created at {formatDate(userData?.createdAt)} by {ROLE_TO_PERAN[userData?.role || "admin_pusat"] || "Admin Pusat"}
          </div>
          <div className="text-[11px] text-[#A3A3A3]">
            Updated at {formatDate(userData?.updatedAt)} by {ROLE_TO_PERAN[userData?.role || "admin_pusat"] || "Admin Pusat"}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#A3A3A3]">{label}</label>
      <input
        type="text"
        readOnly
        value={value}
        className="h-8 w-full rounded-sm border border-[#D4D4D4] bg-[#F9F9F9] px-3 text-[13px] text-[#525252] outline-none"
      />
    </div>
  );
}
