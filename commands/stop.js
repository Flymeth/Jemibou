const { change } = require('../tools/changeStatusMessage')

module.exports = {
    name: "stop",
    alias: ["destroy", "end"],
    description: "Turn off the bot",
    ownersOnly: true,
    active: true,
    type: "owner only",
    color: "#000",
    permissions: {
        bot: [],
        user: []
    },
    run: async (e, vars, args, settings) => {
        await e.react('💤')

        clearInterval(vars.statusInterval)

        await change("Turned off!", vars.configs.colors.invalid, vars)
        
        await vars.log('Bot turned to off', vars.configs.colors.invalid, "STATUS");
        await vars.client.destroy()
    }
}