const OPENAI_API_KEY = '';

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "getSelectedText",
      title: "Get Selected Text",
      contexts: ["selection"]
    });
});
}

function sendTextForExplanation(text) {
    console.log("Sending...");
    callOpenAI(text).then(explanation => {
        // Process and use the explanation as needed
        // For example, you can log it or send it back to the content script
        console.log(explanation);
    }).catch(error => {
        console.error('Error:', error);
    });
}


chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "getSelectedText") {
        chrome.tabs.sendMessage(tab.id, { action: "triggerGetSelectedText" });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'explainText' && request.text) {
        console.log("OVER HERE");
        sendTextForExplanation(request.text)
            .then(explanation => sendResponse({ explanation }))
            .catch(error => sendResponse({ error: error.message }));

        return true;  // to indicate you wish to send a response asynchronously
    }
});
