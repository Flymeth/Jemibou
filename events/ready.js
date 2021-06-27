module.exports = {
    name: "ready",
    description: "When the bot is connect",
    active: true,
    run: async function (e, vars) {
        let embed = new vars.discord.MessageEmbed()
        .setTitle('Turned on!')
        .setColor(vars.configs.colors.valid)
        .setTimestamp()

        try {
            for(let channel of vars.configs.channels.status) {
                await vars.client.channels.cache.get(channel).send(embed)
            }
        } catch (err) {
            console.log(err);
        }

        vars.client.user.setActivity("connected!", {type: "WATCHING"})
        console.log(`connected as ${vars.client.user.tag}! (version ${vars.package.version})`);
    }
}