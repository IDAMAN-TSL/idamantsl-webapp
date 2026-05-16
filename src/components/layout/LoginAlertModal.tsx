"use client";

import { X, Check } from "lucide-react";

interface LoginAlertModalProps {
  isOpen: boolean;
  type: "success" | "error";
  onClose: () => void;
}

export function LoginAlertModal({ isOpen, type, onClose }: Readonly<LoginAlertModalProps>) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[400px] rounded-3xl bg-white px-8 py-10 shadow-xl text-center flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Tutup modal"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        {/* Icon */}
        <div className="mb-4">
          {type === "success" ? (
            <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full border-[7px] border-[#0F8A18] bg-white">
              <Check className="h-10 w-10 text-[#0F8A18]" strokeWidth={4.5} />
            </div>
          ) : (
            <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full border-[7px] border-[#F23B3B] bg-white">
              <X className="h-10 w-10 text-[#F23B3B]" strokeWidth={4.5} />
            </div>
          )}
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-[20px] font-bold text-gray-900 mb-1.5">
          {type === "success" ? "Login berhasil!" : "Login gagal!"}
        </h2>
        <p className="text-[15px] text-gray-400">
          {type === "success"
            ? "Selamat datang di website IDAMAN TSL."
            : "Pastikan email dan password terdaftar dan benar."}
        </p>
      </div>
    </div>
  );
}
