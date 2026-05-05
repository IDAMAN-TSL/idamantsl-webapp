"use client";

import { useState } from "react";
import { UserRoundX, X, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: Readonly<LogoutModalProps>) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user = userRaw ? JSON.parse(userRaw) : null;
  const userEmail = user?.email ?? "pengguna@bbksda.go.id";

  const handleLogout = async () => {
    setIsLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-md rounded-2xl bg-white px-6 py-6 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Tutup modal"
          disabled={isLoading}
        >
          <X className="h-5 w-5" strokeWidth={2.2} />
        </button>

        {/* User Email Badge */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#C6D889] bg-[#F4F8E8]">
            <UserRound className="h-5 w-5 text-[#7A8E1C]" strokeWidth={2} />
          </div>
          <span className="text-[14px] font-medium text-gray-700">{userEmail}</span>
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-[18px] font-bold leading-snug text-gray-900">
          Apakah Anda yakin keluar dari website IDAMAN TSL?
        </h2>
        <p className="mt-1.5 text-[13px] text-gray-500">
          Akun Anda akan keluar dari website IDAMAN TSL
        </p>

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
          >
            <UserRoundX className="h-4 w-4" strokeWidth={2.2} />
            {isLoading ? "Keluar..." : "Keluar"}
          </button>
        </div>
      </div>
    </div>
  );
}
