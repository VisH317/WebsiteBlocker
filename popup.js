document.getElementById("button").addEventListener('click', () => {
    chrome.tabs.create({url: "./blocked.htmlblocked.html"})
})

// add stats display maybe in separate function