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
    const model = new OpenAI({ temperature: 0.8, modelName: "gpt-3.5-turbo" })

    const targetCharacter = req.body.npc
    const personality = characters[targetCharacter].personality

    const template = `
        {personality}
        ========
        Here are the previous messages between you and the player (if empty, this is the first message):
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
        You are able to take actions depending on the situation.
        If you are still deciding what the trade should be, select "do_nothing".
        If you and the player have offered items to trade and are bartering, select "propose_trade".
        If you think you and the player have come to an agreement, select "end_conversation".
        ========
        ONLY RESPOND IN THIS FORMAT:
        #message="(your text response to the player)"#
        #action="(the action you want to take)"#
        
        `

    const tradeArrayTemplate = `
        A player and and NPC are trading in a video game. You are given an array that represents the current trade and the most recent interaction between the player and the npc. It is your job to create an updated array based on how the interaction went. The trade array might not need to be changed and that is okay.  You are also given a list of the npc's items and players items to help make your selections.
        ========
        Here is the previous trade array:
        {currentTrade}
        ========
        Here are the npc's items:
        {npcItems}
        ========
        Here are the player's items:
        {playerItems}
        ========
        Here is the previous interaction between the player and the npc:
        {userMessage}
        {npcMessage}
        ========
        You MUST preserve the format of the trade. The trade is formatted as follows.
        If the user or npc is offering nothing, fill their array with the string "empty".
        You MUST preserve the format of the trade and you can ONLY respond in this format:

        #userOffer=[(items user wants to trade)]#
        #npcOffer=[(items npc wants to trade)]#

        `

    const QAprompt = new PromptTemplate({
        template: template,
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

    const QAchain = new LLMChain({ llm: model, prompt: QAprompt })

    const sanitizedQuestion = req.body.userMessage.trim().replaceAll("\n", " ")

    const result = await QAchain.call({
        personality: personality,
        chatHistory: req.body.chatHistory,
        npcItems: req.body.npcItems,
        playerItems: req.body.playerItems,
        currentTrade: req.body.currentTrade,
        userMessage: sanitizedQuestion,
        availableActions: req.body.availableActions,
    })

    console.log(req.body.chatHistory)

    console.log(result)

    const messageMatch = result.text.match(/#message="([^"]+)"#/)
    const actionMatch = result.text.match(/#action="([^"]+)"#/)

    const parsedResult = {
        message: messageMatch ? messageMatch[1] : null,
        action: actionMatch ? actionMatch[1] : null,
    }

    const tradePrompt = new PromptTemplate({
        template: tradeArrayTemplate,
        inputVariables: ["currentTrade", "userMessage", "npcMessage", "npcItems", "playerItems"],
    })

    const tradeChain = new LLMChain({ llm: model, prompt: tradePrompt })

    const updatedTrade = await tradeChain.call({
        currentTrade: req.body.currentTrade,
        userMessage: sanitizedQuestion,
        npcMessage: parsedResult.message,
        npcItems: req.body.npcItems,
        playerItems: req.body.playerItems,
    })

    console.log(updatedTrade)

    const npcOfferMatch = updatedTrade.text.match(/#npcOffer=(.+?)#/)
    const userOfferMatch = updatedTrade.text.match(/#userOffer=(.+?)#/)

    const tradeMatch = {
        userOffer: userOfferMatch ? userOfferMatch[1].split(", ") : [],
        npcOffer: npcOfferMatch ? npcOfferMatch[1].split(", ") : [],
    }

    console.log(tradeMatch)

    res.json({
        completion: parsedResult.message,
        action: parsedResult.action,
        updatedTrade: tradeMatch,
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
