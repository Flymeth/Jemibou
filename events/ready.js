let {next} = require('../tools/status')
module.exports = {
    name: "ready",
    description: "When the bot is connect",
    active: true,
    run: async (e, vars) => {
        vars.saveLog()

        vars.client.user.setActivity("try to wake up...", {type: "PLAYING"})

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
        
        vars.log(`connected as ${vars.client.user.tag}! (version ${vars.package.version})`, vars.configs.colors.valid, "STATUS");

        vars.statusInterval = setInterval(async () => {
            let settedStatus = await next(vars)
            if(!settedStatus) {
                vars.log(`error to set status!`, vars.configs.colors.invalid, "ERROR")
            }
        }, vars.configs.statusInterval);
    }
}