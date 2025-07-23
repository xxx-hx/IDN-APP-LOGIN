📦 IDN Media Auth API
API sederhana untuk login IDN Media (Cognito), login SSO, ambil progress tier, lalu logout & revoke token.
Ditulis dengan Node.js, sudah mendukung CORS (allow all) sehingga bisa diakses lintas-origin.
Handler langsung pada root (tidak di dalam folder /api), file bernama app.js.

🚀 Fitur
Login ke AWS Cognito IDN Media (USER_PASSWORD_AUTH)

Login ke SSO IDN App

Ambil progress tier

Global Sign Out

Revoke refresh token

Allow semua CORS (Access-Control-Allow-Origin: *)

📂 Struktur
app.js → handler utama

Tidak perlu folder /api

POST ke URL default root deploy

🛠️ Cara Deploy
📌 Local Development
Jika ingin coba lokal:

bash
Salin
Edit
npm install
node app.js
(opsional: gunakan server HTTP seperti Express untuk local testing)

📌 Deploy di Vercel
Letakkan file ini (app.js) di root project.

Deploy ke Vercel.

Endpoint bisa diakses pada:

cpp
Salin
Edit
https://<project>.vercel.app/
📡 Cara Pakai
Endpoint
POST https://<project>.vercel.app/

Request body:
json
Salin
Edit
{
  "username": "email/username",
  "password": "password"
}
Header: Content-Type: application/json

Contoh Request: curl
bash
Salin
Edit
curl -X POST https://<project>.vercel.app/ \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'
Contoh Request: JavaScript (browser)
js
Salin
Edit
fetch('https://<project>.vercel.app/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'your_username', password: 'your_password' })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
Response
Berhasil:

json
Salin
Edit
{
  "loginBySSO": { ... },
  "progress": { ... },
  "logout": "Logout global berhasil",
  "revoke": "Revoke token berhasil"
}
Gagal:

json
Salin
Edit
{
  "error": "Pesan error"
}
🌐 CORS
Header CORS yang sudah disiapkan:

pgsql
Salin
Edit
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Handler ini juga merespons OPTIONS (preflight) dengan 204 No Content dan header yang sesuai.
