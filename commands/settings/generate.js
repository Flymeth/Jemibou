const {setSettings, getSettings} = require('../settings')
module.exports = {
    name: "generate",
    description: "generate a new settings\'s channel (if there isn\'t another one)",
    needPerms: {
        bot: ["MANAGE_CHANNELS"],
        user: ["MANAGE_GUILD"]
    },
    run: async (e, vars, args) => {
        let settings  = await getSettings(e.guild.id, vars, true)
        if(settings.channel) {
            return e.reply('Your settings channel is here: <#' + settings.channel + ">!")
        }

        e.guild.channels.create(vars.client.user.username + '-settings', {type: 'text', topic: 'write bot\'s settings here!'}).then(c => {
            let set = setSettings(e.guild, vars, {channel: c.id})

            if(set) {
                e.reply('You channel has been generate here: <#' + c + ">").then(msg => vars.setEndMessage(msg, "👍"))
            }else {
                c.delete()
                e.reply('ERROR')
            }
        })
    }
}