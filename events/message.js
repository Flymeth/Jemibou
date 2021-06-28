const fs = require('fs')
module.exports = {
    name: "ready",
    description: "When the bot is connect",
    active: true,
    run: async function (message, vars) {
        if(
            !message.content.startsWith(vars.configs.prefix)
            || message.channel.type === "dm"
            || message.author.bot
        ) return

        for(let perm of vars.configs.minPerms) {
            if(!message.channel.members.get(vars.client.user.id).permissions.has(perm)) {
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

        
        let args = message.content.split(vars.configs.argumentsSeparator)

        let cmdName=""

        if(vars.configs.prefixIsArg) {
            args.shift()
            cmdName = args.shift()
        }else {
            cmdName = (args.shift()).replace(vars.configs.prefix, '')
        }

        if(!cmdName) return

        try {
            var commands = fs.readdirSync(vars.configs.commandsPath)
        } catch (err) {
            console.log(err);
        }

        try {
            let finded = false
            for(let command of commands) {
                if(!command.endsWith('.js')) {
                    vars.log("file `" + command + "` isn't a command file!")
                    continue
                }

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
                        console.log(error);
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

                    cmd.run(message, vars, args)
                }
            }

            if(!finded) {
                message.reply(cmdName + ' command doesn\'t exit!')
            }
        } catch (err) {
            console.log(err);
        }
    }
}