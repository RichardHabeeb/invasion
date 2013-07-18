/**
 * map.js
 *
 * TODO:
 *  -Adjust monster movement flooding to optimize speed.
 *  -Improve terrain generation
 *  -Add background terrain generation
 *  -Fix fence glitches
 *  -change the ["r"] stuff to .r 
 * 
 * @class The map controller
 * @author Richard Habeeb, Addison Shaw 
 **/
function Map(hud) {
	this.hud 				= hud;
	this.size_r 			= WINDOW_HEIGHT_CELLS;
	this.size_c 			= WINDOW_WIDTH_CELLS;
	this.entities; 			//a 2d array of all entities
	this.walls; 			//a 2d array of logical walls and blocks
	this.items; 			//a 2d array of items
	this.player;			//reference to the player
	this.cow;				//reference to the cow
	this.monster_count 		= 0;
	this.background_layer 	= new Kinetic.Layer();
	this.items_layer 		= new Kinetic.Layer();
	this.monster_layer 		= new Kinetic.Layer();
	this.player_layer 		= new Kinetic.Layer();
	this.walls_layer 		= new Kinetic.Layer();
	this.anim_layer 		= new Kinetic.Layer();
	this.time_map_created 	= (new Date()).getTime();
	this.item_count 		= 0;
	this.items_count		= {};


	/**
	 * Configure the map onto the KineticJS stage.
	 * @param {Kinetic.Stage} stage
	 */
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
	
	
	/**
	 * Reinitalize the walls property.
	 */
	this.SetupWalls = function() {
		this.walls = new Array();
		for(var r = 0; r < this.size_r; r++) {
			this.walls[r] = new Array();
			for(var c = 0; c < this.size_c; c++) {
				this.walls[r][c] = { //Put walls on the outer edges.
					NORTH: 	(r == 0),
					EAST:	(c == this.size_c-1),
					SOUTH:	(r == this.size_r-1),
					WEST:	(c == 0),
					BLOCKED: false,
					LOCKED: false,
					IMAGE:	 new MapCell(this.walls_layer, r, c)
				};
			}
		}
	};
	
	
	/**
	 * Reinitalize the entities property.
	 */
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
	
	
	/**
	 * Reinitalize the items_count,item_count,items properties.
	 */
	this.SetupItems = function() {
		for(var item in ITEM_DICT) {
			this.items_count[item] = 0;
		}
	
		this.items = new Array();
		this.item_count = 0;
		for(var r = 0; r < this.size_r; r++) {
			this.items[r] = new Array();
			for(var c = 0; c < this.size_c; c++) {
				this.items[r][c] = null;
			}
		}
	};
	
	
	/**
	 * Add the cow entity to the map.
	 */
	this.SetupCow = function() {
		var spawn_cell = this.GetRandomSpawnCell();
		this.cow = new Entity(this.player_layer, Math.floor(this.size_r/2), Math.floor(this.size_c/2), null);
		this.cow.type = COW;
		this.cow.health = 1000;
		this.cow.max_health = 1000;
		this.cow.move_time = 2;
		this.cow.imageObj.src = COW_IMAGE;
	};
	
	
	/**
	 * Add the player entity to the map.
	 */
	this.SetupPlayer = function() {
		var spawn_cell = this.GetRandomSpawnCell();
		this.player = new Entity(this.player_layer, spawn_cell["r"], spawn_cell["c"], null);
		this.player.type = PLAYER;
		this.player.health = 100;
		this.player.max_health = 100;
		this.player.imageObj.src = PLAYER_IMAGE;
		this.player.AddItem(new Item("TAZER", this.items_layer, this.anim_layer, this));
	};
	
	
	/**
	 * Add all the barriers, and the fence to the map.
	 */
	this.GenerateTerrain = function() {
		
		this.GenerateAnimalPen(this.cow.row, this.cow.col);
		
		var num_barriers = MAP_MIN_BARRIERS + Math.floor(Math.random()*(MAP_MAX_BARRIERS-MAP_MIN_BARRIERS));
		
		for(var i = 0; i < num_barriers; i++) {
			var cell = this.GetRandomOpenCell();
			this.AddBarrier(cell["r"], cell["c"]);
		}
	};
	
	
	/**
	 * Initate and handle an entity attack.
	 * @param {Entity} entity
	 */
	this.EntityAttack = function(entity) {
		var cells_affected = entity.Attack();
		if(cells_affected != null) {
			for(var i = 0; i < cells_affected.length; i++) {
				var attacked_ent;
				if((attacked_ent = this.entities[cells_affected[i].r][cells_affected[i].c]) != null)  {
					if(attacked_ent.TakeDamage(cells_affected[i].damage, entity) <= 0) {
						entity.kills++;
						this.entities[cells_affected[i].r][cells_affected[i].c] = null;
						if(attacked_ent.type == MOB) {
							this.monster_count--;
						} else if(attacked_ent.type == PLAYER || attacked_ent.type == COW) {
							GameOver();
						}
						
					}
					
					if(attacked_ent.type == PLAYER || attacked_ent.type == COW) this.hud.UpdateStats(attacked_ent);
				}
			}
		}
		
		if(entity.type == PLAYER || entity.type == COW) this.hud.UpdateStats(entity);
	};
	
	
	/**
	 * Initate and handle an entity healing.
	 * @param {Entity} entity
	 */
	this.EntityHeal = function(entity) {
		if (entity.single_use_repairs.length > 0) {
			entity.AddHealth(REPAIR_KIT.buff_amount)
			this.hud.UpdateStats(entity);
		}
	};
	
	
	/**
	 * Handle when and where a monster gets spawned. This method is called on an interval from gameplay.js.
	 * Factors that affect the monster spawning: 
	 *  # of aliens on map,
	 *  player health,
	 *  player health lost since last spawn handling,
	 *  time since last player damage,
	 *  the "power" of the player (possibly determined by item strength),
	 *  distance of player from the cow
	 */
	this.HandleMonsterSpawning = function() {

		//the probability of spawning an alien horde is proportional to the # of aliens available to spawn as well as the time since the player was last damaged.
		if(this.monster_count < TOTAL_MOB_CAP && Math.random() > (this.monster_count/TOTAL_MOB_CAP )) { 
			
			//the number of mobs that are spawned is based in part on the time since the player was last damaged. (always at least one).
			var number_of_mobs_to_spawn = Math.ceil(Math.random()*Math.min(((new Date()).getTime() - this.player.time_of_last_hit)/(15.0*1000), 1.0)*Math.min(TOTAL_MOB_CAP - this.monster_count, TOTAL_MOB_SPAWN_GROUP));
			
			//search for open area near the edge. greedy style.
			var spawn_cell = this.GreedySearchForValidSpawnCell(number_of_mobs_to_spawn);
			if(spawn_cell != null) { 
			
				//We found a valid place to spawn our group. Now we spawn!
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
						i--; //yeah this is kinda silly, but it works. This is to make sure we don't keep looking the some direction to spawn a mob.
					}
					
					spawn_cell_area.splice(roll);
					
				}
				
			}
		}
	}; //END HandleMonsterSpawning
	
	
	/**
	 * Handle when and where an item gets spawned. This method is called on an interval from gameplay.js.
	 * 	Similarly to monster spawning we should only have a certain number of items on the map at any time.
	 *		We'll want to have bias probablities for spawning each item
	 *		
	 *		meaning bombs will spawn the most, as a single use item
	 *		swords will be slightly better as reusible items followed by the machine gun which should have ammo.
	 *		
	 *		The bias probablities will only come into play if an item can be spawned
	 *		
	 *		An item *can* be spawned 
	 *			-if there is an open *valid* space, no groups so this shouldn't be tough
	 *			
	 *			-if there is not more than a certain number of that item (Bombs could probably have 2 on the map? This does not include items that have been placed.)
	 *				So if you drop a bomb as an attack, new bombs can still spawn. We can have a flag to know whether or not the item is dropped.
	 *				If you kill a monster, it has a probablity to drop from it's inventory. This should not affect normal item spawning probablity.	
	 */
	this.HandleItemSpawning = function() {

		if(this.item_count < TOTAL_ITEM_CAP && Math.random() > (this.item_count/TOTAL_ITEM_CAP )) { 
		
			var spawn_cell = this.GreedySearchForValidSpawnCell(1);
			
			//valid space
			if(spawn_cell != null) { 
				//Get random item
				var randItem = new Item(ITEM_ARRAY[Math.floor(Math.random()* (ITEM_ARRAY.length))], this.items_layer, this.anim_layer, this);
				
				
				// Get item bias probablity -- spawn item
				if (this.items_count[randItem.key] != randItem.item_limit)
				{
					if (ITEM_PROBS[randItem.key] <= Math.floor(Math.random() * 100)) {
						randItem.ShowImageOnMap(spawn_cell["r"], spawn_cell["c"]);
						this.items_count[randItem.key]++;
						this.item_count++;
					}
						
				}
			}
		}	
	}; //END HandleItemSpawning

	
	/**
	 * Handles the Aliens' movement. This method is called on a periodic inverval.
	 */
	this.HandleAlienMovements = function() {
		for(var r = 0; r < this.size_r; r++) {
			for(var c = 0; c < this.size_c; c++) {
				var mob = this.entities[r][c];
				if(mob != null && mob.target != null && Math.random() > 0.5 && mob.IsStopped()) {
					var next_best_heading = this.GetNextBestHeading(mob.row, mob.col, mob.target.row, mob.target.col, false)
					var next_best_cell = this.GetCellInHeading(r, c, next_best_heading);
					
					this.MoveEntity(mob, next_best_heading);
					
					if(next_best_cell["r"] == mob.target.row && next_best_cell["c"] == mob.target.col) {
						this.EntityAttack(mob);
					}
				}
			}
		}
	};
	
	
	/**
	 * Handles the cow movement. This method is called on a periodic inverval.
	 */
	this.HandleCowMovement = function() {
		if(this.cow.IsStopped() && Math.random() > 0.5) {
			var headings = [NORTH,EAST,SOUTH,WEST];
			this.MoveEntity(this.cow, headings[Math.floor(Math.random()*headings.length)]);
		}
	};
	
	
	/**
	 * Spawn a mob on the map. (This assumes that the passed in cell is valid)
	 * @param {int} r
	 * @param {int} c
	 */
	this.SpawnMob = function(r, c) {
		var mob = new Entity(this.monster_layer, r, c, this.cow);
		var item = this.ProbablyGetItem();
		if (item != null)
			mob.AddItem(item);
			
		mob.AddItem(new Item("CROWBAR", this.items_layer, this.anim_layer, this));
		mob.move_time = 1;
		mob.type = MOB;
		mob.health = 50 + Math.floor(Math.random()*this.player.kills*10);
		mob.max_health = mob.health;
		mob.imageObj.src = ALIEN_IMAGES[Math.floor(Math.random()*ALIEN_IMAGES.length)];
		this.entities[mob.row][mob.col] = mob;
		this.monster_count++;
	};
	
	
	/**
	 * Move an entity in a given heading. This will check for walls and check for item pickups
	 * @param {Entity} entity
	 * @param {string} heading
	 */
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
					
					//check for items in this square of player
					if(entity.type == PLAYER && this.items[entity.row][entity.col] != null) {
						entity.AddItem(this.items[entity.row][entity.col]);
						this.items[entity.row][entity.col].HideImageOnMap();
						this.items_count[this.items[entity.row][entity.col].key]--;
						this.item_count--;
						this.items[entity.row][entity.col] = null;	
					}
					
				} else {
					entity.FaceHeading(heading);
				}
			}
		}
	}; //END MoveEntity
	
	
	/**
	 * Search for a valid spawn cell group and return the center cell. Uses a greedy algorithm (needs more testing).
	 * @param {int} size (max of 5)
	 * @return {"r": int, "c": int} OR null if no cells exist.
	 */
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
		
		var spawn_pivot_cell_valid = (size == 1); // we are good if only one thing needs spawning.
		
		while(!spawn_pivot_cell_valid) {
			
			tested_cells[pivot_cell_r, pivot_cell_c] = true;
			
			if(this.GetNumberOfSpawnableAdjacentCells(pivot_cell_r, pivot_cell_c) >= size-1) {//Check if the cell group is valid
				
				spawn_pivot_cell_valid = true;
			
			} else { //The next location we will check is the MOST OPEN ADJACENT CELL that we haven't checked yet.
				
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
				
				
				if(next_best_num_open_cells == 0) { //If all the adjacent cells are not good for spawning or have been checked (we're trapped)...
					//then we move into a brute force iteration through cells looking for a good start point. 
					//This loses some of the true random of this method, but it is rare that we get trapped. (this needs more testing)
					
					console.log("Testing: GreedySearchForValidSpawnCell got trapped, looking for a new search-entry point.");
					var spawn_cells_dont_exist = true;
					
					for(var r = 0; r < this.size_r; r++) {
						
						
						for(var c = 0; c < this.size_c; c++) {
							
							if(!tested_cells[r][c] && IsValidSpawnCell(r,c)) {
								
								spawn_cells_dont_exist = false;
								next_r = r;
								next_c = c; //found a new starting point for next iteration.
								break;
								
							} else {
								tested_cells[r][c] = true;
							}
						}
						
						if(!spawn_cells_dont_exist) break;
					}
					
					if(spawn_cells_dont_exist) return null;
					
					
				}
				
				pivot_cell_r = next_r;
				pivot_cell_c = next_c;
				
			}
		}
		
		return {"r": pivot_cell_r, "c": pivot_cell_c};
		
	}; //END GreedySearchForValidSpawnCell
	
	
	/**
	 * This algorithm implements a pathfinding algorithm to determine the next best cell given a start cell and end cell.
	 * The algorithm will always return a heading, and it may recurse a single level 
	 * @param {int} row_start The row of the starting cell
	 * @param {int} col_start The col of the starting cell
	 * @param {int} row_end The row of the end cell of the flood. 
	 * @param {int} col_end The row of the end cell of the flood.
	 * @param {bool} ignore_entities This is used for the recursive case where entities are blocking the path.
	 * @return {string} next_best_heading NORTH, SOUTH, EAST, WEST
	 */
	this.GetNextBestHeading = function(row_start, col_start, row_end, col_end, ignore_entities) {
	    var flooded_map = this.FloodMap(row_start, col_start, row_end, col_end, ignore_entities);
		
		var next_best_heading = NORTH;

		if(flooded_map != null) {
			var headings = new Array(NORTH,EAST,SOUTH,WEST);
			
			var next_best_cell = {"r": row_start, "c": col_start};
			
			for(var i = 0; i < headings.length; i++) {
				var cell = this.GetCellInHeading(row_start, col_start, headings[i]);
				
				if(	
					!this.walls[row_start][col_start][headings[i]] && 
					!this.walls[cell["r"]][cell["c"]][BLOCKED] && 
					(this.entities[cell["r"]][cell["c"]] == null || ignore_entities || (cell["r"] == row_end && cell["c"] == col_end)) &&
					flooded_map[next_best_cell["r"]][next_best_cell["c"]] != UNASSIGNED_FLOOD_DEPTH &&
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
		return next_best_heading;
	}; //END GetNextBestHeading
	
	
	/**
	 * This algorithm does a breadth-first search using a flood-fill technique.
	 * The algorithm will quit once the end cell is flooded.
	 * @param {int} row_start The row of the "starting cell" of the flood
	 * @param {int} col_start The col of the "starting cell" of the flood 
	 * @param {int} row_end The row of the end cell of the flood. 
	 * @param {int} col_end The row of the end cell of the flood.
	 * @return {int, int} flooded_map each element in this array will contain the "depth" or the number of steps to get to the middle.
	 */
	this.FloodMap = function(row_end, col_end, row_start, col_start, ignore_entities) {
		var flooded_map = new Array();
		for(var r = 0; r < this.size_r; r++) {
			flooded_map[r] = new Array();
			for(var c = 0; c < this.size_c; c++) {
				flooded_map[r][c] = UNASSIGNED_FLOOD_DEPTH;
			}
		}

		flooded_map[row_start][col_start] = 0;
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
								(row_end == r && col_end == c) ||
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
						if(row_end == r && col_end == c) return flooded_map; // made it to the goal so we've flooded enough
					}
				}
			}
		} // end of frontier depth 'for' loop
	    
	}; //END FloodMap
	
	
	/**
	 * This adds the animal pen to the map around the given point.
	 * @param {int} center_point_r The row of cow
	 * @param {int} center_point_c The col of cow
	 */
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
	}; //END GenerateAnimalPen
	
	
	/**
	 * Get the cell in the specified direction
	 * @param {int} r starting row
	 * @param {int} c starting col
	 * @return {"r": int, "c": int}
	 */
	this.GetCellInHeading = function(r,c,heading) {
				if(heading == NORTH) 	return {"r": Math.max(r-1, 0), 				"c":c};
		else 	if(heading == EAST ) 	return {"r": r, 							"c": Math.min(c+1, this.size_c-1)};
		else 	if(heading == SOUTH) 	return {"r": Math.min(r+1, this.size_r-1), 	"c":c};
		else 					   		return {"r": r, 							"c": Math.max(c-1, 0)};
	};
	
	
	/**
	 * Test a cell to see if it is a valid spawn cell (On the map, on the edge. not blocked, not occupied)
	 * @param {int} cell_r
	 * @param {int} cell_c
	 * @return {bool}
	 */
	this.IsValidSpawnCell = function(cell_r, cell_c) {

		return ( 	cell_r >= 0 && 	
					cell_r < this.size_r &&
					cell_c >= 0 &&
					cell_c < this.size_c &&
					(	
						cell_r < MAP_EDGE_SPAWN_ZONE || 
						cell_r >= this.size_r-MAP_EDGE_SPAWN_ZONE ||
						cell_c < MAP_EDGE_SPAWN_ZONE ||
						cell_c >= this.size_c-MAP_EDGE_SPAWN_ZONE
					) &&
					!(
						this.walls[cell_r][cell_c][NORTH] && 
						this.walls[cell_r][cell_c][EAST] && 
						this.walls[cell_r][cell_c][SOUTH] && 
						this.walls[cell_r][cell_c][WEST]
					) &&
					!this.walls[cell_r][cell_c][BLOCKED] &&
					this.entities[cell_r][cell_c] == null &&
					this.items[cell_r][cell_c] == null
					
				);
	};
	

	/**
	 * Test a cell to see if it is a valid "open" cell (on the map, no walls, barriers, or entites.)
	 * @param {int} cell_r
	 * @param {int} cell_c
	 * @return {bool}
	 */
	this.IsValidOpenCell = function(cell_r, cell_c) {
		return ( 	(cell_r >= 0 && 	
					cell_r < this.size_r &&
					cell_c >= 0 &&
					cell_c < this.size_c) &&
					!this.walls[cell_r][cell_c][NORTH]   &&
					!this.walls[cell_r][cell_c][EAST]    &&
					!this.walls[cell_r][cell_c][SOUTH]   && 
					!this.walls[cell_r][cell_c][WEST]    &&
					!this.walls[cell_r][cell_c][BLOCKED] &&
					this.entities[cell_r][cell_c] == null &&
					this.items[cell_r][cell_c] == null		
				);
	};
	
	
	/**
	 * Get a cell that is able to be spawned on using pure random guessing. (infinite time worst case, but it usually only takes 1-10 iterations)
	 * @return {"r": int, "c": int}
	 */
	this.GetRandomSpawnCell = function() { 
		var cell_c = null;
		var cell_r = null;

		while(cell_c == null || cell_r == null || !this.IsValidSpawnCell(cell_r, cell_c))
		{	 
			cell_r = Math.floor(Math.random()*this.size_r);
			cell_c = Math.floor(Math.random()*this.size_c);
		}
		
		return {"r": cell_r, "c": cell_c};
	};
	
	
	/**
	 * Get a cell that has no walls or barriers using pure random guessing. (infinite time worst case, but is pretty good in practice.)
	 * @return {"r": int, "c": int}
	 */
	this.GetRandomOpenCell = function() { 
		var cell_c = null;
		var cell_r = null;
		
		while(cell_c == null || cell_r == null || !this.IsValidOpenCell(cell_r, cell_c))
		{	 
			cell_r = Math.floor(Math.random()*this.size_r);
			cell_c = Math.floor(Math.random()*this.size_c);
		}
		return {"r": cell_r, "c": cell_c};
	};
	
	
	/**
	 * Test adjacent cells and return the number of which of those cells were spawnable
	 * @param {int} r
	 * @param {int} c
	 * @return {int}
	 */
	this.GetNumberOfSpawnableAdjacentCells = function(r, c) {
		var count = 0;
		if(this.IsValidSpawnCell(r+1, c)) count++;
		if(this.IsValidSpawnCell(r-1, c))  count++;
		if(this.IsValidSpawnCell(r, c+1)) count++;
		if(this.IsValidSpawnCell(r, c-1))  count++;
		return count;
	};
	
	
	/**
	 * This method may return an item, but maybe it wont.
	 * @return {Item}
	 */
	this.ProbablyGetItem = function() {
		var randItem = new Item(ITEM_ARRAY[Math.floor(Math.random()* (ITEM_ARRAY.length))], this.items_layer, this.anim_layer, this);
		switch(randItem.key)
		{
			case "REPAIR_KIT":
				if (ITEM_PROBS[randItem.key] <= Math.floor(Math.random() * 100))
					return randItem;
		}
		return null;
	};
	
	
	/**
	 * This method will add a fence onto the map.
	 * @param {int} row
	 * @param {int} col
	 * @param {string} heading
	 */
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
	
	
	/**
	 * This method will add a barrier onto the map, if it can.
	 * @param {int} row
	 * @param {int} col
	 * @return {bool} True, if this was able to add the barrier.
	 */
	this.AddBarrier = function(r, c) {
		if(!this.IsValidOpenCell(r, c) || this.walls[r][c][IMAGE] == null) return false;
		
		this.walls[r][c][BLOCKED] = true;
		this.walls[r][c][IMAGE].PushImage(BARRIER_IMAGES[Math.floor(Math.random()*BARRIER_IMAGES.length)]);
		
		return true;
	};
	
	
	/**
	 * This recursive method will update the fence images onto the map cells given what is in this.walls.
	 * This can really lag up the game setup when fences are added in parallel like this | | | |.
	 * @param {int} r
	 * @param {int} c
	 */
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
}