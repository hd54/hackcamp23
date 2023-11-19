const OPENAI_API_KEY = '';

async function callOpenAI(promptText) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const openAIUrl = 'https://api.openai.com/v1/chat/completions';

        xhr.open("POST", openAIUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer YOUR_OPENAI_API_KEY'); // Replace with your actual OpenAI API key

        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response.choices[0].text.trim());
                    } catch (e) {
                        reject('Error parsing response: ' + e.message);
                    }
                } else {
                    reject('API request failed with status: ' + xhr.status);
                }
            }
        };

        const data = {
            prompt: promptText,
            max_tokens: 100
        };

        xhr.send(JSON.stringify(data));
    });
}


chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "getSelectedText",
      title: "Get Selected Text",
      contexts: ["selection"]
    });
});

function sendTextForExplanation(text) {
    let exp = '';
    exp = callOpenAI(text).then(explanation => {
        // Process and use the explanation as needed
        // For example, you can log it or send it back to the content script
        return explanation;
    }).catch(error => {
        console.error('Error:', error);
        return '';
    });
    return Promise.resolve(exp);
}


chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "getSelectedText") {
        chrome.tabs.sendMessage(tab.id, { action: "triggerGetSelectedText" });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("hello");
    if (request.action === 'explainText' && request.text) {
        sendTextForExplanation(request.text)
            .then(explanation => {
                sendResponse({explanation});
                console.log(explanation);
            })
            .catch(error => sendResponse({ error: error.message }));

        return true;  // to indicate you wish to send a response asynchronously
    }
});
