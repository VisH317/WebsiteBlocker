// use chrome.tabs.captureVisibleTab

// setup storage of desired blocked links (will be changed later with updates)


chrome.webRequest.onBeforeRequest.addListener(function(details) {

}, {urls: ["*://*.*/*"]})