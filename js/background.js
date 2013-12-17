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
		chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
			chrome.browserAction.setBadgeText({text: request.data.toString(), tabId:tab[0].id });
		});
	}
	return true;
});

/*
** Listeners for tab change, new and update
*/
chrome.tabs.onActiveChanged.addListener(function (tab_id) {
	activateBadgeAndCount(tab_id);
});

chrome.tabs.onUpdated.addListener(function (tab_id) {
	activateBadgeAndCount(tab_id);
});

chrome.tabs.onCreated.addListener(function (tab_id, changeInfo, tab) {         
	activateBadgeAndCount(tab_id);
});

function activateBadgeAndCount (tab_id){
	chrome.tabs.sendMessage(tab_id, {callCountCurrent: "yes"}, function(response) {
		if (response)
		{
			chrome.tabs.query({active: true, currentWindow: true}, function(tab) {
				if (tab[0].url.indexOf("intra.42.fr") != -1)
				{
					chrome.browserAction.setBadgeText({text: response.countOnTab.toString(), tabId:tab[0].id });
					chrome.browserAction.enable(tab_id);
				}
				else
				{
					chrome.browserAction.disable(tab_id);
					chrome.browserAction.setBadgeText({text: "", tabId:tab_id });
				}
			});
		}
		else
		{
			chrome.browserAction.disable(tab_id);
			chrome.browserAction.setBadgeText({text: "", tabId:tab_id });
		}
	});
}


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

if (text === '') {
	setIcon(false, tab_id);
} else {
	setIcon(!conf.paused_blocking && !whitelisted(tab.url), tab_id);
}

*/