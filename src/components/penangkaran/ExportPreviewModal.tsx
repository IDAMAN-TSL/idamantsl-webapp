"use client";

import React from "react";
import { X, FileText, Table as TableIcon, Printer } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportPreviewModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  data: T[];
  selectedColumns: string[];
  columnConfig: Record<string, (row: T) => string>;
  title: string;
}

export function ExportPreviewModal<T>({
  isOpen,
  onClose,
  data,
  selectedColumns,
  columnConfig,
  title,
}: Readonly<ExportPreviewModalProps<T>>) {
  if (!isOpen) return null;

  const activeColumns = selectedColumns.length > 0 
    ? selectedColumns 
    : Object.keys(columnConfig);

  const handleExportCSV = () => {
    const headers = activeColumns.join(",");
    const rows = data.map((row) =>
      activeColumns
        .map((col) => {
          const val = typeof columnConfig[col] === "function" 
            ? columnConfig[col](row) 
            : "-";
          // Escape commas and quotes for CSV
          return `"${val.replaceAll('"', '""')}"`;
        })
        .join(",")
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${title.toLowerCase().replaceAll(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: activeColumns.length > 6 ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    const displayTitle = `Laporan ${title}`;
    const date = `Dicetak pada: ${new Date().toLocaleString("id-ID")}`;

    doc.setFontSize(16);
    doc.text(displayTitle, 14, 15);
    doc.setFontSize(10);
    doc.text(date, 14, 22);

    const tableHeaders = [activeColumns];
    const tableData = data.map((row) =>
      activeColumns.map((col) => 
        typeof columnConfig[col] === "function" ? columnConfig[col](row) : "-"
      )
    );

    autoTable(doc, {
      head: tableHeaders,
      body: tableData,
      startY: 30,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [142, 158, 37], textColor: [255, 255, 255], fontStyle: "bold" },
      margin: { top: 30 },
    });

    doc.save(`${title.toLowerCase().replaceAll(/\s+/g, '_')}_${Date.now()}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-full max-w-6xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8E9E25]/10 text-[#8E9E25]">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Pratinjau Cetak</h2>
              <p className="text-sm text-gray-500">
                {activeColumns.length} kolom dipilih • {data.length} baris data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content / Preview Area */}
        <div className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="mx-auto min-h-[1123px] w-[794px] bg-white p-12 shadow-lg ring-1 ring-gray-200 landscape:w-[1123px] landscape:min-h-[794px]">
            {/* Simulation of A4 Paper */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Laporan {title}</h1>
              <p className="text-sm text-gray-500">Dicetak pada: {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            <div className="overflow-x-auto border border-gray-200">
              <table className="w-full border-collapse text-[10px]">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {activeColumns.map((col) => (
                      <th key={col} className="border-b border-gray-200 p-2 font-bold text-gray-700">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 15).map((row, idx) => {
                    const rowKey = (row as any).id ?? idx;
                    return (
                    <tr key={rowKey} className="border-b border-gray-100 last:border-0">
                      {activeColumns.map((col) => (
                        <td key={col} className="p-2 text-gray-600">
                          {typeof columnConfig[col] === "function" 
                            ? columnConfig[col](row) 
                            : "-"}
                        </td>
                      ))}
                    </tr>
                    );
                  })}
                  {data.length > 15 && (
                    <tr>
                      <td colSpan={activeColumns.length} className="p-4 text-center text-gray-400 italic">
                        ... dan {data.length - 15} data lainnya (hanya menampilkan 15 baris pertama di pratinjau)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 border-t border-gray-100 pt-4 text-[10px] text-gray-400">
              Halaman 1 dari {Math.ceil(data.length / 20) || 1}
            </div>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <div className="h-8 w-px bg-gray-200 mx-2" />
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl border border-[#8E9E25] bg-white px-6 py-2.5 text-sm font-semibold text-[#8E9E25] hover:bg-[#8E9E25]/5 transition-colors"
          >
            <TableIcon className="h-4 w-4" />
            Unduh CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 rounded-xl bg-[#8E9E25] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#8E9E25]/20 hover:bg-[#7e8d20] transition-all active:scale-95"
          >
            <Printer className="h-4 w-4" />
            Cetak PDF (A4)
          </button>
        </div>
      </div>
    </div>
  );
}

