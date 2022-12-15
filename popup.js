document.getElementById("button").addEventListener('click', () => {
    chrome.tabs.create({url: "./blocked.html"})
})

// add stats display maybe in separate function