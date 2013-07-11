function Inventory() {

	// !!!Refrain from random access since we are using splice to remove items!!!
	var items = new Array();
	this.currentItem;
	
	
	// Check if 'indexOf' is an available method to the browser
	// If not, use the custom function!!!! ! ZOMGGGG
	if (!Array.prototype.indexOf) {
	
		Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
			"use strict";
			if (this == null) {
				throw new TypeError();
			}
			
			var t = Object(this);
			
			var len = t.length >>> 0;

			if (len === 0) {
				return -1;
			}
			
			var n = 0;
			
			if (arguments.length > 1) {
			
				n = Number(arguments[1]);
				
				if (n != n) { // Shortcut for verifying if it's NaN
					n = 0;
				} 
				
				else if (n != 0 && n != Infinity && n != -Infinity) {
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
				}
			}
			
			if (n >= len) {
				return -1;
			}
			
			var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
			
			for (; k < len; k++) {
				if (k in t && t[k] === searchElement) {
					return k;
				}
			}
			
			return -1;
		}
	}
};
	
this.EquipItem = function(item)
{
	this.currentItem = item;
}

//Adds the given item to 'inventoy'
this.AddItem = function(item) 
{
	this.items.push(item);
	this.EquipItem(item);
}

//Removes the given item from 'inventory'
this.RemoveItem = function(item) 
{

	// If it exists...
	if (array.indexOf(item) != -1) 
	{
		// Remove the item at the given index
		this.items.splice(array.indexOf(item), 1);
	}
	
}

this.RemoveAll = function()
{
	var length = items.length, 
		element = null;
		
	for (var i = 0; i < length; i++) 
	{
		element = items[i];
		RemoveItem(element);
	}
}