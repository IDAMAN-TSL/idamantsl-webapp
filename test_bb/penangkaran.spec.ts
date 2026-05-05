import { test, expect } from '@playwright/test';

test.describe('Modul Penangkaran (Blackbox)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mock Login Session
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'admin@bbksda-jabar.id', role: 'admin_pusat' }));
    });

    // Mock API Penangkaran
    await page.route('**/api/penangkaran*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 1,
              namaPenangkaran: 'Penangkaran Gajah Lampung',
              nomorSk: 'SK-ELEPHANT-001',
              tanggalSk: '2024-01-01',
              akhirMasaBerlaku: '2027-01-01',
              penerbit: 'BKSDA',
              namaDirektur: 'Indra Gajah',
              nomorTelepon: '0812345678',
              statusVerifikasi: 'disetujui',
              bidangWilayah: { namaWilayah: 'Wilayah I' },
              seksiWilayah: { namaWilayah: 'Seksi A' },
              tsl: { namaTsl: 'Gajah Sumatera' }
            }
          ]
        }),
      });
    });
  });

  test('harus menampilkan data penangkaran di tabel', async ({ page }) => {
    await page.goto('/penangkaran');
    await expect(page.locator('table')).toContainText('Penangkaran Gajah Lampung', { timeout: 10000 });
  });

  test('fitur pencarian harus menyaring data secara visual', async ({ page }) => {
    await page.goto('/penangkaran');
    
    // Klik filter untuk memunculkan input cari
    await page.getByRole('button', { name: /Filter & Urutkan/i }).click();
    
    const searchInput = page.getByPlaceholder(/Cari unit penangkar/i);
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('Harimau');
    await expect(page.locator('table')).not.toContainText('Penangkaran Gajah Lampung');
    await expect(page.locator('text=Tidak ada data penangkaran')).toBeVisible();

    await searchInput.clear();
    await searchInput.fill('Gajah');
    await expect(page.locator('table')).toContainText('Penangkaran Gajah Lampung');
  });

  test('fitur ekspor data (PDF) harus membuka modal pratinjau', async ({ page }) => {
    await page.goto('/penangkaran');
    
    // Gunakan getByRole agar lebih akurat menargetkan tombol
    await page.getByRole('button', { name: /^Unduh$/i }).click();

    // Tunggu modal muncul
    const modal = page.locator('h3:has-text("Pratinjau Cetak")');
    await expect(modal).toBeVisible({ timeout: 5000 });
    
    await page.getByRole('button', { name: /Cetak PDF/i }).click();
    await page.getByRole('button', { name: /Batal/i }).click();
    await expect(modal).not.toBeVisible();
  });

  test('pilih semua kolom harus memperbarui jumlah kolom yang dipilih', async ({ page }) => {
    await page.goto('/penangkaran');

    // Klik checkbox "Pilih semua kolom"
    const selectAllCheckbox = page.locator('label:has-text("Pilih semua kolom") input[type="checkbox"]');
    await selectAllCheckbox.check();

    // Beri jeda kecil untuk state update
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: /^Unduh$/i }).click();
    
    // Verifikasi teks di modal
    await expect(page.getByText(/16 kolom dipilih/i)).toBeVisible();
  });

  test('checkbox baris harus membatasi data yang diunduh', async ({ page }) => {
    await page.goto('/penangkaran');

    const firstRowCheckbox = page.locator('tbody tr').first().locator('input[type="checkbox"]');
    await firstRowCheckbox.check();

    await page.getByRole('button', { name: /^Unduh$/i }).click();

    await expect(page.getByText(/1 baris data/i)).toBeVisible();
  });
});
