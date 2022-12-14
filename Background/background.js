// runs in the background to check the URL matches that of a blocked site

// initialization stuff
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({blocked: []}).then(() => console.log("blocklist initialized"));
})

//check every request URL to determine if it needs to be blocked

function containsObject(obj, list) {
    var i;
    for(i=0; i < list.length; i++) {
        if(list[i]==obj) return true;
    }
    return false;
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.url) {
        blocked = chrome.storage.local.get('blocked');
        domain = changeInfo.url.split("/")[1];
        if(containsObject(blocked, domain)) {
            chrome.scripting.executeScript({
                target: { tabId },
                files: ['../Content/cscript.js']
            })
        }
    }
})