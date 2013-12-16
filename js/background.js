var config;

chrome.storage.sync.get('ShitBlockConfig', function(result){
	if (!isEmpty(result))
		config = result.ShitBlockConfig;
	else
		config = { blocked : {}, enabled : true };

	if (config.enabled == false)
	{
		chrome.browserAction.setBadgeText({text: "0"});
		chrome.browserAction.setBadgeBackgroundColor({color: "#CC0000"});
	}
	else
	{
		chrome.browserAction.setBadgeText({text: "0"});
		chrome.browserAction.setBadgeBackgroundColor({color: "#009900"});
	}
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	config = changes["ShitBlockConfig"].newValue;
	if (config.enabled == false)
	{
		chrome.browserAction.setBadgeText({text: "0"});
		chrome.browserAction.setBadgeBackgroundColor({color: "#CC0000"});
	}
	else
	{
		chrome.browserAction.setBadgeText({text: "0"});
		chrome.browserAction.setBadgeBackgroundColor({color: "#009900"});
	}
});

function isEmpty(obj) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
			return false;
	}
	return true;
}