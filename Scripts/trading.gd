extends HTTPRequest

var exampleState = {
	"npc": "thatch",
	"userMessage": "Hello there!",
	"chatSummary": "",
	"npcItems": {
		"cloth_rucksack": 35,
		"apple_core": 6,
		"tunnel_map": 21,
	},
	"playerItems": {
		"silver_coin": 19,
		"bottle_cap": 9,
		"doll_fabric": 24,
	},
	"currentTrade": { "userOffer": [], "npcOffer": [] },
	"availableActions": ["do_nothing", "end_conversation"],
}

func _ready():
	# Endpoint
	var url = "https://gda-game.kickball.repl.co/chat"

	# Convert the dictionary to a string
	var json_body = JSON.stringify(exampleState)

	var custom_headers = [
		"Content-Type: application/json",
	]
	
	request(url, custom_headers, HTTPClient.METHOD_POST, json_body)

	connect("request_completed", Callable(self, "_on_request_completed"))
	
func _make_followup_request():
	var followupUrl = "https://gda-game.kickball.repl.co/followup"

	# Convert the dictionary to a string
	var json_body = JSON.stringify(exampleState)

	var custom_headers = [
		"Content-Type: application/json",
	]
	
	request(followupUrl, custom_headers, HTTPClient.METHOD_POST, json_body)

	connect("request_completed", Callable(self, "_finalize_trade"))

func _finalize_trade(result, response_code, headers, body):
	if response_code == 200:
		var json = JSON.new()
		json.parse(body.get_string_from_utf8())
		var response = json.get_data()
		
		var userOffer = response.userTrade
		var npcOffer = response.npcOffer
		
		# cancel trade and send the final offer to the user
		
		

func _on_request_completed(result, response_code, headers, body):
	if response_code == 200:
		var body_str = body.get_string_from_utf8()
		
		var parts = body_str.split("[DONE]")
		
		# The first part is the message
		var message = parts[0]
		
		# The second part is the JSON content
		if parts.size() > 1:
			var json_content = parts[1]
			
			print("JSON Content to Parse:", json_content)
			
			var json = JSON.new()
			json.parse(json_content)
			var response = json.get_data()
			
			print("Message:", message)
			print("Parsed Dictionary:", response)
			
			exampleState.chatSummary = response.summary
			
			if response.action == "end_conversation":
				_make_followup_request()
			
		
			
		else:
			print("Error: Unexpected response format")
	else:
		print("Request failed with response code:", response_code)
