var config;

chrome.storage.sync.get('ShitBlockConfig', function(result){
	if (!isEmpty(result))
		config = result.ShitBlockConfig;
	else
		config = { blocked : {}, enabled : true };
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	config = changes["ShitBlockConfig"].newValue;
	if (config.enabled == false)
	{
		$('li.item').each(function () {
			var href = $(this).find('a').attr('href');
			if (href) {
				var reg = href.match(/user\/([a-z]+-*[a-z]*)\//);
				console.log(reg[1]);
				if (reg && reg[1] && config.blocked.hasOwnProperty(reg[1]) == true) {
					$(this).show();	
				}
			}
		});

		$('span.info').each(function () {
			var reg = $(this).html().match(/— ([a-z]+-*[a-z]*)/);
			if (reg && reg[1] && config.blocked.hasOwnProperty(reg[1]) == true)
				$(this).parentsUntil(".item").hide();
		});
	}
	else
	{
		$('li.item').each(function () {
			var href = $(this).find('a').attr('href');
			if (href) {
				var reg = href.match(/user\/([a-z]+-*[a-z]*)\//);
				if (reg && reg[1] && config.blocked.hasOwnProperty(reg[1]) == true) {
					$(this).hide();	
				}
			}
		});

		$('span.info').each(function () {
			var reg = $(this).html().match(/— ([a-z]+-*[a-z]*)/);
			if (reg && reg[1] && config.blocked.hasOwnProperty(reg[1]) == true)
				$(this).parentsUntil(".item").hide();
		});
	}
});

function isEmpty(obj) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
			return false;
	}
	return true;
}