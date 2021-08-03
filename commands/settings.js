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
    
    if(file) {
        try {
            var guildsSettings = JSON.parse(file)
        } catch (err) {
            vars.log(err)
            return false
        }
    }else {
        var guildsSettings = {}
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

    if(file) {
        try {
            var jsonFile = JSON.parse(file)
        } catch (err) {
            vars.log(err)
            return findedSettings
        }
    }else {
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
            let args = message.content.split('=')
            let param = args.shift()
            let split = args.join('=')
            if(param) param = param.toLowerCase()
            if(split) split = split.split('\\"').join(Infinity).split('"')
            
            if(param && split) {
                let values = []
                for(let v in split) {
                    if(v%2===0) continue
                    values.push(split[v].split(Infinity).join('"'))
                }

                param = param.split(' ').join('')

                for(let setting in settings.list) {
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
        findedSettings.channelID = channelID
    }

    if(findedSettings) return findedSettings
}