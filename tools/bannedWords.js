module.exports = {
    name: 'bannedWords',
    description: 'Check if the message countain a banned word',
    run: (e, vars, args, bannedWords) => {
        for(let word of args) {
            for(let banned of bannedWords) {
                for(let w of banned.split(' ')) {
                    if(word.toLowerCase() === w.toLowerCase()) {
                        let embed = new vars.discord.MessageEmbed()
                        .setTitle("Don't have a bad language!")
                        .setAuthor(e.author.username + "!!!")
                        .setDescription(`"${word}" is not a valid word in the server! Please be carefull next time :)`)
                        .setColor(vars.configs.colors.invalid)
        
                        return e.reply(embed)
                    }
                }
            }
        }
    }
}