const onSubmit = event => {
    event.preventDefault();
    chrome.storage.local.get({blocked: []}, result => {
        const blocked = result.blocked;
        const text = document.getElementById("links").value.split("\n");
        // add check for valid domain
        for(let i = 0; i < text.length; i++) blocked.push("text");
        chrome.storage.local.set({blocked: blocked}, () => {
            chrome.storage.local.get('blocked', (result) => {console.log(result.blocked)});
        })
    })

    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() {console.log("tab removed")})
    })
}

const form = document.getElementById("form");
form.addEventListener("submit", onSubmit);

// todo: debug the code: fix options code, background service worker, popup
// get the blocked page to show, console logs to work
// features to add: blocked page show currently blocked domains
// search for domain to block and check proper blocking after 