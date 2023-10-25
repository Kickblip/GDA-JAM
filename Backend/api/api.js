import express from "express"
import cors from "cors"
import characters from "../characters/characters.js"
import { config } from "dotenv"
config()

import { OpenAI } from "langchain/llms/openai"
import { PromptTemplate } from "langchain/prompts"
import { LLMChain } from "langchain/chains"
import { QATemplate, followUpTemplate, summaryTemplate } from "./templates.js"

const app = express()
const PORT = 3000

app.use(cors()).use(express.json())
let message = ""

/*
Messaging Model
Input: Normal state
Returns: NPC message

Summary Model
Input: NPC message + user message + Chat history + current summary
Returns: Updated summary of trade chat history

Array Model - seperate call
Input: summary
Returns: Updated trade array
*/

app.post("/chat", async (req, res) => {
    const QAModel = new OpenAI({ temperature: 0.8, modelName: "gpt-3.5-turbo", streaming: true })
    const followUpModel = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo", streaming: true })

    const targetCharacter = req.body.npc
    const personality = characters[targetCharacter].personality

    const QAprompt = new PromptTemplate({
        template: QATemplate,
        inputVariables: [
            "personality",
            "chatHistory",
            "npcItems",
            "playerItems",
            "currentTrade",
            "userMessage",
            "currentSummary",
        ],
    })

    const QAchain = new LLMChain({ llm: QAModel, prompt: QAprompt })

    const summaryInsertion = new PromptTemplate({
        template: summaryTemplate,
        inputVariables: ["npcMessage", "userMessage", "currentSummary"],
    })

    const summaryChain = new LLMChain({ llm: followUpModel, prompt: summaryInsertion })

    const sanitizedQuestion = req.body.userMessage.trim().replaceAll("\n", " ")

    const finalizeInteraction = async (message) => {
        const summary = await summaryChain.call({
            npcMessage: message,
            userMessage: sanitizedQuestion,
            currentSummary: req.body.currentSummary,
        })

        const actionMatch = summary.text.match(/#action="([^"]+)"#/)
        const summaryMatch = summary.text.match(/#summary="([^"]+)"#/)

        const summaryData = {
            action: actionMatch ? actionMatch[1] : null,
            summary: summaryMatch ? summaryMatch[1] : null,
        }

        // clear the users message just to be safe
        message = ""

        res.write("[DONE]")
        console.log("[DONE]")
        res.write(JSON.stringify(summaryData))
        console.log(summaryData)
        res.end() // End the response stream
    }

    const completion = await QAchain.call({
        personality: personality,
        currentSummary: req.body.currentSummary,
        npcItems: JSON.stringify(req.body.npcItems),
        playerItems: JSON.stringify(req.body.playerItems),
        currentTrade: JSON.stringify(req.body.currentTrade),
        userMessage: sanitizedQuestion,
        callbacks: [
            {
                handleLLMNewToken(token) {
                    console.log(token)
                    message += token
                    res.write(token)
                },
            },
            {
                handleLLMEnd() {
                    finalizeInteraction(message)
                },
            },
        ],
    })
})

app.post("/followup", async (req, res) => {})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

// const followUpInsertion = new PromptTemplate({
//     template: followUpTemplate,
//     inputVariables: [
//         "possibleItems",
//         "currentTrade",
//         "userOffer",
//         "npcOffer",
//         "userMessage",
//         "npcMessage",
//         "npcItems",
//         "playerItems",
//     ],
// })

// add the npc items array and the player items array
// const possibleItems = [...req.body.npcItems, ...req.body.playerItems]

// console.log({
//     npcOffer: JSON.stringify(req.body.npcOffer),
//     userOffer: JSON.stringify(req.body.userOffer),
//     currentTrade: JSON.stringify(req.body.currentTrade),
//     userMessage: sanitizedQuestion,
//     npcMessage: message,
//     npcItems: JSON.stringify(req.body.npcItems),
//     playerItems: JSON.stringify(req.body.playerItems),
//     possibleItems: JSON.stringify(possibleItems),
// })

// const followUp = await followUpChain.call({
//     npcOffer: JSON.stringify(req.body.npcOffer),
//     userOffer: JSON.stringify(req.body.userOffer),
//     currentTrade: JSON.stringify(req.body.currentTrade),
//     userMessage: sanitizedQuestion,
//     npcMessage: message,
//     npcItems: JSON.stringify(req.body.npcItems),
//     playerItems: JSON.stringify(req.body.playerItems),
//     possibleItems: JSON.stringify(possibleItems),
// })

// const npcOfferMatch = followUp.text.match(/#npcOffer=(.+?)#/)
// const userOfferMatch = followUp.text.match(/#playerOffer=(.+?)#/) // called 'player' in the template!
// const actionMatch = followUp.text.match(/#action="([^"]+)"#/)

// const followUpData = {
//     userOffer: userOfferMatch ? userOfferMatch[1].split(", ") : [],
//     npcOffer: npcOfferMatch ? npcOfferMatch[1].split(", ") : [],
//     action: actionMatch ? actionMatch[1] : null,
// }

// const followUpJSON = JSON.stringify({
//     userOffer: followUpData.userOffer,
//     npcOffer: followUpData.npcOffer,
//     action: followUpData.action,
// })
