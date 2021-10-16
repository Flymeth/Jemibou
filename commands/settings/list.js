const {getSettings} = require('../settings')
module.exports = {
    name: "list",
    description: "Settings' list",
    needPerms: {
        user: ["MANAGE_GUILD"]
    },
    run: async (e, vars, args) => {
        let settings = vars.settings

        const notationsCaracts = {
            "variables": {
                "emoji": "🔢",
                "description": "You can use the 'in-command' variables"
            },
            "isParagraph": {
                "emoji": "📜",
                "description": "Each arguments need to be inside double quotes (`\"\"`) (Note: if you want to use quotes in your argument, use an back-slash before the quote (`\\\"`))"
            }
        }

        let embed = vars.newEmbed()
        .setTitle('Settings list:')

        let settingValue = await getSettings(e.guild.id, vars)

        for(let set in settings) {
            let setting = settings[set]
            if(!setting.modifiable) continue
            let actually = settingValue[set]
            if(actually === undefined) actually = setting.value
            if(actually === undefined || actually.length === 0) actually = "unset"

            let extra = ""
            for(let note in notationsCaracts) {
                if(setting[note]) extra += notationsCaracts[note].emoji
            }

            if(extra) extra += " - "
            
            if(actually.length > 256) actually = actually.substr(0,240 - (set.length + extra.length)) + ' [...]'
            embed.addField(extra + '__' + set + '__', "*" + setting.desc + "*\n```" + actually + '```')
        }

        let notations = '__Notations:__'

        for(let note in notationsCaracts) {
            notations += "\n" + notationsCaracts[note].emoji + " - " + notationsCaracts[note].description
        }

        notations += "\n\n__In command variables:__"
        let variables = vars.configs.settings.variables
        for(let variable in variables.list) {
            notations += `\n> \`${variables.start}${variable}${variables.end}\` => *${variables.list[variable]}*`
        }

        e.reply(notations, {embed})
    }
}