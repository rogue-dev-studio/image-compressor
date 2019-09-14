# 🖼️ Image Compressor

Aplikasi kompresi gambar online gratis dan mudah digunakan. Kurangi ukuran file gambar tanpa kehilangan kualitas yang signifikan. Dukungan format JPG, PNG, WebP, dan GIF.

## ✨ Fitur Utama

- **Drag & Drop Upload** - Upload gambar dengan mudah menggunakan drag and drop
- **Multiple Image Support** - Kompres beberapa gambar sekaligus
- **Quality Control** - Atur kualitas kompresi dari 10% hingga 100%
- **Dimension Resizing** - Ubah ukuran gambar dengan mempertahankan aspek ratio
- **Format Conversion** - Konversi antara format JPG, PNG, WebP, dan GIF
- **Batch Processing** - Proses semua gambar yang dipilih dalam satu kali klik
- **Progress Tracking** - Pantau progress kompresi secara real-time
- **Download Management** - Download hasil kompresi satu per satu atau sekaligus
- **Settings Persistence** - Pengaturan tersimpan otomatis di browser
- **PWA Support** - Dapat diinstall sebagai aplikasi desktop/mobile
- **Responsive Design** - Tampilan optimal di semua perangkat
- **Dark Mode Support** - Tema gelap otomatis mengikuti preferensi sistem

## 🚀 Cara Penggunaan

### 1. Upload Gambar
- **Drag & Drop**: Seret gambar ke area upload
- **Click to Upload**: Klik area upload untuk memilih file
- **Multiple Files**: Pilih beberapa gambar sekaligus

### 2. Atur Pengaturan
- **Kualitas**: Sesuaikan kualitas kompresi (10-100%)
- **Dimensi**: Atur lebar/tinggi maksimal (opsional)
- **Format**: Pilih format output atau pertahankan format asli
- **Metadata**: Pilih apakah metadata EXIF dipertahankan

### 3. Kompres Gambar
- **Kompres Semua**: Proses semua gambar yang dipilih
- **Kompres Individual**: Proses satu gambar tertentu
- **Pilih Gambar**: Gunakan checkbox untuk memilih gambar yang akan dikompres

### 4. Download Hasil
- **Download Individual**: Download satu hasil kompresi
- **Download Semua**: Download semua hasil sekaligus
- **Preview**: Lihat preview hasil kompresi

## 🛠️ Teknologi yang Digunakan

- **HTML5** - Struktur aplikasi
- **CSS3** - Styling dan responsive design
- **JavaScript (ES6+)** - Logika aplikasi
- **Canvas API** - Kompresi gambar
- **File API** - Penanganan file upload
- **Local Storage** - Penyimpanan pengaturan
- **Service Worker** - PWA functionality
- **Web App Manifest** - Installable app

## 📱 Format yang Didukung

### Input Formats
- **JPEG/JPG** - Joint Photographic Experts Group
- **PNG** - Portable Network Graphics
- **WebP** - Web Picture format
- **GIF** - Graphics Interchange Format

### Output Formats
- **JPEG** - Optimal untuk foto dengan kompresi lossy
- **PNG** - Optimal untuk gambar dengan transparansi
- **WebP** - Format modern dengan kompresi superior
- **Original** - Pertahankan format asli

## ⚙️ Pengaturan Kompresi

### Kualitas Gambar
- **10-30%**: Kompresi tinggi, ukuran file kecil
- **40-60%**: Kompresi sedang, kualitas baik
- **70-90%**: Kompresi rendah, kualitas tinggi
- **100%**: Tanpa kompresi, kualitas maksimal

### Resize Dimensi
- **Auto**: Pertahankan dimensi asli
- **Max Width**: Batasi lebar maksimal
- **Max Height**: Batasi tinggi maksimal
- **Aspect Ratio**: Dimensi dihitung otomatis

## 🔧 Instalasi dan Pengembangan

### Prerequisites
- Node.js 14.0.0 atau lebih baru
- npm atau yarn

### Setup Development
```bash
# Clone repository
git clone https://github.com/omeans-team/image-compressor.git
cd image-compressor

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Scripts Available
- `npm start` - Start HTTP server
- `npm run dev` - Start live development server
- `npm run build` - Build for production
- `npm run deploy` - Deploy to GitHub Pages

## 📊 Performa dan Optimasi

### Kompresi Ratio
- **JPEG**: 60-80% pengurangan ukuran file
- **PNG**: 20-50% pengurangan ukuran file
- **WebP**: 70-90% pengurangan ukuran file
- **GIF**: 10-30% pengurangan ukuran file

### Browser Support
- **Chrome** 60+
- **Firefox** 55+
- **Safari** 11+
- **Edge** 79+

### Mobile Support
- **iOS Safari** 11+
- **Chrome Mobile** 60+
- **Samsung Internet** 8+

## 🔒 Privasi dan Keamanan

- **Client-Side Processing** - Semua kompresi dilakukan di browser
- **No Server Upload** - Gambar tidak dikirim ke server
- **Local Storage Only** - Pengaturan disimpan lokal
- **No Tracking** - Tidak ada tracking atau analytics
- **Open Source** - Kode sumber terbuka dan dapat diaudit

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Tim Pengembang

- **OMEANS Team** - Lead Development
- **Aris Hadisopiyan** - Full-Stack Developer & Game Developer

## 📞 Kontak

- **Website**: [https://omeans-team.github.io](https://omeans-team.github.io)
- **Email**: contact@omeans-team.github.io
- **GitHub**: [https://github.com/omeans-team](https://github.com/omeans-team)

## 🙏 Acknowledgments

- [Inter Font](https://rsms.me/inter/) - Typography
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - Image processing
- [PWA Documentation](https://web.dev/progressive-web-apps/) - Progressive Web App guidance

## 📈 Roadmap

### Version 1.1.0
- [ ] Batch download as ZIP
- [ ] Advanced compression algorithms
- [ ] Image format detection
- [ ] Compression preview

### Version 1.2.0
- [ ] Image editing tools
- [ ] Watermark addition
- [ ] Batch rename
- [ ] Cloud storage integration

### Version 2.0.0
- [ ] AI-powered compression
- [ ] Advanced filters
- [ ] Image optimization suggestions
- [ ] API integration

---

**Dibuat dengan ❤️ oleh OMEANS Team untuk komunitas**
