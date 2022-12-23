document.getElementById("button").addEventListener('click', () => {
    chrome.tabs.create({url: "./Options/options.html"})
})

document.getElementById("disable").addEventListener('click', () => {
    document.getElementById("backdrop").style.display = "block"
    document.getElementById("breakModal").style.display = "block"
})

document.getElementById("changepword").addEventListener('click', () => {
    document.getElementById("backdrop").style.display = "block"
    chrome.storage.local.get('isSet').then(({ isSet }) => {
        if(isSet) {
            document.getElementById("passModal").style.display = "block"
        } else {
            document.getElementById("passNotSetModal").style.display = "block"
        }
    })
})

document.getElementById("backdrop").addEventListener('click', () => closeModals())

const closeModals = () => {
    document.getElementById("backdrop").style.display = "none"
    document.getElementById("breakModal").style.display = "none"
    document.getElementById("passModal").style.display = "none"
    document.getElementById("passNotSetModal").style.display = "none"
}

document.getElementById("breakForm").addEventListener('submit', event => {
    event.preventDefault()
    chrome.storage.local.get('password').then(({ password }) => {
        const pass = document.getElementById('password').value
        if(password!=pass) {
            alert("Passwords do not match: please try again")
            return
        }
        chrome.storage.local.set({onBreak: true})
        chrome.storage.local.set({breakStartTime: new Date()})
        chrome.storage.local.set({breakLength: document.getElementById('length').value})
        alert("Break time has been set, enjoy!")
        closeModals()
    })
})

document.getElementById("passChangeForm").addEventListener('change', event => {
    chrome.storage.local.get('password').then(({ password }) => {
        console.log("changed")
        const prevPass = document.getElementById("prevpass").value
        const newPass = document.getElementById("newpass").value
        const rePass = document.getElementById("repass").value 
        if(newPass!=rePass) {
            document.getElementById("noRePass1").style.display = "block"
            document.getElementById("noRePass2").style.display = "block"
            document.getElementById("newpass").style.borderColor = "#cc0000"
            document.getElementById("repass").style.borderColor = "#cc0000"
        } else {
            document.getElementById("noRePass1").style.display = "none"
            document.getElementById("noRePass2").style.display = "none"
            document.getElementById("newpass").style.borderColor = "#000"
            document.getElementById("repass").style.borderColor = "#000"
        }
    })
})

document.getElementById("passChangeForm").addEventListener('submit', event => {
    event.preventDefault()
    chrome.storage.local.get('password').then(({ password }) => {
        const prevPass = document.getElementById("prevpass").value
        const newPass = document.getElementById("newpass").value
        const rePass = document.getElementById("repass").value 
        if(password!=prevPass) {
            alert("Old password fields do not match, please try again")
            // change styles
            return
        }
        if(newPass!=rePass) {
            alert("New password and retype new password fields do not match, please try again")
            // change styles
            return
        }
        chrome.storage.local.set({ password: newPass }).then(() => {
            alert("Your new password has been set!")
            closeModals()
        })
    })
})

// add stats display maybe in separate function