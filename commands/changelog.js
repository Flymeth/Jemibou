const fs = require('fs')
module.exports = {
    name: "changelog",
    alias: ["cl"],
    description: "Get information about the lastest version of the bot",
    ownersOnly: false,
    active: true,
    type: "informations",
    arguments: "[version number | \"list\"]",
    color: "#16bd00",
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

        let searchVersion = args[0] || vars.package.version

        const versions = cl.toString().split('---')

        if(searchVersion.toLowerCase() === "list") {
            let embed =  vars.newEmbed()
            .setTitle('List of the versions:')
            let tooMuch = false
            for(let v of versions) {
                let splited = v.split('\n')
                while(splited[0] === ' ' || splited[0] === '\r' || splited[0] === '\n' || !splited[0]) {
                    splited.shift()
                }
                let versionNumber = splited.shift().split('# ').join('')
                if(tooMuch) {
                    embed.fields[embed.fields.length-1].value+= versionNumber + "; "
                    if(versions.indexOf(v) === versions.length-1) embed.fields[embed.fields.length-1].value+= "```"
                    continue
                }

                let versionInfos =  '```md\n' + splited.join('\n').split('> ').join('') + '```'
                embed.addField(versionNumber, versionInfos, true)
                if(embed.fields.length >= 20) {
                    tooMuch = true
                    embed.addField("Other versions:", "```")
                }
            }
            e.channel.send(embed)
        }else {
            const version = versions.find(txt => txt.includes('# ' + searchVersion))
            if(!version) return e.reply('There is no changelog for this version!')
    
            e.channel.send("```md\n" + version.split('> ').join('') + "```")
        }
    }
}