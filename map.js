function Map() {
	this.number_of_updates = 0;
	this.size_x = 10;
	this.size_y = 10;
	this.monsters = new Array();
	this.items = new Array();
	this.player;
	this.interval;
	
	this.background_layer = new Kinetic.Layer();
	this.items_layer = new Kinetic.Layer();
	this.monster_layer = new Kinetic.Layer();
	this.player_layer = new Kinetic.Layer();
	
	
	
	this.SetupMapOnStage = function(stage) {
		if(typeof stage === "object") {
			stage.add(this.background_layer);
			stage.add(this.items_layer);
			stage.add(this.monster_layer);
			stage.add(this.player_layer);
		} else alert("Error setting up " + (typeof stage));
	};
	
	this.SetupPlayer = function() {
		this.player = new Entity(this.player_layer);
		this.player.health = 100;
		this.player.imageObj.src = 'images\\Brain Jelly.png';
		
	};
	
	
	this.DrawMap = function() {
		this.background_layer.draw();
		this.items_layer.draw();
		this.monster_layer.draw();
		this.player_layer.draw();
		document.getElementById('DebugStats').innerHTML=++this.number_of_updates;
	};
	
	this.GenerateTerrain = function(seed) {
		
	};
	
	this.PopulateMonsters = function() {
	
	};
	
	this.PopulateItems = function() {
	
	};
	
	this.HandleMonsterSpawning = function() {
	
	};
	
	this.HandleMonsterMovements = function() {
	
	};
	
}