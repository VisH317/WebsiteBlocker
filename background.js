// runs in the background to check the URL matches that of a blocked site

// TODO to add: password functionality
// break functionality
// train and implement the ai model (dataset found already)
// stats displays
// notifications to a manager email (parent controls and unblock requests through notifications)
// add styles and css, convert to flexbox

// initialization stuff
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({blocked: []}).then(() => console.log("blocklist initialized"))
    chrome.storage.local.set({password: ''}).then(() => {})
    chrome.storage.local.set({enabled: true}).then(() => {})
    chrome.storage.local.set({isSet: false})
    
    // set break functionalities
    chrome.storage.local.set({breakStartTime: false})
    chrome.storage.local.set({breakLength: 0})


    // open init html
    chrome.tabs.create({ url: "./Options/init.html" })
})

const checkBlocked = () => {
    chrome.storage.local.get('breakStartTime').then(({ breakStartTime }) => {
        if(!breakStartTime) return true
        chrome.storage.local.get('breakLength').then(({ breakLength }) => {
            const currentDate = new Date()
            const diff = (currentDate - breakStartTime)/60000
            if(diff>=breakLength) return false
            return true
        })
    })
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    blocked = checkBlocked()
    if(tab.url && blocked) {
        chrome.storage.local.get('blocked').then(function({ blocked }) {
            domain = tab.url.split("/")[2].split(".").slice(1,3).join(".");
            console.log(domain)
            if(blocked.includes(domain)) {
                chrome.tabs.update(tab.id, {
                    url: "./blocked.html"
                })
            }
        })
    }
})