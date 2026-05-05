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

const chartData = [
  {
    month: "Jan",
    Penangkar: 120,
    "Pengedar DN": 100,
    "Pengedar LN": 90,
    "Lembaga Konservasi": 80,
  },
  {
    month: "Feb",
    Penangkar: 150,
    "Pengedar DN": 120,
    "Pengedar LN": 110,
    "Lembaga Konservasi": 100,
  },
  {
    month: "Mar",
    Penangkar: 200,
    "Pengedar DN": 140,
    "Pengedar LN": 130,
    "Lembaga Konservasi": 120,
  },
  {
    month: "Apr",
    Penangkar: 270,
    "Pengedar DN": 180,
    "Pengedar LN": 160,
    "Lembaga Konservasi": 150,
  },
  {
    month: "Mei",
    Penangkar: 280,
    "Pengedar DN": 200,
    "Pengedar LN": 180,
    "Lembaga Konservasi": 140,
  },
  {
    month: "Jun",
    Penangkar: 200,
    "Pengedar DN": 160,
    "Pengedar LN": 140,
    "Lembaga Konservasi": 130,
  },
  {
    month: "Jul",
    Penangkar: 240,
    "Pengedar DN": 180,
    "Pengedar LN": 170,
    "Lembaga Konservasi": 160,
  },
  {
    month: "Ags",
    Penangkar: 210,
    "Pengedar DN": 200,
    "Pengedar LN": 190,
    "Lembaga Konservasi": 170,
  },
  {
    month: "Sep",
    Penangkar: 220,
    "Pengedar DN": 190,
    "Pengedar LN": 200,
    "Lembaga Konservasi": 180,
  },
  {
    month: "Okt",
    Penangkar: 190,
    "Pengedar DN": 170,
    "Pengedar LN": 150,
    "Lembaga Konservasi": 140,
  },
  {
    month: "Nov",
    Penangkar: 240,
    "Pengedar DN": 210,
    "Pengedar LN": 190,
    "Lembaga Konservasi": 160,
  },
  {
    month: "Des",
    Penangkar: 260,
    "Pengedar DN": 230,
    "Pengedar LN": 210,
    "Lembaga Konservasi": 190,
  },
];

const statCards = [
  {
    title: "Penangkar",
    value: "10",
    bgColor: "#EDE4F5",
    textColor: "#5D4D7A",
  },
  {
    title: "Pengedar Dalam Negeri",
    value: "10",
    bgColor: "#F5E4E8",
    textColor: "#8B5A6F",
  },
  {
    title: "Pengedar Luar Negeri",
    value: "10",
    bgColor: "#E4EEF5",
    textColor: "#5A7A8B",
  },
  {
    title: "Lembaga Konservasi",
    value: "10",
    bgColor: "#F5EFE4",
    textColor: "#8B7A5A",
  },
];

export default function DashboardPage() {
  const [selectedYear] = useState(2026);
  const [user, setUser] = useState<{ nama: string; role: string } | null>(null);

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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Selamat Datang, {displayRole} BBKSDA Jabar!
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Lihat ringkasan inti informasi data pemanfaatan tumbuhan dan satwa liar
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {statCards.map((card, idx) => {
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
            data={chartData}
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
