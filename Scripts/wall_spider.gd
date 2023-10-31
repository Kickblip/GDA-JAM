extends "res://Scripts/enemy_damagable.gd"

var jump_wait = 5 # random within this range
var gravity = 480
var jump_speed = 200
var init_pos
var vertical_speed = 100
var vertical_range = 50 # max distance from initial position
var direction = 1
var sprite_direction = "_right"
var action = "move"

@onready var sprite = $Sprite
@onready var jump_timer = $Timer

var hitTimer = 1

var sharedDelta = 1

func _ready():
	sprite.play("move_right")
	init_pos = position
	jump_timer.wait_time = 2
	
	damage = 5


func _process(delta):
	hitTimer -= 1*delta
	sharedDelta = delta
	
	if jump_timer.time_left < 0.05:
		direction *= -1;
		velocity.x = jump_speed * direction
		jump_timer.wait_time = randi() % jump_wait
		jump_timer.start()
	
	if abs(init_pos.y - position.y) > vertical_range:
		if init_pos.y - position.y < 0:
			velocity.y -= vertical_speed * delta
	
		if init_pos.y - position.y >= 0:
			velocity.y += vertical_speed * delta
			
	else:
		var random_direction = 1 if randi() % 2 == 0 else -1
		velocity.y += (randi() % vertical_speed) * random_direction * delta
	
	sprite_direction = "_right" if direction == 1 else "_left"
	sprite.play(action + sprite_direction)
	
	move_and_slide()


func _on_area_2d_body_entered(body):
	if hitTimer < 0:
		if body.name == "player":
			get_tree().call_group("Player","take_damage",damage)
			#velocity.x = gravity * sharedDelta * direction
			hitTimer = 1
