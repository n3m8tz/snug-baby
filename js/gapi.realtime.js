
	var initialAppStart = false;
	var realtimeLoader;
	var DEBUG_MODE = true;

	var realtimeOptions = {

		/**
		* Client ID from the console.
		*/
		clientId: '132706467209-v9q1nahcan7gdbsmv069opc87eh9td78.apps.googleusercontent.com',

		/**
		* The ID of the button to click to authorize. Must be a DOM element ID.
		*/
		authButtonElementId: 'authorizeButton',

		appId: '500599261050',

		/**
		* Function to be called when a Realtime model is first created.
		*/
		initializeModel: initializeModel,

		/**
		* Autocreate files right after auth automatically.
		*/
		autoCreate: false,

		/**
		* The name of newly created Drive files.
		*/
		defaultTitle: "Snug Baby GAPI file",

		/**
		* Function to be called every time a Realtime file is loaded.
		*/
		onFileLoaded: onFileLoaded,


		/**
		* The MIME type of newly created Drive Files. By default the application
		* specific MIME type will be used:
		*     application/vnd.google-apps.drive-sdk.
		*/
      	newFileMimeType: null, // Using default.

		/**
		* Function to be called to inityalize custom Collaborative Objects types.
		*/
		registerTypes: null, // No action.

		/**
		* Function to be called after authorization and before loading files.
		*/
		afterAuth: afterAuth // No action.
	}


	/**
	* Retrieve a list of File resources.
	*
	* @param {Function} callback Function to call when the request is complete.
	*/

	function retrieveAllFiles(callback) {
		var retrievePageOfFiles = function(request, result) {
			request.execute(function(resp) {
		  		result = result.concat(resp.items);
				var nextPageToken = resp.nextPageToken;
				if (nextPageToken) {
					request = gapi.client.drive.files.list({
					  'pageToken': nextPageToken
					});
					retrievePageOfFiles(request, result);
				} else {
					callback(result);
				}
			});
		}
		var initialRequest = gapi.client.drive.files.list();
		retrievePageOfFiles(initialRequest, []);
	}


	function initializeModel(model){

<<<<<<< HEAD
			model.getRoot().set("events", model.createMap());
			model.getRoot().set("babies", model.createMap());
			model.getRoot().set("activity", model.createMap());
=======
		console.log('Retrieve Collaborators START');
		var collaborators = doc.getCollaborators();
	    var collaboratorCount = collaborators.length;
	    console.log(collaboratorCount + ' collaborators:');
	    var photoUrl = "";
	    for (var i = 0; i < collaboratorCount; i++) {
		    var user = collaborators[i];
		    console.log('Name: ' + user.displayName);
		    console.log('Is me:' + user.isMe);
		    console.log('photo url:' + user.photoUrl);
		    if (user.isMe) {
		    	photoUrl = user.photoUrl;
		    	document.getElementById("bt_person_profile").style.background = 'url(' + photoUrl + ')';
		    }
	  	}
	  	console.log('Retrieve Collaborators STOP');

		var textarea = $("#textarea")[0];
		textarea.value = array;
>>>>>>> origin/gh-pages

			model.getRoot().set("time", model.createMap()); 
			model.getRoot().set("day", model.createMap());
			model.getRoot().set("month", model.createMap());
			model.getRoot().set("year", model.createMap());
			model.getRoot().set("persons", model.createMap());
			model.getRoot().set("listOfPersons", model.createList());
	}

	

	function onFileLoaded(doc) {
		var model = doc.getModel();
		SnugActivities = model.getRoot().get("activity");
		SnugBabies = model.getRoot().get("babies");
		SnugEvents = model.getRoot().get("events");

		var sbTime = model.getRoot().get("time");
		var sbYear = model.getRoot().get("year");
		var sbMonth = model.getRoot().get("month");
		var sbDay = model.getRoot().get("day");
		sbPersons = model.getRoot().get("persons");
		var listOfPersons = model.getRoot().get("listOfPersons");

		SnugBabies.set("ANDREW", {
			"NAME" : "Andrew",
			"GENDER": "Male",
			"BIRTHDAY": "March 11, 1996",
			"AVATAR": "image1.png",
			"COLOR_SCHEME": "red"
		});
		
		SnugActivities.set("FOOD",{
				"TYPE": "BF",
				"AMOUNT": "20ml",
				"DURATION": "10min"
		});		

		SnugEvents.set( "2015", sbMonth);
			sbMonth.set( "MARCH,28", sbDay);
			sbDay.set( "SATURDAY", sbTime);
			sbTime.set( "1,05,PM", sbPersons);
			sbPersons.set( "Persons", listOfPersons);

			listOfPersons.push({
				"Person": SnugBabies.get("ANDREW"), 	
				"Activity": SnugActivities.get("FOOD")
			});
	}

	function afterAuth (){
		// only create/load files when no files were loaded initialy
		gapi.client.load('drive', 'v2', function () {
			if (rtclient.params.fileIds && rtclient.params.fileIds.length) {
				return;
			}
			retrieveAllFiles(function (files) {
				if (files.length === 0) {
					// create new file
					realtimeLoader.createNewFileAndRedirect();
				} else {
					// get last file and use it
					// TODO: add dialog to select files
					var file = files[files.length - 1];
					realtimeLoader.redirectTo([file.id], realtimeLoader.authorizer.userId);
				}
			});
		});
	}

	function startGoogleDriveRealtime() {
		realtimeLoader = new rtclient.RealtimeLoader(realtimeOptions);
		realtimeLoader.start();
	}