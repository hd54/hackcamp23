chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "showLoading") {
        document.getElementById('loader').classList.remove('hidden');
        document.getElementById('apiResponse').classList.add('hidden');
    } else if (request.action === "showResponse") {
        document.getElementById('loader').classList.add('hidden');
        document.getElementById('apiResponse').classList.remove('hidden');
        document.getElementById('apiResponse').textContent = request.response;
    }
});

// Add event listener for the form submission
document.getElementById('apiKeyForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const apiKey = document.getElementById('apiKeyInput').value;
    // Save the API key using Chrome's storage API
    chrome.storage.local.set({ 'cohereApiKey': apiKey }, function() {
        document.getElementById("apiKeyInput").value = "";
    });
});
