const PX_PER_CELL = 32;

const WINDOW_WIDTH_CELLS = 25;
const WINDOW_HEIGHT_CELLS = 25;

const WINDOW_WIDTH_PX = WINDOW_WIDTH_CELLS*PX_PER_CELL;
const WINDOW_HEIGHT_PX = WINDOW_HEIGHT_CELLS*PX_PER_CELL;

const NORTH = "NORTH";
const EAST  = "EAST";
const SOUTH = "SOUTH";
const WEST  = "WEST";
const BLOCKED = "BLOCKED"; //if a cell is a barrier entirely

var ITEM_IMAGES = {"sword" : "images\\sword.png"};
var ITEM_DAMAGES = {"sword" : 10};
var ITEM_ANIMATIONS = {"sword" : new Kinetic.Tween({
					node: this.sprite,
					x: this.x,
					y: this.y,
					duration: this.move_time,
					easing: Kinetic.Easings.Linear
			});};


const TOTAL_MOB_CAP = 30; 
const TOTAL_MOB_SPAWN_GROUP = 5; //# of aliens that can spawn at once in a group (DONT DO MORE THAN 5!!!)
const MAP_EDGE_SPAWN_ZONE = 4; //the game can spawn mobs within MAP_EDGE_SPAWN_ZONE spaces of the edge

//constants used for the flooding algo.
const UNASSIGNED_FLOOD_DEPTH = Number.MAX_VALUE;
const MAX_FRONTIER_DEPTH = WINDOW_WIDTH_CELLS*WINDOW_HEIGHT_CELLS;

const PLAYER_IMAGE = "images\\robot.png";
const COW_IMAGE = "images\\cow.png";
var ALIEN_IMAGES = [	"images\\Brain Jelly.png",
						"images\\Young Alien Red-Fire.png",
						"images\\Jelly.png",
						"images\\Young Alien.png"];
						