/* =========================================
   SPEAKWISE - TONGUE TWISTER ENGINE
   ========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. CHALLENGE DATA - 20 LEVELS
    // =====================================

    const challenges = [

        {
            level: 1,
            title: "The First Twist",
            difficulty: "Beginner",
            category: "SOUND STARTER",
            text: "She sells seashells by the seashore.",
            hint: "Start slowly. Notice the difference between 'she' and 'sea'."
        },

        {
            level: 2,
            title: "Peter's Pepper",
            difficulty: "Beginner",
            category: "P SOUND",
            text: "Peter Piper picked a peck of pickled peppers.",
            hint: "Focus on the repeated P sound. Avoid rushing."
        },

        {
            level: 3,
            title: "Busy Bees",
            difficulty: "Beginner",
            category: "B SOUND",
            text: "Busy buzzing bees buzz by beautiful bluebells.",
            hint: "Make the B sound clear and steady."
        },

        {
            level: 4,
            title: "Wooden Woodchuck",
            difficulty: "Beginner",
            category: "W SOUND",
            text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
            hint: "Keep your W sound smooth. Pause briefly if needed."
        },

        {
            level: 5,
            title: "Fuzzy Wuzzy",
            difficulty: "Beginner",
            category: "F AND Z SOUNDS",
            text: "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair.",
            hint: "Pay attention to the F, Z and W sounds."
        },

        {
            level: 6,
            title: "Three Free Throws",
            difficulty: "Easy",
            category: "TH SOUND",
            text: "Three free throws thrilled three thoughtful thinkers.",
            hint: "Place your tongue gently between your teeth for TH."
        },

        {
            level: 7,
            title: "Red Leather",
            difficulty: "Easy",
            category: "R AND L SOUNDS",
            text: "Red leather, yellow leather.",
            hint: "Alternate carefully between R and L."
        },

        {
            level: 8,
            title: "Six Sticky Sticks",
            difficulty: "Easy",
            category: "S AND ST SOUNDS",
            text: "Six sticky sticks stuck six silly students.",
            hint: "Separate the S and ST sounds instead of blending them."
        },

        {
            level: 9,
            title: "Clever Cats",
            difficulty: "Easy",
            category: "C SOUND",
            text: "Clever cats carefully carry colorful cups.",
            hint: "Make the beginning C sound crisp."
        },

        {
            level: 10,
            title: "A Proper Copper",
            difficulty: "Intermediate",
            category: "P AND R SOUNDS",
            text: "A proper copper coffee pot.",
            hint: "Keep every word distinct. Try three repetitions."
        },

        {
            level: 11,
            title: "Fresh Fried Fish",
            difficulty: "Intermediate",
            category: "F AND SH SOUNDS",
            text: "Fresh fried fish, fish fresh fried, fried fish fresh.",
            hint: "Notice how the F and SH sounds change between words."
        },

        {
            level: 12,
            title: "Tricky Trains",
            difficulty: "Intermediate",
            category: "TR SOUND",
            text: "Thirty-three thirsty travelers travelled through town.",
            hint: "Give TR and TH their own clear sounds."
        },

        {
            level: 13,
            title: "Seventy-Seven",
            difficulty: "Intermediate",
            category: "S AND V SOUNDS",
            text: "Seventy-seven silly sailors sailed seven seas.",
            hint: "Keep S and V different. Don't let the ending disappear."
        },

        {
            level: 14,
            title: "Shy Sheep",
            difficulty: "Intermediate",
            category: "SH SOUND",
            text: "Six shy sheep should sleep in the shade.",
            hint: "Keep the SH sound smooth, not too sharp."
        },

        {
            level: 15,
            title: "Black Backpacks",
            difficulty: "Advanced",
            category: "BL AND BR SOUNDS",
            text: "Black backpacks bring bright books back.",
            hint: "Practice BL, BR and B combinations."
        },

        {
            level: 16,
            title: "The Thoughtful Author",
            difficulty: "Advanced",
            category: "TH SOUND",
            text: "The thoughtful author thanked three enthusiastic readers.",
            hint: "Stay calm when several TH sounds appear close together."
        },

        {
            level: 17,
            title: "Rolling Rivers",
            difficulty: "Advanced",
            category: "R SOUND",
            text: "Rapidly rolling rivers run around rugged rocks.",
            hint: "Keep R clear throughout the sentence."
        },

        {
            level: 18,
            title: "Strange Streets",
            difficulty: "Advanced",
            category: "STR AND ST SOUNDS",
            text: "Strange strong strangers stroll through narrow streets.",
            hint: "Break the sentence into small groups before repeating it."
        },

        {
            level: 19,
            title: "The Challenging Chef",
            difficulty: "Expert",
            category: "CH AND SH SOUNDS",
            text: "The cheerful chef chose freshly chopped cherries and cheese.",
            hint: "Notice the difference between CH, SH and the soft sounds."
        },

        {
            level: 20,
            title: "Ultimate Tongue Challenge",
            difficulty: "Expert",
            category: "FINAL CHALLENGE",
            text: "Three thrilling thinkers threw thirty-three thick threads through three thorny thickets.",
            hint: "This is your final challenge. Prioritize clarity over speed."
        }

    ];


    // =====================================
    // 2. SETTINGS
    // =====================================

    const PASS_SCORE = 70;
    const XP_PER_LEVEL = 20;

    const PROGRESS_KEY = "speakwise_tongue_progress";
    const XP_KEY = "speakwise_total_xp";
    const STREAK_KEY = "speakwise_streak";

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    // =====================================
    // 3. HTML ELEMENTS
    // =====================================

    const $ = (id) => document.getElementById(id);

    const levelPath = $("levelPath");

    const topXP = $("topXP");

    const completedLevelsElement = $("completedLevels");
    const overallBar = $("overallBar");
    const overallText = $("overallText");

    const levelCategory = $("levelCategory");
    const challengeTitle = $("challengeTitle");
    const difficultyBadge = $("difficultyBadge");
    const challengeNumber = $("challengeNumber");
    const twisterText = $("twisterText");
    const challengeHint = $("challengeHint");

    const listenButton = $("listenButton");
    const slowButton = $("slowButton");

    const recordButton = $("recordButton");
    const micIcon = $("micIcon");
    const micInstruction = $("micInstruction");
    const micWave = $("micWave");
    const recordingStatus = $("recordingStatus");

    const transcriptDot = $("transcriptDot");
    const transcriptState = $("transcriptState");
    const transcriptText = $("transcriptText");

    const analyzeButton = $("analyzeButton");
    const retryButton = $("retryButton");

    const audioPlayback = $("audioPlayback");
    const recordedAudio = $("recordedAudio");

    const resultsCard = $("resultsCard");
    const resultsIcon = $("resultsIcon");

    const accuracyScore = $("accuracyScore");
    const scoreCircle = $("scoreCircle");
    const correctWords = $("correctWords");
    const missedWords = $("missedWords");
    const earnedXP = $("earnedXP");

    const feedbackTitle = $("feedbackTitle");
    const feedbackText = $("feedbackText");
    const wordComparison = $("wordComparison");

    const unlockBanner = $("unlockBanner");
    const unlockTitle = $("unlockTitle");
    const unlockMessage = $("unlockMessage");

    const nextButton = $("nextButton");
    const resultRetryButton = $("resultRetryButton");

    const unlockModal = $("unlockModal");
    const modalTitle = $("modalTitle");
    const modalMessage = $("modalMessage");
    const modalXP = $("modalXP");
    const modalContinue = $("modalContinue");

    const browserNote = $("browserNote");
    const toast = $("toast");


    // =====================================
    // 4. APPLICATION STATE
    // =====================================

    let currentLevel = 1;

    let recognition = null;
    let mediaRecorder = null;
    let microphoneStream = null;
    let recordedChunks = [];
    let recordingObjectURL = null;

    let isRecognizing = false;
    let isStopping = false;
    let isAnalyzing = false;
    let hasSpeechError = false;

    let finalTranscript = "";
    let latestTranscript = "";

    let transcriptReceived = false;
    let sessionHasResult = false;
    let recognitionFinished = false;

    let recognitionGeneration = 0;
    let speechErrorMessage = "";

    let lastResult = null;

    let toastTimer = null;
    let recognitionStartPromise = null;

    const supportedSpeech = Boolean(SpeechRecognition);


    // =====================================
    // 5. SAFE STORAGE HELPERS
    // =====================================

    function readStorage(key, fallback) {

        try {

            const raw = localStorage.getItem(key);

            if (raw === null) {
                return fallback;
            }

            return JSON.parse(raw);

        } catch (error) {

            console.warn("Storage read error:", error);

            return fallback;
        }
    }


    function writeStorage(key, value) {

        try {

            localStorage.setItem(key, JSON.stringify(value));

            return true;

        } catch (error) {

            console.warn("Storage write error:", error);

            showToast(
                "Browser storage is unavailable. Your progress may not be saved."
            );

            return false;
        }
    }


    function getProgress() {

        const stored = readStorage(PROGRESS_KEY, {});

        if (!stored || typeof stored !== "object") {
            return {
                completedLevels: [],
                unlockedLevel: 1,
                scores: {}
            };
        }

        const completedLevels = Array.isArray(stored.completedLevels)
            ? stored.completedLevels.filter((level) => {
                return (
                    Number.isInteger(level) &&
                    level >= 1 &&
                    level <= challenges.length
                );
            })
            : [];

        const unlockedLevel = Number.isInteger(stored.unlockedLevel)
            ? Math.max(
                1,
                Math.min(challenges.length, stored.unlockedLevel)
            )
            : 1;

        return {
            ...stored,
            completedLevels: [...new Set(completedLevels)],
            unlockedLevel,
            scores:
                stored.scores && typeof stored.scores === "object"
                    ? stored.scores
                    : {}
        };
    }


    function saveProgress(progress) {

        writeStorage(PROGRESS_KEY, progress);
    }


    function getTotalXP() {

        const raw = readStorage(XP_KEY, 0);
        const value = Number(raw);

        return Number.isFinite(value) && value >= 0
            ? Math.floor(value)
            : 0;
    }


    function setTotalXP(value) {

        writeStorage(XP_KEY, Math.max(0, Math.floor(value)));
    }


    function getCurrentStreak() {

        const raw = readStorage(STREAK_KEY, 0);
        const value = Number(raw);

        return Number.isFinite(value) && value >= 0
            ? Math.floor(value)
            : 0;
    }


    // =====================================
    // 6. TOAST MESSAGE
    // =====================================

    function showToast(message) {

        if (!toast) {
            return;
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }


    // =====================================
    // 7. UPDATE XP DISPLAY
    // =====================================

    function updateXPDisplay() {

        if (topXP) {
            topXP.textContent = `${getTotalXP()} XP`;
        }
    }


    // =====================================
    // 8. BUILD LEVEL MAP
    // =====================================

    function renderLevelPath() {

        if (!levelPath) {
            return;
        }

        const progress = getProgress();

        levelPath.replaceChildren();

        challenges.forEach((challenge) => {

            const level = challenge.level;

            const isCompleted =
                progress.completedLevels.includes(level);

            const isLocked =
                level > progress.unlockedLevel;

            const button = document.createElement("button");

            button.type = "button";
            button.className = "level-node";

            button.setAttribute(
                "aria-label",
                `Level ${level}: ${challenge.title}`
            );

            if (isCompleted) {

                button.classList.add("completed");
                button.textContent = "★";

                button.title =
                    `Level ${level} completed. Click to practice again.`;

            } else if (isLocked) {

                button.classList.add("locked");
                button.disabled = true;

                const lock = document.createElement("span");

                lock.className = "node-lock";
                lock.textContent = "🔒";

                button.appendChild(lock);

                button.title = `Complete the previous level to unlock Level ${level}.`;

            } else {

                button.classList.add("current");
                button.textContent = String(level);

                button.title = `Play Level ${level}: ${challenge.title}`;
            }

            button.addEventListener("click", () => {

                if (isLocked) {
                    showToast("Complete the previous level first!");
                    return;
                }

                loadLevel(level);

                $("challengeTitle").scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });

            levelPath.appendChild(button);
        });
    }


    // =====================================
    // 9. UPDATE OVERALL PROGRESS
    // =====================================

    function updateOverallProgress() {

        const progress = getProgress();

        const completed = progress.completedLevels.length;

        const percentage = Math.round(
            (completed / challenges.length) * 100
        );

        completedLevelsElement.textContent = String(completed);

        overallBar.style.width = `${percentage}%`;

        if (completed === challenges.length) {

            overallText.textContent =
                "Amazing! You completed all 20 challenges!";

        } else if (completed === 0) {

            overallText.textContent =
                "Start your first challenge!";

        } else {

            overallText.textContent =
                `${completed} challenge${completed === 1 ? "" : "s"} completed. Keep going!`;

        }
    }


    // =====================================
    // 10. STOP SPEECH SYNTHESIS
    // =====================================

    function stopSpeaking() {

        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
    }


    // =====================================
    // 11. LISTEN TO CHALLENGE
    // =====================================

    function speakChallenge(rate = 1) {

        if (!("speechSynthesis" in window)) {

            showToast(
                "Audio reading is not supported by this browser."
            );

            return;
        }

        stopSpeaking();

        const challenge = challenges[currentLevel - 1];

        const utterance = new SpeechSynthesisUtterance(
            challenge.text
        );

        utterance.lang = "en-US";
        utterance.rate = rate;
        utterance.pitch = 1;

        window.speechSynthesis.speak(utterance);
    }


    listenButton.addEventListener("click", () => {
        speakChallenge(1);
    });


    slowButton.addEventListener("click", () => {
        speakChallenge(0.72);
    });


    // =====================================
    // 12. UPDATE RECORDING UI
    // =====================================

    function setRecordingUI(active) {

        if (active) {

            recordButton.classList.add("recording");

            recordButton.setAttribute(
                "aria-label",
                "Stop speaking"
            );

            micIcon.textContent = "⏹️";

            micInstruction.textContent =
                "Listening... speak clearly into your microphone.";

            recordingStatus.classList.add("is-recording");
            recordingStatus.classList.remove("is-ready");

            recordingStatus.lastChild.textContent = " Listening";

            micWave.classList.add("active");
            transcriptDot.classList.add("active");

        } else {

            recordButton.classList.remove("recording");

            recordButton.setAttribute(
                "aria-label",
                "Start speaking"
            );

            micIcon.textContent = "🎙️";

            recordingStatus.classList.remove("is-recording");
            recordingStatus.classList.add("is-ready");

            micWave.classList.remove("active");
            transcriptDot.classList.remove("active");
        }
    }


    function setTranscript(message, isError = false) {

        transcriptText.textContent = message;

        transcriptText.classList.toggle(
            "error-text",
            isError
        );

        transcriptText.classList.toggle(
            "has-text",
            !isError && Boolean(message)
        );

        transcriptText.classList.remove("interim");
    }


    // =====================================
    // 13. CLEAN UP AUDIO RESOURCES
    // =====================================

    function stopMicrophoneTracks() {

        if (microphoneStream) {

            microphoneStream.getTracks().forEach((track) => {
                track.stop();
            });

            microphoneStream = null;
        }
    }


    function releaseRecordedAudio() {

        if (recordedAudio) {
            recordedAudio.pause();
            recordedAudio.removeAttribute("src");
            recordedAudio.load();
        }

        if (recordingObjectURL) {

            URL.revokeObjectURL(recordingObjectURL);

            recordingObjectURL = null;
        }

        audioPlayback.hidden = true;
    }


    // =====================================
    // 14. RESET CURRENT ATTEMPT
    // =====================================

    function resetAttempt() {

        if (isRecognizing) {
            stopRecognition();
        }

        recognitionGeneration++;

        stopSpeaking();

        isRecognizing = false;
        isStopping = false;
        isAnalyzing = false;
        hasSpeechError = false;

        finalTranscript = "";
        latestTranscript = "";

        transcriptReceived = false;
        sessionHasResult = false;
        recognitionFinished = false;

        speechErrorMessage = "";
        lastResult = null;

        releaseRecordedAudio();

        setRecordingUI(false);

        recordingStatus.lastChild.textContent = " Ready";

        transcriptState.textContent = "Waiting for speech";

        setTranscript(
            "Your spoken words will appear here automatically..."
        );

        micInstruction.textContent =
            "Tap the microphone and start speaking.";

        analyzeButton.disabled = true;

        resultsCard.hidden = true;
        unlockBanner.hidden = true;

        nextButton.disabled = false;
        nextButton.textContent = "Next Level →";

        stopMicrophoneTracks();
    }


    // =====================================
    // 15. PREPARE RECOGNITION
    // =====================================

    function createRecognition() {

        if (!supportedSpeech) {
            return null;
        }

        const engine = new SpeechRecognition();

        engine.lang = "en-US";
        engine.continuous = true;
        engine.interimResults = true;
        engine.maxAlternatives = 1;

        return engine;
    }


    // =====================================
    // 16. RECOGNITION ERROR MESSAGES
    // =====================================

    function friendlySpeechError(error) {

        const messages = {

            "not-allowed":
                "Microphone permission was denied. Allow microphone access in browser settings.",

            "service-not-allowed":
                "The browser's speech recognition service is blocked.",

            "audio-capture":
                "No working microphone was found. Check your device microphone.",

            "network":
                "Speech recognition needs a network connection in this browser. Check your internet and try again.",

            "no-speech":
                "No speech was detected. Speak clearly and try again.",

            "aborted":
                "Speech recognition was stopped.",

            "language-not-supported":
                "English speech recognition is not supported by this browser.",

            "bad-grammar":
                "Speech recognition encountered a grammar error.",

            "service-not-available":
                "The speech recognition service is unavailable right now."
        };

        return messages[error] ||
            `Speech recognition failed (${error}). Please try again.`;
    }


    // =====================================
    // 17. START SPEECH RECOGNITION
    // =====================================

    async function startRecognition() {

        if (!supportedSpeech) {

            showToast(
                "Live speech-to-text is not supported here. Try Chrome on a supported device."
            );

            return false;
        }

        if (isRecognizing) {
            return true;
        }

        if (recognitionStartPromise) {
            return recognitionStartPromise;
        }

        const generation = recognitionGeneration;

        recognitionStartPromise = (async () => {

            try {

                /*
                   Ask for microphone access first.
                   MediaRecorder will use this stream too.
                */

                if (!navigator.mediaDevices ||
                    !navigator.mediaDevices.getUserMedia) {

                    throw new Error("microphone-api-unavailable");
                }

                microphoneStream =
                    await navigator.mediaDevices.getUserMedia({
                        audio: true
                    });


                /*
                   The user may have switched levels while
                   the permission prompt was open.
                */

                if (generation !== recognitionGeneration) {

                    stopMicrophoneTracks();

                    return false;
                }


                /*
                   MediaRecorder is for saving audio.
                   SpeechRecognition independently creates text.
                */

                startMediaRecorder();


                recognition = createRecognition();

                if (!recognition) {

                    throw new Error("speech-recognition-unavailable");
                }

                recognition.onstart = () => {

                    isRecognizing = true;
                    isStopping = false;

                    setRecordingUI(true);

                    transcriptState.textContent =
                        "Listening for speech...";

                    recordingStatus.lastChild.textContent =
                        " Listening";

                    micInstruction.textContent =
                        "Listening... speak naturally.";

                };


                recognition.onresult = (event) => {

                    if (generation !== recognitionGeneration) {
                        return;
                    }

                    let interimTranscript = "";

                    for (
                        let i = event.resultIndex;
                        i < event.results.length;
                        i++
                    ) {

                        const result = event.results[i];

                        const spokenText =
                            result[0].transcript || "";

                        if (result.isFinal) {

                            finalTranscript +=
                                `${spokenText} `;

                        } else {

                            interimTranscript +=
                                `${spokenText} `;
                        }
                    }

                    finalTranscript =
                        finalTranscript.replace(/\s+/g, " ").trim();

                    latestTranscript =
                        `${finalTranscript} ${interimTranscript}`
                            .replace(/\s+/g, " ")
                            .trim();

                    if (latestTranscript) {

                        transcriptReceived = true;

                        transcriptText.textContent =
                            latestTranscript;

                        transcriptText.classList.add("has-text");

                        transcriptText.classList.toggle(
                            "interim",
                            Boolean(interimTranscript)
                        );

                        transcriptText.classList.remove("error-text");

                        transcriptState.textContent =
                            interimTranscript
                                ? "Recognizing..."
                                : "Speech recognized";

                        analyzeButton.disabled = false;
                    }
                };


                recognition.onerror = (event) => {

                    if (generation !== recognitionGeneration) {
                        return;
                    }

                    hasSpeechError = true;

                    speechErrorMessage =
                        friendlySpeechError(event.error);

                    transcriptState.textContent = "Recognition error";

                    if (event.error === "no-speech") {

                        /*
                           Some implementations fire no-speech
                           even when the user briefly pauses.
                           Preserve any text already recognized.
                        */

                        if (!transcriptReceived) {

                            setTranscript(
                                speechErrorMessage,
                                true
                            );

                        }

                    } else if (event.error === "aborted") {

                        /*
                           Expected when the user intentionally
                           stops the recognition session.
                        */

                        if (!isStopping && !transcriptReceived) {

                            setTranscript(
                                speechErrorMessage,
                                true
                            );

                        }

                    } else {

                        if (!transcriptReceived) {

                            setTranscript(
                                speechErrorMessage,
                                true
                            );

                        }

                        showToast(speechErrorMessage);
                    }
                };


                recognition.onend = () => {

                    if (generation !== recognitionGeneration) {
                        return;
                    }

                    isRecognizing = false;
                    recognitionFinished = true;

                    setRecordingUI(false);

                    stopMediaRecorder();
                    stopMicrophoneTracks();

                    recordingStatus.lastChild.textContent =
                        " Stopped";

                    if (latestTranscript || finalTranscript) {

                        transcriptState.textContent =
                            "Transcript ready";

                        analyzeButton.disabled = false;

                        micInstruction.textContent =
                            "Speech captured. Analyze your result.";

                    } else if (hasSpeechError) {

                        transcriptState.textContent =
                            "Recognition failed";

                        micInstruction.textContent =
                            "Please check the error and try again.";

                    } else {

                        transcriptState.textContent =
                            "No speech detected";

                        micInstruction.textContent =
                            "No text was captured. Try speaking again.";
                    }

                    /*
                       Do not automatically restart recognition.
                       This avoids restart loops after errors.
                    */
                };


                recognition.start();

                return true;

            } catch (error) {

                console.error("Unable to start recognition:", error);

                isRecognizing = false;

                setRecordingUI(false);

                stopMicrophoneTracks();

                let message =
                    "Could not start voice recognition. Please try again.";

                if (error.message === "microphone-api-unavailable") {

                    message =
                        "Microphone access requires a supported browser and secure context. Try localhost or HTTPS.";

                } else if (
                    error.name === "NotAllowedError" ||
                    error.name === "SecurityError"
                ) {

                    message =
                        "Microphone access was denied. Allow it in browser permissions.";

                } else if (error.name === "NotFoundError") {

                    message =
                        "No microphone was found on your device.";

                } else if (error.name === "NotReadableError") {

                    message =
                        "The microphone may be in use by another application.";

                }

                setTranscript(message, true);

                transcriptState.textContent = "Microphone error";

                showToast(message);

                return false;

            } finally {

                recognitionStartPromise = null;
            }

        })();

        return recognitionStartPromise;
    }


    // =====================================
    // 18. RECORD AUDIO
    // =====================================

    function startMediaRecorder() {

        if (
            !microphoneStream ||
            typeof MediaRecorder === "undefined"
        ) {
            return;
        }

        recordedChunks = [];

        try {

            let options = {};

            if (
                typeof MediaRecorder.isTypeSupported === "function"
            ) {

                const possibleTypes = [
                    "audio/webm;codecs=opus",
                    "audio/webm",
                    "audio/mp4"
                ];

                const supportedType = possibleTypes.find((type) => {
                    return MediaRecorder.isTypeSupported(type);
                });

                if (supportedType) {
                    options.mimeType = supportedType;
                }
            }

            mediaRecorder = new MediaRecorder(
                microphoneStream,
                options
            );

            mediaRecorder.ondataavailable = (event) => {

                if (event.data && event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };


            mediaRecorder.onstop = () => {

                if (!recordedChunks.length) {
                    return;
                }

                const mimeType =
                    mediaRecorder.mimeType ||
                    recordedChunks[0].type ||
                    "audio/webm";

                const audioBlob = new Blob(
                    recordedChunks,
                    { type: mimeType }
                );

                if (audioBlob.size === 0) {
                    return;
                }

                if (recordingObjectURL) {
                    URL.revokeObjectURL(recordingObjectURL);
                }

                recordingObjectURL =
                    URL.createObjectURL(audioBlob);

                recordedAudio.src = recordingObjectURL;

                audioPlayback.hidden = false;
            };


            mediaRecorder.start();

        } catch (error) {

            console.warn("Audio recording unavailable:", error);

            mediaRecorder = null;
        }
    }


    function stopMediaRecorder() {

        if (
            mediaRecorder &&
            mediaRecorder.state !== "inactive"
        ) {

            try {
                mediaRecorder.stop();
            } catch (error) {
                console.warn("Unable to stop audio recorder:", error);
            }
        }
    }


    // =====================================
    // 19. STOP SPEECH RECOGNITION
    // =====================================

    function stopRecognition() {

        if (!isRecognizing) {

            stopMediaRecorder();
            stopMicrophoneTracks();

            return;
        }

        isStopping = true;

        setRecordingUI(false);

        micInstruction.textContent =
            "Finishing speech recognition...";

        try {

            if (recognition) {
                recognition.stop();
            }

        } catch (error) {

            console.warn("Recognition stop error:", error);

            isRecognizing = false;

            stopMediaRecorder();
            stopMicrophoneTracks();
        }
    }


    // =====================================
    // 20. MIC BUTTON
    // =====================================

    recordButton.addEventListener("click", async () => {

        if (isAnalyzing) {
            return;
        }

        if (isRecognizing) {

            stopRecognition();

            return;
        }

        /*
           Reset the previous attempt before starting again.
           Do not reset if this is already an active session.
        */

        resetAttempt();

        const started = await startRecognition();

        if (!started) {

            stopMicrophoneTracks();

            setRecordingUI(false);
        }
    });


    // =====================================
    // 21. NORMALIZE WORDS
    // =====================================

    function normalizeWords(text) {

        return text
            .toLocaleLowerCase("en-US")
            .replace(/[’']/g, "")
            .replace(/[^a-z0-9\s]/g, " ")
            .split(/\s+/)
            .filter(Boolean);
    }


    // =====================================
    // 22. COMPARE WORDS USING LCS
    // =====================================

    /*
       LCS = Longest Common Subsequence.

       It finds the best ordered word alignment between
       the expected sentence and recognized speech.

       This is a text-matching score, not phoneme-level
       pronunciation analysis.
    */

    function compareWords(expectedText, spokenText) {

        const expected = normalizeWords(expectedText);
        const spoken = normalizeWords(spokenText);

        const rows = expected.length + 1;
        const cols = spoken.length + 1;

        const dp = Array.from(
            { length: rows },
            () => new Array(cols).fill(0)
        );


        for (let i = 1; i < rows; i++) {

            for (let j = 1; j < cols; j++) {

                if (expected[i - 1] === spoken[j - 1]) {

                    dp[i][j] = dp[i - 1][j - 1] + 1;

                } else {

                    dp[i][j] = Math.max(
                        dp[i - 1][j],
                        dp[i][j - 1]
                    );
                }
            }
        }


        const matchedExpected = new Set();
        const matchedSpoken = new Set();

        let i = expected.length;
        let j = spoken.length;


        while (i > 0 && j > 0) {

            if (expected[i - 1] === spoken[j - 1]) {

                matchedExpected.add(i - 1);
                matchedSpoken.add(j - 1);

                i--;
                j--;

            } else if (
                dp[i - 1][j] >= dp[i][j - 1]
            ) {

                i--;

            } else {

                j--;
            }
        }


        const expectedDisplay = expected.map((word, index) => ({
            word,
            matched: matchedExpected.has(index),
            type: matchedExpected.has(index)
                ? "correct"
                : "missed"
        }));


        const extraWords = spoken
            .map((word, index) => ({
                word,
                index,
                matched: matchedSpoken.has(index)
            }))
            .filter((item) => !item.matched);


        const matchedCount = matchedExpected.size;

        const totalExpected = expected.length;

        const accuracy = totalExpected === 0
            ? 0
            : Math.round((matchedCount / totalExpected) * 100);


        return {
            expected,
            spoken,
            matchedCount,
            missedCount: totalExpected - matchedCount,
            extraWords,
            expectedDisplay,
            accuracy
        };
    }


    // =====================================
    // 23. DISPLAY WORD COMPARISON
    // =====================================

    function renderWordComparison(result) {

        wordComparison.replaceChildren();

        result.expectedDisplay.forEach((item) => {

            const chip = document.createElement("span");

            chip.className = `word-chip ${item.type}`;

            chip.textContent = item.word;

            chip.title = item.matched
                ? "Word recognized in the correct order"
                : "Word not matched";

            wordComparison.appendChild(chip);
        });


        result.extraWords.forEach((item) => {

            const chip = document.createElement("span");

            chip.className = "word-chip extra";

            chip.textContent = `+ ${item.word}`;

            chip.title = "Additional recognized word";

            wordComparison.appendChild(chip);
        });


        if (!result.expected.length) {

            const message = document.createElement("p");

            message.textContent =
                "No target words were available for comparison.";

            wordComparison.appendChild(message);
        }
    }


    // =====================================
    // 24. ANALYZE SPEECH
    // =====================================

    function analyzeSpeech() {

        if (isRecognizing) {

            showToast("Stop recording before analyzing your speech.");

            return;
        }

        if (isAnalyzing) {
            return;
        }

        const spokenText =
            `${finalTranscript} ${latestTranscript}`
                .replace(/\s+/g, " ")
                .trim();

        const cleanedSpokenText =
            [...new Set([spokenText])]
                .join("")
                .trim();


        /*
           Never generate a score without recognized speech.
        */

        if (!transcriptReceived || !cleanedSpokenText) {

            showToast(
                "No speech transcript was captured. Please speak first."
            );

            setTranscript(
                "No recognized words are available. Start speaking and try again.",
                true
            );

            return;
        }


        const challenge = challenges[currentLevel - 1];

        const result = compareWords(
            challenge.text,
            cleanedSpokenText
        );


        if (result.spoken.length === 0) {

            showToast(
                "No recognizable words were captured. Please retry."
            );

            return;
        }


        isAnalyzing = true;
        sessionHasResult = true;

        lastResult = result;

        displayResults(result);

        isAnalyzing = false;
    }


    analyzeButton.addEventListener("click", analyzeSpeech);


    // =====================================
    // 25. DISPLAY RESULTS
    // =====================================

    function displayResults(result) {

        resultsCard.hidden = false;

        accuracyScore.textContent = `${result.accuracy}%`;

        correctWords.textContent =
            String(result.matchedCount);

        missedWords.textContent =
            String(result.missedCount);

        const score = result.accuracy;

        scoreCircle.style.background =
            `radial-gradient(circle at center, #17102a 60%, transparent 62%), conic-gradient(var(--cyan) ${score}%, rgba(255,255,255,0.08) ${score}%)`;


        renderWordComparison(result);


        const progress = getProgress();

        const alreadyCompleted =
            progress.completedLevels.includes(currentLevel);

        let gainedXP = 0;
        let newlyUnlocked = false;


        if (score >= PASS_SCORE) {

            if (!alreadyCompleted) {

                progress.completedLevels.push(currentLevel);

                progress.completedLevels =
                    [...new Set(progress.completedLevels)]
                        .sort((a, b) => a - b);

                gainedXP = XP_PER_LEVEL;

                setTotalXP(getTotalXP() + gainedXP);

            } else {

                /*
                   Replaying an already completed level
                   does not award XP repeatedly.
                */

                gainedXP = 0;
            }


            const previousUnlocked = progress.unlockedLevel;

            progress.unlockedLevel = Math.max(
                progress.unlockedLevel,
                Math.min(
                    challenges.length,
                    currentLevel + 1
                )
            );

            newlyUnlocked =
                progress.unlockedLevel > previousUnlocked;


            progress.scores[String(currentLevel)] = Math.max(
                Number(progress.scores[String(currentLevel)] || 0),
                score
            );


            saveProgress(progress);

            updateXPDisplay();
            updateOverallProgress();
            renderLevelPath();


            resultsIcon.textContent = "🏆";

            feedbackTitle.textContent =
                score >= 90
                    ? "Excellent speaking! 🌟"
                    : "Great effort! 🎉";

            feedbackText.textContent =
                score >= 90
                    ? "You matched most of the target words. Keep practicing to build even more confidence."
                    : "You reached the passing score. Practice once more if you want to improve your result.";

            earnedXP.textContent = `+${gainedXP}`;

            unlockBanner.hidden = false;

            if (currentLevel === challenges.length) {

                unlockTitle.textContent = "ALL 20 LEVELS COMPLETED!";

                unlockMessage.textContent =
                    "Amazing! You finished the complete Tongue Twister journey.";

                nextButton.textContent = "All Levels Completed ✓";

                nextButton.disabled = true;

            } else {

                unlockTitle.textContent = newlyUnlocked
                    ? "LEVEL UNLOCKED!"
                    : "LEVEL COMPLETED!";

                unlockMessage.textContent = newlyUnlocked
                    ? `Level ${currentLevel + 1} is now ready. Keep going!`
                    : `Your best score for Level ${currentLevel} has been saved.`;

                nextButton.textContent = "Next Level →";

                nextButton.disabled = false;
            }


            if (newlyUnlocked) {

                showUnlockModal(
                    currentLevel + 1,
                    gainedXP
                );
            }

        } else {

            resultsIcon.textContent = "🎯";

            feedbackTitle.textContent = "Keep practicing!";

            feedbackText.textContent =
                `You need at least ${PASS_SCORE}% to unlock the next level. ` +
                "Try speaking slowly and clearly, then compare your transcript with the target sentence.";

            earnedXP.textContent = "0";

            unlockBanner.hidden = true;

            nextButton.disabled = true;

            nextButton.textContent =
                `Reach ${PASS_SCORE}% to unlock`;

            showToast(
                `Your score is ${score}%. Keep practicing to reach ${PASS_SCORE}%.`
            );
        }


        resultsCard.hidden = false;

        resultsCard.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }


    // =====================================
    // 26. UNLOCK MODAL
    // =====================================

    function showUnlockModal(unlockedLevel, gainedXP) {

        if (currentLevel === challenges.length) {

            modalTitle.textContent = "JOURNEY COMPLETED!";

            modalMessage.textContent =
                "You completed all 20 tongue-twister challenges. Amazing work!";

        } else {

            modalTitle.textContent = "LEVEL UNLOCKED!";

            modalMessage.textContent =
                `Level ${unlockedLevel} is ready. You're one step closer to confident English.`;
        }

        modalXP.textContent = `+${gainedXP} XP`;

        unlockModal.hidden = false;

        document.body.style.overflow = "hidden";

        modalContinue.focus();
    }


    function closeUnlockModal() {

        unlockModal.hidden = true;

        document.body.style.overflow = "";
    }


    modalContinue.addEventListener("click", () => {

        closeUnlockModal();

        if (currentLevel < challenges.length) {

            loadLevel(currentLevel + 1);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } else {

            showToast(
                "Congratulations! You completed all 20 levels!"
            );
        }
    });


    unlockModal.addEventListener("click", (event) => {

        if (event.target === unlockModal) {
            closeUnlockModal();
        }
    });


    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape" && !unlockModal.hidden) {
            closeUnlockModal();
        }
    });


    // =====================================
    // 27. LOAD LEVEL
    // =====================================

    function loadLevel(level) {

        const progress = getProgress();

        if (
            !Number.isInteger(level) ||
            level < 1 ||
            level > challenges.length
        ) {
            return;
        }

        if (level > progress.unlockedLevel) {

            showToast("Complete the previous level first!");

            return;
        }

        resetAttempt();

        currentLevel = level;

        const challenge = challenges[level - 1];

        levelCategory.textContent =
            `LEVEL ${String(level).padStart(2, "0")} / ${challenge.category}`;

        challengeTitle.textContent = challenge.title;

        difficultyBadge.textContent =
            `⭐ ${challenge.difficulty}`;

        challengeNumber.textContent =
            String(level).padStart(2, "0");

        twisterText.textContent = challenge.text;

        challengeHint.textContent = `💡 Tip: ${challenge.hint}`;

        updateXPDisplay();

        updateOverallProgress();

        renderLevelPath();

        const existingScore =
            progress.scores[String(level)];

        if (existingScore !== undefined) {

            overallText.textContent =
                `Your best score for this level: ${existingScore}%.`;

        }
    }


    // =====================================
    // 28. RETRY BUTTONS
    // =====================================

    retryButton.addEventListener("click", () => {

        resetAttempt();

        showToast("Ready for another attempt!");

    });


    resultRetryButton.addEventListener("click", () => {

        resetAttempt();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    // =====================================
    // 29. NEXT LEVEL
    // =====================================

    nextButton.addEventListener("click", () => {

        const progress = getProgress();

        if (
            currentLevel >= challenges.length ||
            currentLevel >= progress.unlockedLevel
        ) {

            showToast(
                "Complete this level with at least 70% first."
            );

            return;
        }

        loadLevel(currentLevel + 1);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    // =====================================
    // 30. BROWSER SUPPORT
    // =====================================

    if (!supportedSpeech) {

        browserNote.textContent =
            "Live speech-to-text is not supported in this browser. Try a compatible browser such as Chrome. Microphone recording alone cannot produce a transcript.";

        recordButton.disabled = true;

        setTranscript(
            "Speech recognition is not available in this browser.",
            true
        );

    } else {

        browserNote.textContent =
            "Speech-to-text uses your browser's speech recognition service. Internet access may be required, depending on your browser.";
    }


    if (typeof MediaRecorder === "undefined") {

        browserNote.textContent +=
            " Audio playback recording is not supported here, but speech-to-text may still work.";
    }


    // =====================================
    // 31. PAGE CLEANUP
    // =====================================

    window.addEventListener("pagehide", () => {

        stopSpeaking();

        if (recognition) {

            try {
                recognition.abort();
            } catch (error) {
                // The browser may already have stopped recognition.
            }
        }

        stopMediaRecorder();

        stopMicrophoneTracks();

        if (recordingObjectURL) {
            URL.revokeObjectURL(recordingObjectURL);
            recordingObjectURL = null;
        }
    });


    // =====================================
    // 32. INITIALIZE
    // =====================================

    updateXPDisplay();

    updateOverallProgress();

    renderLevelPath();

    loadLevel(1);

});