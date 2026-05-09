# SOP: Setup Project Frontend IDAMAN TSL

Panduan lengkap untuk setup dan memulai project frontend (Next.js + React) dari awal.

---

## 📋 Daftar Isi

1. [Prasyarat Sistem](#prasyarat-sistem)
2. [Instalasi Dependencies](#instalasi-dependencies)
3. [Konfigurasi Environment](#konfigurasi-environment)
4. [Menjalankan Development Server](#menjalankan-development-server)
5. [Perintah Build & Production](#perintah-build--production)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Prasyarat Sistem

Pastikan semua tools berikut sudah terinstall di sistem Anda:

### 1. **Node.js & npm**
   - **Minimum**: Node.js v18.x, npm v9.x
   - **Rekomendasi**: Node.js v20.x LTS atau lebih baru
   
   **Cek versi yang terinstall:**
   ```bash
   node --version
   npm --version
   ```

   **Instalasi Node.js:**
   - Download dari [nodejs.org](https://nodejs.org)
   - Atau gunakan NVM (Node Version Manager) untuk manajemen versi

### 2. **Git**
   ```bash
   git --version
   ```

### 3. **Text Editor / IDE**
   - Rekomendasi: VS Code dengan extension:
     - ES7+ React/Redux/React-Native snippets
     - Tailwind CSS IntelliSense
     - ESLint
     - Prettier

### 4. **Backend Server**
   - Backend IDAMAN TSL harus berjalan di `http://localhost:5001`
   - Lihat SOP Backend untuk setup: `/idamantsl-backend/SOP_SETUP.md` (jika ada)

---

## 📦 Instalasi Dependencies

### Langkah 1: Clone Repository (Jika belum)
```bash
cd D:\IDAMANTSL
git clone <repository-url>
# atau jika sudah ada
cd idamantsl-webapp
```

### Langkah 2: Navigasi ke Folder Frontend
```bash
cd idamantsl-webapp
```

### Langkah 3: Instalasi Dependencies
```bash
npm install
```

**Dependencies yang akan diinstall:**

#### Production Dependencies:
- **next** (16.2.1) - React framework
- **react** (19.2.4) - UI library
- **react-dom** (19.2.4) - DOM rendering
- **tailwindcss** (4.x) - CSS framework
- **lucide-react** - Icon library
- **recharts** - Chart library
- **jspdf** & **jspdf-autotable** - PDF generation

#### Development Dependencies:
- **TypeScript** (5.x) - Type safety
- **ESLint** (9.x) - Code linting
- **Jest** (30.x) - Testing framework
- **Playwright** (1.59.x) - E2E testing
- **Tailwind CSS PostCSS** - CSS processing
- Testing libraries: @testing-library/*

**Durasi instalasi:** ~2-5 menit (tergantung kecepatan internet)

---

## ⚙️ Konfigurasi Environment

### Langkah 1: Buat File `.env.local`
Di root folder `idamantsl-webapp`, buat file `.env.local`:

```bash
cp .env.example .env.local  # Jika ada template
# atau buat manual
touch .env.local
```

### Langkah 2: Isi Variabel Environment
Buka `.env.local` dan tambahkan:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5001

# Aplikasi Port (default)
# NEXT_PUBLIC_APP_PORT=3000

# Jika diperlukan auth token atau config lainnya
# NEXT_PUBLIC_AUTH_PROVIDER=jwt
```

### Variabel yang Tersedia:
| Variabel | Nilai Default | Deskripsi |
|----------|---------------|-----------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5001` | URL backend API |

**Catatan:** 
- Variabel dengan prefix `NEXT_PUBLIC_` bisa diakses di frontend
- Jangan commit `.env.local` ke git (gunakan `.env.local` di `.gitignore`)

---

## 🚀 Menjalankan Development Server

### Langkah 1: Pastikan Backend Berjalan
```bash
# Di terminal terpisah, jalankan backend
cd idamantsl-backend
npm run dev
# Backend akan berjalan di http://localhost:5001
```

### Langkah 2: Jalankan Frontend Dev Server
```bash
# Di folder idamantsl-webapp
npm run dev
```

**Output yang diharapkan:**
```
> idaman-tsl@0.1.0 dev
> next dev

  ▲ Next.js 16.2.1
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

### Langkah 3: Akses Aplikasi
Buka browser dan kunjungi:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5001

**Fitur Development:**
- ✅ Hot Module Reload (HMR) - auto-refresh saat edit file
- ✅ React Fast Refresh
- ✅ TypeScript checking

---

## 🏗️ Perintah Build & Production

### Build Untuk Production
```bash
npm run build
```

**Output yang diharapkan:**
```
  ▲ Next.js 16.2.1
  - Compiled successfully
  - Optimized package (gzip): XX KB
```

### Jalankan Production Build Secara Lokal
```bash
npm run start
```

Akses di http://localhost:3000

---

## 🧪 Testing

### Unit Tests
```bash
# Jalankan semua unit tests
npm run test:unit

# Watch mode (auto-run saat file berubah)
npm run test:watch
```

**Test files location:** `test/unit/` atau `__tests__/`

### E2E Tests (Playwright)
```bash
# Jalankan E2E tests headless
npm run test:e2e

# Jalankan E2E tests dengan UI
npm run test:e2e:ui
```

**Test files location:** `test_bb/` atau `e2e/`

### Coverage Report
Coverage report akan tersimpan di `test/report/` setelah menjalankan unit tests.

---

## 🔍 Linting & Format Code

### Jalankan ESLint
```bash
npm run lint
```

### Fix Issues Otomatis
```bash
npm run lint -- --fix
```

---

## 📁 Struktur Project

```
idamantsl-webapp/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Main layout
│   │   ├── page.tsx      # Home page
│   │   └── [module]/     # Module pages (referensi-tsl, penangkaran, dll)
│   ├── components/       # Reusable components
│   │   └── [module]/     # Components per module
│   └── assets/           # Static assets (images, icons)
├── test/
│   ├── unit/            # Unit tests
│   └── report/          # Coverage report
├── test_bb/             # E2E tests (Playwright)
├── public/              # Static files
├── .env.local           # Environment variables (local)
├── next.config.ts       # Next.js config
├── tsconfig.json        # TypeScript config
├── tailwind.config.ts   # Tailwind CSS config
├── jest.config.js       # Jest config
├── playwright.config.ts # Playwright config
└── package.json         # Dependencies & scripts
```

---

## ⚠️ Troubleshooting

### ❌ Error: "NEXT_PUBLIC_API_URL not found"
**Solusi:**
- Pastikan file `.env.local` sudah dibuat
- Restart dev server setelah membuat `.env.local`
- Gunakan value default: `http://localhost:5001`

```bash
npm run dev  # Restart
```

### ❌ Error: "Port 3000 already in use"
**Solusi:**
```bash
# Gunakan port berbeda
npm run dev -- -p 3001
```

### ❌ Error: "Backend 500 Internal Server Error"
**Solusi:**
- Pastikan backend sudah dijalankan di `http://localhost:5001`
- Check backend logs untuk error details
- Pastikan database sudah terkoneksi dengan benar

### ❌ Error: "Module not found"
**Solusi:**
```bash
# Clear cache dan reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

### ❌ Error: "TypeScript compilation errors"
**Solusi:**
```bash
# Check tipe errors
npx tsc --noEmit

# Fix ESLint issues
npm run lint -- --fix
```

### ❌ Halaman tidak update saat edit file
**Solusi:**
- Pastikan dev server masih berjalan
- Check apakah ada error di console
- Coba refresh browser (Ctrl+Shift+R untuk hard refresh)

---

## 📝 Checklist Setup

Pastikan semua poin ini sudah dilakukan:

- [ ] Node.js v18+ dan npm v9+ sudah terinstall
- [ ] Project sudah di-clone atau sudah ada di `D:\IDAMANTSL\idamantsl-webapp`
- [ ] Folder `.git` ada (untuk version control)
- [ ] File `.env.local` sudah dibuat dengan config yang benar
- [ ] `npm install` sudah dijalankan (folder `node_modules` ada)
- [ ] Backend sudah berjalan di `http://localhost:5001`
- [ ] `npm run dev` berjalan tanpa error
- [ ] Browser bisa akses `http://localhost:3000`
- [ ] Bisa login dan akses dashboard
- [ ] Hot Module Reload (HMR) berfungsi saat edit file

---

## 🔗 Referensi Tambahan

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [Playwright Testing](https://playwright.dev/docs/intro)

---

## 📞 Support & Issues

Jika menghadapi masalah:

1. **Check log:**
   - Browser DevTools (F12) → Console tab
   - Terminal output saat dev server berjalan

2. **Ask team:**
   - Share error message lengkap
   - Cantumkan OS & versi Node.js
   - Cantumkan langkah-langkah yang sudah dicoba

3. **Common Resources:**
   - Check `notes/` folder untuk dokumentasi project-specific
   - Check `AGENTS.md` atau `CLAUDE.md` untuk AI agent config

---

## 📅 Last Updated
**May 8, 2026**

**Version:** 1.0

**Maintainer:** Development Team
