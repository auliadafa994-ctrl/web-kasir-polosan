# 🧾 Web Kasir Polosan

**Web Kasir Polosan** adalah aplikasi web kasir yang dirancang untuk membantu pengelolaan transaksi, produk, dan laporan penjualan secara lebih mudah, cepat, dan terorganisir.

Aplikasi ini cocok digunakan oleh pemilik toko, kasir, UMKM, maupun pengelola usaha kecil yang membutuhkan sistem kasir sederhana berbasis web.

[![Status](https://img.shields.io/badge/status-masih_dikembangkan-yellow)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## ✨ Fitur Utama

- 🛒 Mengelola transaksi penjualan
- 📦 Mengelola data produk
- 📊 Melihat laporan penjualan
- 👥 Autentikasi pengguna
- 🔐 Keamanan password dan akses API

> ⚠️ Sesuaikan daftar fitur di atas dengan fitur yang benar-benar sudah tersedia di aplikasimu.

---

## 🛠️ Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| Autentikasi | JWT, bcrypt |
| Version Control | Git & GitHub |

> ⚠️ Sesuaikan tabel ini dengan teknologi yang benar-benar kamu gunakan.

---

## 📁 Struktur Project

```text
web-kasir-polosan/
├── backend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## ⚙️ Persyaratan

Pastikan komputer kamu sudah terinstal:

- Node.js versi 20 atau lebih baru
- npm
- PostgreSQL
- Git

---

## 🚀 Cara Menjalankan Project

### 1. Clone repository

```bash
git clone [https://github.com/auliadafa994-ctrl/web-kasir-polosan.git](https://github.com/auliadafa994-ctrl/web-kasir-polosan.git)
cd web-kasir-polosan
```

### 2. Install dependency backend

```powershell
cd backend
npm install
```

### 3. Konfigurasi environment backend

Salin file contoh environment:

```powershell
Copy-Item .env.example .env
```

Isi file `.env` dengan konfigurasi milikmu:

```env
DATABASE_URL=your_database_connection_url
JWT_SECRET=your_jwt_secret_minimum_32_characters
PORT=4000
```

> ⚠️ Jangan pernah mengunggah file `.env` asli yang berisi password, API key, atau kredensial database ke GitHub.

### 4. Jalankan backend

```powershell
npm run dev
```

### 5. Install dan jalankan frontend

Buka terminal baru:

```powershell
cd frontend
npm install
npm run dev
```

Buka URL yang muncul di terminal, biasanya:

```text
http://localhost:5173
```

---

## 👤 Akun Demo

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | Gunakan kredensial demo milikmu |
| Kasir | `kasir@example.com` | Gunakan kredensial demo milikmu |

> ⚠️ Jangan menampilkan password asli di README. Gunakan akun demo khusus.

---

## 🧪 Testing dan Build

Jalankan dari folder `backend/`:

```powershell
npm test
npm run build
```

Jalankan dari folder `frontend/`:

```powershell
npm test
npm run build
```

---

## 📡 REST API

| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `POST` | `/api/auth/login` | Publik | Login pengguna |
| `POST` | `/api/auth/register` | Publik | Registrasi pengguna |
| `GET` | `/api/products` | Login | Mengambil daftar produk |
| `POST` | `/api/products` | Admin | Menambah produk |
| `GET` | `/api/transactions` | Login | Mengambil daftar transaksi |
| `POST` | `/api/transactions` | Kasir/Admin | Membuat transaksi baru |
| `GET` | `/api/reports` | Admin | Melihat laporan penjualan |

> ⚠️ Sesuaikan endpoint dengan API yang benar-benar ada di backend-mu.

---

## 🔒 Keamanan

- Password disimpan menggunakan hashing, bukan teks biasa.
- Route yang dilindungi menggunakan autentikasi JWT.
- Konfigurasi sensitif disimpan di file `.env`.
- File `.env` tidak diunggah ke repository GitHub.
- API menggunakan validasi input untuk mengurangi risiko data tidak valid.

---

## 📸 Preview Aplikasi
Maaf Belum Ditampilkan
Tambahkan screenshot aplikasi di folder `screenshots/`, lalu tampilkan seperti ini:

```md

```

| Halaman | Preview |
|---|---|
| Login | ![Login](screenshots/login.png) | Maaf Belum Ditampilkan
| Dashboard | ![Dashboard](screenshots/dashboard.png) | Maaf Belum Ditampilkan
| Produk | ![Produk](screenshots/products.png) | Maaf Belum Ditampilkan
| Transaksi | ![Transaksi](screenshots/transactions.png) | Maaf Belum Ditampilkan
| Laporan | ![Laporan](screenshots/reports.png) | Maaf Belum Ditampilkan

---

## 🎯 Tujuan Project

Project ini dibuat untuk:

- Menerapkan kemampuan pengembangan web full-stack
- Membangun aplikasi kasir yang fungsional dan mudah digunakan
- Melatih pengelolaan data produk dan transaksi
- Menerapkan autentikasi dan keamanan aplikasi web
- Menampilkan kemampuan pengelolaan project dengan Git dan GitHub

---

## 📌 Rencana Pengembangan

- [ ] Menambahkan manajemen stok otomatis
- [ ] Menambahkan laporan penjualan harian, mingguan, dan bulanan
- [ ] Menambahkan ekspor laporan ke Excel/PDF
- [ ] Menambahkan dashboard analitik penjualan
- [ ] Menambahkan manajemen pengguna dan role
- [ ] Deploy backend ke Render/Railway
- [ ] Deploy frontend ke Vercel/Netlify

---

## 🤝 Kontribusi

Project ini terbuka untuk pengembangan lebih lanjut. Jika ingin berkontribusi:

1. Fork repository ini
2. Buat branch baru
3. Lakukan perubahan
4. Kirim pull request

---

## 📬 Kontak

- GitHub: [@auliadafa994-ctrl](https://github.com/auliadafa994-ctrl)
- Email: auliadafa994@gmail.com

---

⭐ Jika project ini bermanfaat, jangan lupa beri **Star** pada repository ini!
