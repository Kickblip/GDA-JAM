import { config } from "dotenv"
import { OpenAI } from "langchain/llms/openai"
import { PromptTemplate } from "langchain/prompts"
import { LLMChain } from "langchain/chains"
config()
const model = new OpenAI({ temperature: 0.8, modelName: "gpt-3.5-turbo", streaming: true })

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

        `

const followUpTemplate = `
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
        Here are the actions you are allowed to take:
        {availableActions}
        ========
        Here is the previous interaction between the player and the npc:
        {userMessage}
        {npcMessage}
        ========

        You MUST preserve the format of the trade. The trade is formatted as follows.
        If the user or npc is offering nothing, fill their array with the string "empty".
        ========
        You also need to pick an action based on the interaction.
        If you are still deciding what the trade should be, select "do_nothing".
        If you and the player have offered items to trade and are bartering, select "propose_trade".
        If you think you and the player have come to an agreement, select "end_conversation".
        ========
        You MUST preserve the format of the trade and you can ONLY respond in this format:

        #userOffer=[(items user wants to trade)]#
        #npcOffer=[(items npc wants to trade)]#

        Once you have decided on the trade array, you will select your action in this format:
        #action="(the action you want to take)"#
        `

const QAprompt = new PromptTemplate({
    template: template,
    inputVariables: ["personality", "chatHistory", "npcItems", "playerItems", "currentTrade", "userMessage"],
})

const QAchain = new LLMChain({ llm: model, prompt: QAprompt })

const followUpInsertion = new PromptTemplate({
    template: followUpTemplate,
    inputVariables: ["currentTrade", "userMessage", "npcMessage", "npcItems", "playerItems", "availableActions"],
})

const followUpChain = new LLMChain({ llm: model, prompt: followUpInsertion })

const finalizeInteraction = async (message) => {
    const followUp = await followUpChain.call({
        currentTrade: [],
        userMessage: "I'd like to buy your apple core",
        npcMessage: message,
        npcItems: ["cloth_rucksack", "apple_core", "tunnel_map"],
        playerItems: ["silver_coin", "bottle_cap", "doll_fabric"],
        availableActions: ["do_nothing", "propose_trade", "end_conversation"],
    })

    const npcOfferMatch = followUp.text.match(/#npcOffer=(.+?)#/)
    const userOfferMatch = followUp.text.match(/#userOffer=(.+?)#/)
    const actionMatch = followUp.text.match(/#action="([^"]+)"#/)

    const followUpData = {
        userOffer: userOfferMatch ? userOfferMatch[1].split(", ") : [],
        npcOffer: npcOfferMatch ? npcOfferMatch[1].split(", ") : [],
        action: actionMatch ? actionMatch[1] : null,
    }

    console.log({
        userOffer: followUpData.userOffer,
        npcOffer: followUpData.npcOffer,
        action: followUpData.action,
    })
}

let message = ""
const completion = await QAchain.call({
    personality: "you are a friendly npc",
    chatHistory: [],
    npcItems: ["cloth_rucksack", "apple_core", "tunnel_map"],
    playerItems: ["silver_coin", "bottle_cap", "doll_fabric"],
    currentTrade: [],
    userMessage: "I'd like to buy your apple core",
    callbacks: [
        {
            handleLLMNewToken(token) {
                console.log(token)
                message += token
            },
        },
        {
            handleLLMEnd() {
                console.log("[END]")
                console.log(message)
                finalizeInteraction(message)
            },
        },
    ],
})
