/**
 * INVASION
 * FILE: constants.js
 * AUTHORS: Richard Habeeb, Addison Shaw 
 * TODO:
 *  -all the things.
 **/
 
 const HUD_HEIGHT = window.getComputedStyle(document.getElementById("GameHud")).getPropertyValue("height");
 
 //ENTITY TYPES
 const PLAYER = "PLAYER";
 const MOB = "MOB";
 const COW = "COW";
 

 //MAP CONSTANTS
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

//ITEM CONSTANTS
const EQUIP = "EQUIP";
const SINGLE_USE_WEAPON = "SINGLE_USE_WEAPON";
const SINGLE_USE_BUFF = "SINGLE_USE_BUFF";
const TRAP = "TRAP";
const CONSTRUCTIVE = "CONSTRUCTIVE";

//ITEM TEMPLATE STATIC CLASSES
var TAZER = {
	name: "Tazer",
	type: EQUIP,
	icon_image: "images/tazer-anim.png",
	map_image: "images/blue-orb.png",
	animation_image: "images/tazer-anim.png", 
	animation_type: "BLINK",
	animation_duration: 500,
	single_direction: true,
	melee: true,
	range: 1,
	base_damage: 50
};

var LASER_VISION = {
	name: "Laser Vision",
	type: EQUIP,
	icon_image: "images/lazer.png",
	map_image: "images/red-orb.png",
	animation_image: "images/lazer.png", 
	animation_type: "BLINK",
	animation_duration: 1000,
	single_direction: true,
	melee: false,
	range: 100,
	base_damage: 200
};

var REPAIR_KIT = {
	name: "Repair Kit",
	type: SINGLE_USE_BUFF,
	icon_image: "images/",
	map_image: "images/",
	animation_image: "images/", 
	animation_duration: 0.1,
	animation_type: "NONE",
	buff_attribute: "health",
	buff_amount: 100
};

var BOMB = {
	name: "Bomb",
	type: TRAP,
	icon_image: "images/bomb.png",
	map_image: "images/bomb.png",
	animation_image: "images/bomb.png",
	animation_duration: 10000,
	animation_type: "BLINK",
	melee: false,
	range: 50,
	radius: 50,
	base_damage: 150
};

var ITEM_SPAWN_LIMITS = {
	"TAZER" : 1,
	"LASER_VISION" : 1,
	"REPAIR_KIT" : 2,
	"BOMB" : 3
};

var ITEM_PROBS = {
	"TAZER" : 30,
	"LASER_VISION" : 20,
	"REPAIR_KIT" : 50,
	"BOMB" : 40
};


var ITEM_DICT = {
	"TAZER" : TAZER,
	"LASER_VISION" : LASER_VISION,
	"REPAIR_KIT" : REPAIR_KIT,
	"BOMB" : BOMB

};

var ITEM_ARRAY = [
	"TAZER",
	"LASER_VISION",
	"REPAIR_KIT",
	"BOMB"
];



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
