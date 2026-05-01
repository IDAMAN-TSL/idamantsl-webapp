"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  Search,
  X,
} from "lucide-react";
import { VerifikasiAcceptModal } from "@/components/verifikasi/VerifikasiAcceptModal";
import { VerifikasiRejectModal } from "@/components/verifikasi/VerifikasiRejectModal";
import { VerifikasiRejectReasonModal } from "@/components/verifikasi/VerifikasiRejectReasonModal";

type VerifikasiStatus = "Menunggu" | "Disetujui" | "Ditolak";

interface VerifikasiRow {
  id: number;
  tanggalPengajuan: string;
  jenisPengajuan: string;
  dataPengajuan: string;
  bidang: string;
  seksiKonservasi: string;
  status: VerifikasiStatus;
  alasanPenolakan?: string;
}

const verifikasiData: VerifikasiRow[] = [
  {
    id: 1,
    tanggalPengajuan: "2025-01-12",
    jenisPengajuan: "Penangkaran",
    dataPengajuan: "Data penangkaran unit Bandung Utara",
    bidang: "Ex-situ",
    seksiKonservasi: "Bidang KSDA",
    status: "Menunggu",
  },
  {
    id: 2,
    tanggalPengajuan: "2025-01-11",
    jenisPengajuan: "Pengedaran DN",
    dataPengajuan: "Data pengedaran dalam negeri Jawa Barat",
    bidang: "Pengedaran",
    seksiKonservasi: "Bidang KSDA",
    status: "Menunggu",
  },
  {
    id: 3,
    tanggalPengajuan: "2025-01-10",
    jenisPengajuan: "Pengedaran LN",
    dataPengajuan: "Data pengedaran luar negeri untuk verifikasi",
    bidang: "Pengedaran",
    seksiKonservasi: "Bidang KSDA",
    status: "Menunggu",
  },
  {
    id: 4,
    tanggalPengajuan: "2025-01-09",
    jenisPengajuan: "Penangkaran",
    dataPengajuan: "Data penangkaran unit Cirebon Selatan",
    bidang: "Ex-situ",
    seksiKonservasi: "Bidang KSDA",
    status: "Ditolak",
    alasanPenolakan: "Nomor telepon unit penangkaran tidak aktif",
  },
  {
    id: 5,
    tanggalPengajuan: "2025-01-08",
    jenisPengajuan: "Lembaga Konservasi",
    dataPengajuan: "Data lembaga konservasi daerah Priangan",
    bidang: "In-situ",
    seksiKonservasi: "Bidang KSDA",
    status: "Disetujui",
  },
];

const columnChips = [
  { key: "tanggalPengajuan", label: "Tanggal Pengajuan" },
  { key: "jenisPengajuan", label: "Jenis Pengajuan" },
  { key: "dataPengajuan", label: "Data Pengajuan" },
  { key: "bidang", label: "Bidang" },
  { key: "seksiKonservasi", label: "Seksi Konservasi" },
] as const;

const getColumnValue = (row: VerifikasiRow, columnKey: string): string => {
  switch (columnKey) {
    case "tanggalPengajuan":
      return formatDate(row.tanggalPengajuan);
    case "jenisPengajuan":
      return row.jenisPengajuan;
    case "dataPengajuan":
      return row.dataPengajuan;
    case "bidang":
      return row.bidang;
    case "seksiKonservasi":
      return row.seksiKonservasi;
    default:
      return "";
  }
};

function formatDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function VerifikasiPage() {
  const [rows, setRows] = useState<VerifikasiRow[]>(verifikasiData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRejectReasonModalOpen, setIsRejectReasonModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columnChips.map((column) => column.key)
  );

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return rows.filter((row) => {
      if (!query) return true;

      return [
        row.tanggalPengajuan,
        formatDate(row.tanggalPengajuan),
        row.jenisPengajuan,
        row.dataPengajuan,
        row.bidang,
        row.seksiKonservasi,
        row.status,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [rows, searchQuery]);

  const totalRows = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const visibleRows = filteredRows.slice(startIndex, startIndex + pageSize);
  const startRow = totalRows === 0 ? 0 : startIndex + 1;
  const endRow = Math.min(startIndex + pageSize, totalRows);

  const visibleRowIds = visibleRows.map((row) => row.id);
  const allVisibleRowsSelected =
    visibleRowIds.length > 0 && visibleRowIds.every((rowId) => selectedRows.includes(rowId));
  const someVisibleRowsSelected =
    visibleRowIds.some((rowId) => selectedRows.includes(rowId)) && !allVisibleRowsSelected;

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  const toggleRowSelection = (rowId: number) => {
    setSelectedRows((current) =>
      current.includes(rowId)
        ? current.filter((selectedId) => selectedId !== rowId)
        : [...current, rowId]
    );
  };

  const toggleVisibleRows = () => {
    setSelectedRows((current) => {
      if (allVisibleRowsSelected) {
        return current.filter((rowId) => !visibleRowIds.includes(rowId));
      }

      const next = new Set(current);
      visibleRowIds.forEach((rowId) => next.add(rowId));
      return Array.from(next);
    });
  };

  const toggleColumnChip = (columnKey: string) => {
    setSelectedColumns((current) =>
      current.includes(columnKey)
        ? current.filter((key) => key !== columnKey)
        : [...current, columnKey]
    );
  };

  const handleAccept = (rowId: number) => {
    setSelectedRowId(rowId);
    setIsAcceptModalOpen(true);
  };

  const handleReject = (rowId: number) => {
    setSelectedRowId(rowId);
    setIsRejectModalOpen(true);
  };

  const handleShowRejectReason = (rowId: number) => {
    const row = rows.find((entry) => entry.id === rowId);

    if (row?.alasanPenolakan) {
      setRejectReason(row.alasanPenolakan);
      setSelectedRowId(rowId);
      setIsRejectReasonModalOpen(true);
    }
  };

  const confirmAccept = () => {
    if (selectedRowId !== null) {
      setRows((current) =>
        current.map((row) =>
          row.id === selectedRowId ? { ...row, status: "Disetujui" } : row
        )
      );
    }

    setIsAcceptModalOpen(false);
    setSelectedRowId(null);
  };

  const confirmReject = (reason: string) => {
    if (selectedRowId !== null) {
      setRows((current) =>
        current.map((row) =>
          row.id === selectedRowId
            ? { ...row, status: "Ditolak", alasanPenolakan: reason }
            : row
        )
      );
    }

    setIsRejectModalOpen(false);
    setSelectedRowId(null);
  };

  const getStatusBadgeStyle = (status: VerifikasiStatus) => {
    switch (status) {
      case "Menunggu":
        return "border-[#F4C16E] bg-[#FFF4DE] text-[#C68213]";
      case "Disetujui":
        return "border-[#97CB88] bg-[#EAF7E5] text-[#4C8C3C]";
      case "Ditolak":
        return "border-[#F0A0A0] bg-[#FFE8E8] text-[#D24B4B]";
      default:
        return "border-gray-200 bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight text-[#111111]">
          Verifikasi
        </h1>
        <p className="mt-1 text-[14px] text-[#8E8E8E]">
          Kelola pengajuan tambah, perbarui, dan hapus data tumbuhan dan satwa liar
        </p>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="relative w-full xl:flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-5 w-5 text-[#A0A0A0]" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            className="block w-full rounded-[10px] border border-[#D9D9D9] bg-white py-3 pl-11 pr-3 text-[14px] text-[#222222] outline-none transition-all placeholder:text-[#B0B0B0] focus:border-[#9EAE2A] focus:ring-2 focus:ring-[#9EAE2A]/15"
            placeholder="Cari jenis pengajuan, jenis data, wilayah ..."
          />
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-[10px] border border-[#D9D9D9] bg-white px-4 py-2.5 text-[14px] font-medium text-[#4D4D4D] transition-colors hover:bg-[#FAFAFA]"
        >
          <Filter className="h-4.5 w-4.5" strokeWidth={2.2} />
          Filter
        </button>
      </div>

      <div className="rounded-2xl border border-[#DCE2CF] bg-white px-4 py-4 shadow-[0_10px_30px_-22px_rgba(34,44,18,0.35)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <p className="text-[14px] font-medium text-[#2D3B14]">
              Pilih kolom yang ditampilkan dan dicetak
            </p>

            <div className="flex flex-wrap gap-2.5">
              {columnChips.map((column) => {
                const isActive = selectedColumns.includes(column.key);

                return (
                  <button
                    key={column.key}
                    type="button"
                    onClick={() => toggleColumnChip(column.key)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                      isActive
                        ? "border-[#98A71E] bg-[#F3F0C9] text-[#5A6620]"
                        : "border-[#D8D8D8] bg-white text-[#7A7A7A] hover:bg-[#FAFAFA]"
                    }`}
                  >
                    {column.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-[12px] text-[#444444]">
              <input
                type="checkbox"
                checked={allVisibleRowsSelected && visibleRows.length > 0}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = someVisibleRowsSelected;
                  }
                }}
                onChange={toggleVisibleRows}
                className="h-3.5 w-3.5 rounded border-[#B9B9B9] text-[#8E9E25] accent-[#8E9E25]"
              />
              <span>Pilih semua kolom</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#8E9E25] px-4 py-2.5 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(142,158,37,0.2)] transition-colors hover:bg-[#7e8d1f]"
            >
              <Download className="h-4.5 w-4.5" strokeWidth={2.3} />
              Unduh
            </button>

            <div className="flex items-center gap-1 rounded-[10px] border border-[#D9D9D9] bg-white px-3 py-2 text-[14px] text-[#4D4D4D] shadow-sm">
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
              <ChevronDown className="h-4 w-4 text-[#808080]" />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#D9E0D0] bg-white shadow-[0_10px_30px_-22px_rgba(34,44,18,0.35)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[#D9D9D9] bg-[#FAFAF7]">
                <th className="w-14 border-r border-[#D9D9D9] px-4 py-3 text-left font-semibold text-[#4C4C4C]">
                  <input
                    type="checkbox"
                    checked={allVisibleRowsSelected && visibleRows.length > 0}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = someVisibleRowsSelected;
                      }
                    }}
                    onChange={toggleVisibleRows}
                    className="h-3.5 w-3.5 rounded border-[#B9B9B9] text-[#8E9E25] accent-[#8E9E25]"
                    aria-label="Pilih semua baris"
                  />
                </th>
                {columnChips.map((column) => (
                  selectedColumns.includes(column.key) && (
                    <th
                      key={column.key}
                      className="border-r border-[#D9D9D9] px-4 py-3 text-left font-semibold text-[#4C4C4C]"
                    >
                      {column.label}
                    </th>
                  )
                ))}
                <th className="px-4 py-3 text-left font-semibold text-[#4C4C4C]">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[#4C4C4C]">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#E3E3E3] transition-colors hover:bg-[#FCFCFA]"
                >
                  <td className="border-r border-[#E3E3E3] px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                      className="h-3.5 w-3.5 rounded border-[#B9B9B9] text-[#8E9E25] accent-[#8E9E25]"
                      aria-label={`Pilih baris ${row.id}`}
                    />
                  </td>
                  {columnChips.map((column) => (
                    selectedColumns.includes(column.key) && (
                      <td
                        key={column.key}
                        className="border-r border-[#E3E3E3] px-4 py-3 text-[#2C2C2C]"
                      >
                        {getColumnValue(row, column.key)}
                      </td>
                    )
                  ))}
                  <td className="border-r border-[#E3E3E3] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium ${getStatusBadgeStyle(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                      {row.status === "Ditolak" && row.alasanPenolakan && (
                        <button
                          type="button"
                          onClick={() => handleShowRejectReason(row.id)}
                          className="inline-flex items-center justify-center rounded-full border border-[#E8B4B4] bg-[#FFF0F0] px-2 py-1 text-[#D24B4B] transition-colors hover:bg-[#FFE3E3]"
                          aria-label="Lihat alasan penolakan"
                        >
                          <Eye className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#8EA0FF] bg-[#EEF1FF] text-[#4E64E8] transition-colors hover:bg-[#E2E7FF]"
                        aria-label="Lihat detail"
                      >
                        <Eye className="h-4 w-4" strokeWidth={2.4} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAccept(row.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#9ED49A] bg-[#EAF7E5] text-[#49A043] transition-colors hover:bg-[#DCF0D6]"
                        aria-label="Terima"
                      >
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(row.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#F0A0A0] bg-[#FFE8E8] text-[#D24B4B] transition-colors hover:bg-[#FFDCDC]"
                        aria-label="Tolak"
                      >
                        <X className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {visibleRows.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-[14px] text-[#7A7A7A]">Tidak ada data</p>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[#E3E3E3] bg-[#FAFAF7] px-4 py-3">
          <span className="text-[12px] text-[#6F6F6F]">
            Menampilkan {totalRows === 0 ? 0 : endRow - startRow + 1} dari {totalRows} data
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((current) => Math.max(current - 1, 1))}
              disabled={safeCurrentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9D9D9] bg-white text-[#555555] transition-colors hover:bg-[#FCFCFC] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>

            <button
              type="button"
              className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#8E9E25] bg-[#8E9E25] px-2 text-[12px] font-medium text-white"
            >
              {safeCurrentPage}
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((current) => Math.min(current + 1, totalPages))}
              disabled={safeCurrentPage === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D9D9D9] bg-white text-[#555555] transition-colors hover:bg-[#FCFCFC] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <VerifikasiAcceptModal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        onConfirm={confirmAccept}
      />

      <VerifikasiRejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={confirmReject}
      />

      <VerifikasiRejectReasonModal
        isOpen={isRejectReasonModalOpen}
        onClose={() => setIsRejectReasonModalOpen(false)}
        reason={rejectReason}
      />
    </div>
  );
}
