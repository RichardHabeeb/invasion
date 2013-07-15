function Hud(stage) {
	this.layer = new Kinetic.Layer();
	this.stage = stage;
	this.stage.add(this.layer);

	
	this.player_health_bar = new Kinetic.Rect({
		x: 20,
		y: 10,
		width: 300,
		height: 30,
		fillLinearGradientStartPoint: 	{x: 0, y:0 },
		fillLinearGradientEndPoint: 	{x: 0, y:30 },
		fillLinearGradientColorStops: [0, "#94B84D", 1, "#669900"]
	});
	
	this.player_health_bar_bg = new Kinetic.Rect({
		x: 20,
		y: 10,
		width: 300,
		height: 30,
		fillLinearGradientStartPoint: 	{x: 0, y:0 },
		fillLinearGradientEndPoint: 	{x: 0, y:30 },
		fillLinearGradientColorStops: [0, "#303030", 1, "#1E1E1E"]
	});
	
	this.player_text = new Kinetic.Text({
		x: 15,
		y: 6,
		rotationDeg: 90,
		text: 'PLAYER',
		fontSize: 10,
		fontFamily: 'Square',
		fill: 'white'
	});
	
	
	this.cow_health_bar = new Kinetic.Rect({
		offset: [300,0],
		x: this.stage.getWidth()-20,
		y: 10,
		width: 300,
		height: 30,
		fillLinearGradientStartPoint: 	{x: 0, y:0 },
		fillLinearGradientEndPoint: 	{x: 0, y:30 },
		fillLinearGradientColorStops: [0, "#FF73B0", 1, "#FF4093"]
	});
	
	this.cow_health_bar_bg = new Kinetic.Rect({
		offset: [300,0],
		x: this.stage.getWidth()-20,
		y: 10,
		width: 300,
		height: 30,
		fillLinearGradientStartPoint: 	{x: 0, y:0 },
		fillLinearGradientEndPoint: 	{x: 0, y:30 },
		fillLinearGradientColorStops: [0, "#303030", 1, "#1E1E1E"]
	});
	
	this.cow_text = new Kinetic.Text({
		x: this.stage.getWidth()-8,
		y: 15,
		rotationDeg: 90,
		text: 'COW',
		fontSize: 10,
		fontFamily: 'Square',
		fill: 'white'
	});
	
	this.kills_text_title = new Kinetic.Text({
		x: 330,
		y: 8,
		text: 'KILLS',
		fontSize: 12,
		fontFamily: 'Square',
		fill: '#A030BF'
	});
	
	this.kills_text = new Kinetic.Text({
		x: 330,
		y: 18,
		y: 18,
		text: '0',
		fontSize: 25,
		fontFamily: 'Square',
		fill: '#E073FF'
	});
	
	
	this.layer.add(this.player_health_bar_bg);
	this.layer.add(this.player_health_bar);
	this.layer.add(this.cow_health_bar_bg);
	this.layer.add(this.cow_health_bar);
	this.layer.add(this.player_text);
	this.layer.add(this.cow_text);
	this.layer.add(this.kills_text);
	this.layer.add(this.kills_text_title);
	
	
	this.UpdateStats = function(entity) {
		
		if(entity.type == PLAYER) {
			var tween = new Kinetic.Tween({
				node: this.player_health_bar, 
				duration: 0.3,
				width: this.player_health_bar_bg.getWidth()*entity.health/entity.max_health,
				easing: Kinetic.Easings.BounceEaseInOut
			});
			tween.play();
			this.kills_text.setText(entity.kills);
		}
		
		if(entity.type == COW) {
			var tween = new Kinetic.Tween({
				node: this.cow_health_bar, 
				duration: 0.3,
				width: this.cow_health_bar_bg.getWidth()*entity.health/entity.max_health,
				offsetX: this.cow_health_bar_bg.getWidth()*entity.health/entity.max_health,
				easing: Kinetic.Easings.BounceEaseInOut
			});
			tween.play();
		}
		
		
		this.layer.draw();
	}

}