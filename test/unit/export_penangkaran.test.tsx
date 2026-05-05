import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PenangkaranPage from '../../src/app/penangkaran/page';
import jsPDF from 'jspdf';

// Mocking fetch global
globalThis.fetch = jest.fn();

// Mocking useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mocking jsPDF and jspdf-autotable
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    text: jest.fn(),
    setFontSize: jest.fn(),
  }));
});

jest.mock('jspdf-autotable', () => jest.fn());

// Mocking URL methods for CSV download
globalThis.URL.createObjectURL = jest.fn(() => 'mock-url');
globalThis.URL.revokeObjectURL = jest.fn();

describe('Penangkaran Export Feature', () => {
  const mockData = [
    {
      id: 1,
      namaPenangkaran: 'Unit Test Penangkaran',
      nomorSk: 'SK-EXPORT-001',
      tanggalSk: '2024-01-01',
      akhirMasaBerlaku: '2027-01-01',
      penerbit: 'BKSDA',
      namaDirektur: 'John Doe',
      nomorTelepon: '0812345678',
      statusVerifikasi: 'disetujui',
      bidangWilayah: { namaWilayah: 'Wilayah I' },
      seksiWilayah: { namaWilayah: 'Seksi A' },
      tsl: { namaTsl: 'Rusa Timor' }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock localStorage
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: jest.fn((key) => key === 'token' ? 'mock-token' : null),
      },
      writable: true,
    });
    
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    });
  });

  test('membuka modal pratinjau saat tombol Unduh diklik', async () => {
    render(<PenangkaranPage />);
    
    // Tunggu data dimuat
    await waitFor(() => expect(screen.getByText('Unit Test Penangkaran')).toBeInTheDocument());

    const unduhButton = screen.getByText(/Unduh/i, { selector: 'button' });
    fireEvent.click(unduhButton);

    // Modal Pratinjau harus muncul
    expect(screen.getByText(/Pratinjau Cetak/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Penangkar TSL/i)).toBeInTheDocument();
  });

  test('menjalankan proses ekspor CSV', async () => {
    render(<PenangkaranPage />);
    await waitFor(() => expect(screen.getByText('Unit Test Penangkaran')).toBeInTheDocument());

    fireEvent.click(screen.getByText(/Unduh/i, { selector: 'button' }));

    const csvButton = screen.getByText(/Unduh CSV/i);
    
    // Mocking document.createElement for click simulation
    const link = { click: jest.fn(), setAttribute: jest.fn(), style: {} };
    const createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue(link as any);
    const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => link as any);
    const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => link as any);

    fireEvent.click(csvButton);

    expect(globalThis.URL.createObjectURL).toHaveBeenCalled();
    expect(link.click).toHaveBeenCalled();

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  test('menjalankan proses ekspor PDF', async () => {
    render(<PenangkaranPage />);
    await waitFor(() => expect(screen.getByText('Unit Test Penangkaran')).toBeInTheDocument());

    fireEvent.click(screen.getByText(/Unduh/i, { selector: 'button' }));

    const pdfButton = screen.getByText(/Cetak PDF/i);
    fireEvent.click(pdfButton);

    // Memastikan jsPDF dipanggil
    expect(jsPDF).toHaveBeenCalled();
    
    // Memastikan modal tertutup setelah klik batal
    const batalButton = screen.getByText(/Batal/i);
    fireEvent.click(batalButton);
    expect(screen.queryByText(/Pratinjau Cetak/i)).not.toBeInTheDocument();
  });

  test('memilih semua kolom melalui checkbox "Pilih semua kolom"', async () => {
    render(<PenangkaranPage />);
    await waitFor(() => expect(screen.getByText('Unit Test Penangkaran')).toBeInTheDocument());

    const selectAllCheckbox = screen.getByLabelText(/Pilih semua kolom/i);
    
    // Klik pilih semua
    fireEvent.click(selectAllCheckbox);
    
    fireEvent.click(screen.getByText(/Unduh/i, { selector: 'button' }));
    
    // Verifikasi jumlah kolom di modal
    expect(screen.getByText(/16 kolom dipilih/i)).toBeInTheDocument();
  });
});
