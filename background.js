const OPENAI_API_KEY = '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';

function callOpenAI(text) {
  return fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      prompt: text,
      max_tokens: 150
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].text.trim();
    } else {
      throw new Error('Invalid response from OpenAI API');
    }
  })
  .catch(error => {
    console.error('Error calling OpenAI API:', error);
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
