const NORTH = "NORTH";
const EAST  = "EAST";
const SOUTH = "SOUTH";
const WEST  = "WEST";

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
	
	this.walls = new Array();
	for(var r = 0; r < WINDOW_HEIGHT_CELLS; r++) {
		this.walls[r] = new Array();
		for(var c = 0; c < WINDOW_WIDTH_CELLS; c++) {
			this.walls[r][c] = {
				"north": 	false,
				"east":		false,
				"south":	false,
				"west":		false
			};
		}
	}
	
	
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
	
	this.GetNextBestCell = function(row_start, col_start, row_end, col_end) {
	
	
	};
	
	this.MoveEntity = function(entity) {
	
	};
	
	this.SetWall = function(row, col, heading) {
		if(heading === NORTH) {
			this.walls[row][col][NORTH] = true;
			if(row-1 >= 0) this.walls[row-1][col][SOUTH] = true;
		}
	};
	
	this.SetWall(0,0,NORTH);
	console.log(this.walls);
	
}