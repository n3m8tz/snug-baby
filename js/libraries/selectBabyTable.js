
var SelectBabyWindow = (function(){

	var initDOM = function(){
		var _parentSection = document.createElement("section");
		_parentSection.setAttribute("id", "select_baby_table_mobile");

		var _childSection = document.createElement("section");
		_parentSection.appendChild(_childSection);

		return _parentSection;
	}

	var addBabyBlock = function(baby, index){
		var _blockStructure = 
			'<div class="image-grid-block">'+
				'<div class="image-grid-block-content">'+
					'<label for="select-baby-radio-' + index + '">'+
						'<div class="image-grid-block-text">' + baby.name + '</div>'+
						'<img src="' + baby.avatarSrc + '" />'+
						'<input id="select-baby-radio-' + index + '" name="select-baby-radio" type="radio" value="' + index + '" />'+
					'</label>'+
				'</div>'+
			'</div>';

		document.querySelector("#select_baby_table_mobile > section").innerHTML += _blockStructure;
	}

	function SelectBabyWindow(){
		this.value =  initDOM();
		this.snugBabies;

		this.insertInto = function(handle){
			document.querySelector(handle).appendChild(this.value);
		}

		this.addBabies = function(snugBabies){
			if(!snugBabies) return;

			snugBabies.forEach(function(baby, index){
				addBabyBlock({ name: baby[1].NAME,  avatarSrc: baby[1].AVATAR.VALUE },  index);
			});

			this.snugBabies = snugBabies;
		}
		
		this.update = function(handle){
			if(handle){
				snugBabies.forEach(function(baby, index){
					addBabyBlock({ name: baby[1].NAME,  avatarSrc: baby[1].AVATAR.VALUE },  index);
				});
			}
		}
	}

	

	return SelectBabyWindow;
})()

