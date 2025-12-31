# Tutorial Burp MCP Assistant

Dokumen ini berisi panduan penggunaan Burp MCP Assistant untuk mempercepat pengujian keamanan aplikasi web Anda.

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Konfigurasi Awal](#konfigurasi-awal)
3. [Menggunakan Library Prompt](#menggunakan-library-prompt)
4. [Skenario Contoh: SQL Injection](#skenario-contoh-sql-injection)
5. [Tips & Trik](#tips--trik)

---

## Pendahuluan

Burp MCP Assistant adalah ekstensi VS Code yang menyediakan library prompt siap pakai untuk digunakan dengan AI Assistant (seperti Cursor) yang terhubung ke Burp Suite melalui Model Context Protocol (MCP).

**Ingat:** Ekstensi ini tidak terhubung langsung ke Burp Suite, melainkan membantu Anda merumuskan perintah yang tepat untuk AI Assistant Anda.

## Konfigurasi Awal

### 1. Pastikan Burp MCP Server Berjalan

Anda harus memiliki ekstensi **Burp MCP** terpasang di Burp Suite dan server MCP harus dalam status "Enabled".

### 2. Hubungkan Cursor ke Burp

Pastikan file `mcp.json` Anda sudah dikonfigurasi dengan benar (lihat README untuk contoh konfigurasi).

## Menjalankan Ekstensi (Development Mode)

Jika Anda menginstal dari source code, ikuti langkah berikut setelah `npm run compile`:

### 1. Buka Run and Debug

Klik ikon "Run and Debug" di **Primary Side Bar** (atau tekan `Ctrl+Shift+D` / `Cmd+Shift+D`).

### 2. Buat launch.json

1. Klik pada teks **"create a launch.json file"**
2. Akan muncul dropdown autocomplete

### 3. Pilih Tipe Ekstensi

Scroll dan pilih **"{ } VS Code Extension Development"**.

### 4. Simpan launch.json

File akan dibuat di `.vscode/launch.json`. Simpan dengan `Ctrl+S` / `Cmd+S`.

### 5. Jalankan Ekstensi

1. Klik tombol hijau **"Launch Extension"** (atau tekan `F5`)
2. Jendela VS Code baru (**Extension Development Host**) akan terbuka
3. Ekstensi Anda sekarang berjalan di jendela baru tersebut!

## Buka Sidebar Burp MCP

Di jendela **Extension Development Host**:

- Cari ikon 🎯 (target) di **Activity Bar** (sidebar kiri)
- Klik untuk membuka **Burp MCP Assistant**

## Menggunakan Library Prompt

### Metode 1: Klik & Salin (Copy)

1. Cari kategori yang sesuai (misalnya: "Input Validation").
2. Klik pada prompt yang ingin digunakan.
3. Ekstensi akan menyalin template ke clipboard Anda.
4. Buka Chat AI (Ctrl+Shift+I) dan tempel (Ctrl+V).

### Metode 2: Masukkan ke Editor (Insert)

Jika Anda ingin menyimpan prompt dalam file markdown atau skrip:

1. Klik kanan pada prompt di sidebar.
2. Pilih "Insert at Cursor".

### Metode 3: Pencarian Cepat

1. Tekan `Ctrl+Shift+B` lalu `S` (atau `Cmd+Shift+B S` di macOS).
2. Ketik kata kunci (misal: "jwt").
3. Pilih dari hasil yang muncul untuk menyalinnya.

## Skenario Contoh: SQL Injection

Mari kita coba menguji endpoint API yang mencurigakan: `https://test-target.com/api/v1/products?id=123`

1. Buka sidebar → **Input Validation** → **SQL Injection Basic Test**.
2. Klik prompt tersebut.
3. Di Cursor Chat, tempelkan prompt dan lengkapi detailnya:

   > "Test <https://test-target.com/api/v1/products?id=123> for SQL injection using Burp MCP tools. Try common payloads and analyze if there are any timing or error differences."

4. Perhatikan AI Assistant menggunakan tool seperti `send_http1_request` untuk mengirimkan berbagai payload SQLi melalui Burp Suite Anda.
5. AI akan memberikan laporan temuan secara langsung di chat.

## Tips & Trik

- **Gunakan Variabel:** Banyak prompt menggunakan placeholder seperti `{{url}}`. Anda bisa langsung menggantinya setelah menempelkan prompt di chat.
- **Kombinasikan Prompt:** Gunakan prompt dari kategori "Reconnaissance" terlebih dahulu untuk memetakan endpoint, baru gunakan prompt spesifik untuk jenis serangan tertentu.
- **Cek History:** Lihat panel "Recently Used" di sidebar untuk mengakses prompt yang baru saja Anda gunakan dengan cepat.

---

**Selamat Melakukan Pengujian (Secara Legal)!** 🎯
