extends Button

@export var show = Node

func _on_pressed():
	show.visible = true
	get_node("../").visible = false
