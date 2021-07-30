module.exports = {
    name: "infos",
    alias: ["informations", "getinfos"],
    description: "Get informations about a server, a channel, a role or a member",
    ownersOnly: false,
    active: true,
    type: "usefull",
    color: "#00b0b3",
    arguments: "<server> | <channel <[channel_mention] | [channel_id] | [channel_name]>> | <role [role_mention] | [role_name] | [role_id]>",
    deleteCommand: false,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        let type = args.shift()
        if(!type) return e.reply('You need to indicate a type (server, channel, role or user)')

        try {
            var command = require('./infos/' + type)
        } catch (err) {
            vars.log(err)
            return e.reply('Invalid command argument!')
        }

        try {
            command.run(e, vars, args, settings)
        } catch (err) {
            vars.log(err)
            return e.reply('An error has occured...')
        }
    }
}