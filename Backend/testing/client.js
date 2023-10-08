const button = document.getElementById("requestButton")
const userMessageInput = document.getElementById("userMessage")
const chatHistoryContainer = document.getElementById("chatHistory")

const rootURL = "http://localhost:3000"

const exampleState = {
    npc: "thatch",
    userMessage: userMessageInput.value,
    chatHistory: [],
    npcItems: ["cloth_rucksack", "apple_core", "tunnel_map"],
    playerItems: ["silver_coin", "bottle_cap", "doll_fabric"],
    currentTrade: [],
    availableActions: ["do_nothing", "propose_trade", "end_conversation"],
}

button.addEventListener("click", async () => {
    exampleState.userMessage = userMessageInput.value

    userMessageInput.value = ""

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

        exampleState.chatHistory.push({
            userMessage: exampleState.userMessage,
            npcMessage: data.completion,
        })

        const newMessage = document.createElement("div")
        newMessage.innerHTML = `
            <div>
                <strong>Message: </strong> ${exampleState.userMessage}
                <br>
                <strong>Response:</strong> ${data.completion}
                <br>
                <strong>Action:</strong> ${data.action}
            </div>
        `

        chatHistoryContainer.appendChild(newMessage)
    } catch (error) {
        console.log(error)
    }
})
