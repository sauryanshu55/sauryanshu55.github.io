// Reveal page - Date check for Valentine's Day
document.addEventListener('DOMContentLoaded', function() {
    const cardButton = document.getElementById('cardButton');
    const messageContainer = document.getElementById('messageContainer');
    const cardContainer = document.getElementById('cardContainer');
    const revealTitle = document.querySelector('.reveal-title');

    cardButton.addEventListener('click', function() {
        // Hide the button after click
        cardButton.style.display = 'none';

        // Get current date
        const today = new Date();
        const month = today.getMonth(); // 0-indexed (0 = January, 1 = February)
        const day = today.getDate();

        // Check if it's February 14th
        if (month === 1 && day === 6) {
            // It's Valentine's Day! Hide title and show the card
            revealTitle.style.display = 'none';
            cardContainer.classList.remove('hidden');
        } else {
            // Not Valentine's Day yet
            messageContainer.classList.remove('hidden');
        }
    });
});