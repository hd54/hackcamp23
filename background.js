function callCohere(text) {
    chrome.storage.local.get('cohereApiKey', function(data) {
        const apiKey = data.cohereApiKey;
        if (apiKey) {
            const cohereUrl = 'https://api.cohere.ai/generate';

            return fetch(cohereUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'Cohere-Version': '2021-11-08'
                },
                body: JSON.stringify({
                    prompt: "Summarize and simplify the following text within 100 words: " + text,
                    max_tokens: 150
                })
            })
                .then(response => {
                    if (!response.ok) {
                        showDropdownWithResponse(`API requested failed with status: ${response.status} ${response.statusText}`)
                        throw new Error(`API request failed with status: ${response.status} ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    if (data.generations && data.generations.length > 0) {
                        let para = data.generations[0].text.trim();
                        let last = para.lastIndexOf('.');
                        let result = '';
                        if (last !== -1) {
                            for (let i = 0; i <= last; i++) {
                                result += para[i];
                            }
                        }
                        showDropdownWithResponse(result);
                        return result;
                    } else {
                        showDropdownWithResponse('Invalid response from Cohere API');
                        throw new Error('Invalid response from Cohere API');
                    }
                })
            .catch(error => {
                showDropdownWithResponse(`Error calling Cohere API: ${error}`);
                console.error('Error calling Cohere API:', error);
            });
        } else {
            showDropdownWithResponse("Error: no API key.");
        }
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
        chrome.runtime.sendMessage({action: "showLoading"});
        chrome.tabs.sendMessage(tab.id, { action: "triggerGetSelectedText" });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'explainText' && request.text) {
        sendTextForExplanation(request.text)
            .then(explanation => {
                sendResponse({explanation});
            })
            .catch(error => {
                sendResponse({ error: error.message });
            });

        return true;  // to indicate you wish to send a response asynchronously
    }
});

function showDropdownWithResponse(responseText) {
    chrome.runtime.sendMessage({action: "showResponse", response: responseText});
    chrome.storage.local.set({ apiResponse: responseText });
}
