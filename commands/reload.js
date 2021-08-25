const { change } = require('../tools/changeStatusMessage')
const {getCommands, getEvents} = require('../tools/getModules')

// doesn't working
module.exports = {
    name: "reload",
    alias: ["restart"],
    description: "reload bot's commands",
    ownersOnly: true,
    active: false,
    type: "owner only",
    color: "#0077e6",
    deleteCommand: false,
    permissions: {
        bot: [],
        user: []
    },
    run: async (e, vars, args, settings) => {
        vars.commands = getCommands(vars)
        vars.events = getEvents(vars)

        await change("Reloaded!", "#F3CA22", vars)
        await e.react("♻")

    }
}