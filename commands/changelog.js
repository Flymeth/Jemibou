const fs = require('fs')
module.exports = {
    name: "changelog",
    alias: ["cl"],
    description: "Get information about the lastest version of the bot",
    ownersOnly: false,
    active: true,
    type: "informations",
    color: "#FFD800",
    deleteCommand: false,
    permissions: {
        bot: [],
        user: []
    },
    run: (e, vars, args, settings) => {
        try {
            var cl = fs.readFileSync(vars.configs.log.changelogPath, {encoding: 'utf-8'})
        } catch (err) {
            return vars.log(err)
        }

        let currentVersionCL = cl.toString().split('---').find(txt => txt.includes("# " + vars.package.version))

        if(!currentVersionCL) return e.reply('There is no changelog for this version!')

        e.channel.send("```md\n" + currentVersionCL.split('> ').join('') + "```")
    }
}