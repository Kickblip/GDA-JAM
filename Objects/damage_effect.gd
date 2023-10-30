extends Node2D

var alpha = 1
var rng = RandomNumberGenerator.new()

func _ready():
	rotation = randf_range(-360,360)
	scale = Vector2(randf_range(0.5,1), randf_range(0.5,1))
	print("IM HERE")
	
	$Hit.pitch_scale = rng.randf_range(0.5,1.25)

func _process(delta):
	alpha -= 4*delta
	scale.x += 2*delta
	scale.y += 2*delta
	
	modulate = Color(1,0.2,0,alpha)
	
	if alpha <= 0:
		queue_free()
