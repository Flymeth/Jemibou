module.exports = {
    name: "infos",
    alias: ["informations", "ping"],
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
            "invite link": `https://discord.com/api/oauth2/authorize?client_id=${vars.client.user.id}&permissions=8&scope=bot`
        }

        for(let owner of vars.configs.owners) {
            if(!informations.author) informations.author = ""
            if(informations.author) informations.author += " & "
            informations.author += vars.client.users.cache.get(owner).tag
        }

        let embed = new vars.discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor("This is my informations:", vars.client.user.avatarURL())
        .setThumbnail(vars.assets.images.informations)
        for(let info in informations) {
            embed.addField("__" + info + ":__", "> " + informations[info])
        }

        e.channel.send(embed)
    }
}