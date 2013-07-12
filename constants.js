const PX_PER_CELL = 32;

const WINDOW_WIDTH_CELLS = 30;
const WINDOW_HEIGHT_CELLS = 20;

const WINDOW_WIDTH_PX = WINDOW_WIDTH_CELLS*PX_PER_CELL;
const WINDOW_HEIGHT_PX = WINDOW_HEIGHT_CELLS*PX_PER_CELL;

const NORTH = "NORTH";
const EAST  = "EAST";
const SOUTH = "SOUTH";
const WEST  = "WEST";
const BLOCKED = "BLOCKED"; //if a cell is a barrier entirely
const LOCKED = "LOCKED"; //if a cell is open and nothing can be placed there.
const IMAGE = "IMAGE"; //the image for a wall or barrier

var ITEM_KEYS = [
	"sword",
	"laser sword",
	"machine gun",
	"bomb"
]

var ITEM_IMAGES = {
	"sword" : "images\\sword.png"
};

var ITEM_DAMAGES = {
	"sword" : 10
};
/*
var ITEM_ANIMATIONS = {
	"sword" : (new Kinetic.Tween({
		node: 		null,
		x: 			0,
		y: 			0,
		duration: 	0,
		easing: 	Kinetic.Easings.Linear}))
};
*/

const TOTAL_ITEM_CAP = 10;

const TOTAL_MOB_CAP = 30; 
const TOTAL_MOB_SPAWN_GROUP = 5; //# of aliens that can spawn at once in a group (DONT DO MORE THAN 5!!!)
const MAP_EDGE_SPAWN_ZONE = 3; //the game can spawn mobs within MAP_EDGE_SPAWN_ZONE spaces of the edge

const MAP_MAX_BARRIERS = 20;
const MAP_MIN_BARRIERS = 3;
const MAP_COWPEN_MIN_DIM = 4; 
const MAP_COWPEN_MAX_DIM = 8;

//constants used for the flooding algo.
const UNASSIGNED_FLOOD_DEPTH = Number.MAX_VALUE;
const MAX_FRONTIER_DEPTH = WINDOW_WIDTH_CELLS*WINDOW_HEIGHT_CELLS;

const PLAYER_IMAGE = "images/robot.png";
const COW_IMAGE = "images/cow.png";
var ALIEN_IMAGES = [	"images/Brain Jelly.png",
						"images/Young Alien Red-Fire.png",
						"images/Jelly.png",
						"images/Young Alien.png"];

var BARRIER_IMAGES = [	"images/barrier1.png",
						"images/barrier2.png",
						"images/barrier3.png"];
