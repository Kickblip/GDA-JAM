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
	progress.max_value = pickupTime
	var group = get_tree().get_nodes_in_group("Player")
	if group.size() > 0:
		player = group[0]
	
	for obj in Global.inventory:
		var weight = obj[4] #weight defined in global script
		weights.push_back(weight+totalWeight)
		totalWeight += weight
	
	var randVal = rng.randf_range(0,totalWeight)
	
	for i in range(weights.size()):
		if weights[i] > randVal:
			itemType = i
			sprite.texture = load(Global.inventory[i][2])
			sprite.offset.y = -((sprite.texture.get_height()-2)/2)
			break
			
	print(itemType)
		

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
					Global.inventory[itemType][3]+=1
					get_tree().call_group("Inventory","_update_items")
					destroy = true
					timer = pickupTime
			else:
				material.set_shader_parameter("line_thickness",0)
				timer = pickupTime
	if destroy:
		scale.x -= 10*delta
		scale.y -= 10*delta
		if scale.x <= 0:
			queue_free()
