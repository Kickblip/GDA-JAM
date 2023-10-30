extends Control

var targetWidth = 300;
var open = false
var background

func _ready():
	background = $Background
	background.size.x = 10
	modulate.a = 0

func _process(delta):
	background.pivot_offset.x = background.size.x/2
	if !visible:
		if open:
			open = false
			background.size.x = 10
			modulate.a = 0
	else:
		if modulate.a < 1:
			modulate.a += 4*delta
		if background.size.x < targetWidth:
			background.size.x += 1000*delta
		if !open:
			open = true

func _on_home_pressed():
	get_tree().change_scene_to_file("res://Scenes/level_home.tscn")


func _on_abandoned_city_pressed():
	get_tree().change_scene_to_file("res://Scenes/level_1.tscn")


func _on_ancient_sewer_pressed():
	get_tree().change_scene_to_file("res://Scenes/level_2.tscn")


func _on_boss_pressed():
	pass # Replace with function body.
