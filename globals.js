/**
 * INVASION
 * FILE: globals.js
 * AUTHORS: Richard Habeeb, Addison Shaw 
 **/


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
const PLAYER = "PLAYER";
const MOB = "MOB";
const COW = "COW";

var ITEM_TYPES = {
	EQUIP:"EQUIP",
	SINGLE_USE_WEAPON: "SINGLE_USE_WEAPON",
	SINGLE_USE_BUFF: "SINGLE_USE_BUFF",
	TRAP: "TRAP",
	CONSTRUCTIVE: "CONSTRUCTIVE"
};




const PLAYER_IMAGE = "images/robot.png";
const COW_IMAGE = "images/cow.png";
var ALIEN_IMAGES = [	"images/Brain Jelly.png",
						"images/Young Alien Red-Fire.png",
						"images/Jelly.png",
						"images/Young Alien.png"];

var BARRIER_IMAGES = [	"images/barrier1.png",
						"images/barrier2.png",
						"images/barrier3.png"];
