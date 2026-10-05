// ===============================
// AI CUSTOMER FEEDBACK ANALYZER
// ===============================


// Positive words
const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "awesome",
    "happy",
    "love",
    "liked",
    "best",
    "wonderful",
    "perfect",
    "satisfied",
    "fast",
    "friendly",
    "helpful",
    "comfortable",
    "nice",
    "fantastic"
];


// Negative words
const negativeWords = [
    "bad",
    "poor",
    "worst",
    "hate",
    "angry",
    "sad",
    "slow",
    "late",
    "problem",
    "issue",
    "terrible",
    "disappointed",
    "rude",
    "unhappy",
    "broken",
    "difficult",
    "expensive",
    "delay"
];


// Emotion keywords
const emotionWords = {

    happy: [
        "happy",
        "great",
        "excellent",
        "love",
        "amazing",
        "wonderful",
        "satisfied"
    ],

    angry: [
        "angry",
        "rude",
        "worst",
        "hate",
        "terrible"
    ],

    sad: [
        "sad",
        "disappointed",
        "unhappy",
        "poor"
    ],

    excited: [
        "awesome",
        "fantastic",
        "amazing",
        "perfect"
    ]
};


// Stop words
const stopWords = [
    "the",
    "is",
    "a",
    "an",
    "and",
    "or",
    "to",
    "of",
    "for",
    "in",
    "on",
    "with",
    "this",
    "that",
    "was",
    "very",
    "it",
    "my",
    "i",
    "we",
    "you"
];


// ===============================
// ANALYZE FEEDBACK
// ===============================

function analyzeFeedback() {

    const input = document
        .getElementById("feedbackInput")
        .value
        .toLowerCase()
        .trim();


    if (input === "") {

        alert("Please enter customer feedback first.");

        return;
    }


    // Convert sentence into words
    const words = input
        .replace(/[.,!?]/g, "")
        .split(/\s+/);


    let positiveCount = 0;
    let negativeCount = 0;


    // Count positive and negative words
    words.forEach(function(word) {

        if (positiveWords.includes(word)) {
            positiveCount++;
        }

        if (negativeWords.includes(word)) {
            negativeCount++;
        }

    });


    // ===============================
    // SENTIMENT
    // ===============================

    let sentiment;
    let score;


    if (positiveCount > negativeCount) {

        sentiment = "Positive 😊";

        score = Math.min(
            95,
            60 + positiveCount * 8
        );

    }

    else if (negativeCount > positiveCount) {

        sentiment = "Negative 😞";

        score = Math.max(
            20,
            60 - negativeCount * 8
        );

    }

    else {

        sentiment = "Neutral 😐";

        score = 50;
    }


    // ===============================
    // EMOTION
    // ===============================

    let detectedEmotion = "Neutral 😐";

    let highestCount = 0;


    for (let emotion in emotionWords) {

        let count = 0;

        words.forEach(function(word) {

            if (emotionWords[emotion].includes(word)) {
                count++;
            }

        });


        if (count > highestCount) {

            highestCount = count;

            detectedEmotion =
                emotion.charAt(0).toUpperCase()
                + emotion.slice(1);

        }

    }


    // Add emoji
    if (detectedEmotion === "Happy") {
        detectedEmotion += " 😊";
    }

    else if (detectedEmotion === "Angry") {
        detectedEmotion += " 😡";
    }

    else if (detectedEmotion === "Sad") {
        detectedEmotion += " 😢";
    }

    else if (detectedEmotion === "Excited") {
        detectedEmotion += " 🤩";
    }

    else {
        detectedEmotion = "Neutral 😐";
    }


    // ===============================
    // KEYWORD EXTRACTION
    // ===============================

    const keywords = words.filter(function(word) {

        return (
            word.length > 3 &&
            !stopWords.includes(word)
        );

    });


    // Remove duplicate keywords
    const uniqueKeywords = [...new Set(keywords)];


    // Select maximum 8 keywords
    const finalKeywords =
        uniqueKeywords.slice(0, 8);


    // ===============================
    // DISPLAY RESULTS
    // ===============================

    document.getElementById("sentiment")
        .textContent = sentiment;


    document.getElementById("emotion")
        .textContent = detectedEmotion;


    document.getElementById("score")
        .textContent = score + "%";


    const keywordList =
        document.getElementById("keywordList");


    keywordList.innerHTML = "";


    if (finalKeywords.length === 0) {

        keywordList.innerHTML =
            "<span>No keywords found</span>";

    }

    else {

        finalKeywords.forEach(function(keyword) {

            const span =
                document.createElement("span");

            span.textContent = keyword;

            keywordList.appendChild(span);

        });

    }

}


// ===============================
// CLEAR
// ===============================

function clearFeedback() {

    document.getElementById("feedbackInput")
        .value = "";


    document.getElementById("sentiment")
        .textContent = "Waiting...";


    document.getElementById("emotion")
        .textContent = "Waiting...";


    document.getElementById("score")
        .textContent = "--";


    document.getElementById("keywordList")
        .innerHTML =
        "<span>Waiting for analysis</span>";


    document.getElementById("voiceStatus")
        .textContent = "";

}


// ===============================
// SPEECH RECOGNITION
// ===============================

function startSpeechRecognition() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "Speech recognition is not supported in this browser. Please use Google Chrome."
        );

        return;
    }


    const recognition =
        new SpeechRecognition();


    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;


    document.getElementById("voiceStatus")
        .textContent =
        "🎤 Listening... Please speak your feedback.";


    recognition.start();


    recognition.onresult = function(event) {

        const speechText =
            event.results[0][0].transcript;


        document.getElementById("feedbackInput")
            .value = speechText;


        document.getElementById("voiceStatus")
            .textContent =
            "Speech converted to text successfully.";


        // Automatically analyze
        analyzeFeedback();

    };


    recognition.onerror = function() {

        document.getElementById("voiceStatus")
            .textContent =
            "Unable to recognize speech. Please try again.";

    };


    recognition.onend = function() {

        console.log("Speech recognition ended.");

    };

}