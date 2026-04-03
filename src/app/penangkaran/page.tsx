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
    <div className="flex flex-col gap-6 w-full max-w-6xl">
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="divide-x divide-gray-200">
                <th
                  scope="col"
                  className="px-4 py-4 text-center text-[13px] font-bold text-gray-900 w-16 whitespace-nowrap"
                >
                  No
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 text-center text-[13px] font-bold text-gray-900 whitespace-nowrap"
                >
                  Penangkaran
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 text-center text-[13px] font-bold text-gray-900 whitespace-nowrap"
                >
                  Bidang Wilayah
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 text-center text-[13px] font-bold text-gray-900 whitespace-nowrap"
                >
                  Seksi Wilayah
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 text-center text-[13px] font-bold text-gray-900 whitespace-nowrap"
                >
                  Nama TSL
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 text-center text-[13px] font-bold text-gray-900 whitespace-nowrap"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 text-center text-[13px] font-bold text-gray-900 whitespace-nowrap w-24"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {/* Row 1 */}
              <tr className="divide-x divide-gray-200">
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500 h-[52px]"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500">
                  <div className="flex justify-center h-full items-center min-h-[44px]">
                    <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5B7943] text-white hover:bg-[#446B2F] transition-colors shadow-sm cursor-pointer">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="divide-x divide-gray-200">
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500 h-[52px]"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500">
                  <div className="flex justify-center h-full items-center min-h-[44px]">
                    <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5B7943] text-white hover:bg-[#446B2F] transition-colors shadow-sm cursor-pointer">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="divide-x divide-gray-200">
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500 h-[52px]"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500"></td>
                <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-500">
                  <div className="flex justify-center h-full items-center min-h-[44px]">
                    <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5B7943] text-white hover:bg-[#446B2F] transition-colors shadow-sm cursor-pointer">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination & Cetak */}
      <div className="mt-8 flex items-center justify-between pb-8">
        {/* Cetak Button */}
        <button className="flex items-center gap-2 rounded-xl bg-[#5B7943] hover:bg-[#446B2F] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_4px_12px_-4px_rgba(91,121,67,0.5)] transition-colors">
          <Printer className="h-[18px] w-[18px]" strokeWidth={2.5} />
          Cetak
        </button>

        <div className="flex items-center gap-6">
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
      </div>

      {/* Render Modal */}
      <AddDataModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
