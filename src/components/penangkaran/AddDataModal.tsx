"use client";

import React, { useState, useEffect, useRef } from "react";
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
    namaPenangkaran: "",
    namaDirektur: "",
    nomorTelepon: "",
    alamatPenangkaran: "",
    bidangWilayahId: "",
    seksiWilayahId: "",
    alamatKantor: "",
    koordinatLokasi: "",
    nomorSk: "",
    penerbit: "",
    tanggalSk: "",
    akhirMasaBerlaku: "",
    tslId: "",
    indukanJantan: "",
    indukanBetina: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (key: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  // ─── Fetch Referensi TSL ───────────────────────────────────────────────────
  const [referensiList, setReferensiList] = useState<{
    id: number;
    namaDaerah: string;
    statusPerlindunganNasional?: string | null;
    statusCites?: string | null;
    statusIucn?: string | null;
  }[]>([]);

  const getSelectedTslStatus = (tslId: string | number | null | undefined) => {
    const selectedId = typeof tslId === "string" ? Number(tslId) : tslId;
    const selectedTsl = referensiList.find((item) => item.id === selectedId);

    return {
      statusPerlindunganNasional: selectedTsl?.statusPerlindunganNasional ?? null,
      statusCites: selectedTsl?.statusCites ?? null,
      statusIucn: selectedTsl?.statusIucn ?? null,
    };
  };
  useEffect(() => {
    const token = globalThis.window === undefined ? null : localStorage.getItem("token");
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    fetch(`${url}/api/referensi-tsl`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => setReferensiList(json.data ?? []))
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  const goPrevious = () => setStep((previous) => Math.max(previous - 1, 0));
  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    const isEmpty = (v?: string) => !v || v.trim() === "";
    if (s === 0) {
      if (isEmpty(formData.namaPenangkaran)) e.namaPenangkaran = "Field ini wajib diisi";
      if (isEmpty(formData.namaDirektur)) e.namaDirektur = "Field ini wajib diisi";
      if (isEmpty(formData.nomorTelepon)) e.nomorTelepon = "Field ini wajib diisi";
      else if (!/^08\d+$/.test(formData.nomorTelepon)) e.nomorTelepon = "Nomor telepon harus numerik dan diawali 08";
      if (isEmpty(formData.alamatPenangkaran)) e.alamatPenangkaran = "Field ini wajib diisi";
      if (isEmpty(formData.bidangWilayahId)) e.bidangWilayahId = "Pilih bidang KSDA";
      if (isEmpty(formData.seksiWilayahId)) e.seksiWilayahId = "Pilih seksi konservasi";
      if (isEmpty(formData.alamatKantor)) e.alamatKantor = "Field ini wajib diisi";
      if (isEmpty(formData.koordinatLokasi)) e.koordinatLokasi = "Field ini wajib diisi";
    }
    if (s === 1) {
      if (isEmpty(formData.nomorSk)) e.nomorSk = "Field ini wajib diisi";
      if (!selectedFile && isEmpty(formData.nomorSk)) e.file = "Unggah file SK atau isi nomor SK";
      if (isEmpty(formData.penerbit)) e.penerbit = "Field ini wajib diisi";
      if (isEmpty(formData.tanggalSk)) e.tanggalSk = "Pilih tanggal SK";
      if (isEmpty(formData.akhirMasaBerlaku)) e.akhirMasaBerlaku = "Pilih akhir masa berlaku";
    }
    if (s === 2) {
      if (isEmpty(formData.tslId)) e.tslId = "Pilih jenis TSL";
      if (isEmpty(formData.indukanJantan)) e.indukanJantan = "Field ini wajib diisi";
      if (isEmpty(formData.indukanBetina)) e.indukanBetina = "Field ini wajib diisi";
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
      namaPenangkaran: "", namaDirektur: "", nomorTelepon: "",
      alamatPenangkaran: "", bidangWilayahId: "", seksiWilayahId: "",
      alamatKantor: "", koordinatLokasi: "", nomorSk: "",
      penerbit: "", tanggalSk: "", akhirMasaBerlaku: "", tslId: "",
      indukanJantan: "", indukanBetina: "",
    });
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // full client-side validation before submit (all fields required)
      const e: Record<string, string> = {};
      const isEmpty = (v?: string) => !v || v.trim() === "";
      Object.keys(formData).forEach((k) => {
        const key = k as keyof typeof formData;
        if (isEmpty(formData[key])) e[key] = "Field ini wajib diisi";
      });
      if (!/^08\d+$/.test(formData.nomorTelepon)) e.nomorTelepon = "Nomor telepon harus numerik dan diawali 08";
      if (Object.keys(e).length > 0) {
        setErrors(e);
        setIsLoading(false);
        return;
      }
      const token = globalThis.window === undefined ? null : localStorage.getItem("token");
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

      const parseNullableNumber = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return null;
        const parsed = Number(trimmed);
        return Number.isNaN(parsed) ? null : parsed;
      };

      const payload = {
        namaPenangkaran: formData.namaPenangkaran,
        namaDirektur: formData.namaDirektur,
        nomorTelepon: formData.nomorTelepon,
        alamatPenangkaran: formData.alamatPenangkaran,
        alamatKantor: formData.alamatKantor,
        koordinatLokasi: formData.koordinatLokasi,
        nomorSk: formData.nomorSk,
        penerbit: formData.penerbit,
        tanggalSk: formData.tanggalSk || null,
        akhirMasaBerlaku: formData.akhirMasaBerlaku || null,
        bidangWilayahId: formData.bidangWilayahId ? Number(formData.bidangWilayahId) : null,
        seksiWilayahId: formData.seksiWilayahId ? Number(formData.seksiWilayahId) : null,
        tslId: formData.tslId ? Number(formData.tslId) : null,
        ...getSelectedTslStatus(formData.tslId),
        jantan: parseNullableNumber(formData.indukanJantan),
        betina: parseNullableNumber(formData.indukanBetina),
      };

      const res = await fetch(`${url}/api/penangkaran`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        if (onSuccess) onSuccess();
        closeAndReset();
      } else if (result.errors && typeof result.errors === "object") {
        // show server-side validation if provided
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
            Tambah Data Penangkar TSL
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
              <Field label="Unit Penangkar" value={formData.namaPenangkaran} onChange={(v) => setField("namaPenangkaran", v)} required error={errors.namaPenangkaran} />
              <Field label="Nama Direktur / Penanggung Jawab" value={formData.namaDirektur} onChange={(v) => setField("namaDirektur", v)} required error={errors.namaDirektur} />
              <Field label="Nomor Telepon" value={formData.nomorTelepon} onChange={(v) => setField("nomorTelepon", v.replaceAll(/\D/g, ""))} required error={errors.nomorTelepon} />
              <Field label="Alamat Penangkaran" withLocationIcon value={formData.alamatPenangkaran} onChange={(v) => setField("alamatPenangkaran", v)} required error={errors.alamatPenangkaran} />
            </div>

            <div className="flex flex-col gap-4">
              <SelectField label="Bidang KSDA" options={[
                { label: "I. Bogor", value: "1" }, { label: "II. Soreang", value: "2" }, { label: "III. Ciamis", value: "3" }
              ]} value={formData.bidangWilayahId} onChange={(v) => setField("bidangWilayahId", v)} required error={errors.bidangWilayahId} />
              <SelectField label="Seksi Konservasi" options={[
                { label: "I. Serang", value: "4" }, { label: "II. Bogor", value: "5" }, { label: "III. Soreang", value: "6" },
                { label: "IV. Purwakarta", value: "7" }, { label: "V. Garut", value: "8" }, { label: "VI. Tasikmalaya", value: "9" },
              ]} value={formData.seksiWilayahId} onChange={(v) => setField("seksiWilayahId", v)} required error={errors.seksiWilayahId} />
              <Field label="Alamat Kantor" withLocationIcon value={formData.alamatKantor} onChange={(v) => setField("alamatKantor", v)} required error={errors.alamatKantor} />
              <Field label="Koordinat Penangkaran" withLocationIcon value={formData.koordinatLokasi} onChange={(v) => setField("koordinatLokasi", v)} required error={errors.koordinatLokasi} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <Field label="Nomor SK / Sertifikat Standar" value={formData.nomorSk} onChange={(v) => setField("nomorSk", v)} required error={errors.nomorSk} />
              <FilePicker
                label="SK / Sertifikat Standar"
                fileName={selectedFile?.name}
                onPick={() => document.getElementById("add-data-upload-input")?.click()}
                required
                error={errors.file}
              />
              <Field label="Penerbit" value={formData.penerbit} onChange={(v) => setField("penerbit", v)} required error={errors.penerbit} />
            </div>

            <div className="flex flex-col gap-4">
              <DateField id="tanggal-sk" label="Tanggal SK / Sertifikat Standar" value={formData.tanggalSk} onChange={(v) => setField("tanggalSk", v)} required error={errors.tanggalSk} />
              <DateField id="akhir-masa-berlaku" label="Akhir Masa Berlaku Izin" value={formData.akhirMasaBerlaku} onChange={(v) => setField("akhirMasaBerlaku", v)} required error={errors.akhirMasaBerlaku} />
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
              <TslSearchField
                label="Jenis TSL"
                options={referensiList}
                value={formData.tslId}
                onChange={(v) => setField("tslId", v)}
                required
                error={errors.tslId}
              />
            </div>

            <Field label="Indukan Jantan" value={formData.indukanJantan} onChange={(v) => setField("indukanJantan", v)} required error={errors.indukanJantan} />
            <Field label="Indukan Betina" value={formData.indukanBetina} onChange={(v) => setField("indukanBetina", v)} required error={errors.indukanBetina} />
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

function TslSearchField({
  label,
  options,
  value,
  onChange,
  required = false,
  error,
}: Readonly<{
  label: string;
  options: { id: number; namaDaerah: string }[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
}>) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = options.find((o) => String(o.id) === value)?.namaDaerah ?? "";

  const filtered = query
    ? options.filter((o) => o.namaDaerah.toLowerCase().includes(query.toLowerCase()))
    : options;

  const handleSelect = (id: number, name: string) => {
    onChange(String(id));
    setQuery(name);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-[12px] text-gray-500">{label} {required && <span className="text-red-600">*</span>}</label>
      <div className="relative">
        <input
          type="text"
          value={open ? query : selectedLabel}
          placeholder="Cari nama daerah..."
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          className="h-8 w-full rounded-[3px] border border-[#C7D0AF] bg-white px-3 pr-7 text-[12px] text-gray-800 outline-none focus:ring-1 focus:ring-[#8E9E25]"
        />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8E9E25]">
          <ChevronDown className="h-4 w-4" strokeWidth={2} />
        </span>

        {open && (
          <div className="absolute left-0 top-full z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-sm border border-[#C7D0AF] bg-white shadow-lg">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-[12px] text-gray-400">Tidak ada data</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onMouseDown={() => handleSelect(opt.id, opt.namaDaerah)}
                  className={`flex w-full items-center px-3 py-1.5 text-left text-[12px] transition-colors hover:bg-[#F6F7E6] ${
                    String(opt.id) === value ? "bg-[#E9EDC8] font-medium text-[#8E9E25]" : "text-gray-700"
                  }`}
                >
                  {opt.namaDaerah}
                </button>
              ))
            )}
          </div>
        )}
        {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
      </div>
    </div>
  );
}