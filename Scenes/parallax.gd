extends Sprite2D

@onready var cam = get_node("../Camera2D")

func _ready():
	pass # Replace with function body.

func _process(delta):
	position.x = cam.position.x/1.4
