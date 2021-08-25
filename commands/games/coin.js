module.exports = {
    name: "coin",
    description: "Choose heads or tails and see if you won!",
    help: "React on the heads or tails' reactions then see if you won!",
    start: async (e, player, vars, settings) => {

        const reactions = {
            "⚫": "heads",
            "⚪": "tails"
        }

        const embed = e.embeds[0]
        for(let emoji in reactions) {
            embed.addField("React with " + emoji, "to chose '" + reactions[emoji] + "'!")
        }

        e.edit(embed)
        
        for(let react in reactions) {
            await e.react(react)
        }
        
        const botFace = Math.floor(Math.random() * 2) ? "heads" : "tails"

        vars.client.on("messageReactionAdd", (reaction, user) => {
            if (
                user.bot ||
                user.id !== player.id ||
                reaction.message.id !== e.id ||
                !reactions[reaction.emoji.name]
            ) return

            const userFace = reactions[reaction.emoji.name]

            if(userFace === botFace) {
                embed.setTitle("GG!")
                .setDescription("The face was well " + botFace + " !")
                .setColor(vars.configs.colors.valid)
            }else {
                embed.setTitle("Aie...")
                .setDescription("The face was " + botFace + " !")
                .setColor(vars.configs.colors.invalid)
            }

            delete embed.fields
            e.reactions.removeAll()

            e.edit(embed)
        });
    }
}