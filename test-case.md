# 📋 Test Case - E-Katalog UMKM Desa Pasiragung (Backend API)

> **Base URL:** `http://localhost:3000/api/v1`
> **Tanggal dibuat:** 24 Agustus 2026
> **Terakhir diperbarui:** 25 Agustus 2026
>
> Dokumen ini berisi seluruh test case untuk semua endpoint API yang tersedia.
> Gunakan Postman atau tools serupa untuk mengujinya.

## 📊 Ringkasan Status Implementasi

| Modul | Endpoint | Status Kode | Status Testing |
|-------|----------|-------------|----------------|
| 🔐 Auth | A1. Register | ✅ Selesai | ⬜ Belum |
| 🔐 Auth | A2. Cek Status | ✅ Selesai | ⬜ Belum |
| 🔐 Auth | A3. Verifikasi Kode | ✅ Selesai | ⬜ Belum |
| 🔐 Auth | A4. Resend Kode | ✅ Selesai | ⬜ Belum |
| 🔐 Auth | A5. Login | ✅ Selesai | ⬜ Belum |
| 🔐 Auth | A6. Get Me | ✅ Selesai | ⬜ Belum |
| 🔐 Auth | A7. Edit Profil (Nama) | ✅ Selesai | ⬜ Belum |
| 🔐 Auth | A8. Hapus Akun | ✅ Selesai | ⬜ Belum |
| 🔐 Auth | A9. Lupa Kata Sandi | ✅ Selesai | ⬜ Belum |
| 🔐 Auth | A10. Reset Kata Sandi | ✅ Selesai | ⬜ Belum |
| 👤 Admin | B1. List Admin | ✅ Selesai | ⬜ Belum |
| 👤 Admin | B2. Approve Admin | ✅ Selesai | ⬜ Belum |
| 👤 Admin | B3. Reject Admin | ✅ Selesai | ⬜ Belum |
| 👤 Admin | B4. Hapus Admin | ✅ Selesai | ⬜ Belum |
| 📂 Kategori | C1. Lihat Semua | ✅ Selesai | ⬜ Belum |
| 📂 Kategori | C2. Lihat By ID | ✅ Selesai | ⬜ Belum |
| 📂 Kategori | C3. Buat Baru | ✅ Selesai | ⬜ Belum |
| 📂 Kategori | C4. Update | ✅ Selesai | ⬜ Belum |
| 📂 Kategori | C5. Hapus | ✅ Selesai | ⬜ Belum |
| 📦 Produk | D1. Lihat Semua | ✅ Selesai | ⬜ Belum |
| 📦 Produk | D2. Lihat By ID | ✅ Selesai | ⬜ Belum |
| 📦 Produk | D3. Buat Baru | ✅ Selesai | ⬜ Belum |
| 📦 Produk | D4. Update | ✅ Selesai | ⬜ Belum |
| 📦 Produk | D5. Hapus | ✅ Selesai | ⬜ Belum |
| 🛡️ Keamanan | E1. Tanpa Token | ✅ Selesai | ⬜ Belum |
| 🛡️ Keamanan | E2. Token Rusak | ✅ Selesai | ⬜ Belum |
| 🛡️ Keamanan | E3. Role Salah | ✅ Selesai | ⬜ Belum |
| 🛡️ Keamanan | E4. Rate Limiting | ✅ Selesai | ⬜ Belum |

> 💡 **Petunjuk:** Kolom "Status Kode" menandakan endpoint sudah diimplementasikan di kode. Kolom "Status Testing" bisa Anda ubah sendiri menjadi ✅ setelah berhasil di-test di Postman.

---

## 🔐 A. Modul Auth (`/auth`) — ✅ Semua Endpoint Sudah Diimplementasikan

### A1. Register Admin Baru
| Item | Detail |
|------|--------|
| **Method** | `POST` |
| **URL** | `{{baseURL}}auth/register` |
| **Auth** | Tidak perlu |
| **Body (JSON)** | Lihat di bawah |

```json
{
    "name": "Pengelola Baru",
    "email": "pengelolabaru@gmail.com",
    "password": "PasswordAman123"
}
```

**✅ Sukses (201):** Mengembalikan `registration_token`.
```json
{
    "success": true,
    "message": "Registration successful",
    "data": {
        "registration_token": "TOKEN_DISINI"
    }
}
```

**❌ Gagal - Email sudah terdaftar (409):**
```json
{
    "success": false,
    "message": "Email already registered"
}
```

**❌ Gagal - Validasi (400):**
- `name` kurang dari 2 karakter
- `email` format salah (contoh: `"email": "bukan-email"`)
- `password` kurang dari 8 karakter

---

### A2. Cek Status Registrasi
| Item | Detail |
|------|--------|
| **Method** | `GET` |
| **URL** | `{{baseURL}}auth/status/:token` |
| **Auth** | Tidak perlu |

> Ganti `:token` dengan `registration_token` yang didapat dari A1.

**✅ Sukses (200):**
```json
{
    "success": true,
    "data": {
        "status": "pending"
    }
}
```
> Status yang mungkin: `pending`, `awaiting_verification`, `approved`, `rejected`.

**❌ Gagal - Token tidak valid (404):**
```json
{
    "success": false,
    "message": "Invalid registration token"
}
```

---

### A3. Verifikasi Kode Registrasi
| Item | Detail |
|------|--------|
| **Method** | `POST` |
| **URL** | `{{baseURL}}auth/status/:token/verify` |
| **Auth** | Tidak perlu |
| **Body (JSON)** | Lihat di bawah |

> ⚠️ **Prasyarat:** Admin harus sudah di-*approve* oleh Super Admin terlebih dahulu (lihat B2), sehingga statusnya menjadi `awaiting_verification` dan kode verifikasi dikirim ke email.

```json
{
    "verification_code": "KODE_DARI_EMAIL"
}
```

**✅ Sukses (200):**
```json
{
    "success": true,
    "data": {
        "message": "Account verified successfully. You can now login."
    }
}
```

**❌ Gagal - Status bukan awaiting_verification (400):**
```json
{ "success": false, "message": "Invalid status for verification" }
```

**❌ Gagal - Kode salah (400):**
```json
{ "success": false, "message": "Invalid verification code" }
```

**❌ Gagal - Kode expired (400):**
```json
{ "success": false, "message": "Verification code has expired" }
```

**❌ Gagal - Percobaan habis (400):**
```json
{ "success": false, "message": "Maximum verification attempts reached. Please request a new code." }
```

---

### A4. Kirim Ulang Kode Verifikasi
| Item | Detail |
|------|--------|
| **Method** | `POST` |
| **URL** | `{{baseURL}}auth/status/:token/resend` |
| **Auth** | Tidak perlu |
| **Body** | Kosong |

**✅ Sukses (200):**
```json
{
    "success": true,
    "data": {
        "message": "A new verification code has been sent to your email."
    }
}
```

**❌ Gagal - Kode lama masih berlaku (400):**
```json
{ "success": false, "message": "Current verification code is still valid. Please wait before requesting a new one." }
```

---

### A5. Login
| Item | Detail |
|------|--------|
| **Method** | `POST` |
| **URL** | `{{baseURL}}auth/login` |
| **Auth** | Tidak perlu |
| **Body (JSON)** | Lihat di bawah |

**Test Case 1: Login sebagai Super Admin**
```json
{
    "email": "admin@pasiragung.desa.id",
    "password": "SuperAdmin123!"
}
```

**Test Case 2: Login sebagai Admin biasa**
```json
{
    "email": "pengelolabaru@gmail.com",
    "password": "PasswordAman123"
}
```

**✅ Sukses (200):**
```json
{
    "success": true,
    "data": {
        "token": "JWT_TOKEN_DISINI",
        "user": {
            "id": "uuid",
            "name": "Super Admin",
            "email": "admin@pasiragung.desa.id",
            "role": "super_admin",
            "status": "approved"
        }
    }
}
```

> 💡 **Simpan `token` ini!** Akan digunakan untuk semua request yang membutuhkan autentikasi (Authorization: Bearer Token).

**❌ Gagal - Email/Password salah (401):**
```json
{ "success": false, "message": "Invalid email or password" }
```

**❌ Gagal - Akun belum approved (403):**
```json
{ "success": false, "message": "Access denied. Your account status is: pending" }
```

---

### A6. Lihat Profil Saya (Get Me)
| Item | Detail |
|------|--------|
| **Method** | `GET` |
| **URL** | `{{baseURL}}auth/me` |
| **Auth** | Bearer Token (Admin/Super Admin) |
| **Body** | Kosong |

**✅ Sukses (200):**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "uuid",
            "name": "Super Admin",
            "email": "admin@pasiragung.desa.id",
            "role": "super_admin",
            "status": "approved",
            "createdAt": "2026-08-21T..."
        }
    }
}
```

**❌ Gagal - Tidak ada/token salah (401):**
```json
{ "success": false, "message": "Unauthorized" }
```

---

### A7. Edit Profil (Update Nama)
| Item | Detail |
|------|--------|
| **Method** | `PATCH` |
| **URL** | `{{baseURL}}auth/me` |
| **Auth** | Bearer Token (Admin/Super Admin) |
| **Body (JSON)** | Lihat di bawah |

**Test Case 1: Sukses ubah nama**
```json
{
    "name": "Nama Baru Saya"
}
```

**✅ Sukses (200):**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "uuid",
            "name": "Nama Baru Saya",
            "email": "...",
            "role": "...",
            "status": "approved"
        }
    }
}
```

**Test Case 2: Gagal - Nama terlalu pendek**
```json
{
    "name": "A"
}
```
**❌ Gagal (400):** Validasi Zod → `Name must be at least 2 characters long`

---

### A8. Hapus Akun Saya
| Item | Detail |
|------|--------|
| **Method** | `DELETE` |
| **URL** | `{{baseURL}}auth/me` |
| **Auth** | Bearer Token (Admin/Super Admin) |
| **Body** | Kosong |

**✅ Sukses (200):**
```json
{
    "success": true,
    "data": {
        "message": "Account deleted successfully"
    }
}
```

> ⚠️ **HATI-HATI!** Aksi ini tidak bisa dibatalkan. Jangan hapus akun Super Admin Anda!

---

### A9. Lupa Kata Sandi (Request OTP)
| Item | Detail |
|------|--------|
| **Method** | `POST` |
| **URL** | `{{baseURL}}auth/forgot-password` |
| **Auth** | Tidak perlu |
| **Body (JSON)** | Lihat di bawah |

**Test Case 1: Email terdaftar & approved**
```json
{
    "email": "raginangemak123@gmail.com"
}
```

**✅ Sukses (200):**
```json
{
    "success": true,
    "data": {
        "message": "If the email is registered, a reset code will be sent."
    }
}
```
> Cek Inbox Gmail Anda, email berisi kode reset akan masuk.

**Test Case 2: Email tidak terdaftar**
```json
{
    "email": "tidakada@gmail.com"
}
```
**✅ Tetap Sukses (200):** Respon sama persis (anti *email enumeration*).

**Test Case 3: Email belum approved**
```json
{
    "email": "akun.pending@gmail.com"
}
```
**✅ Tetap Sukses (200):** Respon sama persis (anti *email enumeration*).

**Test Case 4: Request ulang padahal kode lama masih berlaku**
> Kirim request yang sama sebelum kode lama expired.

**✅ Tetap Sukses (200):** Respon sama persis (anti *email enumeration*).

---

### A10. Reset Kata Sandi (Menggunakan OTP)
| Item | Detail |
|------|--------|
| **Method** | `POST` |
| **URL** | `{{baseURL}}auth/reset-password` |
| **Auth** | Tidak perlu |
| **Body (JSON)** | Lihat di bawah |

**Test Case 1: Sukses reset password**
```json
{
    "email": "raginangemak123@gmail.com",
    "code": "KODE_DARI_EMAIL",
    "new_password": "PasswordBaruKu123"
}
```

**✅ Sukses (200):**
```json
{
    "success": true,
    "data": {
        "message": "Password has been reset successfully. You can now login with your new password."
    }
}
```

**Test Case 2: Kode salah**
```json
{
    "email": "raginangemak123@gmail.com",
    "code": "KODE_ASAL_ASALAN",
    "new_password": "PasswordBaru123"
}
```
**❌ Gagal (400):**
```json
{ "success": false, "message": "Invalid reset code" }
```

**Test Case 3: Email berbeda dengan pemilik kode (keamanan anti-pencurian)**
```json
{
    "email": "akunlain@gmail.com",
    "code": "KODE_MILIK_ORANG_LAIN",
    "new_password": "MauCuriPassword123"
}
```
**❌ Gagal (400):**
```json
{ "success": false, "message": "Invalid reset code or email" }
```

**Test Case 4: Password baru terlalu pendek**
```json
{
    "email": "raginangemak123@gmail.com",
    "code": "KODE_VALID",
    "new_password": "123"
}
```
**❌ Gagal (400):** Validasi Zod → `Password must be at least 8 characters long`

**Test Case 5: Kode expired (setelah 15 menit)**
**❌ Gagal (400):**
```json
{ "success": false, "message": "Reset code has expired" }
```

---

## 👤 B. Modul Admin (`/admin`) — ✅ Semua Endpoint Sudah Diimplementasikan — Khusus Super Admin

> ⚠️ **Semua endpoint di modul ini membutuhkan:**
> - Authorization: Bearer Token
> - Role: `super_admin`
>
> Jika menggunakan token admin biasa → akan mendapat `403 Forbidden`.

### B1. Lihat Daftar Semua Admin
| Item | Detail |
|------|--------|
| **Method** | `GET` |
| **URL** | `{{baseURL}}admin/users` |
| **Auth** | Bearer Token (Super Admin) |
| **Query Params (Opsional)** | `?page=1&limit=10` |

**✅ Sukses (200):**
```json
{
    "success": true,
    "message": "Successfully fetched admins",
    "data": [...],
    "pagination": {
        "page": 1,
        "limit": 10,
        "totalItems": 5,
        "totalPages": 1
    }
}
```

**❌ Gagal - Bukan super_admin (403):**
```json
{ "success": false, "message": "Forbidden" }
```

---

### B2. Approve Admin
| Item | Detail |
|------|--------|
| **Method** | `PATCH` |
| **URL** | `{{baseURL}}admin/users/:id/approve` |
| **Auth** | Bearer Token (Super Admin) |
| **Body** | Kosong |

> Ganti `:id` dengan UUID admin dari B1.
> ⚠️ Aksi ini akan mengubah status admin menjadi `awaiting_verification` dan **mengirimkan kode verifikasi ke email admin tersebut**.

**✅ Sukses (200):**
```json
{
    "success": true,
    "message": "Admin approved successfully",
    "data": {
        "id": "uuid",
        "name": "Pengelola Baru",
        "email": "pengelolabaru@gmail.com",
        "role": "admin",
        "status": "awaiting_verification"
    }
}
```

**❌ Gagal - Admin tidak ditemukan (404):**
```json
{ "success": false, "message": "Admin not found" }
```

---

### B3. Reject Admin
| Item | Detail |
|------|--------|
| **Method** | `PATCH` |
| **URL** | `{{baseURL}}admin/users/:id/reject` |
| **Auth** | Bearer Token (Super Admin) |
| **Body** | Kosong |

> 📧 **Fitur Baru:** Aksi ini sekarang akan otomatis **mengirimkan email notifikasi penolakan** ke alamat email admin yang ditolak.

**✅ Sukses (200):**
```json
{
    "success": true,
    "message": "Admin rejected successfully",
    "data": {
        "id": "uuid",
        "name": "Pengelola Baru",
        "email": "pengelolabaru@gmail.com",
        "role": "admin",
        "status": "rejected"
    }
}
```
> ✉️ **Verifikasi tambahan:** Setelah mendapat respon sukses, cek kotak masuk Gmail admin yang ditolak. Harus ada email berjudul **"Pendaftaran Akun Ditolak - E-Katalog Pasiragung"**.

---

### B4. Hapus Admin
| Item | Detail |
|------|--------|
| **Method** | `DELETE` |
| **URL** | `{{baseURL}}admin/users/:id` |
| **Auth** | Bearer Token (Super Admin) |
| **Body** | Kosong |

**✅ Sukses (200):**
```json
{
    "success": true,
    "message": "Admin account deleted successfully"
}
```

**❌ Gagal - Admin tidak ditemukan (404):**
```json
{ "success": false, "message": "Admin not found" }
```

---

## 📂 C. Modul Kategori (`/categories`) — ✅ Semua Endpoint Sudah Diimplementasikan

> Endpoint **GET** (Read) bersifat publik (tidak perlu login).
> Endpoint **POST/PATCH/DELETE** (Create/Update/Delete) membutuhkan Bearer Token `admin` atau `super_admin`.

### C1. Lihat Semua Kategori (Publik)
| Item | Detail |
|------|--------|
| **Method** | `GET` |
| **URL** | `{{baseURL}}categories` |
| **Auth** | Tidak perlu |
| **Query Params (Opsional)** | `?page=1&limit=10` |

**✅ Sukses (200):**
```json
{
    "success": true,
    "message": "Successfully fetched categories",
    "data": [
        {
            "id": "uuid",
            "name": "Makanan Ringan",
            "createdAt": "...",
            "updatedAt": "..."
        }
    ],
    "pagination": { ... }
}
```

---

### C2. Lihat Kategori Berdasarkan ID (Publik)
| Item | Detail |
|------|--------|
| **Method** | `GET` |
| **URL** | `{{baseURL}}categories/:id` |
| **Auth** | Tidak perlu |

**✅ Sukses (200):**
```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "name": "Makanan Ringan",
        "createdAt": "...",
        "updatedAt": "..."
    }
}
```

**❌ Gagal - Tidak ditemukan (404):**
```json
{ "success": false, "message": "Category not found" }
```

---

### C3. Buat Kategori Baru
| Item | Detail |
|------|--------|
| **Method** | `POST` |
| **URL** | `{{baseURL}}categories` |
| **Auth** | Bearer Token (Admin/Super Admin) |
| **Body (JSON)** | Lihat di bawah |

```json
{
    "name": "Makanan Ringan"
}
```

**✅ Sukses (201):**
```json
{
    "success": true,
    "message": "Category created successfully",
    "data": {
        "id": "uuid",
        "name": "Makanan Ringan",
        ...
    }
}
```

**❌ Gagal - Nama kurang dari 3 karakter (400):**
> Body: `{ "name": "AB" }`

**❌ Gagal - Nama kategori sudah ada (409 atau 400):**
> Mencoba membuat kategori dengan nama yang sudah terdaftar.

---

### C4. Update Kategori
| Item | Detail |
|------|--------|
| **Method** | `PATCH` |
| **URL** | `{{baseURL}}categories/:id` |
| **Auth** | Bearer Token (Admin/Super Admin) |
| **Body (JSON)** | Lihat di bawah |

```json
{
    "name": "Kerajinan Tangan"
}
```

**✅ Sukses (200):**
```json
{
    "success": true,
    "message": "Category updated successfully",
    "data": { ... }
}
```

**❌ Gagal - ID tidak ditemukan (404):**
```json
{ "success": false, "message": "Category not found" }
```

---

### C5. Hapus Kategori
| Item | Detail |
|------|--------|
| **Method** | `DELETE` |
| **URL** | `{{baseURL}}categories/:id` |
| **Auth** | Bearer Token (Admin/Super Admin) |
| **Body** | Kosong |

**✅ Sukses (200):**
```json
{ "success": true, "message": "Category deleted successfully" }
```

**❌ Gagal - Kategori masih digunakan oleh produk:**
> Jika ada produk yang masih menggunakan kategori ini, database akan menolak penghapusan (Foreign Key constraint).

---

## 📦 D. Modul Produk (`/products`) — ✅ Semua Endpoint Sudah Diimplementasikan

> Endpoint **GET** (Read) bersifat publik (tidak perlu login).
> Endpoint **POST/PATCH/DELETE** (Create/Update/Delete) membutuhkan Bearer Token `admin` atau `super_admin`.

### D1. Lihat Semua Produk (Publik)
| Item | Detail |
|------|--------|
| **Method** | `GET` |
| **URL** | `{{baseURL}}products` |
| **Auth** | Tidak perlu |
| **Query Params (Opsional)** | `?page=1&limit=10&categoryId=UUID&search=keripik` |

**✅ Sukses (200):**
```json
{
    "success": true,
    "message": "Successfully fetched products",
    "data": [...],
    "pagination": { ... }
}
```

---

### D2. Lihat Produk Berdasarkan ID (Publik)
| Item | Detail |
|------|--------|
| **Method** | `GET` |
| **URL** | `{{baseURL}}products/:id` |
| **Auth** | Tidak perlu |

**✅ Sukses (200):**
```json
{
    "success": true,
    "message": "Successfully fetched product",
    "data": {
        "id": "uuid",
        "name": "Keripik Singkong",
        "imageUrl": "https://res.cloudinary.com/...",
        "stockStatus": "tersedia",
        "category": { "id": "uuid", "name": "Makanan Ringan" },
        "whatsappNumber": "0812...",
        "description": "...",
        "ownerName": "Bu Siti",
        "productionSystem": "ready_stock",
        "netWeight": "250g",
        "price": "15000.00",
        "flavorVariants": ["Original", "Balado", "Keju"],
        "composition": "...",
        "nibNumber": "...",
        "halalCertificateNumber": "...",
        "creator": { "id": "uuid", "name": "Admin" }
    }
}
```

**❌ Gagal - Produk tidak ditemukan (404):**
```json
{ "success": false, "message": "Product not found" }
```

---

### D3. Buat Produk Baru (Dengan Upload Gambar)
| Item | Detail |
|------|--------|
| **Method** | `POST` |
| **URL** | `{{baseURL}}products` |
| **Auth** | Bearer Token (Admin/Super Admin) |
| **Body** | **`form-data`** (BUKAN JSON!) |

> ⚠️ **PENTING:** Di Postman, pilih Body → **form-data** (bukan raw JSON), karena endpoint ini membutuhkan file upload gambar.

| Key | Type | Value (Contoh) |
|-----|------|----------------|
| `image` | **File** | *(pilih file gambar dari komputer Anda)* |
| `name` | Text | `Keripik Singkong Pasiragung` |
| `categoryId` | Text | `UUID_KATEGORI_DARI_C1` |
| `whatsappNumber` | Text | `081234567890` |
| `description` | Text | `Keripik singkong renyah dari Desa Pasiragung` |
| `ownerName` | Text | `Bu Siti` |
| `stockStatus` | Text | `tersedia` |
| `productionSystem` | Text | `ready_stock` |
| `netWeight` | Text | `250g` |
| `price` | Text | `15000` |
| `flavorVariants` | Text | `["Original", "Balado", "Keju"]` |
| `composition` | Text | `Singkong, minyak goreng, garam, bumbu rempah` |
| `nibNumber` | Text | `1234567890123` *(opsional)* |
| `halalCertificateNumber` | Text | `LPPOM-001234` *(opsional)* |

**✅ Sukses (201):**
```json
{
    "success": true,
    "message": "Product created successfully",
    "data": { ... }
}
```

**❌ Gagal - Gambar tidak disertakan (400):**
```json
{ "success": false, "message": "Product image is required" }
```

**❌ Gagal - `categoryId` tidak valid (400):**
```json
{ "success": false, "message": "Invalid category ID or foreign key constraint failed" }
```

**❌ Gagal - `stockStatus` bukan enum (400):**
> Hanya menerima: `tersedia` atau `belum_tersedia`.

**❌ Gagal - `productionSystem` bukan enum (400):**
> Hanya menerima: `pre_order` atau `ready_stock`.

---

### D4. Update Produk (Dengan/Tanpa Ganti Gambar)
| Item | Detail |
|------|--------|
| **Method** | `PATCH` |
| **URL** | `{{baseURL}}products/:id` |
| **Auth** | Bearer Token (Admin/Super Admin) |
| **Body** | **`form-data`** |

> Anda hanya perlu mengirimkan field yang ingin diubah saja.

**Test Case 1: Update hanya nama (tanpa ganti gambar)**
| Key | Type | Value |
|-----|------|-------|
| `name` | Text | `Keripik Singkong Premium` |

**Test Case 2: Update harga dan ganti gambar**
| Key | Type | Value |
|-----|------|-------|
| `price` | Text | `20000` |
| `image` | File | *(pilih gambar baru)* |

**✅ Sukses (200):**
```json
{
    "success": true,
    "message": "Product updated successfully",
    "data": { ... }
}
```

**❌ Gagal - Produk tidak ditemukan (404):**
```json
{ "success": false, "message": "Product not found" }
```

---

### D5. Hapus Produk
| Item | Detail |
|------|--------|
| **Method** | `DELETE` |
| **URL** | `{{baseURL}}products/:id` |
| **Auth** | Bearer Token (Admin/Super Admin) |
| **Body** | Kosong |

**✅ Sukses (200):**
```json
{ "success": true, "message": "Product deleted successfully" }
```

**❌ Gagal - Produk tidak ditemukan (404):**
```json
{ "success": false, "message": "Product not found" }
```

---

## 🛡️ E. Test Case Keamanan & Edge Case — ✅ Semua Sudah Diimplementasikan

### E1. Akses tanpa Token
> Coba akses endpoint yang membutuhkan auth (contoh: `GET /auth/me`) **TANPA** menyertakan Bearer Token.

**❌ Gagal (401):**
```json
{ "success": false, "message": "Unauthorized" }
```

### E2. Akses dengan Token Expired/Rusak
> Masukkan Bearer Token asal-asalan.

**❌ Gagal (401):**
```json
{ "success": false, "message": "Unauthorized" }
```

### E3. Admin Biasa Akses Endpoint Super Admin
> Login sebagai admin biasa, lalu coba akses endpoint `GET /admin/users`.

**❌ Gagal (403):**
```json
{ "success": false, "message": "Forbidden" }
```

### E4. Rate Limiting
> Kirim request `POST /auth/login` berkali-kali (melebihi 100 request dalam 15 menit).

**❌ Gagal (429):**
```json
{ "message": "Too many requests, please try again later." }
```

---

## 📝 Urutan Test yang Direkomendasikan

Untuk menguji alur registrasi lengkap secara berurutan:

1. **A1** → Register admin baru (simpan `registration_token`)
2. **A2** → Cek status (pastikan `pending`)
3. **A5** → Login Super Admin (simpan `token` Super Admin)
4. **B1** → Lihat daftar admin (ambil `id` admin baru)
5. **B2** → Approve admin baru (kode verifikasi dikirim ke email)
6. **A2** → Cek status lagi (pastikan `awaiting_verification`)
7. **A3** → Verifikasi kode (dari email)
8. **A2** → Cek status lagi (pastikan `approved`)
9. **A5** → Login dengan akun admin baru
10. **A6** → Get Me
11. **A7** → Edit Nama

Untuk menguji alur lupa kata sandi:

1. **A9** → Forgot Password (cek email untuk kode)
2. **A10** → Reset Password (masukkan kode + password baru)
3. **A5** → Login dengan password baru
