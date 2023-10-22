extends CharacterBody2D

var gravity = 480
var terminalVelocity = 500
var terminalVelocityChange = terminalVelocity

var direction = "_right"
var action = "idle"

var player
var fireball = preload("res://Objects/fireball.tscn")

@onready var sprite = $Sprite
@onready var rocket_timer = $Timer

func _ready():
	print("hello")
	sprite.play("idle_right")
	rocket_timer.wait_time = 3

func _process(delta):
	var players = get_tree().get_nodes_in_group("Player")
	if players.size() > 0:
		player = players[0]

		var player_hdist = position.x - player.global_position.x
		var player_vdist = position.y - player.global_position.y

		direction = "_left" if player_hdist > 0 else "_right"
		action = "fire" if abs(player_hdist) < 600 and abs(player_vdist) < 50 else "idle"

	if velocity.y < terminalVelocityChange:
		velocity.y += gravity * delta

	move_and_slide()

	sprite.play(action + direction)
	if action == "fire":
		fire_rocket()

func fire_rocket():
	
	if rocket_timer.time_left < 0.05:
		
		var rocket_pos = position
		var x_offset = 14
		var y_offset = 2
		var rocket_direction = 1 if direction == "_right" else -1
		rocket_pos.x += 14 * rocket_direction
		rocket_pos.y -= y_offset
		var rocket_instance = fireball.instantiate()
		rocket_instance.position = rocket_pos
		rocket_instance.direction = rocket_direction
		get_tree().root.add_child(rocket_instance)
		rocket_timer.start()
