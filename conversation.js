document.addEventListener("DOMContentLoaded", function () {

    const questions = [
        {
            title: "Introduce Yourself",
            question: "Can you introduce yourself and tell me about your interests?"
        },
        {
            title: "Your Hobbies",
            question: "What are your favorite hobbies, and why do you enjoy them?"
        },
        {
            title: "College Life",
            question: "Tell me about your college life and your favorite college memory."
        },
        {
            title: "Favorite Subject",
            question: "What is your favorite subject, and why?"
        },
        {
            title: "Technology",
            question: "How does technology help students in their daily lives?"
        },
        {
            title: "Future Goal",
            question: "What is your future career goal, and how are you preparing for it?"
        }
    ];

    const get = id => document.getElementById(id);

    const answer = get("answerInput");
    const feedback = get("feedbackBox");

    if (!answer || !feedback) {
        console.error("Conversation HTML elements are missing.");
        return;
    }

    let current = 0;
    let practiced = 0;
    let totalWords = 0;
    let recognition = null;

    function words(text) {
        return text.trim() ? text.trim().split(/\s+/).length : 0;
    }

    function sentences(text) {
        return text.trim()
            ? text.split(/[.!?]+/).filter(s => s.trim()).length
            : 0;
    }

    function updateCounter() {
        const count = words(answer.value);
        get("wordCounter").textContent = count + " words";
    }

    function loadQuestion() {
        const item = questions[current];

        get("questionTitle").textContent = item.title;
        get("questionText").textContent = item.question;

        get("questionNumber").textContent =
            String(current + 1).padStart(2, "0") +
            " / " + questions.length;

        answer.value = "";
        updateCounter();

        feedback.classList.add("hidden");
        get("speechStatus").textContent = "Ready to practice";
        get("nextButton").textContent = "Next Question →";
    }

    answer.addEventListener("input", updateCounter);

    get("voiceButton").addEventListener("click", function () {
        const Speech =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!Speech) {
            get("speechStatus").textContent =
                "Voice input is unavailable. Please type your answer.";
            return;
        }

        if (recognition) {
            recognition.stop();
            recognition = null;
            return;
        }

        recognition = new Speech();
        recognition.lang = "en-US";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = function () {
            get("speechStatus").textContent = "Listening... Speak now";
            get("voiceButton").textContent = "⏹ Stop Speaking";
            get("voiceButton").classList.add("recording");
        };

        recognition.onresult = function (event) {
            let result = "";

            for (let i = 0; i < event.results.length; i++) {
                result += event.results[i][0].transcript + " ";
            }

            answer.value = result.trim();
            updateCounter();
        };

        recognition.onerror = function (event) {
            get("speechStatus").textContent =
                event.error === "not-allowed"
                    ? "Please allow microphone permission."
                    : "Voice input failed. Please type your answer.";
        };

        recognition.onend = function () {
            recognition = null;
            get("voiceButton").textContent = "🎙️ Speak Answer";
            get("voiceButton").classList.remove("recording");
            get("speechStatus").textContent = "Ready to practice";
        };

        try {
            recognition.start();
        } catch (error) {
            recognition = null;
            get("speechStatus").textContent = "Please try again.";
        }
    });

    get("evaluateButton").addEventListener("click", function () {
        const text = answer.value.trim();

        if (!text) {
            get("speechStatus").textContent =
                "Please enter your answer first.";
            answer.focus();
            return;
        }

        const count = words(text);
        const sentenceCount = sentences(text);

        let score = 20;

        if (count >= 10) score += 20;
        if (count >= 25) score += 20;
        if (count >= 40) score += 10;
        if (sentenceCount >= 2) score += 10;
        if (sentenceCount >= 4) score += 10;
        if (/[.!?]$/.test(text)) score += 5;

        score = Math.min(score, 95);

        get("scoreValue").textContent = score;
        get("resultWords").textContent = count;
        get("resultSentences").textContent = sentenceCount;

        get("feedbackMessage").textContent =
            count < 10
                ? "Good start! Try explaining your ideas in more detail."
                : count < 25
                    ? "Nice effort! Add more details and examples."
                    : "Well done! Keep practicing to improve your confidence.";

        get("improvementTip").textContent =
            "Try giving a reason, explaining your idea, and adding a real-life example.";

        practiced++;
        totalWords += count;

        get("questionCount").textContent = practiced;
        get("wordCount").textContent = totalWords;
        get("lastScore").textContent = score + "%";

        get("nextButton").textContent =
            current === questions.length - 1
                ? "Start Again ↻"
                : "Next Question →";

        feedback.classList.remove("hidden");
    });

    get("nextButton").addEventListener("click", function () {
        current = (current + 1) % questions.length;
        loadQuestion();
    });

    loadQuestion();

});