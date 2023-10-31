extends Node2D

var speed = 120
var direction = 1
var sprite_direction
var colors = ["red", "white", "blue"]
var origin
var max_dist = 1000
var damage = 20
var exploded = false

var player

@onready var sprite = $Sprite
@onready var audio = $Audio
@onready var light = $PointLight2D


# Called when the node enters the scene tree for the first time.
func _ready():
	origin = position
	randomize()
	sprite_direction = "_right" if direction == 1 else "_left"
	var color_index = randi() % len(colors)
	sprite.play(colors[color_index] + sprite_direction)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	if abs(origin.x - position.x) > max_dist:
		queue_free()
		
	#move every frame
	position.x += (speed * direction) * delta
	
func _on_audio_finished():
	queue_free()

func _on_area_2d_body_entered(body):
	if body.name == "player":
		get_tree().call_group("Player","take_damage",damage)
		if not exploded:
			audio.play()
			light.queue_free()
			sprite.queue_free()
			exploded = true
