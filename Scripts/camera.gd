extends Camera2D

var target = null
var lerpFactor = 4.8;

func _ready():
	target = get_node("/root/level_home/player")
	print("player found: " + str(target))
	if target != null:
		position = target.position

func _process(delta):
	if target != null:
		position = position.lerp(target.position,lerpFactor*delta)
