"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, EyeOff } from "lucide-react";
import LogoIcon from "../../assets/icon/Logo.svg";
import JunglePicture from "../../assets/picture/Gambar.jpg";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans">
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
          <Image src={LogoIcon} alt="Logo BBKSDA JABAR" width={64} height={76} className="w-auto h-16 object-contain drop-shadow-md" priority />
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
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-white mb-2">Alamat Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <input 
                type="email" 
                placeholder="bbksda@gmail.com" 
                className="w-full bg-white/10 border border-white/40 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/80 focus:outline-none focus:ring-1 focus:ring-white transition-all backdrop-blur-sm text-sm"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-bold text-white">Kata Sandi</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-white/90 hover:text-white transition-colors">Lupa Kata Sandi?</Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <input 
                type="password" 
                placeholder="**********" 
                className="w-full bg-white/10 border border-white/40 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-white/80 focus:outline-none focus:ring-1 focus:ring-white transition-all backdrop-blur-sm text-lg tracking-widest leading-none pt-4"
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <EyeOff className="h-5 w-5 text-white" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-[#446B2F] hover:bg-[#345224] text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-[0_4px_14px_0_rgba(68,107,47,0.39)] hover:shadow-[0_6px_20px_rgba(68,107,47,0.23)] active:scale-[0.98] text-[0.95rem]"
            >
              Masuk
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
