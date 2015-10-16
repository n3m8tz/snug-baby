	var SnugActivities, SnugBabies, SnugEvents;

	var MAX_XSCREEN_RESOLUTION = 601;
	var MAX_YSCREEN_RESOLUTION = 450;

	var NormalizeWindow = function(){};
	
	var selectBabyWindow;
	var removeBabyWindow;
	var glSubmitTime = "";   //gl == global
	var glSubmitDate = "";   

	var windowsAnimationOver = false;

	var MAX_PAGE_AMOUNT_COUNT = 8;
	var current_baby;
	var needToCorrectInputs = false;

	var currentBrowser = {
		OPERA: !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
		FIREFOX : typeof InstallTrigger !== 'undefined',
		SAFARI: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
		CHROME: !!window.chrome && !(!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0), 
		IE : false || !!document.documentMode
	}

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
		REMOVE_EXISTED_PERSON: 5,
		ADD_FOOD_EVENT: 6,
		ADD_DIAPER_EVENT: 7,
		ADD_SLEEP_EVENT: 8,
		MODIFY_PERSON: 9
	}

	var BabyTrackWindows = {
		NONE: 0,
		WELCOME_POST: 1,
		POSTED_RESULTS_TABLE: 2,
		CREATE_NEW_PERSON: 3,
		ADD_EVENT_WIZARD_NEW_PERSON: 4,
		ADD_EVENT_WIZARD_NEW_ACTIVITY: 5,
		CHOOSE_EXISTED_PERSON: 6,
		REMOVE_EXISTED_PERSON: 7,
		ADD_FOOD_EVENT: 8,
		ADD_DIAPER_EVENT: 9,
		ADD_SLEEP_EVENT: 10
	}

	var DeviceType = { MOBILE: 0, COMPUTER: 1}

	var currentDeviceType = DeviceType.MOBILE;

	var mode = BabyTrackMode.NONE;
	var initialPage;
	var previousWindow = BabyTrackWindows.NONE;