# Monitoring-mini-garden

Smart Greenhouse Control
Deskripsi Proyek
Smart Greenhouse Control adalah sistem pemantauan dan pengendalian lingkungan rumah kaca berbasis web yang terintegrasi dengan mikrokontroler ESP32. Sistem ini memungkinkan pengguna untuk memantau data sensor (suhu, kelembapan, kelembapan tanah, dan intensitas cahaya) secara real-time, mengontrol aktuator (pompa air dan ventilasi servo) secara manual, serta melihat riwayat data sensor. Website ini menggunakan HTML, CSS, dan JavaScript tanpa framework, dengan integrasi Firebase Realtime Database untuk komunikasi dengan ESP32.
Struktur Folder
/project
├── index.html        # Struktur utama website
├── styles.css        # Gaya visual website
├── script.js         # Logika JavaScript untuk pembaruan data dan kontrol
├── smart_greenhouse_firebase.ino  # Kode Arduino untuk ESP32
├── README.md         # Dokumentasi proyek (file ini)

Fitur

Dashboard: Menampilkan data sensor (suhu, kelembapan, kelembapan tanah, intensitas cahaya) dan status aktuator (pompa, ventilasi, indikator LED).
Kontrol Manual: Tombol untuk memicu penyiraman manual selama 3 detik.
Riwayat Sensor: Tabel yang menampilkan 10 data sensor terakhir dengan cap waktu.
Integrasi Firebase: Mendukung pembaruan data real-time dari ESP32 melalui Firebase Realtime Database.
Desain Responsif: Antarmuka yang menyesuaikan dengan perangkat desktop dan mobile.

Prasyarat

Perangkat Keras:

ESP32 DevKit
Sensor DHT22 (suhu dan kelembapan)
Sensor kelembapan tanah
Sensor LDR (cahaya)
Tombol push
LED (merah, kuning, hijau)
Relay untuk pompa
Servo untuk ventilasi


Perangkat Lunak:

Arduino IDE dengan library:
DHTesp
ESP32Servo
WiFi
Firebase_ESP_Client


Firebase Realtime Database (buat proyek di Firebase Console).
Server lokal (misalnya, XAMPP, Node.js, atau VS Code Live Server) atau Firebase Hosting untuk website.


Koneksi Internet:

WiFi untuk ESP32.
Browser modern untuk mengakses website.



Cara Menjalankan
1. Menyiapkan Website

Simpan File:
Simpan index.html, styles.css, dan script.js dalam satu folder (misalnya, /project).


Konfigurasi Firebase:
Buka Firebase Console, buat proyek, dan aktifkan Realtime Database.
Salin konfigurasi Firebase (dari Project Settings > Your apps > Web) ke script.js pada bagian:const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};


Aktifkan listener Firebase di script.js:firebase.initializeApp(firebaseConfig);
const db = firebase.database();
db.ref('sensors').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        updateDashboard(data);
    }
});


Hapus kode simulasi (setInterval) di script.js.
Perbarui fungsi triggerManualWater untuk mengirim perintah ke Firebase:function triggerManualWater() {
    const btn = document.getElementById('manualWaterBtn');
    btn.disabled = true;
    btn.textContent = 'Watering...';
    db.ref('controls/manualWater').set(true);
    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Start Manual Watering';
        db.ref('controls/manualWater').set(false);
    }, 3000);
}




Jalankan Website:
Gunakan server lokal (misalnya, VS Code Live Server) dengan membuka index.html.
Atau, host di Firebase Hosting:
Instal Firebase CLI: npm install -g firebase-tools.
Login: firebase login.
Inisialisasi: firebase init hosting.
Deploy: firebase deploy.





2. Menyiapkan ESP32

Instal Library:
Instal library DHTesp, ESP32Servo, WiFi, dan Firebase_ESP_Client di Arduino IDE.


Konfigurasi Kode:
Buka smart_greenhouse_firebase.ino di Arduino IDE.
Ganti kredensial berikut:#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
#define API_KEY "YOUR_FIREBASE_API_KEY"
#define DATABASE_URL "https://your-project-id-default-rtdb.firebaseio.com/"




Upload Kode:
Hubungkan ESP32 ke komputer.
Upload kode ke ESP32 menggunakan Arduino IDE.
Buka Serial Monitor (115200 baud) untuk memeriksa koneksi WiFi dan Firebase.



3. Struktur Data Firebase
Pastikan struktur data di Firebase Realtime Database sesuai:
{
  "sensors": {
    "temperature": 20.5,
    "humidity": 60.0,
    "soilPct": 40,
    "lightPct": 70,
    "relayState": false,
    "servoPos": 0,
    "ledState": 3
  },
  "controls": {
    "manualWater": false
  }
}

4. Pengujian

ESP32:
Pastikan ESP32 terhubung ke WiFi dan Firebase (periksa Serial Monitor).
Data sensor harus dikirim ke /sensors setiap 2 detik.


Website:
Buka website di browser.
Periksa apakah data sensor diperbarui secara real-time.
Klik tombol "Start Manual Watering" untuk memastikan ESP32 menjalankan penyiraman (relay ON, servo ke 90° selama 3 detik).


Debugging:
Gunakan Firebase Console untuk memeriksa data di /sensors dan /controls/manualWater.
Buka browser Console (F12) untuk memeriksa error JavaScript.



Aturan Keamanan Firebase
Untuk pengujian, gunakan aturan berikut di Firebase Realtime Database:
{
  "rules": {
    ".read": "true",
    ".write": "true"
  }
}

Catatan: Untuk produksi, perketat aturan dengan autentikasi, misalnya:
{
  "rules": {
    "sensors": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "controls": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}

