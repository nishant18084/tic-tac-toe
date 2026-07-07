async function getTrainStatus() {
    const trainNumber = document.getElementById('trainNum').value.trim();
    const resultDiv = document.getElementById('result');
    
    if(!trainNumber) {
        alert("Please enter a train number");
        return;
    }

    resultDiv.innerHTML = "<p style='text-align:center;'>Live status dhoondh rahe hain...</p>";

    // Aapki asli RailRadar API Key jo screenshot me dikh rahi hai
    const apiKey = 'rg_33e8a2e410b445d6b78406e6803e6475';
    
    // RailRadar ka asli standard API link
    const apiUrl = `https://api.railradar.in/v1/trains/${trainNumber}/live`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                // RailRadar portal ke anusaar Authorization header ka istemal
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Asli Data:", data);

        // Agar API se sahi data aata hai toh use screen par dikhana
        const trainName = data.train_name || data.name || `Train ${trainNumber}`;
        const currentStation = data.current_station || data.station || 'Information Not Available';
        const runningStatus = data.status || 'Running';
        const delay = data.delay_minutes !== undefined ? data.delay_minutes : '0';

        resultDiv.innerHTML = `
            <div class="status-card">
                <h3>${trainName}</h3>
                <p><strong>Current Station:</strong> ${currentStation}</p>
                <p><strong>Status:</strong> ${runningStatus}</p>
                <p><strong>Delay:</strong> ${delay} mins</p>
                <p style="font-size: 11px; color: gray; margin-top: 15px;">Last Updated: ${new Date().toLocaleTimeString()}</p>
            </div>
        `;

    } catch (error) {
        // Agar chalte-chalte koi dikkat aaye toh uske liye error handling
        resultDiv.innerHTML = "<p style='color: red; text-align:center;'>Error fetching data. Kripya train number check karein ya thodi der baad prayas karein.</p>";
        console.error("Error details:", error);
    }
}
