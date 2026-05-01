"use client";

import { useState } from "react";
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
import { AddDataModal } from "../../components/pengedaran-luar/AddDataModal";
import { UpdateDataModal } from "../../components/pengedaran-luar/UpdateDataModal";
import { UploadDocModal } from "../../components/ui/UploadDocModal";

const filterTags = [
  "Unit Pengedaran",
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

export default function PengedaranLuarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    "Unit Pengedaran",
    "Seksi",
    "Masa Berlaku SK",
    "Jenis TSL",
  ]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const totalRows = rows.length;
  const startRow = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);
  const visibleRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleFilter = (tag: string) => {
    setSelectedFilters((previous) =>
      previous.includes(tag)
        ? previous.filter((value) => value !== tag)
        : [...previous, tag]
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
          Pengedaran TSL Luar Negeri
        </h1>
        <p className="mt-1 text-[15px] text-gray-700">
          Kelola informasi data pengedaran tumbuhan dan satwa liar luar negeri
        </p>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative w-full xl:flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-5 w-5 text-gray-500" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border-0 ring-1 ring-inset ring-gray-200 py-3 pl-11 pr-3 text-[14px] text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#5B7943] bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] outline-none transition-all"
            placeholder="Cari unit pengedaran, jenis TSL, wilayah ..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap xl:justify-end">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-[14px] font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <Filter className="h-4.5 w-4.5" strokeWidth={2.2} />
            Filter
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#8E9E25] px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#7e8d20]"
          >
            <Plus className="h-4.5 w-4.5" strokeWidth={2.5} />
            Tambah
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#8E9E25] px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#7e8d20]"
          >
            <Upload className="h-4.5 w-4.5" strokeWidth={2.5} />
            Unggah
          </button>
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
              <X className="h-4.5 w-4.5" />
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

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[14px] font-medium text-gray-700">
              Pilih kolom yang ditampilkan dan dicetak
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 accent-[#8E9E25] focus:ring-[#8E9E25]"
              />
              <span>Pilih semua kolom</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#8E9E25] px-4 py-2 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-[#7e8d20]">
              <Download className="h-4.5 w-4.5" strokeWidth={2.5} />
              Unduh
            </button>
            <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm">
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setCurrentPage(1);
                }}
                className="appearance-none bg-transparent outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {filterTags.map((tag) => {
            const isActive = selectedFilters.includes(tag);

            return (
              <button
                key={tag}
                onClick={() => toggleFilter(tag)}
                className={`rounded-full border px-3 py-1 text-[12px] transition-colors ${
                  isActive
                    ? "border-[#8E9E25] bg-[#E9EDC8] text-gray-800"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tag}
              </button>
            );
          })}
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
                  No.
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800 min-w-[130px]"
                >
                  Nama Unit<br />Pengedaran
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
                  Lokasi Pengedaran
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800 min-w-[90px]"
                >
                  Jenis TSL
                </th>
                <th
                  colSpan={3}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800"
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
                <th className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700 min-w-[90px]">
                  Perlindungan<br />Nasional
                </th>
                <th className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700 min-w-[80px]">
                  dalam<br />CITES
                </th>
                <th className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700 min-w-[80px]">
                  IUCN
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {visibleRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-100 px-2 py-3 text-center text-gray-500 h-[52px]">
                    {row.id}
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
                  <td className="border border-gray-100 px-2 py-3 text-center" />
                  <td className="border border-gray-100 px-2 py-3 text-center" />
                  <td className="border border-gray-100 px-2 py-3 text-center" />
                  <td className="border border-gray-100 px-2 py-3 text-center" />
                  <td className="border border-gray-100 px-2 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#9B8CF2] bg-[#DCD6FF] text-[#5E50C7] shadow-sm transition-colors hover:bg-[#cec4ff]"
                        title="Lihat"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
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
                    </div>
                  </td>
                </tr>
              ))}
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
