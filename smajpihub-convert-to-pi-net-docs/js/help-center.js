// Optional: Can expand hover details on click for touch devices
const helpCards = document.querySelectorAll(".help-card");

helpCards.forEach(card => {
    card.addEventListener("click", () => {
        const details = card.querySelector(".help-details");
        const isOpen = details.style.maxHeight && details.style.maxHeight !== "0px";
        helpCards.forEach(c => c.querySelector(".help-details").style.maxHeight = "0");
        if (!isOpen) {
            details.style.maxHeight = details.scrollHeight + "px";
        }
    });
});

console.log("Help Center loaded");
