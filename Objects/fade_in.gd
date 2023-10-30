extends AudioStreamPlayer

func _ready():
	volume_db = -80

func _process(delta):
	if volume_db < 0:
		volume_db += 50*delta
