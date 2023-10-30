extends CharacterBody2D

var gravity = 480

var jump_height = 100  # you can adjust this value
var aware_radius = 200 # max distance to notice player

var damage = 5
var minDistance = 10

var jumpTimer = 1 #seconds for time between jumps
var attackTimer = 0.5 #seconds between attacks if close enough to player

var player

@onready var sprite = $Sprite
@onready var audio = $Audio

var player = null

var dir = 1
var jump = false

@onready var sprite = $Sprite

func _process(delta):
	var players = get_tree().get_nodes_in_group("Player")
	if players.size() > 0:
		player = players[0]
		if position.distance_to(player.global_position) < aware_radius:
			pursue_player(delta)

	velocity.y += gravity * delta
	
	if is_on_floor():
		if jump == true:
			jump = false
			velocity.x = 0
		sprite.play("idle_" + str(dir))
	else:
		jump = true
		sprite.play("jump_" + str(dir))
	
	move_and_slide()


func pursue_player(delta): #attack mode
	
	jumpTimer -= 1*delta
	attackTimer -= 1*delta
	
	if (position.distance_to(player.position) > minDistance):
		if jumpTimer <= 0:
			jumpTimer = 1
			if (position.x - player.position.x) < 0:
				dir = 1
			else:
				dir = -1
			velocity.y = -jump_height
			velocity.x = jump_height*dir
      audio.play()
	else: #enter attack mode
		if attackTimer <= 0:
			attackTimer = 0.5
			get_tree().call_group("Player","take_damage",damage)

