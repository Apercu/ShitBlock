chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {

	switch(message.type) {
		case "toggle_shit":
            $("div").toggleClass("shit_hide");
		break;
	}
});