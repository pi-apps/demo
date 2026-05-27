// Simple form submission handler (to be connected with backend later)
const collabForm = document.querySelector(".collab-form form");
collabForm.addEventListener("submit", function(e){
  e.preventDefault();
  alert("Thank you for submitting! Our team will reach out to you.");
  collabForm.reset();
});

console.log("Collaborate page loaded successfully");
