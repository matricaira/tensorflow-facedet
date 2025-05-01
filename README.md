# Face Detection Login Web App

Aplikasi web login dengan verifikasi wajah menggunakan kamera web yang dibangun dengan HTML, CSS, dan JavaScript. Aplikasi ini menggunakan TensorFlow.js dan BlazeFace untuk melakukan deteksi wajah secara real-time.

## Fitur

- **Deteksi Wajah Real-time**: Menggunakan model BlazeFace untuk mendeteksi wajah secara real-time.
- **Penolakan Akses**: Menolak akses jika tidak ada wajah yang terdeteksi.
- **Sistem Autentikasi**: Login dan pendaftaran akun yang disimpan di localStorage.
- **Dashboard Riwayat Login**: Menampilkan riwayat login pengguna beserta status dan perangkat.
- **Responsive Design**: Tampilan yang responsif untuk berbagai ukuran layar.

## Teknologi yang Digunakan

- **Frontend**: HTML, CSS, JavaScript
- **Face Detection**: TensorFlow.js, BlazeFace Model
- **Camera Access**: WebRTC API (getUserMedia)
- **Storage**: Browser's localStorage

## Cara Penggunaan

1. **Clone Repository**
   ```bash
   git clone https://github.com/matricaira/face-detection-login.git
   cd face-detection-login
   ```

2. **Jalankan Aplikasi**
   - Buka file `index.html` di browser yang mendukung akses kamera (Chrome, Firefox, dll.)
   - Atau gunakan live server untuk menjalankan aplikasi

3. **Akses Aplikasi**
   - Izinkan akses kamera browser
   - Posisikan wajah di depan kamera
   - Setelah wajah terdeteksi, form login akan muncul
   - Daftar akun baru atau masuk dengan akun yang sudah ada

## Alur Kerja

1. **Deteksi Wajah**:
   - Aplikasi memuat model BlazeFace saat pertama kali dijalankan
   - Kamera web diaktifkan dan streaming gambar diproses secara real-time
   - Model AI mendeteksi apakah ada wajah dalam frame kamera

2. **Autentikasi**:
   - Jika wajah terdeteksi, pengguna diizinkan mengakses form login
   - Pengguna dapat login dengan akun yang sudah ada atau mendaftar baru
   - Jika tidak ada wajah terdeteksi, akses akan ditolak

3. **Dashboard**:
   - Setelah login berhasil, pengguna diarahkan ke dashboard
   - Dashboard menampilkan riwayat login dengan detail timestamp dan perangkat
   - Fitur logout untuk kembali ke proses deteksi wajah

## Struktur Proyek

```
face-detection-login/
├── index.html          # Struktur HTML utama
├── styles.css          # File styling CSS
├── app.js              # Logika aplikasi JavaScript
├── README.md           # Dokumentasi proyek
```

## Pengembangan Lebih Lanjut

- Implementasi backend dan database untuk autentikasi yang lebih aman
- Penggunaan face recognition (bukan hanya deteksi) untuk autentikasi biometrik
- Integrasi dengan sistem autentikasi dua faktor
- Penambahan fitur keamanan seperti pendeteksian liveness (anti-spoofing)

## Batasan

- Aplikasi menggunakan localStorage untuk menyimpan data user (hanya untuk demonstrasi)
- Face detection hanya mendeteksi keberadaan wajah, bukan mengenali identitas wajah tertentu
- Performa deteksi wajah tergantung pada perangkat keras dan browser yang digunakan

## Lisensi

MIT License

## Kontributor

- Matricaira (https://github.com/matricaira)