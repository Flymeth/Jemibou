const help = require('./games/_help')
const getHelpMsg = "help"
const {check} = require('../tools/checkPremium')
module.exports = {
    name: "game",
    alias: ["play"],
    description: "Play games with the bot!",
    ownersOnly: false,
    active: true,
    type: "fun",
    color: "#0acdcd",
    arguments: "[GAME_NAME] | [\"" + getHelpMsg + "\" <GAME_NAME>]",
    deleteCommand: false,
    premium: "beta",
    permissions: {
        bot: [],
        user: []
    },
    run: async (e, vars, args, settings) => {
        const needHelp = args[0] === getHelpMsg
        if(needHelp) args.shift()
        const gameName = args.join(' ')
        if(!gameName || gameName.includes(getHelpMsg)) return help.run(e, vars, settings)

        try {
            var game = require('./games/' + gameName)
        } catch (err) {
            vars.log(err)
            return e.reply("This game is not available...").then(msg => vars.setEndMessage(msg, "🎰"))
        }

        if(needHelp) {
            help.run(e, vars, settings, game)
        }else {
            if(game.premium) {
                let canDoCommand = await check(game.premium, vars, e.author)
                if(!canDoCommand) return e.reply("This command need to have a `" + command.premium + "` rank!")
            }
            game.start(e, vars, settings)
        }
    }
}