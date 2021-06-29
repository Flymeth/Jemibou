module.exports = {
    name: "saveLog",
    alias: [""],
    description: "Save current log in the saved folder",
    ownersOnly: true,
    active: true,
    type: "dangerous",
    color: "#4CD50F",
    deleteCommand: true,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args) => {
        // code
        let saved = vars.saveLog(true)

        if(!saved) {
            e.reply('Error! Log didn\'t saved...').then(msg => {
                vars.setEndMessage(msg, "⁉")
            })
            return
        }

        e.reply('Log saved!').then(msg => {
            vars.setEndMessage(msg, "💾")
        })
    }
}