const contactForm = document.getElementById("contactForm");
const formResponse = document.getElementById("formResponse");

contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Simple validation
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();
    const serviceType = document.getElementById("serviceType").value;

    if (!name || !email || !subject || !message || !serviceType) {
        formResponse.style.color = "red";
        formResponse.textContent = "Please fill in all fields!";
        return;
    }

    // Simulate successful submission
    formResponse.style.color = "green";
    formResponse.textContent = "Your message has been sent successfully!";
    contactForm.reset();
});
