const COHERE_API_KEY = 'oUUAFroaZkVxxXzZTUKE6Mq5zQWg9lDBQnvva7sd'; // Replace with your actual Cohere API key

function callCohere(text) {
    const cohereUrl = 'https://api.cohere.ai/generate';

    return fetch(cohereUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${COHERE_API_KEY}`,
            'Cohere-Version': '2021-11-08'
        },
        body: JSON.stringify({
            prompt: text,
            max_tokens: 150
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.generations && data.generations.length > 0) {
                showDropdownWithResponse(data.generations[0].text.trim());
                return data.generations[0].text.trim();
            } else {
                throw new Error('Invalid response from Cohere API');
            }
        })
        .catch(error => {
            console.error('Error calling Cohere API:', error);
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
    // Call the updated function for Cohere
    return callCohere(text).then(explanation => {
        // Process and use the explanation as needed
        console.log(explanation);
        return explanation;
    }).catch(error => {
        console.error('Error:', error);
        return '';
    });
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

function showDropdownWithResponse(responseText) {
    chrome.storage.local.set({ apiResponse: responseText });
}
