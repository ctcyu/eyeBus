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

/**
 * When the Load button is clicked, grey out existing table and show the words Loading...
 * Then search the new stop and route numbers for the next bus at the current time
 */
loadButton.addEventListener('click', function onclick(event){
	self.port.emit("changeStop", stopInput.value);
	self.port.emit("changeRoute", routeInput.value);	
	self.port.emit("loadClicked");
	var lrow = document.getElementById("loading");
	if(lrow == null) {
		var lrow = timesTable.insertRow(1);
		//lrow.insertCell(0).innerHTML = "loading...";
		lrow.setAttribute("id", "loading");
		$("#loading").text("Loading...");
	}
	$(".time-item, .busnum-item").attr("style", "color:#C0C0C0");
}, false);

/**
 * Listens for searchDone event, and updates the panel with new bus times
 * @param message an array such that message[0]:stop number message[1]: bus route message[2]: an array of times
 */
self.port.on("searchDone", function (message){
	//delete all rows
	var numRows = timesTable.rows.length
	for(i = 1; i< numRows; i++){
		timesTable.deleteRow(-1);
	}
	//update times table
	timesArr = message[2];
		$("#times-table").find("tbody").append($("<tr>")
																		.append($("<td>")
																		.text(message[0] + ":" + message[1])
																		.attr("style", "font-style:italic")
																		.attr("class", "busnum-item")
																		)
															);

		for(i = 0; i < timesArr.length; i++){
			if(timesArr[i] != "") {
				$("#times-table").find("tbody").append($("<tr>")
																				.append($("<td>")
																				.text(timesArr[i] + "m")
																				.attr("class", "time-item")
																				)
																	);
			}
		}	
});
