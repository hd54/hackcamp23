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

const extension = {
    getSelectedText: getSelectedText
}

window.extension = extension;
