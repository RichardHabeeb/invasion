function Entity(layer) {
	var self = this;
	this.health = 100;
	this.x = 0;
	this.y = 0;
	this.row = 0;
	this.col = 0;
	this.move_time = 0.15;
	
	
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
	
	this.imageObj.onload = function() {
		self.layer.add(self.sprite);
		self.layer.draw();
	};
	
	
	this.SetupTween = function () {
		this.anim = new Kinetic.Tween({
			node: this.sprite,
			x: this.x,
			y: this.y,
			duration: this.move_time,
			easing: Kinetic.Easings.Linear
		});
		this.anim.play();
	};
	
	this.IsStopped = function() {
		return (this.anim == null || (typeof this.anim === "object" && this.anim.tween._time >= this.anim.tween.duration));
	}
	
	
	this.Move = function(heading) {
		if(IsStopped()) {
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
		
			this.SetupTween();
		}
	};
	
	this.OnDeath = function() {
		self.layer.remove(self.sprite);
	}
	
	

}