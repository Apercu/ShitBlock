window.onload = function() {
	console.log("test");
	var checkbox = document.getElementById("switch");
	checkbox.onclick = function() {
		chrome.extension.sendMessage({
			type: "toggle_shit"
		});
	}
}