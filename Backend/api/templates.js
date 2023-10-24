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
        A player and an NPC are trading in a video game. 
        It is your job to generate a trade array based on a previous trade, the items of both parties, and the message interactions between them.
        ========
        Here are the npc's items (YOU MUST USE THESE IDS WHEN REFERENCING THE ITEMS):
        {npcItems}
        And here are the items the npc is currently offering:
        {npcOffer}
        ========
        Here are the player's items (YOU MUST USE THESE IDS WHEN REFERENCING THE ITEMS):
        {playerItems}
        And here are the items the player is currently offering:
        {userOffer}
        ========
        Here is the user's last message:
        {userMessage}
        ========
        Here is the npc's last message:
        {npcMessage}
        ========
        You MUST use the formatting of the item IDs in the npc/player item arrays.
        ONLY remove an item from the npc/player offering if the user or npc changed their trade in the messages.
        If you believe the interaction between the player and npc is over, fill action with "end_conversation".  Otherwise, fill it with "do_nothing".
        You MUST answer in only the format given to you:

        #userOffer=[(items user wants to trade based on their message and the current trade array)]#
        #npcOffer=[(items npc wants to trade based on their message and the current trade array)]#
        #action="(the action you want to take)"#
        `

const holder = `
You also need to pick an action based on the interaction.
Here are the actions you are allowed to take:
{availableActions}

`

export { followUpTemplate, template }
