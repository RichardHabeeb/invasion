/**
 * INVASION
 * FILE: map.js
 * AUTHORS: Richard Habeeb, Addison Shaw 
 * TODO:
 *  -Adjust monster movement flooding to optimize speed.
 *  -Improve terrain generation
 *  -Add background terrain generation
 *  -Fix fence glitches
 *  -Improve non-flooded heading finding algorithm
 *  -Fix spawn edge zone bug
 *  -handle monster item drops
 *  -change the ["r"] stuff to .r
 **/

function Map() {
	this.number_of_updates = 0;
	this.size_r = WINDOW_HEIGHT_CELLS;
	this.size_c = WINDOW_WIDTH_CELLS;
	this.entities; //a 2d array of monster entities
	this.walls; //a 2d array of logical walls and blocks
	this.items; //a 2d array of items
	this.monster_count = 0;
	this.item_count = 0;
	this.tazer_count = 0;
	this.laser_vision_count = 0;
	this.repair_kit_count = 0;
	this.bomb_count = 0;
	this.player;
	this.cow;
	
	this.time_map_created = (new Date()).getTime();
	
	this.background_layer = new Kinetic.Layer();
	this.items_layer = new Kinetic.Layer();
	this.monster_layer = new Kinetic.Layer();
	this.player_layer = new Kinetic.Layer();
	this.walls_layer = new Kinetic.Layer();
	this.anim_layer = new Kinetic.Layer();
	
	
	this.GenerateTerrain = function() {
		
		this.GenerateAnimalPen(this.cow.row, this.cow.col);
		
		var num_barriers = MAP_MIN_BARRIERS + Math.floor(Math.random()*(MAP_MAX_BARRIERS-MAP_MIN_BARRIERS));
		
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
					LOCKED: false,
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
		this.player.AddItem(new Item("TAZER", this.items_layer, this.anim_layer));
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
			stage.add(this.anim_layer);
			this.background_layer.draw();
			this.items_layer.draw();
			this.monster_layer.draw();
			this.player_layer.draw();
			this.walls_layer.draw();
			this.anim_layer.draw();
		} else alert("Error setting up " + (typeof stage));
	};
	
	
	this.EntityAttack = function(entity) {
		var cells_affected = entity.Attack();
		if(cells_affected != null) {
			for(var i = 0; i < cells_affected.length; i++) {
				var ent;
				if((ent = this.entities[cells_affected[i].r][cells_affected[i].c]) != null)  {
					if(ent.TakeDamage(cells_affected[i].damage) <= 0) {
						this.entities[cells_affected[i].r][cells_affected[i].c] = null;
						this.monster_count--;
					}
				}
			}
		}
	}
	
	
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
	
	
	// Can't we just merge this into the generic open cell function?
	// I don't want to have to create another one of these for random item generation too.
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
				if(mob != null && mob.target != null && Math.random() > 0.5 && mob.IsStopped()) {
					this.MoveEntity(mob, this.GetNextBestHeading(mob.row, mob.col, mob.target.row, mob.target.col, false)); //move a mob towards player (untested) (this needs to be the animals instead)
				}
			}
		}
	};
	
	
	this.HandleCowMovement = function() {
		if(this.cow.IsStopped() && Math.random() > 0.5) {
			var headings = [NORTH,EAST,SOUTH,WEST];
			this.MoveEntity(this.cow, headings[Math.floor(Math.random()*headings.length)]);
		}
	};
	
	
	this.HandleItemSpawning = function() {
		/*
			Similarly to monster spawning we should only have a certain number of items on the map at any time.
			We'll want to have bias probablities for spawning each item
			
			meaning bombs will spawn the most, as a single use item
			swords will be slightly better as reusible items followed by the machine gun which should have ammo.
			
			The bias probablities will only come into play if an item can be spawned
			
			An item *can* be spawned 
				-if there is an open *valid* space, no groups so this shouldn't be tough
				
				-if there is not more than a certain number of that item (Bombs could probably have 2 on the map? This does not include items that have been placed.)
					So if you drop a bomb as an attack, new bombs can still spawn. We can have a flag to know whether or not the item is dropped.
					If you kill a monster, it has a probablity to drop from it's inventory. This should not affect normal item spawning probablity.	
		*/
		
		if(this.item_count < TOTAL_ITEM_CAP && Math.random() > (this.item_count/TOTAL_ITEM_CAP )) { 
		
			var spawn_cell = this.GreedySearchForValidSpawnCell(1);
			
			//valid space
			if(spawn_cell != null) { 
				//Get random item
				var randItem = new Item(ITEM_ARRAY[Math.floor(Math.random()* (ITEM_ARRAY.length))], this.items_layer, this.anim_layer);
				var itemLimit = -1;
				
				//Get item limit
				switch(randItem.key)
				{
					case "TAZER": 
						itemLimit = this.tazer_count;
						break;
					case "LASER_VISION":
						itemLimit = this.laser_vision_count;
						break;
					case "REPAIR_KIT":
						itemLimit = this.repair_kit_count;
						break;
					case "BOMB":
						itemLimit = this.bomb_count;
				}
				
				// Get item bias probablity -- spawn item
				if (ITEM_SPAWN_LIMITS[randItem.key] != itemLimit)
				{
					var test = ITEM_PROBS[randItem.key];
					var test2 = Math.floor(Math.random() * 100);
					if (test2 <= test)
						randItem.ShowImageOnMap(spawn_cell["r"], spawn_cell["c"]);
				}
			}
		}	
	};
	
	
	this.FloodMaze = function(row_start, col_start, row_end, col_end, ignore_entities) {
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
					if	(	flooded_map[r][c] == UNASSIGNED_FLOOD_DEPTH && 
							!this.walls[r][c][BLOCKED] && 
							(
								this.entities[r][c] == null || 
								(row_start == r && col_start == c) ||
								ignore_entities
							) && 
							(
								(r+1 < this.size_r		&& (flooded_map[r+1][c] == frontier_depth-1) && !this.walls[r][c][SOUTH]) ||
								(r-1 >= 0			 	&& (flooded_map[r-1][c] == frontier_depth-1) && !this.walls[r][c][NORTH]) ||
								(c+1 < this.size_c 		&& (flooded_map[r][c+1] == frontier_depth-1) && !this.walls[r][c][EAST] ) ||
								(c-1 >= 0	 			&& (flooded_map[r][c-1] == frontier_depth-1) && !this.walls[r][c][WEST] ) 
							)
						)
					{
						flooded_map[r][c] = frontier_depth; //the next cell's depth is the current cell's depth + 1
						flood_change = true;
						if(row_start == r && col_start == c) return flooded_map; // made it to the goal so we've flooded enough
					}
				}
			}
		} // end of frontier depth 'for' loop
	    
	};
	
	
	this.GetNextBestHeading = function(row_start, col_start, row_end, col_end, ignore_entities) {
	    var flooded_map = this.FloodMaze(row_start, col_start, row_end, col_end, ignore_entities);
		
		var next_best_heading = NORTH;

		if(flooded_map != null) {
			var headings = new Array(NORTH,EAST,SOUTH,WEST);
			
			var next_best_cell = {"r": row_start, "c": col_start};
			
			for(var i = 0; i < headings.length; i++) {
				var cell = this.GetCellInHeading(row_start, col_start, headings[i]);
				
				if(	
					!this.walls[row_start][col_start][headings[i]] && 
					!this.walls[cell["r"]][cell["c"]][BLOCKED] && 
					(this.entities[cell["r"]][cell["c"]] == null || ignore_entities) &&
					flooded_map[next_best_cell["r"]][next_best_cell["c"]] > flooded_map[cell["r"]][cell["c"]]
				  ) 
				{
					next_best_cell = {"r": cell["r"], "c": cell["c"]};
					next_best_heading = headings[i];
				}
					
			}
			
		} else if(!ignore_entities) {
			
			next_best_heading = this.GetNextBestHeading(row_start, col_start, row_end, col_end, true);
			
		} else {
			//if no direct path is found just go directly towards the goal. Wall checking maybe necessary here.
			
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
		
			if(entity.loaded && entity.IsStopped()) {
			
				if(	this.walls[entity.row][entity.col][heading] === false &&
					this.walls[adjacent["r"]][adjacent["c"]][BLOCKED] === false &&
					this.entities[adjacent["r"]][adjacent["c"]] === null
				)
				{
					this.entities[entity.row][entity.col] = null;
					entity.Move(heading);
					this.entities[entity.row][entity.col] = entity;
				} else {
					entity.FaceHeading(heading);
				
				}
			}
		}
			

	};
	
	
	this.SetWall = function(row, col, heading) {
		this.walls[row][col][heading] = true;
		this.UpdateFenceImage(row, col);
		
		if(heading === NORTH) {
			if(row-1 >= 0) this.walls[row-1][col][SOUTH] = true;
			this.UpdateFenceImage(row-1, col);
			
		} else if(heading === EAST) {
			if(col+1 < this.size_c) this.walls[row][col+1][WEST] = true;
			this.UpdateFenceImage(row, col+1);
			
		} else if(heading === SOUTH) {
			if(row+1 < this.size_r) this.walls[row+1][col][NORTH] = true;
			this.UpdateFenceImage(row+1, col);
		
		} else if(heading === WEST) {
			if(row-1 >= 0) this.walls[row][col-1][EAST] = true;
			this.UpdateFenceImage(row, col-1);
		}
	};
	
	
	this.AddBarrier = function(r, c) {
		if(!this.IsValidOpenCell(r, c) || this.walls[r][c][IMAGE] == null) return false;
		
		this.walls[r][c][BLOCKED] = true;
		this.walls[r][c][IMAGE].PushImage(BARRIER_IMAGES[Math.floor(Math.random()*BARRIER_IMAGES.length)]);
		
		return true;
	};
	
	this.UpdateFenceImage = function(r, c) {
		if(r >= 0 && r < this.size_r && c >= 0 && c < this.size_c) {
			if(this.walls[r][c][NORTH]) this.UpdateFenceImage(r-1, c); //wall images are only south and east.
			if(this.walls[r][c][WEST]) this.UpdateFenceImage(r, c-1);
			
			if(this.walls[r][c][SOUTH] || this.walls[r][c][EAST]) {
				var image_string = (this.walls[r][c][SOUTH]) ? "images/fence-south" : "images/fence";
				image_string = (this.walls[r][c][EAST]) ? image_string+"-east.png" : image_string+".png";
				
				this.walls[r][c][IMAGE].PushImage(image_string);
			}
		}
	};
	
	this.GenerateAnimalPen = function(center_point_r, center_point_c) {
		var headings = [NORTH,EAST,SOUTH,WEST];
		
		//setup cow pen
		var fence_size_c = MAP_COWPEN_MIN_DIM + Math.floor(Math.random() * (MAP_COWPEN_MAX_DIM - MAP_COWPEN_MIN_DIM));
		var fence_size_r = MAP_COWPEN_MIN_DIM + Math.floor(Math.random() * (MAP_COWPEN_MAX_DIM - MAP_COWPEN_MIN_DIM));
		
		var fence_opening_side = headings[Math.floor(Math.random() * headings.length)];
		var fence_opening_size = 1;
		if(fence_opening_side == NORTH || fence_opening_side == SOUTH) 
			fence_opening_size = 1 + Math.floor(Math.random() * (fence_size_r - 1));
			
		if(fence_opening_side == EAST || fence_opening_side == WEST) 
			fence_opening_size = 1 + Math.floor(Math.random() * (fence_size_c - 1));
		
		var start_corner_r = center_point_r-Math.round(fence_size_r/2);
		var start_corner_c = center_point_c-Math.round(fence_size_c/2);
		
		
		for(var r = start_corner_r; r < start_corner_r+fence_size_r; r++) {
			if((fence_opening_side == WEST && r > start_corner_r+fence_opening_size-1) || fence_opening_side != WEST) 
				this.SetWall(r, start_corner_c, WEST);
				
			if((fence_opening_side == EAST && r > start_corner_r+fence_opening_size-1) || fence_opening_side != EAST) 
				this.SetWall(r, start_corner_c+fence_size_c-1, EAST);
		}
		for(var c = start_corner_c; c < start_corner_c+fence_size_c; c++) {
			if((fence_opening_side == NORTH && c > start_corner_c+fence_opening_size-1) || fence_opening_side != NORTH) 
				this.SetWall(start_corner_r, c, NORTH);
				
			if((fence_opening_side == SOUTH && c > start_corner_c+fence_opening_size-1) || fence_opening_side != SOUTH)  
				this.SetWall(start_corner_r+fence_size_r-1, c, SOUTH);
		}
	}
	
}