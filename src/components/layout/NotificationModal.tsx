"use client";

import { X, ExternalLink, Calendar, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { DetailDataModal as PenangkaranDetailModal } from "../penangkaran/DetailDataModal";
import { DetailDataModal as PengedaranDNDetailModal } from "../pengedaran-dalam/DetailDataModal";
import { DetailDataModal as PengedaranLNDetailModal } from "../pengedaran-luar/DetailDataModal";
import { DetailDataModal as LembagaDetailModal } from "../lembaga-konservasi/DetailDataModal";
import { ViewDataModal as ReferensiDetailModal } from "../referensi-tsl/ViewDataModal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// ── Types ──────────────────────────────────────────────────────────────────────

type TabelTarget =
  | "penangkaran"
  | "pengedaran_dalam_negeri"
  | "pengedaran_luar_negeri"
  | "lembaga_konservasi"
  | "referensi_tsl";

interface VerifikasiLogItem {
  id: number;
  tabelTarget: TabelTarget;
  targetId: number;
  jenisPengajuan: "tambah" | "perbarui" | "hapus";
  status: "pending" | "disetujui" | "ditolak";
  catatan: string | null;
  createdBy: number | null;
  verifikasiOleh: number | null;
  createdAt: string | null;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const CHIP_LABELS: Record<TabelTarget, string> = {
  penangkaran: "Penangkar",
  pengedaran_dalam_negeri: "Pengedar DN",
  pengedaran_luar_negeri: "Pengedar LN",
  lembaga_konservasi: "Lembaga Konservasi",
  referensi_tsl: "Referensi TSL",
};

const TYPE_COLORS: Record<TabelTarget, string> = {
  penangkaran: "bg-violet-100",
  pengedaran_dalam_negeri: "bg-rose-100",
  pengedaran_luar_negeri: "bg-cyan-100",
  lembaga_konservasi: "bg-amber-100",
  referensi_tsl: "bg-green-100",
};

const TYPE_INITIALS: Record<TabelTarget, string> = {
  penangkaran: "P",
  pengedaran_dalam_negeri: "DN",
  pengedaran_luar_negeri: "LN",
  lembaga_konservasi: "LK",
  referensi_tsl: "RT",
};

const ALL_CHIPS = ["Semua", ...Object.values(CHIP_LABELS)] as const;
type ChipLabel = (typeof ALL_CHIPS)[number];

// ── Shell builders (minimal data for detail modals) ───────────────────────────

function buildPenangkaranShell(targetId: number) {
  return {
    id: targetId,
    namaPenangkaran: `Penangkar #${targetId}`,
    namaDirektur: null,
    nomorTelepon: null,
    alamatKantor: null,
    alamatPenangkaran: null,
    koordinatLokasi: null,
    nomorSk: null,
    tanggalSk: null,
    akhirMasaBerlaku: null,
    penerbit: null,
  };
}

function buildPengedaranShell(targetId: number) {
  return {
    id: targetId,
    namaPengedaran: `Pengedar #${targetId}`,
    namaDirektur: null,
    nomorTelepon: null,
    alamatKantor: null,
    alamatPengedaran: null,
    koordinatLokasi: null,
    nomorSk: null,
    tanggalSk: null,
    akhirMasaBerlaku: null,
    penerbit: null,
  };
}

function buildLembagaShell(targetId: number) {
  return {
    id: targetId,
    namaLembaga: `Lembaga #${targetId}`,
    namaDirektur: null,
    nomorTelepon: null,
    alamatLembaga: null,
    alamatKantor: null,
    koordinatLembaga: null,
    nomorSk: null,
    tanggalSk: null,
    akhirMasaBerlaku: null,
    penerbit: null,
  };
}

function buildReferensiShell(targetId: number) {
  return { id: targetId, namaDaerah: `Referensi TSL #${targetId}` };
}

// ── Detail state union ─────────────────────────────────────────────────────────

type DetailState =
  | { type: "penangkaran"; data: any }
  | { type: "pengedaran_dalam_negeri"; data: any }
  | { type: "pengedaran_luar_negeri"; data: any }
  | { type: "lembaga_konservasi"; data: any }
  | { type: "referensi_tsl"; data: any }
  | null;

// ── Main Component ─────────────────────────────────────────────────────────────

export function NotificationModal({ isOpen, onClose }: Readonly<NotificationModalProps>) {
  const [logs, setLogs] = useState<VerifikasiLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeChip, setActiveChip] = useState<ChipLabel>("Semua");
  const [detail, setDetail] = useState<DetailState>(null);

  // Fetch log on open
  useEffect(() => {
    if (!isOpen) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/api/verifikasi/log`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => setLogs(Array.isArray(json.data) ? json.data : []))
      .catch(() => setError("Gagal memuat data notifikasi"))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Chip filter ─────────────────────────────────────────────────────────────

  const filteredLogs =
    activeChip === "Semua"
      ? logs
      : logs.filter((log) => CHIP_LABELS[log.tabelTarget] === activeChip);

  // ── Open detail — hides the notification panel to avoid z-index clash ────────

  const openDetail = async (log: VerifikasiLogItem) => {
    const { tabelTarget, targetId } = log;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    setLoading(true);
    let fetchedData = null;

    try {
      if (tabelTarget === "penangkaran") {
        const res = await fetch(`${API_BASE}/api/penangkaran/${targetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          fetchedData = json.data;
        }
      } else if (tabelTarget === "referensi_tsl") {
        const res = await fetch(`${API_BASE}/api/referensi-tsl/${targetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          fetchedData = json.data;
        }
      }
    } catch (e) {
      console.error("Gagal mengambil data detail", e);
    } finally {
      setLoading(false);
    }

    switch (tabelTarget) {
      case "penangkaran":
        setDetail({ type: "penangkaran", data: fetchedData || buildPenangkaranShell(targetId) });
        break;
      case "pengedaran_dalam_negeri":
        setDetail({ type: "pengedaran_dalam_negeri", data: fetchedData || buildPengedaranShell(targetId) });
        break;
      case "pengedaran_luar_negeri":
        setDetail({ type: "pengedaran_luar_negeri", data: fetchedData || buildPengedaranShell(targetId) });
        break;
      case "lembaga_konservasi":
        setDetail({ type: "lembaga_konservasi", data: fetchedData || buildLembagaShell(targetId) });
        break;
      case "referensi_tsl":
        setDetail({ type: "referensi_tsl", data: fetchedData || buildReferensiShell(targetId) });
        break;
    }
  };

  const closeDetail = () => setDetail(null);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const formatDate = (value: string | null) => {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const statusBadge = (status: VerifikasiLogItem["status"]) => {
    const colorMap: Record<string, string> = {
      disetujui: "bg-green-100 text-green-700",
      ditolak: "bg-red-100 text-red-700",
      pending: "bg-yellow-100 text-yellow-700",
    };
    const labelMap: Record<string, string> = {
      disetujui: "Disetujui",
      ditolak: "Ditolak",
      pending: "Menunggu",
    };
    return (
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${colorMap[status] ?? ""}`}>
        {labelMap[status] ?? status}
      </span>
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Notification panel — hidden while a detail modal is open to avoid z-index clash */}
      {detail === null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
              aria-label="Tutup notifikasi"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Title */}
            <div className="flex flex-col items-center gap-1">
              <h3 className="text-lg font-semibold text-gray-900">Notifikasi</h3>
              <p className="text-[13px] text-gray-500">Log verifikasi data TSL</p>
            </div>

            {/* Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {ALL_CHIPS.map((chip) => {
                const isActive = activeChip === chip;
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setActiveChip(chip)}
                    className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                      isActive
                        ? "border-[#C4CE71] bg-[#F2F6D7] text-[#647221]"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="mt-6 max-h-[60vh] overflow-auto p-1">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-[#8E9E25]" />
                  <span className="ml-2 text-sm text-gray-500">Memuat data...</span>
                </div>
              )}

              {!loading && error && (
                <p className="py-8 text-center text-sm text-red-500">{error}</p>
              )}

              {!loading && !error && filteredLogs.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-400">Tidak ada data notifikasi</p>
              )}

              {!loading && !error && filteredLogs.length > 0 && (
                <div className="flex flex-col gap-4">
                  {filteredLogs.map((log) => {
                    const color = TYPE_COLORS[log.tabelTarget] ?? "bg-gray-100";
                    const initials = TYPE_INITIALS[log.tabelTarget] ?? "?";
                    const label = CHIP_LABELS[log.tabelTarget] ?? log.tabelTarget;
                    return (
                      <div key={log.id} className="flex items-center gap-3">
                        <div className={`flex w-full items-center gap-3 rounded-lg border border-gray-200 p-4 ${color}`}>
                          {/* Icon */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/50 text-gray-800 text-xs font-bold">
                            {initials}
                          </div>

                          {/* Info */}
                          <div className="flex flex-1 flex-col gap-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-[#1A1A1A] text-[14px]">
                                {label} #{log.targetId}
                              </span>
                              {statusBadge(log.status)}
                              <span className="rounded-full border border-gray-300 bg-white/60 px-2 py-0.5 text-[10px] text-gray-600 capitalize">
                                {log.jenisPengajuan}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[12px] text-gray-600">
                              <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                              <span>{formatDate(log.createdAt)}</span>
                            </div>
                            {log.catatan && (
                              <p className="text-[11px] italic text-gray-500">{log.catatan}</p>
                            )}
                          </div>

                          {/* View detail button */}
                          <button
                            type="button"
                            onClick={() => openDetail(log)}
                            className="ml-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white/50 text-gray-700 transition-colors hover:bg-white"
                            aria-label="Buka detail"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Per-type detail modals ─────────────────────────────────────────────
          Rendered without the notification backdrop so z-50 is enough.
          "Back" is handled by closeDetail(), which brings the notification back. */}

      <PenangkaranDetailModal
        isOpen={detail?.type === "penangkaran"}
        onClose={closeDetail}
        data={detail?.type === "penangkaran" ? detail.data : null}
      />
      <PengedaranDNDetailModal
        isOpen={detail?.type === "pengedaran_dalam_negeri"}
        onClose={closeDetail}
        data={detail?.type === "pengedaran_dalam_negeri" ? detail.data : null}
      />
      <PengedaranLNDetailModal
        isOpen={detail?.type === "pengedaran_luar_negeri"}
        onClose={closeDetail}
        data={detail?.type === "pengedaran_luar_negeri" ? detail.data : null}
      />
      <LembagaDetailModal
        isOpen={detail?.type === "lembaga_konservasi"}
        onClose={closeDetail}
        data={detail?.type === "lembaga_konservasi" ? detail.data : null}
      />
      <ReferensiDetailModal
        isOpen={detail?.type === "referensi_tsl"}
        onClose={closeDetail}
        data={detail?.type === "referensi_tsl" ? detail.data : null}
      />
    </>
  );
}

export default NotificationModal;
