module.exports = {
    name: "stop",
    alias: ["destroy", "end"],
    description: "Turn off the bot",
    ownersOnly: true,
    active: true,
    type: "dangerous",
    color: "#000",
    permissions: {
        bot: [],
        user: []
    },
    run: async (e, vars, args, settings) => {
        await e.react('💤')
        let embed = new vars.discord.MessageEmbed()
        .setTitle('Turned off!')
        .setColor(vars.configs.colors.invalid)
        .setTimestamp()

        clearInterval(vars.statusInterval)

        try {
            for(let channel of vars.configs.channels.status) {
                let c = vars.client.channels.cache.get(channel)
                if(!c || !c.isText()) continue
                c.send(embed)
            }
        } catch (err) {
            vars.log(err);
        }
        
        await vars.log('Bot turned to off', vars.configs.colors.invalid, "STATUS");
        await vars.server.stopSrv()
        await vars.client.destroy()
    }
}