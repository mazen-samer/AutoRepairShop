// // const responses = {
// //     "hello": "Hello! How can I help you?",
// //     "what services do you offer?": "We offer a wide range of services such as oil changes, engine diagnostics, brake repairs, tire maintenance, electrical and battery checks, and more.",
// //     "how can I schedule an appointment for maintenance?": "You can schedule an appointment by calling us directly or booking through our website or app.",
// //     "can I come without an appointment?": "It is recommended to book in advance to ensure availability, but you can come without an appointment, and we will address your needs based on availability.",
// //     "do you provide services for specific car brands only?": "No, we provide maintenance services for all car brands and models, whether local or imported.",
// //     "do you offer original spare parts?": "Yes, we use original spare parts or approved parts from the manufacturer to ensure the highest quality and performance for your car.",
// //     "how long does maintenance usually take?": "The time depends on the type of maintenance required. A full car inspection typically takes about an hour, while larger repairs such as engine replacement or brake repair may take several hours.",
// //     "can I wait for my car while it's being serviced?": "Yes, we have a comfortable waiting area for customers while their cars are being serviced.",
// //     "what are the costs for maintenance?": "The cost varies depending on the type of service and the condition of the vehicle. We can provide an estimate after inspecting your car.",
// //     "do you provide a warranty on your services?": "Yes, we offer a warranty on all maintenance services and spare parts. Please refer to our terms and conditions for more details.",
// //     "can I pay with a credit card?": "Yes, we accept credit card payments, as well as other payment methods such as cash or bank transfer.",
// //     "do you offer roadside assistance?": "Yes, we provide roadside assistance in emergency situations like car breakdowns or accidents.",
// //     "can I get a free car inspection?": "We offer free car inspections during special promotions or certain conditions.",
// //     "how do I know if my car needs maintenance?": "It's recommended to follow the manufacturer's maintenance schedule. Common signs that maintenance is needed include unusual noises, dashboard warning lights, or decreased performance.",
// //     "how often should I change my car's oil?": "Oil change intervals depend on the type of oil used and the manufacturer's recommendations. Generally, it's every 5,000 to 10,000 kilometers.",
// //     "why is my cars check engine light on?": "The check engine light can turn on for many reasons, ranging from simple issues like a loose gas cap to more complex problems like engine misfires. We recommend bringing the car in for a diagnostic check.",
// //     "do I need to replace my brake pads regularly?": "Yes, brake pads wear out over time and should be replaced when they become too thin. It’s important to have your brakes inspected regularly to ensure safety.",
// //     "is it safe to drive with worn-out tires?": "No, driving with worn-out tires can be dangerous as it reduces traction, especially in wet or slippery conditions. It’s important to replace tires when they are worn down.",
// //     "how can I improve my car's fuel efficiency?": "To improve fuel efficiency, ensure that your tires are properly inflated, avoid rapid acceleration or hard braking, and follow the manufacturer’s maintenance schedule.",
// //     "can you perform a diagnostic check if my car feels unusual?": "Yes, we can perform a full diagnostic check to identify the issue. It's always best to address unusual car behavior as soon as possible to avoid further damage.",
// //     "what should I do if my car overheats?": "If your car overheats, pull over safely, turn off the engine, and allow it to cool. You may need to check the coolant level or have the radiator inspected.",
// //     "goodbye": "Goodbye! Have a great day!"
// // };
// async function loadFAQData() {
//     try {
//         let response = await fetch("faq.json");
//         let data = await response.json();
//         return data;
//     } catch (error) {
//         console.error("Error loading FAQ data:", error);
//         return {};
//     }
// }

// async function sendMessage() {
//     let userInput = document.getElementById("user-input").value.toLowerCase().trim();
//     if (userInput === "") return;

//     let chatBox = document.getElementById("chat-box");

//     // Add user message
//     let userMessage = document.createElement("div");
//     userMessage.className = "user-message";
//     userMessage.textContent = userInput;
//     chatBox.appendChild(userMessage);

//     let responses = await loadFAQData();

//     let botResponse = "I'm sorry, I don't have an answer for that.";
//     let bestMatch = null;
//     let bestScore = 0.0;

//     Object.entries(responses).forEach(([question, answer]) => {
//         let similarity = compareText(userInput, question);
//         if (similarity > bestScore) {
//             bestScore = similarity;
//             bestMatch = answer;
//         }
//     });

//     if (bestScore > 0.4) {
//         botResponse = bestMatch;
//     }

//     setTimeout(() => {
//         let botMessage = document.createElement("div");
//         botMessage.className = "bot-message";
//         botMessage.textContent = botResponse;
//         chatBox.appendChild(botMessage);
//         chatBox.scrollTop = chatBox.scrollHeight;
//     }, 500);

//     document.getElementById("user-input").value = "";
// }

// function compareText(str1, str2) {
//     let words1 = str1.toLowerCase().split(" ");
//     let words2 = str2.toLowerCase().split(" ");
//     let commonWords = words1.filter(word => words2.includes(word));
//     return commonWords.length / Math.max(words1.length, words2.length);
// }

let model;
let responses = {};

async function loadFAQData() {
    try {
        let response = await fetch("faq.json");
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Error loading FAQ data:", error);
        return {};
    }
}

async function loadModel() {
    model = await use.load();
    console.log("✅ AI Model Loaded");
}

async function findBestMatch(userInput, responses) {
    let questions = Object.keys(responses);
    let inputEmbedding = await model.embed([userInput]);
    let questionsEmbedding = await model.embed(questions);

    let highestScore = 0;
    let bestMatch = "I'm sorry, I don't have an answer for that.";

    let inputVector = inputEmbedding.arraySync()[0];
    let questionsVectors = questionsEmbedding.arraySync();

    questions.forEach((question, index) => {
        let similarity = cosineSimilarity(inputVector, questionsVectors[index]);
        if (similarity > highestScore) {
            highestScore = similarity;
            bestMatch = responses[question];
        }
    });

    return highestScore > 0.5 ? bestMatch : "I'm sorry, I don't have an answer for that.";
}

function cosineSimilarity(vecA, vecB) {
    let dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    let magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    let magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

async function sendMessage() {
    let userInput = document.getElementById("user-input").value.toLowerCase().trim();
    if (userInput === "") return;

    let chatBox = document.getElementById("chat-box");

    let userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.textContent = userInput;
    chatBox.appendChild(userMessage);

    let responses = await loadFAQData();
    let botResponse = await findBestMatch(userInput, responses);

    setTimeout(() => {
        let botMessage = document.createElement("div");
        botMessage.className = "bot-message";
        botMessage.textContent = botResponse;
        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);

    document.getElementById("user-input").value = "";
}

loadModel();
