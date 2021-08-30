module.exports = {
    name: "poll",
    alias: ["survey"],
    description: "Make a poll!",
    ownersOnly: false,
    active: true,
    type: "usefull",
    color: "#b60bf4",
    arguments: "<\"your question\"> <\"option 1\"> <\"option 2\"> [\"option 3\"]... (max: 9)",
    deleteCommand: true,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        let content = args.join(vars.configs.argumentsSeparator)

        args = content.split('\\"').join(Infinity).split('"')

        let newArgs = []
        for(let a in args) {
            if(a%2==0 || !args[a]) continue
            newArgs.push(args[a].split(Infinity).join('"'))
        }
        args = newArgs

        const pool = args.shift()
        if(!pool) return e.reply("You need to indicate a pool question inside some quotes!")
        if(!args || args.length < 2 || args.length > 9) return e.reply("Please indicate between 2 and 9 options for the pool!")

        const embed = vars.newEmbed()
        .setAuthor("New poll by " + e.author.username + ":", e.author.avatarURL({size: 1024, dynamic: true}))
        .setDescription(pool)
        .setFooter("React with the reactions bellow to participate to the pool!")

        const emojiArray = [
            "1️⃣",
            "2️⃣",
            "3️⃣",
            "4️⃣",
            "5️⃣",
            "6️⃣",
            "7️⃣",
            "8️⃣",
            "9️⃣"
        ]

        for(let option in args) {
            embed.addField(`Option ${emojiArray[option]}:`, "> " + args[option])
        }

        e.channel.send(embed).then(msg => {
            
            for(let nb in args) {
                msg.react(emojiArray[nb])
            }

        })
    }
}