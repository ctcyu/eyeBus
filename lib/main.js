var data = require("self").data;
var prefSet = require("simple-prefs");
const msInHr = 3600000;
var hr = 0;
var min = 0;
var meri = "a";

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

var ss = require("simple-storage");
if(!ss.storage.busStop){
	ss.storage.busStop = 61337;
}
if(!ss.storage.busRoute){
	ss.storage.busRoute = 3;	
}

display_times.port.emit("loadStop", ss.storage.busStop);
display_times.port.emit("loadRoute", ss.storage.busRoute);

display_times.port.on("changeStop", function handleChangeStop(busStop){
	ss.storage.busStop = busStop;
});

display_times.port.on("changeRoute", function handleChangeStop(busRoute){
	ss.storage.busRoute = busRoute;
});

display_times.on("show", function(){
	searchNextTimes();
});

//searchNextTimes();

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
			var pageHTML = response.text;
			var tableIndex = pageHTML.indexOf('<strong>Next Bus Times By Route</strong>');
			var tableHTML = pageHTML.substr(tableIndex);
			var busIndex = tableHTML.indexOf(busRoute);
			var busHTML = tableHTML.substr(busIndex + busRoute.length + 3);
			var trIndex = busHTML.indexOf('</tr>');
			busHTML = busHTML.substr(0, trIndex);
			//finally we have the portion that we want
			var busNoTags = stripHTML(busHTML);
			var busTimes = busNoTags.substr(busRoute.length);
			//strip spaces
			busTimes = busTimes.replace(/\s/g, "");
			console.log("tableHTML " + tableHTML);
			console.log("busHTML " + busHTML);
			console.log("busNoTags " + busNoTags);
			console.log(busTimes);
		}
	});
	latestRequest.get();
	console.log("busStop " + busStop + "busRoute " + busRoute);
	console.log(fullURL);
}

//from http://www.ozoneasylum.com/5782
//strips all HTML tags
function stripHTML(oldString) {
   var newString = "";
   var inTag = false;
   for(var i = 0; i < oldString.length; i++) {
   
        if(oldString.charAt(i) == '<') inTag = true;
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

//edited from http://www.tizag.com/javascriptT/javascriptdate.php
//gets the current user's system time, then sets them into the global vars
//hr (hour * 100), min (minutes) and meri (a for am, p for pm)
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

