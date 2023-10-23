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
        Here are the actions you are allowed to take:
        {availableActions}
        ========
        Here are the npc's items:
        {npcItems}
        And here are the items the npc is currently offering:
        {npcOffer}
        ========
        Here are the player's items:
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
        A player and an NPC are trading in a video game. 
        It is your job to generate a trade array based on the interaction between the player and the npc.
        You are given a list of the npc's items and players items.
        You are also given the items that the player and npc are currently offering.
        ========
        You also need to pick an action based on the interaction.
        If you believe the interaction between the player and npc is over, select "end_interaction".  Otherwise, select "do_nothing".
        ========
        You MUST use the formatting of the item IDs in the npc/player item arrays.
        ONLY remove an item from the npc/player offering if the user or npc changed their trade in the messages.
        You MUST answer in only the format given to you:

        #userOffer=[(items user wants to trade based on their message and the current trade array)]#
        #npcOffer=[(items npc wants to trade based on their message and the current trade array)]#
        #action="(the action you want to take)"#
        `

export { followUpTemplate, template }
