var enabled = chrome.storage.sync;

console.log(enabled);

if (enabled == false)
{
	chrome.browserAction.setBadgeText({text: "0"});
	chrome.browserAction.setBadgeBackgroundColor({color: "#009900"});
	localStorageService.set("ShitBlockConfig").enabled = true;
}
else
{
	chrome.browserAction.setBadgeText({text: "0"});
	chrome.browserAction.setBadgeBackgroundColor({color: "#CC0000"});
	localStorageService.set("ShitBlockConfig").enabled = false;
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "toggle_shit":
            shitToggle();
        break;
    }
    return true;
});

var shitToggle = function() {
	if (enabled == false)
	{
		chrome.tabs.getSelected(null, function(tab){
	        chrome.tabs.sendMessage(tab.id, {type: "toggle_shit"});
	        chrome.browserAction.setBadgeText({text: "0"});
	        chrome.browserAction.setBadgeBackgroundColor({color: "#009900"});
	    });
	    localStorageService.set("ShitBlockConfig").enabled = true;
	}
	else
	{
		chrome.tabs.getSelected(null, function(tab){
	        chrome.tabs.sendMessage(tab.id, {type: "toggle_shit"});
	        chrome.browserAction.setBadgeText({text: "0"});
	        chrome.browserAction.setBadgeBackgroundColor({color: "#CC0000"});
	    });
		localStorageService.set("ShitBlockConfig").enabled = false;
	}
}