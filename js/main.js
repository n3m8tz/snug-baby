(function($, undefined){

	var SnugBabyPerson = (function(){
		// *****************************************************
		// PRIVATE FUNCTIONS
		// *****************************************************
		var normalize = function(basic, submitX, type){
			var _basic = basic;														//Eg: "Fri Apr 03 2015 06:52:20 GMT-0700 (Pacific Daylight Time)"
			var _submitX = submitX;													//Eg: case time - "06:52 AM" or 
																					//	  case date - "Saturday, April 4, 2015" 
			var date = new SnugBabyDayTime();
			switch(type.toUpperCase()){
				case "TIME":
					var patternTime = /\b(\d+):(\d+)\b/; 
					_submitX = _submitX.match(patternTime)[0].replace(/(\d+)(?=:)/, function(match, hours){
						return date.convert12To24hours(hours, _submitX.match(/(?:AM|PM)/)[0]);
					});				
					_basic = _basic.toString().replace(patternTime, _submitX);
				break;

				case "DATE":
					//var patternMonth = /\b(\d+):(\d+)\b/;							 //
					var dateArr = _submitX.split(/(?:,\ )+/);						 //Eg: ["Saturday", "April 4", "2015"] 
					
					var _basicArr = _basic.toString().split(/\ /);							
					_basicArr[0] = date.dayFullToShort(dateArr[0]);					 //Eg: "Friday" --> "Fri"
					_basicArr[1] = date.monthFullToShort(dateArr[1].split(" ")[0]);	 //Eg: "April" --> "Apr"
					_basicArr[2] = dateArr[1].split(" ")[1];	 
					_basicArr[3] = dateArr[2];

					var output = "";
					for(var i in _basicArr)
						output += _basicArr[i] + " ";

					_basic = output;

				break;
			}

			return _basic;
		}

		//CONSTRUCTOR
		function SnugBabyPerson(nickname, birthday, color, avatarType, avatarImg){
			// *****************************************************
			// PRIVATE VARIABLES 
			// ***************************************************** 
			var _submitTime = new String();
			var _submitDate = new String();
			var _notes = new Object();

			// *****************************************************
			// PUBLIC PROPERTIES
			// ***************************************************** 
			this.sbDayTime = new SnugBabyDayTime();
			this.nickname = nickname;
			this.birthday = birthday;
			this.color = color;
			this.avatarType = avatarType;
			this.avatarImg = avatarImg;
			this.gender = "Female";	 									//disabled for now, set to "Female" by default
			this.activity = undefined;
			this.activityImg = undefined;
			this.oldNickname = undefined;

			// *****************************************************
			// PRIVILEGED METHODS.
			// MAY BE INVOKED PUBLICLY AND MAY ACCESS PRIVATE ITEMS 
			// *****************************************************
			this.getSubmitTime = function(){
				return _submitTime;
			}
			this.setSubmitTime = function(submitTime){					//Eg: "9:45 AM"
				_submitTime = submitTime;							
				var time = normalize(this.sbDayTime.basic, _submitTime, "time");
				this.sbDayTime = new SnugBabyDayTime(new Date(time));
			}

			this.getSubmitDate = function(){
				return _submitTime;
			}
			this.setSubmitDate = function(submitDate){					//Eg: "Saturday, April 4, 2015"
				_submitDate = submitDate;
				var date = normalize(this.sbDayTime.basic, _submitDate, "date");
				this.sbDayTime = new SnugBabyDayTime(new Date(date));
			}

			this.getNotes = function(){
				return _notes;
			}

			this.setNotes = function(notes){ 
				if (typeof this.activity === "undefined")
					return;

				_notes = notes;
				switch(this.activity.toUpperCase()){
					case "FOOD":					 	
						var amount = _notes.AMOUNT;
						var duration = _notes.DURATION;
						var type = _notes.TYPE;
						_notes.value = (amount !== undefined && duration === undefined) ? amount + "ml via " + type:
										(amount === undefined && duration !== undefined) ? duration + "min via " + type:
										(amount !== undefined && duration !== undefined) ? amount + "ml for " +duration + "min via " + type:
										"Oops, no notes!";
					break;

					case "DIAPER":
						_notes.value = _notes.STOOL;
					break;
				}
			}
		}

		SnugBabyPerson.prototype.toString = function() {
			var output = "{";
			for(var prop in this)
			    if(obj.hasOwnProperty(prop))
					output += prop + ":" + obj[prop] + ",";
			if (output.charAt(output[length-1]) === ",")
				output[length-1] = "";
			output += "}";
			return output;
		};

		SnugBabyPerson.prototype.submit = function(){

			if (!SnugBabies.get(this.nickname.toUpperCase()))
				SnugBabies.set(this.nickname.toUpperCase(), {
					"NAME": this.nickname,
					"GENDER": this.gender,
					"BIRTHDAY": this.birthday,
					"AVATAR": {
						"VALUE": this.avatarImg,
						"TYPE": this.avatarType
					},
					"COLOR_SCHEME": this.color
				});

			var current = new Object();
			var notes = this.getNotes();
			var activityImg = this.activityImg;
			current.activity = (function(type){

				var _ = $.extend(true, {}, SnugActivities.get(type));		//deep copying of a Google Drive CollaborativeMap object
				switch(type){
					case "FOOD":
						_.TYPE = notes.TYPE;
						_.AMOUNT = notes.AMOUNT;
						_.DURATION = notes.DURATION; 
						break;

					case "DIAPER":
						_.STOOL = notes.STOOL;
						break;
				}
				_.NOTES = notes.value;
				_.IMAGE = activityImg;
				return _;
			})(this.activity.toUpperCase());

			current.person = {
				"Person" : this.nickname.toUpperCase(),
				"Activity" : current.activity
				//"DMY": 	//D - day, M - month, Y - year
			};

			var ID = (new SnugBabyDayTime(new Date(this.sbDayTime.basic.toString()))).HumanToUTC();
			SnugEvents.set( ID.toString(), current.person);
			return [ID.toString(), current.person];
		}

		// Code below "SnugBabyPerson.prototype.addToTable" 
		// is not supported yet and not used for now !!!
		SnugBabyPerson.prototype.addToTable = function(table){
			var self = this;
				var selector = "#posted_results_table";
						var babyData = '<tr class="table_row_baby_data">' +
											'<td class="table_avatar"></td>' +
											'<td class="table_baby_name">Name</td>' +
											'<td class="table_baby_activity">Activity</td>' +
											'<td class="table_feed_time">Time</td>' +
											'<td class="table_notes">Notes</td>' +
										'</tr>';

						$(selector).find("table > tbody").append(babyData);

						$(selector)
							.find("tr.table_row_baby_data")
							.last()
							.find("td.table_avatar")
							.html("<img src='" + self.avatarImg + "' />");


						if (self.avatarType == 1)						
							$(selector)
								.find("tr.table_row_baby_data")
								.last()
								.find("td.table_avatar *")
								.css("border", "thin solid #3B1D8F");

						$(selector)
							.find("tr.table_row_baby_data")
							.last()
							.find("td.table_baby_name")
							.text(self.nickname);

						$(selector)
							.find("tr.table_row_baby_data")
							.last()
							.find("td.table_baby_activity")
							.html( "<img src='" + self.activityImg + "' />");

						$(selector)
							.find("tr.table_row_baby_data")
							.last()
							.find("td.table_feed_time")
							.text(self.getSubmitTime());

						$(selector)
							.find("tr.table_row_baby_data")
							.last()
							.find("td.table_notes")
							.text( self.getNotes().value );

						$(selector)
							.find("tr.table_row_baby_data")
							.last()
							.css({ "border-color": self.color})
							.hover(
								function(){
									$(this).css({
										"background-color": $(this).css("border-color"),
										"color": "#FFFFFF"
									});
								},
								function(){
									$(this).css({
										"background-color": "#FFFFFF",
										"color": "inherit"
									});
								}
							);
		
						/*
						$(selector)
							.find( "caption" )
							.text( "Today, " + $(".datepicker").val() );
						*/
		}

		return SnugBabyPerson;
	})();
/*************************************************************************/



	function handleFiles(files) {
	  
	    var file = files[0];
	    var imageType = /image.*/;
	    
	    if (!file.type.match(imageType) || files.length != 1)  
	    	return;
	    
	    var img = document.createElement("img");
	    img.file = file;

	    // Assuming that "preview" is the div output where the content will be displayed.
	    $("#create_person_block")
	    	.find("[data-avatar-type='2']")
	    	.append( img ); 
	    
	    var reader = new FileReader();
	    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
	    reader.readAsDataURL(file);
	}

	function setInitialPage(page, custom_appear, preventPersonAppending){

		//setting the default value for the element if it's undefined
		custom_appear = (typeof custom_appear !== 'undefined') ?  custom_appear: {speed: 400};
		var selector = "";
		//reset mode to 0;
		mode = BabyTrackMode.NONE;

		switch(page){
			
			case BabyTrackInitialPage.WELCOME_POST:

				//Welcome Message appears only when a user got started on using 
				//an app for the 1st time and hadn't posted any notes yet

				//handaling an arrow appearing
				//it fades in once the mouse over and fades out otherwise;
				$("#welcome_guide_block > section > p > img").on("mouseover mouseout", function(event){

					switch(event.type){

						case "mouseover": 

							$("#welcome_guide_block > section > p + img")
								.stop()
								.animate({
									"opacity": 1,
								}, 500);
							break;

						case "mouseout":

							$("#welcome_guide_block > section > p + img")
								.stop()
								.animate({
									"opacity": 0,
								}, 500);
							break;
					}
				});

				selector = "#welcome_guide_block";

			break;

			case BabyTrackInitialPage.POSTED_RESULTS_TABLE:
				selector = "#posted_results_table";
				$("#posted_results_table").on("click", "tr", function(event){
					event.preventDefault();
					onEntryClick(this);
				});
				var $checked_activity = $("#wizard_new_activity").find(":radio:checked");
				var $data_diaper_type = $checked_activity.parent().prev().attr("data-activity-type");
				
			break;
		}


		switch(custom_appear.effect){
			case "show":
					$(selector).show(custom_appear.speed).promise();
			break;

			case "fadeIn":
					$(selector).fadeIn(custom_appear.speed).promise();
			break;

			case "drop":
					$(selector).show("drop", custom_appear.speed).promise();
			break;

			default:
				$(selector).css("display", "block");
		}

	}

	function diaperWindowLogic(){
		
		mode = BabyTrackMode.ADD_DIAPER_EVENT;
		previousWindow = BabyTrackWindows.ADD_EVENT_WIZARD_NEW_ACTIVITY;

		
		//setting the default value for the element if it's undefined
		var nickname = (current_baby.nickname !== '') ?  current_baby.nickname : "a baby";

		$("#diaper_content").find("h1").replaceWith("<h1>"+ nickname +"'s Diaper Content!</h1>");

		$("#diaper_content").find("section[data-type='subactivity_diaper']")
					.click(function(){

						unselectOthers({window: "ADD_DIAPER_EVENT"}); 
						$(this).find("div.subactivity_diaper").toggleClass("selected unselected");
						$(this).find(":radio").prop("checked", true);
					});

		clearWindows({effect: "drop", speed: 500, direction: "left"});
		var timer = setInterval(function(){
			if(windowsAnimationOver){
				$("#diaper_content").show("drop", {direction: "right"}, 400);
				clearInterval(timer);
			}
		}, 10);
		
	}
	
	function foodWindowLogic(){

		mode = BabyTrackMode.ADD_FOOD_EVENT;
		previousWindow = BabyTrackWindows.ADD_EVENT_WIZARD_NEW_ACTIVITY;

		var nickname = (current_baby.nickname !== '') ?  current_baby.nickname : "a baby";

		$("#food_content").find("h1").replaceWith("<h1>What and how much did "+ nickname +" eat?</h1>");

		$("#food_content").find("section[data-type='subactivity_food']")
			.click(function(){
				unselectOthers({window: "ADD_FOOD_EVENT"}); 
				$(this).find("div.subactivity_food").toggleClass("selected unselected");
				$(this).find(":radio").prop("checked", true);
			});

		clearWindows({effect: "drop", speed: 500, direction: "left"});
		var timer = setInterval(function(){
			if(windowsAnimationOver){
				clearResults({window: "ADD_FOOD_EVENT"});
				$("#food_content").show("drop", {direction: "right"}, 400);
				clearInterval(timer);
			}
		}, 10);


		//Allowing to input only numbers into textboxes
		$( "#food_content" ).find( "input[name=food_amount], input[name=food_duration]" )
			.keydown(function (event) {
		        // Allow: backspace, delete, tab, escape, enter and .
		        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
		             // Allow: Ctrl+A
		            (event.keyCode == 65 && event.ctrlKey === true) || 
		             // Allow: home, end, left, right, down, up
		            (event.keyCode >= 35 && event.keyCode <= 40)) {
		                 // let it happen, don't do anything
		                 return;
		        }
		        // Ensure that it is a number and stop the keypress
		        if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
		            event.preventDefault();
		        }
		    });
	}


	//---------------------------------------------------------------------
	//insertElem and locationOf r used for inserting item into sorted array
	function insertElem(location, element, array) {
		array.splice(location + 1, 0, element);
		return array;
	}
	
	function locationOf(element, array, start, end){
		start = start || 0;
		end = end || array.length;
		var pivot = parseInt(start + (end - start) / 2, 10);
		if (array[pivot] === element) 
			return pivot;
		if (end - start <= 1)
			return array[pivot] > element ? pivot - 1 : pivot;
		if (array[pivot] < element) {
			return locationOf(element, array, pivot, end);
		} else {
			return locationOf(element, array, start, pivot);
		}
	}
	//----------------------------------------------------------------------



	function normalizeEntry(event, dom){
		var timestamp = event[0];
		var avatar = SnugBabies.get(event[1].Person).AVATAR.VALUE;
		var activity = event[1].Activity.IMAGE;
		var name = SnugBabies.get(event[1].Person).NAME;
		var notes = event[1].Activity.NOTES;


		//Eg: { short : "01:05 PM", full : "01:05:40 PM" }
		var time = (function(_timestamp){
			var _daytime = new SnugBabyDayTime();
			_daytime.setTimestamp(parseInt(_timestamp, 10));
			var _view = _daytime.UTCtoLocal();							//Eg: "Thu Apr 30 2015 13:05:06 GMT+0100 (Central Europe Standard Time)"
			var _hh = _view.match(/\b(\d+):(\d+):(\d+)\b/)[0].split(":")[0];
			var _mm = _view.match(/\b(\d+):(\d+):(\d+)\b/)[0].split(":")[1];	
			var _ss = _view.match(/\b(\d+):(\d+):(\d+)\b/)[0].split(":")[2];

			var timeStruct = new Object();
			
			timeStruct = {
				"short" : _daytime.formatTimeAMPM(_hh, _mm),			//return Eg: "01:05 PM"
				"full" : _daytime.formatTimeAMPM(_hh, _mm, _ss)			//return Eg: "01:05:40 PM"
			}

			return timeStruct;

		})(timestamp);


		//Eg: "_1439251520"
		var tableId = (function(_timestamp){
			var _daytime = new SnugBabyDayTime();	
			_daytime.setTimestamp(parseInt(_timestamp, 10));
			var _view = _daytime.UTCtoLocal();							//Eg: "Thu Apr 30 2015 13:05:06 GMT+0100 (Central Europe Standard Time)"
			var _viewDate = new Date(_view);							//Eg: Thu Apr 30 2015 13:05:06 GMT+0100 (Central Europe Standard Time)
			var timestampWithoutTime = _viewDate.setHours(0,0,0,0);		//returning a timestamp without hours, minutes, seconds and milliseconds
			timestampWithoutTime = Math.round(timestampWithoutTime / 1000.0);
			var id = "_" + timestampWithoutTime.toString();					
			return id;													//return Eg: "_1439251520"
		})(timestamp);													

		//entryId is the time retrofitted as "07:36:30 AM" --> "_0073630"
		//Eg: "_0073630"
		var entryId = (function(time){										 
			var _hh = time.match(/\b(\d+):(\d+):(\d+)\b/)[0].split(":")[0];	
			var _mm = time.match(/\b(\d+):(\d+):(\d+)\b/)[0].split(":")[1];
			var _ss = time.match(/\b(\d+):(\d+):(\d+)\b/)[0].split(":")[2];
			var _ampm = /AM/i.test(time) ? "0" : "1";						//	first 0  means AM and 1 means PM
			var id = _ampm + (_hh.length === 1 ? "0" + _hh : _hh) + _mm + _ss;									
			id = "_" + id;
			return id;
		})(time["full"]);														//return Eg: "_0073630"

		//Eg: "Thu Apr 30 2015"
		var tableCaption = (function(_timestamp){
			var _daytime = new SnugBabyDayTime();	
			_daytime.setTimestamp(parseInt(_timestamp, 10));
			var _view = _daytime.UTCtoLocal();							//Eg: "Thu Apr 30 2015 13:05:06 GMT+0100 (Central Europe Standard Time)"
			var caption = _view.match(/(.+)(?=\s+\d+:\d+:\d+)/)[0];		
			return caption;												//Eg: "Thu Apr 30 2015"
		})(timestamp);											

		var findTable = function(_tableId, dom){
			return dom.querySelector("#"+_tableId);
		};
		
		var anyTablesExistIn = function(dom){
			var pattern = /<\s*table\s+id\s*=\s*(?:'|")_\d+(?:'|")\s*>/i;
			return pattern.test(dom.innerHTML);
		};

		var insertTable = function(_location, table, dom){	
			if(dom.getElementsByTagName("table").length > 0)
				dom.insertBefore(table, dom.getElementsByTagName("table")[_location+1]);
			else
				dom.appendChild(table);
		}

		var table = new Table();
		var entry = new TableRow();

		var buildEntry = function(_entryId){
			entry = new TableRow(_entryId);
			var tableRows = table.value.rows;
			var orderedEntriesIdList = new Array();
			var _location = -1;

			if(tableRows.length > 0){
				for(var i=0; i<tableRows.length; i++){
					var id = parseInt(tableRows[i].getAttribute("id").replace("_", ""), 10);
					orderedEntriesIdList.push(id);
				}
				_location = locationOf(parseInt(_entryId.replace("_", ""), 10), orderedEntriesIdList);
			}

			table.insertEntry(_location + 1, entry.value, avatar, activity, name, notes, time["short"]);
			
			// normalize Table Entry
			(function(_table){
				var id = "#"+_entryId;

				if ( SnugBabies.get(event[1].Person).AVATAR.TYPE === 1)
					$(_table).find(id).find("td.table_avatar").children().css("border", "thin solid #3B1D8F");

				$(_table)
					.find(id)
					.css({ "border-color": SnugBabies.get(event[1].Person).COLOR_SCHEME })
					.hover(function(){
								$(this).css({
									"background-color": $(this).css("border-color"),
									"color": "#FFFFFF"
								});
							},
							function(){
								$(this).css({
									"background-color": "#FFFFFF",
									"color": "inherit"
								});
							});
			})(table.value);
		};

		var buildTable = function(_tableId, dom){
			table = new Table(_tableId);										//create a new table specifing a certain ID to dom node object!
			table.setCaption( tableCaption ); 
			buildEntry(entryId);

			var tables = dom.getElementsByTagName("table");
			var orderedTablesIdList = new Array();
			var _location = -1;

			if(tables.length > 0){
				for(var i=0; i<tables.length; i++){
					var id = parseInt(tables[i].getAttribute("id").replace("_", ""), 10);
					orderedTablesIdList.push(id);
				}
				_location = locationOf(parseInt(_tableId.replace("_", ""), 10), orderedTablesIdList);
			}

			insertTable(_location+1, table.value, dom);							//insert a table we came across into the dom!
		};

		if (anyTablesExistIn(dom)){															
			table.value = findTable(tableId, dom);								
			
			if(table.value){													//if we didn't come up with a node with specified ID in dom, drop next step
				entry = table.findEntry(entryId);
				//if (entry)
					buildEntry(entryId);								
			}else
				buildTable(tableId, dom);
		}else
			buildTable(tableId, dom);	

	}



	function normalize(obj){
		var normalizeOneEntry = typeof obj.normalizeOneEntry !== "undefined" ? obj.normalizeOneEntry : false;
		var single_event = (normalizeOneEntry && typeof obj.event !== "undefined") ? obj.event : undefined;

		switch(obj.window){
			case BabyTrackWindows.CREATE_NEW_PERSON:
			break;

			case BabyTrackWindows.POSTED_RESULTS_TABLE:
			var prSelector = "#posted_results_table > section";

				if(!SnugEvents.isEmpty()){													//if there any information about babys in the database
					
					// if Welcome Post Dashboard is still opened, 
					// lets exchange it for Posted Results Window.
					// this situation may occur if no events have been added yet
					// and in case one collaborator adds a new event
					// but another still doesn't.. 
					// from this point without page refrashing 
					// the 1st one sees a Posted Results Window
					// but the 2nd one still sees  Welcome Post Dashboard


					//timestamp, time, notes, avatar, name and activity, dom
					var dom = document.querySelector(prSelector);

					dom.innerHTML = null;

					if (normalizeOneEntry)
						normalizeEntry(single_event, dom);
					else 
						SnugEvents.items().forEach(function(event){
							normalizeEntry(event, dom);
						});

					if (initialPage === BabyTrackInitialPage.WELCOME_POST
						&& mode === BabyTrackMode.NONE){

						initialPage = BabyTrackInitialPage.POSTED_RESULTS_TABLE;

						clearWindows({effect: "fadeOut", speed: 800});

						var timer = setInterval(function(){
							if(windowsAnimationOver){
								setInitialPage(BabyTrackInitialPage.POSTED_RESULTS_TABLE, {effect: "drop", speed: 500});
								clearInterval(timer);
							}
						}, 10);
					}
					
				}
				
			break;

			case BabyTrackWindows.ADD_EVENT_WIZARD_NEW_PERSON:
			break;

			case BabyTrackWindows.ADD_EVENT_WIZARD_NEW_ACTIVITY:
			break;

			case BabyTrackWindows.CHOOSE_EXISTED_PERSON:
					if(!SnugBabies.isEmpty()){												 //if there any information about baby's in the database
						
						$("#choose_person").find(".add_person_button").prevAll().remove();
						
						SnugBabies.items().forEach(function(baby){

							var newPersonAvatar = 	
								"<section data-type='avatar'>"+
									"<div>"+
										"<div class = 'avatar selected' data-avatar-type="+ baby[1].AVATAR.TYPE +">"+
											"<img src='" + baby[1].AVATAR.VALUE + "' />"+
										"</div>"+
										
										"<label>"+
											"<input type='radio' name='avatar_radio'/>"+ baby[1].NAME +
										"</label>"+
									"</div>"+
								"</section>";

							var pageAvatarCount = $("#choose_person").find("section[data-type='avatar']").length;
							if( pageAvatarCount == MAX_PAGE_AMOUNT_COUNT)
								$("#choose_person > section > div").css({"overflow-y": "scroll"});
							
							$("#choose_person").find(".add_person_button").before( newPersonAvatar );

							var $lastAvatarInList = $("#choose_person").find("section[data-type='avatar']").last();

							$lastAvatarInList
								.click(function(){

									unselectOthers({window: "CHOOSE_EXISTED_PERSON"}); 
									$(this).find("div.avatar").toggleClass("selected unselected");
									$(this).find(":radio").prop("checked", true);
								})
								.dblclick(function(event){
									$(this).hide(500,function(){																	
										if( !$.isEmptyObject( $(this).prev()[0] )){														//if previous exists
											if( $(this).find(":radio").is(":checked")){
												$(this).prev().find("div[data-avatar-type]").toggleClass("selected unselected");
												$(this).prev().find(":radio").prop("checked", true);
											}
										}else{
											if( $(this).find(":radio").is(":checked")){
												var $nextSibling = $("#choose_person").find(".add_person_button").prev();
												if( !$.isEmptyObject( $(this).next()[0]) ){
													$(this).next().find("div[data-avatar-type]").toggleClass("selected unselected");
													$(this).next().find(":radio").prop("checked", true);
												}
											}
										}
										$(this).remove();
									});
								})
								.find(":radio")
								.prop("checked", true);
						});

						$("#choose_person").find("section[data-type='avatar']").each(function(index){
							$avatarImg = $(this).find("div[data-avatar-type]");
							if($avatarImg.attr("data-avatar-type") == "2"){
								$avatarImg.addClass("uploaded");
							}
						});

						unselectOthers({window: "CHOOSE_EXISTED_PERSON"}); 
						$("#choose_person").find("section[data-type='avatar']").first().find("div.avatar").toggleClass("selected unselected");
						$("#choose_person").find("section[data-type='avatar']").first().find(":radio").prop("checked", true);
					}
					
			break;

			case BabyTrackWindows.ADD_FOOD_EVENT:
			break;

			case BabyTrackWindows.ADD_DIAPER_EVENT:
			break;
		}
	}



	function openChoosePersonWindow(){
		try{
			checkCorrectInputAndSubmit({window: "CREATE_NEW_PERSON"});	
		}
		catch(e){
			alert(e.toString());
			return;
		}

		//this part executes as long as the whole data is full
		//and everything is specified

			var nickname = $("#create_person_block").find("input#person_nickname").val();
			var birthday = $("#create_person_block").find("input#person_birthday").val();
			var avatarType = parseInt( $("#create_person_block").find(".avatar.selected").attr("data-avatar-type"), 10);
			var avatarImg = $("#create_person_block").find(".avatar.selected").html();	//"<img src='...' />"
			var color = $(".colorpicker").val();
			
			var $prevSibling = $("#choose_person").find(".add_person_button").prev();
			if( $.isEmptyObject($prevSibling[0]) ||
				!needToCorrectInputs ){

				$prevSibling.find("div[data-avatar-type]").toggleClass("selected unselected");
				$prevSibling.find(":radio").prop("checked", false);


				var newPersonAvatar = 	"<section data-type='avatar'>" +
											"<div>" +
												"<div class = 'avatar selected' data-avatar-type="+ avatarType.toString() + ">" +
													avatarImg +
												"</div>" +
												
												"<label>" +
													"<input type='radio' name='avatar_radio'/>" +
													nickname +
												"</label>"+
											"</div>"+
										"</section>";

				var pageAvatarCount = $("#choose_person").find("section[data-type='avatar']").length;

				if( pageAvatarCount == MAX_PAGE_AMOUNT_COUNT)
					$("#choose_person > section > div").css({"overflow-y": "scroll"});

				$("#choose_person").find(".add_person_button").before( newPersonAvatar );

				if( avatarType.toString() === "2")
					$("#choose_person").find("section[data-type='avatar']")
						.last()
						.find("div[data-avatar-type='2']")
						.html(	$("#create_person_block").find("div.avatar[data-avatar-type='2']").html() )
						.addClass("uploaded");

				unselectOthers({window: "CHOOSE_EXISTED_PERSON"});

				$("#choose_person").find("section[data-type='avatar']")
					.last()
					.click(function(){

						unselectOthers({window: "CHOOSE_EXISTED_PERSON"}); 
						$(this).find("div.avatar").toggleClass("selected unselected");
						$(this).find(":radio").prop("checked", true);
					})
					.dblclick(function(event){
						$(this).hide(500,function(){																	
							if( !$.isEmptyObject( $(this).prev()[0] )){														//if previous exists
								if( $(this).find(":radio").is(":checked")){
									$(this).prev().find("div[data-avatar-type]").toggleClass("selected unselected");
									$(this).prev().find(":radio").prop("checked", true);
								}
							}else{
								if( $(this).find(":radio").is(":checked")){
									var $nextSibling = $("#choose_person").find(".add_person_button").prev();
									if( !$.isEmptyObject( $(this).next()[0]) ){
										$(this).next().find("div[data-avatar-type]").toggleClass("selected unselected");
										$(this).next().find(":radio").prop("checked", true);
									}
								}
							}
							$(this).remove();
						});
					})
					.find(":radio")
					.prop("checked", true)
					
					$("#choose_person").find("section[data-type='avatar']")
					.last()
					.find("div.avatar")
					.toggleClass("selected unselected");

			}else{								
				//if recently created

				needToCorrectInputs = false;
				$prevSibling.find("div[data-avatar-type]").attr("data-avatar-type", avatarType.toString());
				$prevSibling.find("label").html("<input type='radio' name='avatar_radio'/>" + nickname);
				$prevSibling.find("div[data-avatar-type]").html( $("#create_person_block").find("div.avatar.selected[data-avatar-type]").html() );
				$prevSibling.find(":radio").prop("checked", true);
				unselectOthers({window:"CHOOSE_EXISTED_PERSON"});
				$prevSibling.find("div.avatar").toggleClass("selected unselected");
			}

			clearWindows({effect: "drop", speed: 500, direction: "left"});

			var timer = setInterval(function(){
				if(windowsAnimationOver){
					$("#choose_person").show("drop", {direction: "right"}, 400);
					clearInterval(timer);
				}
			}, 10);

			mode = BabyTrackMode.CHOOSE_EXISTED_PERSON;
			previousWindow = BabyTrackWindows.CREATE_NEW_PERSON;
		//////

	}


	function openAddEventWizardNewActivityWindow(){
			try{
				checkCorrectInputAndSubmit({window: "CHOOSE_EXISTED_PERSON"});
			}catch(e){
				alert(e.toString());
				return;
			}

			$('#diaper_content').find(".subactivity_diaper[data-diaper-type='peed'] > img").attr("src", "images/old/pee.png");
			$('#diaper_content').find(".subactivity_diaper[data-diaper-type='pooped'] > img").attr("src", "images/old/poop.png");

			//this part executes as long as the whole data is full
			//and everything is specified

			createCurrentBabyToSnug();

			mode = BabyTrackMode.ADD_EVENT_WIZARD_NEW_ACTIVITY;
			previousWindow = BabyTrackWindows.CHOOSE_EXISTED_PERSON;

			//setting the default value for the element if it's undefined
			var nickname = (current_baby.nickname !== '') ?  current_baby.nickname : "a baby";

			$("#wizard_new_activity").find("h1").replaceWith("<h1>Choose an activity for "+ nickname +"</h1>");

			$("#wizard_new_activity").find("section[data-type='activity']")
						.click(function(){

							unselectOthers({window: "ADD_EVENT_WIZARD_NEW_ACTIVITY"}); 
							$(this).find("div.activity").toggleClass("selected unselected");
							$(this).find(":radio").prop("checked", true);
						});

			clearWindows({effect: "drop", speed: 500, direction: "left"});
			var timer = setInterval(function(){
				if(windowsAnimationOver){
					$("#wizard_new_activity").show("drop", {direction: "right"}, 400);
					clearInterval(timer);
				}
			}, 10);
	}


	function openSelectedActivity(){

			try{
				checkCorrectInputAndSubmit({window: "ADD_EVENT_WIZARD_NEW_ACTIVITY"})
			}catch(e){
				alert(e.toString());
				return;
			}

			var $checked_activity = $("#wizard_new_activity").find(":radio:checked");
			var $data_diaper_type = $checked_activity.parent().prev().attr("data-activity-type");
			
			current_baby.sbDayTime = new SnugBabyDayTime();

			$("#diaper_content, #food_content")
				.find("input.datepicker")
				.val(current_baby.sbDayTime.fullDay +", "+ current_baby.sbDayTime.fullMonth + ", " + current_baby.sbDayTime.year);

			$("#diaper_content, #food_content")
				.find("input.timepicker")
				.val(current_baby.sbDayTime.shortTime);

			glSubmitDate = $(".datepicker").val();
			glSubmitTime = $(".timepicker").val();

			switch($data_diaper_type){
				case "food":
					foodWindowLogic();
					break;

				case "diaper":
					diaperWindowLogic();
					break;

				case "weight":
					break;
			}
	}


	function openPostedResultsWindowLogic(){

		$("#add_event_buttonPC").show(1000);

		dropNextBackBtns();

		initialPage = BabyTrackInitialPage.POSTED_RESULTS_TABLE;
		previousWindow = BabyTrackWindows.NONE;
		mode = BabyTrackMode.NONE;

		clearWindows({effect: "fadeOut", speed: 800});	//asynchronous function

		//awaiting until other animation processes stop
		//as clearWindows function is asynchronous

		var timer = setInterval(function(){
			if(windowsAnimationOver){
				setInitialPage(initialPage, {effect: "drop", speed: 500});
				clearInterval(timer);
				
				//clear all the fields in Create New Person Window
				clearResults({window: "CREATE_NEW_PERSON"});

			}
		}, 10);
	}

	function openWelcomePostWindowLogic(){

		$("#add_event_buttonPC").show(1000);

		dropNextBackBtns();

		initialPage = BabyTrackInitialPage.WELCOME_POST;
		previousWindow = BabyTrackWindows.NONE;
		mode = BabyTrackMode.NONE;

		clearWindows({effect: "fadeOut", speed: 800});	//asynchronous function

		//awaiting until other animation processes stop
		//as clearWindows function is asynchronous

		var timer = setInterval(function(){
			if(windowsAnimationOver){
				setInitialPage(initialPage, {effect: "drop", speed: 500});
				clearInterval(timer);
				
				//clear all the fields in Create New Person Window
				clearResults({window: "CREATE_NEW_PERSON"});

			}
		}, 10);
	}


	function createCurrentBabyToSnug(){
		var nickname =	$("#choose_person").find(":radio:checked").parent().text();								//should be loaded from a server
		var birthday = $("#create_person_block").find("input#person_birthday").val();							//should be loaded from a server
		var avatarType =  parseInt( $("#choose_person").find(".avatar.selected").attr("data-avatar-type"), 10);	//should be loaded from a server
		var color =  	$(".colorpicker").val();																//should be loaded from a server. 
	 	var avatarImg = $("section[data-type='avatar']").find("div.avatar.selected img").attr("src");
		
		current_baby = new SnugBabyPerson(nickname, birthday, color, avatarType, avatarImg);
	}

	function checkCorrectInputAndSubmit( object ){
		switch( object.window ){
			
			case "CREATE_NEW_PERSON":	
				var nickname = $("#create_person_block").find("input#person_nickname").val();
				var birthday = $("#create_person_block").find("input#person_birthday").val();
				var $avatar =  $("#create_person_block").find(".avatar.selected");
				var color = $(".colorpicker").val();

				if( nickname === "")
					throw new IncorrectInputException( "Nickname is not specified!" );
				else if( birthday === "")
					throw new IncorrectInputException( "Birthday is not specified!" );
				else if( $.isEmptyObject( $avatar[0] ) )
					throw new IncorrectInputException( "Avatar is not specified!" );
				break;

			case "CHOOSE_EXISTED_PERSON":
				var $avatar_checked_radio = $("#choose_person").find(":radio:checked");
				if( $avatar_checked_radio.length == 0 )												//if not exists
					throw new IncorrectInputException( "A baby to snug is not selected! \n Please, create a new one." );
				break;

			case "ADD_FOOD_EVENT":
				var amount = $("#food_content").find("input[name=food_amount]").val();
				var duration = $("#food_content").find("input[name=food_duration]").val();
				if( amount === "" && duration === "")
					throw new IncorrectInputException( "Either amount or duration or both must be specified!" );
				break;

			case "ADD_DIAPER_EVENT":
				var $diaper_checked_radio = $("#diaper_content").find(":radio:checked");
				if( $diaper_checked_radio.length == 0 )												//if not exists
					throw new IncorrectInputException( "Diaper type is not selected!" );
				break;

			case "ADD_EVENT_WIZARD_NEW_ACTIVITY":
				var $activity_checked_radio = $("#wizard_new_activity").find(":radio:checked");
				if( $activity_checked_radio.length == 0 )											//if not exists
					throw new IncorrectInputException( "Activity is not selected!" );
				break;
		}
	}

	//The function is used to get rid of major (not popup and dropdown!!!) 
	//windows as only one major (not popup and dropdown!!!) window may be 
	//displayed on the app screen at the same time

	function clearWindows(custom_appear){

		windowsAnimationOver = false;

		//setting the default value for the element if it's undefined
		custom_appear = (typeof custom_appear !== 'undefined') ?  custom_appear: {effect: "fadeOut", speed: 500, direction:"left"};
		custom_appear.direction = (typeof custom_appear.direction !== 'undefined') ?  custom_appear.direction: "left";

		$( "#bt_container > section" ).each(function(index){
			if ( $( this ).css("display") !== "none"){
				switch(custom_appear.effect){

					case "fadeOut":
						$(this).fadeOut(custom_appear.speed, function(){
							windowsAnimationOver = true;
						});
					break;

					case "hide":
						$(this).hide(custom_appear.speed, function(){
							windowsAnimationOver = true;
						});
					break;

					case "drop":
						$(this).hide("drop", {direction: custom_appear.direction}, custom_appear.speed, function(){
							windowsAnimationOver = true;
						});
					break;

					case "slideDown":
						$(this).slideDown(custom_appear.speed, function(){
							windowsAnimationOver = true;
						});
					break;

				}

			}
		});
	}


	function getDefaultNotes(activity){
		var notes = '';
		switch(activity){
			case "FOOD":
				var food_amount = $("#food_content").find("input[name=food_amount]").val();
				var food_duration = $("#food_content").find("input[name=food_duration]").val();

				if (food_amount !== ""	&&	food_duration !== "")
					notes = {
						"AMOUNT": food_amount,
						"DURATION": food_duration,
						"TYPE": "Bottle"				//disabled for now, set to "Bottle" by default
					}
				if (food_amount !== ""	&& 	food_duration === "")
					notes = {
						"AMOUNT": food_amount,
						"DURATION": undefined,
						"TYPE": "Bottle"				//disabled for now, set to "Bottle" by default
					}

				if (food_amount === ""	&& 	food_duration !== "")
					notes = {
						"AMOUNT": undefined,
						"DURATION": food_duration,
						"TYPE": "Bottle"				//disabled for now, set to "Bottle" by default
					};
				break;

			case "DIAPER":
				var diaperType = $("#diaper_content").find(".subactivity_diaper.selected").attr("data-diaper-type");
				notes = {
					"STOOL": (diaperType === "peed") ?  "Peed" : "Pooped" 
				};
				break;
		}

		return notes;
	}

	/****** Main Logic for buttons Next and Back  *******/

	function setNextBackButtonsLogic(){

		$(document).on("click", ".button.next", function(){

			switch(mode){
				
				case BabyTrackMode.CREATE_NEW_PERSON:
					openChoosePersonWindow();
					break;

				case BabyTrackMode.CHOOSE_EXISTED_PERSON:
					openAddEventWizardNewActivityWindow();
					break;

				case BabyTrackMode.ADD_EVENT_WIZARD_NEW_ACTIVITY:
					openSelectedActivity();
					break;

				case BabyTrackMode.MODIFY_PERSON:
					var obj = $.extend(true, {}, SnugBabies.get(current_baby.nickname.toUpperCase()));
					
					obj.NAME = $("#create_person_block").find("input#person_nickname").val();	
					obj.BIRTHDAY = $("#create_person_block").find("input#person_birthday").val();	
					var $avatar = $("#create_person_block").find(".avatar.selected");
					obj.AVATAR.VALUE = $avatar.find("img").attr("src");
					obj.AVATAR.TYPE = parseInt( $avatar.attr("data-avatar-type"), 10);
					obj.COLOR_SCHEME = $(".colorpicker").val();
					obj.GENDER = current_baby.gender;
					current_baby.nickname = obj.NAME;

					SnugBabies.delete( current_baby.oldNickname.toUpperCase() );
					SnugBabies.set(	current_baby.nickname.toUpperCase(), obj );

					
					if (current_baby.oldNickname !== current_baby.nickname){

						SnugEvents.items().forEach(function(event){
							if(event[1].Person === current_baby.oldNickname.toUpperCase()){
								var newobj = $.extend(true, {}, event[1]);
								newobj.Person = current_baby.nickname.toUpperCase();
								SnugEvents.set(event[0], newobj);
							}
						});
					}

					$("#posted_results_table > section").empty();
					normalize({window: BabyTrackWindows.POSTED_RESULTS_TABLE});

					openPostedResultsWindowLogic();
					break;

				case BabyTrackMode.ADD_FOOD_EVENT:

					try{
						checkCorrectInputAndSubmit({window: "ADD_FOOD_EVENT"});
					}catch(e){
						alert(e.toString());
						return;
					}

					current_baby.activityImg = 'images/old/bottle.png';
					current_baby.activity = "FOOD";
					current_baby.setNotes( getDefaultNotes("FOOD") );
					current_baby.setSubmitDate( glSubmitDate );
					current_baby.setSubmitTime( glSubmitTime );

					//current_baby.addToTable( $("#posted_results_table").find("table").html() );
					var single_event = current_baby.submit();

					normalize({window: BabyTrackWindows.CHOOSE_EXISTED_PERSON});
					
					openPostedResultsWindowLogic();
					break;

				case BabyTrackMode.ADD_DIAPER_EVENT:

					try{
						checkCorrectInputAndSubmit({window: "ADD_DIAPER_EVENT"});
					}catch(e){
						alert(e.toString());
						return;
					}

					current_baby.activityImg = $("#diaper_content").find(".subactivity_diaper.selected[data-diaper-type]").find("img").attr("src");
					current_baby.activity = "DIAPER";
					current_baby.setNotes( getDefaultNotes("DIAPER") );
					current_baby.setSubmitDate( glSubmitDate );
					current_baby.setSubmitTime( glSubmitTime );

					//current_baby.addToTable( $("#posted_results_table").find("table").html() );
					var single_event = current_baby.submit();

					normalize({window: BabyTrackWindows.CHOOSE_EXISTED_PERSON});
					openPostedResultsWindowLogic();
					break;

			}
		});


		$(document).on("click", ".button.back", function(){
			switch(previousWindow){

				case BabyTrackWindows.NONE:
				break;

				case BabyTrackWindows.WELCOME_POST:
					openWelcomePostWindowLogic();
				break;

				case BabyTrackWindows.POSTED_RESULTS_TABLE:
					openPostedResultsWindowLogic();
				break;
				
				case BabyTrackWindows.CREATE_NEW_PERSON:
					needToCorrectInputs = true;
					previousWindow = BabyTrackWindows.POSTED_RESULTS_TABLE;
					mode = BabyTrackMode.CREATE_NEW_PERSON;

					clearWindows({effect: "drop", speed: 500, direction: "right"});
					var timer = setInterval(function(){
						if(windowsAnimationOver){
							$("#create_person_block").show("drop", {direction: "left"}, 400);
							clearInterval(timer);
						}
					}, 10);

				break;
				
				case BabyTrackWindows.CHOOSE_EXISTED_PERSON:
					
					mode = BabyTrackMode.CHOOSE_EXISTED_PERSON;
					previousWindow = BabyTrackWindows.CREATE_NEW_PERSON;

					clearWindows({effect: "drop", speed: 500, direction: "right"});
					var timer = setInterval(function(){
						if(windowsAnimationOver){
							$("#choose_person").show("drop", {direction: "left"}, 400);
							clearInterval(timer);
						}
					}, 10);

				break;

				case BabyTrackWindows.ADD_EVENT_WIZARD_NEW_PERSON:
				break;
				
				case BabyTrackWindows.ADD_EVENT_WIZARD_NEW_ACTIVITY:

					mode = BabyTrackMode.ADD_EVENT_WIZARD_NEW_ACTIVITY;
					previousWindow = BabyTrackWindows.CHOOSE_EXISTED_PERSON;

					clearWindows({effect: "drop", speed: 500, direction: "right"});
					var timer = setInterval(function(){
						if(windowsAnimationOver){
							$("#wizard_new_activity").show("drop", {direction: "left"}, 400);
							clearInterval(timer);
						}
					}, 10);
				break;

			}
		});
	}

	/******************************************************************/

	function clearResults(obj){
		switch(obj.window){
			case "CREATE_NEW_PERSON":
				$("#create_person_block").find("input#person_nickname").val("");
				$("#create_person_block").find("input#person_birthday").val("");
				$("#create_person_block").find("div[data-avatar-type='2']").removeClass("uploaded").addClass("unuploaded").empty();
				$("#create_person_block").find(".avatar.selected").toggleClass("selected unselected");
				$(".colorpicker").simplecolorpicker('selectColor', '#7bd148');
			break;

			case "ADD_FOOD_EVENT":
				$("#food_content").find("input[name='food_amount']").val("");
				$("#food_content").find("input[name='food_duration']").val("");
			break;
		}
	}

	function unselectOthers(obj){
		var selector = "";
		switch(obj.window){
			case "CREATE_NEW_PERSON":
				selector = "#create_person_block";
				break;
			case "CHOOSE_EXISTED_PERSON":
				selector = "#choose_person";
				break;
			case "ADD_EVENT_WIZARD_NEW_ACTIVITY":
				selector = "#wizard_new_activity";
				break;
			case "ADD_DIAPER_EVENT":
				selector = "#diaper_content";
				break;
		}

		$(selector).find(".avatar, .activity, .subactivity_diaper").each(function(index){
				if($(this).hasClass("selected"))
					$(this).toggleClass("selected unselected");
		}); 

	}

	
	function authButtonClickEvent(){
			//authButtonState is situated in "js/realtime-client-utils.js".
			//its undefined by default so we r
			//awaiting until 'rtclient.Authorizer.prototype.authorize' runs out of time ?

			authButtonState = undefined;	
			var timer = setInterval(function(){
				try{
					if (typeof (authButtonState && SnugActivities && SnugBabies && SnugEvents) !== 'undefined'){
						clearInterval(timer);
						switch (authButtonState){
							case "disabled": 
								
								$("#authModal").closeModal({dismissible: false});

								if( $(window).width() > MAX_XSCREEN_RESOLUTION)
									$("link#materialize-link").attr("disabled", "disabled");

								//enabling add event button
								$("#add_event_buttonPC").show(1000);
							break;

							case "enabled":
								
							break;
						}
					}
				}catch(e){}
			}, 10);
	} 

	function dropNextBackBtns(show){
		if (typeof show !== "undefined")
			//return back buttons NEXT and BACK
			$("#bt_body > div").last().show(600);	
		else
			//drop back buttons NEXT and BACK
			$("#bt_body > div").last().hide(600);		
	}

	function addEventButtonClickEvent(){

		$("#add_event_buttonPC").hide(1000);
		
		dropNextBackBtns("show");

		if(mode === BabyTrackMode.NONE){
				switch(initialPage){

					case BabyTrackInitialPage.WELCOME_POST:
						previousWindow = BabyTrackWindows.WELCOME_POST;

						//toggling CREATE_NEW_PERSON mode
						mode = BabyTrackMode.CREATE_NEW_PERSON;

						var $welcome_guide_block = $("#welcome_guide_block");
						
						$welcome_guide_block.fadeOut(500, function(){	
						   		$("#create_person_block").fadeIn(400);
						});
						//--

						break;

					case BabyTrackInitialPage.POSTED_RESULTS_TABLE:
						previousWindow = BabyTrackWindows.POSTED_RESULTS_TABLE;

						//toggling CREATE_NEW_PERSON mode
						mode = BabyTrackMode.CHOOSE_EXISTED_PERSON;

						var $welcome_guide_block = $("#posted_results_table");
						
						$welcome_guide_block.fadeOut(500, function(){
						   		$("#choose_person").fadeIn(400);
						});
						//--

						break;
				}
		}
	}


	function addPersonButtonClickEvent(){

		addPersonButtonPressed = true;

		previousWindow = BabyTrackWindows.CHOOSE_EXISTED_PERSON;
		mode = BabyTrackMode.CREATE_NEW_PERSON;

		//clear all the fields in Create New Person Window
		clearResults({window: "CREATE_NEW_PERSON"});

		clearWindows({effect: "fadeOut", speed: 500});
		var timer = setInterval(function(){
			if(windowsAnimationOver){
				$("#create_person_block").fadeIn(400);
				clearInterval(timer);	
			}
		}, 10);
	}

	function IncorrectInputException(message){
		this.message = message;
		this.name = "Incorrect Input Exception";

		this.toString = function(){
			return this.name + ": " + this.message;
		}
	}

	function ArgumentException(message){
		this.message = message;
		this.name = "Argument Exception";

		this.toString = function(){
			return this.name + ": " + this.message;
		}
	}

	function onEntryClick(self){
		//needToCorrectInputs = true;

		$("#add_event_buttonPC").hide(1000);
		dropNextBackBtns("show");

		previousWindow = BabyTrackWindows.POSTED_RESULTS_TABLE;
		mode = BabyTrackMode.MODIFY_PERSON;	

		clearResults({window: "CREATE_NEW_PERSON"});

		var nickname = $(self).find(".table_baby_name").text();
		var birthday = SnugBabies.get(nickname.toUpperCase()).BIRTHDAY;
		var avatarType = SnugBabies.get(nickname.toUpperCase()).AVATAR.TYPE;
		var color = SnugBabies.get(nickname.toUpperCase()).COLOR_SCHEME; 		//???
		var avatarImg = SnugBabies.get(nickname.toUpperCase()).AVATAR.VALUE;

		$("#create_person_block").find("input#person_nickname").val( nickname );
		$("#create_person_block").find("input#person_birthday").val( birthday );

		//2 lines of code below have to be modified!!!
		if (avatarType == 1)
			$("#create_person_block").find("div[data-avatar-type]").first().attr("data-avatar-type", avatarType.toString());

		if (avatarType == 2)
			$("#create_person_block").find("div[data-avatar-type]").last().attr("data-avatar-type", avatarType.toString());

		$(".colorpicker").simplecolorpicker('selectColor', color); 

		// 4 lines of code below have to be modified!!!
		//if(avatarType == 1){ 
		//	$("#create_person_block").find("div[data-avatar-type='1']").first()
		//		.addClass("selected"); //.toggleClass("selected unselected");
		//}

		if(avatarType == 2)
			$("#create_person_block").find("div[data-avatar-type='2']")
				.toggleClass("uploaded unuploaded")
				.toggleClass("selected unselected")
				.html("<img src='" + avatarImg + "' />");


		current_baby = new SnugBabyPerson(nickname, birthday, color, avatarType, avatarImg);
		current_baby.oldNickname = current_baby.nickname;

		clearWindows({effect: "fadeOut", speed: 500});
		var timer = setInterval(function(){
			if(windowsAnimationOver){
				$("#create_person_block").fadeIn(400);
				clearInterval(timer);
			}
		}, 10);
	}

	var changePseudoElem = (function(style){ 
			var sheet = document.head.appendChild(style).sheet;
			return function(selector, css){
				var propText = Object.keys(css).map(function(p){ 
					return p+":"+css[p]; 
				}).join(";");
				if(propText.search("_") != -1) propText = propText.replace("_", "-");
				sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
			} 
	})(document.createElement("style"));


	function Search(query){
		if(query == null)
			query = "";
		query = $.trim( query );												// eliminating whitespaces in the begining and in the end of $query
		query = query.toLowerCase();											// translate letters to lower case

		var $search_scope = $("#posted_results_table > section");
		var $listOfNames = $search_scope.find("td.table_baby_name");

		$tables = $search_scope.find("table");
		$tables.show();
		
		$listOfNames.each(function(index){
			if( $(this).html().toLowerCase().indexOf(query) == -1)
				$(this).parent().hide();
			else
				$(this).parent().show();
		});

		//normalizing
		var normalize = function(){
			$search_scope.find("table").each(function(index){
				var hiddenTRcount = $(this).find("tbody").children("tr:hidden").length;
				var TRcount = $(this).find("tbody").children("tr").length;
				if ( hiddenTRcount == TRcount )
					$(this).hide();
				else 
					$(this).show();
			});

			var hiddenTableCount = $search_scope.children("table:hidden").length;
			var TableCount = $search_scope.children("table").length;
			
			var newContent = hiddenTableCount == TableCount ? "No relevant results were found...": "";

			changePseudoElem("#posted_results_table > section:after", {
						content: "'" + newContent + "'"
			});
			
		}

		normalize();
	}


	function otherEventsLogic(){

			$( 'input[name="search_field"]' ).change(function(event){
				
				Search($(this).val());

			}).keyup(function(){
				$(this).change();
			});

			$("#add_event_buttonPC").hide();

			$('.timepicker').bind("input change", function() {
				glSubmitTime = $(this).val(); 
			});

			$('.datepicker').bind("input change", function() {
				glSubmitDate = $(this).val(); 
			});

			//establishing default values for radio boxes
			$("#wizard_new_activity").find("section[data-type='activity']:first-child   :radio").prop("checked", true);
			$("#diaper_content").find("section[data-type='subactivity_diaper']:first-child   :radio").prop("checked", true);

			//handling an avatar selection
			//by means of increasing/descreasing an opacity value
			$("#create_person_block").find(".avatar").each(function(index){

				$(this).bind({

					mouseover: function(){
						if( $(this).hasClass("unselected"))
							$(this)
								.stop()
								.animate(200, 0.6);
					},

					mouseout: function(){

						if( $(this).hasClass("unselected"))
							$(this)
								.stop()
								.animate(200, 0.6);
					},

					click: function(){
						unselectOthers({window: "CREATE_NEW_PERSON"}); 
						$(this).toggleClass("selected unselected");
					}

				});
			});


			$("#create_person_block")
				.find("div[data-avatar-type='2']")
				.click(function (event) {
					$(this).next().click();
					event.preventDefault(); // prevent navigation to "#"
				});

	        $("#create_person_block")
				.find("input[type=file]")
				.change(function (){
					if( $(this).prev().hasClass("unuploaded") )
						$(this).prev().toggleClass("uploaded unuploaded");
					else
						$(this).prev().empty();
					handleFiles(this.files);
				});

			$("#search_reset_btn").click(function(){
					$(this).parent().prev().find("input[name=search_field]").val("").trigger( "change" );
			});
			

			$("#add_event_buttonPC").click(addEventButtonClickEvent);
			$("#choose_person").find(".add_person_button").click(addPersonButtonClickEvent);
			$("#authorizeButton").click(authButtonClickEvent);
				    
		    $(".colorpicker").simplecolorpicker({theme: 'regularfont'});

		   	$("#bt_person_profile").on("click", showShareDialog);

	}

	function countFontRate(obj){
		if (typeof obj === 'undefined'){
			throw new ArgumentException("No parameters passed to 'countFontRate' function");
		}

		if (typeof obj.defaultFontSize === 'undefined')
			obj.defaultFontSize = 0;

		if (typeof obj.window === 'undefined')
			obj.window = {handle : window, defaultPartOfWindow: 1, defaultHeight: 511};

		if (typeof obj.window.handle === 'undefined')
			obj.window.handle = window;

		if (typeof obj.window.defaultPartOfWindow === 'undefined')
			obj.window.defaultPartOfWindow = 1;

		if (typeof obj.window.defaultWindowHeight === 'undefined')
			obj.window.defaultWindowHeight = 511;

		var preferredHeight = obj.window.defaultHeight;
		//Base font size for the page
		var fontsize = obj.defaultFontSize;

		var displayHeight = $(obj.window.handle).height() * obj.window.defaultPartOfWindow;
		var percentage = displayHeight / preferredHeight;
		var newFontSize = Math.floor(fontsize * percentage);
		return {
			setRate: function(){
				$(obj.selector).css("font-size", newFontSize);
			},
			fontSize: newFontSize
		}
	}

	function updateMobileStyles(screen){
		//-
			console.log("mobile");
		//-
		$("link#materialize-link").removeAttr('disabled');

		//ap = abbr. auth-page
		var apHeader = "#auth-page-header";                                        
		var apLogo = "#auth-page-logo > object";
		var apSummary = "#auth-page-summary";
		var apAuthBtn = "#authorizeButton";

		//countFontRate(apHeader, 42).setRate();
		countFontRate({
			selector: apHeader,
			defaultFontSize: 42,
			window: { defaultPartOfWindow: 0.22, defaultHeight : 112}
		}).setRate();

		countFontRate({
			selector: apSummary,
			defaultFontSize: 15,
			window: { defaultPartOfWindow: 0.22, defaultHeight : 112}
		}).setRate();

		//$("#authModal").removeClass("laptop").addClass("mobile");
	}

	function updateLaptopStyles(screen){
		//-
			console.log("personal computer");
		//-

		$("link#materialize-link").attr("disabled", "disabled");
		//$("#authModal").removeClass("mobile").addClass("laptop");
	}


	//Activates once a tab had been loaded. Its just like document.onload()
	$(document).ready(function(){

		$("#loading_sign").fadeIn();

		NormalizeWindow = normalize;

		$( window ).bind("resize", function(){
			var updateScreenStyles = $(window).width() <= MAX_XSCREEN_RESOLUTION ? updateMobileStyles : updateLaptopStyles ;
			updateScreenStyles(window);
		}).trigger("resize");

		if ( navigator.appVersion.indexOf("MSIE") != -1) { // if IE and version is greater 9
			if( $.browser.version > 9)
				$('.bs-modal').removeClass('fade');
		}
		
		$("#bt_title_main").click(function(){
			if (mode != BabyTrackMode.NONE){
				if (initialPage == BabyTrackInitialPage.WELCOME_POST)
					openWelcomePostWindowLogic();
				else if (initialPage == BabyTrackInitialPage.POSTED_RESULTS_TABLE)
					openPostedResultsWindowLogic();
			}
		});

		$(".button-collapse").sideNav();

		startGoogleDriveRealtime();
		current_baby = new SnugBabyPerson();
		setNextBackButtonsLogic();
		otherEventsLogic();

		//The timer exists until a list of Baby's Information is found
		var timer_initPage = setInterval(function(){
			if(typeof(SnugActivities && SnugBabies && SnugEvents) !== 'undefined'){

				initialPage = SnugBabies.isEmpty() ? BabyTrackInitialPage.WELCOME_POST : BabyTrackInitialPage.POSTED_RESULTS_TABLE;	
				//initialPage = BabyTrackInitialPage.WELCOME_POST;	
				
				setInitialPage(initialPage, {effect: "fadeIn", speed: 2000}, false);
				
				$("#loading_sign").hide();

				//enabling add event button
				$("#add_event_buttonPC").show(1000);	
				
				normalize({window: BabyTrackWindows.POSTED_RESULTS_TABLE});
				normalize({window: BabyTrackWindows.CHOOSE_EXISTED_PERSON});

				clearInterval(timer_initPage);
			}
		}, 10);

		//The timer exists until a 
		var timer_auth = setInterval(function(){
			try{
				if (typeof authButtonState !== 'undefined'){
					clearInterval(timer_auth);
					switch (authButtonState){
						case "disabled":

							$("#authModal").closeModal({dismissible: false});			
							if( $(window).width() > MAX_XSCREEN_RESOLUTION)
									$("link#materialize-link").attr("disabled", "disabled");
						break;

						case "enabled":
							$("link#materialize-link").removeAttr('disabled');							
							$("#authModal").openModal({dismissible: false});
						break;
					}
				}
			}catch(e){}
		}, 10);

	});


})(jQuery)