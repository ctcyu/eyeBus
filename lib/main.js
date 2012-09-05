var data = require("self").data;
var prefSet = require("simple-prefs");

var display_times = require("panel").Panel({
	width: 212,
	height: 200,
	contentURL: data.url("display-times.html"),
	contentScriptFile: data.url("get-times.js")
});

require("widget").Widget({
	label: "eyeBus",
	id: "eyeBus",
	contentURL: "http://www.mozilla.org/favicon.ico",
	panel: display_times
});

display_times.port.emit("loadStop", prefSet.prefs["busStop"]);
display_times.port.emit("loadRoute", prefSet.prefs["busRoute"]);

display_times.port.on("changeStop", function(busStop){
	console.log(busStop);
	require("preferences-service").set("busStop", busStop);
});
