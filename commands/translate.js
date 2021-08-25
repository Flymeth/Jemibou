const translate = require('@iamtraction/google-translate')
const languages = require('@iamtraction/google-translate/src/languages')
module.exports = {
    name: "translate",
    alias: ["language"],
    description: "Translate your message! Use the command without argument to view each avaible languages.",
    ownersOnly: false,
    active: true,
    type: "usefull",
    color: "#f0f0f0",
    arguments: "[language (ex: **en**; **fr**; **es**...)] [message]",
    deleteCommand: true,
    permissions: {
        bot: ["MANAGE_MESSAGES"],
        user: []
    },
    run: async (e, vars, args, settings) => {
        if(!args[0]) {
            const embed = vars.newEmbed()
            .setTitle("Available languages:")
            let languagesList = ""
            for(let lang in languages) {
                if(typeof languages[lang] !== "string") continue
                languagesList+= '```"' + lang + '": ' + languages[lang] + '```\n'
            }
            embed.setDescription(languagesList)
            .setFooter("To use a specific language, type " + settings.prefix + "translate <language> <message>!")

            return e.channel.send(embed)
        }

        let lang = args[0]
        if(lang.includes("\n")) lang = lang.split('\n')[0]

        const translatedMSG = await translateMSG(args.join(' '), lang)
        if(!translatedMSG.text) return e.reply("You need to indicate a text!")
        const msg = "__*Message from " + e.author.toString() + ":*__\n" + translatedMSG.text

        e.channel.send(msg)
    }
}

async function translateMSG(msg, language) {
    let translation;
    try {
        translation = await translate(msg, {
            to: language
        })
    } catch (err) {
        translation = await translate(msg)
    }
    if(translation.text.startsWith(language)) translation.text = translation.text.replace(language, "")
    while(translation.text.startsWith('\n')) translation.text = translation.text.replace("\n", '')
    
    return translation
}