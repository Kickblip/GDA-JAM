import express from "express"
import cors from "cors"
import characters from "../characters/characters.js"
import { config } from "dotenv"
config()

import { OpenAI } from "langchain/llms/openai"
import { PromptTemplate } from "langchain/prompts"
import { LLMChain } from "langchain/chains"
import { template, followUpTemplate } from "./templates.js"

const app = express()
const PORT = 3000

app.use(cors()).use(express.json())

app.post("/chat", async (req, res) => {
    const model = new OpenAI({ temperature: 0.8, modelName: "gpt-3.5-turbo", streaming: true })
    const followUpModel = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo", streaming: true })

    const targetCharacter = req.body.npc
    const personality = characters[targetCharacter].personality

    const QAprompt = new PromptTemplate({
        template: template,
        inputVariables: ["personality", "chatHistory", "npcItems", "playerItems", "currentTrade", "userMessage"],
    })

    const QAchain = new LLMChain({ llm: model, prompt: QAprompt })

    const followUpInsertion = new PromptTemplate({
        template: followUpTemplate,
        inputVariables: ["currentTrade", "userOffer", "npcOffer", "userMessage", "npcMessage", "npcItems", "playerItems"],
    })

    const followUpChain = new LLMChain({ llm: followUpModel, prompt: followUpInsertion })

    const sanitizedQuestion = req.body.userMessage.trim().replaceAll("\n", " ")

    const finalizeInteraction = async (message) => {
        console.log({
            currentTrade: req.body.currentTrade,
            userMessage: sanitizedQuestion,
            npcMessage: message,
            npcItems: req.body.npcItems,
            playerItems: req.body.playerItems,
            curretnTrade: req.body.currentTrade,
        })

        const followUp = await followUpChain.call({
            npcOffer: req.body.npcOffer,
            userOffer: req.body.userOffer,
            currentTrade: req.body.currentTrade,
            userMessage: sanitizedQuestion,
            npcMessage: message,
            npcItems: req.body.npcItems,
            playerItems: req.body.playerItems,
        })

        const npcOfferMatch = followUp.text.match(/#npcOffer=(.+?)#/)
        const userOfferMatch = followUp.text.match(/#playerOffer=(.+?)#/) // called 'player' in the template!
        const actionMatch = followUp.text.match(/#action="([^"]+)"#/)

        const followUpData = {
            userOffer: userOfferMatch ? userOfferMatch[1].split(", ") : [],
            npcOffer: npcOfferMatch ? npcOfferMatch[1].split(", ") : [],
            action: actionMatch ? actionMatch[1] : null,
        }

        const followUpJSON = JSON.stringify({
            userOffer: followUpData.userOffer,
            npcOffer: followUpData.npcOffer,
            action: followUpData.action,
        })

        res.write("[DONE]")
        console.log("[DONE]")
        res.write(followUpJSON)
        console.log(followUpJSON)
        res.end() // End the response stream
    }

    let message = ""
    const completion = await QAchain.call({
        personality: personality,
        chatHistory: JSON.stringify(req.body.chatHistory),
        npcItems: req.body.npcItems,
        playerItems: req.body.playerItems,
        currentTrade: req.body.currentTrade,
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
