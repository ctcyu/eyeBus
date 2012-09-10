var stopInput = document.getElementById("stop-input");
var routeInput = document.getElementById("route-input");
var loadButton = document.getElementById("load-button");
var timesTable = document.getElementById("times-table");

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
	self.port.emit("changeStop", stopInput.value);
	self.port.emit("changeRoute", routeInput.value);	
	self.port.emit("loadClicked");
	var lrow = document.getElementById("loading");
	if(lrow == null) {
		var lrow = timesTable.insertRow(1);
		lrow.insertCell(0).innerHTML = "loading...";
		lrow.setAttribute("id", "loading");
	}
	for(i=2; i<timesTable.rows.length;i++){
		timesTable.rows.item(i).setAttribute("style", "color:#C0C0C0");
	}
}, false);

self.port.on("searchDone", function (message){
	//delete all rows
	var numRows = timesTable.rows.length
	for(i = 1; i< numRows; i++){
		timesTable.deleteRow(-1);
	}
	timesArr = message[2];
		var row;
		var cell;
		for(i = 0; i < timesArr.length; i++){
			if(timesArr[i] != "") {
				row = timesTable.insertRow(i+1);
				cell = row.insertCell(0);
				cell.innerHTML = timesArr[i] + "m";
			}
		}
		row = timesTable.insertRow(1);
		cell = row.insertCell(0);
		cell.innerHTML = message[0] + ":" + message[1];
		cell.setAttribute("style", "font-style:italic");
	
});
