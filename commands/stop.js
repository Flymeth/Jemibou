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
    run: async (e, vars, args) => {
        await e.react('💤')
        let embed = new vars.discord.MessageEmbed()
        .setTitle('Turned off!')
        .setColor(vars.configs.colors.invalid)
        .setTimestamp()

        try {
            for(let channel of vars.configs.channels.status) {
                vars.client.channels.cache.get(channel).send(embed)
            }
        } catch (err) {
            console.log(err);
        }
        
        await vars.log('Bot turned to off', vars.configs.colors.invalid, "STATUS");
        await vars.client.destroy()
    }
}