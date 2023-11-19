// Replace with your actual OpenAI API key

const OPENAI_API_KEY = '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';

// Function to call the OpenAI API
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

// Add click event for context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "getSelectedText") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: window.extension.getSelectedText,
      }).then(() => console.log("injected a function"));
    }
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'explainText' && request.text) {
    callOpenAI(request.text)
      .then(explanation => sendResponse({ explanation }))
      .catch(error => sendResponse({ error: error.message }));

    // Return true to indicate that you wish to send a response asynchronously
    return true;
  }
});