extends ColorRect

var fade = false
var alpha = 1

func _ready():
	visible = true

func _process(delta):
	if fade:
		if alpha >= 1:
			get_tree().reload_current_scene()
		else:
			alpha += 1*delta
	else:
		if alpha > 0:
			alpha -= 2*delta
	modulate = Color(0,0,0,alpha)
