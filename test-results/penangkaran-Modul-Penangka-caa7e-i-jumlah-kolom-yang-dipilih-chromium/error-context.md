# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: penangkaran.spec.ts >> Modul Penangkaran (Blackbox) >> pilih semua kolom harus memperbarui jumlah kolom yang dipilih
- Location: test_bb\penangkaran.spec.ts:79:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.check: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('label:has-text("Pilih semua kolom") input[type="checkbox"]')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [active]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - navigation [ref=e7]:
            - button "previous" [disabled] [ref=e8]:
              - img "previous" [ref=e9]
            - generic [ref=e11]:
              - generic [ref=e12]: 1/
              - text: "1"
            - button "next" [disabled] [ref=e13]:
              - img "next" [ref=e14]
          - img
        - generic [ref=e16]:
          - link "Next.js 16.2.1 (stale) Turbopack" [ref=e17] [cursor=pointer]:
            - /url: https://nextjs.org/docs/messages/version-staleness
            - img [ref=e18]
            - generic "There is a newer version (16.2.4) available, upgrade recommended!" [ref=e20]: Next.js 16.2.1 (stale)
            - generic [ref=e21]: Turbopack
          - img
      - dialog "Runtime TypeError" [ref=e23]:
        - generic [ref=e26]:
          - generic [ref=e27]:
            - generic [ref=e28]:
              - generic [ref=e30]: Runtime TypeError
              - generic [ref=e31]:
                - button "Copy Error Info" [ref=e32] [cursor=pointer]:
                  - img [ref=e33]
                - button "No related documentation found" [disabled] [ref=e35]:
                  - img [ref=e36]
                - button "Attach Node.js inspector" [ref=e38] [cursor=pointer]:
                  - img [ref=e39]
            - generic [ref=e48]: column.accessor is not a function
          - generic [ref=e49]:
            - generic [ref=e50]:
              - paragraph [ref=e52]:
                - img [ref=e54]
                - generic [ref=e57]: src/app/penangkaran/page.tsx (451:37) @ <unknown>
                - button "Open in editor" [ref=e58] [cursor=pointer]:
                  - img [ref=e60]
              - generic [ref=e63]:
                - generic [ref=e64]: "449 | {tableColumns.map((column) => ("
                - generic [ref=e65]: "450 | <td key={column.label} className=\"border border-gray-100 px-2 py-3 text-gray-700\">"
                - generic [ref=e66]: "> 451 | {column.accessor(row)}"
                - generic [ref=e67]: "| ^"
                - generic [ref=e68]: 452 | </td>
                - generic [ref=e69]: "453 | ))}"
                - generic [ref=e70]: 454 | <td className="border border-gray-100 px-2 py-3 text-center">
            - generic [ref=e71]:
              - generic [ref=e72]:
                - paragraph [ref=e73]:
                  - text: Call Stack
                  - generic [ref=e74]: "17"
                - button "Show 12 ignore-listed frame(s)" [ref=e75] [cursor=pointer]:
                  - text: Show 12 ignore-listed frame(s)
                  - img [ref=e76]
              - generic [ref=e78]:
                - generic [ref=e79]:
                  - text: <unknown>
                  - button "Open <unknown> in editor" [ref=e80] [cursor=pointer]:
                    - img [ref=e81]
                - text: src/app/penangkaran/page.tsx (451:37)
              - generic [ref=e83]:
                - generic [ref=e84]: Array.map
                - text: <anonymous>
              - generic [ref=e85]:
                - generic [ref=e86]:
                  - text: <unknown>
                  - button "Open <unknown> in editor" [ref=e87] [cursor=pointer]:
                    - img [ref=e88]
                - text: src/app/penangkaran/page.tsx (449:39)
              - generic [ref=e90]:
                - generic [ref=e91]: Array.map
                - text: <anonymous>
              - generic [ref=e92]:
                - generic [ref=e93]:
                  - text: PenangkaranPage
                  - button "Open PenangkaranPage in editor" [ref=e94] [cursor=pointer]:
                    - img [ref=e95]
                - text: src/app/penangkaran/page.tsx (434:31)
        - generic [ref=e97]: "1"
        - generic [ref=e98]: "2"
    - generic [ref=e103] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e104]:
        - img [ref=e105]
      - generic [ref=e108]:
        - button "Open issues overlay" [ref=e109]:
          - generic [ref=e110]:
            - generic [ref=e111]: "0"
            - generic [ref=e112]: "1"
          - generic [ref=e113]: Issue
        - button "Collapse issues badge" [ref=e114]:
          - img [ref=e115]
  - generic [ref=e118]:
    - img [ref=e119]
    - heading "This page couldn’t load" [level=1] [ref=e121]
    - paragraph [ref=e122]: Reload to try again, or go back.
    - generic [ref=e123]:
      - button "Reload" [ref=e125] [cursor=pointer]
      - button "Back" [ref=e126] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Modul Penangkaran (Blackbox)', () => {
  4   |   
  5   |   test.beforeEach(async ({ page }) => {
  6   |     // Mock Login Session
  7   |     await page.goto('/login');
  8   |     await page.evaluate(() => {
  9   |       localStorage.setItem('token', 'mock-jwt-token');
  10  |       localStorage.setItem('user', JSON.stringify({ id: 1, email: 'admin@bbksda-jabar.id', role: 'admin_pusat' }));
  11  |     });
  12  | 
  13  |     // Mock API Penangkaran
  14  |     await page.route('**/api/penangkaran*', async (route) => {
  15  |       await route.fulfill({
  16  |         status: 200,
  17  |         contentType: 'application/json',
  18  |         body: JSON.stringify({
  19  |           success: true,
  20  |           data: [
  21  |             {
  22  |               id: 1,
  23  |               namaPenangkaran: 'Penangkaran Gajah Lampung',
  24  |               nomorSk: 'SK-ELEPHANT-001',
  25  |               tanggalSk: '2024-01-01',
  26  |               akhirMasaBerlaku: '2027-01-01',
  27  |               penerbit: 'BKSDA',
  28  |               namaDirektur: 'Indra Gajah',
  29  |               nomorTelepon: '0812345678',
  30  |               statusVerifikasi: 'disetujui',
  31  |               bidangWilayah: { namaWilayah: 'Wilayah I' },
  32  |               seksiWilayah: { namaWilayah: 'Seksi A' },
  33  |               tsl: { namaTsl: 'Gajah Sumatera' }
  34  |             }
  35  |           ]
  36  |         }),
  37  |       });
  38  |     });
  39  |   });
  40  | 
  41  |   test('harus menampilkan data penangkaran di tabel', async ({ page }) => {
  42  |     await page.goto('/penangkaran');
  43  |     await expect(page.locator('table')).toContainText('Penangkaran Gajah Lampung', { timeout: 10000 });
  44  |   });
  45  | 
  46  |   test('fitur pencarian harus menyaring data secara visual', async ({ page }) => {
  47  |     await page.goto('/penangkaran');
  48  |     
  49  |     // Klik filter untuk memunculkan input cari
  50  |     await page.getByRole('button', { name: /Filter & Urutkan/i }).click();
  51  |     
  52  |     const searchInput = page.getByPlaceholder(/Cari unit penangkar/i);
  53  |     await expect(searchInput).toBeVisible();
  54  |     
  55  |     await searchInput.fill('Harimau');
  56  |     await expect(page.locator('table')).not.toContainText('Penangkaran Gajah Lampung');
  57  |     await expect(page.locator('text=Tidak ada data penangkaran')).toBeVisible();
  58  | 
  59  |     await searchInput.clear();
  60  |     await searchInput.fill('Gajah');
  61  |     await expect(page.locator('table')).toContainText('Penangkaran Gajah Lampung');
  62  |   });
  63  | 
  64  |   test('fitur ekspor data (PDF) harus membuka modal pratinjau', async ({ page }) => {
  65  |     await page.goto('/penangkaran');
  66  |     
  67  |     // Gunakan getByRole agar lebih akurat menargetkan tombol
  68  |     await page.getByRole('button', { name: /^Unduh$/i }).click();
  69  | 
  70  |     // Tunggu modal muncul
  71  |     const modal = page.locator('h3:has-text("Pratinjau Cetak")');
  72  |     await expect(modal).toBeVisible({ timeout: 5000 });
  73  |     
  74  |     await page.getByRole('button', { name: /Cetak PDF/i }).click();
  75  |     await page.getByRole('button', { name: /Batal/i }).click();
  76  |     await expect(modal).not.toBeVisible();
  77  |   });
  78  | 
  79  |   test('pilih semua kolom harus memperbarui jumlah kolom yang dipilih', async ({ page }) => {
  80  |     await page.goto('/penangkaran');
  81  | 
  82  |     // Klik checkbox "Pilih semua kolom"
  83  |     const selectAllCheckbox = page.locator('label:has-text("Pilih semua kolom") input[type="checkbox"]');
> 84  |     await selectAllCheckbox.check();
      |                             ^ Error: locator.check: Test timeout of 30000ms exceeded.
  85  | 
  86  |     // Beri jeda kecil untuk state update
  87  |     await page.waitForTimeout(500);
  88  | 
  89  |     await page.getByRole('button', { name: /^Unduh$/i }).click();
  90  |     
  91  |     // Verifikasi teks di modal
  92  |     await expect(page.getByText(/16 kolom dipilih/i)).toBeVisible();
  93  |   });
  94  | 
  95  |   test('checkbox baris harus membatasi data yang diunduh', async ({ page }) => {
  96  |     await page.goto('/penangkaran');
  97  | 
  98  |     const firstRowCheckbox = page.locator('tbody tr').first().locator('input[type="checkbox"]');
  99  |     await firstRowCheckbox.check();
  100 | 
  101 |     await page.getByRole('button', { name: /^Unduh$/i }).click();
  102 | 
  103 |     await expect(page.getByText(/1 baris data/i)).toBeVisible();
  104 |   });
  105 | });
  106 | 
```