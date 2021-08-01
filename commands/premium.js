module.exports = {
    name: "premium",
    alias: ["vip", "vip+", "alpha", "omega"],
    description: "Get informations about premium ranks",
    ownersOnly: false,
    active: false,
    type: "informations",
    color: "#ffdf0f",
    deleteCommand: false,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        e.reply('This command is in-dev!')
    }
}