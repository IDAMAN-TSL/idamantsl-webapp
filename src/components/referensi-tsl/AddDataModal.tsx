"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import { AddDataAlertModal } from "@/components/layout/AddDataAlertModal";
import { BidangConfirmModal } from "@/components/layout/BidangConfirmModal";

interface AddDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const sections = ["Informasi Umum", "Informasi Status"];
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const IUCN_OPTIONS = [
  { label: "EX (Extinct/Punah)", value: "punah" },
  { label: "EW (Extinct in the Wild/Punah di Alam Liar)", value: "punah_di_alam" },
  { label: "CR (Critically Endangered/Kritis)", value: "sangat_terancam_punah" },
  { label: "EN (Endangered/Terancam)", value: "terancam_punah" },
  { label: "VU (Vulnerable/Rentan)", value: "rentan" },
  { label: "NT (Near Threatened/Hampir Terancam)", value: "hampir_terancam" },
  { label: "LC (Least Concern/Risiko Rendah)", value: "risiko_rendah" },
  { label: "DD (Data Deficient/Informasi Kurang)", value: "data_tidak_cukup" },
  { label: "NE (Not Evaluated/Belum Dievaluasi)", value: "tidak_dievaluasi" },
];

const CITES_OPTIONS = [
  { label: "Appendix I", value: "apendiks_i" },
  { label: "Appendix II", value: "apendiks_ii" },
  { label: "Appendix III", value: "apendiks_iii" },
];

const JENIS_OPTIONS = [
  { label: "Tumbuhan", value: "tumbuhan" },
  { label: "Satwa Liar", value: "satwa_liar" },
];

const PERLINDUNGAN_OPTIONS = [
  { label: "Dilindungi", value: "dilindungi" },
  { label: "Tidak Dilindungi", value: "tidak_dilindungi" },
];

export function AddDataModal({ isOpen, onClose, onSuccess }: Readonly<AddDataModalProps>) {
  const [section, setSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [alertState, setAlertState] = useState<{isOpen: boolean; type: "success" | "error"; title?: string; message?: string}>({
    isOpen: false,
    type: "success"
  });
  const [showBidangConfirm, setShowBidangConfirm] = useState(false);

  const [form, setForm] = useState({
    namaDaerah: "",
    jenis: "",
    kingdom: "",
    divisi: "",
    kelas: "",
    ordo: "",
    famili: "",
    genus: "",
    spesies: "",
    statusPerlindunganNasional: "",
    statusCites: "",
    statusIucn: "",
  });

  if (!isOpen) return null;

  const closeAndReset = () => {
    setSection(0);
    setErrorMsg(null);
    setForm({ namaDaerah: "", jenis: "", kingdom: "", divisi: "", kelas: "", ordo: "", famili: "", genus: "", spesies: "", statusPerlindunganNasional: "", statusCites: "", statusIucn: "" });
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.namaDaerah || !form.jenis) {
      setErrorMsg("Nama Daerah dan Jenis TSL wajib diisi.");
      return;
    }
    // Cek role: bidang_wilayah tampilkan konfirmasi dulu
    const userStr = globalThis.window === undefined ? null : localStorage.getItem("user");
    const userRole = userStr ? JSON.parse(userStr).role : "";
    if (userRole === "bidang_wilayah") {
      setShowBidangConfirm(true);
      return;
    }
    await doSubmit();
  };

  const doSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const token = globalThis.window === undefined ? null : localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/referensi-tsl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
        }
        if (res.status === 403) {
          throw new Error("Anda tidak memiliki izin untuk menambah data.");
        }
        if (res.status === 409) {
          throw new Error("Data dengan nama daerah ini sudah ada.");
        }
        const err = await res.json();
        throw new Error(err.message ?? `Gagal menyimpan data (${res.status})`);
      }
      
      const userStr = globalThis.window === undefined ? null : localStorage.getItem("user");
      const userRole = userStr ? JSON.parse(userStr).role : "";

      if (userRole === "admin_pusat") {
        setAlertState({ isOpen: true, type: "success" });
      } else {
        setAlertState({ 
          isOpen: true, 
          type: "success", 
          title: "Tambah data diajukan!", 
          message: "Data diverifikasi terlebih dahulu oleh Admin Pusat." 
        });
      }
    } catch (err: unknown) {
      const userStr = globalThis.window === undefined ? null : localStorage.getItem("user");
      const userRole = userStr ? JSON.parse(userStr).role : "";

      if (userRole === "admin_pusat") {
        setAlertState({ isOpen: true, type: "error", message: err instanceof TypeError ? "Gagal terhubung ke server. Periksa koneksi internet Anda." : (err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.") });
      } else {
        const msg = err instanceof TypeError ? "Gagal terhubung ke server. Periksa koneksi internet Anda." : (err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.");
        setAlertState({ isOpen: true, type: "error", title: "Terjadi kesalahan!", message: msg });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBidangConfirm = async () => {
    setShowBidangConfirm(false);
    await doSubmit();
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm md:p-8">
      <div className="relative w-full max-w-2xl rounded-[14px] bg-white px-8 py-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.35)]">
        <button
          onClick={closeAndReset}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Tutup modal"
        >
          <X className="h-5 w-5" strokeWidth={2.2} />
        </button>

        <div className="text-center">
          <h2 className="text-[15px] font-medium text-gray-900 md:text-[16px]">
            Tambah Data Referensi TSL
          </h2>
        </div>

        {/* Section Tabs */}
        <div className="mt-5 grid grid-cols-2 gap-0 border-b border-gray-200">
          {sections.map((label, index) => {
            const active = index === section;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setSection(index)}
                className="pb-2 text-center text-[13px] transition-colors"
              >
                <span className={active ? "font-medium text-[#8E9E25]" : "text-gray-400"}>
                  {label}
                </span>
                <span className={`mt-2 block h-[2px] w-full ${active ? "bg-[#8E9E25]" : "bg-transparent"}`} />
              </button>
            );
          })}
        </div>

        {/* Section 0: Informasi Umum */}
        {section === 0 && (
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="flex flex-col gap-4">
              <InputField label="Nama Daerah" value={form.namaDaerah} onChange={(v) => handleChange("namaDaerah", v)} required />
              <InputField label="Kingdom" value={form.kingdom} onChange={(v) => handleChange("kingdom", v)} />
              <InputField label="Divisi" value={form.divisi} onChange={(v) => handleChange("divisi", v)} />
              <InputField label="Kelas" value={form.kelas} onChange={(v) => handleChange("kelas", v)} />
            </div>
            <div className="flex flex-col gap-4">
              <SelectFieldOpt label="Jenis TSL" options={JENIS_OPTIONS} value={form.jenis} onChange={(v) => handleChange("jenis", v)} required />
              <InputField label="Ordo" value={form.ordo} onChange={(v) => handleChange("ordo", v)} />
              <InputField label="Family" value={form.famili} onChange={(v) => handleChange("famili", v)} />
              <InputField label="Genus" value={form.genus} onChange={(v) => handleChange("genus", v)} />
              <InputField label="Spesies" value={form.spesies} onChange={(v) => handleChange("spesies", v)} />
            </div>
          </div>
        )}

        {/* Section 1: Informasi Status */}
        {section === 1 && (
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="flex flex-col gap-4">
              <SelectFieldOpt label="Status Perlindungan Nasional" options={PERLINDUNGAN_OPTIONS} value={form.statusPerlindunganNasional} onChange={(v) => handleChange("statusPerlindunganNasional", v)} />
              <SelectFieldOpt label="Status CITES" options={CITES_OPTIONS} value={form.statusCites} onChange={(v) => handleChange("statusCites", v)} />
            </div>
            <div className="flex flex-col gap-4">
              <SelectFieldOpt label="Status IUCN" options={IUCN_OPTIONS} value={form.statusIucn} onChange={(v) => handleChange("statusIucn", v)} />
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 mt-0.5" strokeWidth={2} />
            <div className="flex-1">
              <p className="text-[12px] text-red-700 font-medium">{errorMsg}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="flex-shrink-0 text-red-400 hover:text-red-600"
              aria-label="Tutup pesan error"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          

          <div className="flex items-center justify-end gap-3">
            {section > 0 ? (
              <button
                type="button"
                onClick={() => setSection((prev) => prev - 1)}
                className="inline-flex items-center gap-2 rounded-md border border-[#D4DB8B] bg-[#F6F7E6] px-4 py-2 text-[12px] font-medium text-[#8E9E25] transition-colors hover:bg-[#eef1d1]"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.2} />
                Sebelumnya
              </button>
            ) : null}

            {section < sections.length - 1 ? (
              <button
                type="button"
                onClick={() => setSection((prev) => prev + 1)}
                className="inline-flex items-center gap-2 rounded-md border border-[#D4DB8B] bg-[#F6F7E6] px-4 py-2 text-[12px] font-medium text-[#8E9E25] transition-colors hover:bg-[#eef1d1]"
              >
                Lanjut
                <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-md bg-[#8E9E25] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#7e8d20] disabled:opacity-60"
              >
                <Plus className="h-4 w-4" strokeWidth={2.2} />
                {isSubmitting ? "Menyimpan..." : "Tambah"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    <AddDataAlertModal 
      isOpen={alertState.isOpen}
      type={alertState.type}
      title={alertState.title}
      message={alertState.message}
      onClose={() => {
        setAlertState((prev) => ({ ...prev, isOpen: false }));
        if (alertState.type === "success") {
          onSuccess?.();
          closeAndReset();
        }
      }}
    />
    <BidangConfirmModal
      isOpen={showBidangConfirm}
      type="add"
      onClose={() => setShowBidangConfirm(false)}
      onConfirm={handleBidangConfirm}
      isLoading={isSubmitting}
    />
    </>
  );
}

function InputField({
  label,
  value,
  onChange,
  required,
}: Readonly<{ label: string; value: string; onChange: (v: string) => void; required?: boolean }>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] text-gray-500">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded-[3px] border border-[#C7D0AF] bg-white px-3 text-[12px] text-gray-800 outline-none focus:ring-1 focus:ring-[#8E9E25]"
      />
    </div>
  );
}

function SelectFieldOpt({
  label,
  options,
  value,
  onChange,
  required,
}: Readonly<{
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] text-gray-500">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-full appearance-none rounded-[3px] border border-[#C7D0AF] bg-white px-3 pr-7 text-[12px] text-gray-800 outline-none focus:ring-1 focus:ring-[#8E9E25]"
        >
          <option value=""></option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
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
