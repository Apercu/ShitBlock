window.onload = function () {

	var config;

	chrome.storage.sync.get('ShitBlockConfig', function(result){
		if (!isEmpty(result))
			config = result.ShitBlockConfig;
		else
			config = { blocked : {}, enabled : true };

		if (config.enabled == true)
		{
			$('#enableShitBlock').bootstrapSwitch('setAnimated', false);
			$('#enableShitBlock').bootstrapSwitch('setState', true);
			setTimeout("$('#enableShitBlock').bootstrapSwitch('setAnimated', true)", 100);
		}
		$('#enableShitBlock').on('switch-change', function (e, data) {
			config.enabled = data.value;
			chrome.storage.sync.set({"ShitBlockConfig" : config});
		});
	});

	chrome.storage.onChanged.addListener(function(changes, namespace) {
		if (changes["ShitBlockConfig"].newValue.enabled != config.enabled)
			$('#enableShitBlock').bootstrapSwitch('toggleState');
	});

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