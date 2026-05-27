// Category filter
const categoryButtons = document.querySelectorAll(".category");
const postsGrid = document.getElementById("postsGrid");

categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".category.active").classList.remove("active");
        btn.classList.add("active");
        const category = btn.getAttribute("data-category");
        filterPosts(category);
    });
});

function filterPosts(category) {
    const posts = postsGrid.querySelectorAll(".post-card");
    posts.forEach(post => {
        if (category === "all" || post.getAttribute("data-category") === category) {
            post.style.display = "block";
        } else {
            post.style.display = "none";
        }
    });
}

console.log("Community page loaded");
