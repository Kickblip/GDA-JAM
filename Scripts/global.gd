extends Node

#this script will handle a lot of logic that needs to persist between levels
#for example: player inventory data, NPC reputation etc.


func sin_range(mi, ma, t):
	var halfRange = (ma - mi) / 2;
	return mi + halfRange + sin(t) * halfRange;


#inventory will be broken down into three dictionaries as seen below
#make sure an object is defined in all three arrays to establish a new item
#please let me know if you have a better idea for this, could do a class or something like that instead

#item count dictionary:
#every item will start at 0 count
var inventory_item_counts = {
	"Coin": 0
}

#item value dictionary:
#basically a reference for calculating trade setups
var inventory_item_values = {
	"Coin": 1
}

#item texture dictionary:
var inventory_item_sprites = {
	"Coin": "spritepath"
}
