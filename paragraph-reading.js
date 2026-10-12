"use strict";

const STORAGE_KEY = "speakwise_paragraph_progress";
const PASS_MARK = 70;
const TOTAL_LEVELS = 20;

const challenges = [
    {
        title: "A Beautiful Morning",
        difficulty: "BEGINNER",
        text: "Every morning is a new beginning. The sun rises slowly, birds sing sweet songs, and the world wakes up with hope."
    },
    {
        title: "My Best Friend",
        difficulty: "BEGINNER",
        text: "A true friend makes our life brighter. My best friend always supports me, listens to my problems, and shares my happiness."
    },
    {
        title: "The Power of Reading",
        difficulty: "BEGINNER",
        text: "Reading is a wonderful habit. Books teach us new things, improve our vocabulary, and help us understand the world better."
    },
    {
        title: "A Healthy Lifestyle",
        difficulty: "BEGINNER",
        text: "A healthy lifestyle includes good food, enough sleep, and regular exercise. Small healthy habits can make a big difference in our lives."
    },
    {
        title: "The Value of Time",
        difficulty: "BEGINNER",
        text: "Time is precious because we cannot bring back a moment once it has passed. Planning our day helps us complete important tasks."
    },
    {
        title: "Learning from Mistakes",
        difficulty: "INTERMEDIATE",
        text: "Mistakes are a natural part of learning. Instead of feeling disappointed, we should understand what went wrong and use that knowledge to improve."
    },
    {
        title: "The Beauty of Nature",
        difficulty: "INTERMEDIATE",
        text: "Nature gives us fresh air, clean water, and beautiful landscapes. Protecting trees and keeping our surroundings clean are important responsibilities."
    },
    {
        title: "The Importance of Teamwork",
        difficulty: "INTERMEDIATE",
        text: "Teamwork allows people to combine their skills and ideas. When everyone communicates clearly and respects others, difficult tasks become easier."
    },
    {
        title: "Technology in Education",
        difficulty: "INTERMEDIATE",
        text: "Technology has changed the way students learn. Digital libraries, educational videos, and online classrooms provide many opportunities to gain knowledge."
    },
    {
        title: "Building Self Confidence",
        difficulty: "INTERMEDIATE",
        text: "Self confidence grows through practice and preparation. Speaking regularly, accepting feedback, and learning from experience help us express our ideas clearly."
    },
    {
        title: "The Art of Communication",
        difficulty: "INTERMEDIATE",
        text: "Effective communication requires more than speaking fluently. Listening carefully, choosing suitable words, and understanding different viewpoints are equally important."
    },
    {
        title: "Protecting Our Environment",
        difficulty: "INTERMEDIATE",
        text: "Environmental protection begins with everyday choices. Reducing waste, saving electricity, using reusable products, and planting trees can contribute to a cleaner planet."
    },
    {
        title: "The World of Artificial Intelligence",
        difficulty: "ADVANCED",
        text: "Artificial intelligence enables computers to perform tasks that usually require human intelligence. It can recognize patterns, process language, and assist people in solving complex problems."
    },
    {
        title: "The Importance of Critical Thinking",
        difficulty: "ADVANCED",
        text: "Critical thinking involves examining information carefully before reaching a conclusion. By asking meaningful questions and checking evidence, we can make more reliable decisions."
    },
    {
        title: "Innovation and Creativity",
        difficulty: "ADVANCED",
        text: "Innovation often begins with curiosity and a willingness to explore unfamiliar ideas. Creative people observe problems, experiment with possible solutions, and learn from unexpected results."
    },
    {
        title: "Digital Responsibility",
        difficulty: "ADVANCED",
        text: "Responsible digital citizenship includes protecting personal information, checking the reliability of online content, respecting others, and communicating thoughtfully across digital platforms."
    },
    {
        title: "Overcoming Challenges",
        difficulty: "ADVANCED",
        text: "Challenges can test our patience and determination. A clear plan, consistent effort, and a willingness to seek guidance can transform difficult situations into valuable learning experiences."
    },
    {
        title: "The Future of Learning",
        difficulty: "ADVANCED",
        text: "The future of education may combine intelligent learning systems with human guidance. Personalized activities can help students progress at their own pace while teachers provide encouragement and deeper understanding."
    },
    {
        title: "Leadership and Responsibility",
        difficulty: "ADVANCED",
        text: "Good leadership is demonstrated through integrity, empathy, and accountability. Effective leaders communicate a clear vision, encourage collaboration, and take responsibility for the decisions they make."
    },
    {
        title: "Your Voice Matters",
        difficulty: "ADVANCED",
        text: "Confident communication develops through regular practice rather than overnight success. When you organize your thoughts, speak at a comfortable pace, and learn from feedback, your voice becomes a powerful tool for expressing ideas."
    }
];

const $ = (id) => document.getElementById(id);

let currentLevel = 1;
let completedLevels = [];
let earnedXP = 0;
let transcriptFinal = "";
let transcriptInterim = "";
let recognition = null;
let mediaRecorder = null;
let mediaStream = null;
let audioChunks = [];
let audioUrl = null;
let isRecording = false;
let isRecognizing = false;
let recognitionEndedUnexpectedly = false;
let startTime = 0;
let timerInterval = null;
let recordedSeconds = 0;
let lastResult = null;
let toastTimeout = null;
let hasCompletedAll = false;

const SpeechRecognitionAPI =
    window.SpeechRecognition || window.webkitSpeechRecognition;

function loadProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (!saved || typeof saved !== "object") return;

        completedLevels = Array.isArray(saved.completedLevels)
            ? saved.completedLevels.filter(
                n => Number.isInteger(n) && n >= 1 && n <= TOTAL_LEVELS
            )
            : [];

        completedLevels = [...new Set(completedLevels)];

        earnedXP = Number.isFinite(saved.earnedXP)
            ? Math.max(0, saved.earnedXP)
            : 0;

        const savedLevel = Number(saved.currentLevel);

        currentLevel = Number.isInteger(savedLevel)
            ? Math.min(TOTAL_LEVELS, Math.max(1, savedLevel))
            : 1;

        hasCompletedAll = completedLevels.length === TOTAL_LEVELS;

        if (!hasCompletedAll && completedLevels.includes(currentLevel)) {
            currentLevel = Math.min(
                TOTAL_LEVELS,
                Math.max(...completedLevels) + 1
            );
        }

        if (hasCompletedAll) currentLevel = TOTAL_LEVELS;
    } catch (error) {
        console.warn("Progress could not be loaded.", error);
    }
}

function saveProgress() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                currentLevel,
                completedLevels,
                earnedXP,
                hasCompletedAll
            })
        );
    } catch (error) {
        showToast("Your browser could not save progress. Check storage settings.");
    }
}

function renderPage() {
    const challenge = challenges[currentLevel - 1];

    $("levelLabel").textContent = `LEVEL ${String(currentLevel).padStart(2, "0")}`;
    $("levelMedal").textContent = String(currentLevel).padStart(2, "0");
    $("paragraphTitle").textContent = challenge.title;
    $("readingText").textContent = challenge.text;
    $("difficulty").textContent = challenge.difficulty;

    $("xp").textContent = earnedXP;
    $("completedCount").textContent = completedLevels.length;

    const percent = Math.round(
        (completedLevels.length / TOTAL_LEVELS) * 100
    );

    $("progressFill").style.width = `${percent}%`;
    $("progressPercent").textContent = `${percent}%`;

    renderLevelPath();
}

function renderLevelPath() {
    const path = $("levelPath");
    path.innerHTML = "";

    for (let level = 1; level <= TOTAL_LEVELS; level++) {
        const button = document.createElement("button");
        button.className = "level-node";
        button.type = "button";

        const completed = completedLevels.includes(level);
        const unlocked = completed || level === 1 ||
            completedLevels.includes(level - 1) ||
            (hasCompletedAll && level === TOTAL_LEVELS);

        if (completed) {
            button.classList.add("completed");
            button.textContent = "★";
            button.setAttribute("aria-label", `Level ${level}, completed`);
            button.title = `Level ${level} completed`;
        } else if (unlocked) {
            button.classList.add("current");
            button.textContent = String(level).padStart(2, "0");
            button.setAttribute("aria-label", `Level ${level}, unlocked`);
            button.title = `Level ${level}`;
        } else {
            button.classList.add("locked");
            button.textContent = "🔒";
            button.disabled = true;
            button.setAttribute("aria-label", `Level ${level}, locked`);
            button.title = "Complete the previous level first";
        }

        button.addEventListener("click", () => {
            if (!unlocked) {
                showToast("🔒 Complete the previous level to unlock this challenge!");
                return;
            }

            if (isRecording) {
                showToast("Stop your current recording before changing levels.");
                return;
            }

            currentLevel = level;
            lastResult = null;
            resetExerciseUI();
            renderPage();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        path.appendChild(button);
    }
}

function resetExerciseUI() {
    transcriptFinal = "";
    transcriptInterim = "";
    recordedSeconds = 0;
    lastResult = null;

    $("transcript").textContent =
        "Your spoken words will appear here automatically...";

    $("timer").textContent = "00:00";
    $("resultsPanel").hidden = true;
    $("unlockMessage").hidden = true;
    $("analyzeBtn").disabled = false;
    $("playAudioBtn").disabled = true;

    $("feedbackMessage").textContent =
        "💜 Take a deep breath. You can do this!";

    $("recordTitle").textContent = "Ready to read?";
    $("recordDescription").textContent =
        "Press the button and read aloud clearly.";

    $("liveStatus").textContent = "Your microphone is waiting...";
    $("micSymbol").textContent = "🎙️";
    $("recordBtnText").textContent = "Start Speaking";
    $("recordBtn").classList.remove("recording");
    $("waveform").classList.remove("active");

    releaseAudio();
}

function normalizeWords(text) {
    return text
        .toLowerCase()
        .replace(/[’']/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
}

function displayTranscript() {
    const visible = `${transcriptFinal}${transcriptInterim}`.trim();

    $("transcript").textContent = visible ||
        "Your spoken words will appear here automatically...";
}

function setupRecognition() {
    if (!SpeechRecognitionAPI) {
        $("liveStatus").textContent =
            "Live speech recognition is not supported in this browser. Try a supported version of Chrome.";
        $("recordBtn").disabled = true;
        $("recordBtnText").textContent = "Speech Not Supported";
        return;
    }

    recognition = new SpeechRecognitionAPI();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        isRecognizing = true;
        recognitionEndedUnexpectedly = false;
        $("liveStatus").textContent = "Listening... Speak clearly in English.";
    };

    recognition.onresult = (event) => {
        let finalText = "";
        let interimText = "";

        for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];

            if (result.isFinal) {
                finalText += result[0].transcript + " ";
            } else {
                interimText += result[0].transcript + " ";
            }
        }

        transcriptFinal = finalText.trim()
            ? finalText.trim() + " "
            : "";

        transcriptInterim = interimText;

        displayTranscript();
    };

    recognition.onerror = (event) => {
        if (event.error === "no-speech") {
            $("liveStatus").textContent =
                "No speech detected yet. Try speaking a little louder.";
            return;
        }

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            recognitionEndedUnexpectedly = true;
            $("liveStatus").textContent =
                "Microphone permission denied. Allow microphone access in browser settings.";
            showToast("Please allow microphone access and try again.");
            return;
        }

        if (event.error === "audio-capture") {
            recognitionEndedUnexpectedly = true;
            $("liveStatus").textContent =
                "No working microphone was found. Check your microphone.";
            return;
        }

        if (event.error === "network") {
            $("liveStatus").textContent =
                "Speech recognition needs a working internet connection in this browser.";
            return;
        }

        if (event.error !== "aborted") {
            $("liveStatus").textContent =
                `Speech recognition issue: ${event.error}. You can stop and try again.`;
        }
    };

    recognition.onend = () => {
        isRecognizing = false;

        if (isRecording && !recognitionEndedUnexpectedly) {
            try {
                recognition.start();
            } catch (error) {
                // The browser may already be starting recognition again.
            }
        } else if (!isRecording) {
            $("liveStatus").textContent = transcriptFinal.trim()
                ? "Recording stopped. Check your transcript below."
                : "No words were recognized. Please try again.";
        }
    };
}

async function startRecording() {
    if (!SpeechRecognitionAPI || !recognition) {
        showToast("Your browser does not support live speech recognition.");
        return;
    }

    try {
        transcriptFinal = "";
        transcriptInterim = "";
        audioChunks = [];
        recordedSeconds = 0;
        recognitionEndedUnexpectedly = false;

        releaseAudio();

        mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        if (window.MediaRecorder) {
            const options = {};

            if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
                options.mimeType = "audio/webm;codecs=opus";
            } else if (MediaRecorder.isTypeSupported("audio/webm")) {
                options.mimeType = "audio/webm";
            }

            mediaRecorder = new MediaRecorder(mediaStream, options);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                if (audioChunks.length > 0) {
                    const type = mediaRecorder.mimeType || "audio/webm";
                    const blob = new Blob(audioChunks, { type });

                    audioUrl = URL.createObjectURL(blob);
                    $("playAudioBtn").disabled = false;
                }

                releaseMicrophone();
            };

            mediaRecorder.start();
        } else {
            showToast("Audio playback recording is not supported here, but speech recognition may still work.");
        }

        isRecording = true;
        startTime = Date.now();

        $("recordBtn").classList.add("recording");
        $("recordBtnText").textContent = "Stop Speaking";
        $("recordTitle").textContent = "You're doing great!";
        $("recordDescription").textContent =
            "Speak naturally. Your words will appear below.";
        $("micSymbol").textContent = "🔴";
        $("waveform").classList.add("active");
        $("feedbackMessage").textContent =
            "🎙️ Keep reading until you finish the paragraph.";

        $("resultsPanel").hidden = true;
        $("analyzeBtn").disabled = true;

        timerInterval = setInterval(updateTimer, 250);

        try {
            recognition.start();
        } catch (error) {
            if (!isRecognizing) throw error;
        }
    } catch (error) {
        isRecording = false;
        stopTimer();
        releaseMicrophone();

        $("recordBtn").classList.remove("recording");
        $("recordBtnText").textContent = "Start Speaking";
        $("micSymbol").textContent = "🎙️";
        $("waveform").classList.remove("active");
        $("analyzeBtn").disabled = false;

        if (error.name === "NotAllowedError" ||
            error.name === "PermissionDeniedError") {
            $("liveStatus").textContent =
                "Microphone permission denied. Allow microphone access in browser settings.";
        } else if (error.name === "NotFoundError") {
            $("liveStatus").textContent =
                "No microphone was found on this device.";
        } else {
            $("liveStatus").textContent =
                "Could not start the microphone. Try using HTTPS or localhost and allow microphone access.";
        }
    }
}

function stopRecording() {
    isRecording = false;

    stopTimer();

    $("recordBtn").classList.remove("recording");
    $("recordBtnText").textContent = "Start Speaking";
    $("recordTitle").textContent = "Reading finished";
    $("recordDescription").textContent =
        "Review your words or listen to your recording.";
    $("micSymbol").textContent = "🎙️";
    $("waveform").classList.remove("active");
    $("analyzeBtn").disabled = false;

    if (recognition) {
        try {
            recognition.stop();
        } catch (error) {
            // It may already have stopped.
        }
    }

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
    } else {
        releaseMicrophone();
    }

    transcriptFinal = transcriptFinal.trim();
    transcriptInterim = "";

    displayTranscript();
    updateTimer();

    $("liveStatus").textContent = transcriptFinal
        ? "Recording stopped. You can check your reading now."
        : "No words were recognized. Try again in a quiet place.";

    if (!transcriptFinal) {
        $("feedbackMessage").textContent =
            "💡 We couldn't recognize your speech. Check your microphone and try again.";
    }
}

function releaseMicrophone() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
}

function releaseAudio() {
    if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        audioUrl = null;
    }

    $("playAudioBtn").disabled = true;
}

function updateTimer() {
    if (isRecording) {
        recordedSeconds = Math.floor((Date.now() - startTime) / 1000);
    }

    const minutes = Math.floor(recordedSeconds / 60);
    const seconds = recordedSeconds % 60;

    $("timer").textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    updateTimer();
}

function speakParagraph(rate = 1) {
    if (!("speechSynthesis" in window)) {
        showToast("Text-to-speech is not supported in this browser.");
        return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
        challenges[currentLevel - 1].text
    );

    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
}

function calculateSimilarity(expectedWords, spokenWords) {
    const rows = expectedWords.length + 1;
    const cols = spokenWords.length + 1;

    const dp = Array.from(
        { length: rows },
        () => new Uint16Array(cols)
    );

    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            if (expectedWords[i - 1] === spokenWords[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const correctCount = dp[rows - 1][cols - 1];
    const missedCount = expectedWords.length - correctCount;
    const extraCount = spokenWords.length - correctCount;

    const accuracy = expectedWords.length
        ? Math.round((correctCount / expectedWords.length) * 100)
        : 0;

    return {
        correctCount,
        missedCount,
        extraCount,
        accuracy,
        dp
    };
}

function buildWordReview(expectedWords, spokenWords, dp) {
    const result = [];
    let i = expectedWords.length;
    let j = spokenWords.length;

    while (i > 0 || j > 0) {
        if (
            i > 0 &&
            j > 0 &&
            expectedWords[i - 1] === spokenWords[j - 1]
        ) {
            result.push({
                word: expectedWords[i - 1],
                type: "correct"
            });
            i--;
            j--;
        } else if (
            i > 0 &&
            (j === 0 || dp[i - 1][j] >= dp[i][j - 1])
        ) {
            result.push({
                word: expectedWords[i - 1],
                type: "missed"
            });
            i--;
        } else {
            result.push({
                word: spokenWords[j - 1],
                type: "extra"
            });
            j--;
        }
    }

    return result.reverse();
}

function checkReading() {
    if (isRecording) {
        showToast("Stop speaking before checking your reading.");
        return;
    }

    const spokenText = transcriptFinal.trim();

    if (!spokenText) {
        showToast("🎙️ Speak first! We need recognized words to calculate your score.");
        return;
    }

    const expectedWords = normalizeWords(
        challenges[currentLevel - 1].text
    );

    const spokenWords = normalizeWords(spokenText);

    if (!spokenWords.length) {
        showToast("No readable words were recognized. Please try again.");
        return;
    }

    const result = calculateSimilarity(expectedWords, spokenWords);

    lastResult = result;

    $("resultsPanel").hidden = false;
    $("accuracyScore").textContent = `${result.accuracy}%`;

    const ringColor = result.accuracy >= PASS_MARK
        ? "#86efac"
        : "#fbbf24";

    $("resultRing").style.background = `
        radial-gradient(closest-side, #1d1536 80%, transparent 82% 100%),
        conic-gradient(${ringColor} ${result.accuracy}%, #ffffff12 0%)
    `;

    $("correctWords").textContent = result.correctCount;
    $("missedWords").textContent = result.missedCount;

    const earned = Math.round(result.accuracy / 10);
    $("earnedXP").textContent = earned;

    if (result.accuracy >= 95) {
        $("resultTitle").textContent = "Outstanding! 🌟";
        $("resultDescription").textContent =
            "Excellent word matching! Keep practicing to maintain your confidence.";
    } else if (result.accuracy >= PASS_MARK) {
        $("resultTitle").textContent = "Well Done! 🎉";
        $("resultDescription").textContent =
            "You reached the passing score. Your next level is ready!";
    } else {
        $("resultTitle").textContent = "Keep Practicing 💜";
        $("resultDescription").textContent =
            `You scored ${result.accuracy}%. Reach ${PASS_MARK}% to unlock the next level.`;
    }

    const review = buildWordReview(
        expectedWords,
        spokenWords,
        result.dp
    );

    const reviewContainer = $("wordReview");
    reviewContainer.innerHTML = "";

    review.forEach(item => {
        const chip = document.createElement("span");
        chip.className = `word-chip ${item.type}`;
        chip.textContent = item.word;
        reviewContainer.appendChild(chip);
    });

    const passed = result.accuracy >= PASS_MARK;
    const alreadyCompleted = completedLevels.includes(currentLevel);

    if (passed) {
        $("feedbackMessage").textContent =
            "✨ Great reading! Compare the highlighted words and keep improving.";

        if (!alreadyCompleted) {
            completedLevels.push(currentLevel);
            completedLevels.sort((a, b) => a - b);

            earnedXP += earned;

            const finishedLevel = currentLevel;

            if (finishedLevel < TOTAL_LEVELS) {
                currentLevel = finishedLevel + 1;
                hasCompletedAll = false;

                $("unlockMessage").hidden = false;
                $("nextBtn").textContent = "Continue to Next Level →";
            } else {
                hasCompletedAll = true;
                $("unlockMessage").hidden = false;
                $("unlockMessage").textContent =
                    "🏆 YOU COMPLETED ALL 20 READING LEVELS! Amazing achievement!";
                $("nextBtn").textContent = "Celebrate Your Achievement 🎉";
            }

            saveProgress();
            renderPage();

            $("celebrationTitle").textContent =
                finishedLevel === TOTAL_LEVELS
                    ? "Reading Champion! 🏆"
                    : "LEVEL UNLOCKED! 🎉";

            $("celebrationText").textContent =
                finishedLevel === TOTAL_LEVELS
                    ? `You completed all ${TOTAL_LEVELS} reading levels and earned ${earnedXP} XP!`
                    : `You passed Level ${finishedLevel} and unlocked Level ${finishedLevel + 1}. Keep going!`;

            showCelebration();
        } else {
            $("unlockMessage").hidden = false;
            $("unlockMessage").textContent =
                "⭐ You have already completed this level. Try to improve your score!";
            $("nextBtn").textContent =
                currentLevel < TOTAL_LEVELS
                    ? "Continue to Next Level →"
                    : "Celebrate Your Achievement 🎉";

            saveProgress();
        }
    } else {
        $("feedbackMessage").textContent =
            "💜 Don't worry! Listen once more, read slowly, and try again.";

        $("unlockMessage").hidden = true;
        $("nextBtn").textContent = "Retry This Level ↻";
    }

    $("resultsPanel").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function showCelebration() {
    const overlay = $("celebrationOverlay");
    const container = $("confettiContainer");

    container.innerHTML = "";

    for (let i = 0; i < 65; i++) {
        const piece = document.createElement("span");

        piece.className = "confetti";
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.setProperty("--hue", Math.floor(Math.random() * 360));
        piece.style.setProperty("--fall-duration", `${2 + Math.random() * 3}s`);
        piece.style.setProperty("--drift", `${Math.random() * 160 - 80}px`);
        piece.style.animationDelay = `${Math.random() * 1.2}s`;

        container.appendChild(piece);
    }

    overlay.hidden = false;
}

function hideCelebration() {
    $("celebrationOverlay").hidden = true;
    $("confettiContainer").innerHTML = "";
}

function goNext() {
    if (isRecording) {
        showToast("Stop your recording first.");
        return;
    }

    if (!lastResult) {
        showToast("Check your reading before continuing.");
        return;
    }

    if (lastResult.accuracy < PASS_MARK) {
        resetExerciseUI();
        return;
    }

    if (currentLevel >= TOTAL_LEVELS && hasCompletedAll) {
        showToast("🏆 You completed all 20 levels! You are a Reading Champion!");
        return;
    }

    currentLevel = Math.min(TOTAL_LEVELS, currentLevel);

    lastResult = null;
    resetExerciseUI();
    renderPage();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function showToast(message) {
    const toast = $("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

function playRecording() {
    if (!audioUrl) {
        showToast("No recording is available. Record your reading first.");
        return;
    }

    const audio = new Audio(audioUrl);

    audio.play().catch(() => {
        showToast("Could not play the recording. Try recording again.");
    });
}

function initialize() {
    loadProgress();
    renderPage();
    setupRecognition();

    $("recordBtn").addEventListener("click", () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });

    $("listenBtn").addEventListener("click", () => {
        speakParagraph(1);
    });

    $("slowListenBtn").addEventListener("click", () => {
        speakParagraph(0.72);
    });

    $("analyzeBtn").addEventListener("click", checkReading);
    $("nextBtn").addEventListener("click", goNext);
    $("clearBtn").addEventListener("click", () => {
        if (isRecording) {
            stopRecording();
        }

        resetExerciseUI();
        showToast("Ready for another attempt! 💜");
    });

    $("playAudioBtn").addEventListener("click", playRecording);

    $("celebrationBtn").addEventListener("click", () => {
        hideCelebration();

        if (hasCompletedAll && completedLevels.length === TOTAL_LEVELS) {
            showToast("🏆 All 20 levels completed. Amazing work!");
            return;
        }

        lastResult = null;
        resetExerciseUI();
        renderPage();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("beforeunload", () => {
        if (recognition && isRecording) {
            try {
                recognition.stop();
            } catch (error) {
                // Ignore shutdown errors.
            }
        }

        releaseMicrophone();
        stopTimer();
    });
}

initialize();