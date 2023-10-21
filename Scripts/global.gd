extends Node

#this script will handle a lot of logic that needs to persist between levels
#for example: player inventory data, NPC reputation etc.

func sin_range(mi, ma, t):
	var halfRange = (ma - mi) / 2;
	return mi + halfRange + sin(t) * halfRange;

#inventory will be an array filled with more arrays (each array specifying an item)
#all items have to be specified in the inventory, with item counts changed to add and remove items

var inventory = [
	#name  value           spritepath           count
	["Test Item",5,"res://Sprites/Items/testitem.png",10],
	["Test Item",10,"res://Sprites/Items/testitem.png",1],
	["Test Item",1,"res://Sprites/Items/testitem.png",15],
	["Test Item",3,"res://Sprites/Items/testitem.png",1],
	["Test Item",10,"res://Sprites/Items/testitem.png",11],
	["Test Item",9,"res://Sprites/Items/testitem.png",1]
]

func _process(delta):
	if Input.is_action_just_pressed("fullscreen"):
		if DisplayServer.window_get_mode() != 3:
			DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
		else:
			DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED)
