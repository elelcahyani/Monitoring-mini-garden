const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    databaseURL: "YOUR_DATABASE_URL",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Update dashboard with new data
function updateDashboard(data) {
    document.getElementById('temperature').textContent = `${data.temperature.toFixed(1)} °C`;
    document.getElementById('humidity').textContent = `${data.humidity.toFixed(1)} %`;
    document.getElementById('soilMoisture').textContent = `${data.soilPct} %`;
    document.getElementById('lightLevel').textContent = `${data.lightPct} %`;
    document.getElementById('pumpStatus').textContent = data.relayState ? 'ON' : 'OFF';
    document.getElementById('pumpIndicator').className = `indicator ${data.relayState ? 'green' : 'off'}`;
    document.getElementById('ventStatus').textContent = data.servoPos === 90 ? 'Open' : 'Closed';
    document.getElementById('ventAngle').textContent = `${data.servoPos}°`;
    document.getElementById('ledStatus').textContent = data.ledState === 1 ? 'Yellow' : data.ledState === 2 ? 'Red' : 'Green';
    document.getElementById('ledIndicator').className = `indicator ${data.ledState === 1 ? 'yellow' : data.ledState === 2 ? 'red' : 'green'}`;

    // Update status based on thresholds
    document.getElementById('tempStatus').textContent = data.temperature > 32 ? 'High' : 'Normal';
    document.getElementById('humStatus').textContent = data.humidity < 40 ? 'Low' : data.humidity > 80 ? 'High' : 'Normal';
    document.getElementById('soilStatus').textContent = data.soilPct < 30 ? 'Dry' : 'Normal';
    document.getElementById('lightStatus').textContent = data.lightPct < 30 ? 'Low' : 'Normal';

    // Update history table
    const historyTable = document.getElementById('historyTable');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${new Date().toLocaleString()}</td>
        <td>${data.temperature.toFixed(1)}</td>
        <td>${data.humidity.toFixed(1)}</td>
        <td>${data.soilPct}</td>
        <td>${data.lightPct}</td>
    `;
    historyTable.prepend(row);
    if (historyTable.children.length > 10) {
        historyTable.removeChild(historyTable.lastChild);
    }
}

// Firebase real-time listener
db.ref('sensors').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        updateDashboard(data);
    }
});

// Trigger manual watering
function triggerManualWater() {
    const btn = document.getElementById('manualWaterBtn');
    btn.disabled = true;
    btn.textContent = 'Watering...';
    // Send command to Firebase
    db.ref('controls/manualWater').set(true);
    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Start Manual Watering';
        db.ref('controls/manualWater').set(false);
    }, 3000);
}