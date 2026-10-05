document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       PORTFOLIO — SIDE NAV
    ========================================================= */

    const links = document.querySelectorAll(
        ".portfolio-side-nav__link"
    );

    const sideNav = document.querySelector(
        ".portfolio-side-nav"
    );

    const hero = document.querySelector(
        ".portfolio-hero"
    );


    if (links.length) {

        const sections = [...links]
            .map((link) => {
                return document.getElementById(
                    link.dataset.section
                );
            })
            .filter(Boolean);


        const updateActiveSection = () => {

            /* ---------------------------------------------
               POKAŻ / UKRYJ SIDE NAV
            --------------------------------------------- */

            if (sideNav && hero) {

                const heroBottom =
                    hero.getBoundingClientRect().bottom;


                sideNav.classList.toggle(
                    "is-visible",
                    heroBottom <= window.innerHeight * 0.5
                );

            }


            /* ---------------------------------------------
               AKTYWNA SEKCJA
            --------------------------------------------- */

            const viewportPoint =
                window.innerHeight * 0.5;


            let activeSection = null;


            sections.forEach((section) => {

                const rect =
                    section.getBoundingClientRect();


                if (
                    rect.top <= viewportPoint &&
                    rect.bottom >= viewportPoint
                ) {

                    activeSection = section.id;

                }

            });


            links.forEach((link) => {

                link.classList.toggle(
                    "portfolio-side-nav__link--active",
                    link.dataset.section === activeSection
                );

            });

        };


        window.addEventListener(
            "scroll",
            updateActiveSection,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            updateActiveSection
        );


        updateActiveSection();

    }



    /* =========================================================
       VIDEO — TRUE ENDLESS CAROUSEL
    ========================================================= */

    const videoCarousel = document.querySelector(
        ".portfolio-video-carousel"
    );

    const videoTrack = document.querySelector(
        ".portfolio-video-carousel__track"
    );


    if (!videoCarousel || !videoTrack) {
        return;
    }


    /* =========================================================
       ORYGINALNE ELEMENTY
    ========================================================= */

    const originalItems = Array.from(
        videoTrack.querySelectorAll(
            ".portfolio-social__item--video"
        )
    );


    if (!originalItems.length) {
        return;
    }



    /* =========================================================
       KLONUJEMY CAŁY ZESTAW

       1 2 3 4 5 | 1 2 3 4 5
    ========================================================= */

    originalItems.forEach((item) => {

        const clone = item.cloneNode(true);

        clone.setAttribute(
            "aria-hidden",
            "true"
        );

        videoTrack.appendChild(clone);

    });



    /* =========================================================
       STAN KARUZELI
    ========================================================= */

    let position = 0;

    let previousTime = null;

    let hoverPaused = false;

    let loopWidth = 0;


    /*
       Prędkość w px / sekundę.

       Możesz później zmienić:
       18 = wolniej
       22 = obecna
       30 = szybciej
    */

    const speed = 22;



    /* =========================================================
       OBLICZENIE SZEROKOŚCI JEDNEGO ZESTAWU
    ========================================================= */

    const calculateLoopWidth = () => {

        const trackStyle =
            window.getComputedStyle(videoTrack);


        const gap =
            parseFloat(trackStyle.columnGap) ||
            parseFloat(trackStyle.gap) ||
            0;


        let width = 0;


        originalItems.forEach((item) => {

            width +=
                item.getBoundingClientRect().width;

        });


        /*
           Między pierwszym i drugim zestawem również
           znajduje się gap.

           Dlatego liczymy 5 gapów dla 5 elementów.
        */

        width += gap * originalItems.length;


        loopWidth = width;

    };


    calculateLoopWidth();



    /* =========================================================
       RESIZE
    ========================================================= */

    window.addEventListener(
        "resize",
        () => {

            calculateLoopWidth();


            /*
               Jeżeli po resize aktualna pozycja
               znalazłaby się poza nową szerokością,
               normalizujemy ją.
            */

            if (loopWidth > 0) {

                position =
                    -(
                        Math.abs(position) %
                        loopWidth
                    );

            }

        }
    );



    /* =========================================================
       SPRAWDZENIE CZY JAKIŚ FILM GRA
    ========================================================= */

    const isAnyVideoPlaying = () => {

        const videos =
            videoTrack.querySelectorAll(
                ".portfolio-social__video"
            );


        return Array.from(videos).some(
            (video) => {

                return (
                    !video.paused &&
                    !video.ended
                );

            }
        );

    };



    /* =========================================================
       ANIMACJA

       Nie ma CSS animation.
       Nie ma restartu keyframes.

       Przesuwamy track piksel po pikselu.
    ========================================================= */

    const animateCarousel = (time) => {

        if (previousTime === null) {

            previousTime = time;

        }


        /*
           Delta czasu od poprzedniej klatki.
        */

        const delta = Math.min(
            (time - previousTime) / 1000,
            0.05
        );


        previousTime = time;



        /* ---------------------------------------------
           PRZESUWAMY TYLKO JEŚLI:

           - mysz nie jest nad karuzelą
           - żaden film nie jest odtwarzany
        --------------------------------------------- */

        if (
            !hoverPaused &&
            !isAnyVideoPlaying() &&
            loopWidth > 0
        ) {

            position -= speed * delta;


            /*
               TRUE ENDLESS LOOP

               Kiedy pierwszy zestaw całkowicie wyjedzie,
               w tym samym miejscu znajduje się jego
               identyczna kopia.

               Matematycznie cofamy współrzędną,
               ale wizualnie obraz pozostaje identyczny.
            */

            if (position <= -loopWidth) {

                position += loopWidth;

            }

        }



        /* ---------------------------------------------
           RENDER
        --------------------------------------------- */

        videoTrack.style.transform =
            `translate3d(${position}px, 0, 0)`;


        window.requestAnimationFrame(
            animateCarousel
        );

    };


    window.requestAnimationFrame(
        animateCarousel
    );



    /* =========================================================
       HOVER = STOP
    ========================================================= */

    videoCarousel.addEventListener(
        "mouseenter",
        () => {

            hoverPaused = true;

        }
    );


    videoCarousel.addEventListener(
        "mouseleave",
        () => {

            hoverPaused = false;

        }
    );



    /* =========================================================
       VIDEO — PLAY / PAUSE
    ========================================================= */

    const videoItems =
        videoTrack.querySelectorAll(
            ".portfolio-social__item--video"
        );



    /* =========================================================
       ZATRZYMAJ POZOSTAŁE FILMY
    ========================================================= */

    const pauseOtherVideos = (
        currentVideo
    ) => {

        videoTrack
            .querySelectorAll(
                ".portfolio-social__video"
            )
            .forEach((video) => {

                if (
                    video !== currentVideo &&
                    !video.paused
                ) {

                    video.pause();

                }

            });

    };



    /* =========================================================
       OBSŁUGA KAŻDEGO FILMU
    ========================================================= */

    videoItems.forEach((item) => {

        const video =
            item.querySelector(
                ".portfolio-social__video"
            );


        const playButton =
            item.querySelector(
                ".portfolio-social__play"
            );


        if (!video || !playButton) {
            return;
        }
        /* =====================================================
   AUTOMATYCZNA OKŁADKA Z KLATKI VIDEO
===================================================== */

const setVideoCover = () => {

    if (
        Number.isFinite(video.duration) &&
        video.duration > 0
    ) {
        video.currentTime = Math.min(0.1, video.duration);
    }

};


if (video.readyState >= 1) {

    setVideoCover();

} else {

    video.addEventListener(
        "loadedmetadata",
        setVideoCover,
        { once: true }
    );

}



        /* =====================================================
           PLAY
        ===================================================== */

        const playVideo = async () => {

            pauseOtherVideos(video);


            try {

                await video.play();

            }

            catch (error) {

                console.error(
                    "Nie udało się uruchomić filmu:",
                    error
                );

            }

        };



        /* =====================================================
           PLAY BUTTON
        ===================================================== */

        playButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                playVideo();

            }
        );



        /* =====================================================
           KLIKNIĘCIE BEZPOŚREDNIO W VIDEO
        ===================================================== */

        video.addEventListener(
            "click",
            () => {

                if (video.paused) {

                    playVideo();

                }

                else {

                    video.pause();

                }

            }
        );



        /* =====================================================
           VIDEO START
        ===================================================== */

        video.addEventListener(
            "play",
            () => {

                item.classList.add(
                    "is-playing"
                );

            }
        );



        /* =====================================================
           VIDEO PAUSE
        ===================================================== */

        video.addEventListener(
            "pause",
            () => {

                item.classList.remove(
                    "is-playing"
                );

            }
        );



        /* =====================================================
           VIDEO END
        ===================================================== */

        video.addEventListener(
            "ended",
            () => {

                item.classList.remove(
                    "is-playing"
                );


                /*
                   Wracamy na początek filmu.
                */

                   video.currentTime = Math.min(
                    0.1,
                    video.duration || 0.1
                );

            }
        );

    });



    /* =========================================================
       PREFERS REDUCED MOTION
    ========================================================= */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (reducedMotion.matches) {

        hoverPaused = true;

    }

});