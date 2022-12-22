const onSubmit = event => {
    event.preventDefault();
    console.log("HOLA COMO ESTAS")
    const text = document.getElementById("links").value.split("\n");
    let blocked = []
    text.map(t => {
        if(t.length==0||!blocked.includes("www."+t)||!blocked.includes(t)) blocked.push(t.slice(0,3)=="www." ? t : "www."+t)
    })
    console.log(blocked)
    chrome.storage.local.set({ blocked: blocked }).then(() => chrome.storage.local.get('blocked').then(function({blocked}) {
        console.log(blocked)
    }))

    if(document.getElementById("newpass").value!="") setPassword() 

    // chrome.tabs.getCurrent(function(tab) {
    //     chrome.tabs.remove(tab.id, function() {console.log("tab removed")})
    // })
}

const setPassword = async () => {
    const prevPass = document.getElementById("prevpass").value
    const newPass = document.getElementById("newpass").value
    const rePass = document.getElementById("repass").value

    const res = await chrome.storage.local.get("password")
    const oldPass = res.val

    if(prevPass!=oldPass) alert("password could not be set because the password you provided is not the same as your previous")
    if(newPass!=rePass) alert("password could not be set because the new password and retyped password do not match")

    chrome.local.storage.set({password: newPass}).then(() => alert("New password set successfully"))
}

const setLinks = () => {
    chrome.storage.local.get('blocked').then(({ blocked }) => {
        str = ""
        console.log("in then function")
        blocked.map(elem => {str+=elem+'\n'})
        console.log(str.length)
        form_element = document.getElementById("form").elements["links"]
        form_element.value = str;
    })
}

// console.log("options.js running")

// const form = document.getElementById("form");
// console.log(form)
// form.addEventListener("submit", () => console.log("test"));
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM Content loaded")
    setLinks()
    document.getElementById("form").addEventListener("submit", onSubmit)
})

// todo: debug the code: fix options code, background service worker, popup
// get the blocked page to show, console logs to work
// features to add: blocked page show currently blocked domains
// search for domain to block and check proper blocking after 