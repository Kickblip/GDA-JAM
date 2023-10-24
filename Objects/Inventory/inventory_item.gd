extends Control

@onready var sprite = $Sprite2D
var hovering = false
var targetScale = 3
var timer = 0

func _ready():
	scale = Vector2(3,3)
	

func _process(delta):
	if hovering:
		timer += 1*delta
		targetScale = 4
		if timer > 0: #can be used to set delay for info popup, but set to 0 for now
			$Info.visible = true
	else:
		targetScale = 3

	scale = scale.lerp(Vector2(1,1)*targetScale,30*delta)


func _on_mouse_entered():
	hovering = true


func _on_mouse_exited():
	hovering = false
	timer = 0
	$Info.visible = false
