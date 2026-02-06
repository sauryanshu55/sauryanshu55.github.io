// Second question page - Moving No button logic (same as Q1)
document.addEventListener('DOMContentLoaded', function() {
    const noButton = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    const buttonContainer = document.getElementById('buttonContainer');
    
    let hasInteractedWithNo = false;
    let yesButtonTimeout;

    // Function to move the No button
    function moveNoButton() {
        if (!hasInteractedWithNo) {
            hasInteractedWithNo = true;
            startYesButtonTimer();
        }

        const container = buttonContainer.getBoundingClientRect();
        const button = noButton.getBoundingClientRect();
        
        // Calculate available space
        const maxX = container.width - button.width;
        const maxY = container.height - button.height;
        
        // Generate random position, ensuring it's different from current position
        let newX, newY;
        do {
            newX = Math.random() * Math.max(maxX, 0);
            newY = Math.random() * Math.max(maxY, 0);
        } while (
            Math.abs(newX - parseFloat(noButton.style.left || 0)) < 50 &&
            Math.abs(newY - parseFloat(noButton.style.top || 0)) < 50
        );
        
        // Apply new position
        noButton.style.left = newX + 'px';
        noButton.style.top = newY + 'px';
    }

    // Function to start the Yes button timer
    function startYesButtonTimer() {
        yesButtonTimeout = setTimeout(() => {
            yesButton.classList.remove('hidden');
            yesButton.style.animation = 'fadeIn 0.5s ease-in';
        }, 8000);
    }

    // Desktop: mouseover event
    noButton.addEventListener('mouseenter', function(e) {
        e.preventDefault();
        moveNoButton();
    });

    // Mobile: touchstart event (before touchend/click)
    noButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        moveNoButton();
    }, { passive: false });

    // Prevent click on No button
    noButton.addEventListener('click', function(e) {
        e.preventDefault();
        moveNoButton();
    });

    // Yes button click
    yesButton.addEventListener('click', function() {
        window.location.href = 'valentine-reveal.html';
    });

    // Initialize button container to allow absolute positioning
    buttonContainer.style.position = 'relative';
    buttonContainer.style.minHeight = '150px';
    
    // Set initial position for No button
    noButton.style.position = 'absolute';
    noButton.style.left = '50%';
    noButton.style.top = '50%';
    noButton.style.transform = 'translate(-50%, -50%)';
});
