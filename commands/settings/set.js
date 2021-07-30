const { version } = require('discord.js')
const {setSettings} = require('../settings')
module.exports = {
    name: "set",
    description: "Set a new settings' channel (if there isn't argument, it'll set the settings' channel on the current text channel)",
    needPerms: true,
    run: (e, vars, args) => {
        if(!args[0]){
            var channel = e.channel
        }else {
            var channel = e.mentions.channels.first() || e.guild.channels.cache.get(args[0]) || e.guild.channels.cache.find(c => c.name.toLowerCase() === args[0].toLowerCase() && c.isText())
        }

        if(!channel || !channel.isText()) return e.reply('Please indicate a text channel!')

        let set = setSettings(channel, vars)

        if(set) {
            e.reply(`Settings channel set to <#${channel.id}>!`)
        }else {
            return e.reply('ERROR').then(msg => vars.setEndMessage(msg, "😒"))
        }
    }
}