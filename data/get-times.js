var stopInput = document.getElementById("stop-input");
var routeInput = document.getElementById("route-input");

self.port.on("loadStop", function(busStop){
	stopInput.value = busStop;
});

self.port.on("loadRoute", function(busRoute){
	routeInput.value = busRoute;
});

stopInput.addEventListener('keyup', function onkeyup(event){
	if(event.keyCode == 13) {
		self.port.emit("changeStop", stopInput.value);
	}
}, false);

routeInput.addEventListener('keyup', function onkeyup(event){
	if(event.keyCode == 13) {
		self.port.emit("changeRoute", routeInput.value);
	}
}, false);

