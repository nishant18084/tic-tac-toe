async function getTrainStatus() {
    const trainNumber = document.getElementById('trainNum').value.trim();
    const resultDiv = document.getElementById('result');
    
    // Check agar input khali hai
    if(!trainNumber) {
        alert("Please enter a train number");
        return;
    }

    resultDiv.innerHTML = "<p style='text-align:center;'>Fetching live status, please wait...</p>";

    // Aapki di hui API Key
    const apiKey = 'rg_33e8a2e410b445d6b78406e6803e6475'; 
    
    // Railradar/RapidAPI ka endpoint
    const apiUrl = `https://railradar.p.rapidapi.com/v1/trains/${trainNumber}/live`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'railradar.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            throw new Error('API Request Failed');
        }

        const data = await response.json();
        
        // Data ko HTML par set karna
        resultDiv.innerHTML = `
            <div class="status-card">
                <h3>Train: ${data.train_name || trainNumber}</h3>
                <p><strong>Current Station:</strong> ${data.current_station || 'N/A'}</p>
                <p><strong>Status:</strong> ${data.status || 'Running'}</p>
                <p><strong>Delay:</strong> ${data.delay_minutes || '0'} mins</p>
                <p style="font-size: 11px; color: gray; margin-top: 15px;">Last Updated: ${new Date().toLocaleTimeString()}</p>
            </div>
        `;

    } catch (error) {
        resultDiv.innerHTML = "<p style='color: red; text-align:center;'>Error fetching data. Please check your connection or Train Number.</p>";
        console.error("Error:", error);
    }
}
