import { Leaf, Globe } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl">
      {/* Header Titles */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Selamat Datang
        </h1>
        <p className="mt-1 text-base text-gray-700">
          Berikut ringkasatan inti informasi data pemanfaatan TSL
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Card 1: Penangkaran */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-[#5B7943] bg-gradient-to-br from-[#5B7943] to-[#486333] p-6 text-white shadow-md shadow-[#446B2F]/10">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium opacity-90">
              Penangkaran
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <Leaf className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-6">
            <span className="text-4xl font-bold">10</span>
          </div>
        </div>

        {/* Card 2: Pengedaran Dalam Negeri */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-[#618049] bg-gradient-to-br from-[#618049] to-[#4C6837] p-6 text-white shadow-md shadow-[#446B2F]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-medium opacity-90">
                Pengedaran
              </span>
              <span className="rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                Dalam Negeri
              </span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <Globe className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-6">
            <span className="text-4xl font-bold">5</span>
          </div>
        </div>

        {/* Card 3: Pengedaran Luar Negeri */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-[#597841] bg-gradient-to-br from-[#597841] to-[#44602f] p-6 text-white shadow-md shadow-[#446B2F]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-medium opacity-90">
                Pengedaran
              </span>
              <span className="rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                Luar Negeri
              </span>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <Globe className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-6">
            <span className="text-4xl font-bold">2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
