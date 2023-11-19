import {chrome} from "./browser";

function getSelectedText() {
    chrome.scripting.executeScript({
      code: "window.getSelection().toString();"
    }, function(selection) {
      // Do something with the selected text
      return selection[0];
    });
  }
  
function sendTextForExplanation(text) {
    chrome.runtime.sendMessage({ action: 'explainText', text: text }, function(response) {
      if (response.explanation) {
        // Display the explanation
        alert(response.explanation); // You can replace this with a more sophisticated display logic
      } else if (response.error) {
        console.error('Error:', response.error);
      }
    });
}

document.addEventListener('mouseup', function() {
    const selectedText = getSelectedText();
    if (selectedText.length > 0) {
      sendTextForExplanation(selectedText);
    }
});