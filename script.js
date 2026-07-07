async function getTrainStatus() {
    const trainNumber = document.getElementById('trainNum').value.trim();
    const resultDiv = document.getElementById('result');
    
    if(!trainNumber) {
        alert("Please enter a train number");
        return;
    }

    resultDiv.innerHTML = "<p style='text-align:center;'>Fetching live status, please wait...</p>";

    // Aapki API Key
    const apiKey = 'rg_33e8a2e410b445d6b78406e6803e6475'; 
    
    // Direct API endpoint (Agar headers reject ho rahe hain toh isse direct parameter mein key jayegi)
    const apiUrl = `https://railradar.p.rapidapi.com/v1/trains/${trainNumber}/live?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('API Request Failed');
        }

        const data = await response.json();
        
        // Data display logic
        resultDiv.innerHTML = `
            <div class="status-card">
                <h3>Train: ${data.train_name || trainNumber}</h3>
                <p><strong>Current Station:</strong> ${data.current_station || 'Information Not Available'}</p>
                <p><strong>Status:</strong> ${data.status || 'Running'}</p>
                <p><strong>Delay:</strong> ${data.delay_minutes || '0'} mins</p>
                <p style="font-size: 11px; color: gray; margin-top: 15px;">Last Updated: ${new Date().toLocaleTimeString()}</p>
            </div>
        `;

    } catch (error) {
        resultDiv.innerHTML = "<p style='color: red; text-align:center;'>Error fetching data. Please check your API key subscription or Train Number.</p>";
        console.error("Error:", error);
    }
}
