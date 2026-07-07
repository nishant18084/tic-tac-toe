function getTrainStatus() {
    const trainNumber = document.getElementById('trainNum').value.trim();
    const resultDiv = document.getElementById('result');
    
    if(!trainNumber) {
        alert("Please enter a 5-digit train number");
        return;
    }

    // Checking if it's a valid 5 digit train number format
    if(trainNumber.length !== 5 || isNaN(trainNumber)) {
        alert("Please enter a valid 5-digit train number");
        return;
    }

    resultDiv.innerHTML = `
        <div class="status-card" style="border-left: 5px solid #007bff; text-align: center;">
            <h3>Train ${trainNumber} Found</h3>
            <p>Redirecting you to the official Live Running Route tracker...</p>
            <p style="font-size: 12px; color: gray;">Loading maps and timetable data...</p>
        </div>
    `;

    // 1.5 seconds ka delay taaki animation complete dikhe, fir direct official map tracker open ho jaye
    setTimeout(() => {
        window.location.href = `https://enquiry.indianrail.gov.in/mntes/?opt=TrainRunningStatus&subOpt=SearchTrain&trainNo=${trainNumber}`;
    }, 1500);
}
