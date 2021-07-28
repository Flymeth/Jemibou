const fs = require('fs')
const {getSettings} = require('../commands/settings')
module.exports = {
    name: "message",
    description: "When the bot receive a message",
    active: true,
    run: async (message, vars) => {
        if(
            message.channel.type === "dm"
            || message.author.bot
        ) return

        let settings = await getSettings(message.guild.id, vars, true)

        let args = message.content.replace(settings.prefix, '').split(vars.configs.argumentsSeparator)

        if(settings.bannedWords.length>0 && message.channel.id !== settings.channelID) {
            require('../tools/bannedWords').run(message, vars, args, settings.bannedWords)
        }
        
        if(!message.content.startsWith(settings.prefix)) {
            if(message.content.replace('!','') === `<@${vars.client.user.id}>`) {
                message.reply("My prefix on this server is `" + settings.prefix + "`!")
            }
            return
        }

        for(let perm of vars.configs.minPerms) {
            if(!message.guild.me.permissions.has(perm)) {
                try {
                    let embed = new vars.discord.MessageEmbed()
                    .setTitle('ERROR')
                    .setDescription(`I don't have enought permission to work properly. Needed permission: \`${perm}\`!`)
                    .setColor(vars.configs.colors.invalid)
                    await message.channel.send(embed)
                } catch (err) {
                    vars.log(err);
                }
                return
            }
        }
        
        let cmdName=""
        cmdName = (args.shift()).split(' ').join('')

        if(!cmdName) return

        try {
            var commands = fs.readdirSync(vars.configs.commandsPath)
        } catch (err) {
            vars.log(err);
        }

        try {
            let finded = false
            for(let command of commands) {
                if(!command.endsWith('.js')) continue

                let runCommand = false

                let cmd = require('.' + vars.configs.commandsPath + command)
                
                if(!cmd.active) continue
                
                if(cmd.name.toLowerCase() === cmdName.toLowerCase()) {
                    runCommand = true
                }

                if(!cmd.alias) continue

                for(let alias of cmd.alias) {
                    if(alias.toLowerCase() === cmdName.toLowerCase()) {
                        runCommand = true
                        break
                    }
                }

                if(runCommand) {
                    if(cmd.ownersOnly) {
                        let allow = false
                        for(let ownerid of vars.configs.owners) {
                            if(ownerid === message.author.id) {
                                allow = true
                            }
                        }

                        if(!allow) {
                            return message.reply('you can\'t do that!')
                        }
                    }

                    finded = true

                    try {
                        if(cmd.deleteCommand) await message.channel.messages.delete(message)
                    } catch (error) {
                        vars.log(error);
                    }

                    for(let perm of cmd.permissions.user) {
                        let hasPerm = message.channel.members.get(message.author.id).permissions.has(perm)
                        if(!hasPerm) return message.reply(`You haven't the \`${perm}\` permission!`)
                    }

                    for(let perm of cmd.permissions.bot) {
                        let hasPerm = message.channel.members.get(vars.client.user.id).permissions.has(perm)
                        if(!hasPerm) return message.reply(`I haven't the \`${perm}\` permission!`)
                    }

                    vars.log(message.author.tag + ' used command `' + cmd.name + '` with arg(s): `[' + args.join(',') + ']`', cmd.color)
                    
                    await message.guild.members.fetch({force: true, cache: true})
                    await message.channel.messages.fetch({force: true, cache: true})
                    cmd.run(message, vars, args, settings)
                }
            }

            if(!finded) {
                return
            }
        } catch (err) {
            vars.log(err);
        }
    }
}