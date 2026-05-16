"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Upload,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import FilterPopover from "../../components/pengedaran-luar/FilterPopover";
import { AddDataModal } from "../../components/pengedaran-luar/AddDataModal";
import { UpdateDataModal } from "../../components/pengedaran-luar/UpdateDataModal";
import { DetailDataModal } from "../../components/pengedaran-luar/DetailDataModal";
import { UploadDocModal } from "../../components/ui/UploadDocModal";
import { ExportPreviewModal } from "../../components/penangkaran/ExportPreviewModal";
import { AddDataAlertModal } from "../../components/layout/AddDataAlertModal";

interface PengedaranLuarDetailData {
  id: number;
  namaPengedaran: string;
  namaDirektur: string | null;
  nomorTelepon: string | null;
  alamatKantor: string | null;
  alamatPengedaran: string | null;
  koordinatLokasi: string | null;
  nomorSk: string | null;
  tanggalSk: string | null;
  akhirMasaBerlaku: string | null;
  penerbit: string | null;
  bidangWilayah?: { namaWilayah: string } | null;
  seksiWilayah?: { namaWilayah: string } | null;
  jenisTsl?: string | null;
  tsl?: { namaDaerah?: string | null } | null;
  statusPerlindunganNasional?: string | null;
  statusCites?: string | null;
  statusIucn?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

const FILTER_TAGS = [
  "Unit Pengedar",
  "Direktor/PJ",
  "No Telp",
  "Bidang",
  "Seksi",
  "Alamat Kantor",
  "Alamat Unit",
  "Koordinat Unit",
  "No SK",
  "File SK",
  "Tgl SK",
  "Masa Berlaku SK",
  "Penerbit",
  "Jenis TSL",
  "Jantan",
  "Betina",
];

const rows = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  status: "Disetujui",
}));

type PengedaranHeaderCell =
  | { type: "single"; label: string }
  | { type: "group"; label: string; columns: string[] };

const TABLE_HEADER_SEQUENCE: PengedaranHeaderCell[] = [
  { type: "single", label: "Unit Pengedar" },
  { type: "group", label: "Surat Izin", columns: ["No SK", "File SK", "Tgl SK", "Masa Berlaku SK"] },
  { type: "single", label: "Penerbit" },
  { type: "single", label: "Direktor/PJ" },
  { type: "single", label: "No Telp" },
  { type: "single", label: "Bidang" },
  { type: "single", label: "Seksi" },
  { type: "single", label: "Alamat Kantor" },
  { type: "group", label: "Lokasi Pengedar", columns: ["Alamat Unit", "Koordinat Unit"] },
  { type: "single", label: "Jenis TSL" },
  { type: "group", label: "Indukan", columns: ["Jantan", "Betina"] },
];

export default function PengedaranLuarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetailData, setSelectedDetailData] = useState<PengedaranLuarDetailData | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertState, setAlertState] = useState<{isOpen: boolean; type: "success" | "error"; title?: string; message?: string}>({
    isOpen: false,
    type: "success"
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState({
    bidang: [] as string[],
    seksi: [] as string[],
    status: [] as string[],
  });
  const filterButtonRef = useRef<HTMLDivElement>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    "Unit Pengedar",
    "Seksi",
    "Masa Berlaku SK",
    "Jenis TSL",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const totalRows = rows.length;
  const startRow = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);
  const visibleRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUserRole(parsed.role || "");
      } catch (e) {}
    }
  }, []);

  const handleDelete = async () => {
    if (deleteTargetId === null) return;
    const userStr = globalThis.window === undefined ? null : localStorage.getItem("user");
    const role = userStr ? JSON.parse(userStr).role : "";
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const token = globalThis.window === undefined ? null : localStorage.getItem("token");
    try {
      setIsDeleting(true);
      const res = await fetch(`${API_URL}/api/pengedaran-luar/${deleteTargetId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setDeleteTargetId(null);
      if (res.ok) {
        if (role === "admin_pusat") {
          setAlertState({ isOpen: true, type: "success", title: "Hapus data berhasil!", message: "Data berhasil dihapus dari database." });
        } else if (role === "bidang_wilayah") {
          setAlertState({ isOpen: true, type: "success", title: "Hapus data diajukan!", message: "Penghapusan data diverifikasi terlebih dahulu oleh Admin Pusat." });
        }
      } else {
        if (role === "admin_pusat") {
          setAlertState({ isOpen: true, type: "error", title: "Hapus data gagal!", message: "Terjadi kesalahan saat menghapus data." });
        } else {
          setAlertState({ isOpen: true, type: "error", title: "Hapus data gagal!", message: "Terjadi kesalahan saat menghapus data." });
        }
      }
    } catch {
      if (role === "admin_pusat") {
        setAlertState({ isOpen: true, type: "error", title: "Hapus data gagal!", message: "Terjadi kesalahan sistem." });
      } else {
        setAlertState({ isOpen: true, type: "error", title: "Terjadi kesalahan!", message: "Terjadi kesalahan sistem." });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleFilter = (tag: string) => {
    setSelectedFilters((previous) =>
      previous.includes(tag)
        ? previous.filter((value) => value !== tag)
        : [...previous, tag]
    );
  };

  const toggleRowFilter = (group: keyof typeof filterState, value: string) => {
    setFilterState((prev) => ({
      ...prev,
      [group]: prev[group].includes(value)
        ? prev[group].filter((v) => v !== value)
        : [...prev[group], value],
    }));
  };

  const clearRowFilters = () => {
    setFilterState({ bidang: [], seksi: [], status: [] });
  };

  const allColumnsCheckboxRef = useRef<HTMLInputElement>(null);
  const masterCheckboxRef = useRef<HTMLInputElement>(null);
  const allColumnsSelected = selectedFilters.length === FILTER_TAGS.length;
  const someColumnsSelected = selectedFilters.length > 0 && !allColumnsSelected;

  const allFilteredSelected = rows.length > 0 && selectedRows.length === rows.length;
  const someFilteredSelected = selectedRows.length > 0 && !allFilteredSelected;

  const toggleAllColumns = () => {
    if (allColumnsSelected) {
      setSelectedFilters([]);
    } else {
      setSelectedFilters([...FILTER_TAGS]);
    }
  };

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllFilteredRows = () => {
    if (allFilteredSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((r) => r.id));
    }
  };

  useEffect(() => {
    if (allColumnsCheckboxRef.current) {
      allColumnsCheckboxRef.current.indeterminate = someColumnsSelected;
    }
  }, [someColumnsSelected]);

  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate = someFilteredSelected;
    }
  }, [someFilteredSelected]);

  const columnConfig: Record<string, (row: any) => string> = {
    "Unit Pengedar": (row) => row.namaUnit || "-",
    "Direktor/PJ": (row) => row.namaDirektur || "-",
    "No Telp": (row) => row.nomorTelepon || "-",
    "Bidang": (row) => row.bidang || "-",
    "Seksi": (row) => row.seksi || "-",
    "Alamat Kantor": (row) => row.alamatKantor || "-",
    "Alamat Unit": (row) => row.alamatUnit || "-",
    "Koordinat Unit": (row) => row.koordinat || "-",
    "No SK": (row) => row.nomorSk || "-",
    "File SK": () => "Tersedia",
    "Tgl SK": (row) => row.tanggalSk || "-",
    "Masa Berlaku SK": (row) => row.masaBerlaku || "-",
    "Penerbit": (row) => row.penerbit || "-",
    "Jenis TSL": (row) => row.jenisTsl || "-",
    "Jantan": () => "0",
    "Betina": () => "0",
  };
  const columnMap = new Map(Object.entries(columnConfig));
  const visibleHeaderSequence = TABLE_HEADER_SEQUENCE
    .map((cell) => {
      if (cell.type === "single") {
        return selectedFilters.includes(cell.label) ? cell : null;
      }

      const columns = cell.columns.filter((columnLabel) => selectedFilters.includes(columnLabel));
      return columns.length > 0 ? { ...cell, columns } : null;
    })
    .filter(Boolean) as Array<PengedaranHeaderCell>;
  const visibleGroupColumns = visibleHeaderSequence.filter(
    (cell): cell is Extract<PengedaranHeaderCell, { type: "group" }> => cell.type === "group"
  );

  const buildDetailData = (row: any): PengedaranLuarDetailData => ({
    id: row.id,
    namaPengedaran: row.namaUnit || "-",
    namaDirektur: row.namaDirektur || null,
    nomorTelepon: row.nomorTelepon || null,
    alamatKantor: row.alamatKantor || null,
    alamatPengedaran: row.alamatUnit || null,
    koordinatLokasi: row.koordinat || null,
    nomorSk: row.nomorSk || null,
    tanggalSk: row.tanggalSk || null,
    akhirMasaBerlaku: row.masaBerlaku || null,
    penerbit: row.penerbit || null,
    jenisTsl: row.jenisTsl || null,
    statusPerlindunganNasional: row.statusPerlindunganNasional || null,
    statusCites: row.statusCites || null,
    statusIucn: row.statusIucn || null,
    createdAt: row.createdAt || null,
    updatedAt: row.updatedAt || null,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-[#171717]">
          Pengedaran TSL Luar Negeri
        </h1>
        <p className="mt-1 text-[14px] text-[#8A8A8A]">
          Kelola informasi data pengedar tumbuhan dan satwa liar luar negeri
        </p>
      </div>

      {/* Search + Action Buttons */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative w-full xl:flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-5 w-5 text-gray-500" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            className="block w-full rounded-lg border border-[#D7D7D7] bg-white py-2.5 pl-11 pr-3 text-[14px] text-[#252525] outline-none placeholder:text-[#B0B0B0] focus:border-[#9EAE2A] focus:ring-2 focus:ring-[#9EAE2A]/15"
            placeholder="Cari unit pengedar luar negeri, jenis TSL, wilayah ..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap xl:justify-end">
          <FilterPopover
            filterButtonRef={filterButtonRef}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            filterState={filterState}
            toggleRowFilter={toggleRowFilter}
            clearRowFilters={clearRowFilters}
          />
          {userRole !== "seksi_wilayah" && (
            <>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#8E9E25] px-3.5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#7F8F20]"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Tambah
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#8E9E25] px-3.5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#7F8F20]"
              >
                <Upload className="h-4 w-4" strokeWidth={2.5} />
                Unggah
              </button>
            </>
          )}
        </div>
      </div>


      {/* Column selector + controls */}
      <div className="px-4 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* Left: label + pills + checkbox */}
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

          {/* Right: Unduh + pageSize — vertically centered to whole card */}
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
                      onClick={() => {
                        setPageSize(size);
                        setCurrentPage(1);
                        setPageSizeOpen(false);
                      }}
                      className={`block w-full px-3 py-1 text-left text-[13px] transition-colors hover:bg-[#F5F5F5] ${
                        pageSize === size
                          ? "font-semibold text-[#171717]"
                          : "text-[#4C4C4C]"
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
                    checked={allFilteredSelected && rows.length > 0}
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
              {visibleRows.map((row) => {
                const isSelected = selectedRows.includes(row.id);
                return (
                  <tr key={row.id} className={`hover:bg-gray-50 transition-colors ${isSelected ? "bg-[#F6F7E6]" : ""}`}>
                    <td className="border border-gray-100 px-2 py-3 text-center h-[52px]">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(row.id)}
                        className="h-3.5 w-3.5 rounded border-gray-300 accent-[#8E9E25]"
                        aria-label={`Pilih baris ${row.id}`}
                      />
                    </td>
                    {visibleHeaderSequence.map((cell) => {
                      if (cell.type === "single") {
                        const accessor = columnMap.get(cell.label);
                        return (
                          <td key={cell.label} className="border border-gray-100 px-2 py-3 text-gray-500">
                            {accessor ? accessor(row) : "-"}
                          </td>
                        );
                      }

                      return cell.columns.map((columnLabel) => {
                        const accessor = columnMap.get(columnLabel);
                        return (
                          <td key={`${cell.label}-${columnLabel}`} className="border border-gray-100 px-2 py-3 text-gray-500">
                            {accessor ? accessor(row) : "-"}
                          </td>
                        );
                      });
                    })}
                  <td className="border border-gray-100 px-2 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedDetailData(buildDetailData(row));
                          setIsDetailModalOpen(true);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#9B8CF2] bg-[#DCD6FF] text-[#5E50C7] shadow-sm transition-colors hover:bg-[#cec4ff]"
                        title="Lihat"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      {userRole !== "seksi_wilayah" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedDetailData(buildDetailData(row));
                              setIsUpdateModalOpen(true);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F2D79A] bg-[#FDF1CC] text-[#C99A2F] shadow-sm transition-colors hover:bg-[#f9e4a2]"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F0A5A5] bg-[#F9D7D7] text-[#D85C5C] shadow-sm transition-colors hover:bg-[#f4c2c2]"
                            title="Hapus"
                            onClick={() => setDeleteTargetId(row.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
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

      <AddDataModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <DetailDataModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDetailData(null);
        }}
        data={selectedDetailData}
      />
      <UpdateDataModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedDetailData(null);
        }}
        data={selectedDetailData}
      />
      <UploadDocModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      <ExportPreviewModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={rows}
        selectedColumns={selectedFilters}
        columnConfig={columnConfig}
        title="Data Pengedar TSL Luar Negeri"
      />

      {/* Delete Confirm Modal */}
      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]">
          <div className="relative w-full max-w-sm rounded-[22px] bg-white px-6 py-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.28)]">
            <div className="flex items-start gap-3 pr-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                <Trash2 className="h-5 w-5 text-red-600" strokeWidth={2.5} />
              </div>
              <div className="pt-0.5">
                <h3 className="text-[15px] font-semibold text-gray-900">Hapus Data Pengedaran LN</h3>
              </div>
            </div>
            <p className="mt-4 text-[14px] text-gray-700">
              Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
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

      <AddDataAlertModal
        isOpen={alertState.isOpen}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onClose={() => setAlertState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

