import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PenangkaranPage from '../../src/app/penangkaran/page';

// Mock global fetch
globalThis.fetch = jest.fn();

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock jsPDF to avoid TextEncoder issues
jest.mock('jspdf', () => jest.fn().mockImplementation(() => ({
  save: jest.fn(),
  text: jest.fn(),
  setFontSize: jest.fn(),
})));
jest.mock('jspdf-autotable', () => jest.fn());

describe('PenangkaranPage Component (Penangkaran Unit Test)', () => {
  const mockData = [
    {
      id: 1,
      namaPenangkaran: 'Penangkar Rusa Bogor',
      nomorSk: 'SK-001',
      tanggalSk: '2024-01-01',
      akhirMasaBerlaku: '2027-01-01',
      penerbit: 'BKSDA',
      namaDirektur: 'Andi',
      nomorTelepon: '081',
      statusVerifikasi: 'disetujui',
      bidangWilayah: { namaWilayah: 'Wilayah I' },
      seksiWilayah: { namaWilayah: 'Seksi A' },
      tsl: { namaTsl: 'Rusa' }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock localStorage
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: jest.fn((key) => {
          if (key === 'token') return 'mock-token';
          return null;
        }),
      },
      writable: true,
    });
    
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    });
  });

  test('mengambil data dari API dan menampilkan di tabel', async () => {
    render(<PenangkaranPage />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Memuat data.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Penangkar Rusa Bogor')).toBeInTheDocument();
    expect(screen.getByText('SK-001')).toBeInTheDocument();
  });

  test('fitur pencarian menyaring data di tabel', async () => {
    render(<PenangkaranPage />);
    
    await waitFor(() => expect(screen.getByText('Penangkar Rusa Bogor')).toBeInTheDocument());

    const searchInput = screen.getByPlaceholderText(/Cari unit penangkar/i);
    
    // Cari data yang tidak ada
    fireEvent.change(searchInput, { target: { value: 'Harimau' } });
    expect(screen.queryByText('Penangkar Rusa Bogor')).not.toBeInTheDocument();
    expect(screen.getByText(/Tidak ada data penangkaran/i)).toBeInTheDocument();

    // Cari data yang ada
    fireEvent.change(searchInput, { target: { value: 'Rusa' } });
    expect(screen.getByText('Penangkar Rusa Bogor')).toBeInTheDocument();
  });

  test('menampilkan modal tambah data saat tombol Tambah diklik', async () => {
    render(<PenangkaranPage />);
    
    const addButton = screen.getByText(/Tambah/i, { selector: 'button' });
    fireEvent.click(addButton);

    expect(screen.getByText(/Tambah Data Penangkar TSL/i)).toBeInTheDocument();
  });

  // Catatan: Unit test untuk fitur ekspor (CSV/PDF) berada di file:
  // src/app/penangkaran/__tests__/ExportFeature.test.tsx
});
