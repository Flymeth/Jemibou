module.exports = {
    name: "clear",
    alias: ["clean", "erase"],
    description: "Clear some messages in the current channel",
    ownersOnly: false,
    active: true,
    type: "moderation",
    color: "#2FD0EA",
    arguments: "<number>",
    deleteCommand: true,
    permissions: {
        bot: ["MANAGE_MESSAGES"],
        user: ["MANAGE_MESSAGES"]
    },
    run: async (e, vars, args, settings) => {
        if(!args[0] || isNaN(args[0]) || args[0]<=0 || args[0]>100) return e.reply('Please indicate a valid number (>0 and <100)!')

        if(!e.channel.messages.cache.size) return e.reply('there isn\'t any messages to delete...')

        let messagesDeleted;
        try {
            await e.channel.bulkDelete(args[0]).then(m => messagesDeleted = m.size)
        } catch (err) {
            vars.log(err, vars.configs.colors.invalid);

            let embed = new vars.discord.MessageEmbed()
            .setTitle('ERROR')
            .setColor(vars.configs.colors.invalid)
            .setDescription('An error has occured. The reasons can be:')
            .addField('To many messages', 'Discord limits the messages suppretion at max 100 per weeks')
            .addField('Messages too old', 'Discord blocks the message suppretion that are under 14 days old')
            .addField('Other', 'The error can be cause of the developper. If is that, he has been triggered!')

            return e.reply(embed)
        }

        e.reply(`I've deleted ${messagesDeleted || args[0]} message(s)!`).then(msg => {
            vars.setEndMessage(msg, "💥")
        })
    }
}