extends Node2D
#pipe object basically acts as gateway for player to access world map

var interactDistance = 50;
var player;

func _ready():
	player = get_node("/root/level_home/player")

func _process(delta):
	if position.distance_to(player.position) < interactDistance:
		material.set_shader_parameter("line_thickness",1)
		if Input.is_action_just_pressed("interact"):
			#open world menu here
			#could either do this as an overlay in the current scene so we don't have any latency loading a new map scene
			var worldMenu = true
	else:
		material.set_shader_parameter("line_thickness",0)
