module.exports = {
    name: "randomUser",
    alias: ["ru"],
    description: "Gives you a random guild's user",
    ownersOnly: false,
    active: true,
    type: "usefull",
    color: "#FA22B8",
    deleteCommand: true,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args) => {
        let randomNumber = Math.floor(Math.random() * e.guild.memberCount)
        let members = []
        e.guild.members.cache.map(m => {
            members.push(m)
        })
        let chooseone = members[randomNumber]

        let embed = new vars.discord.MessageEmbed()
        .setTitle("And the chooseone is...")
        .setDescription("<@" + chooseone + '> !')
        .setColor(e.guild.members.cache.get(chooseone.id).roles.highest.color || "RANDOM")

        e.channel.send(embed)
    }
}