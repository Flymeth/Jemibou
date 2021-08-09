module.exports = {
    name: "say",
    alias: [],
    description: "Say something as the bot!",
    ownersOnly: false,
    active: true,
    type: "fun",
    color: "#D8CB0A",
    arguments: "<message>",
    deleteCommand: true,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        e.channel.send(args.join(' '))
    }
}