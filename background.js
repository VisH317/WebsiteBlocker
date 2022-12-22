// runs in the background to check the URL matches that of a blocked site

// TODO to add: test password and blocker disable functionality (temporary only)
// add styles and css
// do the ai detection

// initialization stuff
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({blocked: []}).then(() => console.log("blocklist initialized"))
    chrome.storage.local.set({password: ''}).then(() => {})
    chrome.storage.local.set({enabled: true}).then(() => {})
    chrome.storage.local.set({isSet: false})

    // open init html
    chrome.tabs.create({ url: "./Options/init.html" })
})

// function containsObject(list, obj) {
//     var i;
//     for(i=0; i < list.length; i++) {
//         if(list[i]==obj) return true;
//     }
//     return false;
// }

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(tab.url) {
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