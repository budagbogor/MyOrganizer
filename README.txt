╔══════════════════════════════════════════════════════════════╗
║          PERSONAL HUB — COMMAND CENTER                       ║
║          Paket Lengkap by Claude AI                          ║
╚══════════════════════════════════════════════════════════════╝

DAFTAR FILE:
─────────────────────────────────────────────────────────────
1. personal-hub-v3-google-sync.html  ← FILE UTAMA (GUNAKAN INI)
   Versi terbaru dengan semua fitur + Google Drive Sync

2. personal-hub-v2.html
   Versi sebelumnya tanpa Google Sync

3. personal-hub-preview.html
   Versi preview/demo awal

4. personal-hub.jsx
   Komponen React source code

═══════════════════════════════════════════════════════════════
CARA MENGGUNAKAN (File HTML — Tidak Perlu Install Apapun!):
═══════════════════════════════════════════════════════════════

1. Buka file "personal-hub-v3-google-sync.html" di browser
   (Chrome, Firefox, Edge, Safari — semua bisa)
2. Isi nama dan jabatan saat onboarding pertama kali
3. Mulai gunakan semua fitur!

Untuk Mobile:
- Buka file di browser HP
- Klik "Share / Bagikan" → "Add to Home Screen"
- Aplikasi akan tampil seperti app native!

═══════════════════════════════════════════════════════════════
FITUR LENGKAP:
═══════════════════════════════════════════════════════════════

✦ Dashboard          — Ringkasan harian + statistik
⚡ Pekerjaan         — Manajemen tugas + Kanban board
💼 Bisnis            — Agenda & progress bisnis
🏡 Keluarga          — Data keluarga + countdown ulang tahun
📅 Kalender          — Event & jadwal penting
👥 Kontak            — Orang-orang penting
🔐 Kredensial        — Password manager terenkripsi
📋 Data Penting      — KTP, NPWP, rekening, dll.
🎯 Rencana           — Rencana pengembangan + milestone
🤖 AI Assistant      — Powered by Claude AI
☁  Google Sync       — Backup otomatis ke Google Drive

═══════════════════════════════════════════════════════════════
SETUP GOOGLE SYNC (Opsional):
═══════════════════════════════════════════════════════════════

Untuk mengaktifkan sync Google Drive nyata (bukan demo):

1. Buka https://console.cloud.google.com
2. Buat project baru
3. Enable: Google Drive API + Google Identity Services
4. Buat OAuth 2.0 Client ID (tipe: Web application)
5. Di "Authorized JavaScript Origins" tambahkan:
   - http://localhost (jika pakai local server)
   - Domain Anda jika di-hosting
6. Buka file personal-hub-v3-google-sync.html dengan text editor
7. Cari baris:
   const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
8. Ganti dengan Client ID Anda

Untuk Demo Mode: Klik "Hubungkan Google" → "Demo Mode"
(tidak perlu setup apapun)

═══════════════════════════════════════════════════════════════
SETUP AI ASSISTANT:
═══════════════════════════════════════════════════════════════

AI Assistant menggunakan Claude API (Anthropic).
Jika dijalankan di claude.ai, AI langsung berfungsi.

Jika dijalankan di luar claude.ai:
- Tambahkan API key Anthropic di header request
- Dapatkan API key di: https://console.anthropic.com

═══════════════════════════════════════════════════════════════
DATA & PRIVASI:
═══════════════════════════════════════════════════════════════

✓ Semua data tersimpan LOKAL di browser Anda (localStorage)
✓ Tidak ada data yang dikirim ke server manapun
✓ Google Sync hanya menyimpan ke Google Drive PRIBADI Anda
✓ Dapat di-export sebagai JSON kapan saja (Pengaturan → Export)

═══════════════════════════════════════════════════════════════
DIBUAT OLEH: Claude AI (Anthropic)
VERSI: 3.0 — April 2026
