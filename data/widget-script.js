self.port.on("searchDone", function (message) {
	var nextDiv = document.getElementById("next-time");
	console.log(message[0] + message[1] + message[2]);
	nextDiv.innerHTML = message[0] + ": " + message[1] + " @" + message[2];
});
