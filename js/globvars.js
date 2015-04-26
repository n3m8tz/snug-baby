	var SnugActivities, SnugBabies, SnugEvents;

	var glSubmitTime = "";   //gl == global
	var glSubmitDate = "";   

	var windowsAnimationOver = false;

	var MAX_PAGE_AMOUNT_COUNT = 8;
	var current_baby;
	var needToCorrectInputs = false;

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
		ADD_DIAPER_EVENT: 6,
		MODIFY_PERSON: 7
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