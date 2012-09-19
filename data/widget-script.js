self.port.on("searchDone", function (message) {
	var nextDiv = document.getElementById("next-time");
	var msg = message[0] + ":" + message[1] + "@" + message[2] + "m";
	if(message[2] != "") {
		$("#next-time").text(msg);
		console.log(msg);
	}
	else
		$("#next-time").text("Error loading");
});
