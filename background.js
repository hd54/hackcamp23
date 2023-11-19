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

function getSelectedText() {
    // Get the selected text in the current window
    let selectedText = window.getSelection().toString();
    if (selectedText.length > 0) {
      sendTextForExplanation(selectedText);
    }
    return selectedText;
}

function sendTextForExplanation(text) {
    chrome.runtime.sendMessage({ action: 'explainText', text: text }, function(response) {
        alert("abc");
      if (response.explanation) {
          return response.explanation;
      } else if (response.error) {
          console.error('Error:', response.error);
          return "";
      }
    });
}

// Add click event for context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "getSelectedText") {
        // Convert the function to a string and create a script to execute
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: getSelectedText,
        });
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