
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

    setPassword()

    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() {console.log("tab removed")})
    })
}

const setPassword = () => {
    newPassword = document.getElementById("password").value
    chrome.local.storage.set({password: newPassword}).then(() => alert("Password has been set"))
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("form").addEventListener("submit", onSubmit)
})