"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Mail, Lock, EyeOff, Eye, Loader2 } from "lucide-react";
import LogoIcon from "../../assets/icon/Logo.svg";
import JunglePicture from "../../assets/picture/Gambar.jpg";
import { LoginAlertModal } from "../../components/layout/LoginAlertModal";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [alertState, setAlertState] = useState<{isOpen: boolean; type: "success" | "error"}>({
    isOpen: false,
    type: "success"
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (alertState.isOpen && alertState.type === "success") {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [alertState.isOpen, alertState.type, router]);

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal login");
      }

      if (data.success) {
        // Simpan token di localStorage atau cookies
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        
        setAlertState({ isOpen: true, type: "success" });
      } else {
        throw new Error(data.message || "Gagal login");
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Terjadi kesalahan pada server");
      setAlertState({ isOpen: true, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
    if (alertState.type === "success") {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
      <LoginAlertModal 
        isOpen={alertState.isOpen} 
        type={alertState.type} 
        onClose={handleCloseAlert} 
      />
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={JunglePicture}
          alt="Jungle Background" 
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        {/* Dark gradient overlay for better readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[480px] p-8 md:p-10 mx-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/30 shadow-2xl">
        
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 p-2 w-[84px] h-[84px]">
            <Image src={LogoIcon} alt="Logo BBKSDA JABAR" width={64} height={64} className="w-full h-full object-contain drop-shadow-sm" priority />
          </div>
        </div>

        {/* Titles */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-[1.35rem] font-bold text-white tracking-wide">IDAMAN TSL Jawa Barat</h1>
          <div className="mt-5 space-y-1">
            <h2 className="text-[1.35rem] font-bold text-white">Selamat Datang!</h2>
            <p className="text-white/90 text-sm font-medium">Masuk untuk mengakses dashboard Anda</p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          
          {/* Email field */}
          <div className="space-y-1.5">
            <label htmlFor="email-input" className="block text-sm font-bold text-white mb-2">Alamat Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <input 
                id="email-input"
                type="email" 
                placeholder="bbksda@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/40 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/80 focus:outline-none focus:ring-1 focus:ring-white transition-all backdrop-blur-sm text-sm"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-end mb-2">
              <label htmlFor="password-input" className="block text-sm font-bold text-white">Kata Sandi</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-white/90 hover:text-white transition-colors">Lupa Kata Sandi?</Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <input 
                id="password-input"
                type={showPassword ? "text" : "password"} 
                placeholder="**********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full bg-white/10 border border-white/40 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-white/80 focus:outline-none focus:ring-1 focus:ring-white transition-all backdrop-blur-sm text-lg ${showPassword ? 'text-sm' : 'tracking-widest leading-none pt-4'}`}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5 text-white" strokeWidth={2} />
                ) : (
                  <EyeOff className="h-5 w-5 text-white" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-[#446B2F] hover:bg-[#345224] disabled:bg-[#446b2f]/70 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-[0_4px_14x_0_rgba(68,107,47,0.39)] hover:shadow-[0_6px_20px_rgba(68,107,47,0.23)] active:scale-[0.98] text-[0.95rem]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </div>
        </form>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm font-bold text-white/90 hover:text-white transition-colors">Kembali</Link>
        </div>
      </div>
    </div>
  );
}
