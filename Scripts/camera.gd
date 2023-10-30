extends Camera2D

var target = null
var lerpFactor = 4.8;
var shake = 0.0
var rng = RandomNumberGenerator.new()

func _ready():
	
	target = get_node("../player")
	print("player found: " + str(target))
	if target != null:
		position = target.position

func _process(delta):
	shake = lerpf(shake,0,5*delta)
	
	var randx = rng.randf_range(-shake,shake)
	var randy = rng.randf_range(-shake,shake)
	
	if target != null:
		position = position.lerp(target.position + Vector2(randx,randy),lerpFactor*delta)
