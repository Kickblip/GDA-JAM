import express from "express"
import cors from "cors"
import characters from "../characters/characters.js"
import { config } from "dotenv"
config()

import { OpenAI } from "langchain/llms/openai"
import { PromptTemplate } from "langchain/prompts"
import { LLMChain } from "langchain/chains"

const app = express()
const PORT = 3000

app.use(cors()).use(express.json())

const exampleState = {
    npc: "thatch",
    userMessage: "I'd like to trade for your rucksack",
    chatHistory: [],
    npcItems: ["cloth_rucksack", "apple_core", "tunnel_map"],
    playerItems: ["silver_coin", "bottle_cap", "doll_fabric"],
    currentTrade: [],
    availableActions: ["do_nothing", "propose_trade", "end_conversation"],
}

app.post("/chat", async (req, res) => {
    const model = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo" })

    const targetCharacter = req.body.npc
    const personality = characters[targetCharacter].personality

    const template = `
        {personality}
        ========
        Here are the previous messages between you and the player:
        {chatHistory}
        ========
        These are the items you have:
        {npcItems}
        ========
        These are the items the player has:
        {playerItems}
        ========
        These are the items that have been proposed for trade (if empty, no trade is currently being proposed):
        {currentTrade}
        ========
        Here's the user's message:
        {userMessage}
        ========
        These are the actions you can take, you must choose one:
        {availableActions}
        ========
        ONLY RESPOND IN THIS FORMAT:
        #message="(your text response to the player)"#
        #action="(the action you want to take)"#
        
        `

    const prompt = new PromptTemplate({
        template,
        inputVariables: [
            "personality",
            "chatHistory",
            "npcItems",
            "playerItems",
            "currentTrade",
            "userMessage",
            "availableActions",
        ],
    })

    const chain = new LLMChain({ llm: model, prompt })

    const result = await chain.call({
        personality: personality,
        chatHistory: req.body.chatHistory,
        npcItems: req.body.npcItems,
        playerItems: req.body.playerItems,
        currentTrade: req.body.currentTrade,
        userMessage: req.body.userMessage,
        availableActions: req.body.availableActions,
    })
    console.log(result)

    const messageMatch = result.text.match(/#message="([^"]+)"#/)
    const actionMatch = result.text.match(/#action="([^"]+)"#/)

    const parsedResult = {
        message: messageMatch ? messageMatch[1] : null,
        action: actionMatch ? actionMatch[1] : null,
    }

    res.json({
        completion: parsedResult.message,
        action: parsedResult.action,
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
