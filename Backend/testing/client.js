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

        if (!res.ok) {
            throw new Error(`API responded with ${res.status}`)
        }

        const reader = res.body.getReader()

        // Create a paragraph to hold the incoming data
        const messageParagraph = document.createElement("p")
        chatHistoryContainer.appendChild(messageParagraph)

        // Read data from the stream
        const readStream = async () => {
            const { done, value } = await reader.read()
            if (done) {
                return
            }

            // Convert the Uint8Array to a string
            let chunk = new TextDecoder().decode(value)

            // Check for the [DONE] delimiter
            if (chunk.includes("[DONE]")) {
                const parts = chunk.split("[DONE]")
                chunk = parts[0]

                // Handle the token after [DONE]
                const specialToken = parts[1]
                const specialElement = document.createElement("div")
                specialElement.textContent = specialToken
                chatHistoryContainer.appendChild(specialElement)
            }

            messageParagraph.textContent += chunk

            // Continue reading from the stream
            readStream()
        }

        readStream()
    } catch (error) {
        console.log(error)
    }
})
