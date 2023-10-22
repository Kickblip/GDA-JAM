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
    currentTrade: { userOffer: [], npcOffer: [] },
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

        let chunks = []
        const reader = res.body.getReader()
        let decoder = new TextDecoder()

        while (true) {
            const { done, value } = await reader.read()

            if (done) {
                break
            }

            chunks.push(value)
        }

        let fullResponse = decoder.decode(Buffer.concat(chunks))
        let splitResponse = fullResponse.split("#END_OF_CHAT_MESSAGE#")

        const chatMessage = splitResponse[0]
        const followUpData = JSON.parse(splitResponse[1])

        exampleState.chatHistory.push({
            userMessage: exampleState.userMessage,
            npcMessage: chatMessage,
        })

        exampleState.currentTrade = {
            userOffer: followUpData.userOffer,
            npcOffer: followUpData.npcOffer,
        }

        const newMessage = document.createElement("div")
        newMessage.innerHTML = `
            <div>
                <strong>Message: </strong> ${exampleState.userMessage}
                <br>
                <strong>Response:</strong> ${chatMessage}
                <br>
                <strong>Action:</strong> ${followUpData.action}
                <br>
                <strong>New Trade Array:</strong> userOffer:(${followUpData.userOffer}) npcOffer:(${followUpData.npcOffer})
            </div>
        `

        chatHistoryContainer.appendChild(newMessage)
    } catch (error) {
        console.log(error)
    }
})
