var config, blocked;

/*
** Get config
*/
chrome.storage.sync.get('ShitBlockConfig', function(result){
	config = (!isEmpty(result)) ? result.ShitBlockConfig : { blocked : [], enabled : true };

	blocked = (function (tab) {
		var out = [];
		for (var i = 0; i < tab.length; i++) {
			out.push(tab[i].login);
		}
		return (out);
	})(config.blocked);
});

/*
** Update config if change
*/
chrome.storage.onChanged.addListener(function(changes, namespace) {
	if (changes["ShitBlockConfig"])
	{
		config = changes["ShitBlockConfig"].newValue;
		updateBlock();
	}
});

/*
** Listener FOM insert
*/
document.addEventListener('DOMNodeInserted', nodeInsertedCallback);

/*
** Detect form insert into DOM = comments
*/
function nodeInsertedCallback(event) {
	if (event.relatedNode.nodeName == "FORM")
		updateBlock();
	else if (event.relatedNode.lastChild.className == "thread list")
		updateBlock();
};


/*
** Toggling display of comment and post on the page
*/
function updateBlock(){
	var	count;

	count = 0;
	$('li.item').each(function () {
		var href = $(this).find('a').attr('href');
		if (href) {
			var reg = href.match(/user\/([a-z]+-*[a-z]*)\//);
			if (reg && reg[1] && blocked.indexOf(reg[1]) != -1) {
				if (config.enabled == false)
					$(this).show();
				else
				{
					$(this).hide();
					count++;
				}
			}
			else if (reg && reg[1] && blocked.indexOf(reg[1]) != -1)
				$(this).show();
		}
	});

	$('span.info').each(function () {
		var reg = $(this).html().match(/— ([a-z]+-*[a-z]*)/);
		if (reg && reg[1] && blocked.indexOf(reg[1]) != -1)
		{
			if (config.enabled == false)
				$(this).parentsUntil(".item").show();
			else
			{
				$(this).parentsUntil(".item").hide();
				count++;
			}
		}
		else if (reg && reg[1] && blocked.indexOf(reg[1]) != -1)
			$(this).parentsUntil(".item").show();
	});

	chrome.extension.sendMessage({type: "incrementCount", data: count });
}

/*
** Listener request from background to get count on this page
*/
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	var	count;

	count = 0;
	$('li.item').each(function () {
		var href = $(this).find('a').attr('href');
		if (href) {
			var reg = href.match(/user\/([a-z]+-*[a-z]*)\//);
			if (reg && reg[1] && blocked.indexOf(reg[1]) != -1) {
				if (config.enabled == true)
					count++;
			}
		}
	});

	$('span.info').each(function () {
		var reg = $(this).html().match(/— ([a-z]+-*[a-z]*)/);
		if (reg && reg[1] && blocked.indexOf(reg[1]) != -1)
		{
			if (config.enabled == true)
				count++;
		}
	});
	sendResponse({countOnTab: count});
});

/*
** Check if object is empty
*/
function isEmpty(obj) {
	for(var prop in obj) {
		if(obj.hasOwnProperty(prop))
			return false;
	}
	return true;
}
