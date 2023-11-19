// Replace with your actual OpenAI API key
import {chrome} from "./browser";

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