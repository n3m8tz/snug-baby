
	var initialAppStart = false;
	var realtimeLoader;
	var DEBUG_MODE = true;
	var collabdoc;

	var realtimeOptions = {

		/**
		* Client ID from the console.
		*
		*/
		//488687976561-cbn0sjmncb567hviggdetb3g84tb6ipk.apps.googleusercontent.com
		
		clientId: '488687976561-cbn0sjmncb567hviggdetb3g84tb6ipk.apps.googleusercontent.com',

		/**
		* The ID of the button to click to authorize. Must be a DOM element ID.
		*/
		authButtonElementId: 'authorizeButton',

		appId: '488687976561-cbn0sjmncb567hviggdetb3g84tb6ipk.apps.googleusercontent.com',

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

			model.getRoot().set("events", model.createMap());
			model.getRoot().set("babies", model.createMap());
			model.getRoot().set("activity", model.createMap());

			SnugActivities = model.getRoot().get("activity");
				
			/**** setting defaults for Activities ****/
				SnugActivities.set("FOOD", {
					"TYPE": "BF",
					"AMOUNT": "20ml",
					"DURATION": "10min",
					"IMAGE": "activityImg1.png",
					"NOTES": "20ml 10min via BF"
				});	

				SnugActivities.set("DIAPER", {
					"STOOL": ["Dry", "Poop", "Pee"],
					"IMAGE": "activityImg1.png",
					"NOTES": "Pooped"
				});	
			/****************************************/
	}

	function onFileLoaded(doc){

		collabdoc = doc;

		var model = doc.getModel();		

		SnugBabies = model.getRoot().get("babies");
		SnugEvents = model.getRoot().get("events");
		SnugActivities = model.getRoot().get("activity");	

		setupCollaborativeEvents();
	}

	function setupCollaborativeEvents(){

		var onCollaboratorsChanged = function(e){
			if (e.type.toUpperCase() === "COLLABORATOR_JOINED")
				console.log("Collaborator joined!");
			else if (e.type.toUpperCase() === "COLLABORATOR_LEFT")
				console.log("Collaborator left!");
		}
		
		var onMapValueChanged = function(e){
			
			var property = e.property;	//Which property(key) changed
			var oldValue = e.oldValue;	//Previous map value for this property(key)
			var newValue = e.newValue;	//New map value for this property(key)

			try{

				NormalizeWindow({ window: BabyTrackWindows.CHOOSE_EXISTED_PERSON });

				//if property added to SnugEvents 
				if(parseInt(property, 10)){
					NormalizeWindow({ window: BabyTrackWindows.POSTED_RESULTS_TABLE});
				}

			}finally{
			
				if (newValue === null && oldValue !== null)
					console.log("Property " + property + " was successfully removed!");

				if (newValue !== null && oldValue === null)
					console.log("Property " + property + " was successfully added!");


				if (newValue !== null && oldValue !== null)
					console.log("Property " + property + " changed value from "+ JSON.stringify(oldValue) + " to "+JSON.stringify(newValue));
			}
		}

		collabdoc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, onCollaboratorsChanged);
		collabdoc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, onCollaboratorsChanged);

		SnugBabies.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, onMapValueChanged);
		SnugEvents.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, onMapValueChanged);
		SnugActivities.addEventListener(gapi.drive.realtime.EventType.VALUE_CHANGED, onMapValueChanged);
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
					// 
					var file = files[files.length - 1];
					realtimeLoader.redirectTo([file.id], realtimeLoader.authorizer.userId);
				}
			});
		});
	}

	function showShareDialog() {
		var shareClient = new gapi.drive.share.ShareClient(realtimeOptions.appId);
		shareClient.setItemIds(rtclient.params['fileIds']);
		shareClient.showSettingsDialog();
	}

	function startGoogleDriveRealtime() {
		realtimeLoader = new rtclient.RealtimeLoader(realtimeOptions);
		realtimeLoader.start();
	}