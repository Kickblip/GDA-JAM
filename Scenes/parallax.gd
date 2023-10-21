extends Node2D

@onready var cam = get_node("../Camera2D")
@export var moveFactor = 1.4

func _ready():
	pass # Replace with function body.

func _process(delta):
	position.x = cam.position.x/moveFactor
	position.y = cam.position.y/moveFactor
