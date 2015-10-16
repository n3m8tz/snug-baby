
var SelectBabyWindow = (function(){

	var initDOM = function(windowId){
		var _parentSection = document.createElement("section");
		_parentSection.setAttribute("id", windowId);

		var _childSection = document.createElement("section");
		_parentSection.appendChild(_childSection);

		return _parentSection;
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

		var babiesCount = 0;
		var temporaryBabies = new Array();
		var windowId = "select_baby_table_mobile";
		var selectBabyRadioPrefix = "select-baby-radio";
		var snugBabies = new Array();

		if (initStruct !== undefined){
			windowId = (typeof initStruct.id !== "undefined") ? initStruct.id : windowId;
			selectBabyRadioPrefix = (typeof initStruct.selectBabyRadioPrefix !== "undefined") ? initStruct.selectBabyRadioPrefix : selectBabyRadioPrefix;
		}

		
		this.value =  initDOM(windowId);

		this.insertInto = function(handle){
			document.querySelector(handle).appendChild(this.value);
		}

		this.getBabiesCount = function(){
			return babiesCount;
		}

		this.addBaby = function(_name, _avatarSrc, _animateShow){
			addBabyBlock({ name: _name,  avatarSrc: _avatarSrc },  babiesCount, _animateShow, windowId, selectBabyRadioPrefix);
			babiesCount++;
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

			_snugBabies.forEach(function(baby, index){
				addBabyBlock({ name: baby[1].NAME,  avatarSrc: baby[1].AVATAR.VALUE },  index, false, windowId, selectBabyRadioPrefix);
				babiesCount++;
			});

			snugBabies = _snugBabies;
		}
		
		this.removeFromTemporaries = function(baby){
			var index = temporaryBabies.indexOf(baby.toUpperCase());
			if(index != -1)
				temporaryBabies.splice(index, 1);
		}

		this.on = function(event, callback){
			if(typeof event === "undefined" || typeof event !== "string") return;
			if(typeof callback === "undefined" || typeof callback !== "function") return;
			switch(event){
				case "selectbaby":
					$('#' + this.value.getAttribute("id")).on("change", "input[name=" + selectBabyRadioPrefix + "]", callback);
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
			var imageGridBlocks = this.value.getElementsByClassName('image-grid-block');

			if(imageGridBlocks.length < snugBabies.length){
				var isBabyAdded = false;
				snugBabies.forEach(function(baby){
					if(!isBabyAdded){
						var isFoundIdentical = false;
						for(var i = 0; i < imageGridBlocks.length; i++){
							var babyName = imageGridBlocks[i].getAttribute("data-baby-name");
							if( babyName == baby[0] ){
								isFoundIdentical = true;
								break;
							}
						}
						if( !isFoundIdentical){
							addBabyBlock({ name: baby[1].NAME,  avatarSrc: baby[1].AVATAR.VALUE },  babiesCount, false, windowId, selectBabyRadioPrefix);
							babiesCount++;
							isBabyAdded = true;
						}
					}
				});
			}else if(imageGridBlocks.length > snugBabies.length)
				for(var i = 0; i < imageGridBlocks.length; i++){
					var isFoundIdentical = false;
					var babyName = imageGridBlocks[i].getAttribute("data-baby-name");
					snugBabies.forEach(function(baby){
						if( !isFoundIdentical && babyName == baby[0])
							isFoundIdentical = true;
					});

					if(!isFoundIdentical){
						removeElement( this.value.querySelector( "[data-baby-name = '" + babyName + "']" ) );
						babiesCount--;
						break;
					} 
				}
		}

	}

	return SelectBabyWindow;
})()