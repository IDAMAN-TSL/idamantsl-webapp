"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, ChevronDown, Pencil, X } from "lucide-react";
import { AddDataAlertModal } from "@/components/layout/AddDataAlertModal";
import { BidangConfirmModal } from "@/components/layout/BidangConfirmModal";

interface ReferensiTSL {
  id: number;
  namaDaerah: string;
  jenis: string;
  kingdom?: string | null;
  divisi?: string | null;
  kelas?: string | null;
  ordo?: string | null;
  famili?: string | null;
  genus?: string | null;
  spesies?: string | null;
  statusPerlindunganNasional?: string | null;
  statusCites?: string | null;
  statusIucn?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface UpdateDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReferensiTSL | null;
  onSuccess?: () => void;
}

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

const getUpdateErrorMessage = async (res: Response) => {
  const err = await res.json().catch(() => null);
  if (err?.message) return err.message;
  
  if (res.status === 401) return "Sesi Anda telah berakhir. Silakan login kembali.";
  if (res.status === 403) return "Anda tidak memiliki izin untuk mengubah data.";
  if (res.status === 404) return "Data tidak ditemukan. Mungkin telah dihapus.";
  if (res.status === 409) return "Data dengan nama daerah ini sudah ada.";

  return `Gagal memperbarui data (${res.status})`;
};

const formatFooterDate = (value?: string | null) => {
  if (!value) return "dd mm yyyy";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function UpdateDataModal({ isOpen, onClose, data, onSuccess }: Readonly<UpdateDataModalProps>) {
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

  useEffect(() => {
    if (!data) return;

    setErrorMsg(null);
    setForm({
      namaDaerah: data.namaDaerah ?? "",
      jenis: data.jenis ?? "",
      kingdom: data.kingdom ?? "",
      divisi: data.divisi ?? "",
      kelas: data.kelas ?? "",
      ordo: data.ordo ?? "",
      famili: data.famili ?? "",
      genus: data.genus ?? "",
      spesies: data.spesies ?? "",
      statusPerlindunganNasional: data.statusPerlindunganNasional ?? "",
      statusCites: data.statusCites ?? "",
      statusIucn: data.statusIucn ?? "",
    });
  }, [data]);

  if (!isOpen || !data) return null;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.namaDaerah || !form.jenis) {
      setErrorMsg("Nama Daerah dan Jenis TSL wajib diisi.");
      return;
    }
    // Bidang wilayah: tampilkan konfirmasi dulu
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
      const res = await fetch(`${API_BASE}/api/referensi-tsl/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(await getUpdateErrorMessage(res));

      const userStr = globalThis.window === undefined ? null : localStorage.getItem("user");
      const userRole = userStr ? JSON.parse(userStr).role : "";

      if (userRole === "admin_pusat") {
        setAlertState({ 
          isOpen: true, 
          type: "success",
          title: "Perbarui data berhasil!",
          message: "Data berhasil diperbarui di database."
        });
      } else {
        setAlertState({ 
          isOpen: true, 
          type: "success",
          title: "Perbarui data diajukan!",
          message: "Data diverifikasi terlebih dahulu oleh Admin Pusat."
        });
      }
    } catch (err: unknown) {
      const userStr = globalThis.window === undefined ? null : localStorage.getItem("user");
      const userRole = userStr ? JSON.parse(userStr).role : "";
      
      if (userRole === "admin_pusat") {
        setAlertState({ 
          isOpen: true, 
          type: "error",
          title: "Perbarui data gagal!",
          message: err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui."
        });
      } else {
        const msg = err instanceof TypeError ? "Gagal terhubung ke server. Periksa koneksi internet Anda." : (err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.");
        setAlertState({ 
          isOpen: true, 
          type: "error",
          title: "Terjadi kesalahan!",
          message: msg
        });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm md:p-8">
      <div className="relative w-full max-w-4xl rounded-[14px] bg-white px-6 py-6 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.35)] md:px-8 md:py-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Tutup modal"
        >
          <X className="h-5 w-5" strokeWidth={2.2} />
        </button>

        <div className="text-center">
          <h2 className="text-[15px] font-medium text-gray-900 md:text-[16px]">
            Perbarui Data Referensi TSL
          </h2>
        </div>

        <div className="mt-5 space-y-8">
          <section className="space-y-5">
            <SectionHeading>Informasi Umum</SectionHeading>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
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
          </section>

          <section className="space-y-5">
            <SectionHeading>Informasi Status</SectionHeading>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <SelectFieldOpt label="Status Perlindungan Nasional" options={PERLINDUNGAN_OPTIONS} value={form.statusPerlindunganNasional} onChange={(v) => handleChange("statusPerlindunganNasional", v)} />
                <SelectFieldOpt label="Status CITES" options={CITES_OPTIONS} value={form.statusCites} onChange={(v) => handleChange("statusCites", v)} />
              </div>
              <div className="flex flex-col gap-4">
                <SelectFieldOpt label="Status IUCN" options={IUCN_OPTIONS} value={form.statusIucn} onChange={(v) => handleChange("statusIucn", v)} />
              </div>
            </div>
          </section>
        </div>

        {errorMsg && (
          <div className="mt-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" strokeWidth={2} />
            <div className="flex-1">
              <p className="text-[12px] font-medium text-red-700">{errorMsg}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="shrink-0 text-red-400 hover:text-red-600"
              aria-label="Tutup pesan error"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
          <div className="grid gap-1 text-[11px] text-gray-400">
            <span>Created at {formatFooterDate(data.createdAt)} by Admin Pusat</span>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="grid gap-1 text-[11px] text-gray-400">
              Updated at {formatFooterDate(data.updatedAt)} by Admin Pusat
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(245,158,11,0.35)] transition-all hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Pencil className="h-4 w-4" strokeWidth={2.4} />
              {isSubmitting ? "Memperbarui..." : "Perbarui"}
            </button>
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
            onClose();
          }
        }}
      />
      <BidangConfirmModal
        isOpen={showBidangConfirm}
        type="update"
        onClose={() => setShowBidangConfirm(false)}
        onConfirm={handleBidangConfirm}
        isLoading={isSubmitting}
      />
    </div>
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
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
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

function SectionHeading({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="text-[14px] font-semibold text-[#9aa51f]">{children}</div>;
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
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
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