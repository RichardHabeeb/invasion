/**
 * INVASION
 * FILE: item.js
 * AUTHORS: Richard Habeeb, Addison Shaw 
 * TODO:
 *  -all the things.
 **/

function Item(key)
{
	var self = this;
	this.name = key;
	this.image = ITEM_IMAGES[key];
	this.damage = ITEM_DAMAGES[key];
	this.anim = ITEM_ANIMATIONS[key];
	
	this.imageObj = new Image();
	imageObj.src = this.image;
	
	this.loaded = false;
	this.imageObj.onload = function() {
		self.layer.add(self.sprite);
		self.layer.draw();
		self.loaded = true;
	};
	
	this.sprite = new Kinetic.Image({
			
			width: PX_PER_CELL,
			height: PX_PER_CELL,
			image: this.imageObj,
	});
};

