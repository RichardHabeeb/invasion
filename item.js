/**
 * INVASION
 * FILE: item.js
 * AUTHORS: Richard Habeeb, Addison Shaw 
 * TODO:
 *  -all the things.
 **/

function Item(key, map_layer, animation_layer)
{
	var self 					= this;
	this.key 					= key;
	this.name 					= ITEM_DICT[key].name;
	this.type 					= ITEM_DICT[key].type;
	this.icon_image				= new Image();
	this.map_image 				= new Image();
	this.animation_image		= new Image();
	this.icon_image.src 		= ITEM_DICT[key].icon_image;
	this.map_image.src			= ITEM_DICT[key].map_image;
	this.animation_image.src	= ITEM_DICT[key].animation_image;
	this.icon_image_loaded 		= false;
	this.map_image_loaded 		= false;
	this.animation_image_loaded = false;
	this.map_layer 				= map_layer;
	this.animation_layer 		= animation_layer;
	this.row					= 0;
	this.col					= 0;
	this.x						= 0;
	this.y						= 0;

	this.icon_image.onload = function() {
		//self.layer.add(self.sprite);
		//self.layer.draw();
		self.icon_image_loaded = true;
	};
	
	this.map_image.onload = function() {
		self.map_layer.add(self.map_sprite);
		self.map_layer.draw();
		self.map_image_loaded = true;
	};
	
	this.animation_image.onload = function() {
		self.animation_layer.add(self.sprite);
		self.animation_layer.draw();
		self.animation_image_loaded = true;
	};
	
	this.map_sprite = new Kinetic.Image({
			x: this.x,
			y: this.y,
			width: PX_PER_CELL,
			height: PX_PER_CELL,
			offset: { x : PX_PER_CELL/2, y: PX_PER_CELL/2},
			image: this.map_image
	});
	
	this.animation_sprite = new Kinetic.Image({
			x: this.x,
			y: this.y,
			width: PX_PER_CELL,
			height: PX_PER_CELL,
			offset: { x : PX_PER_CELL/2, y: PX_PER_CELL/2},
			image: this.animation_image
	});
	
	
	//TYPE SPECIFIC STUFF HERE!!!!
	
	
};

