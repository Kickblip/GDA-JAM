extends Camera2D

var target = null
var lerpFactor = 0.02

func _ready():
	target = get_node("/root/level_home/player")
	print("player found: " + str(target))

func _process(delta):
	if target != null:
		position = position.lerp(target.position,lerpFactor)
