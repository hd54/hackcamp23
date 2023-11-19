function getSelectedText() {
    // Get the selected text in the current window
    alert("a");
    const selectedText = window.getSelection().toString();
    if (selectedText.length > 0) {
      sendTextForExplanation(selectedText);
    }
    return selectedText;
}

function sendTextForExplanation(text) {
    chrome.runtime.sendMessage({ action: 'explainText', text: text }, function(response) {
      if (response.explanation) {
          return response.explanation;
      } else if (response.error) {
          console.error('Error:', response.error);
          return "";
      }
    });
}