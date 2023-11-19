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
