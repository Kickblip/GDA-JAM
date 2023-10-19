extends Control

var targetWidth = 300;
var open = false
var background

func _ready():
	background = $Background
	background.size.x = 10
	modulate.a = 0

func _process(delta):
	background.pivot_offset.x = background.size.x/2
	if !visible:
		if open:
			open = false
			background.size.x = 10
			modulate.a = 0
	else:
		if modulate.a < 1:
			modulate.a += 2*delta
		if background.size.x < targetWidth:
			background.size.x += 500*delta
		if !open:
			open = true
