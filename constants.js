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


const TOTAL_MOB_CAP = 30; 
const TOTAL_MOB_SPAWN_GROUP = 5; //# of aliens that can spawn at once in a group (DONT DO MORE THAN 5!!!)
const MAP_EDGE_SPAWN_ZONE = 4; //the game can spawn mobs within MAP_EDGE_SPAWN_ZONE spaces of the edge