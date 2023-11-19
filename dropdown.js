// dropdown.js
chrome.storage.local.get(['apiResponse'], function(result) {
    if (result.apiResponse) {
        document.getElementById('apiResponse').textContent = result.apiResponse;
    }
});
