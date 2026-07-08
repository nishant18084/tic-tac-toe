function getTrainStatus() {
    const trainNumber = document.getElementById('trainNum').value.trim();
    const resultDiv = document.getElementById('result');
    
    if(!trainNumber || trainNumber.length !== 5 || isNaN(trainNumber)) {
        alert("Please enter a valid 5-digit train number");
        return;
    }

    resultDiv.innerHTML = "<p style='color: #0b6623; font-weight: bold; text-align:center;'>Locating Train via GPS...</p>";

    // Alag-alag train groups ke liye unique data pools
    const stationData = {
        pool1: {
            source: "Howrah Junction (HWH)",
            mid: "Barddhaman Jn (BWN)",
            dest: "Patna Junction (PNBE)",
            platform: "5",
            time1: "08:15 AM", time2: "11:30 AM", time3: "04:45 PM"
        },
        pool2: {
            source: "New Delhi (NDLS)",
            mid: "Kanpur Central (CNB)",
            dest: "Lucknow Charbagh (LKO)",
            platform: "3",
            time1: "06:00 AM", time2: "10:15 AM", time3: "01:30 PM"
        },
        pool3: {
            source: "Mumbai Central (MMCT)",
            mid: "Surat Junction (ST)",
            dest: "Ahmedabad Jn (ADI)",
            platform: "1",
            time1: "11:40 PM", time2: "03:20 AM", time3: "07:10 AM"
        }
    };

    // Train number ke aakhiri digit se dynamic routing select karna
    const lastDigit = parseInt(trainNumber.slice(-1));
    let selectedRoute;

    if (lastDigit % 3 === 0) {
        selectedRoute = stationData.pool1;
    } else if (lastDigit % 3 === 1) {
        selectedRoute = stationData.pool2;
    } else {
        selectedRoute = stationData.pool3;
    }

    // Delay time calculation based on second digit (e.g. On time, 10 min late, 25 min late)
    const secondDigit = parseInt(trainNumber[1]) || 0;
    let delayText = "On Time";
    let delayClass = "status-onTime";
    if (secondDigit > 5) {
        delayText = `${secondDigit * 4} Mins Late`;
        delayClass = "status-lateTime";
    }

    // Generating 'Where Is My Train' matching HTML interface
    setTimeout(() => {
        resultDiv.innerHTML = `
            <div class="train-info-header">
                <span class="live-indicator">● LIVE GPS STATUS</span> 
                <strong>Train: ${trainNumber}</strong>
            </div>
            
            <div class="timeline">
                <div class="timeline-item reached">
                    <div class="timeline-icon">✓</div>
                    <div class="timeline-content">
                        <h4>${selectedRoute.source}</h4>
                        <p class="time">Departed • ${selectedRoute.time1}</p>
                    </div>
                </div>
                
                <div class="timeline-item current">
                    <div class="timeline-icon pulse">➔</div>
                    <div class="timeline-content">
                        <h4>${selectedRoute.mid}</h4>
                        <p class="${delayClass}">Arrived • Platform ${selectedRoute.platform} (${delayText})</p>
                    </div>
                </div>

                <div class="timeline-item upcoming">
                    <div class="timeline-icon">•</div>
                    <div class="timeline-content">
                        <h4>${selectedRoute.dest}</h4>
                        <p class="time">Scheduled Target • ${selectedRoute.time3}</p>
                    </div>
                </div>
            </div>
            
            <p style="font-size:11px; text-align:center; color:gray; margin-top:15px;">
                Updated: Just Now (Simulated Live Tracker)
            </p>
        `;
    }, 400);
}
