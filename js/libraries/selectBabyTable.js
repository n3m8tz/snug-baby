

var SelectBabyWindow = (function(){

	var initDOM = function(){
		var _parentSection = document.createElement("section");
		_parentSection.setAttribute("id", "select_baby_table_mobile");

		var _childSection = document.createElement("section");
		_parentSection.appendChild(_childSection);

		return _parentSection;
	}

	var addBabyBlock = function(baby, index, _animateShow){
		var animateShow = false;
		if(_animateShow) animateShow = true;

		var hiddenProperty = animateShow ? "prop--hidden" : "";

		var _blockStructure = [
			'<div id="' + baby.name.toUpperCase() + '" class="image-grid-block ' + hiddenProperty + '" >',
				'<div class="image-grid-block-content">',
					'<label for="select-baby-radio-' + index + '">',
						'<div class="image-grid-block-text">' + baby.name + '</div>',
						'<img src="' + baby.avatarSrc + '" />',
						'<input id="select-baby-radio-' + index + '" name="select-baby-radio" type="radio" value="' + index + '" />',
					'</label>',
				'</div>',
			'</div>'
		].join('');

		var parent = document.querySelector("#select_baby_table_mobile > section");

		if(parent){
			parent.innerHTML += _blockStructure;

			if(animateShow)
				//code below will be replaced with a new one later on;
				if($) 
					$(parent).find("#" + baby.name.toUpperCase()).removeClass("prop--hidden");
		}
	}

	var removeElement = function(element) {
		element && element.parentNode && element.parentNode.removeChild(element);
	}

	function SelectBabyWindow(){

		var babiesCount = 0;
		var temporaryBabies = new Array();

		this.value =  initDOM();
		this.snugBabies;

		this.insertInto = function(handle){
			document.querySelector(handle).appendChild(this.value);
		}

		this.getBabiesCount = function(){
			return babiesCount;
		}

		this.addBaby = function(_name, _avatarSrc, _animateShow){
			addBabyBlock({ name: _name,  avatarSrc: _avatarSrc },  babiesCount, _animateShow);
			babiesCount++;
		}

		this.markAsTemporary = function(_name){
			temporaryBabies.push(_name.toUpperCase());
		}

		this.containsTemporaries = function(){
			return temporaryBabies.length > 0;
		}

		this.clearTemporaries = function(){
			var tempBabies = temporaryBabies;
			for(var i in tempBabies){
				if(document.getElementById(tempBabies[i].toUpperCase())){
					var temp = document.getElementById(tempBabies[i].toUpperCase());
					removeElement( temp );
				}
				var index = tempBabies.indexOf(tempBabies[i].toUpperCase());
				temporaryBabies.slice(index, 1);
			}
		}

		this.addBabies = function(snugBabies){
			if(!snugBabies) return;

			snugBabies.forEach(function(baby, index){
				addBabyBlock({ name: baby[1].NAME,  avatarSrc: baby[1].AVATAR.VALUE },  index);
				babiesCount++;
			});

			this.snugBabies = snugBabies;
		}
		
		this.removeFromTemporaries = function(baby){
			var index = temporaryBabies.indexOf(baby.toUpperCase());
			if(index != -1)
				temporaryBabies.slice(index, 1);
		}

		this.update = function(snugBabies){
			this.snugBabies = snugBabies;
			var imageGridBlocks = this.value.getElementsByClassName('image-grid-block');
			var isFound = false;

			if(imageGridBlocks.length > snugBabies.length)
				snugBabies.forEach(function(baby){
					if(!isFound)
						for(var i = 0; i < imageGridBlocks.length; i++){
							var babyName = imageGridBlocks[i].getAttribute("id");
							if( babyName == baby[0] ){
								addBabyBlock({ name: baby[0],  avatarSrc: baby[1].AVATAR.VALUE },  babiesCount);
								babiesCount++;
								isFound = true;
								break;
							}
						}
				});
			else
				for(var i = 0; i < imageGridBlocks.length; i++){

					var babyName = imageGridBlocks[i].getAttribute("id");
					snugBabies.forEach(function(baby){
						if( !isFound && babyName == baby[0]){
							removeElement( document.getElementById( "#" + babyName ) );
							babiesCount--;
							isFound = true;
						}
					});
					if(isFound) break;
				}
		}

	}

	return SelectBabyWindow;
})()

