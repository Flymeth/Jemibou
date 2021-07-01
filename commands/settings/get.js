const {getSettings} = require('../settings')
module.exports = {
    name: "get",
    description: "Get the settings' channel (if it exists)",
    run: async (e, vars, args) => {
        let settings = await getSettings(e.guild.id, vars, true)

        if(!settings.channelID) return e.reply("There isn't any settings channel. You can generate one by using `" + settings.prefix + "settings generate` or set an exist one with `" + settings.prefix + "settings set <channel>`!")

        e.reply(`Your settings channel is here: <#${settings.channelID}>!`)
    }
}