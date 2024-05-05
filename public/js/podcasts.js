
document.addEventListener("DOMContentLoaded", function() {
const accordionItems = document.querySelectorAll(".accordion-item");

accordionItems.forEach(function(item) {
    const toggle = item.querySelector(".accordion-toggle");
    const content = item.querySelector(".accordion-content");

    toggle.addEventListener("click", function() {
    content.style.display = (content.style.display === "none") ? "block" : "none";
    toggle.textContent = (content.style.display === "none") ? "+" : "-";
    });
});
});

const listenLink = document.getElementById('listen-link');

listenLink.addEventListener('click', function(event) {
    if (!window.confirm('Are you sure you want to leave this page?')) {
        event.preventDefault();
    }
});
