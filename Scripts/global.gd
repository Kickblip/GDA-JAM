extends Node

#this script will handle a lot of logic that needs to persist between levels
#for example: player inventory data, NPC reputation etc.

func sin_range(mi, ma, t):
	var halfRange = (ma - mi) / 2;
	return mi + halfRange + sin(t) * halfRange;

#inventory will be an array filled with more arrays (each array specifying an item)
#all items have to be specified in the inventory, with item counts changed to add and remove items

#weight is chance to spawn in world

var inventory = [
	#name  value           spritepath           count  weight
	["Gem",20,"res://Sprites/Items/gem.png",0,1],
	["Ring",10,"res://Sprites/Items/ring.png",0,2],
	["Coins",6,"res://Sprites/Items/coins.png",0,4],
	["Cheese",4,"res://Sprites/Items/cheese.png",0,5],
	["Fabric",3,"res://Sprites/Items/fabric.png",0,6],
	["String",2,"res://Sprites/Items/string.png",0,7],
	["Plastic Bottle Cap",1,"res://Sprites/Items/plastic_bottle_cap.png",0,8]
]

var keysGotten = []
var keyCount = 0
var won = false

func _process(delta):
	if Input.is_action_just_pressed("fullscreen"):
		if DisplayServer.window_get_mode() != 3:
			DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
		else:
			DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED)
			
	if Input.is_action_just_pressed("restart"):
		get_tree().reload_current_scene()
