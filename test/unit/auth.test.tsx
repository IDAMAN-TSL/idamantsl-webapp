import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../src/app/login/page';
import { useRouter } from 'next/navigation';

// Mocking useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage Component (Auth Unit Test)', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    // Mock fetch
    globalThis.fetch = jest.fn();

    // Mock localStorage
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  test('merender halaman login dengan benar', () => {
    render(<LoginPage />);
    expect(screen.getByText('Selamat Datang!')).toBeInTheDocument();
    expect(screen.getByLabelText(/Alamat Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kata Sandi/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Masuk/i })).toBeInTheDocument();
  });

  test('menampilkan pesan error jika login gagal', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, message: 'Email atau password salah' }),
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Alamat Email/i), { target: { value: 'salah@email.com' } });
    fireEvent.change(screen.getByLabelText(/Kata Sandi/i), { target: { value: 'salah' } });
    fireEvent.click(screen.getByRole('button', { name: /Masuk/i }));

    await waitFor(() => {
      expect(screen.getByText('Email atau password salah')).toBeInTheDocument();
    });
    
    expect(globalThis.localStorage.setItem).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('berhasil login dan diarahkan ke dashboard', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: { id: 1, email: 'admin@bbksda-jabar.id', role: 'admin_pusat' }
        }
      }),
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Alamat Email/i), { target: { value: 'admin@bbksda-jabar.id' } });
    fireEvent.change(screen.getByLabelText(/Kata Sandi/i), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /Masuk/i }));

    await waitFor(() => {
      expect(globalThis.localStorage.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
    });

    expect(globalThis.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ id: 1, email: 'admin@bbksda-jabar.id', role: 'admin_pusat' }));
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  test('fitur show/hide password bekerja', () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByLabelText(/Kata Sandi/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const buttons = screen.getAllByRole('button');
    const toggleButton = buttons.find(b => b.getAttribute('type') === 'button');
    
    if (toggleButton) {
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });
});
