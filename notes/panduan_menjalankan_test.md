# Panduan Menjalankan Unit Test & Melihat Hasilnya

Setelah membuat file unit test, langkah berikutnya adalah menjalankannya untuk memastikan kode berfungsi dengan benar dan melihat seberapa banyak bagian kode yang sudah teruji.

---

## 1. Menjalankan Test Melalui Terminal

Kamu bisa menjalankan perintah berikut di folder `idamantsl-webapp`:

### A. Menjalankan Semua Unit Test (Lengkap dengan Report)
Gunakan perintah ini untuk melihat ringkasan hasil secara keseluruhan:
```bash
npm run test:unit
```
Perintah ini akan:
1. Mencari semua file di folder `test/unit/`.
2. Menampilkan status `PASS` (Berhasil) atau `FAIL` (Gagal) untuk tiap skenario.
3. Membuat folder laporan di `test/report/`.

### B. Menjalankan Satu File Tertentu (Lebih Cepat)
Jika kamu sedang fokus mengerjakan satu fitur, tidak perlu menjalankan semua test. Cukup jalankan file yang sedang dikerjakan:
```bash
npx jest test/unit/auth.test.tsx
```

---

## 2. Memahami Output Terminal

Saat test selesai, kamu akan melihat tabel ringkasan:

- **PASS/FAIL**: Status utama test.
- **Statements**: Persentase baris perintah yang dijalankan.
- **Branches**: Persentase percabangan (seperti `if/else`) yang diuji.
- **Functions**: Persentase fungsi yang dipanggil.
- **Lines**: Persentase baris kode yang dieksekusi.
- **Uncovered Line #s**: Memberitahu baris mana saja yang **belum** tersentuh oleh test.

---

## 3. Melihat Laporan Visual (HTML Report)

Jika kamu ingin melihat laporan yang lebih detail dan interaktif (bisa diklik per baris kode):

1. Pastikan sudah menjalankan `npm run test:unit`.
2. Buka folder proyek di File Explorer.
3. Masuk ke: `test/report/lcov-report/`.
4. Klik dua kali pada file **`index.html`** untuk membukanya di Browser (Chrome/Edge).

### Kelebihan Laporan HTML:
- Kamu bisa melihat file mana yang paling banyak memiliki "lubang" (belum di-test).
- Di dalam tiap file, baris yang berwarna **hijau** berarti sudah teruji, dan yang berwarna **merah** berarti belum pernah dijalankan oleh test.

---

## 4. Tips Debugging Saat Test Gagal

Jika muncul status `FAIL`, perhatikan bagian **"Expected"** (apa yang seharusnya muncul) dan **"Received"** (apa yang sebenarnya muncul di kode).

Beberapa penyebab umum kegagalan:
- **Teks berubah**: Kamu mengubah teks di UI tapi lupa mengubah teks di file `.test.tsx`.
- **API Berubah**: Struktur data yang dikembalikan backend berbeda dengan data mock di test.
- **Asynchronous**: Kamu lupa menggunakan `await waitFor(...)` untuk elemen yang muncul setelah proses loading.

---

## Perintah Cepat (Cheat Sheet)
| Aksi | Perintah |
| :--- | :--- |
| Run All Unit Tests | `npm run test:unit` |
| Run Watch Mode (Auto run tiap save) | `npm run test:watch` |
| Run Specific File | `npx jest [path_file]` |
| View HTML Report | Buka `test/report/lcov-report/index.html` |
