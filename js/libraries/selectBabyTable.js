
var SelectBabyWindow = (function(){

	var initDOM = function(windowId){
		var _parentSection = document.createElement("section");
		_parentSection.setAttribute("id", windowId);

		var _childSection = document.createElement("section");
		_parentSection.appendChild(_childSection);

		return _parentSection;
	}

	var createBabyButton = function(parent, buttonClass){
		var button = document.createElement("div");
		button.setAttribute("class", buttonClass);
		var wrapper = document.createElement("div");
		var image = document.createElement("img");
		image.setAttribute("src", "images/create_baby_button.png");

		wrapper.appendChild(image);
		button.appendChild(wrapper);
		parent.appendChild(button);
	}

	var addBabyBlock = function(baby, index, _animateShow, _windowId, _selectBabyRadioPrefix){
		var animateShow = false;
		if(_animateShow) animateShow = true;

		var hiddenProperty = animateShow ? "prop--hidden" : "";

		var _blockStructure = [
			'<div data-baby-name="' + baby.name.toUpperCase() + '" class="image-grid-block ' + hiddenProperty + '" >',
				'<div class="image-grid-block-content">',
					'<label for="'+ _selectBabyRadioPrefix + "-" + index + '">',
						'<div class="image-grid-block-text">' + baby.name + '</div>',
						'<img src="' + baby.avatarSrc + '" />',
						'<input id="' + _selectBabyRadioPrefix + "-" + index + '" name="' + _selectBabyRadioPrefix +'" type="radio" value="' + index + '" />',
					'</label>',
				'</div>',
			'</div>'
		].join('');

		var subsectionSelector = '#' + _windowId + ' > section';
		var parent = document.querySelector(subsectionSelector);

		if(parent){
			parent.innerHTML += _blockStructure;

			if(animateShow)
				//code below will be replaced with a new one later on;
				if($) 
					$(parent).find("[data-baby-name = '" + baby.name.toUpperCase()+"']").removeClass("prop--hidden");
		}
	}

	var removeElement = function(element) {
		element && element.parentNode && element.parentNode.removeChild(element);
	}

	function SelectBabyWindow(initStruct){

		var temporaryBabies = new Array();
		var windowId = "select_baby_table_mobile";
		var selectBabyRadioPrefix = "select-baby-radio";
		var needCreateBabyButton = true;
		var createBabyButtonClass = "create_baby_button_mobile";

		var snugBabies = new Array();
		var babiesContainer = new Array();

		if (initStruct !== undefined){
			windowId = (typeof initStruct.id !== "undefined") ? initStruct.id : windowId;
			selectBabyRadioPrefix = (typeof initStruct.selectBabyRadioPrefix !== "undefined") ? initStruct.selectBabyRadioPrefix : selectBabyRadioPrefix;
			needCreateBabyButton = (typeof initStruct.createBabyButton !== "undefined") ? initStruct.createBabyButton : needCreateBabyButton;
		}
		
		this.value = initDOM(windowId);

		if(needCreateBabyButton) createBabyButton(this.value, createBabyButtonClass);

		this.insertInto = function(handle){
			document.querySelector(handle).appendChild(this.value);
		}

		this.getBabiesCount = function(){
			return babiesContainer.length;
		}

		this.addBaby = function(_name, _avatarSrc, _animateShow){
			var infoAboutBaby = { name: _name,  avatarSrc: _avatarSrc };
			addBabyBlock(infoAboutBaby,  babiesContainer.length, _animateShow, windowId, selectBabyRadioPrefix);
			babiesContainer.push( infoAboutBaby );
		}

		this.markAsTemporary = function(_name){
			temporaryBabies.push(_name.toUpperCase());
		}

		this.containsTemporaries = function(){
			return temporaryBabies.length > 0;
		}

		this.clearTemporaries = function(){
			var tempBabies = temporaryBabies.slice(0, temporaryBabies.length);
			for(var i in tempBabies){
				if(this.value.querySelector("[data-baby-name = '" + tempBabies[i].toUpperCase() + "']" )){
					var temp = this.value.querySelector("[data-baby-name = '" + tempBabies[i].toUpperCase() + "']" );
					removeElement( temp );
				}
			}
			temporaryBabies.splice(0, temporaryBabies.length);
		}

		this.addBabies = function(_snugBabies){
			if(!_snugBabies) return;

			_snugBabies.forEach(function(baby){
				var infoAboutBaby = { name: baby[1].NAME,  avatarSrc: baby[1].AVATAR.VALUE };
				addBabyBlock(infoAboutBaby,  babiesContainer.length, false, windowId, selectBabyRadioPrefix);
				babiesContainer.push( infoAboutBaby );
			});

			snugBabies = _snugBabies;
		}
		
		this.removeFromTemporaries = function(baby){
			var index = temporaryBabies.indexOf(baby.toUpperCase());
			if(index > -1)
				temporaryBabies.splice(index, 1);
		}

		this.on = function(event, callback){
			if(typeof event === "undefined" || typeof event !== "string") return;
			if(typeof callback === "undefined" || typeof callback !== "function") return;
			switch(event){
				case "selectbaby":
					$('#' + windowId).on("change", "input[name=" + selectBabyRadioPrefix + "]", callback);
				break;
				case "createbaby":
					$('.' + createBabyButtonClass).on("click", callback);
				break;
			}
		}

		this.off = function(event, callback){
			if(typeof event === "undefined" || typeof event !== "string") return;
			if(typeof callback === "undefined" || typeof callback !== "function") return;
			switch(event){
				case "selectbaby":
					$('#' + windowId).off("change", "input[name=" + selectBabyRadioPrefix + "]", callback);
				break;
			}
		}

		this.getId = function(){
			return windowId;
		}

		this.getBabies = function(){
			return snugBabies;
		}

		this.hide = function( speed, callback ){
			$('#' + windowId).hide( speed, callback );
		}

		this.show = function( speed, callback ){
			$('#' + windowId).show( speed, callback );
		}
		
		this.hide = function( effect, options, duration, complete ){
			$('#' + windowId).hide( effect, options, duration, complete );
		}

		this.show = function( effect, options, duration, complete){
			$('#' + windowId).show( effect, options, duration, complete );
		}

		this.fadeIn = function( duration, callback ){
			$('#' + windowId).fadeIn( duration, callback );
		}

		this.fadeOut = function( duration, callback ){
			$('#' + windowId).fadeOut( duration, callback );
		}

		this.update = function(_snugBabies){
			if(!_snugBabies) return;

			snugBabies = _snugBabies;

			var idAddition = false,
				isDeletion = false,
				cSnugBabies = snugBabies,
				cBabiesContainer = babiesContainer;

			if(cBabiesContainer.length < snugBabies.length){
				isAddition = true;
				// Swap ( cBabiesContainer, cSnugBabies )
				var temp = cBabiesContainer;
				cBabiesContainer = cSnugBabies;
				cSnugBabies = temp;
				//--
			}else if(cBabiesContainer.length > snugBabies.length)
				isDeletion = true;

			for(var i = 0; i < cBabiesContainer.length; i++){
				var isFoundIdentical = false;

				for(var j = 0; j < cSnugBabies.length; j++)
					if(!isFoundIdentical){
						var babyName = cBabiesContainer[i].name;
						if( babyName == cSnugBabies[j][0]){
							isFoundIdentical = true;
							break;
						}
					}
				if(!isFoundIdentical){
					var infoAboutBaby = { name: cBabiesContainer[i][1].NAME,  avatarSrc: cBabiesContainer[i][1].AVATAR.VALUE };
					if(isAddition){
						addBabyBlock(infoAboutBaby,  babiesContainer.length, false, windowId, selectBabyRadioPrefix);
						babiesContainer.push(infoAboutBaby);
					}else if(isDeletion){
						var babyIndex = babiesContainer.indexOf(infoAboutBaby);
						if(babyIndex > -1){
							removeElement( this.value.querySelector( "[data-baby-name = '" + infoAboutBaby.name + "']" ) );
							babiesContainer.splice(babyIndex, 1);
						}
					}
				}
			}
		}
				

	}

	return SelectBabyWindow;
})()