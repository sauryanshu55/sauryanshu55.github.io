// Password validation for Valentine's entry
document.addEventListener('DOMContentLoaded', function() {
    const passwordForm = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');

    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = passwordInput.value.trim();
        
        if (password === 'honeycat') {
            window.location.href = 'valentine-reveal.html';
        } else {
            // Wrong password
            errorMessage.textContent = '❌ Incorrect password. Try again!';
            passwordInput.value = '';
            passwordInput.focus();
            
            // Shake animation
            passwordInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                passwordInput.style.animation = '';
            }, 500);
        }
    });

    // Clear error message when user starts typing
    passwordInput.addEventListener('input', function() {
        errorMessage.textContent = '';
    });
});

// Add shake animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);
