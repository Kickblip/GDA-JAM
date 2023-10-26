const QATemplate = `
    {personality}
    ========
    You are bartering with the player given the following information about the current state of the trade.
    ========
    These are YOUR ITEMS (the number after each item is the value of the item):
    {npcItems}
    ========
    These are THE PLAYERS ITEMS (the number after each item is the value of the item):
    {playerItems}
    ========
    This is a summary of the previous messages between you and the player (if blank, this is the first interaction):
    {currentSummary}
    ========
    Here's the user's NEW message:
    {userMessage}
    ========
    NEVER mention the chat history and NEVER mention the value numbers.
    NEVER refuse a trade that has balanced value numbers.
    NEVER refuse to trade one of your items.
    NEVER continue to barter if the player has agreed to your offer.
    NEVER change your mind if the player has agreed to your offer.
    If the chat history and player message suggest that the player has agreed, ONLY say "Thank your for your business"
`

const summaryTemplate = `
    You are given a chat history and two messages from a player and an npc that are bartering. 
    Create a new chat summary based on the chat history and the two messages.
    Put more weight on the newer messages than the previous chat history when creating the new summary.
    Prioritize the newest information.
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

const followUpTemplate = `
    A player and an NPC are trading in a video game. 
    ========
    These are the items that can be traded:
    {possibleItems}
    ========
    This is the SUMMARY of the interactions between the player and the npc:
    {currentSummary}
    ========
    It is your job to generate a FINAL trade array based on the final trade in the summary.
    NEVER use a different formatting than the item IDs.
    NEVER include the value numbers in the trade array.
    NEVER put the player's 
    ONLY put the player's items in the playerOffer array and the npc's items in the npcOffer array. NEVER the other way around.
    You MUST answer in only this format:

    #playerOffer=[(items the PLAYER is offering)]#
    #npcOffer=[(items the NPC is offering)]#
`

export { followUpTemplate, QATemplate, summaryTemplate }
