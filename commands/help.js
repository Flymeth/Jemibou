const fs = require('fs')
module.exports = {
    name: "help",
    alias: ["h"],
    description: "Get help",
    ownersOnly: false,
    active: true,
    type: "usefull",
    color: "RANDOM",
    arguments: "<command name>",
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        try {
            var cmds = fs.readdirSync(vars.configs.commandsPath)
        } catch (err) {
            vars.log(err);
        }

        let commands = {}
        let cmdByTypes = {}

        try {
            for(let command of cmds) {
                if(!command.endsWith('.js')) continue

                let cmd = require('.' + vars.configs.commandsPath + command)
                if(!cmd.active) continue
                commands[cmd.name.toLowerCase()] = cmd
                cmdByTypes[cmd.type] = []
            }
        } catch (err) {
            vars.log(err);
        }

        // Si ya un args[0] & que cet args[0] est une commande: donner plus d'infos sur celle-ci
        if(args[0]) {
            let infos = commands[args[0].toLowerCase()]

            for(let cmd in commands) {
                for(let alias of commands[cmd].alias) {
                    if(args[0].toLowerCase() === alias) {
                        infos = commands[cmd]
                        break
                    }
                }
            }

            if(infos) {
                let embed = new vars.discord.MessageEmbed()
                .setTitle(settings.prefix + infos.name)
                .setDescription(infos.description)
                .setColor(infos.color)
                if(infos.alias) {
                    let alias = ""
                    for(let a of infos.alias) {
                        alias+=settings.prefix + a +'\n'
                    }
                    embed.addField('Alias', alias)
                }
                if(infos.arguments) {
                    embed.addField('Arguments', infos.arguments)
                }
                embed.addField('Owners only ?', infos.ownersOnly)
                e.reply(embed)
                return
            }
        }

        //Sinon, donner la liste des commandes
        for(let cmd in commands) {
            let command = commands[cmd]
            if(!command.active) continue

            let name = commands[cmd].name
            cmdByTypes[command.type].push(name)
        }

        let embed = new vars.discord.MessageEmbed()
        .setTitle('Command List:')
        .setColor(this.color || "RANDOM")
        .setThumbnail(vars.assets.images.help)

        for(let type in cmdByTypes) {
            let cmds = ""
            for(let cmd of cmdByTypes[type]) {
                cmds+=settings.prefix + cmd + "\n"
            }
            embed.addField(type, cmds, true)
        }

        e.reply(embed)
    }
}