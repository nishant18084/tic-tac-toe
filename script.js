function getTrainStatus() {
    const trainNumber = document.getElementById('trainNum').value.trim();
    const resultDiv = document.getElementById('result');
    
    if(!trainNumber || trainNumber.length !== 5 || isNaN(trainNumber)) {
        alert("Please enter a valid 5-digit train number");
        return;
    }

    resultDiv.innerHTML = "<p style='color: #0b6623; font-weight: bold; text-align:center;'>Searching Live Route...</p>";

    // "Where is my Train" vertical track UI generator
    setTimeout(() => {
        resultDiv.innerHTML = `
            <div class="train-info-header">
                <span class="live-indicator">● LIVE TRACKING</span> 
                <strong>Train: ${trainNumber}</strong>
            </div>
            
            <div class="timeline">
                <div class="timeline-item reached">
                    <div class="timeline-icon">✓</div>
                    <div class="timeline-content">
                        <h4>Howrah Junction (HWH)</h4>
                        <p class="time">Departed • 08:15 AM</p>
                    </div>
                </div>
                
                <div class="timeline-item current">
                    <div class="timeline-icon pulse">➔</div>
                    <div class="timeline-content">
                        <h4>Barddhaman Jn (BWN)</h4>
                        <p class="status-msgText">Arrived • Platform 5 (On Time)</p>
                    </div>
                </div>

                <div class="timeline-item upcoming">
                    <div class="timeline-icon">•</div>
                    <div class="timeline-content">
                        <h4>Patna Junction (PNBE)</h4>
                        <p class="time">Scheduled • 04:45 PM</p>
                    </div>
                </div>
            </div>
            
            <p style="font-size:11px; text-align:center; color:gray; margin-top:15px;">
                Last Updated: Just Now
            </p>
        `;
    }, 500);
}
