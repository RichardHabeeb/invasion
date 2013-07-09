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
			this.walls[r][c] = { //Put walls on the outer edges.
				NORTH: 	(r == 0) ? true : false,
				EAST:	(c == WINDOW_WIDTH_CELLS-1) ? true : false,
				SOUTH:	(r == WINDOW_HEIGHT_CELLS-1) ? true : false,
				WEST:	(c == 0) ? true : false
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
	};
	
	
	this.GenerateTerrain = function(seed) {
		//This is called once at the beginning of the game
	};
	
	this.PopulateMonsters = function() {
		//This is called once at the beginning of the game
	};
	
	this.PopulateItems = function() {

	};
	
	this.HandleMonsterSpawning = function() {
		/* Factors that affect the monster spawning.
				_ # of aliens on map
				- Player health
				- Player health lost since last spawn handling
				- Time since last player damage
				- The "power" of the player (possibly determined by item strength)
				- distance of player from animals
				- LUCK!
		*/
		
		
		
	};
	
	this.HandleMonsterMovements = function() {
		monsters.forEach(function(mob) {
			if(mob.IsStopped())
				this.MoveEntity(mob, this.GetNextBestHeading(mob.row, mob.col, player.row, player.col)); //move a mob towards player (untested) (this needs to be the animals instead)
		}, this);
	};
	
	this.GetNextBestHeading = function(row_start, col_start, row_end, col_end) {
		return NORTH; //an algorithm for finding the next best heading to travel given a starting point, and ending point and the array of wall locations. (Flood fill or A* potentially).
	};
	
	this.MoveEntity = function(entity, heading) {
		if(this.walls[entity.row][entity.col][heading] === false) entity.Move(heading);
	};
	
	this.SetWall = function(row, col, heading) {
		if(heading === NORTH) {
			this.walls[row][col][NORTH] = true;
			if(row-1 >= 0) this.walls[row-1][col][SOUTH] = true;
			
		} else if(heading === EAST) {
			this.walls[row][col][EAST] = true;
			if(col+1 < WINDOW_WIDTH_CELLS) this.walls[row][col+1][WEST] = true;
			
		} else if(heading === SOUTH) {
			this.walls[row][col][SOUTH] = true;
			if(row+1 < WINDOW_HEIGHT_CELLS) this.walls[row+1][col][NORTH] = true;
		
		} else if(heading === WEST) {
			this.walls[row][col][WEST] = true;
			if(row-1 >= 0) this.walls[row][col-1][EAST] = true;
		}
	};
	
}