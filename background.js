var callback = function (details) {
    if (details.method == "POST") {

        var url = details['url'];
        if (url.search('change_read_status' != -1)){
            console.log(" no SEEN ");
        }
        var detail = details['requestBody'];
        var newVar = detail['raw'][0]['bytes'];
        var s2 = new TextDecoder('ascii').decode(newVar);
        var s = decodeURIComponent(s2);
        var vars = [], hash;
        var hashes = s.slice(s.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }

        var user_id = vars['ft[thid]'] ;
        console.log(user_id);


        console.log("blocked");
        return {cancel: true};
    } else {
        console.log("let go")
    }

};

chrome.storage.sync.get("data" , function(items) {
    if (!chrome.runtime.lastError && items.data){
        activate()
    }
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
        if (storageChange.newValue){
            activate();
        }else {
            deactivate();
        }
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
        "from the extension");
    if (request.status == true){
        activate();
        sendResponse({farewell: "activated"});
    }else{
        deactivate();
        sendResponse({farewell: "deactivated"});
    }
});

function activate() {
    chrome.webRequest.onBeforeRequest.addListener(
        callback,
        {urls: ["*://*.facebook.com/*"]},
        ["blocking", "requestBody"]);
}

function deactivate() {
    console.log("deactivated back");
    chrome.webRequest.onBeforeRequest.removeListener(callback);
}



