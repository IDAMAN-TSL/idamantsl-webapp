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
  indukanJantan?: number | string | null;
  indukanBetina?: number | string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

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
  const [referensiList, setReferensiList] = useState<{ id: number; namaDaerah: string }[]>([]);
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
        indukanJantan:
          data.indukanJantan === null || data.indukanJantan === undefined
            ? ""
            : String(data.indukanJantan),
        indukanBetina:
          data.indukanBetina === null || data.indukanBetina === undefined
            ? ""
            : String(data.indukanBetina),
      });
      setSelectedFileName("");
    }
  }, [data]);

  const setField = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

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
          indukanJantan: parseNullableNumber(indukanJantan),
          indukanBetina: parseNullableNumber(indukanBetina),
        }),
      });
      const result = await res.json();
      if (result.success) {
        if (onSuccess) onSuccess();
        onClose();
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
                />
                <TextField
                  id="nama-direktur"
                  label="Nama Direktur / Penanggung Jawab"
                  value={formData.namaDirektur}
                  onChange={(value) => setField("namaDirektur", value)}
                />
                <TextField
                  id="nomor-telepon"
                  label="Nomor Telepon"
                  value={formData.nomorTelepon}
                  onChange={(value) => setField("nomorTelepon", value)}
                />
                <TextField
                  id="alamat-penangkaran"
                  label="Alamat Penangkaran"
                  value={formData.alamatPenangkaran}
                  onChange={(value) => setField("alamatPenangkaran", value)}
                  icon="location"
                />
              </div>
              <div className="flex flex-col gap-5">
                <SelectField
                  id="bidang-ksda"
                  label="Bidang KSDA"
                  value={formData.bidangWilayahId}
                  onChange={(value) => setField("bidangWilayahId", value)}
                  options={BIDANG_OPTIONS}
                />
                <SelectField
                  id="seksi-konservasi"
                  label="Seksi Konservasi"
                  value={formData.seksiWilayahId}
                  onChange={(value) => setField("seksiWilayahId", value)}
                  options={SEKSI_OPTIONS}
                />
                <TextField
                  id="alamat-kantor"
                  label="Alamat Kantor"
                  value={formData.alamatKantor}
                  onChange={(value) => setField("alamatKantor", value)}
                  icon="location"
                />
                <TextField
                  id="koordinat-penangkaran"
                  label="Koordinat Penangkaran"
                  value={formData.koordinatLokasi}
                  onChange={(value) => setField("koordinatLokasi", value)}
                  icon="location"
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
                />
                
                <FileField
                  id="sertifikat-standar"
                  label="SK / Sertifikat Standar"
                  fileName={selectedFileName}
                  note="Pastikan file bertipe .pdf"
                  onPick={openFilePicker}
                />
                <TextField
                  id="penerbit"
                  label="Penerbit"
                  value={formData.penerbit}
                  onChange={(value) => setField("penerbit", value)}
                />
              </div>
              <div className="flex flex-col gap-5">
                <DateField
                  id="tanggal-sk"
                  label="Tanggal SK / Sertifikat Standar"
                  value={formData.tanggalSk}
                  onChange={(value) => setField("tanggalSk", value)}
                />
                <DateField
                  id="akhir-masa-berlaku"
                  label="Akhir Masa Berlaku Izin"
                  value={formData.akhirMasaBerlaku}
                  onChange={(value) => setField("akhirMasaBerlaku", value)}
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
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField
                  id="indukan-jantan"
                  label="Indukan Jantan"
                  value={formData.indukanJantan}
                  onChange={(value) => setField("indukanJantan", value)}
                />
                <TextField
                  id="indukan-betina"
                  label="Indukan Betina"
                  value={formData.indukanBetina}
                  onChange={(value) => setField("indukanBetina", value)}
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="text-[11px] font-medium text-[#8b8b8b]">
            Created at {formatFooterDate(data?.createdAt)} by Admin Pusat
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="text-[11px] font-medium text-[#8b8b8b]">
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

function TextField({ id, label, value, onChange, icon }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label}
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
          className={`h-9 w-full rounded-[3px] border border-[#c9d0b6] bg-white text-[12px] text-gray-800 outline-none focus:ring-1 focus:ring-[#9aa51f] ${
            icon === "location" ? "pl-11" : "px-3"
          }`}
        />
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
}>;

function SelectField({ id, label, value, onChange, options, placeholder = "", fullWidth = false }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-9 w-full appearance-none rounded-[3px] border border-[#c9d0b6] bg-white text-[12px] text-gray-800 outline-none focus:ring-1 focus:ring-[#9aa51f] ${
            fullWidth ? "pl-3 pr-11" : "px-3 pr-8"
          }`}
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
      </div>
    </div>
  );
}

function DateField({ id, label, value, onChange }: Readonly<{ id: string; label: string; value: string; onChange: (v: string) => void }>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-1.5 top-1/2 z-10 -translate-y-1/2 inline-flex h-8.5 w-8.5 items-center justify-center text-[#9aa51f]">
          <Calendar className="h-4.5 w-4.5" strokeWidth={2.5} />
        </span>
        <input
          id={id}
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-full rounded-[3px] border border-[#c9d0b6] bg-white pl-11 pr-3 text-[12px] text-gray-800 outline-none focus:ring-1 focus:ring-[#9aa51f]"
        />
      </div>
    </div>
  );
}

function FileField({ id, label, fileName, note, onPick }: Readonly<{ id: string; label: string; fileName: string; note: string; onPick: () => void }>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-[#8f8f7e]">
        {label}
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
    </div>
  );
}
