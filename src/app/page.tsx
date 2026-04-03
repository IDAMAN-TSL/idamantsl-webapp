import Image from "next/image";
import Link from "next/link";
import LogoIcon from "../assets/icon/Logo.svg";
import JunglePicture from "../assets/picture/Gambar.jpg";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Navigation */}
      <nav className="w-full bg-white border-b border-gray-100 px-6 sm:px-12 py-4 flex items-center justify-between sticky top-0 z-50">
        {/* Nav Left - Logo & Title */}
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center justify-center rounded-[14px] shadow-sm p-1.5 w-[56px] h-[56px] bg-gradient-to-br from-[#FAFCF5] to-[#E2ECD4] border border-[#f0f4e9]"
          >
            <Image src={LogoIcon} alt="Logo BBKSDA JABAR" width={44} height={44} className="w-full h-full object-contain" priority />
          </div>
          <span className="font-extrabold text-[#111111] tracking-tight text-xl">IDAMAN TSL</span>
        </div>
        
        {/* Nav Right - Button */}
        <Link href="/login" className="bg-[#446B2F] hover:bg-[#345224] text-white font-bold px-7 py-2.5 rounded-xl text-[0.95rem] transition-all shadow-[0_4px_10px_0_rgba(68,107,47,0.3)] hover:shadow-[0_6px_15px_rgba(68,107,47,0.2)]">
          Masuk
        </Link>
      </nav>

      {/* Main Hero Section */}
      <main className="flex-grow flex items-center justify-center bg-white relative overflow-hidden">
         {/* Subtle background blob for warmth */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#446B2F]/5 to-transparent rounded-full blur-[100px] -z-10" />

        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 w-full">
          
          {/* Left Text Content */}
          <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left z-10 max-w-2xl mx-auto lg:mx-0">
            {/* Badge */}
            <div className="inline-block bg-[#f3f6ee] text-[#446B2F] px-6 py-3 rounded-full font-bold text-sm md:text-[0.95rem] shadow-sm border border-[#e1ead7]">
              Balai Besar Konservasi Sumber Daya Alam Jawa Barat
            </div>

            {/* Headline */}
            <h1 className="text-[2.75rem] md:text-6xl font-extrabold text-[#111111] leading-[1.15] tracking-tight">
              Sistem Informasi Data <br className="hidden lg:block"/>
              Pemanfaatan <span className="text-[#446B2F]">Tumbuhan &amp;</span><br className="hidden md:block"/>
              {" "}<span className="text-[#446B2F]">Satwa Liar</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-gray-600 text-[1.1rem] md:text-[1.15rem] max-w-2xl mx-auto lg:mx-0 leading-[1.7] font-medium">
              Portal resmi pengelolaan, verifikasi, dan pemantauan data tumbuhan dan
              satwa liar di wilayah Jawa Barat yang terstruktur, terintegrasi, dan efisien untuk
              keberlanjutan ekosistem.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Link href="/login" className="inline-block bg-[#446B2F] hover:bg-[#345224] text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-[0_6px_20px_0_rgba(68,107,47,0.35)] hover:shadow-[0_8px_25px_rgba(68,107,47,0.25)] hover:-translate-y-0.5 text-[1.05rem]">
                Masuk
              </Link>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="flex-1 w-full max-w-2xl lg:max-w-none relative mt-8 lg:mt-0 z-10">
            <div className="relative rounded-[2rem] p-3 md:p-3.5 bg-[#f4f7ed] border border-[#dce6d0] shadow-[0_20px_60px_-15px_rgba(68,107,47,0.25)]">
              <div className="relative w-full aspect-[16/10] md:aspect-[4/2.5] rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                <Image 
                  src={JunglePicture}
                  alt="Jungle Landscape" 
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
