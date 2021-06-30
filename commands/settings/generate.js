const {setSettings, getSettings} = require('../settings')
module.exports = {
    name: "generate",
    description: "générer un salon pour les settings",
    run: async (e, vars, args) => {
        let settings  = await getSettings(e.guild.id, vars, true)
        if(settings.channelID) {
            return e.reply('Your settings is here: <#' + settings.channelID + ">!")
        }

        e.guild.channels.create(vars.client.user.username + '-settings', {type: 'text', topic: 'write bot\'s settings here!'}).then(c => {
            let set = setSettings(c, vars)

            if(set) {
                e.reply('You channel is here: <#' + c + ">")
            }else {
                c.delete()
                e.reply('ERROR')
            }
        })
    }
}