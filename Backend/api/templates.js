const template = `
        {personality}
        ========
        Here are the previous messages between you and the player (IF EMPTY, THIS IS THE FIRST MESSAGE):
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

        `

const followUpTemplate = `
        A player and an NPC are trading in a video game. 
        It is your job to generate a trade array based on a previous trade, the items of both parties, and the message interactions between them.
        ========
        Here are the PLAYER's items:
        {playerItems}

        Here is what the PLAYER is offering:
        {userOffer}

        And here's the PLAYER's last message:
        {userMessage}
        ========
        Here are the NPC's items:
        {npcItems}

        Here is what the NPC is offering:
        {npcOffer}

        And here's the NPC's last message:
        {npcMessage}
        ========
        This is the previous trade array based on the information above:
        {currentTrade}
        ========
        You MUST use the formatting of the item IDs in the npc/player item arrays.
        ONLY remove an item from the npc/player offering if the player or npc changed their trade in the messages.
        When populating the new trade arrays, ONLY consider the npc/player MESSAGES and the PREVIOUS TRADE ARRAY.
        If you believe the interaction between the player and npc is over, fill action with "end_conversation".  Otherwise, fill it with "do_nothing".
        You MUST answer in only the format given to you:

        #playerOffer=[(items player wants to trade based on their message and the previous trade array)]#
        #npcOffer=[(items npc wants to trade based on their message and the previous trade array)]#
        #action="(the action you want to take)"#
        `

const holder = `
You also need to pick an action based on the interaction.
Here are the actions you are allowed to take:
{availableActions}

`

export { followUpTemplate, template }
