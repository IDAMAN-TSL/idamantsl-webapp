export type PeranFilterOption = {
  key: string;
  label: string;
};

export const PERAN_FILTER_OPTIONS: PeranFilterOption[] = [
  { key: "admin_pusat", label: "Admin Pusat" },
  { key: "bidang_1", label: "Bidang I. Bogor" },
  { key: "bidang_2", label: "Bidang II. Soreang" },
  { key: "bidang_3", label: "Bidang III. Ciamis" },
  { key: "seksi_1", label: "Seksi I. Serang" },
  { key: "seksi_2", label: "Seksi II. Bogor" },
  { key: "seksi_3", label: "Seksi III. Soreang" },
  { key: "seksi_4", label: "Seksi IV. Garut" },
  { key: "seksi_5", label: "Seksi V. Purwakarta" },
  { key: "seksi_6", label: "Seksi VI. Tasikmalaya" },
];

export function getPeranFilterKey(role?: string, wilayahId?: number | null) {
  if (role === "admin_pusat") return "admin_pusat";
  if (role === "bidang_wilayah") {
    return wilayahId ? `bidang_${wilayahId}` : "";
  }
  if (role === "seksi_wilayah") {
    return wilayahId ? `seksi_${wilayahId}` : "";
  }
  return "";
}