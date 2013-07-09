
var stage = new Kinetic.Stage({
	container: 'GameWindow',
	width: WINDOW_WIDTH_CELLS*PX_PER_CELL,
	height: WINDOW_HEIGHT_CELLS*PX_PER_CELL
});

var current_map = new Map();
current_map.SetupMapOnStage(stage);
current_map.GenerateTerrain(0);
current_map.PopulateMonsters();
current_map.PopulateItems();
current_map.SetupPlayer();



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