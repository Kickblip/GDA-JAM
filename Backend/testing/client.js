const button = document.getElementById("requestButton")
const userMessageInput = document.getElementById("userMessage")
const chatHistoryContainer = document.getElementById("chatHistory")

const rootURL = "http://localhost:3000"

const exampleState = {
    npc: "thatch",
    userMessage: userMessageInput.value,
    chatSummary: "",
    npcItems: {
        cloth_rucksack: 35,
        apple_core: 6,
        tunnel_map: 21,
    },
    playerItems: {
        silver_coin: 19,
        bottle_cap: 9,
        doll_fabric: 24,
    },
    currentTrade: { userOffer: [], npcOffer: [] },
    availableActions: ["do_nothing", "end_conversation"],
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

        let npcMessage = ""
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
                const finalToken = parts[1]

                const summaryData = JSON.parse(finalToken)

                // Update the chat history
                exampleState.chatSummary = summaryData.summary

                console.log("Summary: ", summaryData.summary)
                console.log("Action: ", summaryData.action)

                // if the action is end_interaction, end the interaction
                if (summaryData.action === "end_conversation") {
                    userMessageInput.disabled = true

                    const finalMessage = document.createElement("div")
                    finalMessage.textContent = `[CONVERSATION ENDED]`
                    chatHistoryContainer.appendChild(finalMessage)
                }
            }

            messageParagraph.textContent += chunk
            npcMessage += chunk

            // Continue reading from the stream
            readStream()
        }

        readStream()
    } catch (error) {
        console.log(error)
    }
})
