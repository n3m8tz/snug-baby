	var Snug_Babies = {};

	var BabyTrackInitialPage = {
		NONE: 0,
		WELCOME_POST: 1,
		POSTED_RESULTS_TABLE: 2
	}

	var BabyTrackMode = {
		NONE: 0,
		CREATE_NEW_PERSON: 1,
		ADD_EVENT_WIZARD_NEW_PERSON: 2,
		ADD_EVENT_WIZARD_NEW_ACTIVITY: 3,
		CHOOSE_EXISTED_PERSON: 4,
		ADD_FOOD_EVENT: 5,
		ADD_DIAPER_EVENT: 6
	}

	var BabyTrackWindows = {
		NONE: 0,
		WELCOME_POST: 1,
		POSTED_RESULTS_TABLE: 2,
		CREATE_NEW_PERSON: 3,
		ADD_EVENT_WIZARD_NEW_PERSON: 4,
		ADD_EVENT_WIZARD_NEW_ACTIVITY: 5,
		CHOOSE_EXISTED_PERSON: 6,
		ADD_FOOD_EVENT: 7,
		ADD_DIAPER_EVENT: 8
	}

	var mode = BabyTrackMode.NONE;
	var initialPage;
	var previousWindow = BabyTrackWindows.NONE;
	//var currentWindow; // DOM object

	var windowsAnimationOver = false;

	var MAX_PAGE_AMOUNT_COUNT = 8;
	var current_baby;
	var date;
	var needToCorrectInputs = false;

(function($, undefined){

	function SnugBabyPerson(nickname, birthday, avatarType, color, avatarImg){
		this.nickname = nickname;
		this.birthday = birthday;
		this.avatarType = avatarType;
		this.color = color;
		this.avatarImg = avatarImg;
	}

	SnugBabyPerson.prototype.toString = function() {
		return "{nickname: '" + this.nickname +
			 "', birthday: '" + this.birthday +
			 "', avatarType: '" + this.avatarType +
			 "', color: '" + this.color + "'}";
	};

	SnugBabyPerson.prototype.submit = function(){

		if (typeof listDemo === 'undefined')
			return false;

		listDemo.push(this);
		Snug_Babies = listDemo.asArray();
	}

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
						.html(self.avatarImg);

					//making the border around the default avatar
					if (self.avatarType == "type1")
						$(selector)
							.find("tr.table_row_baby_data")
							.last()
							.find("td.table_avatar *")
							.css("border", "thin solid #E93578");

					if (self.avatarType == "type2")
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
						.html( self.activityImg );

					$(selector)
						.find("tr.table_row_baby_data")
						.last()
						.find("td.table_feed_time")
						.text(self.submitTime);

					$(selector)
						.find("tr.table_row_baby_data")
						.last()
						.find("td.table_notes")
						.text( self.notes );

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


	function handleFiles(files) {

	    var file = files[0];
	    var imageType = /image.*/;

	    if (!file.type.match(imageType) || files.length != 1) {
	      return;
	    }

	    var img = document.createElement("img");
	    img.classList.add("obj");
	    img.file = file;
	    $("#create_person_block").find("div[data-avatar-type='type3']").append(img); // Assuming that "preview" is a the div output where the content will be displayed.

	    var reader = new FileReader();
	    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
	    reader.readAsDataURL(file);
	}


	function IncorrectInputException(message){
		this.message = message;
		this.name = "Incorrect Input Exception";

		this.toString = function(){
			return this.name + ": " + this.message;
		}
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

							$("#welcome_guide_block > section > p ~ img")
								.stop()
								.animate({
									"opacity": 1,
								}, 500);
							break;

						case "mouseout":

							$("#welcome_guide_block > section > p ~ img")
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

				var $checked_activity = $("#wizard_new_activity   input[type='radio']:checked");
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

	function foodWindowLogic(){

		mode = BabyTrackMode.ADD_FOOD_EVENT;
		previousWindow = BabyTrackWindows.ADD_EVENT_WIZARD_NEW_ACTIVITY;

		var nickname = (current_baby.nickname !== '') ?  current_baby.nickname : "a baby";

		$("#food_content").find("h1").replaceWith("<h1>What and how much did "+ nickname +" eat?</h1>");

		$("#food_content > section > div > section[data-type='subactivity_food']")
			.click(function(){

				unselectOthers({window: "ADD_FOOD_EVENT"});
				$(this).find("div.subactivity_food").toggleClass("selected unselected");
				$(this).find("input[type=radio]").prop("checked", true);
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

	function normalize(obj){
		switch(obj.window){
			case BabyTrackWindows.CREATE_NEW_PERSON:
			break;

			case BabyTrackWindows.POSTED_RESULTS_TABLE:
				if(!$.isEmptyObject(Snug_Babies)){		//if there any information about baby's in the database
					//openChoosePersonWindow();
					Snug_Babies.forEach(function(baby){

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
							.find("table tr.table_row_baby_data")
							.last()
							.find("td.table_avatar")
							.html(baby.avatarImg);

						//making the border around the default avatar
						if (baby.avatarType == "type1")
							$(selector)
								.find("table tr.table_row_baby_data")
								.last()
								.find("td.table_avatar *")
								.css("border", "thin solid #E93578");

						if (baby.avatarType == "type2")
							$(selector)
								.find("table tr.table_row_baby_data")
								.last()
								.find("td.table_avatar *")
								.css("border", "thin solid #3B1D8F");

						$(selector)
							.find("table tr.table_row_baby_data")
							.last()
							.find("td.table_baby_name")
							.text(baby.nickname);

						$(selector)
							.find("table tr.table_row_baby_data")
							.last()
							.find("td.table_baby_activity")
							.html(baby.activityImg );

						$(selector)
							.find("table tr.table_row_baby_data")
							.last()
							.find("td.table_feed_time")
							.text(baby.submitTime);

						$(selector)
							.find("table tr.table_row_baby_data")
							.last()
							.find("td.table_notes")
							.text(baby.notes );

						$(selector)
							.find("table tr.table_row_baby_data")
							.last()
							.css({ "border-color": baby.color})
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
					});
				}
			break;

			case BabyTrackWindows.ADD_EVENT_WIZARD_NEW_PERSON:
			break;

			case BabyTrackWindows.ADD_EVENT_WIZARD_NEW_ACTIVITY:
			break;

			case BabyTrackWindows.CHOOSE_EXISTED_PERSON:
					if(!$.isEmptyObject(Snug_Babies)){		//if there any information about baby's in the database
						//openChoosePersonWindow();
						$("#choose_person").find(".add_person_button").prevAll().empty();
						Snug_Babies.forEach(function(_current_baby){
							current_baby = _current_baby;

							var newPersonAvatar = 	"<section data-type='avatar'>"+
								"<div>"+
									"<div class = 'avatar selected' data-avatar-type="+ current_baby.avatarType +">"+
										current_baby.avatarImg+
									"</div>"+
									
									"<label>"+
										"<input type='radio' name='avatar_radio'/>"+
										current_baby.nickname +
									"</label>"+
								"</div>"+
							"</section>";
							var pageAvatarCount = $("#choose_person > section > div > section").length;
							if( pageAvatarCount == MAX_PAGE_AMOUNT_COUNT)
								$("#choose_person > section > div").css({"overflow-y": "scroll"});
							
							$("#choose_person > section > div").find(".add_person_button").before( newPersonAvatar );

							var $lastAvatarInList = $("#choose_person").find("section[data-type='avatar']").last();

							$lastAvatarInList
								.click(function(){

									unselectOthers({window: "CHOOSE_EXISTED_PERSON"}); 
									$(this).find("div.avatar").toggleClass("selected unselected");
									$(this).find("input[type=radio]").prop("checked", true);
								})
								.dblclick(function(event){
									$(this).hide(500,function(){																	
										if( !$.isEmptyObject( $(this).prev()[0] )){														//if previous exists
											if( $(this).find("label > input[type=radio]").is(":checked")){
												$(this).prev().find("div > div[data-avatar-type]").toggleClass("selected unselected");
												$(this).prev().find("label > input[type=radio]").prop("checked", true);
											}
										}else{
											if( $(this).find("label > input[type=radio]").is(":checked")){
												var $nextSibling = $("#choose_person > section > div > .add_person_button").prev();
												if( !$.isEmptyObject( $(this).next()[0]) ){
													$(this).next().find("div > div[data-avatar-type]").toggleClass("selected unselected");
													$(this).next().find("label > input[type=radio]").prop("checked", true);
												}
											}
										}
										$(this).remove();
									});
								})
								.find("input[type=radio]").prop("checked", true);
						});

						$("#choose_person").find("section[data-type='avatar']").each(function(index){
							$avatarImg = $(this).find("div[data-avatar-type]");
							if($avatarImg.data("avatar-type") == "type3"){
								$avatarImg.addClass("uploaded");
							}
						});

						unselectOthers({window: "CHOOSE_EXISTED_PERSON"}); 
						$("#choose_person").find("section[data-type='avatar']").first().find("div.avatar").toggleClass("selected unselected");
						$("#choose_person").find("section[data-type='avatar']").first().find("input[type=radio]").prop("checked", true);
					}
					

					
			break;

			case BabyTrackWindows.ADD_FOOD_EVENT:
			break;

			case BabyTrackWindows.ADD_DIAPER_EVENT:
			break;
		}
	}

	function diaperWindowLogic(){

		mode = BabyTrackMode.ADD_DIAPER_EVENT;
		previousWindow = BabyTrackWindows.ADD_EVENT_WIZARD_NEW_ACTIVITY;


		//setting the default value for the element if it's undefined
		var nickname = (current_baby.nickname !== '') ?  current_baby.nickname : "a baby";

		$("#diaper_content").find("h1").replaceWith("<h1>"+ nickname +"'s Diaper Content!</h1>");

		$("#diaper_content > section > div > section[data-type='subactivity_diaper']")
					.click(function(){

						unselectOthers({window: "ADD_DIAPER_EVENT"});
						$(this).find("div.subactivity_diaper").toggleClass("selected unselected");
						$(this).find("input[type=radio]").prop("checked", true);
					});

		clearWindows({effect: "drop", speed: 500, direction: "left"});
		var timer = setInterval(function(){
			if(windowsAnimationOver){
				$("#diaper_content").show("drop", {direction: "right"}, 400);
				clearInterval(timer);
			}
		}, 10);
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

			var nickname = $("#create_person_block  input#person_nickname").val();
			var birthday = $("#create_person_block  input#person_birthday").val();
			var avatarType =  $("#create_person_block  .avatar.selected").attr("data-avatar-type");
			var color = $('select[name="colorpicker-regularfont"] + span > span[data-selected]').data("color");

		
			
			var $prevSibling = $("#choose_person > section > div > .add_person_button").prev();
			if( $.isEmptyObject($prevSibling[0]) ||
				!needToCorrectInputs ){

				$prevSibling.find("div > div[data-avatar-type]").toggleClass("selected unselected");
				$prevSibling.find("label > input[type=radio]").prop("checked", false);

				var newPersonAvatar = 	"<section data-type='avatar'>"+
											"<div>"+
												"<div class = 'avatar selected' data-avatar-type="+ avatarType +">"+
													"<img src='"+( avatarType == "type1" ? "images/avatar-type1.png":"images/avatar-type2.png" )+"' />"+
												"</div>"+

												"<label>"+
													"<input type='radio' name='avatar_radio'/>"+
													nickname +
												"</label>"+
											"</div>"+
										"</section>";

				var pageAvatarCount = $("#choose_person > section > div > section").length;

				if( pageAvatarCount == MAX_PAGE_AMOUNT_COUNT)
					$("#choose_person > section > div").css({"overflow-y": "scroll"});

				$("#choose_person > section > div > .add_person_button").before( newPersonAvatar );

				if( avatarType === "type3")
					$("#choose_person > section > div > section[data-type='avatar']")
						.last()
						.find("div[data-avatar-type='type3']")
						.html(	$("#create_person_block").find("div.avatar[data-avatar-type='type3']").html() )
						.addClass("uploaded");

				unselectOthers({window: "CHOOSE_EXISTED_PERSON"});

				$("#choose_person").find("section[data-type='avatar']")
					.last()
					.click(function(){

						unselectOthers({window: "CHOOSE_EXISTED_PERSON"});
						$(this).find("div.avatar").toggleClass("selected unselected");
						$(this).find("input[type=radio]").prop("checked", true);
					})
					.dblclick(function(event){
						$(this).hide(500,function(){
							if( !$.isEmptyObject( $(this).prev()[0] )){														//if previous exists
								if( $(this).find("label > input[type=radio]").is(":checked")){
									$(this).prev().find("div > div[data-avatar-type]").toggleClass("selected unselected");
									$(this).prev().find("label > input[type=radio]").prop("checked", true);
								}
							}else{
								if( $(this).find("label > input[type=radio]").is(":checked")){
									var $nextSibling = $("#choose_person > section > div > .add_person_button").prev();
									if( !$.isEmptyObject( $(this).next()[0]) ){
										$(this).next().find("div > div[data-avatar-type]").toggleClass("selected unselected");
										$(this).next().find("label > input[type=radio]").prop("checked", true);
									}
								}
							}
							$(this).remove();
						});
					})
					.find("label > input[type=radio]")
					.prop("checked", true)
					
					$("#choose_person").find("section[data-type='avatar']")
					.last()
					.find("div.avatar")
					.toggleClass("selected unselected");

			}else{
				//if recently created

				needToCorrectInputs = false;
				$prevSibling.find("div[data-avatar-type]").attr("data-avatar-type", avatarType);
				$prevSibling.find("label").html("<input type='radio' name='avatar_radio'/>" + nickname);
				$prevSibling.find("div[data-avatar-type]").html( $("#create_person_block").find("div.avatar.selected[data-avatar-type]").html() );
				$prevSibling.find("label input[type='radio']").prop("checked", true);
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

			$('#diaper_content').find(".subactivity_diaper[data-diaper-type='peed'] > img").attr("src", "images/pee.png");
			$('#diaper_content').find(".subactivity_diaper[data-diaper-type='pooped'] > img").attr("src", "images/poop.png");

			//this part executes as long as the whole data is full
			//and everything is specified

			createCurrentBabyToSnug();

			mode = BabyTrackMode.ADD_EVENT_WIZARD_NEW_ACTIVITY;
			previousWindow = BabyTrackWindows.CHOOSE_EXISTED_PERSON;

			//setting the default value for the element if it's undefined
			var nickname = (current_baby.nickname !== '') ?  current_baby.nickname : "a baby";

			$("#wizard_new_activity").find("h1").replaceWith("<h1>Choose an activity for "+ nickname +"</h1>");

			$("#wizard_new_activity > section > div > section[data-type='activity']")
						.click(function(){

							unselectOthers({window: "ADD_EVENT_WIZARD_NEW_ACTIVITY"});
							$(this).find("div.activity").toggleClass("selected unselected");
							$(this).find("input[type=radio]").prop("checked", true);
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

			var $checked_activity = $("#wizard_new_activity   input[type='radio']:checked");
			var $data_diaper_type = $checked_activity.parent().prev().attr("data-activity-type");

			date = new SnugBabyDayTime();

			$("#diaper_content, #food_content")
				.find("input.datepicker")
				.val(date.shortMonth + ", " + date.year);

			$("#diaper_content, #food_content")
				.find("input.timepicker")
				.val(date.time);

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

		try{

			switch(mode){

				case BabyTrackMode.ADD_FOOD_EVENT:
					checkCorrectInputAndSubmit({window: "ADD_FOOD_EVENT"});
					break;

				case BabyTrackMode.ADD_DIAPER_EVENT:
					checkCorrectInputAndSubmit({window: "ADD_DIAPER_EVENT"});
					break;
			}

		}catch(e){
			alert(e.toString());
			return;
		}

		$("#add_event_button").show(1000);

		//get rid of buttons NEXT and BACK
		$("#bt_body > div").last().hide(600);

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

	function createCurrentBabyToSnug(){
		var nickname =	$("#choose_person input[type='radio']:checked").parent().text();								//should be loaded from a server
		var birthday = $("#create_person_block  input#person_birthday").val();											//should be loaded from a server
		var avatarType =  $("#choose_person  .avatar.selected").attr("data-avatar-type");								//should be loaded from a server
<<<<<<< HEAD
		var color =  $('select[name="colorpicker-regularfont"] + span > span[data-selected]').data("color");			//should be loaded from a server. 
	 	var avatarImg = $("section[data-type='avatar']").find("div.avatar.selected").html();
		current_baby = new SnugBabyPerson(nickname, birthday, avatarType, color, avatarImg);
=======
		var color =  $('select[name="colorpicker-regularfont"] + span > span[data-selected]').data("color");			//should be loaded from a server.

		current_baby = new SnugBabyPerson(nickname, birthday, avatarType, color);
>>>>>>> origin/gh-pages
	}

	function checkCorrectInputAndSubmit( object ){
		switch( object.window ){

			case "CREATE_NEW_PERSON":
				var nickname = $("#create_person_block  input#person_nickname").val();
				var birthday = $("#create_person_block  input#person_birthday").val();
				var $avatar =  $("#create_person_block  .avatar.selected");
				var color = $('select[name="colorpicker-regularfont"] + span > span[data-selected]').data("color");

				if( nickname === "")
					throw new IncorrectInputException( "Nickname is not specified!" );
				else if( birthday === "")
					throw new IncorrectInputException( "Birthday is not specified!" );
				else if( $.isEmptyObject( $avatar[0] ) )
					throw new IncorrectInputException( "Avatar is not specified!" );
				break;

			case "CHOOSE_EXISTED_PERSON":
				var $avatar_checked_radio = $("#choose_person input[type='radio']:checked");
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
				var $diaper_checked_radio = $("#diaper_content input[type='radio']:checked");
				if( $diaper_checked_radio.length == 0 )												//if not exists
					throw new IncorrectInputException( "Diaper type is not selected!" );
				break;

			case "ADD_EVENT_WIZARD_NEW_ACTIVITY":
				var $activity_checked_radio = $("#wizard_new_activity input[type='radio']:checked");
				if( $activity_checked_radio.length == 0 )											//if not exists
					throw new IncorrectInputException( "Activity is not selected!" );
				break;
		}
	}

<<<<<<< HEAD
	//The function is used to get rid of major (not popup and dropdown!!!) 
	//windows as only one major (not popup and dropdown!!!) window may be 
=======
	function submitChangesToGoogleDrive(){

		var info = {};

		info['nickname'] = current_baby.nickname;
		info['birthday'] = current_baby.birthday;
		info['avatarType'] = current_baby.avatarType;
		info['color'] = current_baby.color;
		info['date'] = $(".datepicker").val();
		info['time'] = date.time;

		if (typeof listDemo === undefined)
			return false;

		listDemo.push(info);
	}

	//The function is used to get rid of major (not popup and dropdown!!!)
	//windows as only one major (not popup and dropdown!!!) window may be
>>>>>>> origin/gh-pages
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
			case "food":
				var food_amount = $("#food_content").find("input[name=food_amount]").val();
				var food_duration = $("#food_content").find("input[name=food_duration]").val();

				if (food_amount !== ""	&&	food_duration !== "")
					notes = food_amount + "ml in " + food_duration + " minutes";

				if (food_amount !== ""	&& 	food_duration === "")
					notes = food_amount + "ml";

				if (food_amount === ""	&& 	food_duration !== "")
					notes = food_duration + " minutes";
				break;


			case "diaper":
				var diaperType = $("#diaper_content").find(".subactivity_diaper.selected").attr("data-diaper-type");
				notes = (diaperType == "peed") ?  "Peed" : "Pooped" ;
				break;
		}

		return notes;
	}

	/****** Main Logic for buttons Next and Back in Back Traker *******/

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

				case BabyTrackMode.ADD_FOOD_EVENT:
					current_baby.activityImg = "<img src = 'images/bottle.png' />";
					current_baby.activity = "food";
					current_baby.notes  = getDefaultNotes("food");

					current_baby.submitDate = $(".datepicker").val();
					current_baby.submitTime = $(".timepicker").val();
					current_baby.addToTable( $("#posted_results_table").find("table").html() );
					current_baby.submit();

					openPostedResultsWindowLogic();
					break;

				case BabyTrackMode.ADD_DIAPER_EVENT:
					current_baby.activityImg = $("#diaper_content").find(".subactivity_diaper.selected[data-diaper-type]").html();
					current_baby.activity = "diaper";
					current_baby.notes = getDefaultNotes("diaper");
					
					current_baby.submitDate = $(".datepicker").val();
					current_baby.submitTime = $(".timepicker").val();
					current_baby.addToTable( $("#posted_results_table").find("table").html() );
					current_baby.submit();

					openPostedResultsWindowLogic();
					break;

			}
		});


		$(document).on("click", ".button.back", function(){
			switch(previousWindow){

				case BabyTrackWindows.NONE:
				break;

				case BabyTrackWindows.WELCOME_POST:
					$("#add_event_button").show(1000);

					//get rid of buttons NEXT and BACK
					$("#bt_body > div").last().hide(600);

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

				break;

				case BabyTrackWindows.POSTED_RESULTS_TABLE:
					$("#add_event_button").show(1000);

					//get rid of buttons NEXT and BACK
					$("#bt_body > div").last().hide(600);

					initialPage = BabyTrackInitialPage.POSTED_RESULTS_TABLE;
					previousWindow = BabyTrackWindows.NONE;
					mode = BabyTrackMode.NONE;

					clearWindows({effect: "fadeOut", speed: 800});	//asynchronous function

					//awaiting until other animation processes stop
					//as clearWindows function is asynchronous

					var timer = setInterval(function(){
						if(windowsAnimationOver){
							setInitialPage(initialPage, {effect: "drop", speed: 500}, true);
							clearInterval(timer);

							//clear all the fields in Create New Person Window
							clearResults({window: "CREATE_NEW_PERSON"});
						}
					}, 10);
				break;

				case BabyTrackWindows.CREATE_NEW_PERSON:
					needToCorrectInputs = true;
					previousWindow = BabyTrackWindows.WELCOME_POST;
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
				$("#create_person_block  input#person_nickname").val("");
				$("#create_person_block  input#person_birthday").val("");
				$("#create_person_block  div[data-avatar-type='type3']").removeClass("uploaded").addClass("unuploaded").empty();
				$("#create_person_block  .avatar.selected").toggleClass("selected unselected");
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
					if (typeof authButtonState !== 'undefined' && typeof listDemo !== 'undefined'){
						clearInterval(timer);
						switch (authButtonState){
							case "disabled": 
								$("#authModal").modal("hide");
								//enabling add event button
								$("#add_event_button").show(1000);
							break;

							case "enabled":
								
							break;
						}
					}
				}catch(e){}
			}, 10);
	} 



	function addEventButtonClickEvent(){

		$("#add_event_button").hide(1000);

		//return back buttons NEXT and BACK
		$("#bt_body > div").last().show(600);

<<<<<<< HEAD
		if(mode === BabyTrackMode.NONE){
				switch(initialPage){
=======
				click: function(){
					unselectOthers({window: "CREATE_NEW_PERSON"});
					$(this).toggleClass("selected unselected");
				}
>>>>>>> origin/gh-pages

					case BabyTrackInitialPage.WELCOME_POST:
						previousWindow = BabyTrackWindows.WELCOME_POST;

						//toggling CREATE_NEW_PERSON mode
						mode = BabyTrackMode.CREATE_NEW_PERSON;

<<<<<<< HEAD
						var $welcome_guide_block = $("#welcome_guide_block");
						
						$welcome_guide_block.fadeOut(500, function(){	
						   		$("#create_person_block").fadeIn(400);
						});
						//--
=======
		$("#create_person_block")
          .find("div[data-avatar-type='type3']")
          .click(function (e) {
             $(this)
				.next()
				.click();
				e.preventDefault(); // prevent navigation to "#"
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

		$("#bt_search_engine_area > span").last().click(function(){
				$(this)
					.prev()
					.find("input[name=search_field]")
					.val("");
		});
>>>>>>> origin/gh-pages

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


<<<<<<< HEAD
	function addPersonButtonClickEvent(){
=======
							var $welcome_guide_block = $("#welcome_guide_block");

							$welcome_guide_block.fadeOut(500, function(){
							   		$("#create_person_block").fadeIn(400);
							});
							//--
>>>>>>> origin/gh-pages

		addPersonButtonPressed = true;

		previousWindow = BabyTrackWindows.CHOOSE_EXISTED_PERSON;
		mode = BabyTrackMode.CREATE_NEW_PERSON;

<<<<<<< HEAD
		clearWindows({effect: "fadeOut", speed: 500});
		var timer = setInterval(function(){
			if(windowsAnimationOver){
				$("#create_person_block").fadeIn(400);
				clearInterval(timer);
=======
							//toggling CREATE_NEW_PERSON mode
							mode = BabyTrackMode.CHOOSE_EXISTED_PERSON;

							var $welcome_guide_block = $("#posted_results_table");

							$welcome_guide_block.fadeOut(500, function(){
							   		$("#choose_person").fadeIn(400);
							});
							//--
>>>>>>> origin/gh-pages

				//clear all the fields in Create New Person Window
				clearResults({window: "CREATE_NEW_PERSON"});
			}
		}, 10);
	}




<<<<<<< HEAD
	$(function(){

		startGoogleDriveRealtime();
		current_baby = new SnugBabyPerson();
		setNextBackButtonsLogic();
		otherEventsLogic();

		//The timer exists until a list of Baby's Information is found
		var timer_initPage = setInterval(function(){
			if(typeof listDemo !== 'undefined'){
				
				Snug_Babies = listDemo.asArray();
				initialPage = $.isEmptyObject(Snug_Babies) ? BabyTrackInitialPage.WELCOME_POST : BabyTrackInitialPage.POSTED_RESULTS_TABLE;	
				setInitialPage(initialPage, {effect: "fadeIn"}, false);
				normalize({window: BabyTrackWindows.POSTED_RESULTS_TABLE});
				normalize({window: BabyTrackWindows.CHOOSE_EXISTED_PERSON});
				clearInterval(timer_initPage);
			}
		}, 10);
=======
							//clear all the fields in Create New Person Window
							clearResults({window: "CREATE_NEW_PERSON"});
						}
					}, 10);

		});


	    $('select[name="colorpicker-regularfont"]').simplecolorpicker({theme: 'regularfont'});

		$("#authorizeButton").click(function(){
			clearInterval(timer);
			authButtonState = undefined;
			var timer = setInterval(function(){
				try{
					if (authButtonState !== undefined){
						switch (authButtonState){
							case "disabled":
								$("#authModal").modal("hide");
								//enabling add event button
								$("#add_event_button").show(1000);
							break;

							case "enabled":

							break;
						}
						clearInterval(timer);
					}
				}catch(e){}
			}, 10);
		});
>>>>>>> origin/gh-pages

		//The timer exists until a 
		var timer_auth = setInterval(function(){
			try{
				if (typeof authButtonState !== 'undefined'){
					clearInterval(timer_auth);
					switch (authButtonState){
						case "disabled":
							//enabling add event button
							$("#add_event_button").show(1000);	
														
						break;

						case "enabled":
							$("#authModal").modal("show");
						break;
					}
				}
			}catch(e){}
		}, 10);

		
	});

<<<<<<< HEAD
	function otherEventsLogic(){

			$("#add_event_button").hide();

			//establishing default values for radio boxes
			$("#wizard_new_activity    section[data-type='activity']:first-child   input[type=radio]").prop("checked", true);
			$("#diaper_content    section[data-type='subactivity_diaper']:first-child   input[type=radio]").prop("checked", true);

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
				.find("div[data-avatar-type='type3']")
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

			$("#bt_search_engine_area > span").last().click(function(){
					$(this).prev().find("input[name=search_field]").val("");
			});
			

			$("#add_event_button").click(addEventButtonClickEvent);
			$("#choose_person").find(".add_person_button").click(addPersonButtonClickEvent);
			$("#authorizeButton").click(authButtonClickEvent);
				    
		    $('select[name="colorpicker-regularfont"]').simplecolorpicker({theme: 'regularfont'});

	}

})(jQuery)

=======
})(jQuery)
>>>>>>> origin/gh-pages
