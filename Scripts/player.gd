extends CharacterBody2D

#-----movement variables
var accel = 480 #horizontal acceleration
var decel = 12 #horizontal deceleration
var maxSpeed = 150 #maximum horizontal speed
var gravity = 480 #rate at which player falls
var terminalVelocity = 500 #maximum fall speed
var terminalVelocityChange = terminalVelocity #will change if player is on wall

#-----player attributes
var hpMax = 100.0
var hp = hpMax
var damage = 10 #damage done to enemies each hit
var attackSpeed = 1 #seconds in between each attack
var currentWeapon = null

#-----other variables
var dir = 1 #saves the last direction the player moved in
var checkLanding = false #is set to true when in air, and set back to false when landed
var update = false #setting to true will update direction and animations regardless of velocity for that frame
var canMove = true; #whether player can move or not

var hVel; #-1 for moving left, 0 for none, and 1 for moving right
var lastHVel = 0 #the hVel from the previous frame

var vVel = 0

var onWall = false #whether the player is wall jumping or not
var wallDirection = 0 #current touching wall (-1 for left, 0 for none, 1 for right)

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
	#if Input.is_action_just_pressed("escape"):
	#	hp -= 10
	
	if is_on_floor() && Input.is_action_pressed("down"):
		position.y += 1
	
	if canMove:
		hVel = 0-int(Input.is_action_pressed("left"))+int(Input.is_action_pressed("right"))
	else:
		hVel = 0
	
	#would like to convert a lot of these if statements into something better, but OK for now
	if (hVel != lastHVel) || update: 
		update = false
		
		if (hVel != 0):
			dir = hVel
		
		if is_on_floor():
			if hVel == -1: #moving left
				sprite.play("transition_toMove_left")
			elif hVel == 1: #moving right
				sprite.play("transition_toMove_right")
			else:
				if dir == -1:
					sprite.play("transition_toIdle_left")
				else:
					sprite.play("transition_toIdle_right")
		elif !onWall:
			if dir == -1:
				if velocity.y < 0:
					sprite.play("air_up_left")
				else:
					sprite.play("air_down_left")
			else:
				if velocity.y < 0:
					sprite.play("air_up_right")
				else:
					sprite.play("air_down_right")
		lastHVel = hVel
	
	#check transition between going up and down
	if velocity.y < 0:
		if vVel != -1:
			vVel = -1
			update = true
	elif velocity.y == 0:
		if vVel != 0:
			vVel = 0
			update = true
	else:
		if vVel != 1:
			vVel = 1
			update = true
	
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
				sprite.play("wall_right")
				velocity.y = 0
				wallDirection = 1
		elif leftray.is_colliding():
			if !onWall:
				onWall = true
				sprite.play("wall_left")
				velocity.y = 0
				wallDirection = -1
		else:
			if onWall:
				onWall = false
				update = true
	else:
		if onWall:
			onWall = false
			update = true

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
				velocity.x += -200
			else:
				dir = 1
				velocity.x += 200
			onWall = false
			update = true
			velocity.y -= 200
		
	if !is_on_floor():
		if !checkLanding: #happens on jump
			update = true
			checkLanding = true
	else: 
		if checkLanding: #player has landed (can play sounds here)
			checkLanding = false
			update = true
	
	move_and_slide()

func _on_sprite_animation_finished(): #go from transition animation to regular looped animation
	if sprite.animation == "transition_toIdle_right":
		sprite.play("idle_right")
	elif sprite.animation == "transition_toIdle_left":
		sprite.play("idle_left")
	elif sprite.animation == "transition_toMove_right":
		sprite.play("move_right")
	elif sprite.animation == "transition_toMove_left":
		sprite.play("move_left")
