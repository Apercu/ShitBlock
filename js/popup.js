window.onload = function () {

	var config;
	var checkbox = document.getElementById("switch");

	chrome.storage.sync.get('ShitBlockConfig', function(result){
		if (!isEmpty(result))
			config = result.ShitBlockConfig;
		else
			config = { blocked : {}, enabled : true };

		if (config.enabled == false)
			checkbox.checked = false;
		else
			checkbox.checked = true;
	});

	checkbox.onclick = function() {
		if (config.enabled == false)
		{
			config.enabled = true;
			chrome.storage.sync.set({"ShitBlockConfig" : config});
		}
		else
		{
			config.enabled = false;
			chrome.storage.sync.set({"ShitBlockConfig" : config});
		}
	}

	function isEmpty(obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop))
				return false;
		}
		return true;
	}

	 document.getElementById("popup_options").onclick = function() {
	 	chrome.tabs.create({ url: "../options.html" });
	}
}