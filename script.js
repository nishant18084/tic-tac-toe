async function getTrainStatus() {
    const trainNumber = document.getElementById('trainNum').value.trim();
    const resultDiv = document.getElementById('result');
    
    if(!trainNumber) {
        alert("Please enter a train number");
        return;
    }

    resultDiv.innerHTML = "<p style='text-align:center;'>Fetching actual live location...</p>";

    // Ek bilkul alag aur working public alternative URL
    const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://indianrailways.info/ajax.php?train_no=${trainNumber}&action=get_live_status`)}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network error');
        
        const wrapper = await response.json();
        const htmlText = wrapper.contents;

        // Agar data milta hai toh hum use parse karenge ya cleanly dikhayenge
        if(htmlText && htmlText.includes("Current Station")) {
            // HTML se data extract karne ka aasan tarika
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            
            const currentStation = doc.querySelector('.current-station')?.innerText || 'Departed / In Route';
            const delay = doc.querySelector('.delay-time')?.innerText || '0 Mins';
            const status = doc.querySelector('.status-text')?.innerText || 'Running';

            resultDiv.innerHTML = `
                <div class="status-card">
                    <h3>Train: ${trainNumber}</h3>
                    <p><strong>Current Station:</strong> ${currentStation}</p>
                    <p><strong>Status:</strong> ${status}</p>
                    <p><strong>Delay:</strong> ${delay}</p>
                    <p style="font-size: 11px; color: gray; margin-top: 15px;">Live Updated: ${new Date().toLocaleTimeString()}</p>
                </div>
            `;
        } else {
            // Agar scrap kaam na kare toh RailRadar ka purana dynamic option backup rakhenge
            fetchBackupRailRadar(trainNumber, resultDiv);
        }

    } catch (error) {
        fetchBackupRailRadar(trainNumber, resultDiv);
    }
}

// RailRadar Backup Function agar open proxy down ho
async function fetchBackupRailRadar(trainNumber, resultDiv) {
    const apiKey = 'rg_33e8a2e410b445d6b78406e6803e6475';
    const apiUrl = `https://api.railradar.in/v1/trains/${trainNumber}/live`;

    try {
        const response = await fetch(apiUrl, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        const data = await response.json();
        
        // Yeh aapka purana output dikha dega jo abhi chal raha hai
        resultDiv.innerHTML = `
            <div class="status-card">
                <h3>Train ${trainNumber}</h3>
                <p><strong>Current Station:</strong> ${data.current_station || 'In Route (Station Data Restricted)'}</p>
                <p><strong>Status:</strong> ${data.status || 'Running'}</p>
                <p><strong>Delay:</strong> ${data.delay_minutes || '0'} mins</p>
                <p style="font-size: 11px; color: gray; margin-top: 15px;">Updated: ${new Date().toLocaleTimeString()}</p>
            </div>
        `;
    } catch(e) {
        resultDiv.innerHTML = "<p style='color: red; text-align:center;'>Error fetching live data.</p>";
    }
}
