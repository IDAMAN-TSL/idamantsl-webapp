import { test, expect } from '@playwright/test';

test.describe('Autentikasi (Blackbox)', () => {
  
  test('harus menampilkan halaman login dengan benar', async ({ page }) => {
    await page.goto('/login');
    
    // Cek judul dan label
    await expect(page.locator('h2')).toContainText('Selamat Datang!');
    await expect(page.locator('label[for="email-input"]')).toContainText('Alamat Email');
    await expect(page.locator('label[for="password-input"]')).toContainText('Kata Sandi');
  });

  test('gagal login dengan kredensial yang salah', async ({ page }) => {
    await page.goto('/login');

    // Menggunakan ID yang baru ditambahkan
    await page.fill('#email-input', 'salah@email.com');
    await page.fill('#password-input', 'salah123');
    await page.click('button[type="submit"]');

    // Cek pesan error (Pesan ini muncul dari API/Frontend error handling)
    // Kita asumsikan API mengembalikan error dan ditampilkan di UI
    await expect(page.locator(String.raw`div.bg-red-500\/20`)).toBeVisible();
  });

  test('berhasil login dengan kredensial valid (Mocking API)', async ({ page }) => {
    // Mock API response agar tidak bergantung pada database asli
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            token: 'mock-jwt-token',
            user: { id: 1, email: 'admin@bbksda-jabar.id', role: 'admin_pusat' }
          }
        }),
      });
    });

    await page.goto('/login');

    await page.fill('#email-input', 'admin@bbksda-jabar.id');
    await page.fill('#password-input', 'admin123');
    await page.click('button[type="submit"]');

    // Harusnya diarahkan ke dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
