"use client";

import React, { useRef, useState } from "react";
import { X, FileText, Upload } from "lucide-react";

interface UploadDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadDocModal({ isOpen, onClose }: UploadDocModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    /* Backdrop — sits above the parent modal (z-[60]) */
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_24px_48px_-8px_rgba(0,0,0,0.25)]"
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>

        {/* Icon */}
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF0E5]">
          <FileText className="h-6 w-6 text-[#5B7943]" strokeWidth={2} />
        </div>

        {/* Title & description */}
        <h3 className="text-[15px] font-extrabold text-gray-900">
          Unggah file data
        </h3>
        <p className="mt-1 text-[13px] text-gray-500">
          Pastikan file .xlxs dan data seperti pada formulir
        </p>

        {/* File picker row */}
        <div className="mt-5 flex items-center gap-3">
          {/* Hidden input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.xlxs"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* "Pilih file" button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-xl bg-[#5B7943] hover:bg-[#4a6336] px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_4px_10px_rgba(91,121,67,0.25)] transition-all active:scale-95"
          >
            <FileText className="h-4 w-4" strokeWidth={2.5} />
            Pilih file
          </button>

          {/* File name display */}
          <span className="flex-1 truncate rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-[13px] text-gray-500">
            {selectedFile ? selectedFile.name : ""}
          </span>
        </div>

        {/* Footer: Unggah button aligned right */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-2 rounded-xl bg-[#5B7943] hover:bg-[#4a6336] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_4px_10px_rgba(91,121,67,0.25)] transition-all active:scale-95"
          >
            <Upload className="h-4 w-4" strokeWidth={2.5} />
            Unggah
          </button>
        </div>
      </div>
    </div>
  );
}
