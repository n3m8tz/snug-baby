
var scripts = [
	/***	Loading libraries	***/
	"https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js",
	"https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js",
	"js/libraries/snugbaby-daytime.js",
	"js/libraries/jquery.simplecolorpicker.js",
	"js/libraries/bootstrap.js",
	"js/libraries/TableClass.js",
	"https://apis.google.com/js/api.js",		// Load the Realtime libraries.
	"js/libraries/realtime-client-utils.js",	// Load the utility library. 
	//"js/libraries/materialize.min.js",			// Load library for Material Design

	/***	Custom files	***/
	"js/gapi.realtime.js", 						//Load Snug Baby Google Drive Realtime QuickStart
	"js/globvars.js",							//Global Variables
	"js/main.js"								//Main Apps Logic
];

function loadScripts(urls)
{
	var counter = 0;

	var loadScript = function(url){
		if(counter < urls.length){
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			var callback = function(){
				if(typeof url !== "undefined")
					loadScript(urls[++counter]);
			};
			script.onreadystatechange = callback;
			script.onload = callback;
			head.appendChild(script);
		}
	};

	loadScript(urls[0]);
}

document.addEventListener('DOMContentLoaded', function(){
	loadScripts(scripts);
});

