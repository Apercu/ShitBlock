var config;

chrome.storage.sync.get('ShitBlockConfig', function(result){
	if (!isEmpty(result))
		config = result.ShitBlockConfig;
	else
		config = { blocked : {}, enabled : true };
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	config = changes["ShitBlockConfig"].newValue;
	updateBlock();
});

function nodeInsertedCallback(event) {
	if (event.relatedNode.nodeName == "FORM"){
		updateBlock();
	}
};

function updateBlock(){

	$('li.item').each(function () {
		var href = $(this).find('a').attr('href');
		if (href) {
			var reg = href.match(/user\/([a-z]+-*[a-z]*)\//);
			if (reg && reg[1] && config.blocked.hasOwnProperty(reg[1]) == true) {
				if (config.enabled == false)
					$(this).show();
				else
					$(this).hide();
			}
			else if (reg && reg[1] && config.blocked.hasOwnProperty(reg[1]) == false)
				$(this).show();
		}
	});

	$('span.info').each(function () {
		var reg = $(this).html().match(/— ([a-z]+-*[a-z]*)/);
		if (reg && reg[1] && config.blocked.hasOwnProperty(reg[1]) == true)
		{
			if (config.enabled == false)
				$(this).parentsUntil(".item").show();
			else
				$(this).parentsUntil(".item").hide();
		}
		else if (reg && reg[1] && config.blocked.hasOwnProperty(reg[1]) == false)
			$(this).parentsUntil(".item").show();
	});
}

document.addEventListener('DOMNodeInserted', nodeInsertedCallback);


function isEmpty(obj) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
			return false;
	}
	return true;
}