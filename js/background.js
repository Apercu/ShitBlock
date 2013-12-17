var config;
var count;

/*
** Load of the config, init badge
*/
chrome.storage.sync.get('ShitBlockConfig', function(result){
	config = (!isEmpty(result)) ? result.ShitBlockConfig : { blocked : {}, enabled : true };
	chrome.browserAction.setBadgeText({text: "" });
	chrome.browserAction.setBadgeBackgroundColor({color: "#009900"});
});
chrome.storage.sync.get('ShitBlockCount', function(result){
	count = (!isEmpty(result)) ? result.ShitBlockCount : { total : 0 };
});

/*
** Listener on change config
*/
chrome.storage.onChanged.addListener(function(changes, namespace) {
	if (changes["ShitBlockConfig"])
	{
		config = changes["ShitBlockConfig"].newValue;
		if (config.enabled == false)
			chrome.browserAction.setBadgeText({text: "" });
	}
});

/*
** Listener for update count and delete count when not on post
*/
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	chrome.browserAction.setBadgeText({text: "0" });
	if (request.type == "incrementCount" && config.enabled == true)
	{
		count.total += request.data;
		chrome.storage.sync.set({'ShitBlockCount': count });
		chrome.tabs.getSelected(null, function(tab){
			chrome.browserAction.setBadgeText({text: request.data.toString(), tabId:tab.id });
		});
	}
	return true;
});

/*
** Listener for tab change
*/
chrome.tabs.onActiveChanged.addListener(function (tab_id) {
	chrome.tabs.sendMessage(tab_id, {callCountCurrent: "yes"}, function(response) {
		chrome.browserAction.setBadgeText({text: response.countOnTab.toString(), tabId:tab_id });
	});
});

/*
** Test object empty
*/
function isEmpty(obj) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
			return false;
	}
	return true;
}


/*
Using different tabs,
But not working : phoque

chrome.tabs.getSelected(null, function(tab){
	chrome.browserAction.setBadgeText({text: "", tabId:tab.id });
});

if (text === '') {
				setIcon(false, tab_id);
			} else {
				setIcon(!conf.paused_blocking && !whitelisted(tab.url), tab_id);
			}

*/