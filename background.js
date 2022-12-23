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
    chrome.storage.local.set({onBreak: false})
    chrome.storage.local.set({breakStartTime: null})
    chrome.storage.local.set({breakLength: 0})


    // open init html
    chrome.tabs.create({ url: "./Options/init.html" })
})

const checkBlocked = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('onBreak').then(({ onBreak }) => {
            console.log(onBreak)
            if(!onBreak) {
                resolve(true)
            }
            chrome.storage.local.get('breakStartTime').then(({ breakStartTime }) => {
                chrome.storage.local.get('breakLength').then(({ breakLength }) => {
                    const currentDate = new Date()
                    const diff = (currentDate - breakStartTime)/60000
                    if(diff>=breakLength) {
                        chrome.storage.local.set({onBreak: false})
                        resolve(true)
                    }
                    resolve(false)
                })
            })
        })
    })
    
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    checkBlocked().then(isBlocked => {
        if(tab.url && isBlocked) {
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
})