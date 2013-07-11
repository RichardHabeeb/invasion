function MapCell(layer, r, c) {
	var self = this;
	this.layer = layer; //this needs to know its layer for stupid reasons.
	
	this.row = r;
	this.col = c;
	this.x = (PX_PER_CELL*c)+PX_PER_CELL/2;
	this.y = (PX_PER_CELL*r)+PX_PER_CELL/2;
	
	this.images = new Array();
	this.loaded = new Array();
	this.kinetic_images = new Array();
	
	this.PushImage = function(src) {
	
		var index = this.images.length;
		
		this.images.push(new Image());
		
		this.loaded.push(false);
		
		this.kinetic_images.push(new Kinetic.Image({
			x: this.x,
			y: this.y,
			width: PX_PER_CELL,
			height: PX_PER_CELL,
			offset: { x : PX_PER_CELL/2, y: PX_PER_CELL/2},
			image: this.images[index]
		}));
		
		this.images[index].src = src;
		this.images[index].onload = function() {
			self.layer.add(self.kinetic_images[index]);
			self.layer.draw();
			self.loaded[index] = true;
		};
		
	
	};
	
	

}