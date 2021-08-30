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
            "Invite me on your server": `[Click here](https://discord.com/api/oauth2/authorize?client_id=${vars.client.user.id}&permissions=8&scope=bot%20applications.commands)`,
            "Support server": `[Click here](${vars.configs.supportGuildLink})`,
            "Top.gg page": `[Click here](https://top.gg/bot/${vars.client.user.id})`,
            "Discord list page": `[Click here](https://dscrdly.com/b/jemibou)`,
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