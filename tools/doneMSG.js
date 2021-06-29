/**
 * Set the message as a confirm message after an action properly executed
 * @param {Discord.message} msg The message constructor
 * @param {Emoji} emoji An emoji to react
 * @returns {Boolean} false if error, true if done
 */
module.exports.doneMsg = async (msg, vars, emoji) => {
    let channel = vars.client.channels.cache.get(msg.channel.id)
    if(!channel) return false

    let message = channel.messages.cache.get(msg.id)
    if(!message || !message.deletable) return false

    await message.react(emoji)

    setTimeout(() => {
        if(!message || !message.deletable) return
        deleteMsg()
    }, vars.configs.doneMessageDeleteTimeout);

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
            message.delete()
            return true
        } catch (err) {
            vars.log(err)
            return false
        }
    }
}