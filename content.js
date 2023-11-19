
function getSelectedText() {
    const selectedText = window.getSelection().toString();
    console.log(selectedText);
    if (selectedText) {
        chrome.runtime.sendMessage({ action: 'explainText', text: selectedText });
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "triggerGetSelectedText") {
        getSelectedText();
    }
});


const extension = {
  getSelectedText: getSelectedText
}

window.extension = extension;