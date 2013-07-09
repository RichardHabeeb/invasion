function Entity(layer) {
	var self = this;
	this.health = 100;
	this.x = 0;
	this.y = 0;
	this.grid_x = 0;
	this.grid_y = 0;
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
	
	this.MoveUp = function() {
		this.Move(function() { self.y = Math.max(0, self.y-PX_PER_CELL); });
	};
	
	this.MoveDown = function() {
		this.Move(function() { self.y = Math.min(WINDOW_HEIGHT_PX, self.y+PX_PER_CELL); });
	};
	
	this.MoveLeft = function() {
		this.Move(function() { self.x = Math.max(0, self.x-PX_PER_CELL); });
	};
	
	this.MoveRight = function() {
		this.Move(function() { self.x = Math.min(WINDOW_WIDTH_PX, self.x+PX_PER_CELL); });
	};
	
	this.Move = function(adjustXY) {
		if(this.anim == null || (typeof this.anim === "object" && this.anim.tween._time >= this.anim.tween.duration)) {
			adjustXY();
			this.SetupTween();
		}
	};
	
	

}