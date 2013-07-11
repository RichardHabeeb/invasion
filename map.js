function Map() {
	this.number_of_updates = 0;
	this.size_r = WINDOW_HEIGHT_CELLS;
	this.size_c = WINDOW_WIDTH_CELLS;
	this.entities; //a 2d array of monster entities
	this.walls; //a 2d array of logical walls and blocks
	this.items; //a 2d array of items
	this.monster_count = 0;
	this.item_count = 0;
	this.player;
	this.cow;
	
	this.time_map_created = (new Date()).getTime();
	
	this.background_layer = new Kinetic.Layer();
	this.items_layer = new Kinetic.Layer();
	this.monster_layer = new Kinetic.Layer();
	this.player_layer = new Kinetic.Layer();
	this.walls_layer = new Kinetic.Layer();
	
	this.GenerateTerrain = function() {
		var num_barriers = MAP_MIN_BARRIERS+Math.floor(Math.random()*(MAP_MAX_BARRIERS-MAP_MIN_BARRIERS));
		
		for(var i = 0; i < num_barriers; i++) {
			var cell = this.GetRandomOpenCell();
			this.AddBarrier(cell["r"], cell["c"]);
		}
	};
	
	
	this.SetupWalls = function() {
		this.walls = new Array();
		for(var r = 0; r < this.size_r; r++) {
			this.walls[r] = new Array();
			for(var c = 0; c < this.size_c; c++) {
				this.walls[r][c] = { //Put walls on the outer edges.
					NORTH: 	(r == 0) ? true : false,
					EAST:	(c == this.size_c-1) ? true : false,
					SOUTH:	(r == this.size_r-1) ? true : false,
					WEST:	(c == 0) ? true : false,
					BLOCKED: false,
					IMAGE:	 new MapCell(this.walls_layer, r, c)
				};
			}
		}
	};

	
	this.SetupItems = function() {
		this.items = new Array();
		this.item_count = 0;
		for(var r = 0; r < this.size_r; r++) {
			this.items[r] = new Array();
			for(var c = 0; c < this.size_c; c++) {
				this.items[r][c] = null;
			}
		}
	};
	
	
	this.SetupEntities = function() {
		this.entities = new Array();
		this.monster_count = 0;
		for(var r = 0; r < this.size_r; r++) {
			this.entities[r] = new Array();
			for(var c = 0; c < this.size_c; c++) {
				this.entities[r][c] = null;
			}
		}
	
	};
	
	
	this.SetupPlayer = function() {
		var spawn_cell = this.GetRandomSpawnCell();
		this.player = new Entity(this.player_layer, spawn_cell["r"], spawn_cell["c"], null);
		this.player.health = 100;
		this.player.imageObj.src = PLAYER_IMAGE;
		
	};
	
	
	this.SetupCow = function() {
		var spawn_cell = this.GetRandomSpawnCell();
		this.cow = new Entity(this.player_layer, Math.floor(this.size_r/2), Math.floor(this.size_c/2), null);
		this.cow.health = 100;
		this.cow.move_time = 2;
		this.cow.imageObj.src = COW_IMAGE;
	};
	
	
	this.SetupMapOnStage = function(stage) {
		if(typeof stage === "object") {
			stage.add(this.background_layer);
			stage.add(this.items_layer);
			stage.add(this.monster_layer);
			stage.add(this.player_layer);
			stage.add(this.walls_layer);
			this.background_layer.draw();
			this.items_layer.draw();
			this.monster_layer.draw();
			this.player_layer.draw();
			this.walls_layer.draw();
		} else alert("Error setting up " + (typeof stage));
	};
	
	
	this.GetCellInHeading = function(r,c,heading) {
				if(heading == NORTH) 	return {"r": Math.max(r-1, 0), 				"c":c};
		else 	if(heading == EAST ) 	return {"r": r, 							"c": Math.min(c+1, this.size_c-1)};
		else 	if(heading == SOUTH) 	return {"r": Math.min(r+1, this.size_r-1), 	"c":c};
		else 					   		return {"r": r, 							"c": Math.max(c-1, 0)};
	};
	
	
	this.IsValidSpawnCell = function(cell_r, cell_c) { //On the map, on the edge. not blocked, not occupied
		return !( 	cell_r < 0 || 	
					cell_r >= this.size_r ||
					cell_c < 0 ||
					cell_c >= this.size_c ||
					(	
						cell_r >= MAP_EDGE_SPAWN_ZONE && 
						cell_r < this.size_r-MAP_EDGE_SPAWN_ZONE &&
						cell_c >= MAP_EDGE_SPAWN_ZONE && 
						cell_c < this.size_r-MAP_EDGE_SPAWN_ZONE
					) ||
					(
						this.walls[cell_r][cell_c][NORTH] && 
						this.walls[cell_r][cell_c][EAST] && 
						this.walls[cell_r][cell_c][SOUTH] && 
						this.walls[cell_r][cell_c][WEST]
					) ||
					this.walls[cell_r][cell_c][BLOCKED] ||
					this.entities[cell_r][cell_c] != null
				);
	};
	
	
	this.IsValidOpenCell = function(cell_r, cell_c) { //on the map, no walls, barriers, or entites.
		return ( 	(cell_r >= 0 && 	
					cell_r < this.size_r &&
					cell_c >= 0 &&
					cell_c < this.size_c) &&
					!this.walls[cell_r][cell_c][NORTH]   &&
					!this.walls[cell_r][cell_c][EAST]    &&
					!this.walls[cell_r][cell_c][SOUTH]   && 
					!this.walls[cell_r][cell_c][WEST]    &&
					!this.walls[cell_r][cell_c][BLOCKED] &&
					this.entities[cell_r][cell_c] == null
				);
	};
	
	
	this.GetRandomSpawnCell = function() { //This needs improvement...
		//get random valid starting point.
		var cell_c = null;
		var cell_r = null;
		
		while(cell_c == null || cell_r == null || !this.IsValidSpawnCell(cell_r, cell_c))
		{	 
			cell_r = Math.floor(Math.random()*this.size_r);
			cell_c = Math.floor(Math.random()*this.size_c);
		}
		return {"r": cell_r, "c": cell_c};
	};
	
	
	this.GetRandomOpenCell = function() { //This needs improvement...
		//get random valid starting point.
		var cell_c = null;
		var cell_r = null;
		
		while(cell_c == null || cell_r == null || !this.IsValidOpenCell(cell_r, cell_c))
		{	 
			cell_r = Math.floor(Math.random()*this.size_r);
			cell_c = Math.floor(Math.random()*this.size_c);
		}
		return {"r": cell_r, "c": cell_c};
	};
	
	
	this.GetNumberOfSpawnableAdjacentCells = function(r, c) {
		var count = 0;
		if(this.IsValidSpawnCell(r+1, c)) count++;
		if(this.IsValidSpawnCell(r-1, c))  count++;
		if(this.IsValidSpawnCell(r, c+1)) count++;
		if(this.IsValidSpawnCell(r, c-1))  count++;
		return count;
	};
	
	
	this.GreedySearchForValidSpawnCell = function(size) {
		
		var tested_cells = new Array();
		for(var r = 0; r < this.size_r; r++) {
			tested_cells[r] = new Array();
			for(var c = 0; c < this.size_c; c++) {
				tested_cells[r][c] = false;
			}
		}
	
		var temp_cell = this.GetRandomSpawnCell();
		pivot_cell_r = temp_cell["r"];
		pivot_cell_c = temp_cell["c"];
		
		var spawn_pivot_cell_valid = (size == 1) ? true : false; // we are good if only one thing needs spawning.
		
		while(!spawn_pivot_cell_valid) {
			tested_cells[pivot_cell_r, pivot_cell_c] = true;
			if(this.GetNumberOfSpawnableAdjacentCells(pivot_cell_r, pivot_cell_c) >= size-1) spawn_pivot_cell_valid = true;
			else {
				var next_r = pivot_cell_r;
				var next_c = pivot_cell_c;
				var next_best_num_open_cells = 0;
				var temp_next;
				
				var headings = new Array(NORTH,EAST,SOUTH,WEST);
				
				for(var i = 0; i < headings.length; i++) {
				
					var cell = this.GetCellInHeading(pivot_cell_r, pivot_cell_c, headings[i]);
					
					if((cell["r"] != pivot_cell_r || cell["c"] != pivot_cell_c) &&
						!tested_cells[cell["r"]][cell["c"]] && 
						this.IsValidSpawnCell(cell["r"], cell["c"]) && 
						(temp_next = this.GetNumberOfSpawnableAdjacentCells(cell["r"], cell["c"])) > next_best_num_open_cells)
					{
						next_best_num_open_cells = temp_next;
						next_r = cell["r"];
						next_c = cell["c"];
					}
				}
				
				
				if(next_best_num_open_cells == 0) {
					//Check to make sure an unchecked spawn cell still exists.
					var spawn_cells_dont_exist = true;
					for(var r = 0; r < this.size_r; r++) {
						for(var c = 0; c < this.size_c; c++) {
							if(!tested_cells[r][c] && IsValidSpawnCell(r,c)) {
								spawn_cells_dont_exist = false;
								break;
							}
						}
					}
					
					if(spawn_cells_dont_exist) {
						console.log("No valid spawn cell exists for this size.");
						return null;
					}
					else {
						var temp_cell;
						do {
							temp_cell = this.GetRandomSpawnCell();
						} while(tested_cells[temp_cell["r"]][temp_cell["c"]]);
					}
					
				} else {
					pivot_cell_r = next_r;
					pivot_cell_c = next_c;
				}
					
				
			
			}
		}
		
		return {"r": pivot_cell_r, "c": pivot_cell_c};
	};
	
	
	this.SpawnMob = function(r, c) {
		var mob = new Entity(this.monster_layer, r, c, this.cow);
		mob.move_time = 1;
		mob.imageObj.src = ALIEN_IMAGES[Math.floor(Math.random()*ALIEN_IMAGES.length)];
		this.entities[mob.row][mob.col] = mob;
		this.monster_count++;
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
				
				NEEDS TESTING!
				also needs the group mob spawn functionality to be finished up.
		*/
		
		//the probability of spawning an alien horde is proportional to the # of aliens available to spawn as well as the time since the player was last damaged.
		if(this.monster_count < TOTAL_MOB_CAP && Math.random() > (this.monster_count/TOTAL_MOB_CAP )) { 
			
			//the number of mobs that are spawned is based in part on the time since the player was last damaged. (always at least one).
			var number_of_mobs_to_spawn = Math.ceil(Math.random()*Math.min(((new Date()).getTime() - this.player.time_of_last_hit)/(15.0*1000), 1.0)*Math.min(TOTAL_MOB_CAP - this.monster_count, TOTAL_MOB_SPAWN_GROUP));
			
			//search for open area near the edge. greedy style.
			var spawn_cell = this.GreedySearchForValidSpawnCell(number_of_mobs_to_spawn);
			if(spawn_cell != null) { 
			
				//spawn teh mobs!
				this.SpawnMob(spawn_cell["r"], spawn_cell["c"]);
				number_of_mobs_to_spawn--;
				
				var spawn_cell_area = new Array(NORTH,EAST,SOUTH,WEST);
				
				
				for(var i = 0; i < Math.min(number_of_mobs_to_spawn,spawn_cell_area.length); i++) {
					
					var roll = Math.floor(Math.random()*spawn_cell_area.length);
					
					var spawn_cell_local = this.GetCellInHeading(spawn_cell["r"], spawn_cell["c"],spawn_cell_area[roll]);
					
					if((spawn_cell_local["r"] != spawn_cell["r"] || spawn_cell_local["c"] != spawn_cell["c"]) && 
						this.IsValidSpawnCell(spawn_cell_local["r"], spawn_cell_local["c"])) 
					{
						
						this.SpawnMob(spawn_cell_local["r"], spawn_cell_local["c"]);
					} else {
						i--; //yeah this is kinda silly, but it works.
					}
					
					spawn_cell_area.splice(roll);
					
				}
				
			}
		}
	};
	
	
	this.HandleMonsterMovements = function() {
		for(var r = 0; r < this.size_r; r++) {
			for(var c = 0; c < this.size_c; c++) {
				var mob = this.entities[r][c];
				if(mob != null && mob.target != null && mob.IsStopped() && Math.random() > 0.5) {
					this.MoveEntity(mob, this.GetNextBestHeading(mob.row, mob.col, mob.target.row, mob.target.col)); //move a mob towards player (untested) (this needs to be the animals instead)
				}
			}
		}
	};
	
	
	this.HandleCowMovement = function() {
		if(this.cow.IsStopped() && Math.random() > 0.5) {
			var headings = [NORTH,EAST,SOUTH,WEST];
			this.MoveEntity(this.cow, headings[Math.floor(Math.random()*headings.length)]);
		}
	}
	
	
	this.FloodMaze = function(row_start, col_start, row_end, col_end) {
		var flooded_map = new Array();
		for(var r = 0; r < this.size_r; r++) {
			flooded_map[r] = new Array();
			for(var c = 0; c < this.size_c; c++) {
				flooded_map[r][c] = UNASSIGNED_FLOOD_DEPTH;
			}
		}

		flooded_map[row_end][col_end] = 0;
		var flood_change = true;
		
		// Flood from the goal of the maze towards the current position
		for(var frontier_depth = 1; frontier_depth < MAX_FRONTIER_DEPTH; frontier_depth++) 
		{
			if(!flood_change) return; //dead end check
			else flood_change = false;
			
			for(var r = 0; r < this.size_r; r++)
			{
				for(var c = 0; c < this.size_c; c++)
				{ 
					if((flooded_map[r][c] == UNASSIGNED_FLOOD_DEPTH) && !this.walls[r][c][BLOCKED] && (this.entities[r][c] == null || row_start == r && col_start == c) && (
					(r+1 < this.size_r		&& (flooded_map[r+1][c] == frontier_depth-1) && !this.walls[r][c][SOUTH]) ||
					(r-1 >= 0			 	&& (flooded_map[r-1][c] == frontier_depth-1) && !this.walls[r][c][NORTH]) ||
					(c+1 < this.size_c 		&& (flooded_map[r][c+1] == frontier_depth-1) && !this.walls[r][c][EAST] ) ||
					(c-1 >= 0	 			&& (flooded_map[r][c-1] == frontier_depth-1) && !this.walls[r][c][WEST] ) ))
					{
						flooded_map[r][c] = frontier_depth; //the next cell's depth is the current cell's depth + 1
						flood_change = true;
						if(row_start == r && col_start == c) return flooded_map; // made it to the goal so we've flooded enough
					}
				}
			}
		} // end of frontier depth 'for' loop
	    
	};
	
	
	this.GetNextBestHeading = function(row_start, col_start, row_end, col_end) {
	    var flooded_map = this.FloodMaze(row_start, col_start, row_end, col_end);
		
		var next_best_heading = NORTH;

		if(flooded_map != null) {
			var headings = new Array(NORTH,EAST,SOUTH,WEST);
			
			var next_best_cell = {"r": row_start, "c": col_start};
			
			for(var i = 0; i < headings.length; i++) {
				var cell = this.GetCellInHeading(row_start, col_start, headings[i]);
				
				if(flooded_map[next_best_cell["r"]][next_best_cell["c"]] > flooded_map[cell["r"]][cell["c"]]) {
					next_best_cell = {"r": cell["r"], "c": cell["c"]};
					next_best_heading = headings[i];
				}
					
			}
			
		} else {
			//if no direct path is found just go directly towards the goal. Wall checking maybe necesarry here.
			if(row_start > row_end) next_best_heading = NORTH;
			if(row_start < row_end) next_best_heading = SOUTH;
			if(col_start > col_end) next_best_heading = WEST;
			if(col_start < col_end) next_best_heading = EAST;
		}
		return next_best_heading; //an algorithm for finding the next best heading to travel given a starting point, and ending point and the array of wall locations. (Flood fill or A* potentially).
	};
	
	

	this.MoveEntity = function(entity, heading) {
		var adjacent = this.GetCellInHeading(entity.row,entity.col,heading);
		
		if(adjacent["r"] != entity.row || adjacent["c"] != entity.col) {
			
			if(	this.walls[entity.row][entity.col][heading] === false &&
				this.walls[adjacent["r"]][adjacent["c"]][BLOCKED] === false &&
				this.entities[adjacent["r"]][adjacent["c"]] === null &&
				entity.loaded && entity.IsStopped())
			{
				this.entities[entity.row][entity.col] = null;
				entity.Move(heading);
				this.entities[entity.row][entity.col] = entity;
			}
				
		}
			

	};
	
	
	this.SetWall = function(row, col, heading) {
		if(heading === NORTH) {
			this.walls[row][col][NORTH] = true;
			if(row-1 >= 0) this.walls[row-1][col][SOUTH] = true;
			
		} else if(heading === EAST) {
			this.walls[row][col][EAST] = true;
			if(col+1 < this.size_c) this.walls[row][col+1][WEST] = true;
			
		} else if(heading === SOUTH) {
			this.walls[row][col][SOUTH] = true;
			if(row+1 < this.size_r) this.walls[row+1][col][NORTH] = true;
		
		} else if(heading === WEST) {
			this.walls[row][col][WEST] = true;
			if(row-1 >= 0) this.walls[row][col-1][EAST] = true;
		}
	};
	
	
	this.AddBarrier = function(r, c) {
		if(!this.IsValidOpenCell(r, c) || this.walls[r][c][IMAGE] == null) return false;
		
		this.walls[r][c][BLOCKED] = true;
		this.walls[r][c][IMAGE].PushImage(BARRIER_IMAGES[Math.floor(Math.random()*BARRIER_IMAGES.length)]);
		
		return true;
	};
	
	
}