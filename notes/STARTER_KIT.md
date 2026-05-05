# 🚀 IDAMAN TSL - Starter Kit

Selamat datang di proyek **IDAMAN TSL**! Panduan ini akan membantumu menyiapkan lingkungan pengembangan dari awal hingga aplikasi berjalan di komputermu.

---

## 📋 Prasyarat
Pastikan kamu sudah menginstal perangkat lunak berikut:
- **Node.js** (v18 ke atas)
- **Docker & Docker Desktop** (untuk database)
- **Git**

---

## 📂 Struktur Proyek
Proyek ini terbagi menjadi dua bagian utama:
1.  `idamantsl-backend`: API Server menggunakan Node.js, Express, dan Drizzle ORM.
2.  `idamantsl-webapp`: Frontend menggunakan Next.js dan Tailwind CSS.
3.  **Fitur Unggulan**: Autentikasi JWT, CRUD Penangkaran/Pengedaran, dan Ekspor Data (PDF A4 & CSV).

---

## 🛠️ Langkah Instalasi

### 1. Clone Repositori
```bash
git clone https://github.com/username/idamantsl.git
cd idamantsl
```

### 2. Setup Backend
Masuk ke folder backend dan instal dependensi:
```bash
cd idamantsl-backend
npm install
```
Buat file `.env` di folder `idamantsl-backend` (copy dari `.env.example` jika ada):
```env
PORT=5001
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=idamantsl_db
JWT_SECRET=rahasia_negara_anda
```

### 3. Jalankan Database (Docker)
Pastikan Docker Desktop sudah menyala, lalu jalankan:
```bash
docker-compose up -d
```
*Database akan berjalan di port 5433.*

### 4. Setup Database (Migration & Seed)
Jalankan perintah ini untuk membuat tabel dan mengisi data awal (user admin, dll):
```bash
npm run seed
```

### 5. Setup Webapp (Frontend)
Buka terminal baru, masuk ke folder webapp dan instal dependensi:
```bash
cd idamantsl-webapp
npm install
```
Buat file `.env.local` di folder `idamantsl-webapp`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## 🏃 Menjalankan Aplikasi

### Menjalankan Backend
Di folder `idamantsl-backend`:
```bash
npm run dev
```
*Server akan berjalan di http://localhost:5001*

### Menjalankan Frontend
Di folder `idamantsl-webapp`:
```bash
npm run dev
```
*Aplikasi web akan berjalan di http://localhost:3000*

---

## 🧪 Menjalankan Pengujian (Testing)

### Unit Test (Frontend)
Untuk menjalankan semua unit test dan melihat laporan coverage:
```bash
npm run test:unit
```

### E2E Test (Playwright)
Untuk menjalankan pengujian alur pengguna secara visual:
```bash
npm run test:e2e:ui
```

---

## 💡 Perintah Penting (Cheat Sheet)
| Lokasi | Perintah | Fungsi |
| :--- | :--- | :--- |
| Backend | `npm run seed` | Mengisi database dengan data awal |
| Backend | `npx drizzle-kit studio` | Membuka database manager di browser |
| Webapp | `npm run lint` | Mengecek kesalahan penulisan kode |
| Webapp | `test:unit` | Menjalankan pengujian UI |

---

## 🧪 Pengujian (Testing)
Aplikasi ini menggunakan **Jest** dan **React Testing Library** untuk unit testing.

1.  **Menjalankan Unit Test**:
    ```bash
    cd idamantsl-webapp
    npm test
    ```
2.  **Menjalankan E2E Test (Playwright)**:
    ```bash
    cd idamantsl-webapp
    npm run test:e2e
    ```

---

## 📄 Ekspor Laporan
Untuk fitur ekspor PDF, proyek menggunakan `jspdf` dan `jspdf-autotable`. Pastikan untuk menggunakan komponen `ExportPreviewModal` untuk konsistensi tampilan laporan A4 di modul baru.

---

## 💬 Bantuan & Kontribusi
Jika menemui kendala, silakan hubungi tim pengembang atau buka *issue* di repositori proyek.
 🌿
