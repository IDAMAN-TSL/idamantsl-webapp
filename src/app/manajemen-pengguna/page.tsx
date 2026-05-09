"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { AddUserModal } from "@/components/manajemen-pengguna/AddUserModal";
import { FilterPopover } from "@/components/manajemen-pengguna/FilterPopover";
import { UpdateUserModal } from "@/components/manajemen-pengguna/UpdateUserModal";
import { DeleteUserModal } from "@/components/manajemen-pengguna/DeleteUserModal";
import { DetailUserModal } from "@/components/manajemen-pengguna/DetailUserModal";
import {
  getPeranFilterKey,
} from "@/components/manajemen-pengguna/peran-filter-options";

type StatusPengguna = "Aktif" | "Non-aktif";

interface PenggunaRow {
  id: number;
  namaLengkap: string;
  email: string;
  nomorTelepon: string;
  peran: string;
  wilayah: string;
  alamatKantor: string;
  role?: string;
  wilayahId?: number | null;
  namaWilayah?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  isActive?: boolean;
}

const columnChips = [
  { key: "namaLengkap", label: "Nama Pengguna" },
  { key: "email", label: "Email" },
  { key: "nomorTelepon", label: "No Telp" },
  { key: "peran", label: "Peran" },
  { key: "wilayah", label: "Wilayah" },
  { key: "alamatKantor", label: "Alamat Kantor" },
] as const;


export default function ManajemenPenggunaPage() {
  const [penggunaData, setPenggunaData] = useState<PenggunaRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    columnChips.map((column) => column.key)
  );
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pageSizeOpen, setPageSizeOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedPeranFilters, setSelectedPeranFilters] = useState<string[]>([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDetailUserModalOpen, setIsDetailUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PenggunaRow | null>(null);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<PenggunaRow | null>(null);
  const filterButtonRef = useRef<HTMLDivElement | null>(null);

  const handleViewUser = (user: PenggunaRow) => {
    setSelectedUser(user);
    setIsDetailUserModalOpen(true);
  };

  const handleEditUser = (user: PenggunaRow) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const res = await fetch(`${url}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          setError("Anda tidak memiliki izin untuk mengakses halaman ini.");
        } else {
          setError(result?.message || "Gagal memuat pengguna");
        }
        return;
      }

      const payload = result?.success === true ? result.data : result?.data;
      if (!Array.isArray(payload)) {
        setPenggunaData([]);
        return;
      }

      const roleLabel: Record<string, string> = {
        admin_pusat: "Admin Pusat",
        bidang_wilayah: "Bidang",
        seksi_wilayah: "Seksi",
      };

      const mappedData = payload.map((u: any) => ({
        id: u.id,
        namaLengkap: u.nama,
        email: u.email,
        nomorTelepon: u.nomorTelepon || "-",
        peran: roleLabel[u.role] || "-",
        wilayah: u.role === "admin_pusat" ? "-" : u.wilayah?.namaWilayah || u.namaWilayah || "-",
        alamatKantor: u.alamatKantor || "-",
        role: u.role,
        wilayahId: u.wilayahId ?? null,
        namaWilayah: u.wilayah?.namaWilayah || u.namaWilayah || null,
        createdAt: u.createdAt || null,
        updatedAt: u.updatedAt || null,
        isActive: u.isActive ?? true,
      }));
      setPenggunaData(mappedData);
    } catch (error) {
      console.error("Gagal memuat pengguna:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = (user: PenggunaRow) => {
    setUserToDelete(user);
    setIsDeleteUserModalOpen(true);
  };

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return penggunaData.filter((row) => {
      const matchesQuery =
        query === "" ||
        [
          row.namaLengkap,
          row.email,
          row.nomorTelepon,
          row.peran,
          row.wilayah,
          row.alamatKantor,
        ].some((value) => value.toLowerCase().includes(query));

      const rowPeranKey = getPeranFilterKey(row.role, row.wilayahId);
      const matchesPeranFilter =
        selectedPeranFilters.length === 0 || selectedPeranFilters.includes(rowPeranKey);

      return matchesQuery && matchesPeranFilter;
    });
  }, [searchQuery, selectedPeranFilters, penggunaData]);

  const totalRows = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const visibleRows = filteredRows.slice(startIndex, startIndex + pageSize);

  const visibleRowIds = visibleRows.map((row) => row.id);
  const allVisibleRowsSelected =
    visibleRowIds.length > 0 && visibleRowIds.every((id) => selectedRows.includes(id));
  const someVisibleRowsSelected =
    visibleRowIds.some((id) => selectedRows.includes(id)) && !allVisibleRowsSelected;

  const allColumnsSelected = selectedColumns.length === columnChips.length;

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

  const toggleColumn = (columnKey: string) => {
    setSelectedColumns((current) =>
      current.includes(columnKey)
        ? current.filter((key) => key !== columnKey)
        : [...current, columnKey]
    );
  };

  const toggleAllColumns = () => {
    setSelectedColumns(allColumnsSelected ? [] : columnChips.map((column) => column.key));
  };

  const togglePeranFilter = (peranKey: string) => {
    setSelectedPeranFilters((current) =>
      current.includes(peranKey)
        ? current.filter((key) => key !== peranKey)
        : [...current, peranKey]
    );
  };

  const handleResetFilter = () => {
    setSelectedPeranFilters([]);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center rounded-xl border border-[#DCDCDC] bg-white px-6 py-16 shadow-[0_8px_24px_-22px_rgba(0,0,0,0.45)]">
        <p className="text-[14px] text-[#707070]">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-[#171717]">
          Manajemen Pengguna
        </h1>
        <p className="mt-1 text-[14px] text-[#8A8A8A]">
          Kelola akun pengguna website informasi data referensi tumbuhan dan satwa liar
        </p>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-[16px] text-[#D24B4B] font-medium">{error}</p>
        </div>
      ) : (
        <>
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

        <div className="flex flex-wrap items-center gap-2.5 xl:flex-nowrap">
          <FilterPopover
            filterButtonRef={filterButtonRef}
            filterOpen={isFilterModalOpen}
            setFilterOpen={setIsFilterModalOpen}
            selectedPeranFilters={selectedPeranFilters}
            onTogglePeran={togglePeranFilter}
            onReset={handleResetFilter}
          />

          <button
            type="button"
            onClick={() => setIsAddUserModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#8E9E25] px-3.5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#7F8F20]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.4} />
            Tambah
          </button>

          
        </div>
      </div>

      <div className="px-4 py-3 ">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-2.5">
            <p className="text-[14px] font-medium text-[#2F2F2F]">
              Pilih kolom yang ditampilkan
            </p>

            <div className="flex flex-wrap gap-2">
              {columnChips.map((column) => {
                const active = selectedColumns.includes(column.key);

                return (
                  <button
                    key={column.key}
                    type="button"
                    onClick={() => toggleColumn(column.key)}
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                      active
                        ? "border-[#C4CE71] bg-[#F2F6D7] text-[#647221]"
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
                checked={allColumnsSelected}
                onChange={toggleAllColumns}
                className="h-3.5 w-3.5 rounded border-[#B9B9B9] accent-[#8E9E25]"
              />
              <span>Pilih semua atribut</span>
            </label>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setPageSizeOpen((prev) => !prev)}
              className="flex min-w-10 items-center gap-1 rounded-md border border-[#E3E3E3] bg-white px-2 py-1 shadow-sm"
            >
              <span className="text-[13px] text-[#171717]">{pageSize}</span>
              <ChevronDown className="h-3 w-3 text-[#4C4C4C]" />
            </button>

            {pageSizeOpen && (
              <div className="absolute right-0 top-full z-20 mt-1 min-w-10 rounded-md border border-[#E3E3E3] bg-white py-1 shadow-md">
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

      <div className="overflow-hidden rounded-xl border border-[#DCDCDC] bg-white shadow-[0_8px_24px_-22px_rgba(0,0,0,0.45)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-[12px]">
            <thead>
              <tr className="border-b border-[#DCDCDC] bg-[#FAFAFA]">
                <th
                  rowSpan={2}
                  className="border-r border-[#DCDCDC] px-4 py-3 text-center font-semibold text-[#4F4F4F] w-12"
                >
                  <input
                    type="checkbox"
                    checked={allVisibleRowsSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someVisibleRowsSelected;
                    }}
                    onChange={toggleVisibleRows}
                    className="h-3.5 w-3.5 rounded border-[#B9B9B9] accent-[#8E9E25]"
                  />
                </th>
                {selectedColumns.includes("namaLengkap") && (
                  <th className="border-r border-[#DCDCDC] px-4 py-3 text-left font-semibold text-[#4F4F4F]">
                    Nama Lengkap
                  </th>
                )}
                {selectedColumns.includes("email") && (
                  <th className="border-r border-[#DCDCDC] px-4 py-3 text-left font-semibold text-[#4F4F4F]">
                    Email
                  </th>
                )}
                {selectedColumns.includes("nomorTelepon") && (
                  <th className="border-r border-[#DCDCDC] px-4 py-3 text-left font-semibold text-[#4F4F4F]">
                    Nomor Telepon
                  </th>
                )}
                {selectedColumns.includes("peran") && (
                  <th className="border-r border-[#DCDCDC] px-4 py-3 text-left font-semibold text-[#4F4F4F]">
                    Peran
                  </th>
                )}
                {selectedColumns.includes("wilayah") && (
                  <th className="border-r border-[#DCDCDC] px-4 py-3 text-left font-semibold text-[#4F4F4F]">
                    Wilayah
                  </th>
                )}
                {selectedColumns.includes("alamatKantor") && (
                  <th className="border-r border-[#DCDCDC] px-4 py-3 text-left font-semibold text-[#4F4F4F]">
                    Alamat Kantor
                  </th>
                )}
                <th className="px-4 py-3 text-left font-semibold text-[#4F4F4F]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.id} className="border-b border-[#E5E5E5] hover:bg-[#FCFCFC]">
                  <td className="border-r border-[#E5E5E5] px-4 py-3 text-center h-13">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                      className="h-3.5 w-3.5 rounded border-[#B9B9B9] accent-[#8E9E25]"
                    />
                  </td>
                  {selectedColumns.includes("namaLengkap") && (
                    <td className="border-r border-[#E5E5E5] px-4 py-3 text-[#2C2C2C]">
                      {row.namaLengkap}
                    </td>
                  )}
                  {selectedColumns.includes("email") && (
                    <td className="border-r border-[#E5E5E5] px-4 py-3 text-[#2C2C2C]">
                      {row.email}
                    </td>
                  )}
                  {selectedColumns.includes("nomorTelepon") && (
                    <td className="border-r border-[#E5E5E5] px-4 py-3 text-[#2C2C2C]">
                      {row.nomorTelepon}
                    </td>
                  )}
                  {selectedColumns.includes("peran") && (
                    <td className="border-r border-[#E5E5E5] px-4 py-3 text-[#2C2C2C]">
                      {row.peran}
                    </td>
                  )}
                  {selectedColumns.includes("wilayah") && (
                    <td className="border-r border-[#E5E5E5] px-4 py-3 text-[#2C2C2C]">
                      {row.wilayah}
                    </td>
                  )}
                  {selectedColumns.includes("alamatKantor") && (
                    <td className="border-r border-[#E5E5E5] px-4 py-3 text-[#2C2C2C]">
                      {row.alamatKantor}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleViewUser(row)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#9B8CF2] bg-[#DCD6FF] text-[#5E50C7] shadow-sm transition-colors hover:bg-[#cec4ff]"
                        aria-label="Lihat detail"
                      >
                        <ExternalLink className="h-4 w-4" strokeWidth={2.3} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditUser(row)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E6D382] bg-[#FFF8DA] text-[#C19A15] hover:bg-[#FFF2C0]"
                        aria-label="Ubah pengguna"
                      >
                        <Pencil className="h-4 w-4" strokeWidth={2.4} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(row)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#F2A6A6] bg-[#FFEEEE] text-[#D24B4B] hover:bg-[#FFE1E1]"
                        aria-label="Hapus pengguna"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2.4} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#E5E5E5] bg-white px-4 py-3">
          <span className="text-[12px] text-[#707070]">
            Menampilkan {visibleRows.length} dari {totalRows} data
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((current) => Math.max(current - 1, 1))}
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
              onClick={() => setCurrentPage((current) => Math.min(current + 1, totalPages))}
              disabled={safeCurrentPage === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D7D7D7] bg-white text-[#555555] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSuccess={fetchUsers}
      />

      {/* Filter dropdown is handled inside `FilterPopover` component */}

      <UpdateUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        userData={selectedUser}
        onSuccess={fetchUsers}
      />

      <DetailUserModal
        isOpen={isDetailUserModalOpen}
        onClose={() => setIsDetailUserModalOpen(false)}
        userData={selectedUser}
      />

        <DeleteUserModal
          isOpen={isDeleteUserModalOpen}
          onClose={() => setIsDeleteUserModalOpen(false)}
          userData={userToDelete}
          onSuccess={fetchUsers}
        />
        </>
      )}
    </div>
  );
}
