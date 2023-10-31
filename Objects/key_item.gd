extends Node2D

var player = null
var pickupRange = 40
var itemType
var rng = RandomNumberGenerator.new()
var destroy = false
var pickupTime = 2
var timer = pickupTime


var weights = [] #accumulated weights

var totalWeight = 0

@onready var sprite = $Sprite2D
@onready var progress = $Progress

func _ready():
	
	if Global.keysGotten.has(get_node("../").name):
		queue_free()
	
	progress.max_value = pickupTime
	
	var group = get_tree().get_nodes_in_group("Player")
	if group.size() > 0:
		player = group[0]
		

func _process(delta):
	progress.visible = false
	if !destroy:
		if player != null:
			if position.distance_to(player.position) < pickupRange:
				material.set_shader_parameter("line_thickness",1)
				if Input.is_action_pressed("interact"):
					timer -= 1*delta
					progress.visible = true
					progress.value = pickupTime-timer
				else:
					timer = pickupTime
					
				if timer <= 0:
					Global.keyCount += 1
					destroy = true
					timer = pickupTime
					Global.keysGotten.push_back(get_node("../").name)
			else:
				material.set_shader_parameter("line_thickness",0)
				timer = pickupTime
	if destroy:
		scale.x -= 10*delta
		scale.y -= 10*delta
		if scale.x <= 0:
			queue_free()
