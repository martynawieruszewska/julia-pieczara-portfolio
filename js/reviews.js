document.addEventListener("DOMContentLoaded", async () => {
    const track = document.querySelector(".reviews-track");

    if (!track) {
        return;
    }

    try {
        const response = await fetch("data/opinie.json");

        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }

        const reviews = await response.json();

        const visibleReviews = reviews.slice(0, 3);

        visibleReviews.forEach((review, index) => {
            const item = document.createElement("article");
            item.classList.add("review-item");

            if (index === 1) {
                item.classList.add("is-active");
            }

            item.innerHTML = `
                <div class="review-card">
                    <p class="review-text">${review.opinia}</p>
                </div>

                <p class="review-author">
                    <span class="review-author__name">${review.imie},</span>
                    <strong class="review-author__company">${review.firma}</strong>
                </p>
            `;

            track.appendChild(item);
        });

    } catch (error) {
        console.error("Nie udało się załadować opinii:", error);
    }
});