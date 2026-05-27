// Accordion functionality
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
        // Close other open answers
        faqItems.forEach(i => {
            if (i !== item) i.querySelector(".faq-answer").style.maxHeight = null;
        });

        // Toggle current answer
        if (answer.style.maxHeight) {
            answer.style.maxHeight = null;
        } else {
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
});
