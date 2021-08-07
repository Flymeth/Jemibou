module.exports = {
    name: "chifumie",
    description: "(Or Rock Paper Scissor)\n> A famous chance game! The rock beats the scissor, the scissor beats the paper who beats the rock!",
    help: "When you start this game, the bot will send an embed with 3 reactions: the rock, the paper and the scissor. React with one of them and see if you beat the bot!",
    start: (e, vars, settings) => {

        const emoji = [
            {
                "id": 0,
                "emoji": "📜",
                "name": "Paper"
            },
            {
                "id": 1,
                "emoji": "🗻",
                "name": "Rock"
            },
            {
                "id": 2,
                "emoji": "✂",
                "name": "Scissors"
            }
        ]

        const messageToDelete = e

        const embed = vars.newEmbed()
        .setDescription("Click on a reaction to choose it!")
        for(let e in emoji) {
            embed.addField(emoji[e].emoji, emoji[e].name)
        }

        e.channel.send(embed).then(message => {
            for(let e in emoji) {
                message.react(emoji[e].emoji)
            }

            e.client.on('messageReactionAdd', (reaction, user) => {
                if(
                    user.bot
                    || user.id !== e.author.id
                    || reaction.message.id !== message.id
                ) return

                for(let e in emoji) {
                    if(emoji[e].emoji === reaction.emoji.name) {
                        let chosenEmoji = emoji[e].id
                        let botEmoji = Math.floor(Math.random() * 3)

                        const won = checkWin(chosenEmoji, botEmoji)
                        
                        if(!won) {
                            embed.setTitle("It's a tie !")
                            embed.setDescription("You both did `" + emoji[e].name + "`")
                        }else {
                            embed.setDescription("You choose `" + emoji[e].name + "` and the bot choose `" + emoji[botEmoji].name + "` !")
                        }
                        if(won === "user") {
                            embed.setTitle('You won!')
                            embed.setColor(vars.configs.colors.valid)
                        }else if (won === "bot") {
                            embed.setTitle('You lose!')
                            embed.setColor(vars.configs.colors.invalid)
                        }

                        delete embed.fields

                        message.reactions.removeAll()

                        return message.edit(embed)
                    }
                }

            })
        })
    }
}

function checkWin(user, bot) {
    if(user === bot) return undefined

    const wonByUser = (user === 0 && bot === 1) || (user === 1 && bot === 2) || (user === 2 && bot === 0)
    if(wonByUser) return "user"
    else return "bot"
}