extends Button

func _process(delta):
	if visible:
		if Global.keyCount >= 2:
			disabled = false
			$Label.visible = false
		else:
			disabled = true
