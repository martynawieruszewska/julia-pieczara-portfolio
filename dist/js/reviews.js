document.addEventListener("DOMContentLoaded", async () => {

    const track = document.querySelector(".reviews-track");
    const prevButton = document.querySelector(".reviews-arrow-prev");
    const nextButton = document.querySelector(".reviews-arrow-next");
    const dotsContainer = document.querySelector(".reviews-dots");

    if (!track) {
        return;
    }

    try {

        /* =====================================================
           LOAD REVIEWS
        ===================================================== */

        const response = await fetch("data/opinie.json");

        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }

        const reviews = await response.json();

        if (!Array.isArray(reviews) || reviews.length === 0) {
            return;
        }


        /* =====================================================
           STATE

           activeIndex = opinia znajdująca się na środku
        ===================================================== */

        let activeIndex = 1;


        /* =====================================================
           HELPERS
        ===================================================== */

        function getPreviousIndex(index) {
            return (index - 1 + reviews.length) % reviews.length;
        }

        function getNextIndex(index) {
            return (index + 1) % reviews.length;
        }


        /* =====================================================
           CREATE REVIEW
        ===================================================== */

        function createReviewItem(review, isActive = false) {

            const item = document.createElement("article");

            item.classList.add("review-item");

            if (isActive) {
                item.classList.add("is-active");
            }

            const card = document.createElement("div");
            card.classList.add("review-card");

            const text = document.createElement("p");
            text.classList.add("review-text");
            text.textContent = review.opinia ?? "";

            card.appendChild(text);


            /* AUTHOR */

            const author = document.createElement("p");
            author.classList.add("review-author");

            const name = document.createElement("span");
            name.classList.add("review-author__name");
            name.textContent = `${review.imie ?? ""}, `;

            const company = document.createElement("strong");
            company.classList.add("review-author__company");
            company.textContent = review.firma ?? "";

            author.appendChild(name);
            author.appendChild(company);


            item.appendChild(card);
            item.appendChild(author);

            return item;
        }


        /* =====================================================
           RENDER 3 REVIEWS

           LEWA  |  ŚRODKOWA  |  PRAWA
                   ↑ ACTIVE
        ===================================================== */

        function renderReviews() {

            track.innerHTML = "";

            const previousIndex = getPreviousIndex(activeIndex);
            const nextIndex = getNextIndex(activeIndex);

            const previousReview = createReviewItem(
                reviews[previousIndex],
                false
            );

            const activeReview = createReviewItem(
                reviews[activeIndex],
                true
            );

            const nextReview = createReviewItem(
                reviews[nextIndex],
                false
            );

            track.appendChild(previousReview);
            track.appendChild(activeReview);
            track.appendChild(nextReview);

            updateDots();
        }


        /* =====================================================
           NEXT
        ===================================================== */

        function showNextReview() {

            activeIndex =
                (activeIndex + 1) % reviews.length;

            renderReviews();
        }


        /* =====================================================
           PREVIOUS
        ===================================================== */

        function showPreviousReview() {

            activeIndex =
                (activeIndex - 1 + reviews.length)
                % reviews.length;

            renderReviews();
        }


        /* =====================================================
           DOTS
        ===================================================== */

        function createDots() {

            if (!dotsContainer) {
                return;
            }

            dotsContainer.innerHTML = "";

            reviews.forEach((review, index) => {

                const dot = document.createElement("button");

                dot.classList.add("reviews-dot");

                dot.type = "button";

                dot.setAttribute(
                    "aria-label",
                    `Pokaż opinię ${index + 1}`
                );

                dot.addEventListener("click", () => {

                    activeIndex = index;

                    renderReviews();

                });

                dotsContainer.appendChild(dot);

            });
        }


        function updateDots() {

            if (!dotsContainer) {
                return;
            }

            const dots =
                dotsContainer.querySelectorAll(
                    ".reviews-dot"
                );

            dots.forEach((dot, index) => {

                dot.classList.toggle(
                    "is-active",
                    index === activeIndex
                );

            });
        }


        /* =====================================================
           ARROWS
        ===================================================== */

        if (nextButton) {

            nextButton.addEventListener(
                "click",
                showNextReview
            );

        }


        if (prevButton) {

            prevButton.addEventListener(
                "click",
                showPreviousReview
            );

        }


        /* =====================================================
           KEYBOARD
        ===================================================== */

        document.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "ArrowRight") {
                    showNextReview();
                }

                if (event.key === "ArrowLeft") {
                    showPreviousReview();
                }

            }
        );


        /* =====================================================
           INITIAL RENDER
        ===================================================== */

        createDots();
        renderReviews();


    } catch (error) {

        console.error(
            "Nie udało się załadować opinii:",
            error
        );

    }

});