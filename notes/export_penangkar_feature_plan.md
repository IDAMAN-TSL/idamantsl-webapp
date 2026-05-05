# Rencana Fitur Unduh Data (CSV & PDF) - Penangkar TSL

Fitur ini memungkinkan pengguna untuk memilih kolom yang diinginkan, melihat pratinjau (preview), dan mengunduh data dalam format CSV atau PDF (Ukuran A4).

## 1. Persiapan Dependensi
Instalasi library yang dibutuhkan:
- `jspdf`: Library utama untuk pembuatan PDF.
- `jspdf-autotable`: Plugin jspdf untuk membuat tabel dengan mudah di PDF.

## 2. Pemetaan Kolom (Column Mapping)
Memetakan label tombol (tags) ke field data dan header tabel:
- **Unit Penangkar**: `namaPenangkaran`
- **Direktor/PJ**: `namaDirektur`
- **No Telp**: `nomorTelepon`
- **Bidang**: `bidangWilayah.namaWilayah`
- **Seksi**: `seksiWilayah.namaWilayah`
- **No SK**: `nomorSk`
- **Tgl SK**: `tanggalSk`
- **Masa Berlaku SK**: `akhirMasaBerlaku`
- **Penerbit**: `penerbit`
- **Jenis TSL**: `tsl.namaTsl`
- ...dan seterusnya.

## 3. Pengembangan UI Komponen
### A. Update State & Logic di `page.tsx`
- Implementasi logic "Pilih Semua Kolom".
- Sinkronisasi tabel utama agar hanya menampilkan kolom yang dipilih (opsional, tapi disarankan agar konsisten).
- Handler untuk tombol "Unduh" untuk membuka Modal Preview.

### B. Modal Preview (`ExportPreviewModal`)
- Menampilkan data dalam format tabel sederhana.
- Wadah preview diatur agar menyerupai proporsi kertas A4 (portrait/landscape).
- Tombol konfirmasi: "Unduh CSV" dan "Unduh PDF".

## 4. Implementasi Logika Export
### A. Export CSV
- Fungsi untuk mengubah array object menjadi string CSV.
- Menggunakan `Blob` dan `URL.createObjectURL` untuk mentrigger download di browser.

### B. Export PDF (A4)
- Menggunakan `jspdf` dengan orientasi Landscape (karena kolom data biasanya lebar).
- Menggunakan `jspdf-autotable` untuk merender tabel secara otomatis berdasarkan kolom yang aktif.
- Menambahkan Header "Laporan Data Penangkar TSL" dan Tanggal Cetak.

## 5. Langkah Kerja
1. **Instalasi library**: `npm install jspdf jspdf-autotable`
2. **Modifikasi `src/app/penangkaran/page.tsx`**:
   - Menambahkan state `isExportModalOpen`.
   - Membuat mapping config untuk kolom.
   - Mengupdate checkbox "Pilih Semua".
3. **Membuat Komponen `ExportPreviewModal.tsx`**:
   - Berisi tampilan tabel dan tombol aksi.
4. **Testing**: Memastikan kolom yang dipilih sesuai dengan hasil unduhan.

---
> [!NOTE]
> PDF akan menggunakan orientasi **Landscape** jika jumlah kolom yang dipilih banyak, agar tetap terbaca di ukuran A4. Jika kolom sedikit, akan menggunakan **Portrait**.
