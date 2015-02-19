	var realtimeOptions = {

		/**
		* Client ID from the console.
		*/
		clientId: '488687976561-cbn0sjmncb567hviggdetb3g84tb6ipk.apps.googleusercontent.com',

		/**
		* The ID of the button to click to authorize. Must be a DOM element ID.
		*/
		authButtonElementId: 'authorizeButton',

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
		onFileLoaded: onFileLoaded
	}

	function initializeModel(model){
		
		var collaborativeList = model.createList();
		collaborativeList.pushAll([
			'Andrew&&&&&March 11, 1996&&&&&type2&&&&&yellow',
			'Julia&&&&&May 23, 1996&&&&&type2&&&&&light-green'
		]);
		model.getRoot().set('data_list', collaborativeList);
	}

	function onFileLoaded(doc) {
		var model = doc.getModel();
		var listDemo = model.getRoot().get("data_list");
		var array = listDemo.asArray();
		var length = listDemo.length;

		console.log("ListDemo object: " + listDemo);
		console.log("array: " + array);
		console.log("length: " + length);

		var textarea = $("#textarea")[0];
		textarea.value = array;

		$("#submitButton").click(function(event){
			event.preventDefault();
			if(typeof current_baby === "undefined")
				return false;
			/*var nickname = current_baby.nickname;
			var birthday = current_baby.birthday;
			var avatarType = current_baby.avatarType;
			var color = current_baby.color;*/

			console.log("Submited button was pressed");
			console.log("Saving information --> " + current_baby.toString());
			listDemo.push(current_baby.toString());
		});	

		var onListChange = function(event){
			textarea.setAttribute('value', array);
			console.log("TextArea value is "+textarea.value);
		}

		listDemo.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, onListChange);
		listDemo.addEventListener(gapi.drive.realtime.EventType.VALUES_REMOVED, onListChange);
		listDemo.addEventListener(gapi.drive.realtime.EventType.VALUES_SET, onListChange);
		
		onListChange();
	}

	function startGoogleDriveRealtime(){
		var realtimeLoader = new rtclient.RealtimeLoader(realtimeOptions);
      	realtimeLoader.start();
	}