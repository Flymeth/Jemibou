module.exports = {
    name: "search",
    alias: ["s"],
    description: "Search google, wikipedia and github result directly from one command",
    ownersOnly: false,
    active: true,
    type: "usefull",
    color: "#3b6991",
    arguments: "<google | wikipedia  | github> <query>",
    deleteCommand: false,
    permissions: {
        bot: [],
        user: []
    },
    run: async (e, vars, args, settings) => {
        const type = args.shift()
        if(!type) return e.reply("Please indicate what type of research you want to make.")
        try {
            var engine = require('./search/' + type)
        } catch (err) {
            return e.reply("This is not a search engine!")
        }
        const query = args.join(' ')
        if(!query) return e.reply("*\*EMPTINESS\**")
        const result = await engine.search(args.join(' '))
        if(!result) return e.reply("No result for:\n> ```" + query + "```")

        const embed = vars.newEmbed()
        .setAuthor("Result of your search:", e.author.displayAvatarURL({dynamic: true, size: 1024, type: "png"}))
        for(const res of result) {
            embed.addField(res.title + " " + ("⭐".repeat(res.stars ? parseInt(res.stars) : 0)), '> [ACCESS](' + (res.link || `https://github.com/${res.author}/${res.title}`) + ' "' + res.title + '")\n```' + (res.description || res.descriptions) + '```')
        }

        return e.channel.send(embed)
    }
}