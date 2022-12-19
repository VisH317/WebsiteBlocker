const onSubmit = event => {
    event.preventDefault();
    console.log("HOLA COMO ESTAS")
    chrome.storage.local.get('blocked').then(function({ blocked }) {
        const text = document.getElementById("links").value.split("\n");
        text.map(t => blocked.push("www."+t))
        chrome.storage.local.set({ blocked: blocked }).then(() => chrome.storage.local.get('blocked').then(function({blocked}) {
            console.log(blocked)
        }))
    })

    if(document.getElementById("newpass").value!="") setPassword() 

    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() {console.log("tab removed")})
    })
}

const setPassword = async () => {
    const prevPass = document.getElementById("prevpass").value
    const newPass = document.getElementById("newpass").value
    const rePass = document.getElementById("repass").value

    const oldPass = await chrome.storage.local.get("password")

    if(prevPass!=oldPass) alert("password could not be set because the password you provided is not the same as your previous")
    if(newPass!=rePass) alert("password could not be set because the new password and retyped password do not match")

    chrome.local.storage.set({password: newPass}).then(() => alert("New password set successfully"))
}

// console.log("options.js running")

// const form = document.getElementById("form");
// console.log(form)
// form.addEventListener("submit", () => console.log("test"));
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM Content loaded")
    document.getElementById("form").addEventListener("submit", onSubmit)
})

// todo: debug the code: fix options code, background service worker, popup
// get the blocked page to show, console logs to work
// features to add: blocked page show currently blocked domains
// search for domain to block and check proper blocking after 