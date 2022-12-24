const onSubmit = event => {
    event.preventDefault();
    console.log("HOLA COMO ESTAS")
    const text = document.getElementById("links").value.split("\n");
    let blocked = []
    text.map(t => {
        if(t.length>0&&!blocked.includes(t)) blocked.push(t)
    })
    console.log(blocked)
    chrome.storage.local.set({ blocked: blocked }).then(() => chrome.storage.local.get('blocked').then(function({blocked}) {
        console.log(blocked)
    }))
    // chrome.tabs.getCurrent(function(tab) {
    //     chrome.tabs.remove(tab.id, function() {console.log("tab removed")})
    // })
}

// const updatePassword = async () => {
//     const prevPass = document.getElementById("prevpass").value
//     const newPass = document.getElementById("newpass").value
//     const rePass = document.getElementById("repass").value

//     const res = await chrome.storage.local.get("password")
//     const oldPass = res.val

//     if(prevPass!=oldPass) {
//         alert("password could not be set because the password you provided is not the same as your previous")
//         return false
//     }
//     if(newPass!=rePass) {
//         alert("password could not be set because the new password and retyped password do not match")
//         return false
//     }

//     chrome.local.storage.set({password: newPass}).then(() => alert("New password set successfully"))
//     return true
// }

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

const checkRedirect = () => {
    chrome.storage.local.get("isSet").then(({ isSet }) => {
        console.log(isSet)
        if(!isSet) chrome.tabs.update({ url: './Options/init.html' })
    })
}

document.addEventListener("DOMContentLoaded", function() {
    checkRedirect()
    console.log("DOM Content loaded")
    setLinks()
    document.getElementById("form").addEventListener("submit", onSubmit)
})
