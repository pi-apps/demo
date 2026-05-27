console.log("Cookies Policy page loaded");

// Optional: Smooth scroll to sections if needed
document.querySelectorAll('.cookie-section h2').forEach(section => {
    section.addEventListener('click', () => {
        section.scrollIntoView({ behavior: 'smooth' });
    });
});
