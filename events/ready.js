module.exports = {
    name: "ready",
    description: "When the bot is connect",
    active: true,
    run: (e, vars) => {

        vars.saveLog()

        let embed = new vars.discord.MessageEmbed()
        .setTitle('Turned on!')
        .setColor(vars.configs.colors.valid)
        .setTimestamp()

        try {
            for(let channel of vars.configs.channels.status) {
                let c = vars.client.channels.cache.get(channel)
                if(!c || !c.isText()) continue
                c.send(embed)
            }
        } catch (err) {
            vars.log(err);
        }

        vars.client.user.setActivity("connected!", {type: "WATCHING"})
        vars.log(`connected as ${vars.client.user.tag}! (version ${vars.package.version})`, vars.configs.colors.valid, "STATUS");
    }
}