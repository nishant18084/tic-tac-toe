function getTrainStatus() {
    const trainNumber = document.getElementById('trainNum').value.trim();
    const resultDiv = document.getElementById('result');
    
    if(!trainNumber) {
        alert("Please enter a 5-digit train number");
        return;
    }

    if(trainNumber.length !== 5 || isNaN(trainNumber)) {
        alert("Please enter a valid 5-digit train number");
        return;
    }

    resultDiv.innerHTML = "<p style='color: #0b6623; font-weight: bold;'>Loading Live 'Where Is My Train' Dashboard...</p>";

    // Mobile-friendly fully dynamic visual live widget URL
    const embeddedTrackerUrl = `https://railbeeps.com/train-running-status/${trainNumber}?embed=true`;

    // Iframe ke zariye live dashboard ko app ke andar load karna
    setTimeout(() => {
        resultDiv.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #334155; text-align: left;">
                Live Route Map & Station Updates (Train: ${trainNumber})
            </div>
            <iframe class="status-frame" src="${embeddedTrackerUrl}" allowfullscreen></iframe>
        `;
    }, 1000);
}
