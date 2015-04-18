var TableRow = (function(){
	// *****************************************************
	// PRIVATE FUNCTIONS
	// *****************************************************
	var init = function(_entryId){
		var _newentry = document.createElement("tr");
		_newentry.setAttribute("id", _entryId);
		_newentry.setAttribute("class", "table_row_baby_data");
		_newentry.innerHTML = 
					'<td class="table_avatar"></td>' +
					'<td class="table_baby_name">Name</td>' +
					'<td class="table_baby_activity">Activity</td>' +
					'<td class="table_feed_time">Time</td>' +
					'<td class="table_notes">Notes</td>';
		return _newentry;
	}

	//CONSTRUCTOR
	function TableRow(entryId){

		// *****************************************************
		// PUBLIC PROPERTIES
		// ***************************************************** 
		this.value = (typeof entryId !== "undefined") ? init(entryId) : "undefined";

		// *****************************************************
		// PRIVILEGED METHODS.
		// MAY BE INVOKED PUBLICLY AND MAY ACCESS PRIVATE ITEMS 
		// *****************************************************
		
	}

	return TableRow;
})();



var Table = (function(){
	// *****************************************************
	// PRIVATE FUNCTIONS
	// *****************************************************
	var init = function(tableId){
		var table = document.createElement("table");
		table.id = tableId;
		table.innerHTML =
						'<caption> </caption>'+
						'<tbody> </tbody>';
		return table;
	}

	//CONSTRUCTOR
	function Table(tableId){
		// *****************************************************
		// PRIVATE VARIABLES 
		// ***************************************************** 
		var currentEntry = new TableRow();
		
		// *****************************************************
		// PUBLIC PROPERTIES
		// ***************************************************** 
		this.value = (typeof tableId !== "undefined") ? init(tableId) : "undefined";

		// *****************************************************
		// PRIVILEGED METHODS.
		// MAY BE INVOKED PUBLICLY AND MAY ACCESS PRIVATE ITEMS 
		// *****************************************************
		this.getCurrentEntry = function(){
			return currentEntry.value;
		};

		this.fillEntry = function(_entryValue, _avatar, _activity, _name, _notes, _time){
			currentEntry.value = _entryValue;
			currentEntry.value.getElementsByClassName("table_avatar")[0].innerHTML = "<img src='" + _avatar + "' />";
			currentEntry.value.getElementsByClassName("table_baby_name")[0].innerHTML = _name;
			currentEntry.value.getElementsByClassName("table_baby_activity")[0].innerHTML = "<img src='" + _activity + "' />";
			currentEntry.value.getElementsByClassName("table_feed_time")[0].innerHTML = _time;
			currentEntry.value.getElementsByClassName("table_notes")[0].innerHTML = _notes;
		}

		this.insertEntry = function(_location, _entryValue, _avatar, _activity, _name, _notes, _time){
			this.fillEntry(_entryValue, _avatar, _activity, _name, _notes, _time);
			var tbody = this.value.getElementsByTagName("tbody")[0];
			var row;

			var element = parseInt(currentEntry.value.getAttribute("id").replace("_", ""), 10);

			if(tbody.rows.length === 0)
				row = tbody.insertRow(tbody.rows.length - 1);
			else
				row = tbody.insertRow(_location);

			row.setAttribute("id", currentEntry.value.getAttribute("id"));
			row.setAttribute("class", currentEntry.value.getAttribute("class"));

			row.innerHTML = currentEntry.value.innerHTML;		
		}
	}

	Table.prototype.findEntry = function(_entryId){
		return this.value.querySelector("#"+_entryId);
	}

	Table.prototype.setCaption = function(_caption){
		var caption = this.value.getElementsByTagName("caption")[0];
		caption.innerText = _caption;
	}

	return  Table;
})();
















