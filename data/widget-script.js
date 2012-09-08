self.port.on("searchDone", function (message) {
	var nextDiv = document.getElementById("next-time");
	var msg = nextDiv.innerHTML = message[0] + ":" + message[1] + "@" + message[2] + "m";
	console.log(msg);
	console.log(message[2]);
	if(message[2] != "") 
		nextDiv.innerHTML = msg;
	else
		nextDiv.innerHTML = "Error loading";
});
