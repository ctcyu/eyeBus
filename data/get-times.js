var stopInput = document.getElementById("stop-input");
var routeInput = document.getElementById("route-input");
var loadButton = document.getElementById("load-button");

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

loadButton.addEventListener('click', function onclick(event){
	console.log("button clicked");
	self.port.emit("loadClicked");
}, false);

self.port.on("searchDone", function (timesArr){
	var timesTable = document.getElementById("times-table");
	//delete the "loading" row
	var lrow = document.getElementById("loading");
	timesTable.deleteRow(lrow.rowIndex);
	for(i = 0; i < timesArr.length; i++){
		console.log(timesArr[i]);
		var row = timesTable.insertRow(i);
		var cell = row.insertCell(0);
		cell.innerHTML = timesArr[i];
	}
});
