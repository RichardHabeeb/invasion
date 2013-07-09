function Entity(layer) {
	var self = this;
	this.health = 100;
	this.x = 100;
	this.y = 100;
	
	this.imageObj = new Image();
	this.imageObj.src = 'images\\Brain Jelly.png';
	
	this.layer = layer; //this neeeds to know its layer for stupid reasons.
	this.anim;
	this.sprite = new Kinetic.Image({
			x: this.x,
			y: this.y,
			width: 32,
			height: 32,
			image: this.imageObj,
	});
	
	this.imageObj.onload = function() {
		self.layer.add(self.sprite);
		self.layer.draw();
	}
	
	
	function SetupTween() {
		self.anim = new Kinetic.Tween({
			node: self.sprite,
			x: self.x,
			y: self.y,
			duration: 0.15,
			easing: Kinetic.Easings.Linear
		});
		self.anim.play();
	}
	
	this.MoveUp = function() {
		if(this.anim == null || (typeof this.anim === "object" && this.anim.tween._time >= this.anim.tween.duration)) {
			this.y = Math.max(0,this.y-32);
			SetupTween();
		}
	}
	
	this.MoveDown = function() {
		if(this.anim == null || (typeof this.anim === "object" && this.anim.tween._time >= this.anim.tween.duration)) {
			this.y = Math.min(640,this.y+32);
			SetupTween();
		}
	}
	
	this.MoveLeft = function() {
		if(this.anim == null || (typeof this.anim === "object" && this.anim.tween._time >= this.anim.tween.duration)) {
			this.x = Math.max(0,this.x-32);
			SetupTween();
		}
	}
	
	this.MoveRight = function() {
		if(this.anim == null || (typeof this.anim === "object" && this.anim.tween._time >= this.anim.tween.duration)) {
			this.x = Math.min(640,this.x+32);
			SetupTween();
		}
	}

	
	

}