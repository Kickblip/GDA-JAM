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
	["test",10,"res://Sprites/Items/testitem.png",10],
	["test",10,"res://Sprites/Items/testitem.png",1],
	["test",10,"res://Sprites/Items/testitem.png",15],
	["test",10,"res://Sprites/Items/testitem.png",1],
	["test",10,"res://Sprites/Items/testitem.png",11],
	["test",10,"res://Sprites/Items/testitem.png",1]
]
