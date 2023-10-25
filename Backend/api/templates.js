const QATemplate = `
    {personality}
    ========
    These are YOUR ITEMS:
    {npcItems}
    ========
    These are THE PLAYERS ITEMS:
    {playerItems}
    ========
    This is a summary of the interactions between you and the player (if empty, this is the first interaction):
    {currentSummary}
    ========
    Here's the user's NEW message:
    {userMessage}
    ========
    Do NOT mention the value numbers of the items, do NOT mention the chat history, and do NOT use the actual item IDs to reference items.
    Every item ID is followed by a value to help you determine the fairness of a trade.
    Your trades MUST make sense in the context of these values.
    If you do not like the trade, offer something else.
    You MUST be open to trading for any of your items.
    YOU MUST USE THE SUMMARY OF INTERACTIONS to determine what items are being offered.
    Your actions MUST align with the history of the chat summary.
    You are NOT allowed to change your mind from the chat summary.
`

const followUpTemplate = `
    A player and an NPC are trading in a video game. 
    ========
    These are all the items that could be traded:
    {possibleItems}
    ========
    This is the PREVIOUS trade array (if empty, no trade is currently being proposed):
    {currentTrade}

    The PLAYER's last message was:
    {userMessage}

    The NPC's last message was:
    {npcMessage}
    ========
    It is your job to update the previous trade array based on the messages between the player and the NPC.

    You MUST preserve the formatting of the item IDs.
    ONLY remove an item from the trade array if the player or npc changed their trade in the messages.
    ONLY add an item to the trade array if it is mentioned in the messages.
    NEVER add an item to the trade array if the player or npc does not want to trade it.
    NEVER include the value numbers in the trade array.
    ONLY put the player's items in the playerOffer array and the npc's items in the npcOffer array. NEVER the other way around.
    If you believe the interaction between the player and npc is over, fill action with "end_conversation".  Otherwise, fill it with "do_nothing".
    You MUST answer in only this format:

    #playerOffer=[(items the PLAYER is offering)]#
    #npcOffer=[(items the NPC is offering)]#
    #action="(the action the npc should take)"#
`

const summaryTemplate = `
    You are given a chat history and two messages from a player and an npc that are bartering. 
    Create a new chat summary based on the chat history and the two messages.
    Put more weight on the two messages than the chat history when creating the new summary.
    Have an emphasis on the items being traded and who is offering what.
    New information should always be added at the end of the summary, keeping it in chronological order.
    ========
    Here is the previous chat history:
    {currentSummary}
    ========
    Here is the PLAYER's new message:
    {userMessage}
    ========
    Here is the NPC's new message:
    {npcMessage}
    ========
    You also must select an action for the NPC to take. If you believe the interaction between the player and npc is over, fill action with "end_conversation".  Otherwise, fill it with "do_nothing".
    You can ONLY answer in the following format:

    #summary="(the new summary)"#
    #action="(the action the npc should take)"#
`

export { followUpTemplate, QATemplate, summaryTemplate }
