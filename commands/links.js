module.exports = {
    name: "links",
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
            "Invite me on your server": `[Click to access](https://discord.com/api/oauth2/authorize?client_id=${vars.client.user.id}&permissions=8&scope=bot%20applications.commands)`,
            "discord support server": `[click to access](https://discord.gg/B6cGv6hyHR)`,
            "Top.gg page": `[Click to view my top.gg page](https://top.gg/bot/${vars.client.user.id})`,
            "Discord list page": `[Click to view my discord list page](https://dscrdly.com/b/jemibou)`,
            "Github repository": "https://github.com/Flymeth/jemibou",
            "Website": "http://jemibou.tk"
        }

        for(let owner of vars.configs.owners) {
            if(!informations.author) informations.author = ""
            if(informations.author) informations.author += " & "
            informations.author += vars.client.users.cache.get(owner).tag
        }

        let embed = vars.newEmbed()
        .setAuthor("This is my informations:", vars.client.user.avatarURL())
        .setThumbnail(vars.assets.images.informations)
        for(let info in informations) {
            embed.addField("__" + info + ":__", "> " + informations[info])
        }

        e.channel.send(embed)
    }
}