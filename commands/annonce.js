module.exports = {
    name: "annonce",
    alias: [],
    description: "Annonce a message to every server owner where the bot is",
    ownersOnly: true,
    active: true,
    type: "owner only",
    color: "#9d08b4",
    arguments: "<message>",
    deleteCommand: false,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        const servers = vars.client.guilds.cache
        let ownerSentID = []
        servers.forEach(server => {
            let canSend = true
            for(let owner of ownerSentID) {
                if(owner === server.ownerID) {
                    canSend = false
                    break
                }
            }
            if(canSend) {
                let embed = vars.newEmbed()
                .setTitle("A message from " + e.author.tag + " (a bot owner):")
                .setDescription(args.join(' '))
                .setTimestamp()
    
                try {
                    server.owner.send(embed)
                    ownerSentID.push(server.ownerID)
                } catch (err) {
                    vars.log(err)
                }
            }
        })

        vars.log(e.author.tag + " made an annonce: " + args.join(' '), "RANDOM", "ANNONCES")
        vars.setEndMessage(e, "✅")
    }
}