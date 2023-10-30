extends Sprite2D

var player
var healthFactor = 0.0
@onready var blackout = $Blackout
var rng = RandomNumberGenerator.new()
var timer = 0

func _return_player():
	var group = get_tree().get_nodes_in_group("Player")
	if group[0] != null:
		player = group[0]

func _ready():
	_return_player()
	
func _process(delta):
	_return_player()
	healthFactor = 1-(player.hp/player.hpMax)
	blackout.size.y = healthFactor*11
	
	timer += (healthFactor*10)*delta
	scale = Vector2(10,10)*Global.sin_range(1-0.05,1+0.05,timer)
