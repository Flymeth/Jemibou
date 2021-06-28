module.exports = {
    name: "ready",
    description: "When the bot is connect",
    active: true,
    run: (e, vars) => {
        let embed = new vars.discord.MessageEmbed()
        .setTitle('Turned on!')
        .setColor(vars.configs.colors.valid)
        .setTimestamp()

        try {
            for(let channel of vars.configs.channels.status) {
                vars.client.channels.cache.get(channel).send(embed)
            }
        } catch (err) {
            console.log(err);
        }

        vars.client.user.setActivity("connected!", {type: "WATCHING"})
        vars.log(`connected as ${vars.client.user.tag}! (version ${vars.package.version})`, vars.configs.colors.valid);
    }
}