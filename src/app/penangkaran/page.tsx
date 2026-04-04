"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Printer,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AddDataModal } from "@/components/penangkaran/AddDataModal";

export default function PenangkaranPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900">
          Penangkaran TSL
        </h1>
        <p className="mt-1 text-[15px] text-gray-700">
          Kelola data penangkaran TSL
        </p>
      </div>

      {/* Actions Row */}
      <div className="flex items-center gap-4 mt-2">
        {/* Search */}
        <div className="relative flex-1 max-w-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-5 w-5 text-gray-500" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border-0 ring-1 ring-inset ring-gray-200 py-3.5 pl-11 pr-3 text-[14px] text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#55733A] bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] outline-none transition-all"
            placeholder="Cari nama penangkaran, nama TSL, atau wilayah ..."
          />
        </div>

        {/* Filter Button */}
        <button className="flex items-center gap-2 rounded-xl bg-[#5B7943] hover:bg-[#446B2F] px-5 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_12px_-4px_rgba(91,121,67,0.5)] transition-colors">
          <Filter className="h-[18px] w-[18px]" strokeWidth={2.5} />
          Filter
        </button>

        {/* Tambah Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#5B7943] hover:bg-[#446B2F] px-5 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_12px_-4px_rgba(91,121,67,0.5)] transition-colors"
        >
          <Plus className="h-[18px] w-[18px]" strokeWidth={2.5} />
          Tambah
        </button>
      </div>

      {/* Table Section */}
      <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-[12px]">
            <thead>
              {/* Row 1 – Main headers */}
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
                  Nama Unit<br />Penangkaran
                </th>
                <th
                  colSpan={2}
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
                  rowSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800 min-w-[110px]"
                >
                  Lokasi<br />Penangkaran
                </th>
                <th
                  colSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800"
                >
                  Koordinat
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-200 px-3 py-2 text-center font-bold text-gray-800 min-w-[90px]"
                >
                  Jenis TSL
                </th>
                <th
                  colSpan={2}
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
              {/* Row 2 – Sub headers */}
              <tr className="bg-gray-50 border-b border-gray-200">
                {/* Surat Izin sub */}
                <th className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700 min-w-[130px]">
                  No. &amp; Tanggal SKP<br />Sertifikat Standar
                </th>
                <th className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700 min-w-[100px]">
                  Akhir masa<br />berlaku izin
                </th>
                {/* Koordinat sub */}
                <th className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700 min-w-[100px]">
                  Lokasi<br />Penangkaran
                </th>
                <th className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700 min-w-[50px]">
                  &nbsp;
                </th>
                {/* Status sub */}
                <th className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700 min-w-[90px]">
                  Perlindungan<br />Nasional
                </th>
                <th className="border border-gray-200 px-2 py-1.5 text-center font-semibold text-gray-700 min-w-[80px]">
                  dalam<br />CITES
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100 bg-white">
              {[1, 2, 3].map((row) => (
                <tr key={row} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-100 px-2 py-3 text-center text-gray-500 h-[52px]">{row}</td>
                  {/* Nama Unit Penangkaran */}
                  <td className="border border-gray-100 px-2 py-3 text-gray-500"></td>
                  {/* No & Tgl SKP */}
                  <td className="border border-gray-100 px-2 py-3 text-gray-500"></td>
                  {/* Akhir masa berlaku */}
                  <td className="border border-gray-100 px-2 py-3 text-gray-500"></td>
                  {/* Penerbit */}
                  <td className="border border-gray-100 px-2 py-3 text-gray-500"></td>
                  {/* Nama Direktur */}
                  <td className="border border-gray-100 px-2 py-3 text-gray-500"></td>
                  {/* No Telepon */}
                  <td className="border border-gray-100 px-2 py-3 text-gray-500"></td>
                  {/* Bidang KSDA Wilayah */}
                  <td className="border border-gray-100 px-2 py-3 text-gray-500"></td>
                  {/* Seksi Konservasi Wilayah */}
                  <td className="border border-gray-100 px-2 py-3 text-gray-500"></td>
                  {/* Lokasi Kantor */}
                  <td className="border border-gray-100 px-2 py-3 text-gray-500"></td>
                  {/* Lokasi Penangkaran */}
                  <td className="border border-gray-100 px-2 py-3 text-gray-500"></td>
                  {/* Koordinat Lokasi Penangkaran */}
                  <td className="border border-gray-100 px-2 py-3 text-gray-500"></td>
                  {/* Koordinat (kosong) */}
                  <td className="border border-gray-100 px-2 py-3 text-gray-500"></td>
                  {/* Jenis TSL */}
                  <td className="border border-gray-100 px-2 py-3 text-gray-500"></td>
                  {/* Status Perlindungan Nasional */}
                  <td className="border border-gray-100 px-2 py-3 text-gray-500"></td>
                  {/* Status dalam CITES */}
                  <td className="border border-gray-100 px-2 py-3 text-center">
                    
                  </td>
                  <td>
                    <div className="flex justify-center items-center">
                      <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5B7943] text-white hover:bg-[#446B2F] transition-colors shadow-sm cursor-pointer">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination & Cetak */}
      <div className="mt-8 pb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Info + Pagination */}
        <div className="flex items-center gap-4 justify-between sm:justify-end sm:order-2">
          <p className="text-[13px] text-gray-400 font-medium">
            Menampilkan 3 dari 3 data
          </p>

          {/* Pagination */}
          <div className="flex items-center gap-1.5">
            <button
              className="flex h-8 w-8 items-center justify-center rounded bg-gray-50 text-gray-400 hover:bg-gray-100 disabled:opacity-50 transition-colors shadow-sm"
              disabled
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded bg-[#5B7943] text-[13px] font-semibold text-white hover:bg-[#446B2F] shadow-sm transition-colors">
              1
            </button>
            <button
              className="flex h-8 w-8 items-center justify-center rounded bg-gray-50 text-gray-400 hover:bg-gray-100 disabled:opacity-50 transition-colors shadow-sm"
              disabled
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Cetak Button */}
        <button className="sm:order-1 self-start flex items-center gap-2 rounded-xl bg-[#5B7943] hover:bg-[#446B2F] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_4px_12px_-4px_rgba(91,121,67,0.5)] transition-colors">
          <Printer className="h-[18px] w-[18px]" strokeWidth={2.5} />
          Cetak
        </button>
      </div>

      {/* Render Modal */}
      <AddDataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
