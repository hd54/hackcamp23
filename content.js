function getSelectedText() {
    // Get the selected text in the current window
    const text = window.getSelection().toString();

    // Send the selected text to the background script
    if (text) {
        chrome.runtime.sendMessage({ action: 'explainText', text: text });
    }
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