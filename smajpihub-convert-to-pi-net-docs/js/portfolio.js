// Filter Portfolio
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;
        portfolioItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Stats Counters
function animateValue(id, start, end, duration) {
    let obj = document.getElementById(id);
    let current = start;
    let range = end - start;
    let increment = end > start ? 1 : -1;
    let stepTime = Math.abs(Math.floor(duration / range));
    let timer = setInterval(() => {
        current += increment;
        obj.textContent = current;
        if (current == end) clearInterval(timer);
    }, stepTime);
}

animateValue("projectsCompleted", 0, 120, 2000);
animateValue("clientsServed", 0, 85, 2000);
animateValue("revenuePi", 0, 250, 2000); // Pi balance in numbers
animateValue("satisfaction", 0, 98, 2000);
