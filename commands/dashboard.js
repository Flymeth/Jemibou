module.exports = {
    name: "dashboard",
    alias: [],
    description: "Get your dashboard's link.",
    ownersOnly: false,
    active: true,
    type: "usefull",
    color: "#5a0fc2",
    deleteCommand: false,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        e.reply("Your dashboard is here: http://jemibou.tk/dashboard?guild=" + e.guild.id)
    }
}