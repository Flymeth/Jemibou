/**
 * Set the message as a confirm message after an action properly executed
 * @param {Discord.message} msg The message constructor
 * @param {Emoji} emoji An emoji to react
 * @param {Array} otherMessages Other messages to delete
 * @returns {Boolean} false if error, true if done
 */
module.exports.doneMsg = async (msg, vars, emoji, otherMessages) => {
    const { channel } = msg
    if(!channel) return false

    let message = channel.messages.cache.get(msg.id)

    await message.react(emoji)

    setTimeout(() => {
        if(!message || !message.deletable) return
        deleteMsg()
    }, vars.configs.reactionMessageTimeout);

    vars.client.on('messageReactionAdd', async (reaction, user) => {
        if(
            user.bot
            || reaction.emoji.name !== emoji
            || !message 
            || !message.deletable
            || reaction.message.id !== message.id
        ) return
        
        deleteMsg()
    })

    function deleteMsg() {
        try {
            if(message && message.deletable) message.delete()

            if(otherMessages) {
                for(let msg of otherMessages) {
                    if(msg && msg.deletable) {
                        try {
                            msg.delete()
                        } catch (err) {
                            vars.log(err)
                        }
                    }
                }
            }
            return true
        } catch (err) {
            vars.log(err)
            return false
        }
    }
}