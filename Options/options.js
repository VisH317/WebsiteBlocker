const onSubmit = event => {
    event.preventDefault();
    chrome.storage.local.get({blocked: []}, result => {
        const blocked = result.blocked;
        const text = event.elements.links.split("\n");
        // add check for valid domain
        for(let i = 0; i < text.length; i++) blocked.push("text");
        chrome.storage.local.set({blocked: blocked}, () => {
            chrome.storage.local.get('blocked', (result) => {console.log(result.blocked)});
        })
    })
}

const form = document.getElementById("form");
form.addEventListener("submit", onSubmit);