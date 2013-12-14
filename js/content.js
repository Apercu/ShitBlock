chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {

	if (message.type == "toggle_shit")
	{
		var shitUsers = [
			"grebett"
		];

		$('li.item').each(function () {
			var href = $(this).find('a').attr('href');
			if (href) {
				var reg = href.match(/user\/([a-z]*)\//);
				if (reg && reg[1] && shitUsers.indexOf(reg[1]) != -1) {
					$(this).toggle();	
				}
			}
		});

		$('span.info').each(function () {
			var reg = $(this).html().match(/— ([a-z]*)/);
			if (reg && reg[1] && shitUsers.indexOf(reg[1]) != -1)
				$(this).parentsUntil(".item").toggle();
		});
	}
});