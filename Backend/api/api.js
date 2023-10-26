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

app.get("/", (req, res) => {
    res.send("Online")
})

app.post("/chat", async (req, res) => {
    const QAModel = new OpenAI({ temperature: 0.5, modelName: "gpt-3.5-turbo", streaming: true })
    const summaryModel = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo", streaming: true })

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

    const summaryChain = new LLMChain({ llm: summaryModel, prompt: summaryInsertion })

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

app.post("/followup", async (req, res) => {
    const followUpModel = new OpenAI({ temperature: 0, modelName: "gpt-3.5-turbo", streaming: true })

    // create an array of all the possible items (only keys)
    const possibleItems = [...Object.keys(req.body.npcItems), ...Object.keys(req.body.playerItems)]

    const followUpInsertion = new PromptTemplate({
        template: followUpTemplate,
        inputVariables: ["currentSummary", "npcItems", "playerItems", "possibleItems"],
    })

    const followUpChain = new LLMChain({ llm: followUpModel, prompt: followUpInsertion })

    console.log({
        npcItems: JSON.stringify(req.body.npcItems),
        playerItems: JSON.stringify(req.body.playerItems),
        possibleItems: JSON.stringify(possibleItems),
        currentSummary: req.body.chatSummary,
    })

    const followUp = await followUpChain.call({
        npcItems: JSON.stringify(req.body.npcItems),
        playerItems: JSON.stringify(req.body.playerItems),
        possibleItems: JSON.stringify(possibleItems),
        currentSummary: req.body.chatSummary,
    })

    const npcOfferMatch = followUp.text.match(/#npcOffer=(.+?)#/)
    const userOfferMatch = followUp.text.match(/#playerOffer=(.+?)#/) // called 'player' in the template!

    const followUpData = {
        userOffer: userOfferMatch ? userOfferMatch[1].split(", ") : [],
        npcOffer: npcOfferMatch ? npcOfferMatch[1].split(", ") : [],
    }

    const followUpJSON = {
        userOffer: followUpData.userOffer,
        npcOffer: followUpData.npcOffer,
    }

    console.log("Followup JSON", followUpJSON)

    res.json(followUpJSON)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
