module.exports = {
    name: "premium",
    alias: ["vip", "vip+", "alpha", "omega"],
    description: "Get informations about premium ranks",
    ownersOnly: false,
    active: true,
    type: "informations",
    color: "#ffdf0f",
    deleteCommand: false,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        let embed = vars.newEmbed()
        .setTitle('Why some commands is premium ?')
        .setDescription("Premium ranks help me to continue to update the bot! When you buying a premium rank, i see it, and it gives me a lot of motivation to continue to make the bot better and better.")
        .addField('There is 4 premium ranks:', "`vip`\n`vip+`\n`alpha`\n`omega`")
        .addField("Get more informations", 'To know premium ranks adventages and there prices, please go on the support discord server by [clicking here](https://discord.gg/B6cGv6hyHR)')
        // .setColor(e.guild.me.displayColor || this.color || "RANDOM")

        e.channel.send(embed)
    }
}