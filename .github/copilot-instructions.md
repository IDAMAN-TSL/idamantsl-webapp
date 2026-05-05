# Instruksi Kerja AI Chatbot

Gunakan file ini sebagai pedoman saat AI membantu mengubah kode di repository ini.

## Larangan

- Jangan menyentuh file/folder yang ada di backend, kecuali secara eksplisit diminta dan konteksnya jelas. dan hanya membaca nya saja

## Tujuan Utama

- Kerjakan hanya berdasarkan konteks yang diberikan pengguna dan isi workspace yang benar-benar dibaca.
- Jangan mengarang nama file, fungsi, route, komponen, API, atau perilaku yang belum terlihat di kode.
- Jika informasi belum cukup, tanyakan dulu atau cari bukti lokal yang paling dekat sebelum mengubah apa pun.

## Aturan Anti-Halu

- Selalu mulai dari file, simbol, test, error, atau konteks paling dekat dengan permintaan.
- Jangan menyimpulkan struktur proyek hanya dari tebakan atau kebiasaan umum framework.
- Jika ada beberapa kemungkinan, pilih yang paling kecil dan paling bisa diverifikasi.
- Bedakan jelas antara fakta dari kode dan asumsi sementara.
- Jika sebuah detail tidak ditemukan di workspace, katakan tidak ditemukan, bukan mengisi sendiri.

## Cara Bekerja

- Baca konteks yang diberikan pengguna sebelum melakukan perubahan.
- Cari implementasi yang benar-benar mengontrol perilaku yang diminta.
- Lakukan perubahan sekecil mungkin yang menyelesaikan masalah.
- Setelah mengedit, lakukan validasi yang paling dekat dan paling murah untuk membuktikan perubahan itu benar.
- Jangan memperluas scope tanpa alasan yang jelas.

## Saat Konteks Kurang

- Jika pengguna hanya memberi file konteks dan instruksi umum, gunakan file itu sebagai sumber utama.
- Jika ada nama file atau path yang belum jelas, minta pengguna mengirimkan path yang tepat.
- Jika perubahan menyentuh banyak file tetapi arah belum jelas, ringkas opsi yang paling mungkin lalu minta konfirmasi.

## Format Hasil Kerja

- Jelaskan perubahan secara singkat dan langsung.
- Sebutkan file yang diubah hanya jika relevan.
- Jika ada risiko yang belum tervalidasi, nyatakan dengan jelas.
- Jangan menambahkan klaim yang tidak didukung oleh kode atau hasil validasi.

## Prioritas

1. Kebenaran atas asumsi.
2. Perubahan kecil atas refactor besar.
3. Validasi atas tebakan.
4. Kejelasan atas jawaban yang terdengar meyakinkan tapi tidak didukung bukti.

## Cara Memakai Bersama Context MD

- Pengguna boleh memberikan satu file context MD berisi kondisi awal atau potongan kode.
- Pengguna boleh memberikan instruksi perubahan secara terpisah.
- AI harus menggabungkan keduanya, lalu mengerjakan hanya bagian yang benar-benar diminta.
- Jika ada konflik antara konteks dan instruksi, AI harus berhenti dan meminta klarifikasi.
