document.getElementById("button").addEventListener('click', () => {
    chrome.tabs.create({url: "./Options/options.html"})
})

document.getElementById("disable").addEventListener('click', () => {
    document.getElementById("backdrop").style.display = "block"
    document.getElementById("modal").style.display = "block"
})

document.getElementById("backdrop").addEventListener('click', () => {
    document.getElementById("backdrop").style.display = "none"
    document.getElementById("modal").style.display = "none"
})

// add stats display maybe in separate function