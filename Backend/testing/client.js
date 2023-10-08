const button = document.getElementById("requestButton")
const responseDisplay = document.getElementById("message")
const completionDisplay = document.getElementById("completion")

const rootURL = "http://localhost:3000"

const exampleState = {
    npc: "thatch",
    userMessage: "I'd like to trade for your rucksack",
    chatHistory: [],
    npcItems: ["cloth_rucksack", "apple_core", "tunnel_map"],
    playerItems: ["silver_coin", "bottle_cap", "doll_fabric"],
    currentTrade: [],
    availableActions: ["do_nothing", "propose_trade", "end_conversation"],
}

button.addEventListener("click", async () => {
    try {
        const res = await fetch(`${rootURL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(exampleState),
        })

        const data = await res.json()

        console.log(data)

        responseDisplay.innerHTML = `
          <div><strong>Action:</strong> ${data.action}</div>

        `
        completionDisplay.innerHTML = `
        <div><strong>Message:</strong> ${data.completion}</div>
        `
    } catch (error) {
        responseDisplay.textContent = "Error fetching data"
    }
})
