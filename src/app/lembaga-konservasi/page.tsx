"use client";

import { useState, useEffect, useRef } from "react";
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
import { AddDataModal } from "../../components/lembaga-konservasi/AddDataModal";
import { UpdateDataModal } from "../../components/lembaga-konservasi/UpdateDataModal";
import { UploadDocModal } from "../../components/ui/UploadDocModal";
import { ExportPreviewModal } from "../../components/penangkaran/ExportPreviewModal";

const FILTER_TAGS = [
  "Unit Lembaga",
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
  "Status",
  "Lokasi",
  "Koordinat",
];

const rows = Array.from({ length: 5 }, (_, index) => ({
  id: index + 1,
  status: "Aktif",
}));

export default function LembagaKonservasiPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    "Unit Lembaga",
    "Seksi",
    "Masa Berlaku SK",
    "Status",
  ]);
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

  const toggleFilter = (tag: string) => {
    setSelectedFilters((previous) =>
      previous.includes(tag)
        ? previous.filter((value) => value !== tag)
        : [...previous, tag]
    );
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
    "Unit Lembaga": (row) => row.namaUnit || "-",
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
    "Status": (row) => row.status || "-",
    "Lokasi": (row) => row.lokasi || "-",
    "Koordinat": (row) => row.koordinat || "-",
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-[#171717]">
          Lembaga Konservasi TSL
        </h1>
        <p className="mt-1 text-[14px] text-[#8A8A8A]">
          Kelola informasi data lembaga konservasi tumbuhan dan satwa liar
        </p>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative w-full xl:flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-5 w-5 text-gray-500" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border border-[#D7D7D7] bg-white py-2.5 pl-11 pr-3 text-[14px] text-[#252525] outline-none placeholder:text-[#B0B0B0] focus:border-[#9EAE2A] focus:ring-2 focus:ring-[#9EAE2A]/15"
            placeholder="Cari unit lembaga, nama TSL, atau lokasi ..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap xl:justify-end">
          <button
          type="button"
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
                className="inline-flex items-center gap-2 rounded-lg bg-[#8E9E25] px-3.5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#7F8F20]"
              >
                <Upload className="h-4 w-4" strokeWidth={2.4} />
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
              <FilterGroup title="Status" items={["Aktif", "Proses", "Tidak Aktif"]} />
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

          {/* Right: Unduh + pageSize — vertically centered */}
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
                <th
                  rowSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800 min-w-[130px]"
                >
                  Nama Unit<br />Lembaga
                </th>
                <th
                  colSpan={3}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800"
                >
                  Surat Izin
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800 min-w-[80px]"
                >
                  Penerbit
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800 min-w-[130px]"
                >
                  Nama Direktur/<br />Penanggung Jawab
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800 min-w-[110px]"
                >
                  Nomor Telepon/<br />Faximile
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800 min-w-[110px]"
                >
                  Bidang KSDA<br />Wilayah
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800 min-w-[110px]"
                >
                  Seksi Konservasi<br />Wilayah
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800 min-w-[100px]"
                >
                  Lokasi Kantor
                </th>
                <th
                  colSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800"
                >
                  Lokasi Lembaga
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800 min-w-[90px]"
                >
                  Status
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800 w-16"
                >
                  Aksi
                </th>
              </tr>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700 min-w-[110px]">
                  No. SK
                </th>
                <th className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700 min-w-[110px]">
                  Tanggal SK
                </th>
                <th className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700 min-w-[100px]">
                  Akhir masa<br />berlaku izin
                </th>
                <th className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700 min-w-[120px]">
                  Alamat
                </th>
                <th className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700 min-w-[110px]">
                  Koordinat
                </th>
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
                  <td className="border border-gray-100 px-2 py-3 text-gray-500" />
                  <td className="border border-gray-100 px-2 py-3 text-gray-500" />
                  <td className="border border-gray-100 px-2 py-3 text-gray-500" />
                  <td className="border border-gray-100 px-2 py-3 text-gray-500" />
                  <td className="border border-gray-100 px-2 py-3 text-gray-500" />
                  <td className="border border-gray-100 px-2 py-3 text-gray-500" />
                  <td className="border border-gray-100 px-2 py-3 text-gray-500" />
                  <td className="border border-gray-100 px-2 py-3 text-gray-500" />
                  <td className="border border-gray-100 px-2 py-3 text-gray-500" />
                  <td className="border border-gray-100 px-2 py-3 text-gray-500" />
                  <td className="border border-gray-100 px-2 py-3 text-gray-500" />
                  <td className="border border-gray-100 px-2 py-3 text-gray-500" />
                  <td className="border border-gray-100 px-2 py-3 text-center text-gray-500" />
                  <td className="border border-gray-100 px-2 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#9B8CF2] bg-[#DCD6FF] text-[#5E50C7] shadow-sm transition-colors hover:bg-[#cec4ff]"
                        title="Lihat"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      {userRole !== "seksi_wilayah" && (
                        <>
                          <button
                            onClick={() => setIsUpdateModalOpen(true)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F2D79A] bg-[#FDF1CC] text-[#C99A2F] shadow-sm transition-colors hover:bg-[#f9e4a2]"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
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
      <UploadDocModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
      <UpdateDataModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />
      <ExportPreviewModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={rows}
        selectedColumns={selectedFilters}
        columnConfig={columnConfig}
        title="Data Lembaga Konservasi TSL"
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
