import React from "react";
import { X, Save, ChevronDown, Trash2 } from "lucide-react";

interface UpdateDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateDataModal({ isOpen, onClose }: UpdateDataModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/40 backdrop-blur-sm p-4 md:p-8">
      <div className="w-full max-w-5xl rounded-[32px] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative" style={{ backgroundColor: "#edf0deff" }}>
        <div className="text-center mb-8">
          <h2 className="text-[22px] font-extrabold text-gray-900 tracking-tight">Perbarui Data Referensi TSL</h2>
          <p className="text-sm font-medium text-gray-600 mt-1">Perbarui data dengan baik dan benar</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col gap-6">
            <InputField label="Nama TSL" />
            <SelectField label="Jenis TSL">
              <option value="">-- Pilih Jenis --</option>
              <option value="tumbuhan">Tumbuhan</option>
              <option value="satwa">Satwa</option>
            </SelectField>
            <InputField label="Kingdom" />
            <InputField label="Filum" />
            <InputField label="Kelas" />
          </div>
          <div className="flex flex-col gap-6">
            <InputField label="Ordo" />
            <InputField label="Famili" />
            <InputField label="Genus" />
            <InputField label="Spesies" />
            <SelectField label="Status Perlindungan Nasional">
              <option value="">-- Pilih Status --</option>
              <option value="dilindungi">Dilindungi</option>
              <option value="tidak-dilindungi">Tidak Dilindungi</option>
            </SelectField>
            <SelectField label="Status CITES">
              <option value="">-- Pilih Appendix --</option>
              <option value="appendix-i">Appendix I</option>
              <option value="appendix-ii">Appendix II</option>
              <option value="appendix-iii">Appendix III</option>
            </SelectField>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between gap-4">
          <button className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(220,38,38,0.3)] transition-all active:scale-95">
            <Trash2 className="h-5 w-5" strokeWidth={2.5} />
            Hapus
          </button>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(245,158,11,0.35)] transition-all active:scale-95">
              <X className="h-5 w-5" strokeWidth={2.5} />
              Batal
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-[#5B7943] hover:bg-[#4a6336] px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(91,121,67,0.3)] transition-all active:scale-95">
              <Save className="h-5 w-5" strokeWidth={2.5} />
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-extrabold text-[#111] ml-1">{label}</label>
      <input type="text" className="h-12 w-full rounded-[14px] border border-white/50 px-4 outline-none focus:ring-2 focus:ring-[#5B7943]/50 transition-all text-sm text-gray-800" style={{ backgroundColor: "#EEF0E5", boxShadow: "0 6px 12px -2px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.5)" }} />
    </div>
  );
}

function SelectField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-extrabold text-[#111] ml-1">{label}</label>
      <div className="relative">
        <select className="h-12 w-full rounded-[14px] border border-white/50 pl-4 pr-[52px] outline-none appearance-none focus:ring-2 focus:ring-[#5B7943]/50 transition-all text-sm text-gray-800" style={{ backgroundColor: "#EEF0E5", boxShadow: "0 6px 12px -2px rgba(0,0,0,0.06), inset 0 2px 4px rgba(255,255,255,0.5)" }}>
          {children}
        </select>
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 h-[34px] w-[34px] rounded-[10px] bg-[#5B7943] flex items-center justify-center pointer-events-none">
          <ChevronDown className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
