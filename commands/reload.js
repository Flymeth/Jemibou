let exe = require('child_process')

// need more support (has a lot of errors)
module.exports = {
    name: "reload",
    alias: ["restart"],
    description: "reload bot's commands",
    ownersOnly: true,
    active: false,
    type: "dangerous",
    color: "#000",
    deleteCommand: false,
    permissions: {
        bot: [],
        user: []
    },
    run: async (e, vars, args, settings) => {
        let embed = new vars.discord.MessageEmbed()
        .setTitle('Reloaded!')
        .setColor("#F3CA22")
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
        
        await vars.log('Bot reloaded', "#F3CA22", "STATUS");
        await e.react('♻')
        await vars.client.destroy()
        exe.exec("node main.js", (err, e) => {
            if(err) {
                vars.log(err, vars.configs.invalid, "ERROR")
            }
            vars.log(e, vars.configs.valid)
        })
    }
}