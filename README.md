# Bot Glints Auto Applied

Deskripsi singkat proyek disini.

## Cara Install

1. Clone repositori :

```bash
git clone https://github.com/mhrdwan/bot-auto-applied-glints
```

2. Masuk ke direktori proyek:

```bash
cd bot-auto-applied-glints
```

3. Download extension untuk mengambil cookies dari glints

```bash
https://chromewebstore.google.com/detail/j2team-cookies/okpidcojinmlaakglciglbpcpajaibco
```

4. Login akun glints kalian `https://glints.com/`

5. Setelah login akun glints , kalian buka extension yang sudah kalian download tadi , kemudian klik `Export` dan tunggu download selesai

6. Buka hasil export tadi kemudian copy dan pastekan ke file `cookies.json`

7. Buka https://glints.com/id/opportunities/jobs/explore?country=ID&locationName=All+Cities%2FProvinces kemudian pilih filter / job yang ingin di scrap kemudian copy urlnya

8. Buka file `isian.js` menggunakan editor teks favorit Anda.

9. Ganti const urlpencarian = 'https://glints.com/id/opportunities/jobs/explore?keyword=react&country=ID&locationName=All+Cities%2FProvinces' dengan url yang ingin kalian scraping

10. Buka file `functionlamar.js`

11. Buka terminal kalian dan ketikan

```bash
npm install
```

12. Jalankan Script

```bash
node index.js
```
