/**
 * INVASION
 * FILE: gameplay.js
 * AUTHORS: Richard Habeeb, Addison Shaw 
 * TODO:
 *  -Setup attacking key combos
 *	-Setup pregame menu / pause menu
 *  -Do all the things.
 **/
 
var window_stage = new Kinetic.Stage({
	container: 'GameWindow',
	width: WINDOW_WIDTH_CELLS*PX_PER_CELL,
	height: WINDOW_HEIGHT_CELLS*PX_PER_CELL
});

var hud_stage = new Kinetic.Stage({
	container: 'GameHud',
	width: WINDOW_WIDTH_CELLS*PX_PER_CELL,
	height: HUD_HEIGHT
});

var current_map = new Map();
current_map.SetupMapOnStage(window_stage);
current_map.SetupWalls();
current_map.SetupEntities();
current_map.SetupItems();
current_map.SetupCow();
current_map.SetupPlayer();
current_map.GenerateTerrain();


//pause here!
var top_layer = new Kinetic.Layer();
window_stage.add(top_layer);

var screen_cover = new Kinetic.Rect({
	x: 0,
	y: 0,
	width: WINDOW_WIDTH_CELLS*PX_PER_CELL,
	height: WINDOW_WIDTH_CELLS*PX_PER_CELL,
	fill: "black",
	opacity: 0.5
	

});

top_layer.add(screen_cover);
top_layer.draw();

var paused = true;

function startGame() {

	paused = false;
	document.getElementById("StartMenu").style.display = "none";
	screen_cover.hide();
	top_layer.draw();
}


//handle holding of keys better than standard DOM.
var w_pressed = false;
var a_pressed = false;
var s_pressed = false;
var d_pressed = false;
setInterval(function() {
	if(!paused) {
		if(w_pressed) current_map.MoveEntity(current_map.player, NORTH);
		if(a_pressed) current_map.MoveEntity(current_map.player, WEST);
		if(s_pressed) current_map.MoveEntity(current_map.player, SOUTH);
		if(d_pressed) current_map.MoveEntity(current_map.player, EAST);
	}
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
	if(!paused) {
		current_map.HandleMonsterSpawning();
		//current_map.HandleItemSpawning();
		current_map.HandleCowMovement();
	}
}, 1000); //handle monsters spawning every 1000 ms.

setInterval(function() {
	if(!paused) {
		current_map.HandleItemSpawning();
	}
}, 500);


var monster_movement_handler = function() {
	if(!paused) {
		current_map.HandleMonsterMovements();
	}
	setTimeout(monster_movement_handler, Math.random()*250);
}
monster_movement_handler();

