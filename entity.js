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
	this.max_health = 100;
	this.hud = null;
	this.row = r;
	this.col = c;	
	this.x = (PX_PER_CELL*c)+PX_PER_CELL/2;
	this.y = (PX_PER_CELL*r)+PX_PER_CELL/2;
	this.heading = NORTH;
	this.target = target;
	this.attack_damage_bonus = 0;
	this.level = 0;
	this.type;
	this.items = new Array();
	this.single_use_repairs = new Array();
	this.currentItem;
	this.kills = 0;
	this.is_taking_damage = false;

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
		return 	(this.anim == null 		  || (typeof this.anim === "object" && this.anim.tween._time >= this.anim.tween.duration)) &&
				(this.currentItem == null || (typeof this.currentItem === "object" && !this.currentItem.is_animating));
	}

	
	
	this.Move = function(heading) {
		if(this.loaded && this.IsStopped()) {
		
			this.FaceHeading(heading);
			
			switch(heading) {
				case NORTH:
					this.row -= 1;
					this.y = Math.max(0, this.y-PX_PER_CELL);
					break;
				case EAST:
					this.col += 1;
					this.x = Math.min(WINDOW_WIDTH_PX, this.x+PX_PER_CELL);
					break;
				case SOUTH:
					this.row += 1;
					this.y = Math.min(WINDOW_HEIGHT_PX, this.y+PX_PER_CELL);
					break;
				case WEST:
					this.col -= 1;
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
	
	this.FaceHeading = function(heading) {
		
		if(heading == WEST && heading != this.heading) {
			this.sprite.setScaleX(-Math.abs(this.sprite.getScaleX()));
			this.layer.draw();
		} else if(heading == EAST  && heading != this.heading) {
			this.sprite.setScaleX(Math.abs(this.sprite.getScaleX()));
			this.layer.draw();
		}
		this.heading = heading;
	}
	
	this.Attack = function() {
		if(this.loaded && typeof this.currentItem != "undefined" && !this.currentItem.is_animating && (this.currentItem.type == EQUIP || this.currentItem.type == SINGLE_USE_WEAPON)) {
			var cells_affected = new Array();
			if(this.currentItem.type == EQUIP) {
				if(this.currentItem.melee) {
					if(this.currentItem.single_direction) {
						var pos = {x:this.x, y:this.y};
						
						if(this.heading == NORTH) {
							pos.y -= this.currentItem.range*PX_PER_CELL;
							for(var i = this.row-1; i >= Math.max(this.row-this.currentItem.range, 0); i--) 
								cells_affected.push({r:i, c:this.col, damage:this.currentItem.base_damage+this.attack_damage_bonus});
						} else if(this.heading == EAST) {
							pos.x += this.currentItem.range*PX_PER_CELL;
							for(var i = this.col+1; i <= Math.min(this.col+this.currentItem.range, WINDOW_WIDTH_CELLS); i++) 
								cells_affected.push({r:this.row, c:i, damage:this.currentItem.base_damage+this.attack_damage_bonus});
						} else if(this.heading == SOUTH) {
							pos.y += this.currentItem.range*PX_PER_CELL;
							for(var i = this.row+1; i <= Math.min(this.row+this.currentItem.range, WINDOW_HEIGHT_CELLS); i++) 
								cells_affected.push({r:i, c:this.col, damage:this.currentItem.base_damage+this.attack_damage_bonus});
						} else if(this.heading == WEST) {
							pos.x -= this.currentItem.range*PX_PER_CELL;
							for(var i = this.col-1; i >= Math.max(this.col-this.currentItem.range, 0); i--) 
								cells_affected.push({r:this.row, c:i, damage:this.currentItem.base_damage+this.attack_damage_bonus});
						}
						
						
						this.currentItem.FaceHeading(this.heading);
						this.currentItem.Animate(pos.x, pos.y);
						
						
					} else {
						
						
					}
				} else {
				
				
				}
			}
			
			return cells_affected;
		}
		return null;
	}
	
	
	this.TakeDamage = function(amount, from_entity) {
		if(this.loaded && !this.is_taking_damage) {
			this.health -= amount;
			var init_rotation = this.sprite.getRotation();
			var init_opacity = this.sprite.getOpacity();
			this.is_taking_damage = true;
			this.anim = new Kinetic.Tween({
				node: this.sprite,
				opacity: 0.1,
				rotation: (Math.random() > 0.5) ? Math.random() : -Math.random(),
				duration: 0.1,
				easing: Kinetic.Easings.EaseInOut,
				onFinish: function() {
				
					self.anim = new Kinetic.Tween({
						node: self.sprite,
						opacity: init_opacity,
						rotation: init_rotation,
						duration: 0.1,
						easing: Kinetic.Easings.EaseInOut,
						onFinish: function() { self.is_taking_damage = false;}
					});
					self.anim.play();
					
					if(self.health <= 0) self.OnDeath();
				}
			});
			this.anim.play();
			
			if(this.type == MOB) {
				this.target = from_entity;
			
			}	
		}
		return this.health;
	}
	
	this.AddHealth = function(amount) {
		if (this.health += amount > 100) {
			this.health = 100;
		}
		
		/*
		this.anim = Kinetic.Tween({
			node: this.sprite,
			opacity: 0.5,
			duration: .3,
			easing: Kinetic.Easings.EaseInOut,
			onFinish: function() {
				self.anim = null;
			}
		});
		this.anim.play();
		*/
		
		this.single_use_repairs.splice(this.single_use_repairs.length - 1, 1);
		
		return this.health;
	}

	
	this.OnDeath = function() {
		this.sprite.destroy();
		return this.HandleDrops();
	}
	
	this.EquipItem = function(item)
	{
		this.currentItem = item;
	}

	//Adds the given item to 'inventoy'
	this.AddItem = function(item) 
	{
		if (item.type == EQUIP) {
			this.items.push(item);
			this.EquipItem(item);
		} else {
			this.single_use_repairs.push(item);
		}
			
		
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

	this.HandleDrops = function()
	{
		for (var i = 0; i < this.single_use_repairs.length; i++)
		{
			var currItem = this.single_use_repairs[i];
			
			if (ITEM_PROBS[currItem.key] <= Math.floor(Math.random() * 100) 
			&& currItem.parent.items_count[currItem.key] != ITEM_SPAWN_LIMITS[currItem.key] 
			&& currItem.parent.IsValidOpenCell(this.row, this.col)) {
				currItem.parent.items_count[currItem.key]++;
				return currItem.ShowImageOnMap(this.row, this.col);
			}
		
		}
	}
	
	

}