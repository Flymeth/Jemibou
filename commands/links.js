module.exports = {
    name: "bot",
    alias: ["bot", "ping"],
    description: "Get the bot's information",
    ownersOnly: false,
    active: true,
    type: "informations",
    color: "#13D7A3",
    deleteCommand: false,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        let informations = {
            version: vars.package.version,
            ping: vars.client.ws.ping + 'ms',
            "invite link": `[click here to add me](https://discord.com/api/oauth2/authorize?client_id=${vars.client.user.id}&permissions=8&scope=bot)`,
            "discord support server": `[click here to join it](https://discord.gg/B6cGv6hyHR)`,
            "top.gg page": `[click here to view ${vars.client.user.username}'s top.gg page](https://top.gg/bot/${vars.client.user.id})`,
            "github repo": "https://github.com/Flymeth/jemibou"
        }

        for(let owner of vars.configs.owners) {
            if(!informations.author) informations.author = ""
            if(informations.author) informations.author += " & "
            informations.author += vars.client.users.cache.get(owner).tag
        }

        let embed = new vars.discord.MessageEmbed()
        .setColor(this.color || "RANDOM")
        .setAuthor("This is my informations:", vars.client.user.avatarURL())
        .setThumbnail(vars.assets.images.informations)
        for(let info in informations) {
            embed.addField("__" + info + ":__", "> " + informations[info])
        }

        e.channel.send(embed)
    }
}