const help = require('./games/_help')
const {check} = require('../tools/checkPremium')
const startGameReaction = "⚡"
module.exports = {
    name: "game",
    alias: [],
    description: "Play games with the bot!",
    ownersOnly: false,
    active: true,
    type: "fun",
    color: "#2c6ca0",
    arguments: "<game_name>",
    deleteCommand: false,
    premium: "beta",
    permissions: {
        bot: ["MANAGE_MESSAGES"],
        user: []
    },
    run: async (e, vars, args, settings) => {

        const gameName = args.shift()

        if(!gameName) return help.run(e, vars, settings)

        try {
            var game = require('./games/' + gameName)
        } catch (err) {
            vars.log(err)
            return e.reply("This game is not available...").then(msg => vars.setEndMessage(msg, "🎰"))
        }

        // if it's a premium game: check if this user is premium
        let canPlayGame = true
        if(game.premium) {
            canPlayGame = await check(game.premium, vars, e.author)
        }
        
        const embed = vars.newEmbed()
        .setTitle(game.name)
        .setDescription(game.description)
        .addField("Usage:", game.help)

        // If it's a premium game & the user hasn't the needed rank
        if(!canPlayGame) {
            embed.setFooter("This game is only available for `" + game.premium + "` users! Use `" + settings.prefix + "premium` to get more informations!")
            return e.channel.send(embed)
        }
        
        // else
        embed.setFooter("React with " + startGameReaction + " to launch this game!")
        const msg = await e.channel.send(embed)
        msg.react(startGameReaction)

        const tm = setTimeout(async () => {
            await e.delete()
            return msg.delete()
        }, vars.configs.reactionMessageTimeout);

        vars.client.on('messageReactionAdd', async (reaction, user) => {

            if(
                user.bot
                || user.id !== e.author.id
                || reaction.message.id !== msg.id
            ) return

            if(reaction.emoji.name === startGameReaction) {
                clearTimeout(tm)
                await msg.reactions.removeAll()
                for(let content in msg.embeds[0]) {  
                    if(!msg.embeds[0][content]) continue
                    
                    if(content !== "color" && typeof msg.embeds[0][content] === "string") msg.embeds[0][content] = ""
                    else if(typeof msg.embeds[0][content] === "object") {
                        if(Array.isArray(msg.embeds[0][content])) msg.embeds[0][content] = []
                        else msg.embeds[0][content] = {}
                    }

                }

                await e.delete()
                return game.start(msg, e.author, vars, settings)
            }
        })
    }
}