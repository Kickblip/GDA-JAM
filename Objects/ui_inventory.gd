extends Control

var open = false
var transitionSpeed = 5
var targetX = -800
@onready var items = $Items

func _process(delta):
	if Input.is_action_just_pressed("inventory"):
		_update_items()
		if !open:
			open = true
			targetX = 0
		else:
			open = false
			targetX = -800
	
	position.x = lerpf(position.x,targetX,transitionSpeed*delta)
	
func _update_items():
	Global.inventory.sort()
	
	items.queue_free()
	items = Node2D.new()
	items.set_name("Items")
	add_child(items)
	var startPos = Vector2(100,250)
	var rowCount = 0
	
	for item in Global.inventory:
		if item[3] > 0: #only add item sprite to inventory if there is at least 1 item
			var node = load("res://Objects/Inventory/inventory_item.tscn").instantiate()
			items.add_child(node)
			node.get_node("Sprite2D").texture = load(item[2])
			node.position = startPos
			node.get_node("Count").text = "x" + str(item[3])
			node.get_node("Info").text = item[0] + "\n" + str(item[1]) + " Value"
			rowCount += 1
			startPos.x += 40*3
			if rowCount == 5:
				rowCount = 0
				startPos.y += 40*3
				startPos.x = 100
			
