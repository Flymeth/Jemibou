module.exports = {
    name: "stop",
    alias: ["destroy", "end"],
    description: "Turn off the bot",
    ownersOnly: true,
    active: true,
    type: "dangerous",
    color: "#000",
    permissions: {
        bot: [],
        user: []
    },
    run: async (e, vars, args) => {
        await e.react('💤')
        await vars.client.destroy()
        console.log('Bot turned to off');
    }
}