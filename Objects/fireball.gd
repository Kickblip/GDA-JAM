extends CharacterBody2D

var speed = 1
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


# Called when the node enters the scene tree for the first time.
func _ready():
	origin = position
	randomize()
	sprite_direction = "_right" if direction == 1 else "_left"
	var color_index = randi() % len(colors)
	sprite.play(colors[color_index] + sprite_direction)


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	var players = get_tree().get_nodes_in_group("Player")
	if players.size() > 0:
		player = players[0]
		if position.distance_to(player.global_position) < 5 and not exploded:
			get_tree().call_group("Player","take_damage",damage)
			audio.play()
			sprite.queue_free()
			exploded = true
	if abs(origin.x - position.x) > max_dist:
		queue_free()
	move_local_x(speed * direction)
	
func _on_audio_finished():
	queue_free()

