"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Filter,
  Search,
  X,
} from "lucide-react";
import { VerifikasiAcceptModal } from "@/components/verifikasi/VerifikasiAcceptModal";
import { VerifikasiRejectModal } from "@/components/verifikasi/VerifikasiRejectModal";
import { VerifikasiRejectReasonModal } from "@/components/verifikasi/VerifikasiRejectReasonModal";
import { VerifikasiDetailModal } from "@/components/verifikasi/VerifikasiDetailModal";
import { ViewDataModal } from "@/components/referensi-tsl/ViewDataModal";
import { DetailDataModal as PenangkaranDetailModal } from "@/components/penangkaran/DetailDataModal";

type VerifikasiStatus = "Menunggu" | "Disetujui" | "Ditolak";

interface VerifikasiRow {
  id: string;
  targetId: number;
  tabelTarget: string;
  tanggalPengajuan: string;
  jenisPengajuan: string;
  dataPengajuan: string;
  peran: string;
  status: VerifikasiStatus;
  alasanPenolakan?: string;
  rawData?: any;
}

const formatDisplayDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatJenisPengajuan = (jenis: string | undefined) => {
  if (jenis === "tambah") return "Tambah";
  if (jenis === "perbarui") return "Perbarui";
  if (jenis === "hapus") return "Hapus";
  return jenis || "-";
};

const formatDataPengajuan = (tabelTarget: string) => {
  if (tabelTarget === "referensi_tsl") return "Referensi TSL";
  if (tabelTarget === "penangkaran") return "Penangkar TSL";
  return tabelTarget;
};

const verifikasiData: VerifikasiRow[] = [];

const columnChips = [
  {
    key: "tanggalPengajuan",
    label: "Tgl Pengajuan",
    tableHeader: "Tanggal Pengajuan",
  },
  {
    key: "jenisPengajuan",
    label: "Jenis Pengajuan",
    tableHeader: "Jenis Pengajuan",
  },
  {
    key: "dataPengajuan",
    label: "Data Pengajuan",
    tableHeader: "Data Pengajuan",
  },
  { key: "peran", label: "Peran", tableHeader: "Peran" },
] as const;

export default function VerifikasiPage() {
  const [rows, setRows] = useState<VerifikasiRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [selectedDetailData, setSelectedDetailData] =
    useState<VerifikasiRow | null>(null);
  const [fullDetailData, setFullDetailData] = useState<any>(null);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRejectReasonModalOpen, setIsRejectReasonModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "tanggalPengajuan",
    "jenisPengajuan",
    "dataPengajuan",
    "peran",
  ]);
  const [selectedStatuses, setSelectedStatuses] = useState<VerifikasiStatus[]>([
    "Menunggu",
    "Disetujui",
    "Ditolak",
  ]);
  const [userRole, setUserRole] = useState<string>("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  const getToken = () =>
    globalThis.window === undefined ? null : localStorage.getItem("token");

  const fetchVerifikasi = async () => {
    try {
      setIsLoading(true);

      // ── Baca info user dari localStorage ────────────────────────────────
      const savedUser =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      let currentUserId: number | null = null;
      let currentUserRole = "";
      let currentUserPeran = "-";

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          currentUserId =
            typeof parsedUser.id === "number" ? parsedUser.id : null;
          currentUserRole = parsedUser.role || "";

          if (parsedUser.role === "admin_pusat") {
            currentUserPeran = "Admin Pusat";
          } else if (parsedUser.wilayah?.namaWilayah) {
            const tipe =
              parsedUser.role === "bidang_wilayah" ? "Bidang" : "Seksi";
            const nomor = parsedUser.wilayah?.nomorWilayah || "";
            const nama = parsedUser.wilayah?.namaWilayah;
            currentUserPeran = `${tipe} ${nomor} ${nama}`
              .replace(/\s+/g, " ")
              .trim();
          } else {
            currentUserPeran =
              parsedUser.role === "bidang_wilayah"
                ? "Bidang"
                : parsedUser.role === "seksi_wilayah"
                  ? "Seksi"
                  : parsedUser.role;
          }
        } catch (_) {}
      }

      const isNonAdmin =
        currentUserRole === "bidang_wilayah" ||
        currentUserRole === "seksi_wilayah";

      if (!isNonAdmin) {
        // ==================================================================
        // ADMIN_PUSAT: Ambil dari /api/verifikasi/* (data lengkap semua user)
        // ==================================================================
        const [resPending, resApproved, resUsers, resLog] = await Promise.all([
          fetch(`${API_URL}/api/verifikasi/pending`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          fetch(`${API_URL}/api/verifikasi/approved`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          fetch(`${API_URL}/api/users`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          fetch(`${API_URL}/api/verifikasi/log`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
        ]);

        const resultPending = await resPending.json();
        const resultApproved = await resApproved.json();
        const resultUsers = await resUsers.json();
        const resultLog = await resLog.json();

        const usersList =
          resultUsers?.success === true
            ? resultUsers.data
            : resultUsers?.data || [];
        const userMap = new Map<number, string>();

        usersList.forEach((u: any) => {
          let peranLengkap = "-";
          if (u.role === "admin_pusat") {
            peranLengkap = "Admin Pusat";
          } else if (u.wilayah?.namaWilayah || u.namaWilayah) {
            const tipe = u.role === "bidang_wilayah" ? "Bidang" : "Seksi";
            const nomor = u.wilayah?.nomorWilayah || "";
            const nama = u.wilayah?.namaWilayah || u.namaWilayah;
            peranLengkap = `${tipe} ${nomor} ${nama}`
              .replace(/\s+/g, " ")
              .trim();
          } else {
            peranLengkap =
              u.role === "bidang_wilayah"
                ? "Bidang"
                : u.role === "seksi_wilayah"
                  ? "Seksi"
                  : u.role;
          }
          userMap.set(u.id, peranLengkap);
        });

        const newRows: VerifikasiRow[] = [];
        const processedIds = new Set<string>();

        if (resultPending.data) {
          const addItems = (items: any[]) => {
            items.forEach((item) => {
              const rowId = `${item.tabelTarget}-${item.id}`;
              processedIds.add(rowId);

              let jenis = formatJenisPengajuan(item.jenisPengajuan);
              if (
                item.tabelTarget === "referensi_tsl" &&
                item.pendingChanges === null
              ) {
                jenis = "Tambah";
              }

              newRows.push({
                id: rowId,
                targetId: item.id,
                tabelTarget: item.tabelTarget,
                tanggalPengajuan: formatDisplayDate(
                  item.updatedAt || item.createdAt,
                ),
                jenisPengajuan: jenis,
                dataPengajuan: formatDataPengajuan(item.tabelTarget),
                peran: userMap.get(item.createdBy) || "-",
                status: "Menunggu",
                rawData: item,
              });
            });
          };
          addItems(resultPending.data.referensi_tsl || []);
          addItems(resultPending.data.penangkaran || []);
        }

        if (resultApproved.data) {
          const addItems = (items: any[]) => {
            items.forEach((item) => {
              const rowId = `${item.tabelTarget}-${item.id}`;
              processedIds.add(rowId);
              newRows.push({
                id: rowId,
                targetId: item.id,
                tabelTarget: item.tabelTarget,
                tanggalPengajuan: formatDisplayDate(
                  item.updatedAt || item.createdAt,
                ),
                jenisPengajuan: "-",
                dataPengajuan: formatDataPengajuan(item.tabelTarget),
                peran: userMap.get(item.createdBy) || "-",
                status: "Disetujui",
                rawData: item,
              });
            });
          };
          addItems(resultApproved.data.referensi_tsl || []);
          addItems(resultApproved.data.penangkaran || []);
        }

        if (resultLog?.data) {
          const sortedLogs = [...resultLog.data].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

          sortedLogs.forEach((item: any) => {
            if (item.status === "ditolak") {
              const rowId = `${item.tabelTarget}-${item.targetId}`;
              if (!processedIds.has(rowId)) {
                processedIds.add(rowId);
                newRows.push({
                  id: rowId,
                  targetId: item.targetId,
                  tabelTarget: item.tabelTarget,
                  tanggalPengajuan: formatDisplayDate(item.createdAt),
                  jenisPengajuan: formatJenisPengajuan(item.jenisPengajuan),
                  dataPengajuan: formatDataPengajuan(item.tabelTarget),
                  peran: userMap.get(item.diajukanOleh) || "-",
                  status: "Ditolak",
                  alasanPenolakan: item.catatan,
                  rawData: item,
                });
              }
            }
          });
        }

        newRows.sort((a, b) => {
          if (a.status === "Menunggu" && b.status !== "Menunggu") return -1;
          if (a.status !== "Menunggu" && b.status === "Menunggu") return 1;
          return (
            new Date(b.tanggalPengajuan).getTime() -
            new Date(a.tanggalPengajuan).getTime()
          );
        });

        setRows(newRows);
      } else {
        // ==================================================================
        // NON-ADMIN: Ambil dari modul sumber, filter hanya data milik user ini
        // Catatan: /api/verifikasi/* terkunci untuk admin_pusat, sehingga
        // non-admin mengambil data dari endpoint yang aksesnya lebih terbuka.
        // ==================================================================
        if (currentUserId === null) {
          setRows([]);
          return;
        }

        const [resReferensi, resPenangkaran] = await Promise.all([
          fetch(`${API_URL}/api/referensi-tsl`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          fetch(`${API_URL}/api/penangkaran`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
        ]);

        const resultReferensi = await resReferensi.json();
        const resultPenangkaran = await resPenangkaran.json();

        const newRows: VerifikasiRow[] = [];

        // ── Referensi TSL ────────────────────────────────────────────────
        // pendingChanges kini disertakan di response getAllReferensi dan
        // TIDAK dihapus saat penolakan, sehingga deteksi jenis akurat:
        //   pendingChanges._action === "delete"  → "Hapus"
        //   pendingChanges berisi field perubahan → "Perbarui"
        //   pendingChanges null + bukan disetujui → "Tambah" (baru / tambah ditolak)
        //   disetujui + pendingChanges null       → "-" (sudah dibersihkan saat approve)
        const referensiList: any[] = resultReferensi?.data || [];
        referensiList
          .filter((item: any) => item.createdBy === currentUserId)
          .forEach((item: any) => {
            const pc = item.pendingChanges as
              | Record<string, unknown>
              | null
              | undefined;
            let jenisPengajuan = "-";
            if (pc?._action === "delete") {
              jenisPengajuan = "Hapus";
            } else if (pc && Object.keys(pc).length > 0) {
              jenisPengajuan = "Perbarui";
            } else if (item.statusVerifikasi !== "disetujui") {
              // pendingChanges null + bukan disetujui = record baru
              // Mencakup: pending tambah dan ditolak tambah
              jenisPengajuan = "Tambah";
            }

            const status: VerifikasiStatus =
              item.statusVerifikasi === "pending"
                ? "Menunggu"
                : item.statusVerifikasi === "disetujui"
                  ? "Disetujui"
                  : "Ditolak";

            newRows.push({
              id: `referensi_tsl-${item.id}`,
              targetId: item.id,
              tabelTarget: "referensi_tsl",
              tanggalPengajuan: formatDisplayDate(
                item.updatedAt || item.createdAt,
              ),
              jenisPengajuan,
              dataPengajuan: formatDataPengajuan("referensi_tsl"),
              peran: currentUserPeran,
              status,
              alasanPenolakan:
                status === "Ditolak" ? item.catatanVerifikasi || "" : undefined,
              rawData: item,
            });
          });

        // ── Penangkaran ──────────────────────────────────────────────────
        // createdBy di response penangkaran dikembalikan sebagai objek
        // { id, nama, role } karena Drizzle relational query memperluas FK-nya.
        // updatedBy tetap berupa integer:
        //   null     → record baru → "Tambah"  (berlaku untuk SEMUA status)
        //   ada isi  → pernah diupdate → "Perbarui"  (berlaku untuk SEMUA status)
        // Penangkaran tidak memiliki mekanisme "Hapus" pending.
        const penangkaranList: any[] = resultPenangkaran?.data || [];
        penangkaranList
          .filter((item: any) => {
            const createdById =
              typeof item.createdBy === "object"
                ? item.createdBy?.id
                : item.createdBy;
            return createdById === currentUserId;
          })
          .forEach((item: any) => {
            // updatedBy konsisten di semua status (tidak dihapus saat approve/tolak)
            const jenisPengajuan =
              item.updatedBy === null ? "Tambah" : "Perbarui";

            const status: VerifikasiStatus =
              item.statusVerifikasi === "pending"
                ? "Menunggu"
                : item.statusVerifikasi === "disetujui"
                  ? "Disetujui"
                  : "Ditolak";

            newRows.push({
              id: `penangkaran-${item.id}`,
              targetId: item.id,
              tabelTarget: "penangkaran",
              tanggalPengajuan: formatDisplayDate(
                item.updatedAt || item.createdAt,
              ),
              jenisPengajuan,
              dataPengajuan: formatDataPengajuan("penangkaran"),
              peran: currentUserPeran,
              status,
              alasanPenolakan:
                status === "Ditolak" ? item.catatanVerifikasi || "" : undefined,
              rawData: item,
            });
          });

        // Sort: Menunggu dulu, lalu berdasarkan tanggal terbaru
        newRows.sort((a, b) => {
          if (a.status === "Menunggu" && b.status !== "Menunggu") return -1;
          if (a.status !== "Menunggu" && b.status === "Menunggu") return 1;
          return (
            new Date(b.tanggalPengajuan).getTime() -
            new Date(a.tanggalPengajuan).getTime()
          );
        });

        setRows(newRows);
      }
    } catch (error) {
      console.error("Gagal memuat data verifikasi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetail = async (row: VerifikasiRow) => {
    setIsDetailLoading(true);
    try {
      let endpoint = "";
      if (row.tabelTarget === "referensi_tsl") {
        endpoint = `${API_URL}/api/referensi-tsl/${row.targetId}`;
      } else if (row.tabelTarget === "penangkaran") {
        endpoint = `${API_URL}/api/penangkaran/${row.targetId}`;
      }

      if (endpoint) {
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const result = await res.json();

        if (result.success !== false && result.data) {
          // Merge with pending changes if any so we can see the proposed changes
          const mergedData = {
            ...result.data,
            ...(row.rawData?.pendingChanges || {}),
          };
          setFullDetailData(mergedData);
        } else {
          setFullDetailData(row.rawData);
        }
      } else {
        setFullDetailData(row.rawData);
      }
    } catch (error) {
      console.error("Gagal memuat detail data:", error);
      setFullDetailData(row.rawData);
    } finally {
      setSelectedDetailData(row);
      setIsDetailLoading(false);
      setIsDetailModalOpen(true);
    }
  };

  useEffect(() => {
    fetchVerifikasi();
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUserRole(parsed.role || "");
      } catch (e) {}
    }
  }, []);

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return rows.filter((row) => {
      const matchSearch =
        !query ||
        [
          row.tanggalPengajuan,
          row.jenisPengajuan,
          row.dataPengajuan,
          row.peran,
          row.status,
        ].some((value) => value.toLowerCase().includes(query));

      const matchStatus = selectedStatuses.includes(row.status);

      return matchSearch && matchStatus;
    });
  }, [rows, searchQuery, selectedStatuses]);

  const totalRows = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const visibleRows = filteredRows.slice(startIndex, startIndex + pageSize);
  const startRow = totalRows === 0 ? 0 : startIndex + 1;
  const endRow = Math.min(startIndex + pageSize, totalRows);

  const visibleRowIds = visibleRows.map((row) => row.id);
  const allVisibleRowsSelected =
    visibleRowIds.length > 0 &&
    visibleRowIds.every((rowId) => selectedRows.includes(rowId));
  const someVisibleRowsSelected =
    visibleRowIds.some((rowId) => selectedRows.includes(rowId)) &&
    !allVisibleRowsSelected;

  const toggleRowSelection = (rowId: string) => {
    setSelectedRows((current) =>
      current.includes(rowId)
        ? current.filter((selectedId) => selectedId !== rowId)
        : [...current, rowId],
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
        : [...current, columnKey],
    );
  };

  const toggleAllColumns = () => {
    if (selectedColumns.length === columnChips.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(columnChips.map((c) => c.key));
    }
  };

  const toggleStatusChip = (status: VerifikasiStatus) => {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((s) => s !== status)
        : [...current, status],
    );
  };

  const getStatusStyle = (status: VerifikasiStatus) => {
    switch (status) {
      case "Menunggu":
        return "border-[#F4C16E] bg-[#FFF4DE] text-[#C68213]";
      case "Disetujui":
        return "border-[#9ED49A] bg-[#EAF7E5] text-[#49A043]";
      case "Ditolak":
        return "border-[#F0A0A0] bg-[#FFE8E8] text-[#D24B4B]";
      default:
        return "border-gray-200 bg-gray-100 text-gray-700";
    }
  };

  const getJenisPengajuanStyle = (type: string) => {
    if (type === "Hapus") return "border-[#F0A0A0] bg-[#FFE8E8] text-[#D24B4B]";
    if (type === "Perbarui")
      return "border-[#F4C16E] bg-[#FFF4DE] text-[#C68213]";
    if (type === "Tambah")
      return "border-[#9ED49A] bg-[#EAF7E5] text-[#49A043]";
    return "border-gray-200 bg-gray-100 text-gray-700";
  };

  const getDataPengajuanStyle = (type: string) => {
    if (type.includes("Referensi TSL"))
      return "border-[#9ED49A] bg-[#EAF7E5] text-[#49A043]";
    if (type.includes("Lembaga Konservasi"))
      return "border-[#F4C16E] bg-[#FFF4DE] text-[#C68213]";
    if (type.includes("Pengedar LN"))
      return "border-[#8CA4F2] bg-[#E5EDFF] text-[#3B66D4]";
    if (type.includes("Pengedar DN"))
      return "border-[#F0A0A0] bg-[#FFE8E8] text-[#D24B4B]";
    if (type.includes("Penangkar TSL"))
      return "border-[#C1A8F2] bg-[#F2E8FF] text-[#865CD6]";
    return "border-gray-200 bg-gray-100 text-gray-700";
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-[#171717]">
          Verifikasi
        </h1>
        <p className="mt-1 text-[14px] text-[#8A8A8A]">
          Kelola pengajuan tambah, perbarui, dan hapus data tumbuhan dan satwa
          liar
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
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            className="block w-full rounded-lg border border-[#D7D7D7] bg-white py-2.5 pl-11 pr-3 text-[14px] text-[#252525] outline-none placeholder:text-[#B0B0B0] focus:border-[#9EAE2A] focus:ring-2 focus:ring-[#9EAE2A]/15"
            placeholder="Cari nama pengguna, email, wilayah ..."
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-[#D7D7D7] bg-white px-3.5 py-2.5 text-[13px] font-medium text-[#444444] transition-colors hover:bg-[#FAFAFA]"
        >
          <Filter className="h-4 w-4" strokeWidth={2.1} />
          Filter
        </button>
      </div>

      <div className="px-4 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* Left: label + pills + checkbox */}
          <div className="space-y-2.5">
            <p className="text-[14px] font-medium text-[#2F2F2F]">
              Pilih kolom yang ditampilkan dan dicetak
            </p>

            <div className="flex flex-wrap gap-2">
              {columnChips.map((column) => {
                const isActive = selectedColumns.includes(column.key);
                return (
                  <button
                    key={column.key}
                    type="button"
                    onClick={() => toggleColumnChip(column.key)}
                    className={`rounded-full border px-3 py-1 text-[11px] transition-colors ${
                      isActive
                        ? "border-[#A5C05E] bg-[#F3F7E9] text-[#4C4C4C] font-medium"
                        : "border-[#D8D8D8] bg-white text-[#7A7A7A] hover:bg-[#FAFAFA]"
                    }`}
                  >
                    {column.label}
                  </button>
                );
              })}
            </div>

            <label className="inline-flex items-center gap-2 text-[12px] text-[#484848]">
              <input
                type="checkbox"
                checked={selectedColumns.length === columnChips.length}
                ref={(input) => {
                  if (input) {
                    input.indeterminate =
                      selectedColumns.length > 0 &&
                      selectedColumns.length < columnChips.length;
                  }
                }}
                onChange={toggleAllColumns}
                className="h-3.5 w-3.5 rounded border-[#B9B9B9] accent-[#8E9E25]"
              />
              <span>Pilih semua atribut</span>
            </label>
          </div>

          <div className="space-y-2.5 border-l border-[#E5E5E5] pl-6 hidden xl:block">
            <p className="text-[14px] font-medium text-[#2F2F2F]">
              Pilih status yang ditampilkan
            </p>
            <div className="flex flex-wrap gap-2">
              {(["Menunggu", "Disetujui", "Ditolak"] as VerifikasiStatus[]).map(
                (status) => {
                  const isActive = selectedStatuses.includes(status);
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => toggleStatusChip(status)}
                      className={`rounded-full border px-3 py-1 text-[11px] transition-colors ${
                        isActive
                          ? "border-[#A5C05E] bg-[#F3F7E9] text-[#4C4C4C] font-medium"
                          : "border-[#D8D8D8] bg-white text-[#7A7A7A] hover:bg-[#FAFAFA]"
                      }`}
                    >
                      {status}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          <div className="space-y-2.5 xl:hidden pt-4 border-t border-[#E5E5E5]">
            <p className="text-[14px] font-medium text-[#2F2F2F]">
              Pilih status yang ditampilkan
            </p>
            <div className="flex flex-wrap gap-2">
              {(["Menunggu", "Disetujui", "Ditolak"] as VerifikasiStatus[]).map(
                (status) => {
                  const isActive = selectedStatuses.includes(status);
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => toggleStatusChip(status)}
                      className={`rounded-full border px-3 py-1 text-[11px] transition-colors ${
                        isActive
                          ? "border-[#A5C05E] bg-[#F3F7E9] text-[#4C4C4C] font-medium"
                          : "border-[#D8D8D8] bg-white text-[#7A7A7A] hover:bg-[#FAFAFA]"
                      }`}
                    >
                      {status}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* Right: Unduh + pageSize — vertically centered to whole card */}
          <div className="flex shrink-0 items-center gap-2">
            
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

      <div className="overflow-hidden rounded-xl border border-[#DCDCDC] bg-white shadow-[0_8px_24px_-22px_rgba(0,0,0,0.45)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[#DCDCDC] bg-[#FAFAFA]">
                <th className="border-r border-[#DCDCDC] w-12 px-4 py-3 text-center align-middle font-semibold text-[#4F4F4F]">
                  <input
                    type="checkbox"
                    checked={allVisibleRowsSelected && visibleRows.length > 0}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = someVisibleRowsSelected;
                      }
                    }}
                    onChange={toggleVisibleRows}
                    className="h-3.5 w-3.5 rounded border-[#B9B9B9] accent-[#8E9E25]"
                    aria-label="Pilih semua baris"
                  />
                </th>
                {columnChips.map(
                  (column) =>
                    selectedColumns.includes(column.key) && (
                      <th
                        key={column.key}
                        className="border-r border-[#DCDCDC] px-4 py-3 text-center align-middle font-semibold text-[#4F4F4F]"
                      >
                        {column.tableHeader}
                      </th>
                    ),
                )}
                <th className="border-r border-[#DCDCDC] px-4 py-3 text-center align-middle font-semibold text-[#4F4F4F]">
                  Status
                </th>
                <th className="px-4 py-3 text-center align-middle font-semibold text-[#4F4F4F]">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-16 text-center text-[13px] text-gray-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-16 text-center text-[13px] text-gray-400"
                  >
                    Tidak ada data verifikasi
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#E5E5E5] transition-colors hover:bg-[#FCFCFC]"
                  >
                    <td className="border-r border-[#E5E5E5] px-4 py-3 text-center align-middle h-[52px]">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => toggleRowSelection(row.id)}
                        className="h-3.5 w-3.5 rounded border-[#B9B9B9] accent-[#8E9E25]"
                      />
                    </td>
                    {selectedColumns.includes("tanggalPengajuan") && (
                      <td className="border-r border-[#E5E5E5] px-4 py-3 text-center align-middle text-[#2C2C2C]">
                        {row.tanggalPengajuan}
                      </td>
                    )}
                    {selectedColumns.includes("jenisPengajuan") && (
                      <td className="border-r border-[#E5E5E5] px-4 py-3 text-center align-middle">
                        {row.jenisPengajuan !== "-" ? (
                          <span
                            className={`inline-flex min-w-20 items-center justify-center rounded-full border px-3 py-1 text-[11px] font-medium ${getJenisPengajuanStyle(
                              row.jenisPengajuan,
                            )}`}
                          >
                            {row.jenisPengajuan}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    )}
                    {selectedColumns.includes("dataPengajuan") && (
                      <td className="border-r border-[#E5E5E5] px-4 py-3 text-center align-middle">
                        <span
                          className={`inline-flex min-w-32 items-center justify-center rounded-full border px-3 py-1 text-[11px] font-medium ${getDataPengajuanStyle(
                            row.dataPengajuan,
                          )}`}
                        >
                          {row.dataPengajuan}
                        </span>
                      </td>
                    )}
                    {selectedColumns.includes("peran") && (
                      <td className="border-r border-[#E5E5E5] px-4 py-3 text-center align-middle text-[#2C2C2C]">
                        {row.peran}
                      </td>
                    )}
                    <td className="border-r border-[#E5E5E5] px-4 py-3 text-center align-middle">
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            if (row.status === "Ditolak") {
                              setRejectReason(row.alasanPenolakan || "");
                              setSelectedRowId(row.id);
                              setIsRejectReasonModalOpen(true);
                            }
                          }}
                          className={`inline-flex min-w-24 items-center justify-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium ${getStatusStyle(
                            row.status,
                          )}`}
                        >
                          {row.status}
                          {row.status === "Ditolak" && (
                            <ExternalLink
                              className="h-3 w-3"
                              strokeWidth={2.5}
                            />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center align-middle">
                      <div className="flex justify-center items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(row)}
                          disabled={
                            isDetailLoading && selectedDetailData?.id === row.id
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#9B8CF2] bg-[#DCD6FF] text-[#5E50C7] transition-colors hover:bg-[#cec4ff] disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Lihat detail"
                        >
                          <ExternalLink className="h-4 w-4" strokeWidth={2.3} />
                        </button>
                        {userRole === "admin_pusat" &&
                          row.status === "Menunggu" && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRowId(row.id);
                                  setIsAcceptModalOpen(true);
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#9ED49A] bg-[#EAF7E5] text-[#49A043] transition-colors hover:bg-[#DCF0D6]"
                                aria-label="Terima"
                              >
                                <Check className="h-4 w-4" strokeWidth={2.4} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRowId(row.id);
                                  setIsRejectModalOpen(true);
                                }}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F2A6A6] bg-[#FFEEEE] text-[#D24B4B] transition-colors hover:bg-[#FFE1E1]"
                                aria-label="Tolak"
                              >
                                <X className="h-4 w-4" strokeWidth={2.4} />
                              </button>
                            </>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#E5E5E5] bg-white px-4 py-3">
          <span className="text-[12px] text-[#707070]">
            Menampilkan {totalRows === 0 ? 0 : endRow - startRow + 1} dari{" "}
            {totalRows} data
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(safeCurrentPage - 1, 1))}
              disabled={safeCurrentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D7D7D7] bg-white text-[#555555] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-[#D7D7D7] bg-white px-2 text-[12px] text-[#444444]">
              {safeCurrentPage}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentPage(Math.min(safeCurrentPage + 1, totalPages))
              }
              disabled={safeCurrentPage === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D7D7D7] bg-white text-[#555555] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedDetailData?.tabelTarget === "referensi_tsl" && (
        <ViewDataModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedDetailData(null);
            setFullDetailData(null);
          }}
          data={fullDetailData}
        />
      )}

      {selectedDetailData?.tabelTarget === "penangkaran" && (
        <PenangkaranDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedDetailData(null);
            setFullDetailData(null);
          }}
          data={fullDetailData}
        />
      )}

      {selectedDetailData?.tabelTarget !== "referensi_tsl" &&
        selectedDetailData?.tabelTarget !== "penangkaran" && (
          <VerifikasiDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedDetailData(null);
              setFullDetailData(null);
            }}
            data={selectedDetailData}
          />
        )}

      <VerifikasiAcceptModal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        onConfirm={async () => {
          if (selectedRowId !== null) {
            const row = rows.find((r) => r.id === selectedRowId);
            if (row) {
              try {
                const res = await fetch(`${API_URL}/api/verifikasi/approve`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                  },
                  body: JSON.stringify({
                    tabelTarget: row.tabelTarget,
                    targetId: row.targetId,
                    catatan: "Disetujui",
                  }),
                });
                if (res.ok) {
                  fetchVerifikasi();
                } else {
                  const errorData = await res.json();
                  alert(`Gagal menyetujui data: ${errorData.message}`);
                }
              } catch (error) {
                console.error(error);
                alert("Terjadi kesalahan pada server");
              }
            }
          }
          setIsAcceptModalOpen(false);
          setSelectedRowId(null);
        }}
      />

      <VerifikasiRejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={async (reason) => {
          if (selectedRowId !== null) {
            const row = rows.find((r) => r.id === selectedRowId);
            if (row) {
              try {
                const res = await fetch(`${API_URL}/api/verifikasi/tolak`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                  },
                  body: JSON.stringify({
                    tabelTarget: row.tabelTarget,
                    targetId: row.targetId,
                    catatan: reason,
                  }),
                });
                if (res.ok) {
                  fetchVerifikasi();
                } else {
                  const errorData = await res.json();
                  alert(`Gagal menolak data: ${errorData.message}`);
                }
              } catch (error) {
                console.error(error);
                alert("Terjadi kesalahan pada server");
              }
            }
          }
          setIsRejectModalOpen(false);
          setSelectedRowId(null);
        }}
      />

      <VerifikasiRejectReasonModal
        isOpen={isRejectReasonModalOpen}
        onClose={() => setIsRejectReasonModalOpen(false)}
        reason={rejectReason}
      />
    </div>
  );
}
