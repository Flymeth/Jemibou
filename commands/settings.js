const fs = require('fs')
const {settings} = require('../_configs.json')
const {check} = require('../tools/checkPremium')
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
    run: async (e, vars, args, settings) => {
        let type = args.shift()

        if(!type) {
            try {
                var commands = fs.readdirSync("./commands/settings/")
            } catch (err) {
                vars.log(err, "ERROR")
            }

            let embed = vars.newEmbed()
            .setDescription('Settings commands list:')
            .setThumbnail(vars.assets.images.settings)
            for(let cmd of commands) {
                if(!cmd.endsWith(".js")) continue
                let command = require('./settings/' + cmd)
                embed.addField(settings.prefix + 'settings ' + command.name, command.description)
            }

            return e.channel.send(embed)
        }

        try {
            var command = require('./settings/' + type)
        } catch (err) {
            vars.log(err, "ERROR")
            e.reply("This command doesn't exist...")
            return
        }

        if(command.needPerms) {
            for(let perm of command.needPerms.user) {
                if(!e.member.hasPermission(perm) && e.author.id !== e.guild.ownerID) {
                    return e.reply("You need to have the `" + perm + "` permission!")
                }
            }

            for(let perm of command.needPerms.bot) {
                if(!e.guild.me.hasPermission(perm)) {
                    return e.reply("I need to have the `" + perm + "` permission!")
                }
            }
        }

        if(command.premium) {
            const canDoCommand = await check(command.premium, vars, e.author)
            if(!canDoCommand) return e.reply("This command is only for `" + command.premium + "` users!")
        }

        if(command.permissions) {
            for(let perm of command.permissions) {
                if(!e.guild.me.permissions.has(perm)) {
                    return e.reply(`I need the \`${perm}\` permission for this command!`)
                }
            }
        }

        try {
            command.run(e, vars, args, settings)
        } catch (err) {
            vars.log(err, "ERROR")
            e.reply("An error has come...")
            return
        }

    }
}




/**
 * 
 * @param {Discord.Channel} guild The guild
 * @param {*} vars the vars
 * @param {Object} input The input
 * @returns {Boolean} true if done, false else
 */
 module.exports.setSettings = (guild, vars, input) => {
    try {
        var guildsSettings = require('.' + settings.path)
    } catch (err) {
        vars.log(err)
        return false
    }

    if(!guildsSettings[guild.id]) guildsSettings[guild.id] = {}

    if(input.channel) guildsSettings[guild.id].channel = input.channel
    if(input.settings) guildsSettings[guild.id].settings = input.settings

    try {
        fs.writeFileSync(settings.path, JSON.stringify(guildsSettings), {encoding: 'utf-8'})
    } catch (err) {
        vars.log(err)
        return false
    }

    return "saved"
}

/**
 * @param {String} guildId selected guild id
 * @param {Object} vars vars
 * @param {Boolean} getChannelId If yes or no the object includes the settings channel id
 * @returns {Object} return the settings objects
 */
module.exports.getSettings = async (guildId, vars, getChannelId) => {
    let findedSettings = {}
    for(let setting in settings.list) {
        if(!settings.list[setting].modifiable) continue
        findedSettings[setting] = settings.list[setting].value
    }

    try {
        jsonFile= require('.' + settings.path)
    } catch (e) {
        vars.log(err)
        return findedSettings
    }

    if(!jsonFile[guildId]) return findedSettings
    const channelID = jsonFile[guildId].channel
    const guildSettings = jsonFile[guildId].settings

    
    if(!channelID && !guildSettings) return findedSettings
    if(guildSettings) {
        for(let setting in findedSettings) {
            if(guildSettings[setting] !== undefined) findedSettings[setting] = guildSettings[setting]
        }
    }
    
    let guild = vars.client.guilds.cache.get(guildId)
    if(!guild) return false
    let channel = guild.channels.cache.get(channelID)
    if(!channel) return findedSettings

    await channel.messages.fetch({force: true, cache: true})

    let messages = channel.messages.cache
    messages.forEach(message => {
        if(message && message.content) {
            let args = message.content.split('=')
            let param = args.shift()
            if(param) param = param.toLowerCase().split(' ').join('')

            let split = args.join('=')
            if(split) {
                var splitByQuotes = split.split('\\"').join(Infinity).split('"')
                var splitBySpaces = split.split(' ')
            }

            if(splitBySpaces) while(splitBySpaces[0] === '' || splitBySpaces[0] === "\n") splitBySpaces.shift()
            
            if(param && (splitByQuotes || splitBySpaces)) {
                for(let setting in settings.list) {
                    let values = []

                    if(settings.list[setting].isParagraph) {
                        for(let v in splitByQuotes) {
                            if(v%2===0) continue
                            values.push(splitByQuotes[v].split(Infinity).join('"'))
                        }
                    }else {
                        values = splitBySpaces
                    }


                    if(!settings.list[setting].modifiable || !values[0] || !values[0].split(' ').join('')) continue
                    
                    for(let v in values) {
                        while(values[v].startsWith(" ")) {
                            values[v] = values[v].replace(' ','')
                        }
                    }

                    if(param.toLowerCase() === setting.toLowerCase()) {
                        if(typeof findedSettings[setting] === "object") {
                            findedSettings[setting] = values
                        }else {
                            findedSettings[setting] = values[0]
                        }
                    }
                }
            }
        }
    })

    if(getChannelId) {
        findedSettings.channel = channelID
    }

    if(findedSettings) return findedSettings
}