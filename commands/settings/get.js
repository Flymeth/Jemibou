const {getSettings} = require('../settings')
module.exports = {
    name: "get",
    description: "Quel est le channel des settins ?",
    run: async (e, vars, args) => {
        let settings = await getSettings(e.guild.id, vars, true)

        if(!settings.channelID) return e.reply("To generate a settings channel, use `" + settings.prefix + "settings generate`!")

        e.reply(`Your settings channel is <#${settings.channelID}>!`)
    }
}