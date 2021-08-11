module.exports = {
    name: "pool",
    alias: [],
    description: "Make a pool!",
    ownersOnly: false,
    active: true,
    type: "usefull",
    color: "#b60bf4",
    arguments: "<\"your question\"> <emote_1> <emote_2> [emote_3] ...",
    deleteCommand: true,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        let content = args.join(vars.configs.argumentsSeparator)

        args = content.split('\\"').join(Infinity).split('"')
        while(args[0] === "") args.shift()

        const pool = args.shift()
        if(!pool) return e.reply("You need to indicate a pool question inside some quotes!")
        
        content = args.join('"')
        const countainEmoji = /\p{Emoji}/u
        const emojis = content.split(' ').filter(e => e.length == 2 && countainEmoji.test(e))
        
        if(!emojis || emojis.length < 2) return e.reply("You need to indicate 2 or more emote to react!")

        const embed = vars.newEmbed()
        .setTitle("Pool created by " + e.member.displayName + ":")
        .setDescription(pool)
        .setFooter("React with the reactions bellow to participate to the pool!")

        e.channel.send(embed).then(p => {
            for(let e of emojis) {
                if(!e) continue
                try {
                    p.react(e)
                } catch (err) {
                    vars.log(err)
                }
            }
        })
    }
}