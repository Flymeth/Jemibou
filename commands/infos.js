const {check} = require('../tools/checkPremium')
const fs = require('fs')
const {getSettings} = require('../commands/settings')
module.exports = {
    name: "infos",
    alias: ["informations", "getinfos"],
    description: "Get informations about a server, a channel, a role or a member",
    ownersOnly: false,
    active: true,
    type: "usefull",
    color: "#00b0b3",
    arguments: "<server> | <channel <[channel_mention] | [channel_id] | [channel_name]>> | <role <[role_mention] | [role_name] | [role_id]>> | <user <[user_mention] | [user_id] | [user_username] | [user_nickname]>>",
    deleteCommand: false,
    permissions: {
        bot: [],
        user: []
    },
    run: async(e, vars, args, settings) => {
        let type = args.shift()
        if(!type) {
            try {
                var commands = fs.readdirSync('./commands/infos', {encoding: 'utf-8'})
            } catch (err) {
                return vars.log(err, vars.configs.colors.invalid, "ERROR")
            }

            const settings = await getSettings(e.guild.id, vars)

            let embed = vars.newEmbed()
            .setDescription('Infos commands list')
            for(let command of commands) {
                const cmd = require('./infos/' + command)
                embed.addField(settings.prefix + 'infos ' + command.replace('.js', '') + (cmd.premium ? ' (`' + cmd.premium + '`)': ''), `Get information about a ${command.replace('.js', '')}`)
            }

            return e.channel.send(embed)
        }

        try {
            var command = require('./infos/' + type)
        } catch (err) {
            vars.log(err)
            return e.reply('Invalid command argument!')
        }

        if(command.premium) {
            const premium = await check(command.premium, vars, e.author)
            if(!premium) return e.reply("You need to have the `" + command.premium + "` role on the support server!")
        }

        try {
            command.run(e, vars, args, settings)
        } catch (err) {
            vars.log(err)
            return e.reply('An error has occured...')
        }
    }
}