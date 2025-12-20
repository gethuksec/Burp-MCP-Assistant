# Dokumentasi Teknis Burp MCP Assistant

Dokumen ini menjelaskan arsitektur internal dan struktur data yang digunakan dalam proyek ini.

## Arsitektur Komponen

Proyek ini dibangun menggunakan TypeScript dan dibagi menjadi beberapa modul utama:

- `PromptLibrary`: Mengelola pemuatan dan pencarian template prompt dari file JSON.
- `HistoryManager`: Melacak penggunaan prompt menggunakan VS Code `globalState`.
- `CommandRegistry`: Mendaftarkan perintah-perintah VS Code dan menghubungkannya dengan logika bisnis.
- `Extension`: Entry point utama yang menginisialisasi semua komponen.

## Struktur Data Prompt

Template prompt disimpan dalam format JSON di direktori `resources/prompts/`. Setiap file berisi array objek dengan struktur sebagai berikut:

```typescript
interface PromptTemplate {
    id: string;          // ID unik untuk prompt
    name: string;        // Nama tampilan
    description: string; // Deskripsi singkat kegunaan
    category: string;    // Kategori (Input Validation, Auth, dll)
    mcpTool: string;     // Nama tool MCP utama yang disarankan (misal: send_http1_request)
    template: string;    // Isi prompt yang akan dikirim ke AI
    parameters: PromptParameter[]; // Parameter penunjang (opsional)
    examples: string[];  // Contoh penggunaan
    tags: string[];      // Tag untuk membantu pencarian
}

interface PromptParameter {
    name: string;
    type: 'string' | 'number' | 'url' | 'json' | 'select';
    required: boolean;
    description: string;
    default?: any;
    options?: string[]; // Hanya untuk tipe 'select'
}
```

## Pengaturan Ekstensi (Settings)

Pengguna dapat mengonfigurasi perilaku ekstensi melalui `settings.json`:

| Kunci | Tipe | Default | Deskripsi |
|-------|------|---------|-----------|
| `burpMCP.prompt.defaultAction` | `string` | `"copy"` | Aksi default saat mengklik prompt ("copy" atau "insertAtCursor"). |
| `burpMCP.prompt.includeComments` | `boolean` | `true` | Apakah akan menyertakan komentar penjelasan dalam prompt. |
| `burpMCP.history.maxItems` | `number` | `50` | Jumlah maksimum item history yang disimpan. |
| `burpMCP.ui.showNotifications` | `boolean` | `true` | Menampilkan notifikasi info saat melakukan aksi. |

---

## Pengembangan Lebih Lanjut (Contribution)

Jika Anda ingin menambahkan prompt baru:

1. Buat file JSON di `resources/prompts/` (atau tambahkan ke file yang ada).
2. Ikuti skema `PromptTemplate` di atas.
3. Jalankan `npm test` untuk memverifikasi validitas JSON dan referensi tool.
