"use client";

import { useState } from "react";
import { AlertCircle, X } from "lucide-react";

interface UserData {
  id: number;
  namaLengkap: string;
}

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onDeleteAlert?: (type: "success" | "error", title: string, message: string) => void;
  userData: UserData | null;
}

export function DeleteUserModal({
  isOpen,
  onClose,
  onSuccess,
  onDeleteAlert,
  userData,
}: Readonly<DeleteUserModalProps>) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!userData) return;
    const userStr = globalThis.window === undefined ? null : localStorage.getItem("user");
    const role = userStr ? JSON.parse(userStr).role : "";
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
      const res = await fetch(`${url}/api/users/${userData.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        onSuccess();
        onClose();
        if (role === "admin_pusat" && onDeleteAlert) {
          onDeleteAlert("success", "Hapus data berhasil!", "Data pengguna berhasil dihapus dari database.");
        }
      } else {
        let errorMessage = "Gagal menghapus pengguna.";
        try {
          const result = await res.json();
          if (result?.message) errorMessage = result.message;
        } catch {
          // response bukan JSON, gunakan pesan default
        }
        if (role === "admin_pusat" && onDeleteAlert) {
          onDeleteAlert("error", "Hapus data gagal!", errorMessage);
        } else {
          alert(errorMessage);
        }
      }
    } catch (error) {
      console.error("Gagal menghapus:", error);
      const errMsg = error instanceof TypeError
        ? "Gagal terhubung ke server. Periksa koneksi internet Anda."
        : (error instanceof Error ? error.message : "Terjadi kesalahan sistem.");
      if (role === "admin_pusat" && onDeleteAlert) {
        onDeleteAlert("error", "Hapus data gagal!", errMsg);
      } else {
        alert(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-sm rounded-[22px] bg-white px-6 py-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.28)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Tutup modal"
          disabled={isLoading}
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" strokeWidth={2.5} />
          </div>

          <div className="pt-0.5">
            <h3 className="text-[15px] font-semibold text-gray-900">Hapus Pengguna</h3>
          </div>
        </div>

        <p className="mt-4 text-[14px] text-gray-700">
          Apakah Anda yakin ingin menghapus pengguna{" "}
          <span className="font-semibold text-gray-900">
            {userData?.namaLengkap}
          </span>
          ? Data yang dihapus tidak dapat dikembalikan.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
