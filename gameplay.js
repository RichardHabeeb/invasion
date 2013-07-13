/**
 * INVASION
 * FILE: gameplay.js
 * AUTHORS: Richard Habeeb, Addison Shaw 
 * TODO:
 *  -Setup attacking key combos
 *	-Setup pregame menu / pause menu
 *  -Do all the things.
 **/
 
var stage = new Kinetic.Stage({
	container: 'GameWindow',
	width: WINDOW_WIDTH_CELLS*PX_PER_CELL,
	height: WINDOW_HEIGHT_CELLS*PX_PER_CELL
});

var current_map = new Map();
current_map.SetupMapOnStage(stage);
current_map.SetupWalls();
current_map.SetupEntities();
current_map.SetupItems();
current_map.SetupCow();
current_map.SetupPlayer();
current_map.GenerateTerrain();

//handle holding of keys better than standard DOM.
var w_pressed = false;
var a_pressed = false;
var s_pressed = false;
var d_pressed = false;
setInterval(function() {
	if(w_pressed) current_map.MoveEntity(current_map.player, NORTH);
	if(a_pressed) current_map.MoveEntity(current_map.player, WEST);
	if(s_pressed) current_map.MoveEntity(current_map.player, SOUTH);
	if(d_pressed) current_map.MoveEntity(current_map.player, EAST);
}, 10); //poll keypress flags every ten ms.


keypress.register_combo({
    "keys"              : "w",
    "on_keydown"        : function() { w_pressed = true;},
	"on_keyup"			: function() { w_pressed = false;}
});

keypress.register_combo({
    "keys"              : "a",
    "on_keydown"        : function() { a_pressed = true;},
	"on_keyup"			: function() { a_pressed = false;}
});

keypress.register_combo({
    "keys"              : "s",
    "on_keydown"        : function() { s_pressed = true;},
	"on_keyup"			: function() { s_pressed = false;}
});

keypress.register_combo({
    "keys"              : "d",
    "on_keydown"        : function() { d_pressed = true;},
	"on_keyup"			: function() { d_pressed = false;}
});

keypress.register_combo({
    "keys"              : "j",
    "on_keydown"        : function() { current_map.EntityAttack(current_map.player);}
});


setInterval(function() {
	current_map.HandleMonsterSpawning();
	current_map.HandleCowMovement();
}, 1000); //handle monsters pawning every 1000 ms.


var monster_movement_handler = function() {
	current_map.HandleMonsterMovements();
	setTimeout(monster_movement_handler, Math.random()*250);
}
monster_movement_handler();

