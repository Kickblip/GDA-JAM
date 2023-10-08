extends CharacterBody2D

var accel = 2 #horizontal acceleration
var decel = 0.05 #horizontal deceleration
var maxSpeed = 150 #maximum horizontal speed
var gravity = 2 #rate at which player falls
var terminalVelocity = 500 #maximum fall speed
var dir = 1

@onready var sprite = $Sprite

func _process(delta):
	var hVel = 0-int(Input.is_action_pressed("left"))+int(Input.is_action_pressed("right"))
	
	if hVel == -1:
		dir = -1
		sprite.play("move_left")
		sprite.speed_scale = clamp(abs(velocity.x)/maxSpeed,0.5,1)
	elif hVel == 1:
		sprite.speed_scale = clamp(abs(velocity.x)/maxSpeed,0.5,1)
		dir = 1
		sprite.play("move_right")
	else:
		if dir == -1:
			sprite.play("idle_left")
		else:
			sprite.play("idle_right")
		
	
	if hVel != 0:
		if abs(velocity.x) < maxSpeed:
			velocity.x += hVel * accel
	else:	
		velocity.x = lerp(velocity.x,0.0,decel)
		
	if velocity.y < terminalVelocity:
		velocity.y += gravity
		
	if Input.is_action_just_pressed("jump") && is_on_floor():
		velocity.y = -200
		
	move_and_slide()
