var data = require("self").data;
var ss = require("simple-storage");
var sp = require("simple-prefs");

const MS_IN_MIN = 60000; 
var hr = 0;
var min = 0;
var meri = "a";
//set up gui elements
var display_times = require("panel").Panel({
	width: 260,
	height: 140,
	contentURL: data.url("display-times.html"),
	contentScriptFile: [data.url("jquery-1.8.1.min.js"),
											data.url("panel-script.js")]
});

var widget = require("widget").Widget({
	label: "eyeBus",
	id: "eyeBus",
	width: 140,
	contentURL: data.url("widget-items.html"),
	contentScriptFile: [data.url("jquery-1.8.1.min.js"),
											data.url("widget-script.js")],
	panel: display_times,
});

if(!ss.storage.busStop){
	ss.storage.busStop = 61337;
}
if(!ss.storage.busRoute){
	ss.storage.busRoute = 10;
}

//set up event listeners and emitters
display_times.port.emit("loadStop", ss.storage.busStop);
display_times.port.emit("loadRoute", ss.storage.busRoute);

display_times.port.on("changeStop", function handleChangeStop(busStop){
	ss.storage.busStop = busStop;
});

display_times.port.on("changeRoute", function handleChangeStop(busRoute){
	ss.storage.busRoute = busRoute;
});

display_times.port.on("loadClicked", function () {searchNextTimes()});

//the "main" method, search times once and then search again every interval as defined in user prefs
searchNextTimes();
var timer = require("timers");
timer.setInterval(searchNextTimes, sp.prefs.refreshInterval * MS_IN_MIN);

/**
 * Search for the next bus times using Translink's NextBus feature, emit a searchDone event when done
 */
function searchNextTimes(){
	var busStop = ss.storage.busStop;
	var busRoute = ss.storage.busRoute;
	
	while(busRoute.length < 3){
		busRoute = "0" + busRoute;
	}

	getClock();

	var fullURL = "http://tripplanning.translink.ca/hiwire?.a=iNextBusFind&ShowTimes=1&PublicNum=" + busStop + "&FromHourDropDown=" + hr + "&FromMinuteDropDown=" + min + "&FromMeridiemDropDown=" + meri + "&SB=Find+my+next+bus&.a=iTripPlanning";
	var httpRequest = require("request").Request;
	var latestRequest = httpRequest({
		url: fullURL,
		onComplete: function (response){
			var timesArr =parseTimes(response.text, busRoute); 
			display_times.port.emit("searchDone", [busStop, busRoute, timesArr]);
			widget.port.emit("searchDone", [busStop, busRoute, timesArr[0]]);
		}
	});
	latestRequest.get();	
}

/**
 * Parses the desired next bus times out of a page of HTML
 * @param pageHTML the HTML returned from the HTTP request
 * @param busRoute the bus route number
 * @return an array of bus times
 */
function parseTimes(pageHTML, busRoute) {
	var tableIndex = pageHTML.indexOf('<strong>Next Bus Times By Route</strong>');
	var tableHTML = pageHTML.substr(tableIndex);
	var busIndex = tableHTML.indexOf(busRoute);
	var busHTML = tableHTML.substr(busIndex + busRoute.length + 3);
	var ptripIndex = busHTML.indexOf("ptrip");
	busHTML = busHTML.substr(ptripIndex);
	var tbIndex = busHTML.indexOf("<table>");
	var busHTML = busHTML.substr(tbIndex+7);
	var trIndex = busHTML.indexOf('</tr>');
	busHTML = busHTML.substr(0, trIndex);
	var busTimes = stripHTML(busHTML);
	//strip spaces
	busTimes = busTimes.replace(/\s/g, "");
	//split into array delimited by m because both am and pm have a m
	var timesArr = busTimes.split("m");
	return timesArr;
}

/**
 * from http://www.ozoneasylum.com/5782
/* strips all HTML tags
 * @param oldString text to remove HTML tags from
 * @return HTML-tag free text
 */
function stripHTML(oldString) {
   var newString = "";
   var inTag = false;
   for(var i = 0; i < oldString.length; i++) {
   
        if(oldString.charAt(i) == '<') inTag = true
        if(oldString.charAt(i) == '>') {
              if(oldString.charAt(i+1)=="<")
              {
              		//dont do anything
	}
	else
	{
		inTag = false;
		i++;
	}
        }
        if(!inTag) newString += oldString.charAt(i);
   }
   return newString;
}

/**
 * gets the current user's system time, then sets them into the global vars
/* hr (hour * 100), min (minutes) and meri (a for am, p for pm)
 * @returns user's system time
 */
function getClock(){
	var currentTime = new Date()
	var hours = currentTime.getHours()
	var minutes = currentTime.getMinutes()
	if (minutes < 10){
	minutes = "0" + minutes
	}
	
	if(hours > 11){
		meri = "p";
		hr = hours - 12;
		hr = hr * 100;
	}
	else {
		meri = "a";
		hr = hours * 100;
	}
	min = minutes;
}

