"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Save, Trash2, X } from "lucide-react";

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
}

interface UpdateDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ReferensiTSL | null;
  onSuccess?: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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

export function UpdateDataModal({
  isOpen,
  onClose,
  data,
  onSuccess,
}: Readonly<UpdateDataModalProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    if (data) {
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
    }
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
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${API_BASE}/api/referensi-tsl/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "Gagal memperbarui data");
      }
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Perbarui Data Referensi TSL
          </h2>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <InputField label="Nama Daerah" value={form.namaDaerah} onChange={(v) => handleChange("namaDaerah", v)} required />
            <SelectFieldOpt label="Jenis TSL" options={JENIS_OPTIONS} value={form.jenis} onChange={(v) => handleChange("jenis", v)} required />
            <InputField label="Kingdom" value={form.kingdom} onChange={(v) => handleChange("kingdom", v)} />
            <InputField label="Divisi" value={form.divisi} onChange={(v) => handleChange("divisi", v)} />
            <InputField label="Kelas" value={form.kelas} onChange={(v) => handleChange("kelas", v)} />
            <InputField label="Ordo" value={form.ordo} onChange={(v) => handleChange("ordo", v)} />
          </div>

          <div className="flex flex-col gap-4">
            <InputField label="Family" value={form.famili} onChange={(v) => handleChange("famili", v)} />
            <InputField label="Genus" value={form.genus} onChange={(v) => handleChange("genus", v)} />
            <InputField label="Spesies" value={form.spesies} onChange={(v) => handleChange("spesies", v)} />
            <SelectFieldOpt label="Status Perlindungan Nasional" options={PERLINDUNGAN_OPTIONS} value={form.statusPerlindunganNasional} onChange={(v) => handleChange("statusPerlindunganNasional", v)} />
            <SelectFieldOpt label="Status CITES" options={CITES_OPTIONS} value={form.statusCites} onChange={(v) => handleChange("statusCites", v)} />
            <SelectFieldOpt label="Status IUCN" options={IUCN_OPTIONS} value={form.statusIucn} onChange={(v) => handleChange("statusIucn", v)} />
          </div>
        </div>

        {errorMsg && (
          <p className="mt-3 text-[12px] text-red-600">{errorMsg}</p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-[14px] font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-100 sm:w-auto"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2.5} />
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
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8E9E25] px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#7e8d20] disabled:opacity-60"
            >
              <Save className="h-4 w-4" strokeWidth={2.4} />
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>
      </div>
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
