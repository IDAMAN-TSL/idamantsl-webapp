"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";
import { AddDataModal } from "@/components/penangkaran/AddDataModal";
import { DetailDataModal } from "../../components/penangkaran/DetailDataModal";
import { UpdateDataModal } from "@/components/penangkaran/UpdateDataModal";
import { UploadDocModal } from "@/components/ui/UploadDocModal";
import { ExportPreviewModal } from "@/components/penangkaran/ExportPreviewModal";

type StatusVerifikasi = "pending" | "disetujui" | "ditolak";

type PenangkaranColumn = {
  label: string;
  accessor: (row: PenangkaranRow) => string;
};

type PenangkaranHeaderCell =
  | { type: "single"; label: string }
  | { type: "group"; label: string; columns: string[] };

export interface PenangkaranRow {
  id: number;
  namaPenangkaran: string;
  nomorSk: string | null;
  tanggalSk: string | null;
  akhirMasaBerlaku: string | null;
  penerbit: string | null;
  namaDirektur: string | null;
  nomorTelepon: string | null;
  bidangWilayah: { namaWilayah: string } | null;
  seksiWilayah: { namaWilayah: string } | null;
  alamatKantor: string | null;
  alamatPenangkaran: string | null;
  koordinatLokasi: string | null;
  tsl: {
    namaDaerah?: string | null;
    jenis?: string | null;
    statusPerlindunganNasional?: string | null;
    statusCites?: string | null;
    statusIucn?: string | null;
  } | null;
  jenisTsl?: string | null;
  statusPerlindunganNasional?: string | null;
  statusCites?: string | null;
  statusIucn?: string | null;
  statusVerifikasi: StatusVerifikasi;
  bidangWilayahId: number | null;
  seksiWilayahId: number | null;
  tslId: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

type ReferensiTSLRow = {
  id: number;
  namaDaerah?: string | null;
  jenis?: string | null;
  statusPerlindunganNasional?: string | null;
  statusCites?: string | null;
  statusIucn?: string | null;
};

const formatDisplayDate = (dateStr: string | null) => {
  if (!dateStr) return "-";

  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatReferenceValue = (value: string | null | undefined) => {
  if (!value) return "-";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const PENANGKARAN_COLUMNS: PenangkaranColumn[] = [
  { label: "Unit Penangkar", accessor: (row) => row.namaPenangkaran },
  { label: "Direktor/PJ", accessor: (row) => row.namaDirektur || "-" },
  { label: "No Telp", accessor: (row) => row.nomorTelepon || "-" },
  { label: "Bidang", accessor: (row) => row.bidangWilayah?.namaWilayah || "-" },
  { label: "Seksi", accessor: (row) => row.seksiWilayah?.namaWilayah || "-" },
  { label: "Alamat Kantor", accessor: (row) => row.alamatKantor || "-" },
  { label: "Alamat Unit", accessor: (row) => row.alamatPenangkaran || "-" },
  { label: "Koordinat Unit", accessor: (row) => row.koordinatLokasi || "-" },
  { label: "No SK", accessor: (row) => row.nomorSk || "-" },
  { label: "File SK", accessor: (row) => (row.nomorSk ? "Tersedia" : "-") },
  { label: "Tgl SK", accessor: (row) => formatDisplayDate(row.tanggalSk) },
  { label: "Masa Berlaku SK", accessor: (row) => formatDisplayDate(row.akhirMasaBerlaku) },
  { label: "Penerbit", accessor: (row) => row.penerbit || "-" },
  { label: "Jenis TSL", accessor: (row) => row.jenisTsl || row.tsl?.namaDaerah || "-" },
  { label: "Status Perlindungan Nasional", accessor: (row) => formatReferenceValue(row.statusPerlindunganNasional || row.tsl?.statusPerlindunganNasional) },
  { label: "Status CITES", accessor: (row) => formatReferenceValue(row.statusCites || row.tsl?.statusCites) },
  { label: "Status IUCN", accessor: (row) => formatReferenceValue(row.statusIucn || row.tsl?.statusIucn) },
  { label: "Jantan", accessor: () => "0" },
  { label: "Betina", accessor: () => "0" },
];

const FILTER_TAGS = PENANGKARAN_COLUMNS.map((column) => column.label);
const PENANGKARAN_COLUMN_MAP = new Map(PENANGKARAN_COLUMNS.map((column) => [column.label, column]));
const STATUS_HEADER_GROUP: PenangkaranHeaderCell = {
  type: "group",
  label: "Status",
  columns: ["Perlindungan Nasional", "CITES", "IUCN"],
};
const TABLE_HEADER_SEQUENCE: PenangkaranHeaderCell[] = [
  { type: "single", label: "Unit Penangkar" },
  { type: "group", label: "Surat Izin", columns: ["No SK", "File SK", "Tgl SK", "Masa Berlaku SK"] },
  { type: "single", label: "Penerbit" },
  { type: "single", label: "Direktor/PJ" },
  { type: "single", label: "No Telp" },
  { type: "single", label: "Bidang" },
  { type: "single", label: "Seksi" },
  { type: "single", label: "Alamat Kantor" },
  { type: "group", label: "Lokasi Penangkaran", columns: ["Alamat Unit", "Koordinat Unit"] },
  { type: "single", label: "Jenis TSL" },
  { type: "group", label: "Status", columns: ["Status Perlindungan Nasional", "Status CITES", "Status IUCN"] },
  { type: "group", label: "Indukan", columns: ["Jantan", "Betina"] },
];
const PENANGKARAN_COLUMN_CONFIG = Object.fromEntries(
  PENANGKARAN_COLUMNS.map((column) => [column.label, column.accessor])
) as Record<string, (row: PenangkaranRow) => string>;

export default function PenangkaranPage() {
  const [penangkaranData, setPenangkaranData] = useState<PenangkaranRow[]>([]);
  const [referensiTslData, setReferensiTslData] = useState<ReferensiTSLRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PenangkaranRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PenangkaranRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    "Unit Penangkar",
    "Seksi",
    "Masa Berlaku SK",
    "Jenis TSL",
    "Status Perlindungan Nasional",
    "Status CITES",
    "Status IUCN",
  ]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const getToken = () =>
    globalThis.window === undefined ? null : localStorage.getItem("token");

  const fetchPenangkaran = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/api/penangkaran`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const result = await res.json();
      if (result.success) setPenangkaranData(result.data);
    } catch (error) {
      console.error("Gagal memuat penangkaran:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReferensiTsl = async () => {
    try {
      const res = await fetch(`${API_URL}/api/referensi-tsl`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const result = await res.json();
      if (result.success) setReferensiTslData(result.data ?? []);
    } catch (error) {
      console.error("Gagal memuat referensi TSL:", error);
    }
  };

  useEffect(() => {
    fetchPenangkaran();
    fetchReferensiTsl();
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUserRole(parsed.role || "");
      } catch (e) {}
    }
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`${API_URL}/api/penangkaran/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        setDeleteTarget(null);
        fetchPenangkaran();
      } else {
        alert("Gagal menghapus data");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredRows = useMemo(() => {
    const referensiById = new Map(referensiTslData.map((item) => [item.id, item]));
    const rowsWithReferensi = penangkaranData
      .filter((row) => row.statusVerifikasi === "disetujui")
      .map((row) => {
      const referensi = row.tslId ? referensiById.get(row.tslId) : undefined;

      return {
        ...row,
        jenisTsl: referensi?.namaDaerah || row.tsl?.namaDaerah || null,
        statusPerlindunganNasional: referensi?.statusPerlindunganNasional || row.tsl?.statusPerlindunganNasional || null,
        statusCites: referensi?.statusCites || row.tsl?.statusCites || null,
        statusIucn: referensi?.statusIucn || row.tsl?.statusIucn || null,
      };
    });

    const q = searchQuery.trim().toLowerCase();
    if (!q) return rowsWithReferensi;
    return rowsWithReferensi.filter((row) =>
      [
        row.namaPenangkaran,
        row.nomorSk,
        row.namaDirektur,
        row.nomorTelepon,
        row.bidangWilayah?.namaWilayah,
        row.seksiWilayah?.namaWilayah,
        row.jenisTsl,
        row.statusPerlindunganNasional,
        row.statusCites,
        row.statusIucn,
      ]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    );
  }, [searchQuery, penangkaranData, referensiTslData]);

  const totalRows = filteredRows.length;
  const startRow = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);
  const visibleRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const visibleHeaderSequence = TABLE_HEADER_SEQUENCE
    .map((cell) => {
      if (cell.type === "single") {
        return selectedFilters.includes(cell.label) ? cell : null;
      }

      const columns = cell.columns.filter((columnLabel) => selectedFilters.includes(columnLabel));
      return columns.length > 0 ? { ...cell, columns } : null;
    })
    .filter(Boolean) as Array<PenangkaranHeaderCell>;
  const visibleSingleColumns = visibleHeaderSequence.filter(
    (cell): cell is Extract<PenangkaranHeaderCell, { type: "single" }> => cell.type === "single"
  );
  const visibleGroupColumns = visibleHeaderSequence.filter(
    (cell): cell is Extract<PenangkaranHeaderCell, { type: "group" }> => cell.type === "group"
  );
  const visibleColumnCount =
    1 +
    visibleSingleColumns.length +
    visibleGroupColumns.reduce((count, cell) => count + cell.columns.length, 0) +
    1;
  const selectedFilteredRows = filteredRows.filter((row) => selectedRows.includes(row.id));
  const rowsForExport = selectedFilteredRows.length > 0 ? selectedFilteredRows : filteredRows;
  const allFilteredSelected = filteredRows.length > 0
    && filteredRows.every((row) => selectedRows.includes(row.id));
  const someFilteredSelected = filteredRows.some((row) => selectedRows.includes(row.id))
    && !allFilteredSelected;

  const toggleFilter = (tag: string) => {
    setSelectedFilters((previous) =>
      previous.includes(tag)
        ? previous.filter((value) => value !== tag)
        : [...previous, tag]
    );
  };

  const selectAll = () => {
    setSelectedFilters([...FILTER_TAGS]);
  };

  const deselectAll = () => {
    setSelectedFilters([]);
  };

  const toggleRow = (id: number) => {
    setSelectedRows((previous) => (
      previous.includes(id)
        ? previous.filter((value) => value !== id)
        : [...previous, id]
    ));
  };

  const toggleAllFilteredRows = () => {
    setSelectedRows((previous) => {
      if (allFilteredSelected) {
        const filteredIds = new Set(filteredRows.map((row) => row.id));
        return previous.filter((id) => !filteredIds.has(id));
      }

      const nextIds = new Set(previous);
      filteredRows.forEach((row) => nextIds.add(row.id));
      return Array.from(nextIds);
    });
  };

  const allColumnsCheckboxRef = useRef<HTMLInputElement>(null);
  const allColumnsSelected = selectedFilters.length === FILTER_TAGS.length;
  const someColumnsSelected = selectedFilters.length > 0 && !allColumnsSelected;

  const toggleAllColumns = () => {
    if (allColumnsSelected) {
      setSelectedFilters([]);
    } else {
      setSelectedFilters([...FILTER_TAGS]);
    }
  };

  useEffect(() => {
    if (allColumnsCheckboxRef.current) {
      allColumnsCheckboxRef.current.indeterminate = someColumnsSelected;
    }
  }, [someColumnsSelected]);

  const masterCheckboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate = someFilteredSelected;
    }
  }, [someFilteredSelected]);

  const filterTags = FILTER_TAGS;

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-[#171717]">
          Penangkar TSL
        </h1>
        <p className="mt-1 text-[14px] text-[#8A8A8A]">
          Kelola informasi data penangkar tumbuhan dan satwa liar
        </p>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative w-full xl:flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-5 w-5 text-gray-500" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="block w-full rounded-lg border border-[#D7D7D7] bg-white py-2.5 pl-11 pr-3 text-[14px] text-[#252525] outline-none placeholder:text-[#B0B0B0] focus:border-[#9EAE2A] focus:ring-2 focus:ring-[#9EAE2A]/15"
            placeholder="Cari unit penangkar, jenis TSL, wilayah ..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap xl:justify-end">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D7D7D7] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#444444] transition-colors hover:bg-[#FAFAFA]"
          >
            <Filter className="h-4 w-4" strokeWidth={2.1} />
            Filter
          </button>
          {userRole !== "seksi_wilayah" && (
            <>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#8E9E25] px-3.5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#7F8F20]"
              >
                <Plus className="h-4 w-4" strokeWidth={2.4} />
                Tambah
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#8E9E25] px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#7e8d20]"
              >
                <Upload className="h-4 w-4" strokeWidth={2.5}/>
                Unggah
              </button>
            </>
          )}
        </div>
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-24 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.35)]">
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Tutup filter"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <FilterGroup
                title="Bidang KSDA"
                items={["I. Bogor", "II. Soreang", "III. Ciamis"]}
              />
              <FilterGroup
                title="Seksi Konservasi"
                items={[
                  "I. Serang",
                  "II. Bogor",
                  "III. Soreang",
                  "IV. Purwakarta",
                  "V. Garut",
                  "VI. Tasikmalaya",
                ]}
              />
              <FilterGroup
                title="Status"
                items={["Disetujui", "Menunggu", "Ditolak"]}
              />
            </div>
          </div>
        </div>
      )}
      <div className="px-4 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-2.5">
            <p className="text-[14px] font-medium text-[#2F2F2F]">
              Pilih kolom yang ditampilkan dan dicetak
            </p>
            <div className="flex flex-wrap gap-2">
              {FILTER_TAGS.map((tag) => {
                const isActive = selectedFilters.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleFilter(tag)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                      isActive
                        ? "border-[#C4CE71] bg-[#F2F6D7] text-[#647221]"
                        : "border-[#D8D8D8] bg-white text-[#7A7A7A] hover:bg-[#FAFAFA]"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            <label className="inline-flex items-center gap-2 text-[12px] text-[#484848]">
              <input
                ref={allColumnsCheckboxRef}
                type="checkbox"
                checked={allColumnsSelected}
                onChange={toggleAllColumns}
                className="h-3.5 w-3.5 rounded border-[#B9B9B9] accent-[#8E9E25]"
                aria-label="Pilih semua kolom"
              />
              <span>Pilih semua atribut</span>
            </label>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#8E9E25] px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#7F8F20]"
            >
              <Download className="h-4 w-4" strokeWidth={2.4} />
              Unduh
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setPageSizeOpen((prev) => !prev)}
                className="flex items-center gap-1 min-w-[40px] rounded-[6px] border border-[#E3E3E3] bg-white px-2 py-1 shadow-sm"
              >
                <span className="text-[13px] text-[#171717]">{pageSize}</span>
                <ChevronDown className="h-3 w-3 text-[#4C4C4C]" />
              </button>
              {pageSizeOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 min-w-[40px] rounded-[6px] border border-[#E3E3E3] bg-white py-1 shadow-md">
                  {[5, 10, 25].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => { setPageSize(size); setCurrentPage(1); setPageSizeOpen(false); }}
                      className={`block w-full px-3 py-1 text-left text-[13px] transition-colors hover:bg-[#F5F5F5] ${
                        pageSize === size ? "font-semibold text-[#171717]" : "text-[#4C4C4C]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-[14px] text-gray-400">
              Memuat data...
            </div>
          ) : (
            <table className="min-w-full border-collapse text-[12px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th
                    rowSpan={2}
                    className="border border-gray-200 px-2 py-2 text-center font-bold text-gray-800 w-10"
                  >
                    <input
                      ref={masterCheckboxRef}
                      type="checkbox"
                      checked={allFilteredSelected && filteredRows.length > 0}
                      onChange={toggleAllFilteredRows}
                      className="h-3.5 w-3.5 rounded border-gray-300 accent-[#8E9E25]"
                      aria-label="Pilih semua baris"
                    />
                  </th>
                  {visibleHeaderSequence.map((cell) => {
                    if (cell.type === "single") {
                      return (
                        <th
                          key={cell.label}
                          rowSpan={2}
                          className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800"
                        >
                          {cell.label}
                        </th>
                      );
                    }

                    return (
                      <th
                        key={cell.label}
                        colSpan={cell.columns.length}
                        className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800"
                      >
                        {cell.label}
                      </th>
                    );
                  })}
                  <th
                    rowSpan={2}
                    className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800 w-16"
                  >
                    Aksi
                  </th>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {visibleGroupColumns.flatMap((cell) =>
                    cell.columns.map((columnLabel) => (
                      <th
                        key={`${cell.label}-${columnLabel}`}
                        className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700"
                      >
                        {columnLabel}
                      </th>
                    ))
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={visibleColumnCount} className="py-16 text-center text-[13px] text-gray-400">
                      Tidak ada data penangkaran
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((row) => {
                    const isSelected = selectedRows.includes(row.id);

                    return (
                      <tr key={row.id} className={`transition-colors hover:bg-gray-50 ${isSelected ? "bg-[#F6F7E6]" : ""}`}>
                        <td className="h-13 border border-gray-100 px-2 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(row.id)}
                            className="h-3.5 w-3.5 rounded border-gray-300 accent-[#8E9E25]"
                            aria-label={`Pilih baris ${row.namaPenangkaran}`}
                          />
                        </td>
                        {visibleHeaderSequence.map((cell) => {
                          if (cell.type === "single") {
                            const column = PENANGKARAN_COLUMN_MAP.get(cell.label);
                            return (
                              <td key={cell.label} className="border border-gray-100 px-2 py-3 text-gray-700">
                                {column ? column.accessor(row) : "-"}
                              </td>
                            );
                          }

                          return cell.columns.map((columnLabel) => {
                            const column = PENANGKARAN_COLUMN_MAP.get(columnLabel);
                            return (
                              <td key={`${cell.label}-${columnLabel}`} className="border border-gray-100 px-2 py-3 text-gray-700">
                                {column ? column.accessor(row) : "-"}
                              </td>
                            );
                          });
                        })}
                        <td className="border border-gray-100 px-2 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => { setSelectedItem(row); setIsDetailModalOpen(true); }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#9B8CF2] bg-[#DCD6FF] text-[#5E50C7] shadow-sm transition-colors hover:bg-[#cec4ff]"
                              title="Lihat"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                            {userRole !== "seksi_wilayah" && (
                              <>
                                <button
                                  onClick={() => { setSelectedItem(row); setIsUpdateModalOpen(true); }}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F2D79A] bg-[#FDF1CC] text-[#C99A2F] shadow-sm transition-colors hover:bg-[#f9e4a2]"
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(row)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F0A5A5] bg-[#F9D7D7] text-[#D85C5C] shadow-sm transition-colors hover:bg-[#f4c2c2]"
                                  title="Hapus"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pb-2">
        <p className="text-[13px] text-gray-400 font-medium">
          Menampilkan {startRow} dari {endRow} data
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((previous) => Math.max(previous - 1, 1))}
            className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded bg-[#8E9E25] text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#7e8d20]">
            {currentPage}
          </button>
          <button
            onClick={() => setCurrentPage((previous) => previous + 1)}
            className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage * pageSize >= totalRows}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AddDataModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchPenangkaran} />
      <UploadDocModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
      <DetailDataModal
        isOpen={isDetailModalOpen}
        onClose={() => { setIsDetailModalOpen(false); setSelectedItem(null); }}
        data={selectedItem}
      />
      <UpdateDataModal
        isOpen={isUpdateModalOpen}
        onClose={() => { setIsUpdateModalOpen(false); setSelectedItem(null); }}
        data={selectedItem}
        onSuccess={fetchPenangkaran}
      />

      <ExportPreviewModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={rowsForExport}
        selectedColumns={selectedFilters}
        columnConfig={PENANGKARAN_COLUMN_CONFIG}
        title="Data Penangkar TSL"
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]">
          <div className="relative w-full max-w-sm rounded-[22px] bg-white px-6 py-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.28)]">
            <button
              onClick={() => setDeleteTarget(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <div className="flex items-start gap-3 pr-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                <Trash2 className="h-5 w-5 text-red-600" strokeWidth={2.5} />
              </div>
              <div className="pt-0.5">
                <h3 className="text-[15px] font-semibold text-gray-900">Hapus Data Penangkaran</h3>
              </div>
            </div>
            <p className="mt-4 text-[14px] text-gray-700">
              Apakah Anda yakin ingin menghapus{" "}
              <span className="font-semibold text-gray-900">{deleteTarget.namaPenangkaran}</span>?
              Data yang dihapus tidak dapat dikembalikan.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, items }: Readonly<{ title: string; items: string[] }>) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-gray-900">{title}</h3>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 accent-[#8E9E25] focus:ring-[#8E9E25]"
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
