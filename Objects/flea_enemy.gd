extends CharacterBody2D

var gravity = 480
var init_pos
var acceleration = 5
var pursuit_speed = 100
var idle_speed = 20
var max_speed = idle_speed
var jump_height = 100  # you can adjust this value
var aware_radius = 200 # max distance to notice player
var direction = 1
var sprite_direction = "_right"
var action = "idle"
var damage = 10
var minDistance = 5

var hit_player = true

var player

@onready var sprite = $Sprite
@onready var jump_timer = $Timer
@onready var audio = $Audio


func _ready():
	sprite.play("fly_right")
	velocity.x += acceleration
	init_pos = position
	jump_timer.wait_time = 2


func _process(delta):
	var players = get_tree().get_nodes_in_group("Player")
	if players.size() > 0:
		player = players[0]
		if position.distance_to(player.global_position) < aware_radius:
			max_speed = pursuit_speed
			pursue_player(delta)

	if not is_on_floor():
		action = "jump"
		velocity.y += gravity * delta

	move_and_slide()
	for i in get_slide_collision_count():
		var collision = get_slide_collision(i)
		if collision.get_collider().name == "player":
			get_tree().call_group("Player","take_damage",damage)
	sprite_direction = "_right" if direction == 1 else "_left"
	sprite.play(action + sprite_direction)


func pursue_player(delta): #attack mode
	var player_hdist = position.x - player.global_position.x
	
	if (position.distance_to(player.position) > minDistance):
		#velocity.x = direction * pursuit_speed
		direction = 1 if player_hdist < 0 else -1
	
	#jump
	if is_on_floor():
		velocity.x = 0
		action = "idle"
		if position.distance_to(player.global_position) < 10 and hit_player:
			get_tree().call_group("Player","take_damage",damage)
			hit_player = false
		if jump_timer.time_left < 0.05:
			hit_player = true
			velocity.x = pursuit_speed * direction
			velocity.y = -sqrt(2 * gravity * jump_height) * (position.distance_to(player.global_position) * delta * .25)
			audio.play()
			jump_timer.start()
	

