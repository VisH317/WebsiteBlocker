document.getElementById("button").addEventListener('click', () => {
    chrome.tabs.create({url: "./Options/options.html"})
})

// add stats display maybe in separate function