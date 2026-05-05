# Panduan Lengkap: Membuat Unit Test dari Nol

Panduan ini akan menjelaskan langkah demi langkah cara membuat unit test untuk komponen React (Next.js) menggunakan **Jest** dan **React Testing Library**.

---

## 1. Tentukan Lokasi File Test
Aturan penempatan file test biasanya disesuaikan dengan kesepakatan tim. Dalam proyek ini, kita meletakkan test di dalam folder `test/unit/` (terpisah dari struktur `src`) atau menggunakan folder `__tests__` di sebelah komponen. 

**Contoh:** Jika kamu ingin menguji `src/app/dashboard/page.tsx`, buatlah file test di:
`test/unit/dashboard.test.tsx`

---

## 2. Setup Awal & Import Library
Mulailah dengan mengimpor modul-modul yang dibutuhkan. Jangan lupa menyertakan `@testing-library/jest-dom` agar kamu tidak terkena error TypeScript saat melakukan *assertion*.

```tsx
import React from 'react';
// Wajib di-import agar TypeScript mengenali matchers seperti .toBeInTheDocument()
import '@testing-library/jest-dom'; 
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Import komponen yang mau di-test
import DashboardPage from '../../src/app/dashboard/page'; 
```

---

## 3. Mocking Dependensi (API, Router, dll)
Unit test harus bersifat **terisolasi**. Artinya, kita tidak boleh menembak API sungguhan atau berpindah halaman sungguhan. Kita harus me-mock (memalsukan) fungsi-fungsi tersebut.

```tsx
// 1. Mock Next.js Router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('DashboardPage Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset mock sebelum tiap test dijalankan
    jest.clearAllMocks();
    
    // Implementasi mock router
    const { useRouter } = require('next/navigation');
    useRouter.mockReturnValue({ push: mockPush });

    // 2. Mock fungsi global fetch (untuk API)
    global.fetch = jest.fn();
  });
  
  // ... Lanjut ke langkah 4
```

---

## 4. Tulis Test Case Pertama (Cek Render UI)
Test paling dasar adalah memastikan komponen tidak *crash* saat dimuat dan teks/elemen utamanya muncul.

```tsx
  test('merender halaman dashboard dengan benar', () => {
    // Render komponen ke virtual DOM
    render(<DashboardPage />);
    
    // Cari elemen berdasarkan teks
    const heading = screen.getByText('Selamat Datang di Dashboard');
    
    // Assertion (Ekspektasi)
    expect(heading).toBeInTheDocument();
  });
```

---

## 5. Simulasi API Berhasil (Success Scenario)
Jika komponenmu memanggil API saat pertama kali dimuat (misalnya via `useEffect`), kamu harus mengatur agar *mock fetch* mengembalikan data dummy.

```tsx
  test('mengambil dan menampilkan data statistik', async () => {
    // Atur apa yang dikembalikan oleh API
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { totalUser: 150, totalHewan: 45 }
      }),
    });

    render(<DashboardPage />);

    // Gunakan waitFor() jika UI menunggu proses asynchronous (seperti fetch API)
    await waitFor(() => {
      expect(screen.getByText('Total User: 150')).toBeInTheDocument();
    });
  });
```

---

## 6. Simulasi Interaksi Pengguna (User Event)
Untuk menguji form atau tombol, kita menggunakan `fireEvent`.

```tsx
  test('menyimpan data saat tombol disubmit', async () => {
    render(<DashboardPage />);
    
    // 1. Cari elemen input
    // Tips: Gunakan getByPlaceholderText jika input tidak punya ID/Label yang terhubung
    const inputSearch = screen.getByPlaceholderText('Cari data...');
    
    // 2. Simulasi user mengetik
    fireEvent.change(inputSearch, { target: { value: 'Harimau' } });
    
    // 3. Simulasi user klik tombol
    const buttonSubmit = screen.getByRole('button', { name: /Cari/i });
    fireEvent.click(buttonSubmit);
    
    // 4. Pastikan aksi terjadi (misal: pesan error muncul atau API dipanggil)
    await waitFor(() => {
      expect(screen.getByText('Hasil pencarian: Harimau')).toBeInTheDocument();
    });
  });
```

---

## 7. Jalankan Test
Setelah selesai menulis file, simpan dan buka terminal. 

Jika ingin **menjalankan semua unit test** sekaligus dengan laporannya:
```bash
npm run test:unit
```

Jika ingin **menjalankan 1 file tertentu** secara cepat saat *development* (sangat berguna untuk debugging):
```bash
npx jest test/unit/dashboard.test.tsx
```

---

### 💡 Tips Tambahan:
- Gunakan `screen.debug()` di tengah kode test untuk melihat struktur HTML (DOM) saat ini yang sedang dibaca oleh Jest. Ini sangat membantu saat kamu bingung kenapa sebuah elemen tidak ditemukan.
- Pilih selektor yang mendekati cara user melihat UI: Prioritaskan `getByRole`, lalu `getByLabelText`, `getByPlaceholderText`, dan terakhir `getByText`.
