async function getTrainStatus() {
    const trainNumber = document.getElementById('trainNum').value.trim();
    const resultDiv = document.getElementById('result');
    
    if(!trainNumber || trainNumber.length !== 5 || isNaN(trainNumber)) {
        alert("Please enter a valid 5-digit train number");
        return;
    }

    resultDiv.innerHTML = "<p style='color: #e50914; font-weight: bold; text-align:center;'>📡 Accessing Live National Train Database...</p>";

    // RailYatri public JSON feed via ultra-fast corsproxy
    const apiUrl = `https://corsproxy.io/?${encodeURIComponent('https://images.railyatri.in/live_status/' + trainNumber + '/today.json')}`;

    // 4-second hard timeout setting taaki code kabhi loading par na atke
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Server Down");
        
        const data = await response.json();

        if (data && data.data && data.data.station_statuses) {
            let trainName = data.data.train_name || "Express";
            let currentStn = data.data.current_station_name || "In Transit";
            let delayText = data.data.delay_text || "On Time";

            let htmlOutput = `
                <div class="train-info-header">
                    <span class="live-indicator">● LIVE TRACK</span> 
                    <strong>${trainName} (${trainNumber})</strong>
                </div>
                <div style="background:#1e293b; padding:8px; border-radius:6px; margin-bottom:10px; font-size:12px; color:#00ffcc; font-weight:bold; text-align:center; border: 1px solid #222f47;">
                    Current Status: ${currentStn} (${delayText})
                </div>
                <div class="timeline" style="max-height: 380px; overflow-y: auto;">
            `;

            data.data.station_statuses.forEach(stn => {
                let type = "upcoming";
                let icon = "•";
                let statusMessage = `Arr: ${stn.eta || '--'} | Dep: ${stn.etd || '--'}`;

                if (stn.has_arrived && stn.has_departed) {
                    type = "reached";
                    icon = "✓";
                    statusMessage = `Passed • Arr: ${stn.ata || stn.eta}`;
                } else if (!stn.has_departed && stn.has_arrived) {
                    type = "current";
                    icon = "➔";
                    statusMessage = `Current Station • Pf: ${stn.platform_number || '-'} (${stn.delay_in_minutes}m Late)`;
                }

                htmlOutput += `
                    <div class="timeline-item ${type}">
                        <div class="timeline-icon ${type === 'current' ? 'pulse' : ''}">${icon}</div>
                        <div class="timeline-content">
                            <h4>${stn.station_name}</h4>
                            <p class="${type === 'current' ? 'status-onTime' : 'time'}">${statusMessage}</p>
                        </div>
                    </div>
                `;
            });

            htmlOutput += `</div>`;
            resultDiv.innerHTML = htmlOutput;
        } else {
            resultDiv.innerHTML = `<p style='color:#e50914; text-align:center; font-weight:bold;'>Train status not updated yet or incorrect number.</p>`;
        }
    } catch (e) {
        clearTimeout(timeoutId);
        resultDiv.innerHTML = `
            <div style="background:#fee2e2; border: 1px solid #fca5a5; padding: 15px; border-radius: 10px; text-align: center; color: #b91c1c;">
                <h4 style="margin: 0 0 5px 0;">📡 Connection Timeout</h4>
                <p style="margin: 0; font-size: 13px; color: #ef4444;">Server respond nahi kar raha hai. Kripya 2 seconds baad dobara SEARCH dabayein.</p>
            </div>
        `;
    }
}

function updateLiveClock() {
    const clockElement = document.getElementById('liveClock');
    if (!clockElement) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    clockElement.innerText = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
}
setInterval(updateLiveClock, 1000);
window.onload = function() { updateLiveClock(); };
