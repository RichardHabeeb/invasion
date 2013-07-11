function Entity(layer, r, c, target) {
	var self = this;
	this.health = 100;
	this.row = r;
	this.col = c;
	this.target = target;
	
	this.x = PX_PER_CELL*c;
	this.y = PX_PER_CELL*r;
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
			image: this.imageObj,
	});
	
	this.loaded = false;
	this.imageObj.onload = function() {
		self.layer.add(self.sprite);
		self.layer.draw();
		self.sprite.setZIndex(self.row);
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
	
	

}