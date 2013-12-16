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
	count = (!isEmpty(result)) ? result.ShitBlockCount : { current : 0, total : 0 };
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
		chrome.browserAction.setBadgeText({text: request.data.toString() });
		count.total += request.data;
		chrome.storage.sync.set({'ShitBlockCount': count });
		console.log(count.total);
	}
	/*else if (request.type == "deleteBadge")
		chrome.browserAction.setBadgeText({text: request.data.toString() });*/
	return true;
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

*/