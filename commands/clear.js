module.exports = {
    name: "clear",
    alias: ["clean", "erase"],
    description: "Clear messages in the channel",
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
    run: async (e, vars, args) => {
        if(!args[0] || isNaN(args[0])) return e.reply('Arg. #2 must be a number!')

        try {
            await e.channel.bulkDelete(args[0])
        } catch (err) {
            console.log(err);

            let embed = new vars.discord.MessageEmbed()
            .setTitle('ERROR')
            .setColor(vars.configs.colors.invalid)
            .setDescription('An error has occured. The reasons can be:')
            .addField('To many messages', 'Discord limits the messages suppretion at max 100 per weeks')
            .addField('Messages too old', 'Discord blocks the message suppretion that are under 14 days old')
            .addField('Other', 'The error can be the fault of the developper. If is that, he has been triggered!')

            return e.reply(embed)
        }

        e.reply(`I've deleted ${args[0]} message(s)!`).then(msg => {
            msg.react("💥")
            setTimeout(() => {
                msg.delete()
            }, 5000);
        })
    }
}