# IDN Media Auth API

/*
 * IDN Media Auth API handler
 *
 * Login ke Cognito, login SSO, ambil progress tier, lalu logout & revoke.
 * Disiapkan untuk dideploy (contoh: di Vercel).
 *
 * ✅ CORS: Allow all origins
 * 📄 Endpoint: POST ke root URL (default, tidak pakai folder /api)
 *
 * File: app.js
 */


// 📌 Cara Deploy
/*
 * 1. Letakkan file `app.js` di root project.
 * 2. Deploy ke Vercel (atau server lain yang menjalankan Node.js).
 * 3. Endpoint siap diakses: POST ke https://<your-project>.vercel.app/
 */


// 📌 Cara Pakai
/*
 * Method: POST
 * URL: /
 * Headers: Content-Type: application/json
 *
 * Body:
 * {
 *   "username": "your_username",
 *   "password": "your_password"
 * }
 */


// 📌 Contoh: curl
/*
curl -X POST https://<your-project>.vercel.app/ \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'
*/


// 📌 Contoh: Browser fetch
/*
fetch("https://<your-project>.vercel.app/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    username: "your_username",
    password: "your_password"
  })
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
*/


// 📌 Response: Success
/*
{
  loginBySSO: { ... },
  progress: { ... },
  logout: "Logout global berhasil",
  revoke: "Revoke token berhasil"
}
*/


// 📌 Response: Error
/*
{
  error: "Pesan error"
}
*/


// 📌 CORS
/*
 * Handler ini sudah otomatis menyertakan header:
 * Access-Control-Allow-Origin: *
 * Access-Control-Allow-Methods: POST, OPTIONS
 * Access-Control-Allow-Headers: Content-Type
 *
 * Jadi aman untuk diakses lintas-origin dari browser.
 */
