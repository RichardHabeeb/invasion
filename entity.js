/**
 * INVASION
 * FILE: entity.js
 * AUTHORS: Richard Habeeb, Addison Shaw 
 * TODO:
 *  -Handle inventory pickups and drops
 *  -Handle attack requests
 **/

function Entity(layer, r, c, target) {
	var self = this;
	this.health = 100;
	this.row = r;
	this.col = c;
	this.target = target;
	
	var items = new Array();
	this.currentItem;
	
	this.x = (PX_PER_CELL*c)+PX_PER_CELL/2;
	this.y = (PX_PER_CELL*r)+PX_PER_CELL/2;
	this.inv = new Inventory();
	this.move_time = 0.15; //time in tween animation in secs
	
	this.time_of_last_hit = (new Date()).getTime(); // update this later using a new Date();
	
	this.imageObj = new Image();
	this.imageObj.src = 'images\\Brain Jelly.png';
	
	this.layer = layer; //this needs to know its layer for stupid reasons.
	this.anim;
	this.sprite = new Kinetic.Image({
			x: this.x,
			y: this.y,
			width: PX_PER_CELL,
			height: PX_PER_CELL,
			offset: { x : PX_PER_CELL/2, y: PX_PER_CELL/2},
			image: this.imageObj
	});
	
	this.loaded = false;
	this.imageObj.onload = function() {
		self.layer.add(self.sprite);
		self.layer.draw();
		self.loaded = true;
	};
	
	

	
	this.IsStopped = function() {
		return (this.anim == null || (typeof this.anim === "object" && this.anim.tween._time >= this.anim.tween.duration));
	}

	
	
	this.Move = function(heading) {
		if(this.loaded && this.IsStopped()) {
			switch(heading) {
				case NORTH:
					this.row -= 1;
					this.y = Math.max(0, this.y-PX_PER_CELL);
					break;
				case EAST:
					this.col += 1;
					this.sprite.setScaleX(Math.abs(this.sprite.getScaleX()));
					this.x = Math.min(WINDOW_WIDTH_PX, this.x+PX_PER_CELL);
					break;
				case SOUTH:
					this.row += 1;
					this.y = Math.min(WINDOW_HEIGHT_PX, this.y+PX_PER_CELL);
					break;
				case WEST:
					this.col -= 1;
					this.sprite.setScaleX(-Math.abs(this.sprite.getScaleX()));
					this.x = Math.max(0, this.x-PX_PER_CELL);
					break;
			}
			this.sprite.setZIndex(this.y);
			this.anim = new Kinetic.Tween({
				node: this.sprite,
				x: this.x,
				y: this.y,
				duration: this.move_time,
				easing: Kinetic.Easings.Linear
			});
			this.anim.play();
		}
	};
	
	this.Attack = function() {
		if(this.loaded && this.IsStopped()) {
			
		}
		
		this.anim = new Kinetic.Tween({
		
		});
		this.anim.play();
	}
	
	this.OnDeath = function() {
		this.layer.remove(self.sprite);
		this.inv.RemoveAll();
		//drop all items in inventory?
	}
	
	this.EquipItem = function(item)
	{
		this.currentItem = item;
	}

	//Adds the given item to 'inventoy'
	this.AddItem = function(item) 
	{
		this.items.push(item);
		this.EquipItem(item);
	}

	//Removes the given item from 'inventory'
	this.RemoveItem = function(item) 
	{

		// If it exists...
		if (array.indexOf(item) != -1) 
		{
			// Remove the item at the given index
			this.items.splice(array.indexOf(item), 1);
		}
		
	}

	this.RemoveAllItems = function()
	{
		var length = items.length, 
			element = null;
			
		for (var i = 0; i < length; i++) 
		{
			element = items[i];
			RemoveItem(element);
		}
	}
	
	

}