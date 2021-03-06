const {getSettings} = require('../settings')
module.exports = {
    name: "get",
    description: "Get the settings' channel (if it exists)",
    needPerms: {
        bot: [],
        user: ["MANAGE_GUILD"]
    },
    run: async (e, vars, args) => {
        let settings = await getSettings(e.guild.id, vars, true)

        if(!settings.channel) return e.reply("There isn't any settings channel. You can generate one by using `" + settings.prefix + "settings generate` or set an exist one with `" + settings.prefix + "settings set <channel>`, or by going on this link: http://jemibou.tk/dashboard?guild=" + e.guild.id + " !")

        e.reply(`Your settings channel is here: <#${settings.channel}>!`)
    }
}