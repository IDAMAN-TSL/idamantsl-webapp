"use client";

import React, { useRef, useState } from "react";
import { X, FileText, Upload } from "lucide-react";

interface UploadDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadDocModal({ isOpen, onClose }: Readonly<UploadDocModalProps>) {
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
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]">
      <div
        className="relative w-full max-w-140 rounded-[22px] bg-white px-6 py-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.28)]"
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Tutup upload"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D5DB9C] bg-[#F5F6E5] text-[#8E9E25]">
            <FileText className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div className="pt-0.5">
            <h3 className="text-[15px] font-semibold text-gray-900">Unggah File</h3>
          </div>
        </div>

        <p className="mt-4 text-[12px] text-gray-400">
          Pastikan file bertipe .pdf atau .csv dan data seperti pada formulir
        </p>

        <div className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.csv"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex h-10 items-stretch overflow-hidden rounded-md border border-gray-200 bg-white">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 border-r border-gray-200 bg-[#F5F6E5] px-3 text-[13px] font-medium text-[#8E9E25] transition-colors hover:bg-[#eef1d1]"
            >
              <FileText className="h-4 w-4" strokeWidth={2.2} />
              Pilih file
            </button>
            <div className="flex min-w-0 flex-1 items-center px-3 text-[13px] text-gray-400">
              <span className="truncate">
                {selectedFile ? selectedFile.name : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#F5F6E5] px-4 py-2 text-[13px] font-medium text-[#8E9E25] transition-colors hover:bg-[#eef1d1]"
          >
            <Upload className="h-4 w-4" strokeWidth={2.2} />
            Unggah
          </button>
        </div>
      </div>
    </div>
  );
}
