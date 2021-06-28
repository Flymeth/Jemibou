let exe = require('child_process')
module.exports = {
    name: "reload",
    alias: ["restart"],
    description: "reload bot's commands",
    ownersOnly: true,
    active: true,
    type: "dangerous",
    color: "#000",
    arguments: "<ARGS> [ARGS]",
    deleteCommand: false,
    permissions: {
        bot: [],
        user: []
    },
    run: async (e, vars, args) => {
        let embed = new vars.discord.MessageEmbed()
        .setTitle('Reloaded!')
        .setColor("#F3CA22")
        .setTimestamp()

        try {
            for(let channel of vars.configs.channels.status) {
                vars.client.channels.cache.get(channel).send(embed)
            }
        } catch (err) {
            console.log(err);
        }
        
        await vars.log('Bot reloaded', "#F3CA22");
        await e.react('♻')
        await vars.client.destroy()
        exe.exec("node main.js")
    }
}