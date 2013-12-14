var enabled = false;

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
	        chrome.browserAction.setBadgeText({text: "o"});
	        chrome.browserAction.setBadgeBackgroundColor({color: "#009900"});
	    });
	    enabled = true;
	}
	else
	{
		chrome.tabs.getSelected(null, function(tab){
	        chrome.tabs.sendMessage(tab.id, {type: "toggle_shit"});
	        chrome.browserAction.setBadgeText({text: "x"});
	        chrome.browserAction.setBadgeBackgroundColor({color: "#CC0000"});
	    });
		enabled = false;
	}
}

if (enabled == true)
	document.getElementById("switch").checked = true;
else
	document.getElementById("switch").checked = false;