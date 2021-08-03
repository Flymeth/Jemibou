const fs = require('fs')

module.exports = {
    name: "help",
    description: "Get help about the game system or a specific game",
    /**
     * A help function
     * @param {Object} game The specific game information
     */
    run: (e, vars, settings, game) => {
        try {
            var games = fs.readdirSync('./commands/games/', {encoding: 'utf-8'})
        } catch (err) {
            vars.log(err)
            return e.reply('Oups... there are a little error :(').then(msg => vars.setEndMessage(msg, "😿"))
        }

        let gameList = []
        for(let game of games) {
            if(game.startsWith('_') || !game.endsWith('.js')) continue
            gameList.push(require('./' + game))
        }

        if(!game) {
            if(!gameList.length) return e.reply("There is no game for now...").then(msg => vars.setEndMessage(msg, "🃏"))

            const embed = vars.newEmbed()
            .setTitle("This is the available games:")
            for(let game of gameList) {
                embed.addField(game.name + (game.premium ? " (`" + game.premium + "`)" : ""), game.description + "\n*Start it by using `" + settings.prefix + "game " + game.name + "`*")
            }
            e.channel.send(embed)
        }else {

            const embed = vars.newEmbed()
            .setTitle("How to play `" + game.name + "` ?")
            .setDescription(game.help)

            e.channel.send(embed)

        }
    }
}