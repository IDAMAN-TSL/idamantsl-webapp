"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { AddDataModal } from "../../components/referensi-tsl/AddDataModal";
import { UpdateDataModal } from "../../components/referensi-tsl/UpdateDataModal";
import { UploadDocModal } from "../../components/ui/UploadDocModal";
import { ExportReferensiModal, COLUMN_CONFIG } from "../../components/referensi-tsl/ExportReferensiModal";
import { ViewDataModal } from "../../components/referensi-tsl/ViewDataModal";

const FILTER_TAGS = [
  "Nama Daerah",
  "Kingdom",
  "Divisi",
  "Kelas",
  "Ordo",
  "Family",
  "Genus",
  "Spesies",
  "Status Perlindungan Nasional",
  "Status CITES",
  "Status IUCN",
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface ReferensiTSL {
  id: number;
  nomor?: string | null;
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
  statusVerifikasi?: string | null;
  namaInputor?: string | null;
}

export default function ReferensiTSLPage() {
  const [data, setData] = useState<ReferensiTSL[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [selectedUpdateData, setSelectedUpdateData] = useState<ReferensiTSL | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    "Nama Daerah",
    "Kingdom",
    "Spesies",
    "Status IUCN",
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedViewData, setSelectedViewData] = useState<ReferensiTSL | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // ─── Fetch Data ───────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = globalThis.window === undefined ? null : localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/referensi-tsl`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) {
        setData(json.data ?? []);
      } else {
        console.error("Referensi TSL API error:", json.message);
        setError(`Gagal memuat data: ${json.message ?? "Periksa koneksi atau login ulang."}`);
      }
    } catch (err) {
      console.error("Gagal memuat referensi TSL:", err);
      setError("Gagal memuat data referensi TSL. Pastikan server berjalan.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchData(); 
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUserRole(parsed.role || "");
      } catch (e) {}
    }
  }, [fetchData]);

  // ─── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (deleteTargetId === null) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/referensi-tsl/${deleteTargetId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Gagal menghapus data");
      setIsDeleteConfirmOpen(false);
      setDeleteTargetId(null);
      fetchData();
    } catch {
      alert("Gagal menghapus data. Silakan coba lagi.");
    }
  };

  // ─── Filter & Pagination ──────────────────────────────────────────────────
  const filteredData = data.filter((row) => {
    if (row.statusVerifikasi !== "disetujui") return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return [row.namaDaerah, row.jenis, row.kingdom, row.divisi, row.spesies]
      .some((v) => v?.toLowerCase().includes(q));
  });

  const totalRows = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const visibleRows = filteredData.slice(startIndex, startIndex + pageSize);
  const startRow = totalRows === 0 ? 0 : startIndex + 1;
  const endRow = Math.min(startIndex + pageSize, totalRows);

  const visibleIds = visibleRows.map((r) => r.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedRows.includes(id));
  const someVisibleSelected = visibleIds.some((id) => selectedRows.includes(id)) && !allVisibleSelected;

  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleAllVisible = () => {
    setSelectedRows((prev) => {
      if (allVisibleSelected) return prev.filter((id) => !visibleIds.includes(id));
      const newIds = visibleIds.filter((id) => !prev.includes(id));
      return [...prev, ...newIds];
    });
  };

  const toggleFilter = (tag: string) => {
    setSelectedFilters((prev) =>
      prev.includes(tag) ? prev.filter((v) => v !== tag) : [...prev, tag]
    );
  };

  // ─── Select / deselect ALL column filter tags ─────────────────────────────
  const allColumnsSelected = FILTER_TAGS.every((t) => selectedFilters.includes(t));
  const someColumnsSelected = FILTER_TAGS.some((t) => selectedFilters.includes(t)) && !allColumnsSelected;

  const toggleAllColumns = () => {
    if (allColumnsSelected) {
      setSelectedFilters([]);
    } else {
      setSelectedFilters([...FILTER_TAGS]);
    }
  };

  // Master checkbox ref for indeterminate state (row selection in table header)
  const masterCheckboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate = someVisibleSelected;
    }
  }, [someVisibleSelected]);

  // Column select-all checkbox ref for indeterminate state
  const allColumnsCheckboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (allColumnsCheckboxRef.current) {
      allColumnsCheckboxRef.current.indeterminate = someColumnsSelected;
    }
  }, [someColumnsSelected]);

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-[#171717]">
          Referensi TSL
        </h1>
        <p className="mt-1 text-[14px] text-[#8A8A8A]">
          Kelola informasi data referensi tumbuhan dan satwa liar
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
            placeholder="Cari nama pengguna, email, wilayah ..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap xl:justify-end">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-[#D7D7D7] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#444444] transition-colors hover:bg-[#FAFAFA]"
          >
            <Filter className="h-4 w-4" strokeWidth={2.1} />
            Filter
          </button>
          {userRole !== "seksi_wilayah" && (
            <>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#8E9E25] px-3.5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#7F8F20]"
              >
                <Plus className="h-4 w-4" strokeWidth={2.4} />
                Tambah
              </button>
              <button
                type="button"
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

      {/* Filter Modal */}
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
              <FilterGroup title="Jenis TSL" items={["Tumbuhan", "Satwa"]} />
              <FilterGroup title="Status CITES" items={["Appendix I", "Appendix II", "Appendix III"]} />
              <FilterGroup title="Status IUCN" items={["LC", "VU", "EN", "CR"]} />
            </div>
          </div>
        </div>
      )}

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

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#DCDCDC] bg-white shadow-[0_8px_24px_-22px_rgba(0,0,0,0.45)]">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-[14px] text-gray-400">
              Memuat data...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20 text-[14px] text-red-500">
              {error}
            </div>
          ) : (
            <table className="min-w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[#DCDCDC] bg-[#FAFAFA]">
                  {/* Checkbox header */}
                  <th
                    rowSpan={2}
                    className="border-r border-[#DCDCDC] px-2 py-3 text-center font-semibold text-[#4F4F4F] w-12"
                  >
                    <input
                      ref={masterCheckboxRef}
                      type="checkbox"
                      checked={allVisibleSelected && visibleIds.length > 0}
                      onChange={toggleAllVisible}
                      className="h-3.5 w-3.5 rounded border-gray-300 accent-[#8E9E25]"
                      aria-label="Pilih semua baris"
                    />
                  </th>
                  {/* Kolom Nama Daerah & Jenis TSL selalu tampil */}
                  <th rowSpan={2} className="border-r border-[#DCDCDC] px-4 py-3 text-center font-semibold text-[#4F4F4F] min-w-[130px]">
                    Nama Daerah
                  </th>
                  <th rowSpan={2} className="border-r border-[#DCDCDC] px-4 py-3 text-center font-semibold text-[#4F4F4F] min-w-[90px]">
                    Jenis TSL
                  </th>
                  {/* Dynamic group headers */}
                  {["Kingdom","Divisi","Kelas","Ordo","Family","Genus","Spesies"].some((c) => selectedFilters.includes(c)) && (
                    <th
                      colSpan={["Kingdom","Divisi","Kelas","Ordo","Family","Genus","Spesies"].filter((c) => selectedFilters.includes(c)).length}
                      className="border-r border-[#DCDCDC] px-4 py-3 text-center font-semibold text-[#4F4F4F]"
                    >
                      Klasifikasi
                    </th>
                  )}
                  {["Status Perlindungan Nasional","Status CITES","Status IUCN"].some((c) => selectedFilters.includes(c)) && (
                    <th
                      colSpan={["Status Perlindungan Nasional","Status CITES","Status IUCN"].filter((c) => selectedFilters.includes(c)).length}
                      className="border-r border-[#DCDCDC] px-4 py-3 text-center font-semibold text-[#4F4F4F]"
                    >
                      Status
                    </th>
                  )}
                  <th rowSpan={2} className="px-4 py-3 text-center font-semibold text-[#4F4F4F] w-28">
                    Aksi
                  </th>
                </tr>
                <tr className="border-b border-[#DCDCDC] bg-[#FAFAFA]">
                  {["Kingdom","Divisi","Kelas","Ordo","Family","Genus","Spesies"].filter((c) => selectedFilters.includes(c)).map((col) => (
                    <th key={col} className="border-r border-[#DCDCDC] px-4 py-3 text-center font-semibold text-[#4F4F4F] min-w-[80px]">
                      {col}
                    </th>
                  ))}
                  {["Status Perlindungan Nasional","Status CITES","Status IUCN"].filter((c) => selectedFilters.includes(c)).map((col) => (
                    <th key={col} className="border-r border-[#DCDCDC] px-4 py-3 text-center font-semibold text-[#4F4F4F] min-w-[100px]">
                      {col === "Status Perlindungan Nasional" ? "Perlindungan Nasional" : col === "Status CITES" ? "CITES" : "IUCN"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="py-16 text-center text-[13px] text-[#A3A3A3]">
                      Tidak ada data ditemukan
                    </td>
                  </tr>
                ) : (
                  visibleRows.map((row) => {
                    const isSelected = selectedRows.includes(row.id);
                    return (
                      <tr
                        key={row.id}
                        className={`border-b border-[#E5E5E5] transition-colors hover:bg-[#FCFCFC] ${isSelected ? "bg-[#F6F7E6]" : ""}`}
                      >
                        <td className="border-r border-[#E5E5E5] px-4 py-3 text-center h-[52px]">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(row.id)}
                            className="h-3.5 w-3.5 rounded border-[#B9B9B9] accent-[#8E9E25]"
                          />
                        </td>
                        <td className="border-r border-[#E5E5E5] px-4 py-3 text-[#2C2C2C] font-medium">
                          {row.namaDaerah}
                        </td>
                        <td className="border-r border-[#E5E5E5] px-4 py-3 text-center text-[#2C2C2C] capitalize">
                          {row.jenis?.replace("_", " ")}
                        </td>
                        {/* Dynamic klasifikasi columns */}
                        {["Kingdom","Divisi","Kelas","Ordo","Family","Genus","Spesies"].filter((c) => selectedFilters.includes(c)).map((col) => (
                          <td key={col} className="border-r border-[#E5E5E5] px-4 py-3 text-[#2C2C2C]">
                            {COLUMN_CONFIG[col](row)}
                          </td>
                        ))}
                        {/* Dynamic status columns */}
                        {["Status Perlindungan Nasional","Status CITES","Status IUCN"].filter((c) => selectedFilters.includes(c)).map((col) => (
                          <td key={col} className="border-r border-[#E5E5E5] px-4 py-3 text-center text-[#2C2C2C] capitalize">
                            {COLUMN_CONFIG[col](row)}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => { setSelectedViewData(row); setIsViewModalOpen(true); }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#9B8CF2] bg-[#DCD6FF] text-[#5E50C7] shadow-sm transition-colors hover:bg-[#cec4ff]"
                              aria-label="Lihat detail"
                            >
                              <ExternalLink className="h-4 w-4" strokeWidth={2.3} />
                            </button>
                            {userRole !== "seksi_wilayah" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => { setSelectedUpdateData(row); setIsUpdateModalOpen(true); }}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E6D382] bg-[#FFF8DA] text-[#C19A15] transition-colors hover:bg-[#FFF2C0]"
                                  aria-label="Edit data"
                                >
                                  <Pencil className="h-4 w-4" strokeWidth={2.4} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setDeleteTargetId(row.id); setIsDeleteConfirmOpen(true); }}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F2A6A6] bg-[#FFEEEE] text-[#D24B4B] transition-colors hover:bg-[#FFE1E1]"
                                  aria-label="Hapus data"
                                >
                                  <Trash2 className="h-4 w-4" strokeWidth={2.4} />
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

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 pb-2">
        <p className="text-[12px] text-[#707070]">
          Menampilkan {startRow}–{endRow} dari {totalRows} data
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={safePage === 1}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D7D7D7] bg-white text-[#555555] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#D7D7D7] bg-white px-2 text-[12px] text-[#444444]">
            {safePage}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={safePage >= totalPages}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D7D7D7] bg-white text-[#555555] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-[16px] font-bold text-gray-900">Hapus Data?</h3>
            <p className="mt-2 text-[13px] text-gray-500">
              Data referensi TSL ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => { setIsDeleteConfirmOpen(false); setDeleteTargetId(null); }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <AddDataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />
      <UploadDocModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
      <UpdateDataModal
        isOpen={isUpdateModalOpen}
        onClose={() => { setIsUpdateModalOpen(false); setSelectedUpdateData(null); }}
        data={selectedUpdateData}
        onSuccess={fetchData}
      />
      <ExportReferensiModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={filteredData}
        selectedColumns={selectedFilters}
      />
      <ViewDataModal
        isOpen={isViewModalOpen}
        onClose={() => { setIsViewModalOpen(false); setSelectedViewData(null); }}
        data={selectedViewData}
      />
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
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 accent-[#8E9E25]" />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
