extends CharacterBody2D

#movement variables
var accel = 480 #horizontal acceleration
var decel = 12 #horizontal deceleration
var maxSpeed = 150 #maximum horizontal speed
var gravity = 480 #rate at which player falls
var terminalVelocity = 500 #maximum fall speed
var terminalVelocityChange = terminalVelocity #will change if player is on wall

#player attributes
var hp = 100
var damage = 10 #damage done to enemies each hit
var attackSpeed = 1 #seconds in between each attack
var currentWeapon = null

var dir = 1
var lastHVel = 0
var checkLanding = false
var update = false
var canMove = true;
var hVel;

var walljump = false
var onWall = false
var wallDirection = 0

@onready var sprite = $Sprite

@onready var rightray = $Rright
@onready var leftray = $Rleft

func _update_weapon(weapon): #ran in instantiation and equpping a new weapon
	damage = weapon.damage
	attackSpeed = weapon.attackSpeed
	currentWeapon = weapon

func _ready():
	sprite.play("idle_right")

func _process(delta): 
	if canMove:
		hVel = 0-int(Input.is_action_pressed("left"))+int(Input.is_action_pressed("right"))
	
	#would like to convert a lot of these if statements into something better, but OK for now
	if (hVel != lastHVel) || update: 
		update = false
		
		if (hVel != 0):
			dir = hVel
		
		if is_on_floor():
			if hVel == -1: #moving left
				sprite.play("transition_toMove_left")
				#sprite.speed_scale = clamp(abs(velocity.x)/maxSpeed,0.5,1)
			elif hVel == 1: #moving right
				#sprite.speed_scale = clamp(abs(velocity.x)/maxSpeed,0.5,1)
				sprite.play("transition_toMove_right")
			else:
				#sprite.speed_scale = 1
				if dir == -1:
					sprite.play("transition_toIdle_left")
				else:
					sprite.play("transition_toIdle_right")
		else:
			if dir == -1:
				sprite.play("air_left")
			else:
				sprite.play("air_right")
		lastHVel = hVel
	
	if hVel != 0:
		if canMove:
			if (velocity.x < maxSpeed && hVel == 1) || (velocity.x > -maxSpeed && hVel == -1):
				velocity.x += (hVel * accel)*delta
	else: #not holding any keys
		if is_on_floor():
			velocity.x = lerp(velocity.x,0.0,decel*delta)
		else:
			velocity.x = lerp(velocity.x,0.0,(decel/5)*delta)
	
	#check direction of colliding wall
	if !is_on_floor() && velocity.y > -100:
		if rightray.is_colliding():
			if !onWall:
				onWall = true
				velocity.y = 0
				wallDirection = 1
		elif leftray.is_colliding():
			if !onWall:
				onWall = true
				velocity.y = 0
				wallDirection = -1
		else:
			onWall = false
	else:
		onWall = false

	if onWall:
		terminalVelocityChange = 50
	else:
		terminalVelocityChange = terminalVelocity

	if velocity.y < terminalVelocityChange:
		velocity.y += gravity*delta
	if Input.is_action_just_pressed("jump"):
		if is_on_floor():
			velocity.y += -200
		elif onWall:
			if wallDirection == 1:
				dir = -1
				update = true
				velocity.x += -200
			else:
				dir = 1
				update = true
				velocity.x += 200
			velocity.y -= 200
		
	print(hVel)
		
	if !is_on_floor():
		if !checkLanding: #happens on jump
			update = true
			checkLanding = true
	else: #player has landed
		if checkLanding: #happens on land
			checkLanding = false
			update = true
	
	move_and_slide()

func _on_sprite_animation_finished():
	if sprite.animation == "transition_toIdle_right":
		sprite.play("idle_right")
	elif sprite.animation == "transition_toIdle_left":
		sprite.play("idle_left")
	elif sprite.animation == "transition_toMove_right":
		sprite.play("move_right")
	elif sprite.animation == "transition_toMove_left":
		sprite.play("move_left")
