import React, { useEffect, useRef, useState } from "react";
import { X, Calendar, ChevronDown, FileText, MapPin, Pencil } from "lucide-react";

interface PenangkaranData {
  id: number;
  namaPenangkaran: string;
  nomorSk: string | null;
  tanggalSk: string | null;
  akhirMasaBerlaku: string | null;
  penerbit: string | null;
  namaDirektur: string | null;
  nomorTelepon: string | null;
  alamatKantor: string | null;
  alamatPenangkaran: string | null;
  koordinatLokasi: string | null;
  bidangWilayahId: number | null;
  seksiWilayahId: number | null;
  tslId: number | null;
  jantan?: PenangkaranNumberValue;
  betina?: PenangkaranNumberValue;
  indukanJantan?: PenangkaranNumberValue;
  indukanBetina?: PenangkaranNumberValue;
  createdAt?: string | null;
  updatedAt?: string | null;
}

type PenangkaranNumberValue = number | string | null;

interface UpdateDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PenangkaranData | null;
  onSuccess?: () => void;
}

export function UpdateDataModal({ isOpen, onClose, data, onSuccess }: Readonly<UpdateDataModalProps>) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [referensiList, setReferensiList] = useState<{
    id: number;
    namaDaerah: string;
    statusPerlindunganNasional?: string | null;
    statusCites?: string | null;
    statusIucn?: string | null;
  }[]>([]);
  const [formData, setFormData] = useState({
    namaPenangkaran: "",
    namaDirektur: "",
    nomorTelepon: "",
    alamatKantor: "",
    alamatPenangkaran: "",
    koordinatLokasi: "",
    nomorSk: "",
    penerbit: "",
    tanggalSk: "",
    akhirMasaBerlaku: "",
    bidangWilayahId: "",
    seksiWilayahId: "",
    tslId: "",
    indukanJantan: "",
    indukanBetina: "",
  });

  useEffect(() => {
    const token = globalThis.window ? globalThis.localStorage.getItem("token") : null;
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    fetch(`${url}/api/referensi-tsl`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((json) => setReferensiList(json.data ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (data) {
      const jantanValue = data.jantan ?? data.indukanJantan;
      const betinaValue = data.betina ?? data.indukanBetina;

      setFormData({
        namaPenangkaran: data.namaPenangkaran || "",
        namaDirektur: data.namaDirektur || "",
        nomorTelepon: data.nomorTelepon || "",
        alamatKantor: data.alamatKantor || "",
        alamatPenangkaran: data.alamatPenangkaran || "",
        koordinatLokasi: data.koordinatLokasi || "",
        nomorSk: data.nomorSk || "",
        penerbit: data.penerbit || "",
        tanggalSk: data.tanggalSk ? data.tanggalSk.split("T")[0] : "",
        akhirMasaBerlaku: data.akhirMasaBerlaku ? data.akhirMasaBerlaku.split("T")[0] : "",
        bidangWilayahId: data.bidangWilayahId ? String(data.bidangWilayahId) : "",
        seksiWilayahId: data.seksiWilayahId ? String(data.seksiWilayahId) : "",
        tslId: data.tslId ? String(data.tslId) : "",
        indukanJantan: jantanValue === null || jantanValue === undefined ? "" : String(jantanValue),
        indukanBetina: betinaValue === null || betinaValue === undefined ? "" : String(betinaValue),
      });
      setSelectedFileName("");
    }
  }, [data]);

  const setField = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const getSelectedTslStatus = (tslId: string | number | null | undefined) => {
    const selectedId = typeof tslId === "string" ? Number(tslId) : tslId;
    const selectedTsl = referensiList.find((item) => item.id === selectedId);

    return {
      statusPerlindunganNasional: selectedTsl?.statusPerlindunganNasional ?? null,
      statusCites: selectedTsl?.statusCites ?? null,
      statusIucn: selectedTsl?.statusIucn ?? null,
    };
  };

  const selectedTslStatus = getSelectedTslStatus(formData.tslId);

  const formatReferenceValue = (value: string | null | undefined) => {
    if (!value) return "-";

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
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

  const handleSave = async () => {
    if (!data) return;
    try {
      setIsLoading(true);
      // client-side validation (all fields required)
      const e: Record<string, string> = {};
      const isEmpty = (v?: string) => !v || v.trim() === "";
      if (isEmpty(formData.namaPenangkaran)) e.namaPenangkaran = "Field ini wajib diisi";
      if (isEmpty(formData.namaDirektur)) e.namaDirektur = "Field ini wajib diisi";
      if (isEmpty(formData.nomorTelepon)) e.nomorTelepon = "Field ini wajib diisi";
      else if (!/^08\d+$/.test(formData.nomorTelepon)) e.nomorTelepon = "Nomor telepon harus numerik dan diawali 08";
      if (isEmpty(formData.alamatPenangkaran)) e.alamatPenangkaran = "Field ini wajib diisi";
      if (isEmpty(formData.alamatKantor)) e.alamatKantor = "Field ini wajib diisi";
      if (isEmpty(formData.koordinatLokasi)) e.koordinatLokasi = "Field ini wajib diisi";
      if (isEmpty(formData.bidangWilayahId)) e.bidangWilayahId = "Pilih bidang KSDA";
      if (isEmpty(formData.seksiWilayahId)) e.seksiWilayahId = "Pilih seksi konservasi";
      if (isEmpty(formData.nomorSk)) e.nomorSk = "Field ini wajib diisi";
      if (!selectedFileName && isEmpty(formData.nomorSk)) e.file = "Unggah file SK atau isi nomor SK";
      if (isEmpty(formData.penerbit)) e.penerbit = "Field ini wajib diisi";
      if (isEmpty(formData.tanggalSk)) e.tanggalSk = "Pilih tanggal SK";
      if (isEmpty(formData.akhirMasaBerlaku)) e.akhirMasaBerlaku = "Pilih akhir masa berlaku";
      if (isEmpty(formData.tslId)) e.tslId = "Pilih jenis TSL";
      if (isEmpty(formData.indukanJantan)) e.indukanJantan = "Field ini wajib diisi";
      else if (!/^\d+$/.test(formData.indukanJantan)) e.indukanJantan = "Indukan Jantan harus berupa angka";
      if (isEmpty(formData.indukanBetina)) e.indukanBetina = "Field ini wajib diisi";
      else if (!/^\d+$/.test(formData.indukanBetina)) e.indukanBetina = "Indukan Betina harus berupa angka";
      setErrors(e);
      if (Object.keys(e).length > 0) {
        setIsLoading(false);
        return;
      }
      const token = globalThis.window ? globalThis.localStorage.getItem("token") : null;
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const parseNullableNumber = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return null;
        const parsed = Number(trimmed);
        return Number.isNaN(parsed) ? null : parsed;
      };
      const { indukanJantan, indukanBetina, ...payload } = formData;
      const res = await fetch(`${url}/api/penangkaran/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...payload,
          tslId: payload.tslId ? Number(payload.tslId) : null,
          bidangWilayahId: payload.bidangWilayahId ? Number(payload.bidangWilayahId) : null,
          seksiWilayahId: payload.seksiWilayahId ? Number(payload.seksiWilayahId) : null,
          tanggalSk: payload.tanggalSk || null,
          akhirMasaBerlaku: payload.akhirMasaBerlaku || null,
          ...getSelectedTslStatus(payload.tslId),
          jantan: parseNullableNumber(indukanJantan),
          betina: parseNullableNumber(indukanBetina),
        }),
      });
      const result = await res.json();
      if (result.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else if (result.errors && typeof result.errors === "object") {
        setErrors(result.errors);
      } else {
        alert(result.message || "Gagal menyimpan perubahan");
      }
    } catch {
      alert("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-6 backdrop-blur-[2px] md:p-8 md:pt-8">
      <button
        type="button"
        aria-label="Tutup modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/45 focus:outline-none"
      />
      <div className="relative z-10 w-full max-w-260 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-lg bg-white px-5 pb-5 pt-6 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.28)] md:px-8 md:pb-6 md:pt-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup modal"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-black/5 hover:text-gray-800"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <header className="text-center">
          <h2 className="text-[18px] font-medium tracking-tight text-gray-900 md:text-[20px]">
            Perbarui Data Penangkar TSL
          </h2>
        </header>

        <div className="mt-7 space-y-8">
          <div className="space-y-5">
            <SectionHeading>Informasi Umum</SectionHeading>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="flex flex-col gap-5">
                <TextField
                  id="unit-penangkar"
                  label="Unit Penangkar"
                  value={formData.namaPenangkaran}
                  onChange={(value) => setField("namaPenangkaran", value)}
                  required
                  error={errors.namaPenangkaran}
                />
                <TextField
                  id="nama-direktur"
                  label="Nama Direktur / Penanggung Jawab"
                  value={formData.namaDirektur}
                  onChange={(value) => setField("namaDirektur", value)}
                  required
                  error={errors.namaDirektur}
                />
                <TextField
                  id="nomor-telepon"
                  label="Nomor Telepon"
                  value={formData.nomorTelepon}
                  onChange={(value) => setField("nomorTelepon", value.replaceAll(/\D/g, ""))}
                  required
                  error={errors.nomorTelepon}
                />
                <TextField
                  id="alamat-penangkaran"
                  label="Alamat Penangkaran"
                  value={formData.alamatPenangkaran}
                  onChange={(value) => setField("alamatPenangkaran", value)}
                  icon="location"
                  required
                  error={errors.alamatPenangkaran}
                />
              </div>
              <div className="flex flex-col gap-5">
                <SelectField
                  id="bidang-ksda"
                  label="Bidang KSDA"
                  value={formData.bidangWilayahId}
                  onChange={(value) => setField("bidangWilayahId", value)}
                  options={BIDANG_OPTIONS}
                  required
                  error={errors.bidangWilayahId}
                />
                <SelectField
                  id="seksi-konservasi"
                  label="Seksi Konservasi"
                  value={formData.seksiWilayahId}
                  onChange={(value) => setField("seksiWilayahId", value)}
                  options={SEKSI_OPTIONS}
                  required
                  error={errors.seksiWilayahId}
                />
                <TextField
                  id="alamat-kantor"
                  label="Alamat Kantor"
                  value={formData.alamatKantor}
                  onChange={(value) => setField("alamatKantor", value)}
                  icon="location"
                  required
                  error={errors.alamatKantor}
                />
                <TextField
                  id="koordinat-penangkaran"
                  label="Koordinat Penangkaran"
                  value={formData.koordinatLokasi}
                  onChange={(value) => setField("koordinatLokasi", value)}
                  icon="location"
                  required
                  error={errors.koordinatLokasi}
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <SectionHeading>Informasi Perizinan</SectionHeading>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="flex flex-col gap-5">
                <TextField
                  id="nomor-sk"
                  label="Nomor SK / Sertifikat Standar"
                  value={formData.nomorSk}
                  onChange={(value) => setField("nomorSk", value)}
                  required
                  error={errors.nomorSk}
                />

                <FileField
                  id="sertifikat-standar"
                  label="SK / Sertifikat Standar"
                  fileName={selectedFileName}
                  note="Pastikan file bertipe .pdf"
                  onPick={openFilePicker}
                  required
                  error={errors.file}
                />
                <TextField
                  id="penerbit"
                  label="Penerbit"
                  value={formData.penerbit}
                  onChange={(value) => setField("penerbit", value)}
                  required
                  error={errors.penerbit}
                />
              </div>
              <div className="flex flex-col gap-5">
                <DateField
                  id="tanggal-sk"
                  label="Tanggal SK / Sertifikat Standar"
                  value={formData.tanggalSk}
                  onChange={(value) => setField("tanggalSk", value)}
                  required
                  error={errors.tanggalSk}
                />
                <DateField
                  id="akhir-masa-berlaku"
                  label="Akhir Masa Berlaku Izin"
                  value={formData.akhirMasaBerlaku}
                  onChange={(value) => setField("akhirMasaBerlaku", value)}
                  required
                  error={errors.akhirMasaBerlaku}
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <SectionHeading>Informasi TSL</SectionHeading>
            <div className="flex flex-col gap-5">
              <SelectField
                id="jenis-tsl"
                label="Jenis TSL"
                value={formData.tslId}
                onChange={(value) => setField("tslId", value)}
                options={referensiList.map((item) => ({
                  value: String(item.id),
                  label: item.namaDaerah || "-",
                }))}
                placeholder="-- Pilih Jenis TSL --"
                fullWidth
                required
                error={errors.tslId}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <ReadOnlyField
                  id="status-perlindungan-nasional"
                  label="Status Perlindungan Nasional"
                  value={formatReferenceValue(selectedTslStatus.statusPerlindunganNasional)}
                />
                <ReadOnlyField
                  id="status-cites"
                  label="Status CITES"
                  value={formatReferenceValue(selectedTslStatus.statusCites)}
                />
                <ReadOnlyField
                  id="status-iucn"
                  label="Status IUCN"
                  value={formatReferenceValue(selectedTslStatus.statusIucn)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField
                    id="indukan-jantan"
                    label="Indukan Jantan"
                    value={formData.indukanJantan}
                    onChange={(value) => setField("indukanJantan", value.replaceAll(/\D/g, ""))}
                    required
                    error={errors.indukanJantan}
                  />
                  <TextField
                    id="indukan-betina"
                    label="Indukan Betina"
                    value={formData.indukanBetina}
                    onChange={(value) => setField("indukanBetina", value.replaceAll(/\D/g, ""))}
                    required
                    error={errors.indukanBetina}
                  />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
          <div className="grid gap-1 text-[11px] text-gray-400">
            Created at {formatFooterDate(data?.createdAt)} by Admin Pusat
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="grid gap-1 text-[11px] text-gray-400">
              Updated at {formatFooterDate(data?.updatedAt)} by Admin Pusat
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-md bg-[#ffa31a] px-4 py-2 text-[13px] font-medium text-white shadow-[0_6px_16px_rgba(255,163,26,0.26)] transition-colors hover:bg-[#f39500] disabled:opacity-60"
            >
              <Pencil className="h-4.5 w-4.5" strokeWidth={2.5} />
              {isLoading ? "Menyimpan..." : "Perbarui"}
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
    </div>
  );
}

const BIDANG_OPTIONS = [
  { label: "I - Bogor", value: "1" },
  { label: "II - Soreang", value: "2" },
  { label: "III - Ciamis", value: "3" },
];

const SEKSI_OPTIONS = [
  { label: "I - Serang", value: "4" },
  { label: "II - Bogor", value: "5" },
  { label: "III - Soreang", value: "6" },
  { label: "IV - Purwakarta", value: "7" },
  { label: "V - Garut", value: "8" },
  { label: "VI - Tasikmalaya", value: "9" },
];

function SectionHeading({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="text-[14px] font-semibold text-[#9aa51f]">{children}</div>;
}

type TextFieldProps = Readonly<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: "location";
}>;

type TextFieldPropsExt = Readonly<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: "location";
  required?: boolean;
  error?: string;
}>;

function TextField({ id, label, value, onChange, icon, required = false, error }: TextFieldPropsExt) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        {icon === "location" && (
          <span className="pointer-events-none absolute left-1.5 top-1/2 z-10 -translate-y-1/2 inline-flex h-.5 w-.5 items-center justify-center text-[#9aa51f]">
            <MapPin className="h-4.5 w-4.5" strokeWidth={2.5} />
          </span>
        )}
        <input
          id={id}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-9 w-full rounded-[3px] bg-white text-[12px] text-gray-800 outline-none focus:ring-1 focus:ring-[#9aa51f] ${
            icon === "location" ? "pl-11" : "px-3"
          } ${error ? "border border-red-500" : "border border-[#c9d0b6]"}`}
        />
        {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
      </div>
    </div>
  );
}

type SelectFieldProps = Readonly<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  fullWidth?: boolean;
  required?: boolean;
  error?: string;
}>;

function SelectField({ id, label, value, onChange, options, placeholder = "", fullWidth = false, required = false, error }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-9 w-full appearance-none rounded-[3px] bg-white text-[12px] text-gray-800 outline-none focus:ring-1 focus:ring-[#9aa51f] ${
            fullWidth ? "pl-3 pr-11" : "px-3 pr-8"
          } ${error ? "border border-red-500" : "border border-[#c9d0b6]"}`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-4.5 w-4.5 items-center justify-center rounded-full border border-[#9aa51f] text-[#9aa51f]">
          <ChevronDown className="h-4.5 w-4.5" strokeWidth={2.5} />
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
  const inputRef = React.useRef<HTMLInputElement>(null);

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
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-9 w-full rounded-[3px] bg-white px-3 pr-10 text-[12px] text-gray-800 outline-none appearance-none focus:ring-1 focus:ring-[#9aa51f] [&::-webkit-calendar-picker-indicator]:opacity-0 ${
            error ? "border border-red-500" : "border border-[#c9d0b6]"
          }`}
        />

        <button
          type="button"
          onClick={openDatePicker}
          aria-label={`Pilih tanggal untuk ${label}`}
          className="absolute right-1.5 top-1/2 inline-flex h-4.5 w-4.5 -translate-y-1/2 items-center justify-center text-[#9aa51f]"
        >
          <Calendar className="h-4.5 w-4.5" strokeWidth={2.5} />
        </button>

        {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
      </div>
    </div>
  );
}

function FileField({ id, label, fileName, note, onPick, required = false, error }: Readonly<{ id: string; label: string; fileName: string; note: string; onPick: () => void; required?: boolean; error?: string }>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="flex h-9 overflow-hidden rounded-[3px] border border-[#c9d0b6] bg-white">
        <button
          type="button"
          onClick={onPick}
          className="inline-flex items-center gap-2 border-r border-[#c9d0b6] bg-[#f6f7e8] px-3 text-[12px] font-medium text-[#9aa51f] transition-colors hover:bg-[#eef1d1]"
        >
          <FileText className="h-3.5 w-3.5" strokeWidth={2.4} />
          Pilih file
        </button>
        <div className="flex min-w-0 flex-1 items-center px-3 text-[12px] text-gray-400">
          <span className="truncate">{fileName || ""}</span>
        </div>
      </div>
      <p className="text-[10px] text-gray-400">{note}</p>
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

function ReadOnlyField({
  id,
  label,
  value,
}: Readonly<{ id: string; label: string; value: string }>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label}
      </label>
      <input
        id={id}
        type="text"
        readOnly
        value={value}
        className="h-9 w-full rounded-[3px] border border-[#c9d0b6] bg-[#f8f9f1] px-3 text-[12px] text-gray-700 outline-none"
      />
    </div>
  );
}
