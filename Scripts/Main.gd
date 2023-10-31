extends Control

func _ready():
	if Global.won:
		visible = false
		get_node("../Win").visible = true

func _on_play_pressed():
	get_tree().change_scene_to_file("res://Scenes/level_home.tscn")

func _on_credits_pressed():
	get_node("../Credits").visible = true
	visible = false


func _on_quit_pressed():
	get_tree().quit()


func _on_options_pressed():
	get_node("../Options").visible = true
	visible = false
