const fs = require('fs')
const {settings} = require('../configs.json')
module.exports = {
    name: "settings",
    alias: ["config", "setting", "configs"],
    description: "Modify the bot's settings in your serveur",
    ownersOnly: false,
    active: true,
    type: "configuration",
    color: "#F78484",
    deleteCommand: true,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args) => {
        if(!args[0]) {
            try {
                var commands = fs.readdirSync("./commands/settings/")
            } catch (err) {
                vars.log(err, "ERROR")
            }

            let embed = new vars.discord.MessageEmbed()
            .setTitle('Settings')
            .setDescription('Voici la liste des commandes:')
            for(let cmd of commands) {
                if(!cmd.endsWith(".js")) continue
                let command = require('./settings/' + cmd)
                embed.addField('settings ' + command.name, command.description)
            }
            embed.setColor("RANDOM")

            return e.channel.send(embed)
        }

        try {
            var command = require('./settings/' + args[0])
        } catch (err) {
            vars.log(err, "ERROR")
            e.reply("This command doesn't exist...")
            return
        }

        try {
            command.run(e, vars, args)
        } catch (err) {
            vars.log(err, "ERROR")
            e.reply("An error has come...")
            return
        }

    }
}




/**
 * 
 * @param {Discord.Channel} channel The channel
 * @param {*} vars the vars
 * @returns {Boolean} true if done, false else
 */
 module.exports.setSettings = (channel, vars) => {
    try {
        var file = fs.readFileSync(settings.path, {encoding: "utf-8"})
    } catch (err) {
        vars.log(err)
        return false
    }
    
    try {
        var guildsSettings = JSON.parse(file)
    } catch (err) {
        vars.log(err)
        return false
    }

    guildsSettings[channel.guild.id] = channel.id

    try {
        var file = fs.writeFileSync(settings.path, JSON.stringify(guildsSettings), {encoding: 'utf-8'})
    } catch (err) {
        vars.log(err)
        return false
    }

    return true
}

/**
 * @param {Discord.GuildID} guildId selected guild id
 * @param {*} vars vars
 * @returns {Object} return the settings objects
 */
module.exports.getSettings = async (guildId, vars, getChannelId) => {

    let findedSettings = {}
    for(let setting in settings.list) {
        findedSettings[setting] = settings.list[setting].value
    }

    try {
        var file = fs.readFileSync(settings.path)
    } catch (err) {
        vars.log(err)
        return findedSettings
    }

    try {
        var jsonFile = JSON.parse(file)
    } catch (err) {
        vars.log(err)
        return findedSettings
    }

    let channelID = jsonFile[guildId]

    if(!channelID) return findedSettings

    let guild = vars.client.guilds.cache.get(guildId)
    if(!guild) return false
    let channel = guild.channels.cache.get(channelID)
    if(!channel) return findedSettings

    await channel.messages.fetch({force: true, cache: true})

    let messages = channel.messages.cache

    messages.forEach(message => {
        if(message && message.content) {
            let param = message.content.split('=')[0]
            let split = message.content.split('=')[1]

            if(param) param = param.toLowerCase()
            if(split) split = split.toLowerCase().split('\\"').join(Infinity).split('"')

            
            if(param && split) {
                let values = []
                for(let v in split) {
                    if(v%2===0) continue
                    values.push(split[v].split(Infinity).join('"'))
                }

                param = param.split(' ').join('')
                
                for(let setting in settings.list) {
                    if(!settings.list[setting].modifiable) continue
                    if(param === setting.toLowerCase()) {
                        findedSettings[param] = values[0]
                    }
                }
            }
        }
    })

    if(getChannelId) {
        findedSettings.channelID = channelID
    }

    if(findedSettings) return findedSettings
}