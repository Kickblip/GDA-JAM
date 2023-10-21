extends Node2D
#pipe object basically acts as gateway for player to access world map

var interactDistance = 60;
var player;
var levelSelect;

func _ready():
	player = get_node("../player")
	levelSelect = get_node("../CanvasLayer/ui_level_select")

func _process(delta):
	if position.distance_to(player.position) < interactDistance:
		material.set_shader_parameter("line_thickness",1)
		if Input.is_action_just_pressed("interact"):
			#open level menu
			player.canMove = false
			levelSelect.visible = true
		if levelSelect.visible:
			if Input.is_action_just_pressed("escape"):
				#close level menu
				levelSelect.visible = false
				player.canMove = true
			
	else:
		material.set_shader_parameter("line_thickness",0)
