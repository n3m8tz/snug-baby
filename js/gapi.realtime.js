	var listDemo;

	var realtimeOptions = {

		/**
		* Client ID from the console.
		*/
		clientId: '488687976561-cbn0sjmncb567hviggdetb3g84tb6ipk.apps.googleusercontent.com',
 
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
		autoCreate: true,

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
		afterAuth: null // No action.
	}

	/*retrieveAllFiles(function(response){
		console.log(response.toString());
	});*/
	
	function initializeModel(model){
		//if( gapi.drive.realtime.Model.isInitialized()){
			var collaborativeList = model.createList();
			model.getRoot().set("data_list", collaborativeList);
		//}
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

	function onFileLoaded(doc){
		var model = doc.getModel();
		listDemo = model.getRoot().get("data_list");
		var array = listDemo.asArray();
		var length = listDemo.length;

		console.log("ListDemo object: " + listDemo);
		console.log("array: " + array);
		console.log("length: " + length);

		var textarea = $("#textarea")[0];
		textarea.value = array;

		var onListChange = function(event){
			textarea.setAttribute('value', array);
			console.log("TextArea value is "+textarea.value);
		}

		listDemo.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, onListChange);
		listDemo.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, onListChange);
		
		onListChange();
	}

	function startGoogleDriveRealtime(){
		var realtimeLoader = new rtclient.RealtimeLoader(realtimeOptions);
      	realtimeLoader.start();
	}