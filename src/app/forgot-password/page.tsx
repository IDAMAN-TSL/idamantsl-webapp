"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import LogoIcon from "../../assets/icon/Logo.svg";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-sans">
      <div className="w-full max-w-[400px] p-8 md:px-10 md:py-10 mx-4 rounded-3xl bg-[#F2F4EC] shadow-[0_4px_25px_rgba(0,0,0,0.08)] border border-[#E8EAE2]">
        
        {/* Logo Container */}
        <div className="flex justify-center mb-5">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-[#EFEFEF]">
            <Image src={LogoIcon} alt="Logo BBKSDA JABAR" width={64} height={76} className="w-10 h-10 object-contain drop-shadow-sm" priority />
          </div>
        </div>

        {/* Titles */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-base font-bold text-black tracking-wide">IDAMAN TSL Jawa Barat</h1>
          <div className="space-y-1">
            <h2 className="text-[1.1rem] font-bold text-black">Lupa Kata Sandi?</h2>
            <p className="text-black/80 text-sm font-medium">Atur ulang kata sandi Anda</p>
          </div>
        </div>

        {/* Step 1: Email Request */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-black">Alamat Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-black" strokeWidth={2} />
                </div>
                <input 
                  type="email" 
                  placeholder="bbksda@gmail.com" 
                  className="w-full bg-[#fcfdfa] border border-[#dce3d5] shadow-sm rounded-xl py-3 pl-11 pr-4 text-black placeholder-black/60 focus:outline-none focus:ring-1 focus:ring-[#446B2F] focus:border-[#446B2F] transition-all text-[0.95rem] font-medium"
                />
              </div>
            </div>

            <div className="pt-2 space-y-5">
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-[#567139] hover:bg-[#446B2F] text-white font-bold rounded-xl py-3 transition-all shadow-md active:scale-[0.98] text-[0.95rem]"
              >
                Dapatkan Kode Verifikasi
              </button>
              <div className="text-center">
                <Link href="/login" className="text-[0.95rem] font-bold text-[#567139] hover:text-[#345224] transition-colors">Batal</Link>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: OTP Entry */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-black">Kode Verifikasi</label>
              <div className="flex justify-between gap-1.5">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    // @ts-ignore
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-[2.8rem] h-[3rem] text-center text-lg font-bold bg-[#fcfdfa] border border-[#dce3d5] rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-[#446B2F] focus:border-[#446B2F] transition-all text-black"
                  />
                ))}
              </div>
            </div>

            <div className="pt-3 space-y-5">
              <button 
                onClick={() => setStep(3)}
                className="w-full bg-[#567139] hover:bg-[#446B2F] text-white font-bold rounded-xl py-3 transition-all shadow-md active:scale-[0.98] text-[0.95rem]"
              >
                Verifikasi
              </button>
              
              <div className="flex flex-col items-center space-y-4">
                 <button className="text-xs font-bold text-[#567139] hover:text-[#345224] transition-colors">
                   Kirim ulang kode verifikasi
                 </button>
                 <button 
                   onClick={() => setStep(1)}
                   className="text-xs font-bold text-[#567139] hover:text-[#345224] transition-colors"
                 >
                   Kembali
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-black">Kata Sandi Baru</label>
              <div className="relative block">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-black" strokeWidth={2} />
                </div>
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  placeholder="**********" 
                  className="w-full bg-[#fcfdfa] border border-[#dce3d5] shadow-sm rounded-xl py-3 pl-11 pr-11 text-black placeholder-black/60 focus:outline-none focus:ring-1 focus:ring-[#446B2F] focus:border-[#446B2F] transition-all text-[0.95rem] font-medium"
                />
                <button 
                  type="button" 
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-black"
                >
                  {showNewPassword ? <Eye className="h-5 w-5" strokeWidth={1.5} /> : <EyeOff className="h-5 w-5" strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-black">Verifikasi Kata Sandi Baru</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-black" strokeWidth={2} />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="**********" 
                  className="w-full bg-[#fcfdfa] border border-[#dce3d5] shadow-sm rounded-xl py-3 pl-11 pr-11 text-black placeholder-black/60 focus:outline-none focus:ring-1 focus:ring-[#446B2F] focus:border-[#446B2F] transition-all text-[0.95rem] font-medium"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-black"
                >
                  {showConfirmPassword ? <Eye className="h-5 w-5" strokeWidth={1.5} /> : <EyeOff className="h-5 w-5" strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <div className="pt-5 space-y-4">
              <button 
                onClick={() => alert("Kata Sandi telah diperbarui!")}
                className="w-full bg-[#567139] hover:bg-[#446B2F] text-white font-bold rounded-xl py-3 transition-all shadow-md active:scale-[0.98] text-[0.95rem]"
              >
                Simpan
              </button>
              <div className="text-center mt-2">
                <button 
                   onClick={() => setStep(2)}
                   className="text-[0.95rem] font-bold text-[#567139] hover:text-[#345224] transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
