const {status} = require('../_configs.json').channels

/**
 * function that actually the status message
 * @type {Promise}
 * @param {String} message the message
 * @param {String/Color} color the color of the message
 * @param {Object} vars the main vars
 * @param {String} annonce if this is a annoncement
 * @returns {Boolean} false if error, true else
 */
module.exports.change = async (message, color, vars, annonce) => {
    if (
        !message
        || !vars

    ) return false

    const embed = new vars.discord.MessageEmbed()
    .setTimestamp()
    if(color) embed.setColor(color)
    if(annonce) embed.setFooter("LASTEST ANNONCEMENT:\n" + message)
    else embed.setDescription(message)

    for(let id of status) {
        const channel = vars.client.channels.cache.get(id)
        if(!channel || !channel.isText()) {
            vars.log("ERROR: the channel with the id `" + id + "` is invalid!")
            continue
        }

        const messages = await channel.messages.fetch()
        const msg = messages.find(m => m.author.id === vars.client.user.id)
        if(!msg) {
            try {
                
                await channel.send(embed)

            } catch (err) {
                continue
            }
        }else {

            const lastEmbed = msg.embeds[0]
            for(let content in lastEmbed) {
                if(!embed[content]) embed[content] = lastEmbed[content]
            }
            await msg.edit(embed)

        }
    }

    return true

}