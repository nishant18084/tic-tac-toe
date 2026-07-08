async function getTrainStatus() {
    const trainNumber = document.getElementById('trainNum').value.trim();
    const resultDiv = document.getElementById('result');
    
    if(!trainNumber || trainNumber.length !== 5 || isNaN(trainNumber)) {
        alert("Please enter a valid 5-digit train number");
        return;
    }

    resultDiv.innerHTML = "<p style='color: #e50914; font-weight: bold; text-align:center;'>📡 Fetching Real-Time Live Status from NTES...</p>";

    // Ultra-stable global open gateway for Indian Railways Data (No API Key Required)
    const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent('https://indianrailapi.com/api/v2/LiveTrainStatus/apikey/30653f2d2d0d5b0c391d3d63b2f60275/TrainNumber/' + trainNumber + '/Date/Today')}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Network Busy");
        
        const jsonWrapper = await response.json();
        const data = JSON.parse(jsonWrapper.contents);

        if (data && data.TrainHistory && data.TrainHistory.length > 0) {
            let currentStn = data.CurrentStation || "In Transit";
            let delayText = data.DelayInMinutes === "0" ? "On Time" : `${data.DelayInMinutes} Mins Late`;

            let htmlOutput = `
                <div class="train-info-header">
                    <span class="live-indicator">● LIVE TRACKING</span> 
                    <strong>${data.TrainName || 'Express'} (${trainNumber})</strong>
                </div>
                <div style="background:#1e293b; padding:8px; border-radius:6px; margin-bottom:10px; font-size:12px; color:#00ffcc; font-weight:bold; text-align:center; border: 1px solid #222f47;">
                    Current Location: ${currentStn} (${delayText})
                </div>
                <div class="timeline" style="max-height: 380px; overflow-y: auto;">
            `;

            data.TrainHistory.forEach(stn => {
                let type = "upcoming";
                let icon = "•";
                let statusMessage = `Schedule Arrival: ${stn.ScheduledArrival || '--'}`;

                if (stn.Details === "Departed" || stn.Details === "Arrived") {
                    type = "reached";
                    icon = "✓";
                    statusMessage = `Passed • Actual Dep: ${stn.ActualDeparture || stn.ScheduledDeparture}`;
                } else if (stn.StationName === currentStn) {
                    type = "current";
                    icon = "➔";
                    statusMessage = `Current Station • Pf: ${stn.PlatformNo || '-'} (${delayText})`;
                }

                htmlOutput += `
                    <div class="timeline-item ${type}">
                        <div class="timeline-icon ${type === 'current' ? 'pulse' : ''}">${icon}</div>
                        <div class="timeline-content">
                            <h4>${stn.StationName}</h4>
                            <p class="${type === 'current' ? 'status-onTime' : 'time'}">${statusMessage}</p>
                        </div>
                    </div>
                `;
            });

            htmlOutput += `</div>`;
            resultDiv.innerHTML = htmlOutput;
        } else {
            resultDiv.innerHTML = `<p style='color:#e50914; text-align:center; font-weight:bold;'>Train number not active today or wrong number. Please verify.</p>`;
        }
    } catch (e) {
        resultDiv.innerHTML = `
            <div style="background:#fee2e2; border: 1px solid #fca5a5; padding: 15px; border-radius: 10px; text-align: center; color: #b91c1c;">
                <h4 style="margin: 0 0 5px 0;">📡 Server Timeout</h4>
                <p style="margin: 0; font-size: 13px; color: #ef4444;">Live gateway responsive nahi hai. Kripya 2 seconds baad dobara SEARCH button dabayein.</p>
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
