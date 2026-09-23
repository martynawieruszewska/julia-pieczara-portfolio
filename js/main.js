/* =========================================================
   PAGE START — ALWAYS START AT HERO
========================================================= */

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
    if (window.location.hash) {
        history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
        );
    }

    window.scrollTo(0, 0);
});


/* =========================================================
   NAVIGATION — SCROLL BEHAVIOUR
========================================================= */

const nav = document.querySelector(".nav");

let lastScrollY = window.scrollY;

if (nav) {
    window.addEventListener(
        "scroll",
        () => {
            const currentScrollY = window.scrollY;

            /* Scroll w dół → chowamy */
            if (
                currentScrollY > lastScrollY &&
                currentScrollY > 50
            ) {
                nav.classList.add("nav--hidden");
            }

            /* Scroll w górę → pokazujemy */
            if (currentScrollY < lastScrollY) {
                nav.classList.remove("nav--hidden");
            }

            /* Na samej górze zawsze widoczny */
            if (currentScrollY <= 20) {
                nav.classList.remove("nav--hidden");
            }

            lastScrollY = currentScrollY;
        },
        { passive: true }
    );
}


/* =========================================================
   HERO — RANDOM SAFE TYPEWRITER
========================================================= */

const typingLayer =
    document.querySelector(".hero__typing-layer");

const hero =
    document.querySelector(".hero");

const typingWords = [
    "BEAUTY & WELLNESS",
    "NIERUCHOMOŚCI",
    "EDUKACJA",
    "FASHION",
    "FOOD"
];

const protectedSelectors = [
    ".hero__title",
    ".hero__name",
    ".hero__profession",
    ".hero__description",
    ".hero__logo"
];

let typingWordIndex = 0;


/* =========================================================
   TYPEWRITER — COLLISION CHECK
========================================================= */

function isTypingPositionSafe(element) {
    if (!hero) {
        return false;
    }

    const heroRect =
        hero.getBoundingClientRect();

    const elementRect =
        element.getBoundingClientRect();


    /* OMIJAMY GÓRĘ Z NAV */

    const safeTop =
        heroRect.top +
        heroRect.height * 0.18;

    if (elementRect.top < safeTop) {
        return false;
    }


    /* OMIJAMY PRAWĄ STRONĘ Z POSTACIĄ */

    const rightLimit =
        heroRect.left +
        heroRect.width * 0.60;

    if (elementRect.right > rightLimit) {
        return false;
    }


    /* PILNUJEMY KRAWĘDZI */

    const edgeGap = 25;

    if (
        elementRect.left <
            heroRect.left + edgeGap ||
        elementRect.right >
            heroRect.right - edgeGap ||
        elementRect.bottom >
            heroRect.bottom - edgeGap
    ) {
        return false;
    }


    /* OMIJAMY TEKSTY I LOGO */

    for (const selector of protectedSelectors) {
        const protectedElement =
            document.querySelector(selector);

        if (!protectedElement) {
            continue;
        }

        const protectedRect =
            protectedElement.getBoundingClientRect();

        const gap = 35;

        const collision =
            elementRect.left <
                protectedRect.right + gap &&
            elementRect.right >
                protectedRect.left - gap &&
            elementRect.top <
                protectedRect.bottom + gap &&
            elementRect.bottom >
                protectedRect.top - gap;

        if (collision) {
            return false;
        }
    }

    return true;
}


/* =========================================================
   TYPEWRITER — RANDOM POSITION
========================================================= */

function findTypingPosition(element) {
    for (let attempt = 0; attempt < 150; attempt++) {
        const randomX =
            2 + Math.random() * 53;

        const randomY =
            18 + Math.random() * 75;

        element.style.left =
            `${randomX}%`;

        element.style.top =
            `${randomY}%`;

        if (isTypingPositionSafe(element)) {
            return true;
        }
    }

    return false;
}


/* =========================================================
   TYPEWRITER — CREATE WORD
========================================================= */

function createTypingWord() {
    if (!typingLayer || !hero) {
        return;
    }

    const word =
        typingWords[typingWordIndex];

    const element =
        document.createElement("span");

    element.className =
        "hero__typing-word";


    /*
       Najpierw pełne słowo jest niewidoczne,
       żeby znaleźć miejsce dla całej jego szerokości.
    */

    element.textContent = word;
    element.style.visibility = "hidden";

    typingLayer.appendChild(element);


    const positionFound =
        findTypingPosition(element);


    if (!positionFound) {
        element.remove();

        setTimeout(
            createTypingWord,
            300
        );

        return;
    }


    element.textContent = "";
    element.style.visibility = "visible";


    requestAnimationFrame(() => {
        element.classList.add("is-visible");
    });


    let letterIndex = 0;


    const typingInterval =
        setInterval(() => {
            element.textContent +=
                word.charAt(letterIndex);

            letterIndex++;


            if (letterIndex >= word.length) {
                clearInterval(typingInterval);


                /*
                   Gotowy napis chwilę zostaje.
                */

                setTimeout(() => {
                    element.classList.remove(
                        "is-visible"
                    );


                    setTimeout(() => {
                        element.remove();

                        typingWordIndex =
                            (
                                typingWordIndex + 1
                            ) %
                            typingWords.length;

                        createTypingWord();

                    }, 220);

                }, 700);
            }

        }, 90);
}


if (typingLayer && hero) {
    createTypingWord();
}


/* =========================================================
   EXPERIENCE — SMOOTH COUNTERS
========================================================= */

const experience =
    document.querySelector(".experience");

const statNumbers =
    document.querySelectorAll(".stat__number");

let experienceArmed = true;


/* =========================================================
   SMOOTH COUNTER
========================================================= */

function animateCounter(counter) {
    const target =
        Number(counter.dataset.value);

    /*
       Wszystkie trzy liczniki mają
       dokładnie taki sam czas.
    */

    const duration = 1000;

    const startTime =
        performance.now();


    counter.textContent = "0+";

    counter.classList.remove(
        "is-finished"
    );


    function update(currentTime) {
        const elapsed =
            currentTime - startTime;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        /*
           Płynne zwalnianie przed końcem.
        */

        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const currentValue =
            Math.round(
                target * easedProgress
            );


        counter.textContent =
            `${currentValue}+`;


        if (progress < 1) {
            requestAnimationFrame(update);

            return;
        }


        /*
           Finalna wartość.
        */

        counter.textContent =
            `${target}+`;


        /*
           Delikatny POP po zakończeniu.
        */

        counter.classList.remove(
            "is-finished"
        );

        void counter.offsetWidth;

        counter.classList.add(
            "is-finished"
        );
    }


    requestAnimationFrame(update);
}


/* =========================================================
   START ALL COUNTERS
========================================================= */

function animateAllCounters() {
    statNumbers.forEach((counter) => {
        animateCounter(counter);
    });
}


/* =========================================================
   EXPERIENCE OBSERVER
========================================================= */

if (experience) {
    const experienceObserver =
        new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {

                    /*
                       Każde wejście do sekcji.
                    */

                    if (
                        entry.isIntersecting &&
                        experienceArmed
                    ) {
                        experienceArmed = false;

                        animateAllCounters();
                    }


                    /*
                       Po całkowitym opuszczeniu sekcji
                       uzbrajamy animację ponownie.
                    */

                    if (!entry.isIntersecting) {
                        experienceArmed = true;
                    }

                });
            },
            {
                threshold: 0.18
            }
        );


    experienceObserver.observe(
        experience
    );
}


/* =========================================================
   CLIENTS — TRUE INFINITE CAROUSEL
========================================================= */

const clientsTrack =
    document.querySelector(".clients__track");


if (
    clientsTrack &&
    clientsTrack.dataset.carouselReady !== "true"
) {
    const originalLogos =
        Array.from(
            clientsTrack.children
        );


    /*
       Tworzymy drugi identyczny zestaw.
    */

    originalLogos.forEach((logo) => {
        const clone =
            logo.cloneNode(true);

        clone.setAttribute(
            "aria-hidden",
            "true"
        );

        clientsTrack.appendChild(clone);
    });


    clientsTrack.dataset.carouselReady =
        "true";


    /* =====================================================
       EXACT LOOP DISTANCE
    ===================================================== */

    function calculateCarouselDistance() {
        if (originalLogos.length === 0) {
            return;
        }


        const firstOriginal =
            originalLogos[0];

        const firstClone =
            clientsTrack.children[
                originalLogos.length
            ];


        if (
            !firstOriginal ||
            !firstClone
        ) {
            return;
        }


        const originalRect =
            firstOriginal.getBoundingClientRect();

        const cloneRect =
            firstClone.getBoundingClientRect();


        const distance =
            cloneRect.left -
            originalRect.left;


        clientsTrack.style.setProperty(
            "--clients-distance",
            `-${distance}px`
        );
    }


    /* Czekamy na załadowanie logotypów */

    const logoImages =
        clientsTrack.querySelectorAll("img");

    let loadedImages = 0;


    function logoReady() {
        loadedImages++;

        if (
            loadedImages >=
            logoImages.length
        ) {
            calculateCarouselDistance();
        }
    }


    logoImages.forEach((image) => {
        if (image.complete) {
            logoReady();
        } else {
            image.addEventListener(
                "load",
                logoReady,
                { once: true }
            );

            image.addEventListener(
                "error",
                logoReady,
                { once: true }
            );
        }
    });


    /*
       Dodatkowe obliczenie po ustawieniu layoutu.
    */

    requestAnimationFrame(() => {
        requestAnimationFrame(
            calculateCarouselDistance
        );
    });


    window.addEventListener(
        "resize",
        calculateCarouselDistance
    );
}

/* =========================================================
   SERVICES — RANDOM SAFE TYPEWRITER
========================================================= */

const servicesTypingLayer =
    document.querySelector(".services-typing-layer");

const servicesHero =
    document.querySelector(".services-hero");

const servicesTypingWords = [
    "SOCIAL MEDIA",
    "FOTO & VIDEO",
    "PAID ADS",
    "STRATEGIA",
    "BRANDING",
    "STRONY WWW"
];

const servicesProtectedSelectors = [
    ".services-hero__eyebrow",
    ".services-hero__title",
    ".services-hero__description",
    ".services-hero__tools"
];

let servicesTypingWordIndex = 0;

function isServicesTypingPositionSafe(element) {
    if (!servicesHero) {
        return false;
    }

    const heroRect =
        servicesHero.getBoundingClientRect();

    const elementRect =
        element.getBoundingClientRect();

    /* omijamy górę strony / navbar */
    const safeTop =
        heroRect.top +
        heroRect.height * 0.18;

    if (elementRect.top < safeTop) {
        return false;
    }

    /* nie pozwalamy wyjechać poza ekran */
    const edgeGap = 25;

    if (
        elementRect.left < heroRect.left + edgeGap ||
        elementRect.right > heroRect.right - edgeGap ||
        elementRect.bottom > heroRect.bottom - edgeGap
    ) {
        return false;
    }

    /* omijamy tekst i pozostałe elementy hero */
    for (const selector of servicesProtectedSelectors) {

        const protectedElement =
            document.querySelector(selector);

        if (!protectedElement) {
            continue;
        }

        const protectedRect =
            protectedElement.getBoundingClientRect();

        const gap = 35;

        const collision =
            elementRect.left <
                protectedRect.right + gap &&
            elementRect.right >
                protectedRect.left - gap &&
            elementRect.top <
                protectedRect.bottom + gap &&
            elementRect.bottom >
                protectedRect.top - gap;

        if (collision) {
            return false;
        }
    }

    return true;
}

function findServicesTypingPosition(element) {

    for (let attempt = 0; attempt < 150; attempt++) {

        const randomX =
            2 + Math.random() * 90;

        const randomY =
            18 + Math.random() * 75;

        element.style.left =
            `${randomX}%`;

        element.style.top =
            `${randomY}%`;

        if (
            isServicesTypingPositionSafe(element)
        ) {
            return true;
        }
    }

    return false;
}

function createServicesTypingWord() {

    if (
        !servicesTypingLayer ||
        !servicesHero
    ) {
        return;
    }

    const word =
        servicesTypingWords[
            servicesTypingWordIndex
        ];

    const element =
        document.createElement("span");

    element.className =
        "services-typing-word";

    element.textContent = word;
    element.style.visibility = "hidden";

    servicesTypingLayer.appendChild(
        element
    );

    const positionFound =
        findServicesTypingPosition(
            element
        );

    if (!positionFound) {

        element.remove();

        setTimeout(
            createServicesTypingWord,
            300
        );

        return;
    }

    element.textContent = "";
    element.style.visibility = "visible";

    requestAnimationFrame(() => {
        element.classList.add(
            "is-visible"
        );
    });

    let letterIndex = 0;

    const typingInterval =
        setInterval(() => {

            element.textContent +=
                word.charAt(letterIndex);

            letterIndex++;

            if (
                letterIndex >=
                word.length
            ) {

                clearInterval(
                    typingInterval
                );

                setTimeout(() => {

                    element.classList.remove(
                        "is-visible"
                    );

                    setTimeout(() => {

                        element.remove();

                        servicesTypingWordIndex =
                            (
                                servicesTypingWordIndex +
                                1
                            ) %
                            servicesTypingWords.length;

                        createServicesTypingWord();

                    }, 220);

                }, 700);
            }

        }, 90);
}

if (
    servicesTypingLayer &&
    servicesHero
) {
    createServicesTypingWord();
}