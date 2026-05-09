"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "8px 12px",
        }}
      >
        <p style={{ color: "#000", margin: "0 0 4px 0", fontWeight: "500" }}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            style={{
              color: entry.color,
              margin: "2px 0",
              fontSize: "12px",
            }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const INITIAL_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Ags",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const DEFAULT_STAT_CARDS = [
  {
    title: "Penangkar",
    value: "0",
    bgColor: "#EDE4F5",
    textColor: "#5D4D7A",
  },
  {
    title: "Pengedar Dalam Negeri",
    value: "0",
    bgColor: "#F5E4E8",
    textColor: "#8B5A6F",
  },
  {
    title: "Pengedar Luar Negeri",
    value: "0",
    bgColor: "#E4EEF5",
    textColor: "#5A7A8B",
  },
  {
    title: "Lembaga Konservasi",
    value: "0",
    bgColor: "#F5EFE4",
    textColor: "#8B7A5A",
  },
];

export default function DashboardPage() {
  const [selectedYear] = useState(2026);
  const [user, setUser] = useState<{ nama: string; role: string } | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [statCardsState, setStatCardsState] = useState(DEFAULT_STAT_CARDS);
  const [chartDataState, setChartDataState] = useState(
    INITIAL_MONTHS.map((m) => ({
      month: m,
      Penangkar: 0,
      "Pengedar DN": 0,
      "Pengedar LN": 0,
      "Lembaga Konservasi": 0,
    })),
  );

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const getToken = () =>
    typeof window === "undefined" ? null : localStorage.getItem("token");

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();

      // Fetch penangkaran (this endpoint exists)
      const resPen = await fetch(`${API_URL}/api/penangkaran`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const penResult = await resPen.json().catch(() => ({}));
      const penData = Array.isArray(penResult.data) ? penResult.data : [];
      const penTotal = typeof penResult.total === "number" ? penResult.total : penData.length;

      // Try fetch pengedaran and lembaga endpoints if available
      const tryFetch = async (path: string) => {
        try {
          const r = await fetch(`${API_URL}${path}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          });
          if (!r.ok) return [];
          const j = await r.json();
          return Array.isArray(j.data) ? j.data : [];
        } catch {
          return [];
        }
      };

      const [pengDnData, pengLnData, lembagaData] = await Promise.all([
        tryFetch(`/api/pengedaran-dn`),
        tryFetch(`/api/pengedaran-ln`),
        tryFetch(`/api/lembaga-konservasi`),
      ]);

      const statCardsUpdated = [
        { ...DEFAULT_STAT_CARDS[0], value: String(penTotal ?? 0) },
        { ...DEFAULT_STAT_CARDS[1], value: String(pengDnData.length ?? 0) },
        { ...DEFAULT_STAT_CARDS[2], value: String(pengLnData.length ?? 0) },
        { ...DEFAULT_STAT_CARDS[3], value: String(lembagaData.length ?? 0) },
      ];

      // Build monthly chart counts using createdAt if available
      const byMonth = INITIAL_MONTHS.map(() => ({ Penangkar: 0, PengedarDN: 0, PengedarLN: 0, Lembaga: 0 }));

      const monthIndex = (dateStr: any) => {
        try {
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return null;
          return d.getMonth();
        } catch {
          return null;
        }
      };

      penData.forEach((item: any) => {
        const idx = monthIndex(item.createdAt) ?? monthIndex(item.tanggalSk);
        if (typeof idx === "number" && idx >= 0 && idx < 12) byMonth[idx].Penangkar++;
      });

      pengDnData.forEach((item: any) => {
        const idx = monthIndex(item.createdAt) ?? monthIndex(item.tanggalSk);
        if (typeof idx === "number" && idx >= 0 && idx < 12) byMonth[idx].PengedarDN++;
      });

      pengLnData.forEach((item: any) => {
        const idx = monthIndex(item.createdAt) ?? monthIndex(item.tanggalSk);
        if (typeof idx === "number" && idx >= 0 && idx < 12) byMonth[idx].PengedarLN++;
      });

      lembagaData.forEach((item: any) => {
        const idx = monthIndex(item.createdAt) ?? monthIndex(item.tanggalSk);
        if (typeof idx === "number" && idx >= 0 && idx < 12) byMonth[idx].Lembaga++;
      });

      const newChart = INITIAL_MONTHS.map((m, i) => ({
        month: m,
        Penangkar: byMonth[i].Penangkar,
        "Pengedar DN": byMonth[i].PengedarDN,
        "Pengedar LN": byMonth[i].PengedarLN,
        "Lembaga Konservasi": byMonth[i].Lembaga,
      }));

      setStatCardsState(statCardsUpdated);
      setChartDataState(newChart);
    } catch (err: any) {
      console.error("Failed to fetch dashboard data", err);
      setError("Gagal memuat data dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const onFocus = () => fetchDashboard();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const formatRole = (role: string) => {
    if (!role) return "Admin Pusat";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const displayRole = formatRole(user?.role || "");

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[#171717]">
            Selamat Datang, {displayRole} BBKSDA Jabar!
          </h1>
          <p className="mt-1 text-[14px] text-[#8A8A8A]">
            Lihat ringkasan inti informasi data pemanfaatan tumbuhan dan satwa liar
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {statCardsState.map((card, idx) => {
          return (
            <div
              key={idx}
              className="rounded-2xl p-4 shadow-sm"
              style={{
                backgroundColor: card.bgColor,
              }}
            >
              <div className="flex flex-col gap-3">
                <span 
                  className="text-sm font-medium"
                  style={{ color: card.textColor }}
                >
                  {card.title}
                </span>
                <span 
                  className="text-3xl font-bold"
                  style={{ color: card.textColor }}
                >
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Statistik Data Pemanfaatan Tumbuhan dan Satwa Liar dalam 1 Tahun
            </h2>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200">
            <span className="text-sm font-medium text-gray-600">Tahun:</span>
            <span className="text-sm font-semibold text-gray-900">
              {selectedYear}
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartDataState}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="Penangkar"
              stroke="#5D4D7A"
              strokeWidth={2}
              dot={{ fill: "#5D4D7A", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Pengedar DN"
              stroke="#8B5A6F"
              strokeWidth={2}
              dot={{ fill: "#8B5A6F", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Pengedar LN"
              stroke="#5A7A8B"
              strokeWidth={2}
              dot={{ fill: "#5A7A8B", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="Lembaga Konservasi"
              stroke="#8B7A5A"
              strokeWidth={2}
              dot={{ fill: "#8B7A5A", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
