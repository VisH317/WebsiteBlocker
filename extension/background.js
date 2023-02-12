// runs in the background to check the URL matches that of a blocked site

// stats displays
// notifications to a manager email (parent controls and unblock requests through notifications)
// add styles and css, convert to flexbox
// backend: queue and notification service  

// initialization stuff
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({blocked: []}).then(() => console.log("blocklist initialized"))
    chrome.storage.local.set({password: ''}).then(() => {})
    chrome.storage.local.set({enabled: true}).then(() => {})
    chrome.storage.local.set({isSet: false})
    
    // set break functionalities
    chrome.storage.local.set({onBreak: false})
    chrome.storage.local.set({breakStartTime: null})
    chrome.storage.local.set({breakLength: 0})


    // open init html
    chrome.tabs.create({ url: "./Options/init.html" })
})

breakLabels = ["Arts & Entertainment"]

const checkBlocked = tab => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('onBreak').then(({ onBreak }) => {
            chrome.storage.local.get('breakStartTime').then(({ breakStartTime }) => {
                chrome.storage.local.get('breakLength').then(({ breakLength }) => {
                    const currentDate = new Date()
                    const diff = (currentDate - breakStartTime)/60000
                    if(diff>=breakLength) {
                        chrome.storage.local.set({onBreak: false})
                        resolve(true)
                    }
                    resolve(false)
                })
            })
        })
    })
}

chrome.tabs.onUpdated.addListener(async function(tabId, changeInfo, tab) {
    const isBlocked = await checkBlocked(tab)
    if(tab.url && isBlocked) {
        const { blocked } = await chrome.storage.local.get('blocked')
        // call AI
        shouldBlock = false
        const isHTTP = tab.url.split(":")[0]=="http" || tab.url.split(":")[0]=="https"
        // if(isHTTP) {
        //     console.log(tab.url)
        //     console.log(tab.title)
        //     const request = {
        //         URL: tab.url,
        //         Title: tab.title
        //     }
        //     const res = await fetch("http://127.0.0.1:3000/video", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(request)
        //     })
        //     const label_text = await res.text()
        //     console.log(label_text)
        //     const { predicted_label } = JSON.parse(label_text)
        //     console.log("Got predicted labels!!")
        //     console.log(predicted_label)
        //     labels = []
        //     for(let i=0;i<predicted_label.length;i++) {
        //         if(labels!="NaN") labels.push(predicted_label[i])
        //     }
        //     for(let i=0;i<labels.length;i++) {
        //         if(breakLabels.includes(labels[i])) shouldBlock = true
        //     }
        // }
        domain = tab.url.split("/")[2].split(".").slice(1,3).join(".")
        if(/*isHTTP && */blocked.includes(domain)) {
            chrome.tabs.update(tab.id, {
                url: "./blocked.html"
            })
        }
    }
})  