extends CharacterBody2D

var speed = 1
var direction = 1
var sprite_direction
var colors = ["red", "white", "blue"]

@onready var sprite = $Sprite


# Called when the node enters the scene tree for the first time.
func _ready():
	randomize()
	sprite_direction = "_right" if direction == 1 else "_left"
	var color_index = randi() % len(colors)
	sprite.play(colors[color_index] + sprite_direction)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	move_local_x(speed * direction)
	
