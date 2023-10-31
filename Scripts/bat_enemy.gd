extends "res://Scripts/enemy_damagable.gd"

var gravity = 480
var init_pos
var hover_height = 2 # intensity of up and down hover
var flap_force = hover_height * 2
var acceleration = 5*60
var pursuit_speed = 200
var idle_speed = 20
var max_speed = idle_speed

var height_from_player = 40 # distance to hover above player during pursuit
var aware_radius = 200 # max distance to notice player

var hover_pos
var direction = 1
var sprite_direction = "_right"
var action = "fly"

var player

@onready var sprite = $Sprite
@onready var pace_timer = $Timer
@onready var audio = $Audio

var attackTimer = 0

func _ready():
	sprite.play("fly_right")
	velocity.x += acceleration
	init_pos = position
	pace_timer.wait_time = 5
	
	#override parent variables
	damage = 5
	hp = 20
	#----------------

func _process(delta):
	attackTimer -= 1*delta
	var players = get_tree().get_nodes_in_group("Player")
	if players.size() > 0:
		player = players[0]
		
		if attackTimer < 0:
			if position.distance_to(player.global_position) < 5:
				get_tree().call_group("Player","take_damage",damage)
				attackTimer = 0.5
				
		if position.distance_to(player.global_position) < aware_radius:
			hover_pos = player.global_position
			hover_pos.y -= height_from_player
			max_speed = pursuit_speed
			pursue_player(delta)
		else:
			hover_pos = init_pos
			max_speed = idle_speed
			velocity.x = max_speed
			pace(delta)

	if position.y - hover_pos.y > hover_height:
		velocity.y -= flap_force
	else:
		velocity.y += gravity * delta
		
	if abs(velocity.x) > max_speed:
		velocity.x -= sign(max_speed)
	
	if abs(velocity.y) > max_speed:
		velocity.y += sign(max_speed)

	move_and_slide()
	for i in get_slide_collision_count():
		var collision = get_slide_collision(i)
		if collision.get_collider().name == "player":
			get_tree().call_group("Player","take_damage",damage)
	sprite_direction = "_right" if direction == 1 else "_left"
	sprite.play(action + sprite_direction)

func pace(delta):
	if pace_timer.time_left < 0.05:
		direction = 1 if direction == -1 else -1
		pace_timer.start()
	velocity.x += (acceleration * direction)*delta

func pursue_player(delta):
	var player_hdist = position.x - player.global_position.x
	direction = 1 if player_hdist < 0 else -1
	velocity.x += (acceleration * direction)*delta
	if pace_timer.time_left < 2:
		audio.play()
		pace_timer.start()

