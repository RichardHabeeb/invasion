function Item(layer, name, image, damage, radius)
{
	this.name = name;
	this.image = image;
	this.damage = damage;
	this.radius = radius;
	
	this.imageObj = new Image();
	imageObj.src = this.image;
	
	this.layer = layer;
	this.sprite = new Kinetic.Image({
			
			width: PX_PER_CELL,
			height: PX_PER_CELL,
			image: this.imageObj,
	});
};

