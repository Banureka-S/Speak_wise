document.addEventListener("DOMContentLoaded", function () {

    const stories = [
        {
            title: "The Mysterious Box",
            prompt: "One morning, you found a mysterious box outside your door...",
            sample: "One morning, I found a mysterious box outside my door. It had golden stars on it. I opened the box and found an old map. The map showed the location of a hidden garden. I followed the map and discovered a beautiful garden filled with colorful flowers. It was the most exciting day of my life."
        },
        {
            title: "A Day Without Internet",
            prompt: "Imagine the internet suddenly stops working for an entire day...",
            sample: "One Sunday, the internet stopped working. At first, I felt bored because I could not use my phone. Then, I decided to play outdoor games with my friends. We laughed and shared stories. In the evening, I spent time with my family. I learned that life can be enjoyable without the internet."
        },
        {
            title: "The Talking Tree",
            prompt: "While walking through a forest, you hear a tree calling your name...",
            sample: "One day, I walked through a forest and heard someone calling my name. I looked around and discovered that an old tree was talking to me. It explained that people were cutting down too many trees. I promised to protect nature. From that day, I encouraged my friends to plant more trees."
        },
        {
            title: "The Unexpected Hero",
            prompt: "An ordinary person performs an extraordinary act...",
            sample: "One day, I saw a small child standing near a busy road. Suddenly, a bicycle came towards the child. A nearby shopkeeper quickly moved the child to safety. Everyone thanked him for his brave action. I learned that heroes can be ordinary people who do extraordinary things."
        },
        {
            title: "A Journey to the Future",
            prompt: "Imagine discovering a machine that takes you fifty years into the future...",
            sample: "One evening, I discovered a strange machine. When I pressed a button, I traveled fifty years into the future. I saw flying vehicles, smart robots, and clean cities. Technology had changed the world. When I returned to the present, I decided to study technology and help build a better future."
        }
    ];

    const get = id => document.getElementById(id);

    const answer = get("answerInput");
    const feedback = get("feedbackBox");

    if (!answer || !feedback) {
        console.error("Story HTML elements are missing.");
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
        get("wordCounter").textContent = words(answer.value) + " words";
    }

    function loadStory() {
        const item = stories[current];

        get("storyTitle").textContent = item.title;
        get("storyPrompt").textContent = item.prompt;

        get("storyNumber").textContent =
            String(current + 1).padStart(2, "0") +
            " / " + stories.length;

        answer.value = "";
        updateCounter();

        feedback.classList.add("hidden");
        get("sampleBox").classList.add("hidden");

        get("speechStatus").textContent = "Ready to create";
        get("nextButton").textContent = "Next Story →";
    }

    answer.addEventListener("input", updateCounter);

    get("voiceButton").addEventListener("click", function () {
        const Speech =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!Speech) {
            get("speechStatus").textContent =
                "Voice input is unavailable. Please type your story.";
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
            get("speechStatus").textContent = "Listening... Tell your story";
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
                    : "Voice input failed. Please type your story.";
        };

        recognition.onend = function () {
            recognition = null;
            get("voiceButton").textContent = "🎙️ Speak Story";
            get("voiceButton").classList.remove("recording");
            get("speechStatus").textContent = "Ready to create";
        };

        try {
            recognition.start();
        } catch (error) {
            recognition = null;
            get("speechStatus").textContent = "Please try again.";
        }
    });

    get("sampleButton").addEventListener("click", function () {
        get("sampleText").textContent = stories[current].sample;
        get("sampleBox").classList.toggle("hidden");
    });

    get("evaluateButton").addEventListener("click", function () {
        const text = answer.value.trim();

        if (!text) {
            get("speechStatus").textContent =
                "Please write or speak your story first.";
            answer.focus();
            return;
        }

        const count = words(text);
        const sentenceCount = sentences(text);
        const lower = text.toLowerCase();

        let score = 10;

        if (count >= 20) score += 15;
        if (count >= 40) score += 15;
        if (count >= 70) score += 15;
        if (count >= 100) score += 10;
        if (sentenceCount >= 3) score += 10;
        if (sentenceCount >= 5) score += 10;

        const indicators = [
            "one day",
            "suddenly",
            "then",
            "finally",
            "after that",
            "because",
            "in the end"
        ];

        indicators.forEach(phrase => {
            if (lower.includes(phrase)) score += 3;
        });

        score = Math.min(score, 100);

        get("scoreValue").textContent = score;
        get("resultWords").textContent = count;
        get("resultSentences").textContent = sentenceCount;

        get("feedbackMessage").textContent =
            count < 20
                ? "Good beginning! Develop your idea into a longer story."
                : count < 70
                    ? "Nice work! Add more details and describe what happens next."
                    : "Well done! You have created a detailed story.";

        get("improvementTip").textContent =
            "Include a beginning, a problem or exciting event, and an ending. Describe the characters and their feelings.";

        practiced++;
        totalWords += count;

        get("storyCount").textContent = practiced;
        get("wordCount").textContent = totalWords;
        get("lastScore").textContent = score + "%";

        get("nextButton").textContent =
            current === stories.length - 1
                ? "Start Again ↻"
                : "Next Story →";

        feedback.classList.remove("hidden");
    });

    get("nextButton").addEventListener("click", function () {
        current = (current + 1) % stories.length;
        loadStory();
    });

    loadStory();

});