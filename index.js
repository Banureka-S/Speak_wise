/* =========================================
   SPEAKWISE - HOME PAGE JAVASCRIPT
   ========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------------------
    // 1. SELECT HTML ELEMENTS
    // ---------------------------------------

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    const particlesContainer = document.getElementById("particles");

    const toast = document.getElementById("toast");

    const totalXPElement = document.getElementById("totalXP");
    const totalStreakElement = document.getElementById("totalStreak");
    const navStreakElement = document.getElementById("navStreak");

    const completedCountElement =
        document.getElementById("completedCount");

    const overallProgressElement =
        document.getElementById("overallProgress");

    const currentYearElement =
        document.getElementById("currentYear");


    // ---------------------------------------
    // 2. SAFE LOCAL STORAGE ACCESS
    // ---------------------------------------

    function readStorage(key, fallback = null) {

        try {

            const value = localStorage.getItem(key);

            if (value === null) {
                return fallback;
            }

            return JSON.parse(value);

        } catch (error) {

            console.warn(
                `Could not read localStorage key: ${key}`,
                error
            );

            return fallback;
        }
    }


    // ---------------------------------------
    // 3. CREATE FLOATING PARTICLES
    // ---------------------------------------

    function createParticles() {

        if (!particlesContainer) {
            return;
        }

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion) {
            return;
        }

        const particleCount = window.innerWidth < 600 ? 12 : 24;

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < particleCount; i++) {

            const particle = document.createElement("span");

            particle.className = "particle";

            particle.style.left = `${Math.random() * 100}%`;

            particle.style.top = `${Math.random() * 100}%`;

            particle.style.animationDuration =
                `${7 + Math.random() * 10}s`;

            particle.style.animationDelay =
                `${Math.random() * 8}s`;

            const size = 2 + Math.random() * 2;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            fragment.appendChild(particle);
        }

        particlesContainer.appendChild(fragment);
    }


    // ---------------------------------------
    // 4. MOBILE NAVIGATION
    // ---------------------------------------

    function closeMenu() {

        if (!navLinks || !menuToggle) {
            return;
        }

        navLinks.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
    }


    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });


        navLinks.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", closeMenu);

        });


        document.addEventListener("click", (event) => {

            const clickedInsideMenu = navLinks.contains(event.target);

            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }

        });


        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });


        window.addEventListener("resize", () => {

            if (window.innerWidth > 760) {
                closeMenu();
            }

        });

    }


    // ---------------------------------------
    // 5. LEARNING PROGRESS
    // ---------------------------------------

    /*
       The exercise pages should save progress in this format:

       speakwise_tongue_progress
       speakwise_reading_progress
       speakwise_conversation_progress
       speakwise_story_progress

       Example:

       {
           "completedLevels": [1, 2, 3],
           "unlockedLevel": 4
       }

       This homepage reads the saved values.
       It does not create fake completed levels.
    */


    const exercises = [

        {
            key: "tongue",
            storageKey: "speakwise_tongue_progress",

            textElement: "tongueProgressText",
            barElement: "tongueProgressBar"
        },

        {
            key: "reading",
            storageKey: "speakwise_reading_progress",

            textElement: "readingProgressText",
            barElement: "readingProgressBar"
        },

        {
            key: "conversation",
            storageKey: "speakwise_conversation_progress",

            textElement: "conversationProgressText",
            barElement: "conversationProgressBar"
        },

        {
            key: "story",
            storageKey: "speakwise_story_progress",

            textElement: "storyProgressText",
            barElement: "storyProgressBar"
        }

    ];


    function getCompletedLevels(progressData) {

        if (!progressData || typeof progressData !== "object") {
            return [];
        }

        let levels = [];

        if (Array.isArray(progressData.completedLevels)) {

            levels = progressData.completedLevels;

        } else if (Array.isArray(progressData.completed)) {

            levels = progressData.completed;

        }

        return [
            ...new Set(
                levels.filter((level) => {

                    return (
                        Number.isInteger(level) &&
                        level >= 1 &&
                        level <= 20
                    );

                })
            )
        ];

    }


    function updateExerciseProgress(exercise) {

        const data = readStorage(exercise.storageKey, {});

        const completedLevels = getCompletedLevels(data);

        const completed = completedLevels.length;

        const percentage = (completed / 20) * 100;

        const textElement =
            document.getElementById(exercise.textElement);

        const barElement =
            document.getElementById(exercise.barElement);


        if (textElement) {

            textElement.textContent = `${completed} / 20`;

        }


        if (barElement) {

            barElement.style.width = `${percentage}%`;

            barElement.setAttribute(
                "role",
                "progressbar"
            );

            barElement.setAttribute(
                "aria-valuemin",
                "0"
            );

            barElement.setAttribute(
                "aria-valuemax",
                "20"
            );

            barElement.setAttribute(
                "aria-valuenow",
                String(completed)
            );

        }

        return completed;
    }


    // ---------------------------------------
    // 6. XP AND OVERALL STATISTICS
    // ---------------------------------------

    function getTotalXP() {

        /*
           Exercise pages can store total XP using:

           localStorage.setItem(
               "speakwise_total_xp",
               JSON.stringify(150)
           );
        */

        const value = readStorage("speakwise_total_xp", 0);

        const xp = Number(value);

        if (!Number.isFinite(xp) || xp < 0) {
            return 0;
        }

        return Math.floor(xp);
    }


    function getCurrentStreak() {

        /*
           Exercise pages can store the streak using:

           localStorage.setItem(
               "speakwise_streak",
               JSON.stringify(3)
           );
        */

        const value = readStorage("speakwise_streak", 0);

        const streak = Number(value);

        if (!Number.isFinite(streak) || streak < 0) {
            return 0;
        }

        return Math.floor(streak);
    }


    function updateDashboard() {

        let totalCompleted = 0;

        exercises.forEach((exercise) => {

            totalCompleted += updateExerciseProgress(exercise);

        });


        const totalXP = getTotalXP();

        const streak = getCurrentStreak();

        const overallPercentage = Math.round(
            (totalCompleted / 80) * 100
        );


        if (totalXPElement) {

            totalXPElement.innerHTML =
                `${totalXP.toLocaleString()} <span>XP</span>`;

        }


        if (totalStreakElement) {

            totalStreakElement.innerHTML =
                `${streak} <span>days</span>`;

        }


        if (navStreakElement) {

            navStreakElement.textContent = String(streak);

        }


        if (completedCountElement) {

            completedCountElement.innerHTML =
                `${totalCompleted} <span>/ 80</span>`;

        }


        if (overallProgressElement) {

            overallProgressElement.innerHTML =
                `${overallPercentage}<span>%</span>`;

        }

    }


    // ---------------------------------------
    // 7. TOAST NOTIFICATION
    // ---------------------------------------

    let toastTimer;


    function showToast(message) {

        if (!toast) {
            return;
        }

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 2500);

    }


    // ---------------------------------------
    // 8. CURRENT YEAR
    // ---------------------------------------

    if (currentYearElement) {

        currentYearElement.textContent =
            String(new Date().getFullYear());

    }


    // ---------------------------------------
    // 9. INITIALIZE PAGE
    // ---------------------------------------

    createParticles();

    updateDashboard();


    // ---------------------------------------
    // 10. REFRESH STATS WHEN RETURNING
    // ---------------------------------------

    window.addEventListener("pageshow", () => {

        updateDashboard();

    });


    /*
       If an exercise updates localStorage in another tab,
       refresh the dashboard automatically.
    */

    window.addEventListener("storage", (event) => {

        if (
            event.key &&
            event.key.startsWith("speakwise_")
        ) {

            updateDashboard();

        }

    });


    // ---------------------------------------
    // 11. HANDLE UNKNOWN NAVIGATION TARGETS
    // ---------------------------------------

    document.querySelectorAll(
        'a[href$=".html"]'
    ).forEach((link) => {

        link.addEventListener("click", () => {

            const destination = link.getAttribute("href");

            /*
               The browser will navigate normally.
               This handler does not block navigation.
            */

            if (!destination) {
                showToast("Please choose an exercise.");
            }

        });

    });

});