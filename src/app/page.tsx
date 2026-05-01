"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoIcon from "../assets/icon/Logo.svg";
import JunglePicture from "../assets/picture/Gambar.jpg";

const primaryNav = [
  { label: "BERANDA", href: "#beranda", sectionId: "beranda" },
  { label: "LAYANAN", href: "#layanan", sectionId: "layanan" },
  { label: "KONTAK", href: "#kontak", sectionId: "kontak" },
];

const serviceCards = [
  {
    title: "Kelola TSL",
    description:
      "Manajemen database inventarisasi tumbuhan dan satwa liar secara sistematis dengan standar data nasional.",
    icon: "database",
  },
  {
    title: "Verifikasi Data",
    description:
      "Proses validasi data yang akurat dan transparan untuk memastikan kepatuhan terhadap regulasi perlindungan TSL.",
    icon: "shield-check",
  },
  {
    title: "Monitoring",
    description:
      "Pemantauan real-time terhadap sebaran dan pemanfaatan TSL di lapangan untuk pengambilan keputusan yang cepat.",
    icon: "chart-line",
  },
];

const supportLogos = [
  {
    src: "/Logo_Kementerian_Kehutanan_RI.png",
    alt: "Kementerian Kehutanan Republik Indonesia",
    width: 124,
    height: 124,
  },
  {
    src: "/Logo_BBKSDA_JABAR_2.png",
    alt: "BBKSDA Jawa Barat",
    width: 120,
    height: 120,
  },
  {
    src: "/Logo_Telkom_University.png",
    alt: "Telkom University",
    width: 128,
    height: 128,
  },
];

const footerLinks = {
  sosial: ["Facebook", "Youtube", "Instagram"],
  bantuan: ["FAQ", "Panduan", "Kontak Kami"],
};

function ServiceIcon({ icon }: Readonly<{ icon: string }>) {
  if (icon === "database") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-[#6d7f53]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="12" cy="5" rx="7" ry="3" />
        <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
        <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
      </svg>
    );
  }

  if (icon === "shield-check") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-[#6d7f53]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3 4 6v6c0 4.4 2.9 8.4 8 9 5.1-.6 8-4.6 8-9V6l-8-3Z" />
        <path d="m9.2 12.1 1.9 1.9 3.9-4" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#6d7f53]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M7 15l3-3 3 2 5-6" />
      <path d="M18 8h-3" />
    </svg>
  );
}

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("beranda");

  useEffect(() => {
    const visibleSections = ["beranda", "layanan", "kontak"];
    const sectionElements = visibleSections
      .map((sectionId) => document.getElementById(sectionId))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (!visibleEntries.length) {
          return;
        }

        const topMostEntry = visibleEntries.reduce((currentTop, entry) => {
          if (!currentTop || entry.boundingClientRect.top < currentTop.boundingClientRect.top) {
            return entry;
          }

          return currentTop;
        }, visibleEntries[0]);

        if (topMostEntry?.target.id) {
          setActiveSection(topMostEntry.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-22% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.4, 0.6, 0.8],
      }
    );

    sectionElements.forEach((element) => observer.observe(element));

    const syncFromHash = () => {
      const currentHash = globalThis.location.hash.replace("#", "");
      if (visibleSections.includes(currentHash)) {
        setActiveSection(currentHash);
      }
    };

    syncFromHash();
    globalThis.addEventListener("hashchange", syncFromHash);

    return () => {
      observer.disconnect();
      globalThis.removeEventListener("hashchange", syncFromHash);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f4f2] font-sans text-[#181818]">
      <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-[13px] border border-[#edf1e2] bg-linear-to-br from-[#fbfcf8] to-[#e4edd1] p-1 shadow-[0_8px_18px_rgba(38,52,25,0.12)]">
              <Image
                src={LogoIcon}
                alt="Logo IDAMAN TSL"
                width={34}
                height={34}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <span className="text-[0.9rem] font-extrabold tracking-[0.18em] text-[#131313]">
              IDAMAN TSL
            </span>
          </div>

          <div className="hidden items-center gap-12 md:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setActiveSection(item.sectionId)}
                className={`rounded-full px-4 py-2 text-[0.72rem] font-semibold tracking-[0.35em] transition-all ${
                  activeSection === item.sectionId
                    ? "bg-[#eef2e2] text-[#6d7f53] shadow-[0_8px_18px_rgba(87,104,64,0.14)]"
                    : "text-[#595959] hover:text-[#2e2e2e]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/login"
            className="rounded-xl bg-[#6d7f53] px-5 py-2.5 text-[0.95rem] font-semibold text-white shadow-[0_8px_18px_rgba(87,104,64,0.28)] transition-all hover:bg-[#5d6f45] hover:shadow-[0_10px_22px_rgba(87,104,64,0.32)]"
          >
            Masuk
          </Link>
        </div>
      </nav>

      <main>
        <section id="beranda" className="relative overflow-hidden bg-[#f4f4f2]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(109,127,83,0.12),transparent_34%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.8),transparent_28%),linear-gradient(180deg,#f7f7f4_0%,#f4f4f2_72%)]" />

          <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-5 py-16 sm:px-8 lg:flex-row lg:gap-16 lg:px-10 lg:py-24 xl:py-28">
            <div className="max-w-160 flex-1 text-center lg:text-left">
              <div className="mb-7 inline-flex items-center rounded-full border border-[#e4e8d8] bg-[#edf1e4] px-5 py-2 text-[0.78rem] font-semibold text-[#6d7f53] shadow-[0_10px_26px_rgba(111,127,83,0.12)]">
                Balai Besar Konservasi Sumber Daya Alam Jawa Barat
              </div>

              <h1 className="text-[clamp(2.7rem,4.6vw,4.7rem)] font-extrabold leading-[0.95] tracking-[-0.05em] text-[#121212]">
                Sistem Informasi Data
                <br />
                Pemanfaatan <span className="text-[#6d7f53]">Tumbuhan &amp;</span>
                <br />
                <span className="text-[#6d7f53]">Satwa Liar</span>
              </h1>

              <p className="mt-6 max-w-145 text-[1rem] leading-8 text-[#555555] lg:text-[1.05rem]">
                Portal resmi pengelolaan, verifikasi, dan pemantauan data tumbuhan dan satwa liar di wilayah Jawa Barat yang terstruktur, terintegrasi, dan efisien untuk keberlanjutan ekosistem.
              </p>

              <div className="mt-8 flex justify-center lg:justify-start">
                <Link
                  href="/login"
                  className="rounded-[10px] bg-[#6d7f53] px-6 py-3 text-[0.92rem] font-semibold text-white shadow-[0_10px_20px_rgba(87,104,64,0.26)] transition-all hover:bg-[#5d6f45] hover:shadow-[0_12px_24px_rgba(87,104,64,0.32)]"
                >
                  Masuk
                </Link>
              </div>
            </div>

            <div className="w-full max-w-132.5 flex-1">
              <div className="rounded-[18px] border border-[#e8eadf] bg-[#eff2e6] p-2.5 shadow-[0_18px_44px_rgba(38,52,25,0.16)]">
                <div className="relative aspect-16/10 overflow-hidden rounded-[14px] bg-[#dce1d3]">
                  <Image
                    src={JunglePicture}
                    alt="Landscape hutan tropis"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 530px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="layanan" className="bg-[#f4f4f2] px-5 pb-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[26px] border border-white/70 bg-white px-5 py-10 shadow-[0_16px_40px_rgba(36,37,31,0.05)] sm:px-8 lg:px-10 lg:py-12">
            <div className="text-center">
              <p className="text-[0.72rem] font-semibold tracking-[0.36em] text-[#8a8a7b]">
                LAYANAN UTAMA
              </p>
              <h2 className="mt-3 text-[clamp(1.9rem,2.8vw,2.5rem)] font-extrabold tracking-[-0.04em] text-[#151515]">
                Pengelolaan Data TSL
              </h2>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {serviceCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[18px] border border-[#ecece5] bg-[#fafafa] p-6 shadow-[0_10px_24px_rgba(34,35,28,0.04)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(34,35,28,0.08)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf0e2]">
                    <ServiceIcon icon={card.icon} />
                  </div>
                  <h3 className="mt-5 text-[1rem] font-bold text-[#161616]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[0.86rem] leading-7 text-[#6a6a6a]">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f4f4f2] px-5 pb-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[26px] border border-white/70 bg-white px-5 py-10 shadow-[0_16px_40px_rgba(36,37,31,0.05)] sm:px-8 lg:px-10 lg:py-12">
            <p className="text-center text-[0.72rem] font-semibold tracking-[0.36em] text-[#8a8a7b]">
              SUPPORTED BY
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-20">
              {supportLogos.map((logo) => (
                <div key={logo.alt} className="flex min-h-27.5 min-w-30 items-center justify-center px-4">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    className="h-auto w-auto max-h-24 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="kontak" className="bg-[#141a2d] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
            <div>
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#eef2e2] p-1 shadow-[0_8px_18px_rgba(0,0,0,0.2)]">
                  <Image
                    src={LogoIcon}
                    alt="Logo IDAMAN TSL"
                    width={34}
                    height={34}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-[0.9rem] font-extrabold tracking-[0.18em] text-white">
                  IDAMAN TSL
                </span>
              </div>
              <p className="mt-6 max-w-85 text-sm leading-7 text-white/72">
                Sistem Informasi Terpadu Pemanfaatan Tumbuhan dan Satwa Liar di Balai Besar Konservasi Sumber Daya Alam Jawa Barat.
              </p>
              <p className="mt-8 text-xs text-white/45">
                ©2026 Balai Besar Konservasi Sumber Daya Alam Jawa Barat. All rights reserved.
              </p>
            </div>

            <div>
              <h3 className="text-[0.72rem] font-semibold tracking-[0.34em] text-white/80">
                SOSIAL MEDIA
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                {footerLinks.sosial.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[0.72rem] font-semibold tracking-[0.34em] text-white/80">
                BANTUAN
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                {footerLinks.bantuan.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[0.72rem] font-semibold tracking-[0.34em] text-white/80">
                KONTAK
              </h3>
              <div className="mt-5 space-y-4 text-sm leading-7 text-white/70">
                <p>Jl. Gedebage No.117, Cisaranten Kidul, Gedebage, Kota Bandung</p>
                <p>(022) 98767115</p>
                <p>www.bbksdajabar.kode.menlhk.go.id</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/8 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-5">
              <span>Kebijakan Privasi</span>
              <span>Syarat &amp; Ketentuan</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
