/**
 * Listens for searchDone event, and updates the addon bar widget with next time
 * @param message an array such that message[0]:stop number message[1]: bus route message[2]: the next time
 */

self.port.on("searchDone", function (message) {
	var nextDiv = document.getElementById("next-time");
	var msg = message[0] + ":" + message[1] + "@" + message[2] + "m";
	if(message[2] != "") {
		$("#next-time").text(msg);
	}
	else
		$("#next-time").text("Error loading");
});
