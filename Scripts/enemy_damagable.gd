class_name EnemyDamageable
extends CharacterBody2D

var damage = 10
var hp = 50

func take_damage(damageTaken):
	hp -= damageTaken
	var damageEffect = load("res://Objects/damage_effect.tscn").instantiate()
	damageEffect.position = position
	get_tree().root.add_child(damageEffect)

	if hp <= 0:
		queue_free()
