console.log("Report Abuse page loaded");

// Form submission simulation
const form = document.getElementById('abuseForm');
form.addEventListener('submit', e => {
    e.preventDefault();
    alert("Thank you! Your report has been submitted successfully.");
    form.reset();
});
