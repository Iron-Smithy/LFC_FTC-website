document.querySelectorAll('.member-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.member-card').forEach(c => {
            if (c !== card) c.classList.remove('active');
        });

        // Toggle the clicked one
        card.classList.toggle('active');
    });
});