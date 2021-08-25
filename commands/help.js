const fs = require('fs')
module.exports = {
    name: "help",
    alias: ["h"],
    description: "Get help about the bot commands",
    ownersOnly: false,
    active: true,
    type: "informations",
    color: "RANDOM",
    arguments: "[command name]",
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        const {commands} = vars

        // Si ya un args[0] & que cet args[0] est une commande: donner plus d'infos sur celle-ci
        if(args[0]) {
            const cmdName = args.shift()
            const infos = commands.find((cmd) => {
                if (cmd.name.toLowerCase() === cmdName.toLowerCase()) return true;
                for (let alias of cmd.alias) {
                    if (alias.toLowerCase() === cmdName.toLowerCase()) return true;
                }
            });

            if(infos) {
                let embed = new vars.discord.MessageEmbed()
                .setTitle(settings.prefix + infos.name)
                .setDescription(infos.description)
                .setColor(infos.color)
                if(infos.alias.length>0) {
                    let alias = ""
                    for(let a of infos.alias) {
                        alias+=settings.prefix + a +'\n'
                    }
                    embed.addField('Alias', alias)
                }
                if(infos.arguments) {
                    embed.addField('Usage:', '```' + settings.prefix + infos.name + ' ' + infos.arguments + '```')
                }
                if(infos.premium) {
                    embed.addField('Need rank', infos.premium)
                }
                embed.addField('Owners only ?', infos.ownersOnly)
                e.reply(embed)
                return
            }
        }

        //Sinon, donner la liste des commandes
        let cmdByTypes = {}
        for(let command of commands) {
            const type = command.type
            const name = command.name

            if(!cmdByTypes[type]) cmdByTypes[type] = [name]
            else cmdByTypes[type].push(name)
        }

        let embed = vars.newEmbed()
        .setTitle('Command List:')
        .setThumbnail(vars.assets.images.help)
        .setFooter('To get more detail on a command, use ' + settings.prefix + 'help <command>')
        for(let type in cmdByTypes) {
            let cmds = ""
            for(let cmd of cmdByTypes[type]) {
                const cmdInformations = commands.find(c => c.name.toLowerCase() === cmd.toLowerCase())
                cmds+= '`' + settings.prefix + cmd + '`' + (cmdInformations.premium ? ' *(**' + cmdInformations.premium + '**)*' : '') + "\n"
            }
            embed.addField(type, cmds, true)
        }

        e.reply(embed)
    }
}