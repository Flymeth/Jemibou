module.exports = {
    name: "help",
    description: "Understand how the bot's settings works",
    needPerms: false,
    run: async (e, vars, args, settings) => {
        let embed = new vars.discord.MessageEmbed()
        .setTitle('How it works ?')
        .setDescription(`
        > First, generate a channel with \`${settings.prefix}settings generate\` (you can also use \`${settings.prefix}settings set <channel>\`)
        > Then, in this channel you'll send every settings you want to change.
        > 
        > Ex. You want to change the bot's prefix, so you send in this channel:
        \`\`\`prefix="/"\`\`\`
        *To view each settings that you can change, you can use \`${settings.prefix}settings list\` command.*

        ||Don't forget: the setting's name is before the "=" and the value of this setting is after the "=" and inside quotes!||
        `)
        .setColor('RANDOM')
        e.reply(embed)
    }
}