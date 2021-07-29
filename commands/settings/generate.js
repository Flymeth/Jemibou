const {setSettings, getSettings} = require('../settings')
module.exports = {
    name: "generate",
    description: "generate a new settings\'s channel (if there isn\'t another one)",
    needPerm: true,
    permissions: ["MANAGE_CHANNELS"],
    run: async (e, vars, args) => {
        let settings  = await getSettings(e.guild.id, vars, true)
        if(settings.channelID) {
            return e.reply('Your settings channel is here: <#' + settings.channelID + ">!")
        }

        e.guild.channels.create(vars.client.user.username + '-settings', {type: 'text', topic: 'write bot\'s settings here!'}).then(c => {
            let set = setSettings(c, vars)

            if(set) {
                e.reply('You channel has been generate here: <#' + c + ">")
            }else {
                c.delete()
                e.reply('ERROR')
            }
        })
    }
}